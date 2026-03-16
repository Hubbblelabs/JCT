import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { placementsData } from "@/data/placements";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Internship Programs | ${siteConfig.name}`,
  description:
    "Discover structured internship opportunities at JCT Institutions — summer internships, industrial training, in-plant training, and research internships.",
  openGraph: {
    title: `Internship Programs | ${siteConfig.name}`,
    description:
      "Discover structured internship opportunities at JCT Institutions — summer internships, industrial training, in-plant training, and research internships.",
    type: "website",
  },
};

export default function InternshipsPage() {
  const { programs, description } = placementsData.internships;

  return (
    <ContentPageLayout
      title={placementsData.internships.title}
      subtitle={placementsData.internships.subtitle}
      breadcrumbs={[
        { label: "Training & Placement", href: "/placements" },
        { label: "Internship Programs" },
      ]}
    >
      <div className="space-y-8">
        <p className="text-muted-foreground text-base leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.title}
              className="border-border rounded-xl border p-5"
            >
              <h3 className="text-gold font-sans text-sm font-semibold">
                {program.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-xs font-medium">
                Duration: {program.duration}
              </p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ContentPageLayout>
  );
}
