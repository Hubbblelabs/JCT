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

export const ResearchPageSchema = z.object({
  hero: HeroSchema,
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
