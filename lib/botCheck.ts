/**
 * Cheap, invisible checks that catch most form-filling bots without asking a
 * person to do anything. Each public form carries two extra fields:
 *   website   a honeypot, hidden from people and screen readers, that a bot
 *             filling every input will complete
 *   startedAt when the form was first shown, in milliseconds; a person takes
 *             a few seconds at least, a script posts at once or not at all
 * A post that fails either check is answered as if it succeeded, so the bot
 * learns nothing, and is neither stored nor sent to the owner.
 */

export const HONEYPOT_FIELD = "website";

// Under this, nobody has read the form, let alone typed into it.
const MIN_FILL_MS = 2500;
// Beyond this the timestamp is stale or forged; a real tab left open a day is
// rare enough that a refused post (which still reads as success) is acceptable.
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

export function looksLikeBot(
  body: Record<string, unknown>,
  now = Date.now(),
): boolean {
  const trap = body[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") return true;

  const started = Number(body.startedAt);
  if (!Number.isFinite(started)) return true;
  const elapsed = now - started;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS;
}
