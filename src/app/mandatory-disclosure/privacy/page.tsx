import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "Learn how JCT Institutions collects, uses, and protects your personal information.",
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description:
      "Learn how JCT Institutions collects, uses, and protects your personal information.",
    type: "website",
  },
};

export default function PrivacyPage() {
  const { title, subtitle, sections } = complianceData.privacy;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "Privacy Policy" },
      ]}
    >
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-foreground font-serif text-xl font-bold">
              {section.title}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </ContentPageLayout>
  );
}
