import { z } from "zod";
import { PamphletSchema } from "./pamphlet";
import {
  HomeHeroSchema,
  HomeStatsSchema,
  HomeProspectusSchema,
  EngineeringHeroSchema,
  ArtsScienceHeroSchema,
  PolytechnicHeroSchema,
} from "./hero";
import { AnnouncementSchema } from "./announcement";
import { LifeAtJctSchema } from "./lifeAtJct";
import { CampusLifeCarouselSchema } from "./campusLifeCarousel";
import { PolytechnicAdmissionsSchema } from "./polytechnicAdmissions";
import {
  MetricsSchema,
  FacilitiesSchema,
  ResearchHighlightsSchema,
} from "./engineeringSections";
import {
  ContactSchema,
  SocialSchema,
  AddressSchema,
  StatsSchema,
  AccreditationsSchema,
  HeroStatsListSchema,
} from "./siteInfo";
import { AdmissionsSchema } from "./admissions";
import { WhyChooseJctSchema, HomeAdmissionsSchema } from "./homeSections";
import { HeaderSchema, FooterSchema } from "./globalCms";

// Every site-config key the admin UI writes must have an entry below.
// Keys in this map are validated strictly; unknown keys are rejected.
export const SITE_CONFIG_SCHEMAS = {
  contact: ContactSchema,
  social: SocialSchema,
  address: AddressSchema,
  stats: StatsSchema,
  accreditations: AccreditationsSchema,
  home: HomeHeroSchema,
  homeStats: HomeStatsSchema,
  homeProspectus: HomeProspectusSchema,
  homePamphlet: PamphletSchema,
  homeAdmissions: HomeAdmissionsSchema,
  whyChooseJct: WhyChooseJctSchema,
  lifeAtJct: LifeAtJctSchema,
  engineeringAnnouncement: AnnouncementSchema,
  engineeringHero: EngineeringHeroSchema,
  engineeringMetrics: MetricsSchema,
  engineeringFacilities: FacilitiesSchema,
  engineeringResearchHighlights: ResearchHighlightsSchema,
  engineeringAdmissions: AdmissionsSchema,
  artsScienceHero: ArtsScienceHeroSchema,
  artsScienceHeroStats: HeroStatsListSchema,
  artsScienceCampusLife: CampusLifeCarouselSchema,
  artsScienceAdmissions: AdmissionsSchema,
  polytechnicHero: PolytechnicHeroSchema,
  polytechnicCampusLife: CampusLifeCarouselSchema,
  polytechnicAdmissions: PolytechnicAdmissionsSchema,
  header: HeaderSchema,
  footer: FooterSchema,
} as const;

export type SiteConfigKey = keyof typeof SITE_CONFIG_SCHEMAS;

const allKeys = Object.keys(SITE_CONFIG_SCHEMAS) as [
  SiteConfigKey,
  ...SiteConfigKey[],
];

export const SiteConfigPutSchema = z
  .object({
    config_key: z.enum(allKeys, {
      error: () => `Unknown config_key. Allowed: ${allKeys.join(", ")}`,
    }),
    value: z.unknown(),
  })
  .superRefine((payload, ctx) => {
    const schema = SITE_CONFIG_SCHEMAS[payload.config_key as SiteConfigKey];
    const parsed = schema.safeParse(payload.value);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ["value", ...issue.path],
        });
      }
    }
  });

export function isKnownSiteConfigKey(key: string): key is SiteConfigKey {
  return key in SITE_CONFIG_SCHEMAS;
}

export function validateSiteConfigValue(key: SiteConfigKey, value: unknown) {
  return SITE_CONFIG_SCHEMAS[key].safeParse(value);
}
