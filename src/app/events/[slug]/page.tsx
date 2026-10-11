import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventDetailLayout } from "@/components/layout/EventDetailLayout";
import {
  getPublicEventBySlug,
  listPublicEvents,
  listPublicEventSlugs,
  type PublicEventCard,
} from "@/lib/public-events";

/** Entries in each "read next" list beside the article. */
const RELATED_COUNT = 5;

/**
 * The latest entries site-wide and the latest from the event's own college,
 * each without the event itself — and the second without anything the first
 * already lists, so the two columns never repeat each other.
 */
async function relatedEvents(
  slug: string,
  institution: string,
): Promise<{ latest: PublicEventCard[]; moreFromCollege: PublicEventCard[] }> {
  try {
    const [all, own] = await Promise.all([
      listPublicEvents({ limit: RELATED_COUNT + 1 }),
      listPublicEvents({ institution, limit: RELATED_COUNT * 2 + 1 }),
    ]);
    const latest = all.filter((e) => e.slug !== slug).slice(0, RELATED_COUNT);
    const shown = new Set(latest.map((e) => e._id));
    const moreFromCollege = own
      .filter((e) => e.slug !== slug && !shown.has(e._id))
      .slice(0, RELATED_COUNT);
    return { latest, moreFromCollege };
  } catch (err) {
    // The sidebars are extras — the article renders without them.
    console.warn("[events/[slug]] related events failed:", err);
    return { latest: [], moreFromCollege: [] };
  }
}

export const revalidate = 3600;

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listPublicEventSlugs();
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: `${event.title} | JCT Institutions`,
    description: event.excerpt || undefined,
    openGraph: event.image ? { images: [{ url: event.image }] } : undefined,
  };
}

export default async function EventDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) notFound();
  const { latest, moreFromCollege } = await relatedEvents(
    event.slug,
    event.institution,
  );

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      {/* Push content below the fixed navbar */}
      <div className="pt-24 md:pt-28" />
      <EventDetailLayout
        event={event}
        latest={latest}
        moreFromCollege={moreFromCollege}
      />
      <Footer />
    </main>
  );
}
