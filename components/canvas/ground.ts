/**
 * The grounds a generative study paints behind itself, and the palette they
 * draw with.
 *
 * STONE is the v1 stone the first five studies each declared for themselves.
 * It is a shade off the current --paper token, which is the drift the design
 * brief records. It is kept here rather than corrected so the newer studies
 * sit beside the older ones without a visible seam; when the five are
 * migrated, this is the single line that changes.
 */
export const STONE = "#E4E2DB";
export const BASALT = "#151C18";

/** The house palette, as canvas needs it rather than as CSS declares it. */
export const INK = "#1E211E";
export const AMBER = "#C97B3D";
export const SEA = "#5E7A6B";
export const ROSE = "#B4685E";
export const BONE = "#DDD9CC";

/** Ink at an opacity, for the hairline weights the studies draw in. */
export const inkAt = (alpha: number) => `rgba(30,33,30,${alpha})`;
