import { z } from "zod";

// ──────────────────────────────────────────────────────────────────────────
// Standalone Engineering sub-pages, each backed by its own SiteConfig key
// (see SITE_CONFIG_SCHEMAS):
//   engineeringResearch    -> /institutions/engineering/research
//   engineeringClubs       -> /institutions/engineering/clubs-and-cells
//   engineeringCommittees  -> /institutions/engineering/committees
//   engineeringDocuments   -> /institutions/engineering/documents
//
// Clubs & Cells and Committees are the same shape — a list of groups with
// members — so they share GroupsPageSchema and one layout/inspector pair.
// ──────────────────────────────────────────────────────────────────────────

const s = (max: number) => z.string().max(max).default("");

const HeroSchema = z
  .object({
    title: s(200),
    subtitle: s(500),
  })
  .default({ title: "", subtitle: "" });

// ─── Research ────────────────────────────────────────────────────────────────

export const RESEARCH_PAGE_LIMITS = {
  introMax: 8,
  statsMax: 8,
  areasMax: 24,
  centresMax: 24,
  publicationsMax: 60,
  focusMax: 12,
  // Sidebar tabs. `tabListMax` is generous because a single tab can hold a long
  // reference list (e.g. the funding-agency roll).
  tabsMax: 12,
  tabSectionsMax: 20,
  tabListMax: 80,
  tabCardsMax: 24,
  tabPeopleMax: 60,
} as const;

const ResearchStatSchema = z.object({
  value: s(30),
  label: s(60),
});

const ResearchAreaSchema = z.object({
  title: s(120),
  desc: s(600),
});

const ResearchCentreSchema = z.object({
  name: s(160),
  head: s(160),
  description: s(1200),
  image: s(500),
  focus: z.array(s(120)).max(RESEARCH_PAGE_LIMITS.focusMax).default([]),
});

const PublicationSchema = z.object({
  title: s(300),
  authors: s(300),
  journal: s(200),
  year: s(10),
  link: s(500),
});

// ─── Research sidebar tabs ───────────────────────────────────────────────────
// Mirrors the Tab/Section shape in src/lib/program-tabs.ts so the Research page
// renders through the same sidebar-tabs pattern as a program page, and the admin
// can drive it with the existing <ProgramTabsEditor />. Program content is a
// `Mixed` Mongo field validated only at read time; a SiteConfig key is validated
// on every write, so the same shape is restated here as Zod.
//
// `richText` is the only untrusted-HTML carrier — always render it through
// sanitizeHtml(), which allows tables and links but strips scripts and styles.

const ResearchTabSectionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("richText"), html: s(20000) }),
  z.object({
    kind: z.literal("stats"),
    items: z
      .array(z.object({ label: s(60), value: s(30), sub: s(60).optional() }))
      .max(RESEARCH_PAGE_LIMITS.statsMax)
      .default([]),
  }),
  z.object({
    kind: z.literal("list"),
    title: s(160).optional(),
    items: z.array(s(600)).max(RESEARCH_PAGE_LIMITS.tabListMax).default([]),
  }),
  z.object({
    kind: z.literal("cards"),
    title: s(160).optional(),
    items: z
      .array(
        z.object({
          title: s(200),
          description: s(1200),
          image: s(500).optional(),
        }),
      )
      .max(RESEARCH_PAGE_LIMITS.tabCardsMax)
      .default([]),
  }),
  z.object({
    kind: z.literal("image"),
    src: s(500),
    caption: s(300).optional(),
  }),
  z.object({
    kind: z.literal("people"),
    items: z
      .array(
        z.object({
          name: s(160),
          title: s(200),
          image: s(500).optional(),
          email: s(200).optional(),
          qualifications: s(300).optional(),
        }),
      )
      .max(RESEARCH_PAGE_LIMITS.tabPeopleMax)
      .default([]),
  }),
]);

const ResearchTabSchema = z.object({
  id: s(60),
  label: s(120),
  icon: s(40).optional(),
  sections: z
    .array(ResearchTabSectionSchema)
    .max(RESEARCH_PAGE_LIMITS.tabSectionsMax)
    .default([]),
});

