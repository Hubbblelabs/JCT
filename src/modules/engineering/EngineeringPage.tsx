import { Navbar } from "@/components/layout/Navbar";
import { Placements } from "@/components/layout/Placements";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

import { EngineeringHero } from "./EngineeringHero";
import { EngineeringDomains } from "./EngineeringDomains";
import { EngineeringMetrics } from "./EngineeringMetrics";
import { EngineeringResearch } from "./EngineeringResearch";
import { CampusLife } from "@/components/layout/CampusLife";
import { Testimonials } from "./Testimonials";

export default function EngineeringPage() {
  return (
    <main
      id="top"
      className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden"
    >
      <AnnouncementBar configKey="engineeringAnnouncement" />
      <Navbar />
      <EngineeringHero />
      <EngineeringDomains />
      <EngineeringMetrics />
      <EngineeringResearch />

      <Placements />
      <CampusLife />

      <Testimonials />
      <div id="footer">
        <Footer />
      </div>
    </main>
  );
}
