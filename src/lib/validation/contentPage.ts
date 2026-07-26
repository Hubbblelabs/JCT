import { z } from "zod";

// ──────────────────────────────────────────────────────────────────────────
// A generic, block-based content page.
//
// The legacy WordPress site carried a long tail of informational pages —
// Library, NIRF, Timeline, Professional Bodies, NSS, AQAR reports, financial
// statements, the placement gallery … — that all reduce to the same handful of
// building blocks: prose, bullet lists, download grids, link tables, image
// galleries and year-by-year timelines.
//
// Rather than one bespoke schema/layout/inspector per page, every one of those
// pages is a `ContentPageValue` stored under its own SiteConfig key (see
// `src/lib/content-pages.ts` for the registry that maps a page to its key and
// public route). Blocks can be added, reordered, retyped and removed from the
// admin editor, so a page is never locked into the shape it was imported with.
//
// Nothing here is hard-coded content: `scripts/seed-content-pages.mjs` performs
// the one-time import of the legacy copy and files (into R2), and everything is
// editable afterwards at /admin/content/<slug>.
// ──────────────────────────────────────────────────────────────────────────

export const CONTENT_PAGE_LIMITS = {
  blocksMax: 80,
  paragraphsMax: 40,
  paragraphMax: 6000,
  listItemsMax: 300,
  listItemMax: 2000,
  groupsMax: 60,
  docsPerGroupMax: 200,
  columnsMax: 10,
  rowsMax: 400,
  cellMax: 1500,
  imagesPerGroupMax: 200,
  timelineEntriesMax: 80,
  accordionItemsMax: 60,
  breadcrumbMax: 5,
} as const;

const s = (max: number) => z.string().max(max).default("");

/**
 * A link target: either an R2 storage key ("documents/…", "images/…") or an
 * absolute URL. Both are resolved through `getImageUrl()` at render time.
 */
const zTarget = s(600);

// ─── Blocks ─────────────────────────────────────────────────────────────────

/** Prose. A title with no paragraphs renders as a standalone section heading. */
const TextBlock = z.object({
  type: z.literal("text"),
  title: s(300),
  paragraphs: z
    .array(s(CONTENT_PAGE_LIMITS.paragraphMax))
    .max(CONTENT_PAGE_LIMITS.paragraphsMax)
    .default([]),
});

const ListBlock = z.object({
  type: z.literal("list"),
  title: s(300),
  intro: s(2000),
  ordered: z.boolean().default(false),
  items: z
    .array(s(CONTENT_PAGE_LIMITS.listItemMax))
    .max(CONTENT_PAGE_LIMITS.listItemsMax)
    .default([]),
});

/** One downloadable file. `file` is an R2 key or an absolute URL. */
export const ContentDocSchema = z.object({
  label: s(400),
  description: s(600),
  file: zTarget,
});

const DocGroupSchema = z.object({
  title: s(300),
  docs: z
    .array(ContentDocSchema)
    .max(CONTENT_PAGE_LIMITS.docsPerGroupMax)
    .default([]),
});

/**
 * A block of downloads. `layout` picks the density: full-width cards for real
 * titles, compact chips for short codes (e.g. NAAC metric numbers like 3.4.2),
 * rows for a simple stacked list.
 */
const DocsBlock = z.object({
  type: z.literal("docs"),
  title: s(300),
  description: s(1000),
  layout: z.enum(["cards", "chips", "rows"]).default("cards"),
  linkLabel: z.string().max(80).default("Download"),
  groups: z
    .array(DocGroupSchema)
    .max(CONTENT_PAGE_LIMITS.groupsMax)
    .default([]),
});

/** A table cell. A non-empty `href` turns the cell text into a link. */
export const ContentCellSchema = z.object({
  text: s(CONTENT_PAGE_LIMITS.cellMax),
  href: zTarget,
});

const TableRowSchema = z.object({
  /** Renders the whole row as a sub-heading spanning every column. */
  heading: z.boolean().default(false),
  cells: z
    .array(ContentCellSchema)
    .max(CONTENT_PAGE_LIMITS.columnsMax)
    .default([]),
});

const TableBlock = z.object({
  type: z.literal("table"),
  title: s(300),
  description: s(1000),
  columns: z
    .array(s(200))
    .max(CONTENT_PAGE_LIMITS.columnsMax)
    .default([]),
  rows: z.array(TableRowSchema).max(CONTENT_PAGE_LIMITS.rowsMax).default([]),
});

export const ContentImageSchema = z.object({
  src: zTarget,
  alt: s(300),
  caption: s(400),
});

const ImageGroupSchema = z.object({
  title: s(300),
  images: z
    .array(ContentImageSchema)
    .max(CONTENT_PAGE_LIMITS.imagesPerGroupMax)
    .default([]),
});

const GalleryBlock = z.object({
  type: z.literal("gallery"),
  title: s(300),
  description: s(1000),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  groups: z
    .array(ImageGroupSchema)
    .max(CONTENT_PAGE_LIMITS.groupsMax)
    .default([]),
});

const TimelineEntrySchema = z.object({
  label: s(120),
  items: z
    .array(s(CONTENT_PAGE_LIMITS.listItemMax))
    .max(CONTENT_PAGE_LIMITS.listItemsMax)
    .default([]),
});

