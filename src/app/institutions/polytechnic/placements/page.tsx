import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";
import { getPlacementInfo } from "@/lib/public-placement-info";

export const revalidate = 3600;

const SEO_FALLBACK: Metadata = {
  title: "Placements | JCT Polytechnic College, Coimbatore",
  description:
    "Placement statistics, top recruiters, and notable student placements at JCT Polytechnic College — year-wise career outcomes.",
};

export default async function PolytechnicPlacementsPage() {
  const [records, info] = await Promise.all([
    listPublicPlacements("polytechnic"),
    getPlacementInfo("polytechnic"),
  ]);
  return (
    <PlacementsPageLayout
      institution="polytechnic"
      records={records}
      info={info}
    />
  );
}

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({
    scope: "polytechnic",
    path: "/institutions/polytechnic/placements",
  });
  return { ...SEO_FALLBACK, ...seo };
}