export const ResearchPageSchema = z.object({
  hero: HeroSchema,
  // When non-empty the page renders as sidebar tabs (programs-style) and the
  // flat sections below are ignored. Empty keeps the original single-column
  // layout, so this is additive for any page that predates tabs.
  tabs: z.array(ResearchTabSchema).max(RESEARCH_PAGE_LIMITS.tabsMax).default([]),
  intro: z.array(s(2000)).max(RESEARCH_PAGE_LIMITS.introMax).default([]),
  stats: z
    .array(ResearchStatSchema)
    .max(RESEARCH_PAGE_LIMITS.statsMax)
    .default([]),
  areas: z
    .array(ResearchAreaSchema)
    .max(RESEARCH_PAGE_LIMITS.areasMax)
    .default([]),
  centres: z
    .array(ResearchCentreSchema)
    .max(RESEARCH_PAGE_LIMITS.centresMax)
    .default([]),
  publications: z
    .array(PublicationSchema)
    .max(RESEARCH_PAGE_LIMITS.publicationsMax)
    .default([]),
});

export type ResearchPageValue = z.infer<typeof ResearchPageSchema>;
export type ResearchTabValue = z.infer<typeof ResearchTabSchema>;
export type ResearchTabSectionValue = z.infer<typeof ResearchTabSectionSchema>;
export type ResearchCentreValue = z.infer<typeof ResearchCentreSchema>;
export type PublicationValue = z.infer<typeof PublicationSchema>;

// ─── Clubs & Cells / Committees ──────────────────────────────────────────────

export const GROUPS_PAGE_LIMITS = {
  introMax: 8,
  groupsMax: 60,
  membersMax: 40,
  activitiesMax: 20,
} as const;

const GroupMemberSchema = z.object({
  name: s(160),
  /** The "Category" column on the published committee tables — Member, Chairperson, … */
  role: s(160),
  dept: s(200),
  /** Phone or email published alongside the member. */
  contact: s(120),
});

const GroupSchema = z.object({
  name: s(200),
  /**
   * Optional URL override for the detail page. Blank means "derive from name"
   * (see src/lib/group-slugs.ts) — set it only to keep a published URL stable
   * across a rename.
   */
  slug: s(80),
  category: s(120),
  description: s(1500),
  image: s(500),
  convenor: s(160),
  convenorRole: s(160),
  email: s(200),
  members: z
    .array(GroupMemberSchema)
    .max(GROUPS_PAGE_LIMITS.membersMax)
    .default([]),
  activities: z
    .array(s(300))
    .max(GROUPS_PAGE_LIMITS.activitiesMax)
    .default([]),
});

export const GroupsPageSchema = z.object({
  hero: HeroSchema,
  intro: z.array(s(2000)).max(GROUPS_PAGE_LIMITS.introMax).default([]),
  groups: z.array(GroupSchema).max(GROUPS_PAGE_LIMITS.groupsMax).default([]),
});

export type GroupsPageValue = z.infer<typeof GroupsPageSchema>;
export type GroupValue = z.infer<typeof GroupSchema>;
export type GroupMemberValue = z.infer<typeof GroupMemberSchema>;

// ─── Documents / Downloads ───────────────────────────────────────────────────

export const DOCUMENTS_PAGE_LIMITS = {
  introMax: 8,
  categoriesMax: 24,
  documentsMax: 60,
} as const;

const DocumentItemSchema = z.object({
  title: s(250),
  description: s(800),
  /** R2 storage key from the document uploader, or an external URL. */
  file: s(500),
  updatedOn: s(60),
});

const DocumentCategorySchema = z.object({
  title: s(160),
  description: s(600),
  documents: z
    .array(DocumentItemSchema)
    .max(DOCUMENTS_PAGE_LIMITS.documentsMax)
    .default([]),
});

export const DocumentsPageSchema = z.object({
  hero: HeroSchema,
  intro: z.array(s(2000)).max(DOCUMENTS_PAGE_LIMITS.introMax).default([]),
  categories: z
    .array(DocumentCategorySchema)
    .max(DOCUMENTS_PAGE_LIMITS.categoriesMax)
    .default([]),
});

export type DocumentsPageValue = z.infer<typeof DocumentsPageSchema>;
export type DocumentCategoryValue = z.infer<typeof DocumentCategorySchema>;
export type DocumentItemValue = z.infer<typeof DocumentItemSchema>;
