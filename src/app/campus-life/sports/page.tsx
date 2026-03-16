import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Sports & Recreation | ${siteConfig.name}`,
  description:
    "JCT Institutions sports facilities — cricket, football, basketball, gym, athletics, and competitive achievements at university and national levels.",
  openGraph: {
    title: `Sports & Recreation | ${siteConfig.name}`,
    description:
      "JCT Institutions sports facilities — cricket, football, basketball, gym, athletics, and competitive achievements at university and national levels.",
    type: "website",
  },
};

export default function SportsPage() {
  const { description, facilities, achievements } = campusData.sports;

  return (
    <ContentPageLayout
      title="Sports & Recreation"
      subtitle="Building Champions On and Off the Field"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Sports" },
      ]}
    >
      <p className="text-muted-foreground mb-10 text-base leading-relaxed">
        {description}
      </p>

      {/* Facilities */}
      <h2 className="text-foreground mb-6 font-serif text-2xl font-semibold">
        Sports Facilities
      </h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        {facilities.map((facility) => (
          <div
            key={facility}
            className="bg-surface border-border flex items-center gap-3 rounded-lg border px-5 py-4"
          >
            <span className="bg-gold h-2 w-2 shrink-0 rounded-full" />
            <span className="text-foreground text-sm font-medium">
              {facility}
            </span>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <h2 className="text-foreground mb-6 font-serif text-2xl font-semibold">
        Achievements
      </h2>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement} className="flex items-start gap-3">
            <Trophy className="text-gold mt-0.5 h-5 w-5 shrink-0" />
            <span className="text-muted-foreground text-sm leading-relaxed">
              {achievement}
            </span>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
