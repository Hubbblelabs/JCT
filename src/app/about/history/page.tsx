import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `History | ${siteConfig.name}`,
  description:
    "Explore the history of JCT Institutions — key milestones from our founding in 2009 to our continuing growth today.",
  openGraph: {
    title: `History | ${siteConfig.name}`,
    description:
      "Explore the history of JCT Institutions — key milestones from our founding in 2009 to our continuing growth today.",
    type: "website",
  },
};

export default function HistoryPage() {
  const { milestones } = aboutData.history;

  return (
    <ContentPageLayout
      title="Our History"
      subtitle="From Vision to Excellence"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "History" },
      ]}
    >
      {/* Vertical timeline */}
      <div className="relative space-y-0">
        {/* Timeline line */}
        <div className="bg-border absolute top-2 bottom-2 left-[19px] w-px" />

        {milestones.map((milestone, index) => (
          <div key={index} className="relative flex gap-6 pb-10 last:pb-0">
            {/* Dot */}
            <div className="relative z-10 flex shrink-0 flex-col items-center">
              <div className="bg-gold h-[10px] w-[10px] rounded-full" />
            </div>

            {/* Content */}
            <div className="-mt-1">
              <span className="text-gold text-sm font-bold">
                {milestone.year}
              </span>
              <h3 className="text-foreground mt-1 font-serif text-lg font-semibold">
                {milestone.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
