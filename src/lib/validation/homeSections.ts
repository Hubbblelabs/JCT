import { z } from "zod";
import { zUrl, zClampedString, zOptionalString } from "./_primitives";

// ── Why Choose JCT ──────────────────────────────────────────────────────────
export const WHY_CHOOSE_JCT_LIMITS = {
  eyebrowMax: 60,
  titleMax: 120,
  titleHighlightMax: 60,
  descriptionMax: 320,
  featuresMax: 9,
  featureTitleMax: 80,
  featureDescMax: 200,
  featureIconMax: 40,
} as const;

const WhyFeatureSchema = z.object({
  icon: zClampedString(0, WHY_CHOOSE_JCT_LIMITS.featureIconMax, "Icon").default(""),
  title: zClampedString(0, WHY_CHOOSE_JCT_LIMITS.featureTitleMax, "Feature title").default(""),
  description: zOptionalString(WHY_CHOOSE_JCT_LIMITS.featureDescMax).default(""),
});

export const WhyChooseJctSchema = z.object({
  eyebrow: zOptionalString(WHY_CHOOSE_JCT_LIMITS.eyebrowMax).default(""),
  title: zOptionalString(WHY_CHOOSE_JCT_LIMITS.titleMax).default(""),
  titleHighlight: zOptionalString(WHY_CHOOSE_JCT_LIMITS.titleHighlightMax).default(""),
  description: zOptionalString(WHY_CHOOSE_JCT_LIMITS.descriptionMax).default(""),
  features: z
    .array(WhyFeatureSchema)
    .max(WHY_CHOOSE_JCT_LIMITS.featuresMax)
    .optional()
    .default([]),
});

export type WhyChooseJctValue = z.infer<typeof WhyChooseJctSchema>;

// ── Home Admissions CTA ──────────────────────────────────────────────────────
export const HOME_ADMISSIONS_LIMITS = {
  eyebrowMax: 60,
  titleMax: 120,
  titleHighlightMax: 60,
  descriptionMax: 320,
  pathwaysMax: 6,
  pathwayTitleMax: 80,
  pathwayDescMax: 200,
  pathwayIconMax: 40,
  pathwayCtaLabelMax: 40,
  applyLabelMax: 40,
  prospectusLabelMax: 40,
} as const;

const PathwaySchema = z.object({
  icon: zClampedString(0, HOME_ADMISSIONS_LIMITS.pathwayIconMax, "Icon").default(""),
  title: zClampedString(0, HOME_ADMISSIONS_LIMITS.pathwayTitleMax, "Pathway title").default(""),
  description: zOptionalString(HOME_ADMISSIONS_LIMITS.pathwayDescMax).default(""),
  ctaLabel: zOptionalString(HOME_ADMISSIONS_LIMITS.pathwayCtaLabelMax).default(""),
  ctaHref: zUrl.optional().or(z.literal("")),
});

export const HomeAdmissionsSchema = z.object({
  eyebrow: zOptionalString(HOME_ADMISSIONS_LIMITS.eyebrowMax).default(""),
  title: zOptionalString(HOME_ADMISSIONS_LIMITS.titleMax).default(""),
  titleHighlight: zOptionalString(HOME_ADMISSIONS_LIMITS.titleHighlightMax).default(""),
  description: zOptionalString(HOME_ADMISSIONS_LIMITS.descriptionMax).default(""),
  pathways: z
    .array(PathwaySchema)
    .max(HOME_ADMISSIONS_LIMITS.pathwaysMax)
    .optional()
    .default([]),
  applyLabel: zOptionalString(HOME_ADMISSIONS_LIMITS.applyLabelMax).default(""),
  applyHref: zUrl.optional().or(z.literal("")),
  prospectusLabel: zOptionalString(HOME_ADMISSIONS_LIMITS.prospectusLabelMax).default(""),
  prospectusUrl: zOptionalString(500).default(""),
});

export type HomeAdmissionsValue = z.infer<typeof HomeAdmissionsSchema>;
