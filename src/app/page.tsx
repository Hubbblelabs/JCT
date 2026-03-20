"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { HomeHero } from "@/components/layout/HomeHero";

const Accreditations = dynamic(
  () =>
    import("@/components/layout/Accreditations").then(
      (mod) => mod.Accreditations,
    ),
    
  { ssr: true },
);
const Institutions = dynamic(
  () =>
    import("@/components/layout/Institutions").then((mod) => mod.Institutions),
  { ssr: true },
);
const WhyJCT = dynamic(
  () => import("@/components/layout/WhyJCT").then((mod) => mod.WhyJCT),
  { ssr: true },
);
const NewsEvents = dynamic(
  () => import("@/components/layout/NewsEvents").then((mod) => mod.NewsEvents),
  { ssr: true },
);
const Placements = dynamic(
  () => import("@/components/layout/Placements").then((mod) => mod.Placements),
  { ssr: false },
);
const Testimonials = dynamic(
  () =>
    import("@/components/layout/Testimonials").then((mod) => mod.Testimonials),
  { ssr: true },
);
const CampusLife = dynamic(
  () => import("@/components/layout/CampusLife").then((mod) => mod.CampusLife),
  { ssr: true },
);
const AdmissionsCTA = dynamic(
  () =>
    import("@/components/layout/AdmissionsCTA").then(
      (mod) => mod.AdmissionsCTA,
    ),
  { ssr: true },
);
const Footer = dynamic(
  () => import("@/components/layout/Footer").then((mod) => mod.Footer),
  { ssr: true },
);

export default function HomePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen overflow-x-hidden">
      <Navbar />
      <HomeHero />
      <Accreditations />
      <Institutions />
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
