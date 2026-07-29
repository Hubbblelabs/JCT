import { z, type ZodType } from "zod";
import { ProgramSchema } from "./programs";
import { PageCreateSchema, PAGE_STATUSES } from "./pages";
import { PlacementCreateSchema } from "./placements";
import { TestimonialCreateSchema } from "./testimonials";
import { EventCreateSchema } from "./events";

/**
 * A field stored as a BSON date. Backup writes it as an ISO string and
 * `reviveDoc` turns it back into a `Date`, so a restore schema has to accept
 * both — the write-path schemas take the `YYYY-MM-DD` form the admin form
 * submits, which neither of those matches.
 */
const zRestoreDate = z.union([z.date(), z.string().min(1)]);

/**
 * Schemas the collection-restore path validates every document against before
 * writing it.
 *
 * Restore goes through the native MongoDB driver (`replaceOne`), which bypasses
 * Mongoose entirely — no required-field check, no type coercion, no enum
 * validation. A drifted or hand-edited archive could therefore write a document
 * with `name` missing, `seats: "not-a-number"`, or `institution: "hogwarts"`,
 * and the route would report `failed: 0`. The last case is the worst: the
 * document survives but is invisible to every institution-scoped query on the
 * site. Anything that fails these schemas is now reported and skipped.
 *
 * Deliberately **card-level only**. Rich `content` / `published_content` is
 * `Mixed` in Mongo and may hold legacy shapes that predate the current content
 * schema; validating it here would reject archives that restore perfectly well.
 * It passes through untouched (it is sanitised on render, not on read).
 *
 * Unknown keys — `_id`, `created_at`, `version`, `content`, … — are stripped
 * from the parsed result rather than rejected, and the parsed result is then
 * discarded: the *original* document is what gets written. That keeps Zod's
 * `.default()` injection and unknown-key stripping from making a round-trip
 * lossy, the same reasoning the config-restore path already documents.
 */
export const RESTORE_SCHEMAS: Record<string, ZodType> = {
  programs: ProgramSchema.extend({
    status: z.enum(["draft", "published", "archived"]).optional(),
  }),
  pages: PageCreateSchema.extend({
    status: z.enum(PAGE_STATUSES).optional(),
  }),
  placements: PlacementCreateSchema,
  testimonials: TestimonialCreateSchema,
  events: EventCreateSchema.extend({ event_date: zRestoreDate }),
  // There is no `recruiters` Mongo collection — the public recruiter carousel
  // is derived from `Placement.top_recruiters`. The entry stays in the backup
  // registry so archives that already carry `collections/recruiters.json` keep
  // restoring; there is no document shape to validate against.
  recruiters: z.object({}),
};

/** First few validation messages for a rejected document, joined for logging. */
export function describeIssues(error: z.ZodError): string {
  return error.issues
    .slice(0, 3)
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
}
