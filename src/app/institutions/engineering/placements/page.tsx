import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";
import { getPlacementInfo } from "@/lib/public-placement-info";

export const revalidate = 3600;

const SEO_FALLBACK: Metadata = {
  title: "Placements | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Placement statistics, top recruiters, and notable student placements at JCT College of Engineering & Technology — year-wise career outcomes.",
};

export default async function EngineeringPlacementsPage() {
  const [records, info] = await Promise.all([
    listPublicPlacements("engineering"),
    getPlacementInfo("engineering"),
  ]);
  return (
    <PlacementsPageLayout
      institution="engineering"
      records={records}
      info={info}
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
