// Barrel — every domain schema and its LIMITS constants in one import.
// Import e.g. `import { PamphletSchema, LIMITS_pamphlet } from "@/lib/validation"`.

export * from "./_primitives";

export { PamphletSchema, LIMITS as LIMITS_pamphlet } from "./pamphlet";
export type { PamphletValue } from "./pamphlet";

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
  CampusLifeCarouselSchema,
  LIMITS as LIMITS_campusLifeCarousel,
} from "./campusLifeCarousel";
export type { CampusLifeCarouselValue } from "./campusLifeCarousel";

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
  RecruiterSchema,
  RecruiterCreateSchema,
  RecruiterUpdateSchema,
  RecruitersSectionSchema,
  LIMITS as LIMITS_recruiter,
  RECRUITERS_SECTION_LIMITS,
} from "./recruiters";
export type { RecruiterValue, RecruitersSectionValue } from "./recruiters";

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

export {
  AdmissionsSchema,
  ADMISSIONS_LIMITS,
} from "./admissions";
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
  SITE_CONFIG_SCHEMAS,
  SiteConfigPutSchema,
  isKnownSiteConfigKey,
  validateSiteConfigValue,
} from "./siteConfig";
export type { SiteConfigKey } from "./siteConfig";
