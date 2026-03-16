import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Campus Gallery | ${siteConfig.name}`,
  description:
    "Browse the JCT Institutions campus gallery — photos from events, labs, sports, cultural programs, and graduation ceremonies.",
  openGraph: {
    title: `Campus Gallery | ${siteConfig.name}`,
    description:
      "Browse the JCT Institutions campus gallery — photos from events, labs, sports, cultural programs, and graduation ceremonies.",
    type: "website",
  },
};

export default function GalleryPage() {
  const { categories } = campusData.gallery;

  return (
    <ContentPageLayout
      title="Campus Gallery"
      subtitle="Glimpses of Life at JCT Institutions"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Gallery" },
      ]}
    >
      {/* Category tabs as placeholders */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            className="bg-surface border-border text-foreground hover:border-gold hover:text-gold rounded-full border px-5 py-2 text-sm font-medium transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Placeholder grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted border-border flex aspect-square items-center justify-center rounded-xl border"
          >
            <span className="text-muted-foreground text-sm">Coming Soon</span>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
