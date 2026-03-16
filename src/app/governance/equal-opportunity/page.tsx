import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { governanceData } from "@/data/governance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Equal Opportunity Cell | ${siteConfig.name}`,
  description:
    "The Equal Opportunity Cell at JCT Institutions ensures all students have equal access to educational opportunities and campus resources.",
  openGraph: {
    title: `Equal Opportunity Cell | ${siteConfig.name}`,
    description:
      "The Equal Opportunity Cell at JCT Institutions ensures all students have equal access to educational opportunities and campus resources.",
    type: "website",
  },
};

export default function EqualOpportunityPage() {
  const { title, subtitle, description, initiatives } =
    governanceData.equalOpportunity;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Governance", href: "/governance" },
        { label: "Equal Opportunity" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-muted-foreground text-base leading-relaxed">
            {description}
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Initiatives
          </h2>
          <ul className="mt-4 space-y-2">
            {initiatives.map((initiative) => (
              <li
                key={initiative}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {initiative}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
