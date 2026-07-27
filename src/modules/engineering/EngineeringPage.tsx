import { Navbar } from "@/components/layout/Navbar";
import { Placements } from "@/components/layout/Placements";
import { NewsEvents } from "@/components/layout/NewsEvents";
import { Footer } from "@/components/layout/Footer";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import {
  getPublishedConfigs,
  ENGINEERING_CONFIG_KEYS,
} from "@/lib/site-config-server";

import { EngineeringHero } from "./EngineeringHero";
import { EngineeringDomains } from "./EngineeringDomains";
import { EngineeringMetrics } from "./EngineeringMetrics";
import { Admissions } from "./Admissions";
import { CampusLife } from "@/components/layout/CampusLife";
import { Testimonials } from "./Testimonials";

export default async function EngineeringPage() {
  const configs = await getPublishedConfigs([...ENGINEERING_CONFIG_KEYS]);

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
        <NewsEvents institution="engineering" />
        <Admissions />
        <Placements institution="engineering" />
        <CampusLife
          configKey="engineeringLifeAtJct"
          eventsHref="/institutions/engineering/events"
        />
        <Testimonials />
        <div id="footer">
          <Footer />
        </div>
      </main>
    </SiteConfigProvider>
  );
}
