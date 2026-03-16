import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Organizational Structure | ${siteConfig.name}`,
  description:
    "Understand the organizational structure of JCT Institutions — a well-defined governance framework ensuring academic excellence.",
  openGraph: {
    title: `Organizational Structure | ${siteConfig.name}`,
    description:
      "Understand the organizational structure of JCT Institutions — a well-defined governance framework ensuring academic excellence.",
    type: "website",
  },
};

export default function OrganizationalStructurePage() {
  const { levels } = aboutData.organizationalStructure;

  return (
    <ContentPageLayout
      title="Organizational Structure"
      subtitle="A Well-Defined Governance Framework"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "Organizational Structure" },
      ]}
    >
      <div className="space-y-0">
        {levels.map((level, index) => (
          <div
            key={index}
            className="relative flex items-start gap-5 pb-8 last:pb-0"
          >
            {/* Connector line */}
            {index < levels.length - 1 && (
              <div className="bg-border absolute top-10 bottom-0 left-5 w-px" />
            )}

            {/* Level number */}
            <div className="bg-gold/10 text-gold relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {index + 1}
            </div>

            {/* Content */}
            <div className="pt-1.5">
              <h3 className="text-foreground font-serif text-lg font-semibold">
                {level.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {level.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
