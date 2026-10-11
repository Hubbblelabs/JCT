/**
 * Hero background darkness, stored per hero as `overlayOpacity` — a whole
 * percentage. Absent means "the hero's original design": each hero keeps its
 * own built-in gradients until an admin sets a value, at which point one even
 * layer of that strength replaces them.
 *
 * Zod-free so the public heroes don't pull the validation library into the
 * client bundle; the schema lives in src/lib/validation/hero.ts.
 */

/** Above this the photo is barely visible, which defeats the setting. */
export const HERO_OVERLAY_MAX = 90;

export function readHeroOverlay(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return Math.min(HERO_OVERLAY_MAX, Math.max(0, Math.round(raw)));
}
