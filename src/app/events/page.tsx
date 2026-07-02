import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { EventsPageLayout } from "@/components/layout/EventsPageLayout";
import { listPublicEvents, type PublicEventCard } from "@/lib/public-events";

export const revalidate = 3600;

async function getEvents(): Promise<PublicEventCard[]> {
  // Degrade to the layout's empty state instead of failing the whole page
  // when the DB is unreachable (e.g. during `next build` without a DB) —
  // ISR retries on the next revalidation.
  try {
    return await listPublicEvents();
  } catch (err) {
    console.warn("[events] listPublicEvents failed; rendering empty:", err);
    return [];
  }
}

export const metadata: Metadata = {
  title: "News & Events | JCT Institutions, Coimbatore",
  description:
    "Latest news, events, achievements, and academic breakthroughs across JCT College of Engineering, Arts & Science, and Polytechnic.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="News & Events"
        subtitle="Latest news, events, and academic breakthroughs at JCT."
      />
      <EventsPageLayout events={events} />
      <Footer />
    </main>
  );
}
