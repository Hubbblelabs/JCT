import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Student Satisfaction Survey | ${siteConfig.name}`,
  description:
    "JCT Institutions conducts annual student satisfaction surveys to gather feedback and drive continuous improvement.",
  openGraph: {
    title: `Student Satisfaction Survey | ${siteConfig.name}`,
    description:
      "JCT Institutions conducts annual student satisfaction surveys to gather feedback and drive continuous improvement.",
    type: "website",
  },
};

export default function SurveyPage() {
  const { title, subtitle, description } = complianceData.survey;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "Student Satisfaction Survey" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-muted-foreground text-base leading-relaxed">
            {description}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
}
