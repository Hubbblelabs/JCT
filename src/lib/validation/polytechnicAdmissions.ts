import { z } from "zod";
import { zUrl, zClampedString, zOptionalString } from "./_primitives";

// The polytechnic Admissions section always renders exactly 3 criteria
// blocks (grid-cols-3). We allow 0 (empty draft) or up to 3.
export const LIMITS = {
  criteriaMax: 3,
  blockTitleMax: 80,
  itemMax: 160,
  itemsPerBlockMax: 8,
  eyebrowMax: 60,
  titleMax: 120,
  descriptionMax: 320,
  ctaLabelMax: 40,
} as const;

const CriterionSchema = z.object({
  title: zClampedString(0, LIMITS.blockTitleMax, "Block title").default(""),
  items: z
    .array(zClampedString(0, LIMITS.itemMax, "Item"))
    .max(LIMITS.itemsPerBlockMax)
    .default([]),
});

export const PolytechnicAdmissionsSchema = z.object({
  eyebrow: zOptionalString(LIMITS.eyebrowMax).default(""),
  title: zOptionalString(LIMITS.titleMax).default(""),
  description: zOptionalString(LIMITS.descriptionMax).default(""),
  ctaLabel: zOptionalString(LIMITS.ctaLabelMax).default(""),
  ctaHref: zUrl.optional().or(z.literal("")),
  criteria: z.array(CriterionSchema).max(LIMITS.criteriaMax).optional().default([]),
});

export type PolytechnicAdmissionsValue = z.infer<typeof PolytechnicAdmissionsSchema>;
