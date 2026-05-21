import { z } from "zod";
import {
  zUrl,
  zClampedString,
  zOptionalString,
  zNonNegativeInt,
} from "./_primitives";

export const LIMITS = {
  nameMax: 120,
  industryMax: 80,
  websiteMax: 300,
} as const;

export const RecruiterSchema = z.object({
  name: zClampedString(1, LIMITS.nameMax, "Name"),
  logo: zUrl.optional().or(z.literal("")),
  website: zUrl.optional().or(z.literal("")),
  industry: zOptionalString(LIMITS.industryMax).default(""),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const RecruiterCreateSchema = RecruiterSchema;
export const RecruiterUpdateSchema = RecruiterSchema.partial();

export type RecruiterValue = z.infer<typeof RecruiterSchema>;

// ── Recruiters / Placement Highlights section content ────────────────────────
// Section-level copy for the home "Placement Highlights" section. The company
// logos themselves are individual Recruiter documents; this schema covers the
// heading, description, and the stat cards shown above the logo carousel.
export const RECRUITERS_SECTION_LIMITS = {
  eyebrowMax: 60,
  titleMax: 120,
  titleHighlightMax: 80,
  descriptionMax: 320,
  statsMax: 6,
  statIconMax: 40,
  statValueMax: 30,
  statLabelMax: 60,
} as const;

export const RecruitersSectionSchema = z.object({
  eyebrow: zOptionalString(RECRUITERS_SECTION_LIMITS.eyebrowMax).default(""),
  title: zOptionalString(RECRUITERS_SECTION_LIMITS.titleMax).default(""),
  titleHighlight: zOptionalString(
    RECRUITERS_SECTION_LIMITS.titleHighlightMax,
  ).default(""),
  description: zOptionalString(RECRUITERS_SECTION_LIMITS.descriptionMax).default(
    "",
  ),
  stats: z
    .array(
      z.object({
        icon: zClampedString(
          0,
          RECRUITERS_SECTION_LIMITS.statIconMax,
          "Icon",
        ).default(""),
        value: zClampedString(
          0,
          RECRUITERS_SECTION_LIMITS.statValueMax,
          "Value",
        ).default(""),
        label: zClampedString(
          0,
          RECRUITERS_SECTION_LIMITS.statLabelMax,
          "Label",
        ).default(""),
      }),
    )
    .max(RECRUITERS_SECTION_LIMITS.statsMax)
    .optional()
    .default([]),
});

export type RecruitersSectionValue = z.infer<typeof RecruitersSectionSchema>;
