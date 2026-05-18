import { z } from "zod";
import { zEnum, zUrl, zClampedString, zOptionalString, zNonNegativeInt } from "./_primitives";

// Must match the Testimonial model enums.
export const CATEGORIES = ["Alumni", "Student", "Industry"] as const;
export const INSTITUTIONS = ["engineering", "arts-science", "polytechnic", "all"] as const;

export const LIMITS = {
  nameMax: 80,
  batchMax: 12,
  courseMax: 80,
  companyMax: 80,
  quoteMax: 600,
} as const;

export const TestimonialSchema = z.object({
  name: zClampedString(1, LIMITS.nameMax, "Name"),
  batch: zClampedString(1, LIMITS.batchMax, "Batch"),
  course: zOptionalString(LIMITS.courseMax).default(""),
  company: zOptionalString(LIMITS.companyMax).default(""),
  quote: zClampedString(1, LIMITS.quoteMax, "Quote"),
  avatar: zUrl.optional().or(z.literal("")),
  category: zEnum(CATEGORIES).default("Alumni"),
  institution: zEnum(INSTITUTIONS).default("all"),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const TestimonialCreateSchema = TestimonialSchema;
export const TestimonialUpdateSchema = TestimonialSchema.partial();

export type TestimonialValue = z.infer<typeof TestimonialSchema>;
