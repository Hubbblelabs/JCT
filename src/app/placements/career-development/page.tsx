import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { placementsData } from "@/data/placements";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Career Development Programs | ${siteConfig.name}`,
  description:
    "Learn about JCT Institutions' career development programs — aptitude training, soft skills, technical workshops, mock interviews, and more.",
  openGraph: {
    title: `Career Development Programs | ${siteConfig.name}`,
    description:
      "Learn about JCT Institutions' career development programs — aptitude training, soft skills, technical workshops, mock interviews, and more.",
    type: "website",
  },
};

export default function CareerDevelopmentPage() {
  const { programs } = placementsData.careerDevelopment;

  return (
    <ContentPageLayout
      title={placementsData.careerDevelopment.title}
      subtitle={placementsData.careerDevelopment.subtitle}
      breadcrumbs={[
        { label: "Training & Placement", href: "/placements" },
        { label: "Career Development" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div
            key={program.title}
            className="border-border rounded-xl border p-5"
          >
            <h3 className="text-gold font-sans text-sm font-semibold">
              {program.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {program.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
