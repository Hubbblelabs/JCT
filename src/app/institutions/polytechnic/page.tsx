import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/modules/polytechnic/Hero";
import { AboutPolytechnic } from "@/modules/polytechnic/AboutPolytechnic";
import { DiplomaPrograms } from "@/modules/polytechnic/DiplomaPrograms";
import { Admissions } from "@/modules/polytechnic/Admissions";
import { Placements } from "@/components/layout/Placements";
import { CampusLife } from "@/modules/polytechnic/CampusLife";
import { Testimonials } from "@/modules/polytechnic/Testimonials";

export const metadata: Metadata = {
  title: "Polytechnic | JCT Polytechnic College, Coimbatore",
  description:
    "JCT Polytechnic College offers AICTE-approved three-year diploma programs in Computer Technology, Mechanical, Civil, Electrical & Electronics, Agricultural, and Petrochemical Engineering. Workshop-driven training with 98% placement rate.",
  openGraph: {
    title: "JCT Polytechnic College | Diploma Programs, Coimbatore",
    description:
      "AICTE-approved diploma programs with industry-linked training. 98% placement rate. Lateral entry to B.E. available.",
    type: "website",
  },
};

export default function PolytechnicPage() {
  return (
    <main
      id="top"
      className="polytechnic-theme min-h-screen overflow-x-hidden bg-[#F8F9FA] font-sans"
    >
      <Navbar />
      <Hero />
      <DiplomaPrograms />
      <Admissions />
      {/* <AboutPolytechnic /> */}
      {/* <Distinction /> */}
      <Placements />
      <CampusLife />
      <Testimonials />
      <Footer />
    </main>
  );
}
