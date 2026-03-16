import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description:
    "Terms governing the use of JCT Institutions' website and services.",
  openGraph: {
    title: `Terms & Conditions | ${siteConfig.name}`,
    description:
      "Terms governing the use of JCT Institutions' website and services.",
    type: "website",
  },
};

export default function TermsPage() {
  const { title, subtitle, sections } = complianceData.terms;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "Terms & Conditions" },
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
