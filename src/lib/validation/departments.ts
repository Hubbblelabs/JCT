import { z } from "zod";
import {
  zEnum,
  zSlug,
  zUrl,
  zHexColor,
  zClampedString,
  zOptionalString,
} from "./_primitives";

export const COLLEGES = ["engineering", "arts-science", "polytechnic"] as const;

export const LIMITS = {
  nameMax: 120,
  shortNameMax: 30,
  tabsMax: 8,
  tabLabelMax: 40,
  tabIdMax: 40,
  sectionsPerTabMax: 20,
  richTextMax: 8000,
  listItemMax: 240,
  listItemsMax: 50,
  statsItemsMax: 12,
  statLabelMax: 40,
  statValueMax: 20,
  statSubMax: 40,
  cardsMax: 24,
  cardTitleMax: 80,
  cardDescriptionMax: 400,
  peopleMax: 40,
  personNameMax: 80,
  personTitleMax: 80,
  personQualificationsMax: 160,
  imageCaptionMax: 200,
} as const;

const TabIdSchema = z
  .string()
  .min(1, "Tab ID is required")
  .max(LIMITS.tabIdMax)
  .regex(/^[a-z0-9-]+$/i, "Tab ID may contain letters, numbers, and dashes only");

const SectionSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("richText"),
    html: zClampedString(0, LIMITS.richTextMax, "Rich text").default(""),
  }),
  z.object({
    kind: z.literal("stats"),
    items: z
      .array(
        z.object({
          label: zClampedString(0, LIMITS.statLabelMax, "Stat label").default(""),
          value: zClampedString(0, LIMITS.statValueMax, "Stat value").default(""),
          sub: zOptionalString(LIMITS.statSubMax).default(""),
        }),
      )
      .max(LIMITS.statsItemsMax)
      .default([]),
  }),
  z.object({
    kind: z.literal("list"),
    title: zOptionalString(LIMITS.cardTitleMax).default(""),
    items: z
      .array(zClampedString(0, LIMITS.listItemMax, "Item"))
      .max(LIMITS.listItemsMax)
      .default([]),
  }),
  z.object({
    kind: z.literal("cards"),
    title: zOptionalString(LIMITS.cardTitleMax).default(""),
    items: z
      .array(
        z.object({
          title: zClampedString(0, LIMITS.cardTitleMax, "Card title").default(""),
          description: zOptionalString(LIMITS.cardDescriptionMax).default(""),
          image: zUrl.optional().or(z.literal("")),
        }),
      )
      .max(LIMITS.cardsMax)
      .default([]),
  }),
  z.object({
    kind: z.literal("image"),
    src: zUrl,
    caption: zOptionalString(LIMITS.imageCaptionMax).default(""),
  }),
  z.object({
    kind: z.literal("people"),
    items: z
      .array(
        z.object({
          name: zClampedString(1, LIMITS.personNameMax, "Name"),
          title: zClampedString(0, LIMITS.personTitleMax, "Title").default(""),
          image: zUrl.optional().or(z.literal("")),
          email: z
            .string()
            .max(200)
            .refine(
              (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
              "Must be a valid email",
            )
            .optional()
            .or(z.literal("")),
          qualifications: zOptionalString(LIMITS.personQualificationsMax).default(""),
        }),
      )
      .max(LIMITS.peopleMax)
      .default([]),
  }),
]);

const TabSchema = z.object({
  id: TabIdSchema,
  label: zClampedString(1, LIMITS.tabLabelMax, "Tab label"),
  icon: zOptionalString(40).default(""),
  sections: z.array(SectionSchema).max(LIMITS.sectionsPerTabMax).default([]),
});

// The department `content` field is loosely typed in MongoDB (Mixed). We
// validate only the parts the public site actually renders. Anything else
// is allowed to pass through so legacy fields keep working until migrated.
export const DepartmentContentSchema = z
  .object({
    name: zOptionalString(LIMITS.nameMax).default(""),
    shortName: zOptionalString(LIMITS.shortNameMax).default(""),
    heroImage: zUrl.optional().or(z.literal("")),
    accentColor: zHexColor.optional(),
    tabs: z.array(TabSchema).max(LIMITS.tabsMax).optional(),
  })
  .passthrough();

export const DepartmentCreateSchema = z.object({
  slug: zSlug,
  college: zEnum(COLLEGES),
  content: DepartmentContentSchema.optional(),
});

export const DepartmentUpdateSchema = z.object({
  slug: zSlug.optional(),
  college: zEnum(COLLEGES).optional(),
  content: DepartmentContentSchema.optional(),
});

export type DepartmentContentValue = z.infer<typeof DepartmentContentSchema>;
export type SectionValue = z.infer<typeof SectionSchema>;
export type TabValue = z.infer<typeof TabSchema>;
