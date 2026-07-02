import { Navbar } from "@/components/layout/Navbar";
import { HomeHero } from "@/components/layout/HomeHero";
import { TrustHighlightsRow } from "@/components/layout/TrustHighlightsRow";
import { Placements } from "@/components/layout/Placements";
import { Testimonials } from "@/components/layout/Testimonials";
import { AdmissionsCTA } from "@/components/layout/AdmissionsCTA";
import { Footer } from "@/components/layout/Footer";
import { WhyJCT } from "@/components/layout/WhyJCT";
import { CampusLife } from "@/components/layout/CampusLife";
import { NewsEvents, type NewsEventItem } from "@/components/layout/NewsEvents";
import { Pamphlet } from "@/components/layout/Pamphlet";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  HOME_CONFIG_KEYS,
} from "@/lib/site-config-server";
import { listPublicEvents } from "@/lib/public-events";
import { formatEventDate } from "@/lib/utils";

export const revalidate = 86400;

async function getHomeEvents(): Promise<NewsEventItem[]> {
  // Degrade to the component's built-in fallback content instead of failing
  // the whole home page when the DB is unreachable.
  try {
    const events = await listPublicEvents({ limit: 4 });
    return events.map((e) => ({
      date: formatEventDate(e.date),
      title: e.title,
      excerpt: e.excerpt,
      category: e.category,
      image: e.image ?? "/assets/jct-life13.webp",
      href: `/events/${e.slug}`,
    }));
  } catch (err) {
    console.warn("[home] listPublicEvents failed; using fallback items:", err);
    return [];
  }
}

export default async function HomePage() {
  const [configs, events] = await Promise.all([
    getPublishedConfigs([...HOME_CONFIG_KEYS]),
    getHomeEvents(),
  ]);

  return (
    <SiteConfigProvider configs={configs}>
      <main className="bg-surface text-foreground min-h-screen overflow-x-hidden">
        <Navbar />
        <div id="main-content" tabIndex={-1} className="outline-none" />
        <Pamphlet />
        <HomeHero />
        <TrustHighlightsRow />
        <WhyJCT />
        <Placements />
        <CampusLife />
        <NewsEvents items={events} />
        <Testimonials />
        <AdmissionsCTA />
        <Footer />
      </main>
    </SiteConfigProvider>
  );
}
