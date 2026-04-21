import { Navbar } from "@/components/layout/Navbar";
import { HomeHero } from "@/components/layout/HomeHero";
import { TrustHighlightsRow } from "@/components/layout/TrustHighlightsRow";
import { Placements } from "@/components/layout/Placements";
import { Testimonials } from "@/components/layout/Testimonials";
import { AdmissionsCTA } from "@/components/layout/AdmissionsCTA";
import { Footer } from "@/components/layout/Footer";
import { WhyJCT } from "@/components/layout/WhyJCT";
import { CampusLife } from "@/components/layout/CampusLife";
import { HomePopup } from "@/components/layout/HomePopup";

export default function HomePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen overflow-x-hidden">
      <Navbar />
      <HomePopup />
      <HomeHero />
      <TrustHighlightsRow />
      <WhyJCT />
      <Placements />
      <CampusLife />
      <Testimonials />
      <AdmissionsCTA />
      <Footer />
    </main>
  );
}
