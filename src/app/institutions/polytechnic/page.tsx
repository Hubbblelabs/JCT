import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/modules/polytechnic/Hero";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  POLYTECHNIC_CONFIG_KEYS,
} from "@/lib/site-config-server";

export const revalidate = 86400;

import { DiplomaPrograms } from "@/modules/polytechnic/DiplomaPrograms";
import { Admissions } from "@/modules/polytechnic/Admissions";
import { Placements } from "@/components/layout/Placements";
import { CampusLife } from "@/components/layout/CampusLife";
import { Testimonials } from "@/modules/polytechnic/Testimonials";

export const metadata: Metadata = {
  title: "Polytechnic | JCT Polytechnic College, Coimbatore",
  description:
    "JCT Polytechnic College offers AICTE-approved three-year diploma programs in Computer Technology, Mechanical, Civil, Electrical & Electronics, Agricultural, and Petrochemical Engineering. Workshop-driven training with 98% placement rate.",
  openGraph: {
    title: "JCT Polytechnic College | Diploma Programs, Coimbatore",
    description:
      "AICTE-approved diploma programs with industry-linked training. 98% placement rate. Lateral entry to B.E. available.",
    type: "website",
  },
};

export default async function PolytechnicPage() {
  const configs = await getPublishedConfigs([...POLYTECHNIC_CONFIG_KEYS]);

  return (
    <SiteConfigProvider configs={configs}>
      <main
        id="top"
        className="polytechnic-theme min-h-screen overflow-x-hidden bg-[#F8F9FA] font-sans"
      >
        <Navbar />
        <div id="main-content" tabIndex={-1} className="outline-none" />
        <Hero />
        <DiplomaPrograms />
        <Admissions />
        <Placements institution="polytechnic" />
        <CampusLife
          configKey="polytechnicLifeAtJct"
          eventsHref="/institutions/polytechnic/events"
        />
        <Testimonials />
        <Footer />
      </main>
    </SiteConfigProvider>
  );
}
