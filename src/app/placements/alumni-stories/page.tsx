import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { placementsData } from "@/data/placements";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Alumni Success Stories | ${siteConfig.name}`,
  description:
    "Read inspiring success stories from JCT alumni working at Google, Amazon, Zoho, Ashok Leyland, and other top companies.",
  openGraph: {
    title: `Alumni Success Stories | ${siteConfig.name}`,
    description:
      "Read inspiring success stories from JCT alumni working at Google, Amazon, Zoho, Ashok Leyland, and other top companies.",
    type: "website",
  },
};

export default function AlumniStoriesPage() {
  const { stories } = placementsData.alumniStories;

  return (
    <ContentPageLayout
      title={placementsData.alumniStories.title}
      subtitle={placementsData.alumniStories.subtitle}
      breadcrumbs={[
        { label: "Training & Placement", href: "/placements" },
        { label: "Alumni Success Stories" },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stories.map((story) => (
          <div key={story.name} className="border-border rounded-xl border p-5">
            <blockquote className="text-muted-foreground text-sm leading-relaxed italic">
              &ldquo;{story.testimonial}&rdquo;
            </blockquote>
            <div className="mt-4">
              <p className="text-foreground font-sans text-sm font-semibold">
                {story.name}
              </p>
              <p className="text-gold text-xs font-medium">
                {story.role}, {story.company}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Batch: {story.batch}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
