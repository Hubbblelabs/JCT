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
import { AboutArtsScience } from "@/modules/arts-science/AboutArtsScience";
import { UgPrograms } from "@/modules/arts-science/UgPrograms";
import { CampusLife } from "@/modules/arts-science/CampusLife";
import { Testimonials } from "@/modules/arts-science/Testimonials";
import { Placements } from "@/components/layout/Placements";

export default function ArtsSciencePage() {
  return (
    <main className="bg-background text-foreground arts-science-theme min-h-screen overflow-x-hidden">
      <ArtsScienceNavbar />
      <Hero />
      <UgPrograms />
      <AboutArtsScience />
      {/* <Distinction /> */}
      <Placements /> <CampusLife />
      <Testimonials />
      {/* <CTA /> */}
      <Footer />
    </main>
  );
}
