import { Navbar } from "@/components/layout/Navbar";
import { Placements } from "@/components/layout/Placements";
import { Footer } from "@/components/layout/Footer";

import { EngineeringHero } from "./EngineeringHero";
import { EngineeringDomains } from "./EngineeringDomains";
import { EngineeringMetrics } from "./EngineeringMetrics";
import { EngineeringResearch } from "./EngineeringResearch";
import { CampusLife } from "./CampusLife";
import { Testimonials } from "./Testimonials";

export default function EngineeringPage() {
  return (
    <main
      id="top"
      className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden"
    >
      <Navbar />
      <EngineeringHero />
      <EngineeringDomains />
      <EngineeringMetrics />
      <EngineeringResearch />

      <Placements />
      <div id="campus-life">
        <CampusLife />
      </div>

      <Testimonials />
      <div id="footer">
        <Footer />
      </div>
    </main>
  );
}
