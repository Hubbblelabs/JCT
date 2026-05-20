import { z } from "zod";
import {
  zEnum,
  zSlug,
  zUrl,
  zHexColor,
  zClampedString,
  zOptionalString,
  zNonNegativeInt,
} from "./_primitives";

export const INSTITUTIONS = [
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

export const LIMITS = {
  // Card-level limits
  nameMax: 120,
  abbrMax: 16,
  degreeMax: 40,
  durationMax: 20,
  seatsMax: 600,
  highlightMax: 160,
  descriptionMax: 1200,
  outcomesMax: 12,
  outcomeItemMax: 240,

  // Rich content limits
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
  degreePrefixMax: 30,
  heroMetaMax: 6,
  heroMetaLabelMax: 40,
  heroMetaValueMax: 60,
  sectionTitleMax: 80,
  columnHeaderMax: 40,
  subLabelMax: 40,
  iconNameMax: 40,
  sidebarTabsMax: 12,
} as const;

// ── Card-level Program (top-level row fields) ───────────────────────────────

export const ProgramSchema = z.object({
  name: zClampedString(1, LIMITS.nameMax, "Name"),
  abbr: zClampedString(1, LIMITS.abbrMax, "Abbreviation"),
  slug: zSlug,
  institution: zEnum(INSTITUTIONS),
  degree: zOptionalString(LIMITS.degreeMax).default(""),
  duration: zOptionalString(LIMITS.durationMax).default(""),
  seats: zNonNegativeInt
    .max(LIMITS.seatsMax, `Seats must be ≤ ${LIMITS.seatsMax}`)
    .optional()
    .default(60),
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

export const ProgramUpdateSchema = ProgramSchema.partial();

export type ProgramValue = z.infer<typeof ProgramSchema>;

// ── Rich page content (custom-tab override + structured fields) ─────────────

const TabIdSchema = z
  .string()
  .min(1, "Tab ID is required")
  .max(LIMITS.tabIdMax)
  .regex(
    /^[a-z0-9-]+$/i,
    "Tab ID may contain letters, numbers, and dashes only",
  );

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
          label: zClampedString(0, LIMITS.statLabelMax, "Stat label").default(
            "",
          ),
          value: zClampedString(0, LIMITS.statValueMax, "Stat value").default(
            "",
          ),
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
          title: zClampedString(0, LIMITS.cardTitleMax, "Card title").default(
            "",
          ),
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
          qualifications: zOptionalString(
            LIMITS.personQualificationsMax,
          ).default(""),
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

const HeroMetaItemSchema = z.object({
  icon: zOptionalString(LIMITS.iconNameMax).default(""),
  label: zClampedString(0, LIMITS.heroMetaLabelMax, "Hero meta label").default(
    "",
  ),
  value: zClampedString(0, LIMITS.heroMetaValueMax, "Hero meta value").default(
    "",
  ),
});

const TabConfigItemSchema = z.object({
  id: zClampedString(1, LIMITS.tabIdMax, "Tab id"),
  label: zClampedString(0, LIMITS.tabLabelMax, "Tab label").default(""),
  icon: zOptionalString(LIMITS.iconNameMax).default(""),
  visible: z.boolean().optional(),
});

const sectionTitle = zOptionalString(LIMITS.sectionTitleMax);
const columnHeader = zOptionalString(LIMITS.columnHeaderMax);
const subLabel = zOptionalString(LIMITS.subLabelMax);

const OverviewLabelsSchema = z
  .object({
    stats: z
      .object({
        visible: z.boolean().optional(),
        established: subLabel,
        intake: subLabel,
        accreditation: subLabel,
        affiliation: subLabel,
      })
      .partial()
      .optional(),
    about: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    hod: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    visionMission: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        visionLabel: subLabel,
        missionLabel: subLabel,
      })
      .partial()
      .optional(),
    programOutcomes: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
  })
  .partial();

const AcademicsLabelsSchema = z
  .object({
    curriculum: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        colCode: columnHeader,
        colName: columnHeader,
        colCredits: columnHeader,
        colType: columnHeader,
      })
      .partial()
      .optional(),
    teachingLearning: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        methodsLabel: subLabel,
        toolsLabel: subLabel,
        practicesLabel: subLabel,
      })
      .partial()
      .optional(),
    valueAddedCourses: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
  })
  .partial();

