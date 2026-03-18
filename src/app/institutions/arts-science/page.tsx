import type { Metadata } from "next";
import { ArtsScienceNavbar } from "@/modules/arts-science/ArtsScienceNavbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Arts & Science | JCT College of Arts & Science, Coimbatore",
  description:
    "Explore undergraduate programs in Computer Science, AI & ML, BCA, Commerce, and Business at JCT College of Arts & Science, Coimbatore. NAAC accredited. Strong placement record.",
  openGraph: {
    title: "Arts & Science | JCT College of Arts & Science, Coimbatore",
    description:
      "Explore undergraduate programs in Computer Science, AI & ML, BCA, Commerce, and Business at JCT College of Arts & Science, Coimbatore.",
    type: "website",
  },
};

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
      <ArtsScienceNavbar forceSolidOnTop />

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
