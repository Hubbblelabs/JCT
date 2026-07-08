import { Navbar } from "@/components/layout/Navbar";
import { Placements } from "@/components/layout/Placements";
import { Footer } from "@/components/layout/Footer";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  ENGINEERING_CONFIG_KEYS,
} from "@/lib/site-config-server";
import { getCampusEvents } from "@/lib/public-events";

import { EngineeringHero } from "./EngineeringHero";
import { EngineeringDomains } from "./EngineeringDomains";
import { EngineeringMetrics } from "./EngineeringMetrics";
import { Admissions } from "./Admissions";
import { CampusLife } from "@/components/layout/CampusLife";
import { Testimonials } from "./Testimonials";

export default async function EngineeringPage() {
  const [configs, events] = await Promise.all([
    getPublishedConfigs([...ENGINEERING_CONFIG_KEYS]),
    getCampusEvents("engineering"),
  ]);

  return (
    <SiteConfigProvider configs={configs}>
      <main
        id="top"
        className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden"
      >
        <Navbar />
        <div id="main-content" tabIndex={-1} className="outline-none" />
        <EngineeringHero />
        <EngineeringDomains />
        <EngineeringMetrics />
        <Admissions />
        <Placements institution="engineering" />
        <CampusLife events={events} />
        <Testimonials />
        <div id="footer">
          <Footer />
        </div>
      </main>
    </SiteConfigProvider>
  );
}
