import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Research | ${siteConfig.name}`,
  description:
    "Explore research activities at JCT Institutions — policy, R&D cell, research centres, publications, funded projects, patents, innovation, and workshops.",
  openGraph: {
    title: `Research | ${siteConfig.name}`,
    description:
      "Explore research activities at JCT Institutions — policy, R&D cell, research centres, publications, funded projects, patents, innovation, and workshops.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Research Policy",
    href: "/research/policy",
    description: "Our framework for promoting high-quality research.",
  },
  {
    name: "R&D Cell",
    href: "/research/rnd-cell",
    description: "The nerve centre of research activities at JCT.",
  },
  {
    name: "Research Centres",
    href: "/research/centres",
    description: "Dedicated facilities for focused research activities.",
  },
  {
    name: "Publications",
    href: "/research/publications",
    description: "Scholarly contributions by JCT faculty and students.",
  },
  {
    name: "Funded Projects",
    href: "/research/funded-projects",
    description: "Research projects supported by government and industry.",
  },
  {
    name: "Patents",
    href: "/research/patents",
    description: "Intellectual property contributions from JCT researchers.",
  },
  {
    name: "Innovation Activities",
    href: "/research/innovation",
    description: "Nurturing the spirit of innovation and entrepreneurship.",
  },
  {
    name: "Workshops & Conferences",
    href: "/research/workshops",
    description: "Knowledge sharing through academic events.",
  },
];

export default function ResearchPage() {
  return (
    <SectionPageLayout
      title="Research"
      subtitle="Advancing Knowledge Through Innovation"
      breadcrumbs={[{ label: "Research" }]}
      description="JCT Institutions fosters a vibrant research ecosystem with dedicated centres, funded projects, and a strong publication record. Explore our research initiatives and scholarly contributions."
      subPages={subPages}
    />
  );
}
