import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { EventsPageLayout } from "@/components/layout/EventsPageLayout";
import { listPublicEvents, type PublicEventCard } from "@/lib/public-events";

export const revalidate = 3600;

async function getEvents(): Promise<PublicEventCard[]> {
  // Degrade to the layout's empty state instead of failing the whole page
  // when the DB is unreachable — ISR retries on the next revalidation.
  try {
    return await listPublicEvents({ institution: "arts-science" });
  } catch (err) {
    console.warn("[arts-science/events] listPublicEvents failed:", err);
    return [];
  }
}

export const metadata: Metadata = {
  title: "News & Events | JCT College of Arts & Science, Coimbatore",
  description:
    "Latest news, events, achievements, and academic breakthroughs at JCT College of Arts & Science, Coimbatore.",
};

export default async function ArtsScienceEventsPage() {
  const events = await getEvents();

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="News & Events"
        subtitle="Latest news, events, and achievements at JCT Arts & Science."
      />
      <EventsPageLayout events={events} />
      <Footer />
    </main>
  );
}
