import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Strategic Plan | ${siteConfig.name}`,
  description:
    "Explore JCT Institutions' Strategic Plan 2024–2029 — our roadmap for academic excellence, research, and institutional growth.",
  openGraph: {
    title: `Strategic Plan | ${siteConfig.name}`,
    description:
      "Explore JCT Institutions' Strategic Plan 2024–2029 — our roadmap for academic excellence, research, and institutional growth.",
    type: "website",
  },
};

export default function StrategicPlanPage() {
  const { goals } = aboutData.strategicPlan;

  return (
    <ContentPageLayout
      title="Strategic Plan 2024–2029"
      subtitle="A Roadmap for Institutional Growth"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "Strategic Plan" },
      ]}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, index) => (
          <div key={index} className="border-border rounded-xl border p-5">
            <div className="text-gold bg-gold/10 mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
              {index + 1}
            </div>
            <h3 className="text-foreground font-serif text-base font-semibold">
              {goal.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {goal.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
