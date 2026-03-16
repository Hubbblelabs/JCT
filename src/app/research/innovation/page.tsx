import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Innovation Activities | ${siteConfig.name}`,
  description:
    "Innovation and entrepreneurship activities at JCT — innovation hub, hackathons, startup incubation, and challenges.",
  openGraph: {
    title: `Innovation Activities | ${siteConfig.name}`,
    description:
      "Innovation and entrepreneurship activities at JCT — innovation hub, hackathons, startup incubation, and challenges.",
    type: "website",
  },
};

export default function InnovationPage() {
  const { activities } = researchData.innovation;

  return (
    <ContentPageLayout
      title="Innovation Activities"
      subtitle="Nurturing the spirit of innovation and entrepreneurship."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "Innovation Activities" },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {activities.map((activity, index) => (
          <div key={index} className="border-border rounded-xl border p-6">
            <h3 className="text-gold font-serif text-lg font-bold">
              {activity.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {activity.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
