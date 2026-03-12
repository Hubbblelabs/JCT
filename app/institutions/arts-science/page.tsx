"use client";

import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

// Modular components
import { Hero } from "./components/Hero";
import { Philosophy } from "./components/Philosophy";
import { UgPrograms } from "./components/UgPrograms";
import { Distinction } from "./components/Distinction";
import { Accreditation } from "./components/Accreditation";
import { CampusLife } from "./components/CampusLife";
import { PartnerLogos } from "./components/PartnerLogos";
import { Testimonials } from "./components/Testimonials";
import { NewsEvents } from "./components/NewsEvents";
import { CTA } from "./components/CTA";

export default function ArtsSciencePage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden arts-science-theme">
      <Navbar />
      
      <Hero />
      <Philosophy />
      <UgPrograms />
      <Distinction />
      <Accreditation />
      <CampusLife />
      <PartnerLogos />
      <Testimonials />
      <NewsEvents />
      <CTA />

      <Footer />
    </main>
  );
}
