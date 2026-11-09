import { Navbar } from "@/components/layout/Navbar";
import { HomeHero } from "@/components/layout/HomeHero";
import { TrustHighlightsRow } from "@/components/layout/TrustHighlightsRow";
import { Placements } from "@/components/layout/Placements";
import { Testimonials } from "@/components/layout/Testimonials";
import { AdmissionsCTA } from "@/components/layout/AdmissionsCTA";
import { Footer } from "@/components/layout/Footer";
import { WhyJCT } from "@/components/layout/WhyJCT";
import { CampusLife } from "@/components/layout/CampusLife";
import { Pamphlet } from "@/components/layout/Pamphlet";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  HOME_CONFIG_KEYS,
} from "@/lib/site-config-server";
import { seoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 86400;

// The page title still comes from the root layout when the CMS has none; the
// social preview text lives here now, since the root openGraph carries only
// site-wide fields (see src/app/layout.tsx).
export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "main",
    path: "/",
    fallbackOgTitle:
      "JCT Institutions — Three Colleges, One Commitment to Excellence",
    fallbackOgDescription:
      "Premier Engineering, Arts & Science, and Polytechnic colleges in Coimbatore. Established 2009. 98% Placement Rate.",
  });
}

export default async function HomePage() {
  const configs = await getPublishedConfigs([...HOME_CONFIG_KEYS]);

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
        <CampusLife
          configKey="lifeAtJct"
          campusLifeHref="/campus-life"
          eventsHref="/events"
        />
        <Testimonials />
        <AdmissionsCTA />
        <Footer />
      </main>
    </SiteConfigProvider>
  );
}
