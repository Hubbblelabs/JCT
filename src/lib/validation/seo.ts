import { z } from "zod";
import { zOptionalString } from "./_primitives";

export const LIMITS = {
  pathMax: 300,
  labelMax: 80,
  titleMax: 200,
  descriptionMax: 400,
  pagesMax: 80,
} as const;

/**
 * Soft targets shown in the admin editor. Search engines truncate beyond
 * roughly these lengths, but a longer value is still valid — the hard caps
 * above are what the API rejects.
 */
export const SEO_RECOMMENDED = {
  titleMax: 60,
  descriptionMax: 160,
} as const;

const zSeoPath = z
  .string()
  .min(1, "Path is required")
  .max(LIMITS.pathMax, `Path must be at most ${LIMITS.pathMax} characters`)
  .regex(
    /^\/[a-zA-Z0-9\-_/]*$/,
    "Path must start with / and contain letters, numbers, dashes, or slashes only",
  );

/** One page's meta tags, addressed by its public route path. */
export const SeoEntrySchema = z.object({
  path: zSeoPath,
  label: zOptionalString(LIMITS.labelMax).default(""),
  title: zOptionalString(LIMITS.titleMax).default(""),
  description: zOptionalString(LIMITS.descriptionMax).default(""),
});

/**
 * A `<scope>Seo` site-config value: the meta title/description for every
 * page in that scope, keyed by path. Pages absent from the list (or with
 * blank fields) fall back to the metadata hardcoded in their route file.
 */
export const SeoPagesSchema = z.object({
  pages: z.array(SeoEntrySchema).max(LIMITS.pagesMax).default([]),
});

/**
 * Per-program meta tags. Stored on `Program.content.seo`, so it follows the
 * program's own draft/publish cycle rather than living in site-config.
 */
export const ProgramSeoSchema = z.object({
  title: zOptionalString(LIMITS.titleMax).default(""),
  description: zOptionalString(LIMITS.descriptionMax).default(""),
});

export type SeoEntry = z.infer<typeof SeoEntrySchema>;
export type SeoPagesValue = z.infer<typeof SeoPagesSchema>;
export type ProgramSeoValue = z.infer<typeof ProgramSeoSchema>;
