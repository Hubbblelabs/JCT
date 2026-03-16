import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { academicsData } from "@/data/academics";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Academic Regulations | ${siteConfig.name}`,
  description:
    "Read the academic regulations of JCT Institutions — attendance requirements, assessment patterns, grading system, and academic integrity policies.",
  openGraph: {
    title: `Academic Regulations | ${siteConfig.name}`,
    description:
      "Read the academic regulations of JCT Institutions — attendance requirements, assessment patterns, grading system, and academic integrity policies.",
    type: "website",
  },
};

export default function RegulationsPage() {
  const { title, subtitle, sections } = academicsData.regulations;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Academics", href: "/academics" },
        { label: "Academic Regulations" },
      ]}
    >
      <div className="space-y-6">
        {sections.map((section, index) => (
          <details
            key={index}
            className="border-border group rounded-xl border"
          >
            <summary className="text-foreground group-open:text-gold cursor-pointer px-5 py-4 font-serif text-base font-semibold transition-colors select-none">
              {section.title}
            </summary>
            <div className="border-border border-t px-5 py-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          </details>
        ))}
      </div>
    </ContentPageLayout>
  );
}
