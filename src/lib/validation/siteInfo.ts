import { z } from "zod";
import {
  zClampedString,
  zOptionalString,
  zUrl,
  zRequiredString,
} from "./_primitives";

// ──────────────────────────────────────────────────────────────────────────
// SiteConfig keys for institution-wide info shown in the Footer and other
// shared chrome. These were referenced by the admin UI but had no validation
// schema, so PUTs were rejected with "Unknown config_key". Each schema below
// is registered in siteConfig.ts/SITE_CONFIG_SCHEMAS.
// ──────────────────────────────────────────────────────────────────────────

export const CONTACT_LIMITS = {
  phoneMax: 40,
  emailMax: 200,
  whatsappMax: 30,
} as const;

export const ContactSchema = z.object({
  phone: zOptionalString(CONTACT_LIMITS.phoneMax).default(""),
  phoneAlt: zOptionalString(CONTACT_LIMITS.phoneMax).default(""),
  email: zOptionalString(CONTACT_LIMITS.emailMax).default(""),
  admissionsEmail: zOptionalString(CONTACT_LIMITS.emailMax).default(""),
  whatsapp: zOptionalString(CONTACT_LIMITS.whatsappMax).default(""),
});
export type ContactValue = z.infer<typeof ContactSchema>;

export const SocialSchema = z.object({
  facebook: zUrl.optional().or(z.literal("")).default(""),
  instagram: zUrl.optional().or(z.literal("")).default(""),
  twitter: zUrl.optional().or(z.literal("")).default(""),
  linkedin: zUrl.optional().or(z.literal("")).default(""),
  youtube: zUrl.optional().or(z.literal("")).default(""),
});
export type SocialValue = z.infer<typeof SocialSchema>;

export const ADDRESS_LIMITS = {
  lineMax: 200,
  cityMax: 80,
  pincodeMax: 12,
  stateMax: 80,
  countryMax: 80,
  fullMax: 500,
  mapUrlMax: 500,
  mapEmbedUrlMax: 1000,
} as const;

export const AddressSchema = z.object({
  line1: zOptionalString(ADDRESS_LIMITS.lineMax).default(""),
  line2: zOptionalString(ADDRESS_LIMITS.lineMax).default(""),
  city: zOptionalString(ADDRESS_LIMITS.cityMax).default(""),
  pincode: zOptionalString(ADDRESS_LIMITS.pincodeMax).default(""),
  state: zOptionalString(ADDRESS_LIMITS.stateMax).default(""),
  country: zOptionalString(ADDRESS_LIMITS.countryMax).default(""),
  full: zOptionalString(ADDRESS_LIMITS.fullMax).default(""),
  mapUrl: zUrl.optional().or(z.literal("")).default(""),
  mapEmbedUrl: z
    .string()
    .max(ADDRESS_LIMITS.mapEmbedUrlMax, `Map embed URL must be at most ${ADDRESS_LIMITS.mapEmbedUrlMax} characters`)
    .optional()
    .or(z.literal(""))
    .default(""),
});
export type AddressValue = z.infer<typeof AddressSchema>;

// Placement / aggregate stats surfaced on the home page Placements section.
export const STATS_LIMITS = {
  packageMax: 30,
} as const;

const nonNegInt = z.number().int().min(0).optional();

export const StatsSchema = z.object({
  yearsOfExcellence: nonNegInt,
  students: nonNegInt,
  faculty: nonNegInt,
  recruiters: nonNegInt,
  alumni: nonNegInt,
  programs: nonNegInt,
  placementRate: z.number().int().min(0).max(100).optional(),
  highestPackage: zOptionalString(STATS_LIMITS.packageMax).default(""),
  averagePackage: zOptionalString(STATS_LIMITS.packageMax).default(""),
});
export type StatsValue = z.infer<typeof StatsSchema>;

// Accreditation badges shown on home + hero variants.
export const ACCREDITATIONS_LIMITS = {
  nameMax: 80,
  descriptionMax: 200,
  itemsMax: 24,
} as const;

export const AccreditationsSchema = z
  .array(
    z.object({
      name: zRequiredString("Accreditation name", ACCREDITATIONS_LIMITS.nameMax),
      logo: zUrl,
      description: zOptionalString(ACCREDITATIONS_LIMITS.descriptionMax).default(""),
    }),
  )
  .max(
    ACCREDITATIONS_LIMITS.itemsMax,
    `Maximum ${ACCREDITATIONS_LIMITS.itemsMax} accreditations`,
  );
export type AccreditationsValue = z.infer<typeof AccreditationsSchema>;

// Stat boxes shown in the Arts & Science hero — pure presentation values.
export const HERO_STATS_LIMITS = {
  valueMax: 30,
  labelMax: 60,
  itemsMax: 8,
} as const;

export const HeroStatsListSchema = z
  .array(
    z.object({
      value: zClampedString(1, HERO_STATS_LIMITS.valueMax, "Stat value"),
      label: zClampedString(1, HERO_STATS_LIMITS.labelMax, "Stat label"),
      accent: z.boolean().optional().default(false),
    }),
  )
  .max(
    HERO_STATS_LIMITS.itemsMax,
    `Maximum ${HERO_STATS_LIMITS.itemsMax} stats`,
  );
export type HeroStatsListValue = z.infer<typeof HeroStatsListSchema>;
