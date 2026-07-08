// Barrel — every domain schema and its LIMITS constants in one import.
// Import e.g. `import { PamphletSchema, LIMITS_pamphlet } from "@/lib/validation"`.

export * from "./_primitives";

export {
  PamphletSchema,
  PamphletSlotSchema,
  PamphletVirtualTourSchema,
  PamphletLayoutSchema,
  PAMPHLET_LAYOUTS,
  LIMITS as LIMITS_pamphlet,
} from "./pamphlet";
export type {
  PamphletValue,
  PamphletSlot,
  PamphletVirtualTour,
  PamphletLayout,
} from "./pamphlet";

export {
  HomeHeroSchema,
  EngineeringHeroSchema,
  ArtsScienceHeroSchema,
  PolytechnicHeroSchema,
  HOME_LIMITS,
  ENG_HERO_LIMITS,
  ARTS_HERO_LIMITS,
  POLY_HERO_LIMITS,
} from "./hero";
export type {
  HomeHeroValue,
  EngineeringHeroValue,
  ArtsScienceHeroValue,
  PolytechnicHeroValue,
} from "./hero";

export {
  AnnouncementSchema,
  LIMITS as LIMITS_announcement,
} from "./announcement";
export type { AnnouncementValue } from "./announcement";

export { LifeAtJctSchema, LIMITS as LIMITS_lifeAtJct } from "./lifeAtJct";
export type { LifeAtJctValue } from "./lifeAtJct";

export {
  PolytechnicAdmissionsSchema,
  LIMITS as LIMITS_polytechnicAdmissions,
} from "./polytechnicAdmissions";
export type { PolytechnicAdmissionsValue } from "./polytechnicAdmissions";

export {
  MetricsSchema,
  FacilitiesSchema,
  ResearchHighlightsSchema,
  METRICS_LIMITS,
  FACILITIES_LIMITS,
  RESEARCH_HIGHLIGHTS_LIMITS,
} from "./engineeringSections";

export {
  TestimonialSchema,
  TestimonialCreateSchema,
  TestimonialUpdateSchema,
  CATEGORIES as TESTIMONIAL_CATEGORIES,
  INSTITUTIONS as TESTIMONIAL_INSTITUTIONS,
  LIMITS as LIMITS_testimonial,
} from "./testimonials";
export type { TestimonialValue } from "./testimonials";

export {
  EventCreateSchema,
  EventUpdateSchema,
  EVENT_CATEGORY_SUGGESTIONS,
  INSTITUTIONS as EVENT_INSTITUTIONS,
  LIMITS as LIMITS_event,
} from "./events";
export type { EventCreateValue, EventUpdateValue } from "./events";

export {
  PlacementCreateSchema,
  PlacementUpdateSchema,
  INSTITUTIONS as PLACEMENT_INSTITUTIONS,
  LIMITS as LIMITS_placement,
} from "./placements";
export type {
  PlacementCreateValue,
  PlacementUpdateValue,
  TopRecruiterValue,
  NotablePlacementValue,
} from "./placements";

export {
  RecruitersSectionSchema,
  RECRUITERS_SECTION_LIMITS,
} from "./recruiters";
export type { RecruitersSectionValue } from "./recruiters";

export {
  ProgramSchema,
  ProgramCreateSchema,
  ProgramUpdateSchema,
  ProgramFullUpdateSchema,
  ProgramContentSchema,
  INSTITUTIONS as PROGRAM_INSTITUTIONS,
  LIMITS as LIMITS_program,
} from "./programs";
export type {
  ProgramValue,
  ProgramContentValue,
  SectionValue,
  TabValue,
} from "./programs";

export {
  UserCreateSchema,
  UserUpdateSchema,
  ROLES as USER_ROLES,
  INSTITUTIONS as USER_INSTITUTIONS,
  LIMITS as LIMITS_user,
} from "./users";
export type { UserCreateValue, UserUpdateValue } from "./users";

