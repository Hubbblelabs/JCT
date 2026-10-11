/**
 * The even darkening layer an admin-set hero `overlayOpacity` draws over the
 * background photo, in place of the hero's built-in gradients.
 */
export function HeroOverlay({
  opacity,
  color,
}: {
  /** Whole percentage, already clamped by `readHeroOverlay`. */
  opacity: number;
  color: string;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ backgroundColor: color, opacity: opacity / 100 }}
    />
  );
}