const FacultyLabelsSchema = z
  .object({
    coreFaculty: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        colName: columnHeader,
        colDesignation: columnHeader,
        colQualification: columnHeader,
        colExperience: columnHeader,
        colSpecialization: columnHeader,
      })
      .partial()
      .optional(),
    advisoryBoard: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    pac: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    bos: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    boardCols: z
      .object({
        colName: columnHeader,
        colDesignation: columnHeader,
        colOrganization: columnHeader,
        colRole: columnHeader,
      })
      .partial()
      .optional(),
  })
  .partial();

const FacilitiesLabelsSchema = z
  .object({
    labs: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    library: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        digitalAccessLabel: subLabel,
        booksLabel: subLabel,
        journalsLabel: subLabel,
        magazinesLabel: subLabel,
      })
      .partial()
      .optional(),
  })
  .partial();

const LifeLabelsSchema = z
  .object({
    events: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    studentAchievements: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    facultyAchievements: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    magazine: z
      .object({ visible: z.boolean().optional(), title: sectionTitle })
      .partial()
      .optional(),
    participation: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        clubsLabel: subLabel,
        workshopsLabel: subLabel,
      })
      .partial()
      .optional(),
  })
  .partial();

const CareerLabelsSchema = z
  .object({
    careerProgression: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        placementRateLabel: subLabel,
        avgPackageLabel: subLabel,
        topRecruitersLabel: subLabel,
        higherStudiesLabel: subLabel,
      })
      .partial()
      .optional(),
    feedback: z
      .object({
        visible: z.boolean().optional(),
        title: sectionTitle,
        curriculumColTitle: subLabel,
        facilityColTitle: subLabel,
        improvementsColTitle: subLabel,
      })
      .partial()
      .optional(),
  })
  .partial();

const LabelsTreeSchema = z
  .object({
    overview: OverviewLabelsSchema.optional(),
    academics: AcademicsLabelsSchema.optional(),
    faculty: FacultyLabelsSchema.optional(),
    facilities: FacilitiesLabelsSchema.optional(),
    life: LifeLabelsSchema.optional(),
    career: CareerLabelsSchema.optional(),
  })
  .partial();

// Program `content` is loosely typed in MongoDB (Mixed). We validate only the
// parts the public site actually renders; anything else passes through so
// legacy / additional fields keep working.
export const ProgramContentSchema = z
  .object({
    name: zOptionalString(LIMITS.nameMax).default(""),
    shortName: zOptionalString(LIMITS.shortNameMax).default(""),
    heroImage: zUrl.optional().or(z.literal("")),
    accentColor: zHexColor.optional(),
    tabs: z.array(TabSchema).max(LIMITS.tabsMax).optional(),
    degreePrefix: zOptionalString(LIMITS.degreePrefixMax).default(""),
    heroMeta: z.array(HeroMetaItemSchema).max(LIMITS.heroMetaMax).optional(),
    tabsConfig: z
      .array(TabConfigItemSchema)
      .max(LIMITS.sidebarTabsMax)
      .optional(),
    labels: LabelsTreeSchema.optional(),
  })
  .passthrough();

/**
 * Create payload accepted by POST /api/admin/programs: all required card-level
 * fields plus an optional `content` object.
 */
export const ProgramCreateSchema = ProgramSchema.extend({
  content: ProgramContentSchema.optional(),
});

/**
 * Full update payload accepted by PATCH /api/admin/programs/[id]: any subset
 * of card-level fields plus an optional new `content` object.
 */
export const ProgramFullUpdateSchema = ProgramSchema.partial().extend({
  content: ProgramContentSchema.optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export type ProgramContentValue = z.infer<typeof ProgramContentSchema>;
export type SectionValue = z.infer<typeof SectionSchema>;
export type TabValue = z.infer<typeof TabSchema>;
