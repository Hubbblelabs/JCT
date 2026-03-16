import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Code of Conduct | ${siteConfig.name}`,
  description:
    "Standards of behavior expected from all members of the JCT community — students, faculty, and staff.",
  openGraph: {
    title: `Code of Conduct | ${siteConfig.name}`,
    description:
      "Standards of behavior expected from all members of the JCT community — students, faculty, and staff.",
    type: "website",
  },
};

export default function CodeOfConductPage() {
  const { title, subtitle, sections } = complianceData.codeOfConduct;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "Code of Conduct" },
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
