import { z } from "zod";
import {
  zEnum,
  zSlug,
  zUrl,
  zClampedString,
  zOptionalString,
  zNonNegativeInt,
} from "./_primitives";

// Must match the Event model enum. Events are scoped to a single college —
// there is no site-wide "all" pool.
export const INSTITUTIONS = [
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

// Suggested categories for the admin UI — the field itself is free text so
// editors can introduce new badges without a schema change.
export const EVENT_CATEGORY_SUGGESTIONS = [
  "Achievement",
  "Partnership",
  "Campus Life",
  "Accreditation",
  "Academic",
  "Sports",
  "Cultural",
  "Workshop",
  "Placement",
] as const;

export const LIMITS = {
  // The legacy news-event titles carry the whole announcement — conference
  // names with their full expansion, department and date all in one line. The
  // longest of the 1001 imported posts is 261 characters, so a 160 cap would
  // have truncated 32 of them mid-sentence.
  titleMax: 280,
  excerptMax: 300,
  descriptionMax: 20000,
  categoryMax: 40,
  locationMax: 120,
  // Event albums are imported whole from the college news posts. A 4-photo cap
  // silently threw most of an album away; 24 still cut 64 of the imported
  // events short, the largest of which is a 172-photo graduation day.
  galleryMax: 200,
  videosMax: 10,
  videoUrlMax: 500,
} as const;

// Extra photos beyond the cover image, rendered as a grid on the detail page.
const zEventGallery = z
  .array(zUrl)
  .max(LIMITS.galleryMax, `At most ${LIMITS.galleryMax} gallery images`);

// Videos are links to third-party pages (YouTube, Vimeo, Facebook…), never
// storage keys or site paths — so unlike `zUrl`, only absolute http(s).
const zVideoUrl = z
  .string()
  .trim()
  .max(
    LIMITS.videoUrlMax,
    `Video link must be at most ${LIMITS.videoUrlMax} characters`,
  )
  .regex(/^https?:\/\/\S+$/i, "Video link must start with https://");

const zEventVideos = z
  .array(zVideoUrl)
  .max(LIMITS.videosMax, `At most ${LIMITS.videosMax} videos`);

const zEventDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Must be a valid date");

// Defaults-free base — .partial()-safe for PATCH payloads (see CLAUDE.md:
// Zod 4 injects .default() values for omitted keys, wiping stored fields).
const EventBaseSchema = z.object({
  title: zClampedString(1, LIMITS.titleMax, "Title"),
  slug: zSlug,
  excerpt: zOptionalString(LIMITS.excerptMax),
  description: zOptionalString(LIMITS.descriptionMax),
  category: zClampedString(1, LIMITS.categoryMax, "Category"),
  event_date: zEventDate,
  location: zOptionalString(LIMITS.locationMax),
  image: zUrl.optional().or(z.literal("")),
  gallery: zEventGallery,
  videos: zEventVideos,
  featured: z.boolean(),
  institution: zEnum(INSTITUTIONS),
  is_active: z.boolean(),
  sort_order: zNonNegativeInt,
});

export const EventCreateSchema = EventBaseSchema.extend({
  excerpt: zOptionalString(LIMITS.excerptMax).default(""),
  description: zOptionalString(LIMITS.descriptionMax).default(""),
  category: zClampedString(1, LIMITS.categoryMax, "Category").default(
    "Campus Life",
  ),
  location: zOptionalString(LIMITS.locationMax).default(""),
  gallery: zEventGallery.default([]),
  videos: zEventVideos.default([]),
  featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  sort_order: zNonNegativeInt.optional().default(0),
});

export const EventUpdateSchema = EventBaseSchema.partial();

export type EventCreateValue = z.infer<typeof EventCreateSchema>;
export type EventUpdateValue = z.infer<typeof EventUpdateSchema>;
