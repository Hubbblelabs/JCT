import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { EventsPageLayout } from "@/components/layout/EventsPageLayout";
import { listPublicEvents } from "@/lib/public-events";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News & Events | JCT Institutions, Coimbatore",
  description:
    "Latest news, events, achievements, and academic breakthroughs across JCT College of Engineering, Arts & Science, and Polytechnic.",
};

export default async function EventsPage() {
  const events = await listPublicEvents();

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
