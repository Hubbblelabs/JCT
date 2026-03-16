import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `About the Institution | ${siteConfig.name}`,
  description:
    "Learn about JCT Institutions — a premier educational conglomerate in Coimbatore offering Engineering, Arts & Science, and Polytechnic programs since 2009.",
  openGraph: {
    title: `About the Institution | ${siteConfig.name}`,
    description:
      "Learn about JCT Institutions — a premier educational conglomerate in Coimbatore offering Engineering, Arts & Science, and Polytechnic programs since 2009.",
    type: "website",
  },
};

export default function InstitutionPage() {
  const { content } = aboutData.institution;

  return (
    <ContentPageLayout
      title="About the Institution"
      subtitle="A Legacy of Academic Excellence Since 2009"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "About the Institution" },
      ]}
    >
      <div className="space-y-6">
        {content.map((paragraph, index) => (
          <p
            key={index}
            className="text-muted-foreground text-base leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </ContentPageLayout>
  );
}
