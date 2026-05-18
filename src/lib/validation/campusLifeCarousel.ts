import { z } from "zod";
import { zUrl, zClampedString } from "./_primitives";

export const LIMITS = {
  photos: 40,
  ctaLabelMax: 40,
} as const;

export const CampusLifeCarouselSchema = z.object({
  photos: z.array(zUrl).max(LIMITS.photos).optional().default([]),
  cta: z
    .object({
      label: zClampedString(0, LIMITS.ctaLabelMax, "Button label").default(""),
      href: zUrl,
    })
    .optional(),
});

export type CampusLifeCarouselValue = z.infer<typeof CampusLifeCarouselSchema>;
