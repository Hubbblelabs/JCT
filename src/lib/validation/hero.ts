import { z } from "zod";
import { zUrl, zCta, zOptionalString, zClampedString } from "./_primitives";

// Carousel rotation speed bounds, shared by every hero background carousel.
const CAROUSEL = { minMs: 1500, maxMs: 60_000, defaultMs: 6000 } as const;
const zIntervalMs = z
  .number()
  .int()
  .min(CAROUSEL.minMs, `Speed must be at least ${CAROUSEL.minMs}ms`)
  .max(CAROUSEL.maxMs, `Speed must be at most ${CAROUSEL.maxMs}ms`)
  .optional()
  .default(CAROUSEL.defaultMs);

// Accreditation badge — a logo plus its name/description. Reused by the
// home Accreditations section and the Engineering hero accreditation strip.
const AccreditationItemSchema = z.object({
  name: zClampedString(0, 80, "Accreditation name").default(""),
  logo: zUrl,
  description: zOptionalString(200).default(""),
});

// HomeHero — top of the landing page. Backgrounds rotate in a carousel,
// titleLines render as <span> blocks, cards link to each institution.
export const HOME_LIMITS = {
  backgroundImages: 6,
  titleLines: 3,
  titleLineMax: 60,
  subtitleMax: 240,
  ctas: 2,
  cards: 3,
  cardTitleMax: 60,
  cardDescriptionMax: 240,
  cardHighlightsMax: 160,
  tourVideoUrlMax: 200,
  minIntervalMs: CAROUSEL.minMs,
  maxIntervalMs: CAROUSEL.maxMs,
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
  intervalMs: zIntervalMs,
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
  backgroundImages: 6,
  titleMax: 120,
  subtitleMax: 240,
  ctas: 3,
  badgeTextMax: 80,
  counsellingLabelMax: 80,
  counsellingCodeMax: 30,
  accreditationsMax: 10,
  accreditationCaptionMax: 80,
  minIntervalMs: CAROUSEL.minMs,
  maxIntervalMs: CAROUSEL.maxMs,
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
  counsellingLabel: zOptionalString(ENG_HERO_LIMITS.counsellingLabelMax).default(
    "",
  ),
  counsellingCode: zOptionalString(ENG_HERO_LIMITS.counsellingCodeMax).default(
    "",
  ),
  accreditations: z
    .array(AccreditationItemSchema)
    .max(ENG_HERO_LIMITS.accreditationsMax)
    .optional()
    .default([]),
  accreditationsCaption: zOptionalString(
    ENG_HERO_LIMITS.accreditationCaptionMax,
  ).default(""),
  intervalMs: zIntervalMs,
});

// Arts & Science Hero — split title into 3 parts (line1 + highlight + line2),
// plus three feature subsections (Quality / Leadership / Experience).
export const ARTS_HERO_LIMITS = {
  backgroundImages: 6,
  partMax: 40,
  subtitleMax: 240,
  ctas: 3,
  subsectionsMax: 3,
  subsectionIconMax: 40,
  subsectionTitleMax: 40,
  subsectionDescMax: 200,
  statsMax: 8,
  statValueMax: 30,
  statLabelMax: 60,
  minIntervalMs: CAROUSEL.minMs,
  maxIntervalMs: CAROUSEL.maxMs,
} as const;

const ArtsHeroStatSchema = z.object({
  value: zClampedString(0, ARTS_HERO_LIMITS.statValueMax, "Stat value").default(
    "",
  ),
  label: zClampedString(0, ARTS_HERO_LIMITS.statLabelMax, "Stat label").default(
    "",
  ),
  accent: z.boolean().optional().default(false),
});

const ArtsSubsectionSchema = z.object({
  icon: zClampedString(0, ARTS_HERO_LIMITS.subsectionIconMax, "Icon").default(
    "",
  ),
  title: zClampedString(0, ARTS_HERO_LIMITS.subsectionTitleMax, "Title").default(
    "",
  ),
  description: zOptionalString(ARTS_HERO_LIMITS.subsectionDescMax).default(""),
});

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
  subsections: z
    .array(ArtsSubsectionSchema)
    .max(ARTS_HERO_LIMITS.subsectionsMax)
    .optional()
    .default([]),
  stats: z
    .array(ArtsHeroStatSchema)
    .max(ARTS_HERO_LIMITS.statsMax)
    .optional()
    .default([]),
  intervalMs: zIntervalMs,
});

// Polytechnic Hero — eyebrow + two title lines, carousel with intervalMs.
export const POLY_HERO_LIMITS = {
  backgroundImagesMax: 6,
  eyebrowMax: 60,
  titleLineMax: 60,
  subtitleMax: 240,
  ctas: 3,
  minIntervalMs: CAROUSEL.minMs,
  maxIntervalMs: CAROUSEL.maxMs,
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
  intervalMs: zIntervalMs,
});

export type HomeHeroValue = z.infer<typeof HomeHeroSchema>;
export type HomeStatsValue = z.infer<typeof HomeStatsSchema>;
export type HomeProspectusValue = z.infer<typeof HomeProspectusSchema>;
export type EngineeringHeroValue = z.infer<typeof EngineeringHeroSchema>;
export type ArtsScienceHeroValue = z.infer<typeof ArtsScienceHeroSchema>;
export type PolytechnicHeroValue = z.infer<typeof PolytechnicHeroSchema>;
