import { z } from "zod";
import {
  zEnum,
  zSlug,
  zUrl,
  zClampedString,
  zOptionalString,
  zNonNegativeInt,
} from "./_primitives";

export const INSTITUTIONS = ["engineering", "arts-science", "polytechnic"] as const;

export const LIMITS = {
  nameMax: 120,
  abbrMax: 16,
  degreeMax: 40,
  durationMax: 20,
  seatsMax: 600,
  highlightMax: 160,
  descriptionMax: 1200,
  outcomesMax: 12,
  outcomeItemMax: 240,
} as const;

export const ProgramSchema = z.object({
  name: zClampedString(1, LIMITS.nameMax, "Name"),
  abbr: zClampedString(1, LIMITS.abbrMax, "Abbreviation"),
  slug: zSlug,
  institution: zEnum(INSTITUTIONS),
  degree: zOptionalString(LIMITS.degreeMax).default(""),
  duration: zOptionalString(LIMITS.durationMax).default(""),
  seats: zNonNegativeInt.max(LIMITS.seatsMax, `Seats must be ≤ ${LIMITS.seatsMax}`).optional().default(60),
  image: zUrl.optional().or(z.literal("")),
  highlight: zOptionalString(LIMITS.highlightMax).default(""),
  description: zOptionalString(LIMITS.descriptionMax).default(""),
  outcomes: z
    .array(zClampedString(0, LIMITS.outcomeItemMax, "Outcome"))
    .max(LIMITS.outcomesMax)
    .optional()
    .default([]),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const ProgramCreateSchema = ProgramSchema;
export const ProgramUpdateSchema = ProgramSchema.partial();

export type ProgramValue = z.infer<typeof ProgramSchema>;
