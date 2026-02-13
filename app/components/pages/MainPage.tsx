"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/app/components/Navbar";
import { HomeHero } from "@/app/components/HomeHero";
import { FloatingCTA } from "@/app/components/FloatingCTA";

// Dynamically load below-the-fold components
const TrustIndicators = dynamic(() => import("@/app/components/TrustIndicators").then(mod => mod.TrustIndicators), { ssr: true });
const Accreditations = dynamic(() => import("@/app/components/Accreditations").then(mod => mod.Accreditations), { ssr: true });
const Institutions = dynamic(() => import("@/app/components/Institutions").then(mod => mod.Institutions), { ssr: true });
const CompanyCarousel = dynamic(() => import("@/app/components/CompanyCarousel").then(mod => mod.CompanyCarousel), { ssr: false }); // Carousel often heavy on hydration
const LegacyValues = dynamic(() => import("@/app/components/LegacyValues").then(mod => mod.LegacyValues), { ssr: true });
const ImpactStats = dynamic(() => import("@/app/components/ImpactStats").then(mod => mod.ImpactStats), { ssr: true });
const AdmissionsCTA = dynamic(() => import("@/app/components/AdmissionsCTA").then(mod => mod.AdmissionsCTA), { ssr: true });
const Footer = dynamic(() => import("@/app/components/Footer").then(mod => mod.Footer), { ssr: true });

export default function MainPage() {
    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />
            <HomeHero />
            <TrustIndicators />
            <Accreditations />
            <Institutions />
            <CompanyCarousel />
            <LegacyValues />
            <ImpactStats />
            <AdmissionsCTA />
            <FloatingCTA />
            <Footer />
        </main>
    );
}
