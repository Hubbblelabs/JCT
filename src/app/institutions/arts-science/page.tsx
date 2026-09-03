import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  ARTS_SCIENCE_CONFIG_KEYS,
} from "@/lib/site-config-server";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "arts-science",
    path: "/institutions/arts-science",
    fallbackTitle: "Arts & Science | JCT College of Arts & Science, Coimbatore",
    fallbackDescription:
      "Explore undergraduate programs in Computer Science, AI & ML, BCA, Commerce, and Business at JCT College of Arts & Science, Coimbatore. NAAC accredited. Strong placement record.",
    fallbackOgDescription:
      "Explore undergraduate programs in Computer Science, AI & ML, BCA, Commerce, and Business at JCT College of Arts & Science, Coimbatore.",
  });
}

import { Hero } from "@/modules/arts-science/Hero";
import { UgPrograms } from "@/modules/arts-science/UgPrograms";
import { AddOnPrograms } from "@/modules/arts-science/AddOnPrograms";
import { CareerDevelopmentCentre } from "@/modules/arts-science/CareerDevelopmentCentre";
import { AdmissionProcess } from "@/modules/arts-science/AdmissionProcess";
import { CampusLife } from "@/components/layout/CampusLife";
import { Testimonials } from "@/modules/arts-science/Testimonials";
import { Placements } from "@/components/layout/Placements";
import { NewsEvents } from "@/components/layout/NewsEvents";

export default async function ArtsSciencePage() {
  const configs = await getPublishedConfigs([...ARTS_SCIENCE_CONFIG_KEYS]);

  return (
    <SiteConfigProvider configs={configs}>
      <main
        id="top"
        className="bg-background text-foreground arts-science-theme min-h-screen overflow-x-hidden"
      >
        <Navbar />
        <div id="main-content" tabIndex={-1} className="outline-none" />
        <Hero />
        <UgPrograms />
        <AddOnPrograms />
        <CareerDevelopmentCentre />
        <NewsEvents institution="arts-science" />
        <AdmissionProcess />
        <Placements institution="arts-science" />
        <CampusLife
          configKey="artsScienceLifeAtJct"
          eventsHref="/institutions/arts-science/events"
        />
        <Testimonials />
        <Footer />
      </main>
    </SiteConfigProvider>
  );
}
