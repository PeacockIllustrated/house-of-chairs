/**
 * Recognises the automated enquiries that have reached the dashboard so far.
 * Every one of them, from July to November 2026, had both of these:
 *   a name that is a run of random mixed-case letters ("jFwqDmoUydBMxlBwSOzo")
 *   a Gmail address with two or more dots in it ("e.yi.ca.gu.40.1@gmail.com");
 *     Gmail ignores dots, so one inbox yields endless "new" addresses
 * Either alone is not enough: real people have long single-word names and
 * dotted addresses. Both together, nobody real has written in that way.
 *
 * Used to keep these out of the owner's inbox and to fold them away in the
 * dashboard. Nothing is deleted on this signal alone; the owner can still read
 * every one.
 */

const RANDOM_NAME = /^[A-Za-z]{12,}$/;

function looksRandomName(name: string): boolean {
  const n = name.trim();
  if (!RANDOM_NAME.test(n)) return false;
  // Capitals after the first letter, as in "jFwqDmoUydB". A real single-word
  // name has at most a couple ("McDonald", "DeMarco").
  const innerCaps = n.slice(1).replace(/[^A-Z]/g, "").length;
  return innerCaps >= 3;
}

function looksDotScattered(email: string): boolean {
  const m = /^([^@]+)@(gmail|googlemail)\.com$/i.exec(email.trim());
  if (!m) return false;
  return (m[1].match(/\./g) ?? []).length >= 2;
}

export function looksAutomated(entry: { name: string; email: string }): boolean {
  return looksRandomName(entry.name) && looksDotScattered(entry.email);
}
