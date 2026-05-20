import { z } from "zod";
import { zUrl, zCta, zOptionalString, zClampedString } from "./_primitives";

// HomeHero — top of the landing page. Backgrounds rotate in a carousel,
// titleLines render as <span> blocks, cards link to each institution.
export const HOME_LIMITS = {
  backgroundImages: 3,
  titleLines: 3,
  titleLineMax: 60,
  subtitleMax: 240,
  ctas: 2,
  trustHighlights: 4,
  trustLabelMax: 60,
  cards: 3,
  cardTitleMax: 60,
  cardDescriptionMax: 240,
  cardHighlightsMax: 160,
  tourVideoUrlMax: 200,
} as const;

export const HomeHeroSchema = z.object({
  backgroundImages: z
    .array(zUrl)
    .max(HOME_LIMITS.backgroundImages)
    .optional()
    .default([]),
  titleLines: z
    .array(zClampedString(0, HOME_LIMITS.titleLineMax, "Title line"))
    .max(HOME_LIMITS.titleLines)
    .optional()
    .default([]),
  ctas: z.array(zCta).max(HOME_LIMITS.ctas).optional().default([]),
  trustHighlights: z
    .array(
      z.object({
        icon: zClampedString(0, 40, "Icon"),
        label: zClampedString(0, HOME_LIMITS.trustLabelMax, "Label"),
      }),
    )
    .max(HOME_LIMITS.trustHighlights)
    .optional()
    .default([]),
  cards: z
    .array(
      z.object({
        title: zClampedString(0, HOME_LIMITS.cardTitleMax, "Card title"),
        description: zOptionalString(HOME_LIMITS.cardDescriptionMax).default(
          "",
        ),
        href: zUrl,
        icon: zClampedString(0, 40, "Icon"),
        ctaLabel: zClampedString(0, 40, "CTA label"),
        highlights: zOptionalString(HOME_LIMITS.cardHighlightsMax).default(""),
      }),
    )
    .max(HOME_LIMITS.cards)
    .optional()
    .default([]),
  tourVideoUrl: zOptionalString(HOME_LIMITS.tourVideoUrlMax).default(""),
});

// Stat cards shown below the hero (Years of Excellence, Alumni, etc.)
export const HomeStatsSchema = z.object({
  yearsOfExcellence: zOptionalString(30).default(""),
  alumni: zOptionalString(30).default(""),
  studentsPlaced: zOptionalString(30).default(""),
  industryAwards: zOptionalString(30).default(""),
});

// Prospectus PDF URL — stored separately so the hero config isn't bloated.
export const HomeProspectusSchema = z.object({
  url: zOptionalString(500).default(""),
});

export const ENG_HERO_LIMITS = {
  backgroundImages: 1,
  titleMax: 120,
  subtitleMax: 240,
  ctas: 3,
  badgeTextMax: 80,
  counsellingCodeMax: 30,
} as const;

export const EngineeringHeroSchema = z.object({
  backgroundImages: z
    .array(zUrl)
    .max(ENG_HERO_LIMITS.backgroundImages)
    .optional()
    .default([]),
  title: zOptionalString(ENG_HERO_LIMITS.titleMax).default(""),
  subtitle: zOptionalString(ENG_HERO_LIMITS.subtitleMax).default(""),
  ctas: z.array(zCta).max(ENG_HERO_LIMITS.ctas).optional().default([]),
  badgeText: zOptionalString(ENG_HERO_LIMITS.badgeTextMax).default(""),
  counsellingCode: zOptionalString(ENG_HERO_LIMITS.counsellingCodeMax).default(
    "",
  ),
});

// Arts & Science Hero — split title into 3 parts (line1 + highlight + line2).
export const ARTS_HERO_LIMITS = {
  backgroundImages: 6,
  partMax: 40,
  subtitleMax: 240,
  ctas: 3,
} as const;

export const ArtsScienceHeroSchema = z.object({
  backgroundImages: z
    .array(zUrl)
    .max(ARTS_HERO_LIMITS.backgroundImages)
    .optional()
    .default([]),
  titleLine1: zOptionalString(ARTS_HERO_LIMITS.partMax).default(""),
  titleHighlight: zOptionalString(ARTS_HERO_LIMITS.partMax).default(""),
  titleLine2: zOptionalString(ARTS_HERO_LIMITS.partMax).default(""),
  subtitle: zOptionalString(ARTS_HERO_LIMITS.subtitleMax).default(""),
  ctas: z.array(zCta).max(ARTS_HERO_LIMITS.ctas).optional().default([]),
});

// Polytechnic Hero — 3 default background images, eyebrow short, intervalMs.
export const POLY_HERO_LIMITS = {
  backgroundImagesMax: 6,
  eyebrowMax: 60,
  titleLineMax: 60,
  subtitleMax: 240,
  ctas: 3,
  minIntervalMs: 1500,
  maxIntervalMs: 60_000,
} as const;

export const PolytechnicHeroSchema = z.object({
  backgroundImages: z
    .array(zUrl)
    .max(POLY_HERO_LIMITS.backgroundImagesMax)
    .optional()
    .default([]),
  eyebrow: zOptionalString(POLY_HERO_LIMITS.eyebrowMax).default(""),
  titleLine1: zOptionalString(POLY_HERO_LIMITS.titleLineMax).default(""),
  titleLine2: zOptionalString(POLY_HERO_LIMITS.titleLineMax).default(""),
  subtitle: zOptionalString(POLY_HERO_LIMITS.subtitleMax).default(""),
  ctas: z.array(zCta).max(POLY_HERO_LIMITS.ctas).optional().default([]),
  intervalMs: z
    .number()
    .int()
    .min(POLY_HERO_LIMITS.minIntervalMs)
    .max(POLY_HERO_LIMITS.maxIntervalMs)
    .optional()
    .default(6000),
});

export type HomeHeroValue = z.infer<typeof HomeHeroSchema>;
export type HomeStatsValue = z.infer<typeof HomeStatsSchema>;
export type HomeProspectusValue = z.infer<typeof HomeProspectusSchema>;
export type EngineeringHeroValue = z.infer<typeof EngineeringHeroSchema>;
export type ArtsScienceHeroValue = z.infer<typeof ArtsScienceHeroSchema>;
export type PolytechnicHeroValue = z.infer<typeof PolytechnicHeroSchema>;
