import { Navbar } from "@/components/layout/Navbar";
import { EngineeringPopup } from "./EngineeringPopup";
import { Placements } from "@/components/layout/Placements";
import { Footer } from "@/components/layout/Footer";
import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";

import { EngineeringHero } from "./EngineeringHero";
import { EngineeringDomains } from "./EngineeringDomains";
import { EngineeringMetrics } from "./EngineeringMetrics";
import { EngineeringResearch } from "./EngineeringResearch";
import { CampusLife } from "./CampusLife";
import { testimonials } from "@/data/engineering";

export default function EngineeringPage() {
  return (
    <main
      id="top"
      className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden"
    >
      <Navbar />
      <EngineeringPopup />

      <EngineeringHero />
      <EngineeringDomains />
      <EngineeringMetrics />
      <EngineeringResearch />

      <Placements />
      <CampusLife />

      <div id="life-at-jct">
        <CollegeTestimonials
          title="Testimonials"
          subtitle="Stories from engineering students, alumni, and hiring partners who have experienced JCT's outcome-focused learning."
          accentColor="#D4A024"
          sectionBgClassName="bg-[#F8FAFC]"
          sectionId="testimonials"
          items={testimonials}
        />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </main>
  );
}
