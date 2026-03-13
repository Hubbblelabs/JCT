import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/modules/polytechnic/Hero";
import { Connect } from "@/modules/polytechnic/Connect";
import { DiplomaPrograms } from "@/modules/polytechnic/DiplomaPrograms";
import { Distinction } from "@/modules/polytechnic/Distinction";
import { CampusLife } from "@/modules/polytechnic/CampusLife";
import { Recruiters } from "@/modules/polytechnic/Recruiters";
import { NewsEvents } from "@/modules/polytechnic/NewsEvents";
import { Admissions } from "@/modules/polytechnic/Admissions";

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
      <Navbar />
      <Hero />
      <Connect />
      <DiplomaPrograms />
      <Distinction />
      <CampusLife />
      <Recruiters />
      <NewsEvents />
      <Admissions />
      <Footer />
    </main>
  );
}
