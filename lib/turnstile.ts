import "server-only";

/**
 * Cloudflare Turnstile, checked on the server for every public form. The
 * browser half lives in components/forms/useTurnstile.
 *
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  the widget's site key (public)
 *   TURNSTILE_SECRET_KEY            the matching secret (server only)
 *
 * Off until configured: with no secret every post passes, exactly as before.
 * Set both keys together. A secret without the site key turns every form away,
 * because no browser ever sends a token.
 */

const SECRET = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Whether the server insists on a Turnstile token. */
export const turnstileEnforced = SECRET !== "";

/** The field the forms send the token in. */
export const TURNSTILE_FIELD = "turnstileToken";

/**
 * Whether the post carries a token Cloudflare accepts. Never throws. If
 * Cloudflare itself cannot be reached the post is let through, since the
 * honeypot, fill-time check and rate limit still stand, and losing a real
 * buyer costs more than letting one bot in.
 */
export async function passesTurnstile(
  body: Record<string, unknown>,
  ip: string,
): Promise<boolean> {
  if (!turnstileEnforced) return true;
  const token = body[TURNSTILE_FIELD];
  if (typeof token !== "string" || token === "" || token.length > 2048) {
    return false;
  }
  const form = new URLSearchParams({ secret: SECRET, response: token });
  if (ip && ip !== "unknown") form.set("remoteip", ip);
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return true;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return true;
  }
}

/** The one sentence a person sees when the check did not complete. */
export const TURNSTILE_REFUSAL =
  "The spam check did not finish. Please wait a moment and send again.";
