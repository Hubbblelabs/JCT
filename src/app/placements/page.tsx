import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { placementsData } from "@/data/placements";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Training & Placement | ${siteConfig.name}`,
  description:
    "Explore JCT Institutions' Training & Placement Cell — placement statistics, top recruiters, internship programs, career development, and alumni success stories.",
  openGraph: {
    title: `Training & Placement | ${siteConfig.name}`,
    description:
      "Explore JCT Institutions' Training & Placement Cell — placement statistics, top recruiters, internship programs, career development, and alumni success stories.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Placement Statistics",
    href: "/placements/statistics",
    description: "Year-wise placement records and highlights.",
  },
  {
    name: "Our Recruiters",
    href: "/placements/recruiters",
    description: "200+ companies that recruit from JCT.",
  },
  {
    name: "Internship Programs",
    href: "/placements/internships",
    description: "Structured industry internship opportunities.",
  },
  {
    name: "Career Development",
    href: "/placements/career-development",
    description: "Training programs to make students industry-ready.",
  },
  {
    name: "Industry MoUs",
    href: "/placements/industry-mous",
    description: "Strategic partnerships with leading organisations.",
  },
  {
    name: "Alumni Success Stories",
    href: "/placements/alumni-stories",
    description: "Graduates making a difference across the globe.",
  },
];

export default function PlacementsPage() {
  return (
    <SectionPageLayout
      title={placementsData.overview.title}
      subtitle={placementsData.overview.subtitle}
      breadcrumbs={[{ label: "Training & Placement" }]}
      description={placementsData.overview.description.join(" ")}
      subPages={subPages}
    />
  );
}
