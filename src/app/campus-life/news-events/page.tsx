import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `News & Events | ${siteConfig.name}`,
  description:
    "Stay updated with the latest news and events at JCT Institutions — achievements, partnerships, placements, and campus happenings.",
  openGraph: {
    title: `News & Events | ${siteConfig.name}`,
    description:
      "Stay updated with the latest news and events at JCT Institutions — achievements, partnerships, placements, and campus happenings.",
    type: "website",
  },
};

export default function NewsEventsPage() {
  const { news } = campusData.newsEvents;

  return (
    <ContentPageLayout
      title="News & Events"
      subtitle="Stay Updated with the Latest Happenings"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "News & Events" },
      ]}
    >
      <div className="space-y-6">
        {news.map((item) => (
          <article
            key={item.title}
            className="bg-surface border-border rounded-xl border p-6"
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="bg-muted text-gold rounded-full px-3 py-1 text-xs font-semibold">
                {item.category}
              </span>
              <time className="text-muted-foreground text-xs">
                {new Date(item.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h3 className="text-foreground font-serif text-lg font-semibold">
              {item.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.excerpt}
            </p>
          </article>
        ))}
      </div>
    </ContentPageLayout>
  );
}
