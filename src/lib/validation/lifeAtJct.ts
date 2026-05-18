import { z } from "zod";
import { zUrl, zClampedString, zOptionalString } from "./_primitives";

export const LIMITS = {
  categories: 8,
  categoryLabelMax: 30,
  photos: 60,
  captionMax: 120,
} as const;

const PhotoSchema = z.object({
  src: zUrl,
  caption: zOptionalString(LIMITS.captionMax).default(""),
  category: zClampedString(0, LIMITS.categoryLabelMax, "Category").default(""),
  isAll: z.boolean().optional().default(false),
});

export const LifeAtJctSchema = z.object({
  categories: z
    .array(zClampedString(1, LIMITS.categoryLabelMax, "Category"))
    .max(LIMITS.categories)
    .optional()
    .default([]),
  photos: z.array(PhotoSchema).max(LIMITS.photos).optional().default([]),
  videoUrl: zUrl.optional().or(z.literal("")),
});

export type LifeAtJctValue = z.infer<typeof LifeAtJctSchema>;
