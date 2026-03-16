import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { governanceData } from "@/data/governance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Grievance Redressal Cell | ${siteConfig.name}`,
  description:
    "The Grievance Redressal Cell at JCT Institutions provides a mechanism for raising and resolving grievances fairly.",
  openGraph: {
    title: `Grievance Redressal Cell | ${siteConfig.name}`,
    description:
      "The Grievance Redressal Cell at JCT Institutions provides a mechanism for raising and resolving grievances fairly.",
    type: "website",
  },
};

export default function GrievancePage() {
  const { title, subtitle, description, categories, process } =
    governanceData.grievance;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Governance", href: "/governance" },
        { label: "Grievance Redressal" },
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
            Grievance Categories
          </h2>
          <ul className="mt-4 space-y-2">
            {categories.map((category) => (
              <li
                key={category}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {category}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Resolution Process
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
