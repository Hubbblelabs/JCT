import type { Metadata } from "next";
import { PolytechnicNavbar } from "@/modules/polytechnic/PolytechnicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/modules/polytechnic/Hero";
import { AboutPolytechnic } from "@/modules/polytechnic/AboutPolytechnic";
import { DiplomaPrograms } from "@/modules/polytechnic/DiplomaPrograms";
import { Admissions } from "@/modules/polytechnic/Admissions";
import { Placements } from "@/components/layout/Placements";
import { NewsEvents } from "@/components/layout/NewsEvents";
import { Testimonials } from "@/modules/polytechnic/Testimonials";

export const metadata: Metadata = {
  title: "Polytechnic | JCT Polytechnic College, Coimbatore",
  description:
    "JCT Polytechnic College offers AICTE-approved three-year diploma programs in Computer Technology, Mechanical, Civil, Electrical & Electronics, Agricultural, and Petrochemical Engineering. Workshop-driven training with 85% placement rate.",
  openGraph: {
    title: "JCT Polytechnic College | Diploma Programs, Coimbatore",
    description:
      "AICTE-approved diploma programs with industry-linked training. 85% placement rate. Lateral entry to B.E. available.",
    type: "website",
  },
};

export default function PolytechnicPage() {
  return (
    <main className="polytechnic-theme min-h-screen overflow-x-hidden bg-[#F8F9FA] font-sans">
      <PolytechnicNavbar />
      <Hero />
      <DiplomaPrograms />
      <AboutPolytechnic />
      {/* <Distinction /> */}
      <Placements />
      <NewsEvents />
      <Testimonials />
      <Admissions />
      <Footer />
    </main>
  );
}
