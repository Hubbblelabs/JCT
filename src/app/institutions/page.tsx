import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Our Institutions | ${siteConfig.name}`,
  description:
    "Explore JCT's three premier institutions — Engineering, Arts & Science, and Polytechnic — each committed to academic excellence and career-focused education in Coimbatore.",
  openGraph: {
    title: `Our Institutions | ${siteConfig.name}`,
    description:
      "Explore JCT's three premier institutions — Engineering, Arts & Science, and Polytechnic — each committed to academic excellence and career-focused education in Coimbatore.",
    type: "website",
  },
};

const subPages = [
  {
    name: "JCT College of Engineering & Technology",
    href: "/institutions/engineering",
    description:
      "B.E. / B.Tech programs in CSE, ECE, Mechanical, Civil, EEE & IT. Anna University affiliated.",
  },
  {
    name: "JCT College of Arts & Science",
    href: "/institutions/arts-science",
    description:
      "Undergraduate programs in Computer Science, AI & ML, BCA, Commerce, and Business. Bharathiar University affiliated.",
  },
  {
    name: "JCT Polytechnic College",
    href: "/institutions/polytechnic",
    description:
      "AICTE-approved three-year diploma programs with hands-on training and 85% placement rate.",
  },
];

export default function InstitutionsPage() {
  return (
    <SectionPageLayout
      title="Our Institutions"
      subtitle="Three Colleges, One Commitment to Excellence"
      breadcrumbs={[{ label: "Institutions" }]}
      description="JCT Group of Institutions is a premier educational conglomerate in Coimbatore comprising three distinguished colleges — each offering specialized programs, modern infrastructure, and strong industry connections."
      subPages={subPages}
    />
  );
}
