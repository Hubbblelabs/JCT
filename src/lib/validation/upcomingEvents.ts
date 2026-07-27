import { z } from "zod";
import { zClampedString, zOptionalString, zUrl } from "./_primitives";

/**
 * The "News & Events" strip on an institution landing page. The events
 * themselves are `Event` records managed under /admin/events — this key only
 * carries the section's wording and how many cards it shows.
 *
 * The key is still named `<college>UpcomingEvents`, from when the section was
 * titled "Upcoming Events"; renaming it would orphan saved values.
 */
export const LIMITS = {
  headingMax: 120,
  eyebrowMax: 60,
  descriptionMax: 400,
  ctaLabelMax: 40,
  emptyTextMax: 200,
  badgeMax: 24,
  minItems: 1,
  maxItems: 6,
} as const;

export const UpcomingEventsSchema = z.object({
  enabled: z.boolean().optional().default(true),
  eyebrow: zOptionalString(LIMITS.eyebrowMax),
  heading: zClampedString(0, LIMITS.headingMax, "Heading").optional(),
  description: zOptionalString(LIMITS.descriptionMax),
  /** How many event cards to show before the visitor has to click through. */
  maxItems: z
    .number()
    .int("Must be a whole number")
    .min(LIMITS.minItems, `Show at least ${LIMITS.minItems} event`)
    .max(LIMITS.maxItems, `Show at most ${LIMITS.maxItems} events`)
    .optional()
    .default(3),
  ctaLabel: zClampedString(0, LIMITS.ctaLabelMax, "Button label").optional(),
  /** Defaults to the college's own /events route when left blank. */
  ctaHref: zUrl.optional().or(z.literal("")),
  /**
   * Shown when there is nothing at all to list. Left blank the whole section is
   * hidden rather than advertising an empty calendar.
   */
  emptyText: zOptionalString(LIMITS.emptyTextMax),
  /**
   * Top the row up with the most recent past events whenever there aren't
   * enough scheduled ones to fill it, so the section is never part empty.
   */
  fallbackToRecent: z.boolean().optional().default(true),
  /** Badge marking the cards whose event is still to come. */
  upcomingBadge: zClampedString(0, LIMITS.badgeMax, "Badge").optional(),
});

export type UpcomingEventsValue = z.infer<typeof UpcomingEventsSchema>;
