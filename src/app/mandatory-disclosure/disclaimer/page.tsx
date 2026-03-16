import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Disclaimer | ${siteConfig.name}`,
  description:
    "Important legal disclaimer regarding the information provided on the JCT Institutions website.",
  openGraph: {
    title: `Disclaimer | ${siteConfig.name}`,
    description:
      "Important legal disclaimer regarding the information provided on the JCT Institutions website.",
    type: "website",
  },
};

export default function DisclaimerPage() {
  const { title, subtitle, content } = complianceData.disclaimer;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "Disclaimer" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-muted-foreground text-base leading-relaxed">
            {content}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
}
