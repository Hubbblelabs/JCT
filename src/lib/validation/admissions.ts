import { z } from "zod";
import { zUrl, zClampedString, zOptionalString } from "./_primitives";

// Generic Admissions section, shared by the Engineering and Arts & Science
// college pages. Renders exactly 3 criteria columns plus a contact strip.
export const ADMISSIONS_LIMITS = {
  criteriaMax: 3,
  blockTitleMax: 80,
  itemMax: 160,
  itemsPerBlockMax: 8,
  eyebrowMax: 60,
  titleMax: 120,
  descriptionMax: 320,
  ctaLabelMax: 40,
  phoneMax: 40,
  emailMax: 200,
  addressMax: 200,
} as const;

const CriterionSchema = z.object({
  title: zClampedString(0, ADMISSIONS_LIMITS.blockTitleMax, "Block title").default(""),
  items: z
    .array(zClampedString(0, ADMISSIONS_LIMITS.itemMax, "Item"))
    .max(ADMISSIONS_LIMITS.itemsPerBlockMax)
    .default([]),
});

export const AdmissionsSchema = z.object({
  eyebrow: zOptionalString(ADMISSIONS_LIMITS.eyebrowMax).default(""),
  title: zOptionalString(ADMISSIONS_LIMITS.titleMax).default(""),
  description: zOptionalString(ADMISSIONS_LIMITS.descriptionMax).default(""),
  ctaLabel: zOptionalString(ADMISSIONS_LIMITS.ctaLabelMax).default(""),
  ctaHref: zUrl.optional().or(z.literal("")),
  criteria: z
    .array(CriterionSchema)
    .max(ADMISSIONS_LIMITS.criteriaMax)
    .optional()
    .default([]),
  phone: zOptionalString(ADMISSIONS_LIMITS.phoneMax).default(""),
  email: zOptionalString(ADMISSIONS_LIMITS.emailMax).default(""),
  address: zOptionalString(ADMISSIONS_LIMITS.addressMax).default(""),
});

export type AdmissionsValue = z.infer<typeof AdmissionsSchema>;