const TimelineBlock = z.object({
  type: z.literal("timeline"),
  title: s(300),
  description: s(1000),
  entries: z
    .array(TimelineEntrySchema)
    .max(CONTENT_PAGE_LIMITS.timelineEntriesMax)
    .default([]),
});

const AccordionItemSchema = z.object({
  title: s(300),
  paragraphs: z
    .array(s(CONTENT_PAGE_LIMITS.paragraphMax))
    .max(CONTENT_PAGE_LIMITS.paragraphsMax)
    .default([]),
  bullets: z
    .array(s(CONTENT_PAGE_LIMITS.listItemMax))
    .max(CONTENT_PAGE_LIMITS.listItemsMax)
    .default([]),
});

/** Expandable panels — the shape most "one entry per organisation" pages take. */
const AccordionBlock = z.object({
  type: z.literal("accordion"),
  title: s(300),
  description: s(1000),
  /** Open the first panel on load so the page never looks empty. */
  openFirst: z.boolean().default(true),
  items: z
    .array(AccordionItemSchema)
    .max(CONTENT_PAGE_LIMITS.accordionItemsMax)
    .default([]),
});

const ContactBlock = z.object({
  type: z.literal("contact"),
  title: s(300),
  text: s(2000),
  email: s(200),
  phone: s(60),
  linkLabel: s(120),
  linkHref: zTarget,
});

export const ContentBlockSchema = z.discriminatedUnion("type", [
  TextBlock,
  ListBlock,
  DocsBlock,
  TableBlock,
  GalleryBlock,
  TimelineBlock,
  AccordionBlock,
  ContactBlock,
]);

export const CONTENT_BLOCK_TYPES = [
  "text",
  "list",
  "docs",
  "table",
  "gallery",
  "timeline",
  "accordion",
  "contact",
] as const;

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number];

// ─── Page ───────────────────────────────────────────────────────────────────

const HeroSchema = z
  .object({
    title: s(200),
    subtitle: s(500),
  })
  .default({ title: "", subtitle: "" });

const BreadcrumbItemSchema = z.object({
  label: s(120),
  href: s(300),
});

export const ContentPageSchema = z.object({
  hero: HeroSchema,
  /** Trail shown under the hero. The final crumb is the page itself. */
  breadcrumb: z
    .array(BreadcrumbItemSchema)
    .max(CONTENT_PAGE_LIMITS.breadcrumbMax)
    .default([]),
  intro: z
    .array(s(CONTENT_PAGE_LIMITS.paragraphMax))
    .max(CONTENT_PAGE_LIMITS.paragraphsMax)
    .default([]),
  blocks: z
    .array(ContentBlockSchema)
    .max(CONTENT_PAGE_LIMITS.blocksMax)
    .default([]),
});

export type ContentPageValue = z.infer<typeof ContentPageSchema>;
export type ContentBlockValue = z.infer<typeof ContentBlockSchema>;
export type ContentDocValue = z.infer<typeof ContentDocSchema>;
export type ContentDocGroupValue = z.infer<typeof DocGroupSchema>;
export type ContentCellValue = z.infer<typeof ContentCellSchema>;
export type ContentTableRowValue = z.infer<typeof TableRowSchema>;
export type ContentImageValue = z.infer<typeof ContentImageSchema>;
export type ContentImageGroupValue = z.infer<typeof ImageGroupSchema>;
export type ContentTimelineEntryValue = z.infer<typeof TimelineEntrySchema>;
export type ContentAccordionItemValue = z.infer<typeof AccordionItemSchema>;
export type ContentBreadcrumbValue = z.infer<typeof BreadcrumbItemSchema>;

/** A blank block of the requested type, used by the "add block" control. */
export function emptyContentBlock(type: ContentBlockType): ContentBlockValue {
  switch (type) {
    case "text":
      return { type: "text", title: "", paragraphs: [] };
    case "list":
      return { type: "list", title: "", intro: "", ordered: false, items: [] };
    case "docs":
      return {
        type: "docs",
        title: "",
        description: "",
        layout: "cards",
        linkLabel: "Download",
        groups: [{ title: "", docs: [] }],
      };
    case "table":
      return {
        type: "table",
        title: "",
        description: "",
        columns: ["", ""],
        rows: [],
      };
    case "gallery":
      return {
        type: "gallery",
        title: "",
        description: "",
        columns: 3,
        groups: [{ title: "", images: [] }],
      };
    case "timeline":
      return { type: "timeline", title: "", description: "", entries: [] };
    case "accordion":
      return {
        type: "accordion",
        title: "",
        description: "",
        openFirst: true,
        items: [],
      };
    case "contact":
      return {
        type: "contact",
        title: "",
        text: "",
        email: "",
        phone: "",
        linkLabel: "",
        linkHref: "",
      };
  }
}

export const CONTENT_BLOCK_LABELS: Record<ContentBlockType, string> = {
  text: "Text",
  list: "Bullet List",
  docs: "Documents",
  table: "Table",
  gallery: "Image Gallery",
  timeline: "Timeline",
  accordion: "Accordion",
  contact: "Contact / Call-out",
};
