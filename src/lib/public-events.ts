import { connectDB } from "@/lib/mongodb";
import { Event } from "@/lib/models";
import { getImageUrl } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize-html";

type EventLean = {
  _id: unknown;
  title?: string;
  slug?: string;
  excerpt?: string;
  description?: string;
  category?: string;
  event_date?: Date | string;
  location?: string;
  image?: string;
  gallery?: string[];
  institution?: string;
};

export type PublicEventCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  location: string;
  image: string | null;
  institution: string;
};

export type PublicEventDetail = PublicEventCard & {
  // Sanitized HTML — safe to render with dangerouslySetInnerHTML.
  descriptionHtml: string;
  // Resolved URLs for the extra photos. Detail-only — the list query does not
  // fetch them, so cards never pay for images they don't render.
  gallery: string[];
};

function asCard(doc: EventLean): PublicEventCard {
  return {
    _id: String(doc._id),
    title: doc.title ?? "",
    slug: doc.slug ?? "",
    excerpt: doc.excerpt ?? "",
    category: doc.category ?? "",
    date: doc.event_date ? new Date(doc.event_date).toISOString() : "",
    location: doc.location ?? "",
    image: getImageUrl(doc.image),
    institution: doc.institution ?? "all",
  };
}

export async function listPublicEvents({
  institution,
  limit,
}: {
  institution?: string | null;
  limit?: number;
} = {}): Promise<PublicEventCard[]> {
  await connectDB();

  const query: Record<string, unknown> = { is_active: true };
  if (institution) query.institution = institution;

  let cursor = Event.find(query)
    .select("title slug excerpt category event_date location image institution")
    .sort({ event_date: -1, sort_order: 1 });
  if (limit && limit > 0) cursor = cursor.limit(limit);

  const docs = await cursor.lean<EventLean[]>();
  return docs.map(asCard);
}

/** A card that knows whether its event is still to come. */
export type NewsEventCard = PublicEventCard & { isUpcoming: boolean };

/**
 * Cards for the landing-page "News & Events" strip: everything still to come,
 * soonest first. "Upcoming" is measured from the start of today, so an event
 * happening later today still counts.
 *
 * A college with two events scheduled shouldn't get a row with a hole in it, so
 * unless `fallbackToRecent` is off the remaining slots are topped up with the
 * most recent past events, newest first. Each card carries `isUpcoming` so the
 * two can be told apart on screen.
 */
export async function listNewsEvents({
  institution,
  limit = 3,
  fallbackToRecent = true,
}: {
  institution: string;
  limit?: number;
  fallbackToRecent?: boolean;
}): Promise<{ events: NewsEventCard[]; upcomingCount: number }> {
  await connectDB();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const base = { is_active: true, institution };
  const select =
    "title slug excerpt category event_date location image institution";

  const upcoming = await Event.find({
    ...base,
    event_date: { $gte: startOfToday },
  })
    .select(select)
    .sort({ event_date: 1, sort_order: 1 })
    .limit(limit)
    .lean<EventLean[]>();

  const events: NewsEventCard[] = upcoming.map((doc) => ({
    ...asCard(doc),
    isUpcoming: true,
  }));

  const shortfall = limit - events.length;
  if (shortfall <= 0 || !fallbackToRecent) {
    return { events, upcomingCount: events.length };
  }

  const recent = await Event.find({
    ...base,
    event_date: { $lt: startOfToday },
  })
    .select(select)
    .sort({ event_date: -1, sort_order: 1 })
    .limit(shortfall)
    .lean<EventLean[]>();

  events.push(...recent.map((doc) => ({ ...asCard(doc), isUpcoming: false })));
  return { events, upcomingCount: upcoming.length };
}

export async function listPublicEventSlugs(): Promise<{ slug: string }[]> {
  // Runs inside generateStaticParams at build time. If the DB is briefly
  // unreachable during `next build`, degrade to zero prerendered slugs —
  // event pages still render on demand via ISR.
  try {
    await connectDB();
    const docs = await Event.find({ is_active: true })
      .select("slug")
      .lean<{ slug?: string }[]>();
    return docs
      .map((doc) => doc.slug)
      .filter((slug): slug is string => typeof slug === "string" && !!slug)
      .map((slug) => ({ slug }));
  } catch (err) {
    console.warn(
      "[public-events] listPublicEventSlugs failed; " +
        "falling back to on-demand rendering:",
      err,
    );
    return [];
  }
}

export async function getPublicEventBySlug(
  slug: string,
): Promise<PublicEventDetail | null> {
  await connectDB();

  const doc = await Event.findOne({ slug, is_active: true })
    .select(
      "title slug excerpt description category event_date location image gallery institution",
    )
    .lean<EventLean | null>();
  if (!doc) return null;

  return {
    ...asCard(doc),
    descriptionHtml: sanitizeHtml(doc.description),
    gallery: (doc.gallery ?? [])
      .map((key) => getImageUrl(key))
      .filter((url): url is string => !!url),
  };
}
