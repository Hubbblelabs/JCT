import { z } from "zod";
import { zUrl, zClampedString, zOptionalString, zNonNegativeInt } from "./_primitives";

export const LIMITS = {
  nameMax: 120,
  industryMax: 80,
  websiteMax: 300,
} as const;

export const RecruiterSchema = z.object({
  name: zClampedString(1, LIMITS.nameMax, "Name"),
  logo: zUrl.optional().or(z.literal("")),
  website: zUrl.optional().or(z.literal("")),
  industry: zOptionalString(LIMITS.industryMax).default(""),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const RecruiterCreateSchema = RecruiterSchema;
export const RecruiterUpdateSchema = RecruiterSchema.partial();

export type RecruiterValue = z.infer<typeof RecruiterSchema>;