export {
  ImageUploadFieldsSchema,
  ImageAssetPatchSchema,
  IMAGE_CATEGORIES,
  IMAGE_INSTITUTIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  CATEGORY_RULES,
} from "./imageAsset";
export type { CategoryRule, ImageUploadFields } from "./imageAsset";

export {
  ContactSchema,
  SocialSchema,
  AddressSchema,
  StatsSchema,
  AccreditationsSchema,
  HeroStatsListSchema,
  CONTACT_LIMITS,
  ADDRESS_LIMITS,
  STATS_LIMITS,
  ACCREDITATIONS_LIMITS,
  HERO_STATS_LIMITS,
} from "./siteInfo";
export type {
  ContactValue,
  SocialValue,
  AddressValue,
  StatsValue,
  AccreditationsValue,
  HeroStatsListValue,
} from "./siteInfo";

export { AdmissionsSchema, ADMISSIONS_LIMITS } from "./admissions";
export type { AdmissionsValue } from "./admissions";

export {
  WhyChooseJctSchema,
  HomeAdmissionsSchema,
  HomeStatisticsSchema,
  WHY_CHOOSE_JCT_LIMITS,
  HOME_ADMISSIONS_LIMITS,
  HOME_STATISTICS_LIMITS,
} from "./homeSections";
export type {
  WhyChooseJctValue,
  HomeAdmissionsValue,
  HomeStatisticsValue,
} from "./homeSections";

export {
  HeaderSchema,
  FooterSchema,
  HEADER_LIMITS,
  FOOTER_LIMITS,
} from "./globalCms";
export type { HeaderValue, FooterValue } from "./globalCms";

export {
  NavbarSchema,
  NavbarItemSchema,
  NavbarChildSchema,
  NAVBAR_LIMITS,
} from "./navbar";
export type { NavbarValue, NavbarItem, NavbarChild } from "./navbar";

export {
  SidebarNavItemSchema,
  SidebarNavOverrideSchema,
  SIDEBAR_NAV_LIMITS,
} from "./sidebarNav";
export type { SidebarNavItem, SidebarNavOverride } from "./sidebarNav";

export {
  PageDocumentSchema,
  PageCreateSchema,
  PageUpdateSchema,
  PageContentSchema,
  PageSeoSchema,
  PageHeroSchema,
  PageBodySectionSchema,
  PageSidebarSchema,
  PageGallerySchema,
  PageContactSchema,
  PAGE_INSTITUTIONS,
  PAGE_TEMPLATES,
  PAGE_STATUSES,
  PAGE_LIMITS,
} from "./pages";
export type {
  PageCreateValue,
  PageUpdateValue,
  PageContent,
  PageSeo,
  PageHero,
  PageBodySection,
  PageInstitution,
  PageTemplate,
  PageStatus,
} from "./pages";

export {
  SITE_CONFIG_SCHEMAS,
  SiteConfigPutSchema,
  isKnownSiteConfigKey,
  validateSiteConfigValue,
  SITE_CONFIG_KEY_INSTITUTION,
} from "./siteConfig";
export type { SiteConfigKey } from "./siteConfig";

export {
  FloatingElementsSchema,
  FLOATING_ELEMENTS_LIMITS,
} from "./floatingElements";
export type { FloatingElementsValue } from "./floatingElements";

export {
  EngineeringAboutSchema,
  ArtsScienceAboutSchema,
  PolytechnicAboutSchema,
  MainAboutSchema,
  CoePageSchema,
} from "./aboutPage";
export type {
  EngineeringAboutValue,
  ArtsScienceAboutValue,
  PolytechnicAboutValue,
  MainAboutValue,
  CoePageValue,
  AboutPageValue,
} from "./aboutPage";

export { CampusLifePageSchema, CAMPUS_LIFE_LIMITS } from "./campusLifePage";
export type { CampusLifePageValue } from "./campusLifePage";

export {
  AccreditationsPageSchema,
  ACCREDITATIONS_PAGE_LIMITS,
} from "./accreditationsPage";
export type {
  AccreditationsPageValue,
  AccreditationItemValue,
} from "./accreditationsPage";
