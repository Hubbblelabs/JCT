import { EngineeringNavbar } from './EngineeringNavbar';
import { Placements } from '@/components/layout/Placements';
import { Footer } from '@/components/layout/Footer';
import { CollegeTestimonials } from '@/components/layout/CollegeTestimonials';

import { EngineeringHero } from './EngineeringHero';
import { EngineeringAbout } from './EngineeringAbout';
import { EngineeringDomains } from './EngineeringDomains';
import { EngineeringMetrics } from './EngineeringMetrics';
import { EngineeringResearch } from './EngineeringResearch';
import { EngineeringAdmissions } from './EngineeringAdmissions';
import { testimonials } from '@/data/engineering';

export default function EngineeringPage() {
  return (
    <main className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden">
      <EngineeringNavbar />

      <EngineeringHero />
      <EngineeringAbout />
      <EngineeringDomains />
      <EngineeringMetrics />
      <EngineeringResearch />

      <Placements />

      <div id="life-jct">
        <CollegeTestimonials
          title="Testimonials"
          subtitle="Stories from engineering students, alumni, and hiring partners who have experienced JCT's outcome-focused learning."
          accentColor="#D4A024"
          sectionBgClassName="bg-[#F8FAFC]"
          sectionId="testimonials"
          items={testimonials}
        />
      </div>

      <EngineeringAdmissions />

      <div id="footer">
        <Footer />
      </div>
    </main>
  );
}
