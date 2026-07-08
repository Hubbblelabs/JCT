import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  ARTS_SCIENCE_CONFIG_KEYS,
} from "@/lib/site-config-server";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Arts & Science | JCT College of Arts & Science, Coimbatore",
  description:
    "Explore undergraduate programs in Computer Science, AI & ML, BCA, Commerce, and Business at JCT College of Arts & Science, Coimbatore. NAAC accredited. Strong placement record.",
  openGraph: {
    title: "Arts & Science | JCT College of Arts & Science, Coimbatore",
    description:
      "Explore undergraduate programs in Computer Science, AI & ML, BCA, Commerce, and Business at JCT College of Arts & Science, Coimbatore.",
    type: "website",
  },
};

import { Hero } from "@/modules/arts-science/Hero";
import { UgPrograms } from "@/modules/arts-science/UgPrograms";
import { AdmissionProcess } from "@/modules/arts-science/AdmissionProcess";
import { CampusLife } from "@/components/layout/CampusLife";
import { Testimonials } from "@/modules/arts-science/Testimonials";
import { Placements } from "@/components/layout/Placements";

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
