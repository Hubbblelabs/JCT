import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { governanceData } from "@/data/governance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `SC/ST Cell | ${siteConfig.name}`,
  description:
    "The SC/ST Cell at JCT Institutions works to ensure the welfare, protection, and academic advancement of SC/ST students.",
  openGraph: {
    title: `SC/ST Cell | ${siteConfig.name}`,
    description:
      "The SC/ST Cell at JCT Institutions works to ensure the welfare, protection, and academic advancement of SC/ST students.",
    type: "website",
  },
};

export default function ScStCellPage() {
  const { title, subtitle, description, functions } = governanceData.scStCell;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Governance", href: "/governance" },
        { label: "SC/ST Cell" },
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
            Functions
          </h2>
          <ul className="mt-4 space-y-2">
            {functions.map((fn) => (
              <li
                key={fn}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {fn}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
