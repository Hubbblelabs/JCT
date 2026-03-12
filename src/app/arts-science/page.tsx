"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Hero } from "@/modules/arts-science/Hero";
import { Philosophy } from "@/modules/arts-science/Philosophy";
import { UgPrograms } from "@/modules/arts-science/UgPrograms";
import { Distinction } from "@/modules/arts-science/Distinction";
import { Accreditation } from "@/modules/arts-science/Accreditation";
import { CampusLife } from "@/modules/arts-science/CampusLife";
import { PartnerLogos } from "@/modules/arts-science/PartnerLogos";
import { Testimonials } from "@/modules/arts-science/Testimonials";
import { NewsEvents } from "@/modules/arts-science/NewsEvents";
import { CTA } from "@/modules/arts-science/CTA";

export default function ArtsSciencePage() {
  return (
    <main className="bg-background text-foreground arts-science-theme min-h-screen overflow-x-hidden">
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
