import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Owner notifications, sent from the shop's own mailbox through Easily's mail
 * server. Each new enquiry arrives in sales@ from sales@, with the buyer as
 * Reply-To, so pressing Reply in the inbox answers the buyer directly and the
 * conversation stays in the shop's mailbox.
 *
 * Best-effort: the enquiry or interest is already stored in Supabase before
 * this runs, so a failed or unconfigured send never blocks the visitor.
 *
 * Configure (server-only; never prefix NEXT_PUBLIC_):
 *   HOC_SMTP_PASSWORD  the sales@ mailbox password; nothing is sent without it
 *   HOC_SMTP_USER      optional, defaults to sales@houseofchairs.co.uk
 *   HOC_SMTP_HOST      optional, defaults to smtp.easily.uk
 *   HOC_SMTP_PORT      optional, defaults to 465 (TLS); 587 uses STARTTLS
 *   HOC_NOTIFY_TO      optional, where notifications go; defaults to the user
 */

const USER = process.env.HOC_SMTP_USER?.trim() || "sales@houseofchairs.co.uk";
const PASSWORD = process.env.HOC_SMTP_PASSWORD ?? "";
const HOST = process.env.HOC_SMTP_HOST?.trim() || "smtp.easily.uk";
const PORT = Number(process.env.HOC_SMTP_PORT) || 465;
const TO = process.env.HOC_NOTIFY_TO?.trim() || USER;

export type NotificationKind = "enquiry" | "interest" | "subscriber";

/** Whether owner notifications can be sent. */
export const emailConfigured = PASSWORD !== "";

// A plain address only: anything with quotes, brackets, commas or spaces is
// left off the Reply-To rather than handed to the mail parser.
const PLAIN_ADDRESS = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** One line, no control characters, so nothing can break out of a header. */
function oneLine(s: string, max = 150): string {
  return s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

let transport: Transporter | null = null;

function getTransport(): Transporter {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      requireTLS: PORT !== 465,
      auth: { user: USER, pass: PASSWORD },
      // A slow mail server must not hold the visitor's response open long.
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    });
  }
  return transport;
}

/**
 * Send the owner a plain-text notification. Never throws; returns whether the
 * mail server accepted it. `replyTo` is the visitor's address, when they left
 * one, so a reply from the inbox goes straight back to them.
 */
export async function notifyOwner(
  kind: NotificationKind,
  subject: string,
  lines: string[],
  replyTo?: { email: string; name?: string } | null,
): Promise<boolean> {
  if (!emailConfigured) return false;
  const address = replyTo?.email?.trim() ?? "";
  try {
    await getTransport().sendMail({
      from: { name: "House of Chairs website", address: USER },
      to: TO,
      replyTo: PLAIN_ADDRESS.test(address)
        ? { name: oneLine(replyTo?.name ?? "", 80), address }
        : undefined,
      subject: oneLine(subject),
      text: lines.join("\n"),
      headers: { "X-HoC-Notification": kind },
    });
    return true;
  } catch (err) {
    console.error(
      "notifyOwner failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return false;
  }
}
