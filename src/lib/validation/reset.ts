import { z } from "zod";

/**
 * What a full reset is allowed to destroy beyond `SiteConfig`.
 *
 * Both flags are optional and both mean "also do this" — the historical scope
 * (site config plus every asset nothing references) is what you get when the
 * body is absent or empty, so the route stays compatible with a client that
 * POSTs nothing at all.
 *
 * `.optional()` rather than `.default(false)`: this schema is parsed against a
 * possibly-absent body, and a defaulted field would make "not sent" and
 * "explicitly false" indistinguishable in the audit summary.
 */
export const ResetOptionsSchema = z.object({
  /** Also delete programs, pages, events, placements and testimonials. */
  content: z.boolean().optional(),
  /**
   * Purge every uploaded file instead of only the unreferenced ones. This
   * skips the reference scan, so on its own (without `content`) it will strip
   * the images off surviving programs, events, placements and testimonials.
   */
  assets: z.boolean().optional(),
});

export type ResetOptions = z.infer<typeof ResetOptionsSchema>;
