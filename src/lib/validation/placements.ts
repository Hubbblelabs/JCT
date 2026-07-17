import { z } from "zod";
import {
  zEnum,
  zUrl,
  zClampedString,
  zOptionalString,
  zNonNegativeInt,
} from "./_primitives";

// Per-college — placements are not a shared ("all") resource; each college
// owns its own year-wise records.
export const INSTITUTIONS = [
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

export const LIMITS = {
  yearMax: 20,
  summaryMax: 600,
  packageMax: 30,
  nameMax: 120,
  companyMax: 120,
  programMax: 120,
  topRecruitersMax: 60,
  notablePlacementsMax: 40,
  companyPlacementsMax: 80,
  companyStudentsMax: 60,
} as const;

const TopRecruiterSchema = z.object({
  name: zOptionalString(LIMITS.nameMax).default(""),
  logo: zUrl.optional().or(z.literal("")).default(""),
});

const NotablePlacementSchema = z.object({
  name: zOptionalString(LIMITS.nameMax).default(""),
  program: zOptionalString(LIMITS.programMax).default(""),
  company: zOptionalString(LIMITS.companyMax).default(""),
  package: zOptionalString(LIMITS.packageMax).default(""),
  image: zUrl.optional().or(z.literal("")).default(""),
});

const CompanyStudentSchema = z.object({
  name: zOptionalString(LIMITS.nameMax).default(""),
  program: zOptionalString(LIMITS.programMax).default(""),
  package: zOptionalString(LIMITS.packageMax).default(""),
});

const CompanyPlacementSchema = z.object({
  company: zOptionalString(LIMITS.companyMax).default(""),
  logo: zUrl.optional().or(z.literal("")).default(""),
  students: z
    .array(CompanyStudentSchema)
    .max(LIMITS.companyStudentsMax)
    .default([]),
});

// Defaults-free base — .partial()-safe for PATCH payloads (see CLAUDE.md:
// Zod 4 injects .default() values for omitted keys, wiping stored fields).
const PlacementBaseSchema = z.object({
  institution: zEnum(INSTITUTIONS),
  year: zClampedString(1, LIMITS.yearMax, "Year"),
  is_current: z.boolean(),
  summary: zOptionalString(LIMITS.summaryMax),
  highest_package: zOptionalString(LIMITS.packageMax),
  average_package: zOptionalString(LIMITS.packageMax),
  median_package: zOptionalString(LIMITS.packageMax),
  students_placed: zNonNegativeInt,
  total_students: zNonNegativeInt,
  placement_percentage: zNonNegativeInt,
  offers_made: zNonNegativeInt,
  companies_visited: zNonNegativeInt,
  top_recruiters: z.array(TopRecruiterSchema).max(LIMITS.topRecruitersMax),
  notable_placements: z
    .array(NotablePlacementSchema)
    .max(LIMITS.notablePlacementsMax),
  company_placements: z
    .array(CompanyPlacementSchema)
    .max(LIMITS.companyPlacementsMax),
  is_active: z.boolean(),
  sort_order: zNonNegativeInt,
});

export const PlacementCreateSchema = PlacementBaseSchema.extend({
  is_current: z.boolean().optional().default(false),
  summary: zOptionalString(LIMITS.summaryMax).default(""),
  highest_package: zOptionalString(LIMITS.packageMax).default(""),
  average_package: zOptionalString(LIMITS.packageMax).default(""),
  median_package: zOptionalString(LIMITS.packageMax).default(""),
  students_placed: zNonNegativeInt.optional().default(0),
  total_students: zNonNegativeInt.optional().default(0),
  placement_percentage: zNonNegativeInt.optional().default(0),
  offers_made: zNonNegativeInt.optional().default(0),
  companies_visited: zNonNegativeInt.optional().default(0),
  top_recruiters: z
    .array(TopRecruiterSchema)
    .max(LIMITS.topRecruitersMax)
    .optional()
    .default([]),
  notable_placements: z
    .array(NotablePlacementSchema)
    .max(LIMITS.notablePlacementsMax)
    .optional()
    .default([]),
  company_placements: z
    .array(CompanyPlacementSchema)
    .max(LIMITS.companyPlacementsMax)
    .optional()
    .default([]),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const PlacementUpdateSchema = PlacementBaseSchema.partial();

export type PlacementCreateValue = z.infer<typeof PlacementCreateSchema>;
export type PlacementUpdateValue = z.infer<typeof PlacementUpdateSchema>;
export type TopRecruiterValue = z.infer<typeof TopRecruiterSchema>;
export type NotablePlacementValue = z.infer<typeof NotablePlacementSchema>;
export type CompanyPlacementValue = z.infer<typeof CompanyPlacementSchema>;
export type CompanyStudentValue = z.infer<typeof CompanyStudentSchema>;
