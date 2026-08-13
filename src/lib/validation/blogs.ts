import { z } from "zod";
import {
  zEnum,
  zSlug,
  zUrl,
  zClampedString,
  zOptionalString,
  zNonNegativeInt,
} from "./_primitives";

// Must match the Blog model enum. A post is owned by exactly one college —
// that is what decides who may edit it — even though every post lists on the
// one institution-agnostic /blogs page.
export const INSTITUTIONS = [
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

// Suggested categories for the admin UI — the field itself is free text so
// editors can introduce new badges without a schema change.
export const BLOG_CATEGORY_SUGGESTIONS = [
  "Admissions",
  "Career Guidance",
  "Courses",
  "Campus Life",
  "Industry Insights",
  "Placements",
  "Research",
  "Student Stories",
] as const;

export const LIMITS = {
  titleMax: 200,
  excerptMax: 400,
  // Long-form posts — several times an event's write-up.
  contentMax: 60000,
  categoryMax: 40,
  authorMax: 120,
} as const;

const zPublishedDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Must be a valid date");

// Defaults-free base — .partial()-safe for PATCH payloads (see CLAUDE.md:
// Zod 4 injects .default() values for omitted keys, wiping stored fields).
const BlogBaseSchema = z.object({
  title: zClampedString(1, LIMITS.titleMax, "Title"),
  slug: zSlug,
  excerpt: zOptionalString(LIMITS.excerptMax),
  content: zOptionalString(LIMITS.contentMax),
  category: zClampedString(1, LIMITS.categoryMax, "Category"),
  author: zOptionalString(LIMITS.authorMax),
  published_at: zPublishedDate,
  image: zUrl.optional().or(z.literal("")),
  institution: zEnum(INSTITUTIONS),
  is_active: z.boolean(),
  sort_order: zNonNegativeInt,
});

export const BlogCreateSchema = BlogBaseSchema.extend({
  excerpt: zOptionalString(LIMITS.excerptMax).default(""),
  content: zOptionalString(LIMITS.contentMax).default(""),
  category: zClampedString(1, LIMITS.categoryMax, "Category").default(
    "Admissions",
  ),
  author: zOptionalString(LIMITS.authorMax).default(""),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const BlogUpdateSchema = BlogBaseSchema.partial();

export type BlogCreateValue = z.infer<typeof BlogCreateSchema>;
export type BlogUpdateValue = z.infer<typeof BlogUpdateSchema>;
