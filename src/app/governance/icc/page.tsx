import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { governanceData } from "@/data/governance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Internal Complaints Committee | ${siteConfig.name}`,
  description:
    "The ICC at JCT Institutions addresses complaints of sexual harassment and ensures a safe working and learning environment.",
  openGraph: {
    title: `Internal Complaints Committee | ${siteConfig.name}`,
    description:
      "The ICC at JCT Institutions addresses complaints of sexual harassment and ensures a safe working and learning environment.",
    type: "website",
  },
};

export default function IccPage() {
  const { title, subtitle, description, process } = governanceData.icc;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Governance", href: "/governance" },
        { label: "ICC" },
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
            Complaint Resolution Process
          </h2>
          <ol className="mt-4 space-y-4">
            {process.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="bg-gold text-navy flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-muted-foreground pt-0.5 text-sm leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </ContentPageLayout>
  );
}
