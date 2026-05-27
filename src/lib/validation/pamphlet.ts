import { z } from "zod";
import { zUrl, zCta, zClampedString } from "./_primitives";

export const LIMITS = {
  // Legacy — older saved values still carry an `images[]` array.
  images: 2,
  ctas: 2,
  minDelayMs: 0,
  maxDelayMs: 60_000,
  applyLabelMax: 40,
  applyHrefMax: 500,
  headingMax: 120,
  subheadingMax: 160,
  bodyMax: 600,
  virtualTourLabelMax: 40,
} as const;

export const PAMPHLET_LAYOUTS = [
  "image-image",
  "image-text",
  "text-image",
  "text-text",
] as const;

export const PamphletLayoutSchema = z.enum(PAMPHLET_LAYOUTS);
export type PamphletLayout = z.infer<typeof PamphletLayoutSchema>;

export const PamphletSlotSchema = z.object({
  image: zUrl.optional().or(z.literal("")),
  heading: zClampedString(0, LIMITS.headingMax, "Heading").optional(),
  subheading: zClampedString(0, LIMITS.subheadingMax, "Subheading").optional(),
  body: zClampedString(0, LIMITS.bodyMax, "Body").optional(),
});
export type PamphletSlot = z.infer<typeof PamphletSlotSchema>;

export const PamphletVirtualTourSchema = z.object({
  enabled: z.boolean().optional(),
  label: zClampedString(
    0,
    LIMITS.virtualTourLabelMax,
    "Virtual Tour label",
  ).optional(),
  url: zUrl.optional().or(z.literal("")),
});
export type PamphletVirtualTour = z.infer<typeof PamphletVirtualTourSchema>;

export const PamphletSchema = z.object({
  enabled: z.boolean().optional().default(true),
  delayMs: z
    .number()
    .int("Delay must be a whole number")
    .min(LIMITS.minDelayMs, `Delay must be ≥ ${LIMITS.minDelayMs}`)
    .max(LIMITS.maxDelayMs, `Delay must be ≤ ${LIMITS.maxDelayMs}ms`)
    .optional()
    .default(2000),
  layout: PamphletLayoutSchema.optional().default("image-image"),
  leftSlot: PamphletSlotSchema.optional(),
  rightSlot: PamphletSlotSchema.optional(),
  virtualTour: PamphletVirtualTourSchema.optional(),
  applyLabel: zClampedString(0, LIMITS.applyLabelMax, "Apply label").default(
    "Apply Now",
  ),
  applyHref: zUrl.optional().or(z.literal("")),

  // ── Legacy fields ─────────────────────────────────────────────────────────
  // Older saved values still carry these. Kept on the schema so existing
  // documents validate; the public renderer falls back to them when the new
  // slot/virtualTour fields are absent.
  images: z
    .array(zUrl)
    .max(LIMITS.images, `Pamphlet supports at most ${LIMITS.images} images`)
    .optional()
    .default([]),
  ctas: z.array(zCta).max(LIMITS.ctas).optional().default([]),
  videoUrl: zUrl.optional().or(z.literal("")),
});

export type PamphletValue = z.infer<typeof PamphletSchema>;
