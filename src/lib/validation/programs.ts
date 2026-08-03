import { z } from "zod";
import {
  zEnum,
  zSlug,
  zUrl,
  zClampedString,
  zOptionalString,
  zNonNegativeInt,
} from "./_primitives";
import { PageBodySectionSchema } from "./pages";
import { ProgramSeoSchema } from "./seo";

export const INSTITUTIONS = [
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

export const LIMITS = {
  // Card-level limits
  nameMax: 120,
  abbrMax: 16,
  degreeMax: 60,
  durationMax: 60,
  highlightMax: 160,
  cardDescriptionTextMax: 600,
  outcomesMax: 12,
  outcomeItemMax: 240,
  accreditationsMax: 6,
  accreditationNameMax: 60,
  accreditationLogoMax: 500,

  // Rich content limits
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

/**
 * One accreditation badge on a program card. `logo` holds an R2 storage key
 * (or an absolute URL) — never a path into /public.
 */
const ProgramAccreditationItemSchema = z.object({
  name: zOptionalString(LIMITS.accreditationNameMax).default(""),
  logo: zOptionalString(LIMITS.accreditationLogoMax).default(""),
});

// Base shape WITHOUT defaults. In Zod 4, `.partial()` of a defaulted field
// still injects the default when the key is omitted, so a partial PATCH like
// `{ is_active: false }` would silently reset `outcomes` / `sort_order` on
// the stored document. Defaults therefore live only on the create-side
// ProgramSchema below (same pattern as TestimonialUpdateSchema).
const ProgramBaseSchema = z.object({
  name: zClampedString(1, LIMITS.nameMax, "Name"),
  abbr: zClampedString(1, LIMITS.abbrMax, "Abbreviation"),
  slug: zSlug,
  institution: zEnum(INSTITUTIONS),
  degree: zOptionalString(LIMITS.degreeMax),
  duration: zOptionalString(LIMITS.durationMax),
  seats: zNonNegativeInt,
  highlight: zOptionalString(LIMITS.highlightMax),
  description: zOptionalString(LIMITS.cardDescriptionTextMax),
  image: zUrl.optional().or(z.literal("")),
  outcomes: z
    .array(zClampedString(0, LIMITS.outcomeItemMax, "Outcome"))
    .max(LIMITS.outcomesMax),
  accreditations: z
    .array(ProgramAccreditationItemSchema)
    .max(LIMITS.accreditationsMax),
  is_active: z.boolean(),
  sort_order: zNonNegativeInt,
});

export const ProgramSchema = ProgramBaseSchema.extend({
  degree: zOptionalString(LIMITS.degreeMax).default(""),
  duration: zOptionalString(LIMITS.durationMax).default(""),
  seats: zNonNegativeInt.optional().default(0),
  highlight: zOptionalString(LIMITS.highlightMax).default(""),
  description: zOptionalString(LIMITS.cardDescriptionTextMax).default(""),
  outcomes: z
    .array(zClampedString(0, LIMITS.outcomeItemMax, "Outcome"))
    .max(LIMITS.outcomesMax)
    .optional()
    .default([]),
  accreditations: z
    .array(ProgramAccreditationItemSchema)
    .max(LIMITS.accreditationsMax)
    .optional()
    .default([]),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const ProgramUpdateSchema = ProgramBaseSchema.partial();

export type ProgramValue = z.infer<typeof ProgramSchema>;

// -- Rich page content (structured fields) ----------------------------------

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
  // When `href` is set, this entry renders as a sidebar link (not a tab activator).
  // Used to add external URLs or links to dynamically created pages.
  href: zOptionalString(500).default(""),
  // Custom content tab: rich blocks rendered as this tab's page content.
  blocks: z.array(PageBodySectionSchema).optional(),
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
    heroImage: zUrl.optional().or(z.literal("")),
    // `tabs` used to be declared here — a second content model that no public
    // layout ever rendered. Removed with its editor and renderer; any legacy
    // key still on a stored document passes through untouched below.
    heroMeta: z.array(HeroMetaItemSchema).max(LIMITS.heroMetaMax).optional(),
    tabsConfig: z
      .array(TabConfigItemSchema)
      .max(LIMITS.sidebarTabsMax)
      .optional(),
    labels: LabelsTreeSchema.optional(),
    // Meta title/description for the program's public detail page. Lives in
    // `content` so it follows the program's draft → publish cycle.
    seo: ProgramSeoSchema.optional(),
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
 *
 * `status` deliberately excludes "published" — publishing must go through
 * POST /api/admin/programs/[id]/publish (admin-only), which also snapshots
 * `content` into `published_content`. Allowing it here would let editors
 * flip a program live and bypass that flow.
 */
export const ProgramFullUpdateSchema = ProgramBaseSchema.partial().extend({
  content: ProgramContentSchema.optional(),
  status: z.enum(["draft", "archived"]).optional(),
});

export type ProgramContentValue = z.infer<typeof ProgramContentSchema>;
