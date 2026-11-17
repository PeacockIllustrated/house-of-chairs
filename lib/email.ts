import "server-only";
import { renderEmail, SHOP_EMAIL, type EmailParts } from "./emailTemplate";

/**
 * Every email the site sends goes through one Make.com scenario in the House
 * of Chairs Make account ("House of Chairs website: send email"). The site
 * renders the branded HTML (lib/emailTemplate) and posts it to the scenario's
 * webhook; the scenario checks the shared key and sends it from the sales@
 * mailbox over Easily's SMTP server. Sending from the shop's own mail server
 * is what keeps these out of spam: the domain's SPF and DKIM records already
 * vouch for it.
 *
 * Configure (server-only; never prefix NEXT_PUBLIC_):
 *   HOC_MAKE_WEBHOOK_URL  the scenario's webhook URL
 *   HOC_MAKE_KEY          the shared key the scenario checks
 */

const WEBHOOK_URL = process.env.HOC_MAKE_WEBHOOK_URL?.trim() ?? "";
const MAKE_KEY = process.env.HOC_MAKE_KEY?.trim() ?? "";
const SITE = "houseofchairs.co.uk";

export type EmailKind = "enquiry" | "interest" | "subscriber" | "reply";

/** Whether the site can send email at all. */
export const emailConfigured = Boolean(WEBHOOK_URL && MAKE_KEY);

// A plain address only. Anything with quotes, brackets, commas or spaces is
// refused rather than handed on to a mail server.
const PLAIN_ADDRESS = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isPlainAddress(s: string): boolean {
  return PLAIN_ADDRESS.test(s.trim());
}

/** One line, no control characters, so nothing can break out of a header. */
export function oneLine(s: string, max = 150): string {
  return s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

interface SendArgs {
  kind: EmailKind;
  to: string;
  subject: string;
  html: string;
  /** Where a reply should go; defaults to the shop. */
  replyTo?: string;
  /** Send the shop a blind copy, so the mailbox keeps a record. */
  copyShop?: boolean;
}

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendEmail(a: SendArgs): Promise<SendResult> {
  if (!emailConfigured) return { ok: false, reason: "not-configured" };
  if (!isPlainAddress(a.to)) return { ok: false, reason: "bad-address" };
  const replyTo =
    a.replyTo && isPlainAddress(a.replyTo) ? a.replyTo.trim() : SHOP_EMAIL;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: MAKE_KEY,
        site: SITE,
        kind: a.kind,
        to: a.to.trim(),
        subject: oneLine(a.subject),
        html: a.html,
        replyTo,
        copyShop: a.copyShop ? "yes" : "no",
      }),
      // A slow scenario must not hold the response open for long.
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? { ok: true } : { ok: false, reason: `make-${res.status}` };
  } catch {
    return { ok: false, reason: "unreachable" };
  }
}

/**
 * Tell the shop about something that came in. Best-effort and never throws:
 * the row is already stored, so a failed send never blocks the visitor.
 * `replyTo` is the visitor's address, when they left one, so pressing Reply
 * in the inbox answers them directly.
 */
export async function notifyOwner(
  kind: Exclude<EmailKind, "reply">,
  subject: string,
  parts: EmailParts,
  replyTo?: string | null,
): Promise<boolean> {
  const r = await sendEmail({
    kind,
    to: SHOP_EMAIL,
    subject,
    html: renderEmail(parts),
    replyTo: replyTo ?? undefined,
  });
  return r.ok;
}
