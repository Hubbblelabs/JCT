"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/app/components/Navbar";
import { HomeHero } from "@/app/components/HomeHero";

const Accreditations = dynamic(
  () => import("@/app/components/Accreditations").then((mod) => mod.Accreditations),
  { ssr: true },
);
const ProgramsExplorer = dynamic(
  () => import("@/app/components/ProgramsExplorer").then((mod) => mod.ProgramsExplorer),
  { ssr: true },
);
const Institutions = dynamic(
  () => import("@/app/components/Institutions").then((mod) => mod.Institutions),
  { ssr: true },
);
const WhyJCT = dynamic(
  () => import("@/app/components/WhyJCT").then((mod) => mod.WhyJCT),
  { ssr: true },
);
const NewsEvents = dynamic(
  () => import("@/app/components/NewsEvents").then((mod) => mod.NewsEvents),
  { ssr: true },
);
const Placements = dynamic(
  () => import("@/app/components/Placements").then((mod) => mod.Placements),
  { ssr: false },
);
const Testimonials = dynamic(
  () => import("@/app/components/Testimonials").then((mod) => mod.Testimonials),
  { ssr: true },
);
const CampusLife = dynamic(
  () => import("@/app/components/CampusLife").then((mod) => mod.CampusLife),
  { ssr: true },
);
const AdmissionsCTA = dynamic(
  () => import("@/app/components/AdmissionsCTA").then((mod) => mod.AdmissionsCTA),
  { ssr: true },
);
const Footer = dynamic(
  () => import("@/app/components/Footer").then((mod) => mod.Footer),
  { ssr: true },
);

export default function MainPage() {
  return (
    <main className="min-h-screen bg-surface text-foreground overflow-x-hidden">
      <Navbar />
      <HomeHero />
      <Accreditations />
      <ProgramsExplorer />
      <Institutions />
      <WhyJCT />
      <NewsEvents />
      <Placements />
      <Testimonials />
      <CampusLife />
      <AdmissionsCTA />
      <Footer />
    </main>
  );
}
