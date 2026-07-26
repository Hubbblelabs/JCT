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
import { PlacementInfoSchema } from "./placementInfo";
import { HeaderSchema, FooterSchema } from "./globalCms";
import { FloatingElementsSchema } from "./floatingElements";
import { CampusLifePageSchema } from "./campusLifePage";
import { AccreditationsPageSchema } from "./accreditationsPage";
import { NaacPageSchema } from "./naacPage";
import { ContentPageSchema } from "./contentPage";
import { NavbarSchema } from "./navbar";
import { SeoPagesSchema } from "./seo";
import {
  ResearchPageSchema,
  GroupsPageSchema,
  DocumentsPageSchema,
} from "./engineeringPages";

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
  engineeringLifeAtJct: LifeAtJctSchema,
  artsScienceHero: ArtsScienceHeroSchema,
  artsScienceHeroStats: HeroStatsListSchema,
  artsScienceLifeAtJct: LifeAtJctSchema,
  artsScienceAdmissions: AdmissionsSchema,
  polytechnicHero: PolytechnicHeroSchema,
  polytechnicLifeAtJct: LifeAtJctSchema,
  polytechnicAdmissions: PolytechnicAdmissionsSchema,
  mainPlacementHighlights: RecruitersSectionSchema,
  engineeringPlacementHighlights: RecruitersSectionSchema,
  artsSciencePlacementHighlights: RecruitersSectionSchema,
  polytechnicPlacementHighlights: RecruitersSectionSchema,
  engineeringPlacementInfo: PlacementInfoSchema,
  artsSciencePlacementInfo: PlacementInfoSchema,
  polytechnicPlacementInfo: PlacementInfoSchema,
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
  engineeringResearch: ResearchPageSchema,
  engineeringClubs: GroupsPageSchema,
  engineeringCommittees: GroupsPageSchema,
  engineeringDocuments: DocumentsPageSchema,
  polytechnicCommittees: GroupsPageSchema,
  campusLifePage: CampusLifePageSchema,
  mainAccreditations: AccreditationsPageSchema,
  engineeringAccreditations: AccreditationsPageSchema,
  engineeringNaac: NaacPageSchema,
  artsScienceAccreditations: AccreditationsPageSchema,
  polytechnicAccreditations: AccreditationsPageSchema,
  // Block-based content pages — one key per entry in src/lib/content-pages.ts.
  engineeringLibrary: ContentPageSchema,
  engineeringNirf: ContentPageSchema,
  engineeringTimeline: ContentPageSchema,
  engineeringProfessionalBodies: ContentPageSchema,
  engineeringCyberSafety: ContentPageSchema,
  engineeringNaacBestPractices: ContentPageSchema,
  engineeringNaacDistinctiveness: ContentPageSchema,
  engineeringNaacAqar: ContentPageSchema,
  engineeringFinancialStatements: ContentPageSchema,
  engineeringIctContent: ContentPageSchema,
  engineeringNss: ContentPageSchema,
  engineeringFeedbackSystem: ContentPageSchema,
  polytechnicFineArtsClub: ContentPageSchema,
  engineeringPlacementGallery: ContentPageSchema,
  // Per-page meta title/description, keyed by public route path.
  mainSeo: SeoPagesSchema,
  engineeringSeo: SeoPagesSchema,
  artsScienceSeo: SeoPagesSchema,
  polytechnicSeo: SeoPagesSchema,
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
  engineeringResearch: "engineering",
  engineeringClubs: "engineering",
  engineeringCommittees: "engineering",
  engineeringDocuments: "engineering",
  engineeringNaac: "engineering",
  engineeringHeader: "engineering",
  engineeringNavbar: "engineering",
  engineeringLifeAtJct: "engineering",
  engineeringPlacementHighlights: "engineering",
  artsSciencePlacementHighlights: "arts-science",
  polytechnicPlacementHighlights: "polytechnic",
  engineeringPlacementInfo: "engineering",
  artsSciencePlacementInfo: "arts-science",
  polytechnicPlacementInfo: "polytechnic",
  artsScienceHero: "arts-science",
  artsScienceHeroStats: "arts-science",
  artsScienceLifeAtJct: "arts-science",
  artsScienceAdmissions: "arts-science",
  artsScienceAbout: "arts-science",
  artsScienceHeader: "arts-science",
  artsScienceNavbar: "arts-science",
  polytechnicCommittees: "polytechnic",
  polytechnicFineArtsClub: "polytechnic",
  polytechnicHero: "polytechnic",
  polytechnicLifeAtJct: "polytechnic",
  polytechnicAdmissions: "polytechnic",
  polytechnicAbout: "polytechnic",
  polytechnicHeader: "polytechnic",
  polytechnicNavbar: "polytechnic",
  engineeringAccreditations: "engineering",
  artsScienceAccreditations: "arts-science",
  polytechnicAccreditations: "polytechnic",
  engineeringLibrary: "engineering",
  engineeringNirf: "engineering",
  engineeringTimeline: "engineering",
  engineeringProfessionalBodies: "engineering",
  engineeringCyberSafety: "engineering",
  engineeringNaacBestPractices: "engineering",
  engineeringNaacDistinctiveness: "engineering",
  engineeringNaacAqar: "engineering",
  engineeringFinancialStatements: "engineering",
  engineeringIctContent: "engineering",
  engineeringNss: "engineering",
  engineeringFeedbackSystem: "engineering",
  engineeringPlacementGallery: "engineering",
  engineeringSeo: "engineering",
  artsScienceSeo: "arts-science",
  polytechnicSeo: "polytechnic",
};

export function validateSiteConfigValue(key: SiteConfigKey, value: unknown) {
  return SITE_CONFIG_SCHEMAS[key].safeParse(value);
}
