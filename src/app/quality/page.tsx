import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Quality Assurance | ${siteConfig.name}`,
  description:
    "Discover JCT Institutions' commitment to quality — accreditations, IQAC initiatives, feedback systems, and awards.",
  openGraph: {
    title: `Quality Assurance | ${siteConfig.name}`,
    description:
      "Discover JCT Institutions' commitment to quality — accreditations, IQAC initiatives, feedback systems, and awards.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Accreditations & Recognitions",
    href: "/quality/accreditations",
    description: "Our quality credentials and institutional recognitions.",
  },
  {
    name: "IQAC",
    href: "/quality/iqac",
    description:
      "Internal Quality Assurance Cell driving continuous improvement.",
  },
  {
    name: "Feedback Systems",
    href: "/quality/feedback",
    description: "Listening to stakeholders for continuous improvement.",
  },
  {
    name: "Awards & Achievements",
    href: "/quality/awards",
    description: "Recognitions that celebrate our excellence.",
  },
];

export default function QualityPage() {
  return (
    <SectionPageLayout
      title="Quality Assurance"
      subtitle="Committed to Excellence in Education"
      breadcrumbs={[{ label: "Quality Assurance" }]}
      description="JCT Institutions is committed to maintaining the highest standards of quality in education, infrastructure, and governance. Our quality assurance framework encompasses accreditations, continuous improvement processes, and stakeholder feedback."
      subPages={subPages}
    />
  );
}
