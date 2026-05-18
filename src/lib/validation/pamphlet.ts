import { z } from "zod";
import { zUrl, zCta } from "./_primitives";

export const LIMITS = {
  images: 2,
  ctas: 2,
  minDelayMs: 0,
  maxDelayMs: 60_000,
} as const;

export const PamphletSchema = z.object({
  enabled: z.boolean().optional().default(true),
  delayMs: z
    .number()
    .int("Delay must be a whole number")
    .min(LIMITS.minDelayMs, `Delay must be ≥ ${LIMITS.minDelayMs}`)
    .max(LIMITS.maxDelayMs, `Delay must be ≤ ${LIMITS.maxDelayMs}ms`)
    .optional()
    .default(2000),
  images: z
    .array(zUrl)
    .max(LIMITS.images, `Pamphlet supports at most ${LIMITS.images} images`)
    .optional()
    .default([]),
  ctas: z.array(zCta).max(LIMITS.ctas).optional().default([]),
  videoUrl: zUrl.optional().or(z.literal("")),
});

export type PamphletValue = z.infer<typeof PamphletSchema>;
