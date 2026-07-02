import { Navbar } from "@/components/layout/Navbar";
import { HomeHero } from "@/components/layout/HomeHero";
import { TrustHighlightsRow } from "@/components/layout/TrustHighlightsRow";
import { Placements } from "@/components/layout/Placements";
import { Testimonials } from "@/components/layout/Testimonials";
import { AdmissionsCTA } from "@/components/layout/AdmissionsCTA";
import { Footer } from "@/components/layout/Footer";
import { WhyJCT } from "@/components/layout/WhyJCT";
import {
  CampusLife,
  type CampusEventCard,
} from "@/components/layout/CampusLife";
import { Pamphlet } from "@/components/layout/Pamphlet";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  HOME_CONFIG_KEYS,
} from "@/lib/site-config-server";
import { listPublicEvents } from "@/lib/public-events";
import { formatEventDate } from "@/lib/utils";

export const revalidate = 86400;

async function getHomeEvents(): Promise<CampusEventCard[]> {
  // Degrade to the Life at JCT static photo fallback instead of failing
  // the whole home page when the DB is unreachable.
  try {
    const events = await listPublicEvents({ limit: 8 });
    return events.map((e) => ({
      title: e.title,
      href: `/events/${e.slug}`,
      image: e.image ?? "/assets/jct-life13.webp",
      date: formatEventDate(e.date),
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
        <CampusLife events={events} />
        <Testimonials />
        <AdmissionsCTA />
        <Footer />
      </main>
    </SiteConfigProvider>
  );
}
