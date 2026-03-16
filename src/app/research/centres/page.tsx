import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Research Centres | ${siteConfig.name}`,
  description:
    "Dedicated research centres at JCT Institutions for AI, sustainable engineering, IoT, and advanced manufacturing.",
  openGraph: {
    title: `Research Centres | ${siteConfig.name}`,
    description:
      "Dedicated research centres at JCT Institutions for AI, sustainable engineering, IoT, and advanced manufacturing.",
    type: "website",
  },
};

export default function ResearchCentresPage() {
  const { centres } = researchData.centres;

  return (
    <ContentPageLayout
      title="Research Centres"
      subtitle="Dedicated facilities for focused research activities."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "Research Centres" },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {centres.map((centre, index) => (
          <div key={index} className="border-border rounded-xl border p-6">
            <h3 className="text-gold font-serif text-lg font-bold">
              {centre.name}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {centre.focus}
            </p>
            <p className="text-muted-foreground mt-3 text-xs">
              Established:{" "}
              <span className="text-foreground font-semibold">
                {centre.established}
              </span>
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
