import { connectDB } from "@/lib/mongodb";
import { Event } from "@/lib/models";
import { getImageUrl, formatEventDate } from "@/lib/utils";
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
  if (institution) query.institution = { $in: [institution, "all"] };

  let cursor = Event.find(query)
    .select("title slug excerpt category event_date location image institution")
    .sort({ event_date: -1, sort_order: 1 });
  if (limit && limit > 0) cursor = cursor.limit(limit);

  const docs = await cursor.lean<EventLean[]>();
  return docs.map(asCard);
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
      "title slug excerpt description category event_date location image institution",
    )
    .lean<EventLean | null>();
  if (!doc) return null;

  return {
    ...asCard(doc),
    descriptionHtml: sanitizeHtml(doc.description),
  };
}

// Card shape consumed by the "Life at JCT" grid (`CampusLife`) on the home
// page and the three institution landing pages.
export type CampusEventCard = {
  title: string;
  href: string;
  image: string;
  date: string;
};

/**
 * Build the "Life at JCT" event cards for a page. Pass an `institution` to
 * scope to that college (plus site-wide "all" events); omit it for the home
 * page to include every college. Degrades to an empty list — and the grid's
 * static photo fallback — instead of failing the page when the DB is down.
 */
export async function getCampusEvents(
  institution?: string | null,
  limit = 8,
): Promise<CampusEventCard[]> {
  try {
    const events = await listPublicEvents({ institution, limit });
    return events.map((e) => ({
      title: e.title,
      href: `/events/${e.slug}`,
      image: e.image ?? "/assets/jct-life13.webp",
      date: formatEventDate(e.date),
    }));
  } catch (err) {
    console.warn(
      "[public-events] getCampusEvents failed; using fallback items:",
      err,
    );
    return [];
  }
}
