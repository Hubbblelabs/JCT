import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";
import { getPlacementInfo } from "@/lib/public-placement-info";
import { loadHostedContentPage } from "@/lib/hosted-content";
import { PLACEMENT_GALLERY_ANCHOR } from "@/lib/page-anchors";

export const revalidate = 3600;

const PATH = "/institutions/engineering/placements";

const SEO_FALLBACK: Metadata = {
  title: "Placements | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Placement statistics, top recruiters, and notable student placements at JCT College of Engineering & Technology — year-wise career outcomes.",
};

export default async function EngineeringPlacementsPage() {
  // The placement gallery used to be a route of its own; it is now a section
  // of this page.
  const [records, info, gallery] = await Promise.all([
    listPublicPlacements("engineering"),
    getPlacementInfo("engineering"),
    loadHostedContentPage(PATH, PLACEMENT_GALLERY_ANCHOR),
  ]);
  return (
    <PlacementsPageLayout
      institution="engineering"
      records={records}
      info={info}
      gallery={gallery}
    />
  );
}

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering/placements",
  });
  return { ...SEO_FALLBACK, ...seo };
}
