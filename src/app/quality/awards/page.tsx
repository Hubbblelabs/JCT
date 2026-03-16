import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { qualityData } from "@/data/quality";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Awards & Achievements | ${siteConfig.name}`,
  description:
    "Explore the awards and achievements earned by JCT Institutions — recognitions that celebrate excellence in education.",
  openGraph: {
    title: `Awards & Achievements | ${siteConfig.name}`,
    description:
      "Explore the awards and achievements earned by JCT Institutions — recognitions that celebrate excellence in education.",
    type: "website",
  },
};

export default function AwardsPage() {
  const { title, subtitle, awards } = qualityData.awards;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Quality Assurance", href: "/quality" },
        { label: "Awards" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {awards.map((award) => (
          <div
            key={award.title}
            className="border-border rounded-xl border p-5"
          >
            <h3 className="text-gold font-sans text-sm font-semibold">
              {award.title}
            </h3>
            <p className="text-foreground mt-1 text-xs font-medium">
              {award.body}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Year: {award.year}
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {award.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
