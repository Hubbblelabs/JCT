import { z } from "zod";
import {
  zClampedString,
  zEnum,
  zSlug,
  zUrl,
  zOptionalString,
} from "./_primitives";

export const PAGE_INSTITUTIONS = [
  "main",
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

export const PAGE_TEMPLATES = [
  "standard",
  "hero-content",
  "sidebar",
  "gallery",
  "contact",
] as const;

export const PAGE_STATUSES = ["draft", "published", "archived"] as const;

export const PAGE_LIMITS = {
  titleMax: 200,
  descriptionMax: 500,
  sectionsMax: 50,
  paragraphMax: 4000,
  listItemMax: 300,
  listItemsMax: 100,
  cardsMax: 24,
  galleryImagesMax: 80,
  keywordsMax: 15,
  keywordMax: 40,
  metaTitleMax: 80,
  metaDescMax: 200,
  sidebarItemsMax: 20,
  ctaLabelMax: 60,
} as const;

// ─── SEO ─────────────────────────────────────────────────────────────────────
export const PageSeoSchema = z.object({
  metaTitle: zOptionalString(PAGE_LIMITS.metaTitleMax).default(""),
  metaDescription: zOptionalString(PAGE_LIMITS.metaDescMax).default(""),
  keywords: z
    .array(zClampedString(0, PAGE_LIMITS.keywordMax, "Keyword"))
    .max(PAGE_LIMITS.keywordsMax)
    .optional(),
  ogImage: zUrl.optional().or(z.literal("")),
  noindex: z.boolean().optional(),
});
export type PageSeo = z.infer<typeof PageSeoSchema>;

// ─── Hero block ──────────────────────────────────────────────────────────────
export const PageHeroSchema = z.object({
  title: zClampedString(0, PAGE_LIMITS.titleMax).optional(),
  subtitle: zClampedString(0, PAGE_LIMITS.descriptionMax).optional(),
  image: zUrl.optional().or(z.literal("")),
  ctaLabel: zClampedString(0, PAGE_LIMITS.ctaLabelMax).optional(),
  ctaHref: zUrl.optional().or(z.literal("")),
});
export type PageHero = z.infer<typeof PageHeroSchema>;

// ─── Body sections (rich content union) ──────────────────────────────────────
const HeadingSection = z.object({
  type: z.literal("heading"),
  text: zClampedString(0, PAGE_LIMITS.titleMax).default(""),
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
});

const TextSection = z.object({
  type: z.literal("text"),
  paragraphs: z
    .array(zClampedString(0, PAGE_LIMITS.paragraphMax, "Paragraph"))
    .default([]),
});

const ImageSection = z.object({
  type: z.literal("image"),
  src: zUrl.optional().or(z.literal("")),
  alt: zClampedString(0, 200).optional(),
  caption: zClampedString(0, 300).optional(),
});

const ListSection = z.object({
  type: z.literal("list"),
  ordered: z.boolean().optional(),
  items: z
    .array(zClampedString(0, PAGE_LIMITS.listItemMax, "Item"))
    .max(PAGE_LIMITS.listItemsMax)
    .default([]),
});

const CardItem = z.object({
  title: zClampedString(0, 200).default(""),
  desc: zClampedString(0, 500).default(""),
  image: zUrl.optional().or(z.literal("")),
  href: zUrl.optional().or(z.literal("")),
});

const CardsSection = z.object({
  type: z.literal("cards"),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  items: z.array(CardItem).max(PAGE_LIMITS.cardsMax).default([]),
});

const CtaSection = z.object({
  type: z.literal("cta"),
  label: zClampedString(0, PAGE_LIMITS.ctaLabelMax).default(""),
  href: zUrl.optional().or(z.literal("")),
  variant: z.enum(["primary", "secondary"]).optional(),
});

export const PageBodySectionSchema = z.discriminatedUnion("type", [
  HeadingSection,
  TextSection,
  ImageSection,
  ListSection,
  CardsSection,
  CtaSection,
]);
export type PageBodySection = z.infer<typeof PageBodySectionSchema>;

// ─── Sidebar template extras ─────────────────────────────────────────────────
const SidebarItemSchema = z.object({
  label: zClampedString(0, 80).default(""),
  href: zUrl.optional().or(z.literal("")),
  visible: z.boolean().optional(),
});

export const PageSidebarSchema = z.object({
  items: z
    .array(SidebarItemSchema)
    .max(PAGE_LIMITS.sidebarItemsMax)
    .optional(),
  ctaLabel: zClampedString(0, PAGE_LIMITS.ctaLabelMax).optional(),
  ctaHref: zUrl.optional().or(z.literal("")),
});

// ─── Gallery template ────────────────────────────────────────────────────────
const GalleryImageSchema = z.object({
  src: zUrl,
  alt: zClampedString(0, 200).optional(),
  caption: zClampedString(0, 200).optional(),
});

export const PageGallerySchema = z.object({
  description: zClampedString(0, PAGE_LIMITS.descriptionMax).optional(),
  images: z
    .array(GalleryImageSchema)
    .max(PAGE_LIMITS.galleryImagesMax)
    .default([]),
});

// ─── Contact template ────────────────────────────────────────────────────────
export const PageContactSchema = z.object({
  intro: zClampedString(0, PAGE_LIMITS.descriptionMax).optional(),
  phone: zClampedString(0, 40).optional(),
  email: zClampedString(0, 200).optional(),
  addressLines: z.array(zClampedString(0, 200)).max(8).optional(),
  mapEmbedUrl: zUrl.optional().or(z.literal("")),
});

// ─── Top-level Page content ──────────────────────────────────────────────────
export const PageContentSchema = z.object({
  seo: PageSeoSchema.optional(),
  hero: PageHeroSchema.optional(),
  sections: z
    .array(PageBodySectionSchema)
    .max(PAGE_LIMITS.sectionsMax)
    .optional(),
  sidebar: PageSidebarSchema.optional(),
  gallery: PageGallerySchema.optional(),
  contact: PageContactSchema.optional(),
});
export type PageContent = z.infer<typeof PageContentSchema>;

// ─── Page document (row + content) ───────────────────────────────────────────
export const PageDocumentSchema = z.object({
  slug: zSlug,
  institution: zEnum(PAGE_INSTITUTIONS),
  title: zClampedString(1, PAGE_LIMITS.titleMax, "Title"),
  template: zEnum(PAGE_TEMPLATES),
  status: zEnum(PAGE_STATUSES).optional(),
  content: PageContentSchema.optional(),
});

export const PageCreateSchema = z.object({
  slug: zSlug,
  institution: zEnum(PAGE_INSTITUTIONS),
  title: zClampedString(1, PAGE_LIMITS.titleMax, "Title"),
  template: zEnum(PAGE_TEMPLATES),
});
export type PageCreateValue = z.infer<typeof PageCreateSchema>;

export const PageUpdateSchema = PageDocumentSchema.partial();
export type PageUpdateValue = z.infer<typeof PageUpdateSchema>;

export type PageInstitution = (typeof PAGE_INSTITUTIONS)[number];
export type PageTemplate = (typeof PAGE_TEMPLATES)[number];
export type PageStatus = (typeof PAGE_STATUSES)[number];
