import type { Metadata } from "next";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";
import { getPlacementInfo } from "@/lib/public-placement-info";

export const revalidate = 3600;

export const metadata: Metadata = {
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
