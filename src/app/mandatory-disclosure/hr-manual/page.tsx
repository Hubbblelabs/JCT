import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `HR Manual | ${siteConfig.name}`,
  description:
    "Comprehensive human resource guidelines for faculty and staff management at JCT Institutions.",
  openGraph: {
    title: `HR Manual | ${siteConfig.name}`,
    description:
      "Comprehensive human resource guidelines for faculty and staff management at JCT Institutions.",
    type: "website",
  },
};

export default function HrManualPage() {
  const { title, subtitle, sections } = complianceData.hrManual;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "HR Manual" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Manual Sections
          </h2>
          <ul className="mt-4 space-y-2">
            {sections.map((section) => (
              <li
                key={section}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {section}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
