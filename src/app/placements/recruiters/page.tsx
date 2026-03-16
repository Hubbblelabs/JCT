import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { placementsData } from "@/data/placements";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Our Recruiters | ${siteConfig.name}`,
  description:
    "Explore the 200+ top companies that recruit from JCT Institutions, including TCS, Infosys, Wipro, Zoho, Amazon, and more.",
  openGraph: {
    title: `Our Recruiters | ${siteConfig.name}`,
    description:
      "Explore the 200+ top companies that recruit from JCT Institutions, including TCS, Infosys, Wipro, Zoho, Amazon, and more.",
    type: "website",
  },
};

export default function RecruitersPage() {
  const { companies } = placementsData.recruiters;

  return (
    <ContentPageLayout
      title={placementsData.recruiters.title}
      subtitle={placementsData.recruiters.subtitle}
      breadcrumbs={[
        { label: "Training & Placement", href: "/placements" },
        { label: "Our Recruiters" },
      ]}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {companies.map((company) => (
          <div
            key={company}
            className="border-border bg-muted text-foreground flex items-center justify-center rounded-lg border px-4 py-3 text-center text-sm font-medium"
          >
            {company}
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
