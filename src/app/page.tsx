import { Navbar } from "@/components/layout/Navbar";
import { HomeHero } from "@/components/layout/HomeHero";
import { Institutions } from "@/components/layout/Institutions";
import { NewsEvents } from "@/components/layout/NewsEvents";
import { Placements } from "@/components/layout/Placements";
import { Testimonials } from "@/components/layout/Testimonials";
import { AdmissionsCTA } from "@/components/layout/AdmissionsCTA";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen overflow-x-hidden">
      <Navbar />
      <HomeHero />
      {/* <WhyJCT /> */}
      <Placements />
      <NewsEvents />
      <Testimonials />
      {/* <CampusLife /> */}
      <AdmissionsCTA />
      <Footer />
    </main>
  );
}
