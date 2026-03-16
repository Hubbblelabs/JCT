import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Admissions | ${siteConfig.name}`,
  description:
    "Admissions information for JCT Institutions — programs, eligibility, fees, scholarships, and how to apply for Engineering, Arts & Science, and Polytechnic courses.",
  openGraph: {
    title: `Admissions | ${siteConfig.name}`,
    description:
      "Admissions information for JCT Institutions — programs, eligibility, fees, scholarships, and how to apply for Engineering, Arts & Science, and Polytechnic courses.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Why Choose JCT?",
    href: "/admissions/why-jct",
    description: "Discover what sets JCT apart.",
  },
  {
    name: "Programs Offered",
    href: "/admissions/programs",
    description: "50+ programs across three institutions.",
  },
  {
    name: "Eligibility Criteria",
    href: "/admissions/eligibility",
    description: "Requirements for each stream.",
  },
  {
    name: "Admission Process",
    href: "/admissions/process",
    description: "Step-by-step guide to getting admitted.",
  },
  {
    name: "Fee Structure",
    href: "/admissions/fee-structure",
    description: "Transparent and competitive fees.",
  },
  {
    name: "Scholarships",
    href: "/admissions/scholarships",
    description: "Merit and need-based financial support.",
  },
  {
    name: "Available Seats",
    href: "/admissions/seats",
    description: "Seat availability for 2026-27.",
  },
  {
    name: "Prospectus",
    href: "/admissions/prospectus",
    description: "Download the official prospectus.",
  },
  {
    name: "Apply Now",
    href: "/admissions/apply",
    description: "Start your application today.",
  },
];

export default function AdmissionsPage() {
  return (
    <SectionPageLayout
      title="Admissions"
      subtitle="Your Journey to Excellence Starts Here"
      breadcrumbs={[{ label: "Admissions" }]}
      description="JCT Institutions offers admissions across Engineering, Arts & Science, and Polytechnic streams. Explore our programs, eligibility criteria, fee structure, and scholarships to find the right path for your future."
      subPages={subPages}
    />
  );
}
