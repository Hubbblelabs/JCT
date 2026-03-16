import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Student Activities | ${siteConfig.name}`,
  description:
    "Explore student activities at JCT Institutions — techfests, cultural festivals, hackathons, industrial visits, and guest lectures.",
  openGraph: {
    title: `Student Activities | ${siteConfig.name}`,
    description:
      "Explore student activities at JCT Institutions — techfests, cultural festivals, hackathons, industrial visits, and guest lectures.",
    type: "website",
  },
};

export default function ActivitiesPage() {
  const { events } = campusData.activities;

  return (
    <ContentPageLayout
      title="Student Activities"
      subtitle="A Vibrant Campus Life Beyond Academics"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Activities" },
      ]}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {events.map((event) => (
          <div
            key={event.name}
            className="bg-surface border-border rounded-xl border p-6"
          >
            <h3 className="text-foreground font-serif text-lg font-semibold">
              {event.name}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
