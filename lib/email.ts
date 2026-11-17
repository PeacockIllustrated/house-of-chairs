import "server-only";

/**
 * Owner notifications via a Make.com webhook. Best-effort: the enquiry or
 * interest is already stored in Supabase before this runs, so a failed or
 * unconfigured send never blocks the visitor. The Make scenario checks the
 * site and the shared key, then emails the notification on. Configure with:
 *   HOC_MAKE_WEBHOOK_URL  the scenario's custom webhook URL
 *   HOC_MAKE_KEY          the shared key, sent as the x-make-apikey header
 * Both are server-only; never prefix them NEXT_PUBLIC_.
 */

const WEBHOOK_URL = process.env.HOC_MAKE_WEBHOOK_URL;
const MAKE_KEY = process.env.HOC_MAKE_KEY;
const SITE = "houseofchairs.co.uk";

export type NotificationKind = "enquiry" | "interest" | "subscriber";

/** Whether owner notifications can be sent. */
export const emailConfigured = Boolean(WEBHOOK_URL && MAKE_KEY);

/**
 * Send the owner a plain-text notification. Never throws; returns whether the
 * send was attempted and accepted. `replyTo` is the visitor's address, when
 * they left one, so a reply from the inbox goes straight back to them.
 */
export async function notifyOwner(
  kind: NotificationKind,
  subject: string,
  lines: string[],
  replyTo?: { email: string; name?: string } | null,
): Promise<boolean> {
  if (!emailConfigured) return false;
  try {
    const res = await fetch(WEBHOOK_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-make-apikey": MAKE_KEY as string,
      },
      body: JSON.stringify({
        site: SITE,
        kind,
        subject,
        text: lines.join("\n"),
        replyTo: replyTo?.email ?? "",
        replyName: replyTo?.name ?? "",
      }),
      // A slow scenario must not hold the visitor's response open.
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
