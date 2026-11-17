/**
 * The House of Chairs email layout: every message the site sends (owner
 * notifications and replies to buyers) is built here, so they share one look.
 *
 * Email clients are not browsers. The layout is a single 600px table with
 * inline styles, web-safe fallbacks for Montserrat, a PNG logo (Gmail and
 * Outlook drop SVG) and no background images. Every piece of text from a
 * visitor or the dashboard is escaped before it goes in.
 *
 * Deliverability habits kept here on purpose: a real text-to-image balance
 * (one small logo), a hidden preheader so the inbox preview reads well, no
 * link shorteners, every link on the shop's own domain, and a plain footer
 * that says who sent it and how to reach a person.
 */

export const SITE_URL = "https://www.houseofchairs.co.uk";
export const SHOP_EMAIL = "sales@houseofchairs.co.uk";

const C = {
  paper: "#F5F3EF",
  panel: "#EAE7E1",
  ink: "#1E211E",
  basalt: "#151C18",
  bone: "#DDD9CC",
  amber: "#C97B3D",
  muted: "#5B5F5A",
  hair: "#D6D2CA",
};

const FONT =
  "Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escaped text with its line breaks kept. */
function textBlock(s: string): string {
  return escapeHtml(s.trim()).replace(/\r?\n/g, "<br>");
}

export interface EmailParts {
  /** Shown in the inbox list after the subject; never in the body. */
  preheader: string;
  heading?: string;
  /** Plain text paragraphs, separated by blank lines in the source. */
  body: string;
  /** Label and value rows, shown as a small table under the body. */
  details?: [string, string][];
  /** One call to action, always on the shop's own domain. */
  button?: { label: string; href: string };
  /** A quoted message, e.g. the buyer's original enquiry. */
  quote?: { intro: string; text: string };
  /** A line under everything, in small type. */
  footnote?: string;
}

export function renderEmail(p: EmailParts): string {
  const paragraphs = p.body
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .filter((x) => x.trim() !== "")
    .map(
      (para) =>
        `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.65;color:${C.ink};">${textBlock(para)}</p>`,
    )
    .join("");

  const heading = p.heading
    ? `<h1 style="margin:0 0 20px;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:400;color:${C.ink};">${escapeHtml(p.heading)}</h1>`
    : "";

  const details = p.details?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-collapse:collapse;">${p.details
        .map(
          ([k, v]) =>
            `<tr><td style="padding:10px 12px 10px 0;border-top:1px solid ${C.hair};font-family:${FONT};font-size:12px;letter-spacing:0.04em;color:${C.muted};width:110px;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:10px 0;border-top:1px solid ${C.hair};font-family:${FONT};font-size:14px;line-height:1.5;color:${C.ink};vertical-align:top;">${textBlock(v)}</td></tr>`,
        )
        .join("")}</table>`
    : "";

  const quote = p.quote
    ? `<p style="margin:24px 0 8px;font-family:${FONT};font-size:12px;letter-spacing:0.04em;color:${C.muted};">${escapeHtml(p.quote.intro)}</p><div style="margin:0 0 20px;padding:14px 16px;background:${C.panel};border-left:3px solid ${C.amber};border-radius:6px;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.ink};">${textBlock(p.quote.text)}</div>`
    : "";

  const button = p.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="border-radius:999px;background:${C.basalt};"><a href="${escapeHtml(p.button.href)}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:14px;font-weight:500;color:${C.bone};text-decoration:none;border-radius:999px;">${escapeHtml(p.button.label)}</a></td></tr></table>`
    : "";

  const footnote = p.footnote
    ? `<p style="margin:16px 0 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">${textBlock(p.footnote)}</p>`
    : "";

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>House of Chairs</title>
</head>
<body style="margin:0;padding:0;background:${C.panel};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.panel};">${escapeHtml(p.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.panel};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:separate;">
<tr><td style="background:${C.basalt};border-radius:12px 12px 0 0;padding:26px 32px 22px;">
<a href="${SITE_URL}" style="text-decoration:none;"><img src="${SITE_URL}/email/logo.png" width="150" height="63" alt="House of Chairs" style="display:block;border:0;width:150px;height:auto;color:${C.bone};font-family:${FONT};font-size:20px;"></a>
</td></tr>
<tr><td style="height:3px;line-height:3px;font-size:0;background:${C.amber};">&nbsp;</td></tr>
<tr><td style="background:${C.paper};padding:32px 32px 28px;border-radius:0 0 12px 12px;">
${heading}${paragraphs}${details}${button}${quote}${footnote}
</td></tr>
<tr><td style="padding:20px 32px 8px;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};text-align:center;">
House of Chairs, vintage designer furniture<br>
<a href="${SITE_URL}" style="color:${C.muted};">houseofchairs.co.uk</a> &middot; <a href="mailto:${SHOP_EMAIL}" style="color:${C.muted};">${SHOP_EMAIL}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
