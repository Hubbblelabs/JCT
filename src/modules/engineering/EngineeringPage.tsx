import { EngineeringNavbar } from './EngineeringNavbar';
import { Placements } from '@/components/layout/Placements';
import { Footer } from '@/components/layout/Footer';
import { CollegeTestimonials } from '@/components/layout/CollegeTestimonials';

import { EngineeringHero } from './components/EngineeringHero';
import { EngineeringAbout } from './components/EngineeringAbout';
import { EngineeringDomains } from './components/EngineeringDomains';
import { EngineeringMetrics } from './components/EngineeringMetrics';
import { EngineeringResearch } from './components/EngineeringResearch';
import { EngineeringAdmissions } from './components/EngineeringAdmissions';
import { testimonials } from './components/data';

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
