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

export { AnnouncementSchema, LIMITS as LIMITS_announcement } from "./announcement";
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
  LIMITS as LIMITS_recruiter,
} from "./recruiters";
export type { RecruiterValue } from "./recruiters";

export {
  ProgramSchema,
  ProgramCreateSchema,
  ProgramUpdateSchema,
  INSTITUTIONS as PROGRAM_INSTITUTIONS,
  LIMITS as LIMITS_program,
} from "./programs";
export type { ProgramValue } from "./programs";

export {
  DepartmentCreateSchema,
  DepartmentUpdateSchema,
  DepartmentContentSchema,
  COLLEGES as DEPARTMENT_COLLEGES,
  LIMITS as LIMITS_department,
} from "./departments";
export type { DepartmentContentValue, SectionValue, TabValue } from "./departments";

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
  SITE_CONFIG_SCHEMAS,
  SiteConfigPutSchema,
  isKnownSiteConfigKey,
  validateSiteConfigValue,
} from "./siteConfig";
export type { SiteConfigKey } from "./siteConfig";
