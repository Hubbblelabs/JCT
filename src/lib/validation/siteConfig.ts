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
import {
  EngineeringAboutSchema,
  ArtsScienceAboutSchema,
  PolytechnicAboutSchema,
  MainAboutSchema,
  CoePageSchema,
} from "./aboutPage";
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
import {
  WhyChooseJctSchema,
  HomeAdmissionsSchema,
  HomeStatisticsSchema,
} from "./homeSections";
import { RecruitersSectionSchema } from "./recruiters";
import { HeaderSchema, FooterSchema } from "./globalCms";
import { FloatingElementsSchema } from "./floatingElements";
import { CampusLifePageSchema } from "./campusLifePage";
import { NavbarSchema } from "./navbar";

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
  homeStatistics: HomeStatisticsSchema,
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
  recruitersSection: RecruitersSectionSchema,
  header: HeaderSchema,
  mainHeader: HeaderSchema,
  engineeringHeader: HeaderSchema,
  artsScienceHeader: HeaderSchema,
  polytechnicHeader: HeaderSchema,
  mainNavbar: NavbarSchema,
  engineeringNavbar: NavbarSchema,
  artsScienceNavbar: NavbarSchema,
  polytechnicNavbar: NavbarSchema,
  footer: FooterSchema,
  floatingElements: FloatingElementsSchema,
  mainAbout: MainAboutSchema,
  engineeringAbout: EngineeringAboutSchema,
  artsScienceAbout: ArtsScienceAboutSchema,
  polytechnicAbout: PolytechnicAboutSchema,
  engineeringCoe: CoePageSchema,
  campusLifePage: CampusLifePageSchema,
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

// Maps college-specific config keys to their institution.
// Keys absent from this map are global (admin-only writes).
export const SITE_CONFIG_KEY_INSTITUTION: Partial<
  Record<SiteConfigKey, "engineering" | "arts-science" | "polytechnic">
> = {
  engineeringAnnouncement: "engineering",
  engineeringHero: "engineering",
  engineeringMetrics: "engineering",
  engineeringFacilities: "engineering",
  engineeringResearchHighlights: "engineering",
  engineeringAdmissions: "engineering",
  engineeringAbout: "engineering",
  engineeringCoe: "engineering",
  engineeringHeader: "engineering",
  engineeringNavbar: "engineering",
  artsScienceHero: "arts-science",
  artsScienceHeroStats: "arts-science",
  artsScienceCampusLife: "arts-science",
  artsScienceAdmissions: "arts-science",
  artsScienceAbout: "arts-science",
  artsScienceHeader: "arts-science",
  artsScienceNavbar: "arts-science",
  polytechnicHero: "polytechnic",
  polytechnicCampusLife: "polytechnic",
  polytechnicAdmissions: "polytechnic",
  polytechnicAbout: "polytechnic",
  polytechnicHeader: "polytechnic",
  polytechnicNavbar: "polytechnic",
};

export function validateSiteConfigValue(key: SiteConfigKey, value: unknown) {
  return SITE_CONFIG_SCHEMAS[key].safeParse(value);
}
