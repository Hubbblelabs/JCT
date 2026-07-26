/**
 * Fragment identifiers shared between a public page's client layout and the
 * server component that feeds it.
 *
 * Deliberately dependency-free. These used to live next to the code that reads
 * them — `content-pages.ts` for the registry, `PlacementsPageLayout` for the
 * section id — but a client component importing the registry had its import
 * elided from the browser bundle, leaving the constant undefined at runtime. A
 * module with no imports is safe to pull into either environment.
 */

/** The placement-gallery section of `/institutions/<inst>/placements`. */
export const PLACEMENT_GALLERY_ANCHOR = "gallery";
