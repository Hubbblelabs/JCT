import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Research Policy | ${siteConfig.name}`,
  description:
    "JCT Institutions' research policy — fostering a culture of inquiry, innovation, and scholarly excellence.",
  openGraph: {
    title: `Research Policy | ${siteConfig.name}`,
    description:
      "JCT Institutions' research policy — fostering a culture of inquiry, innovation, and scholarly excellence.",
    type: "website",
  },
};

export default function ResearchPolicyPage() {
  const { description, keyAreas } = researchData.policy;

  return (
    <ContentPageLayout
      title="Research Policy"
      subtitle="Fostering a culture of inquiry, innovation, and scholarly excellence."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "Research Policy" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Overview
          </h2>
          <div className="mt-4 space-y-4">
            {description.map((para, index) => (
              <p
                key={index}
                className="text-muted-foreground text-base leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Key Research Areas
          </h2>
          <ul className="mt-4 space-y-3">
            {keyAreas.map((area, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="bg-gold/10 text-gold mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-muted-foreground text-base leading-relaxed">
                  {area}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
