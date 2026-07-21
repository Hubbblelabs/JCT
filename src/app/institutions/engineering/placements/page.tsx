import type { Metadata } from "next";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";
import { getPlacementInfo } from "@/lib/public-placement-info";

export const revalidate = 3600;

export const metadata: Metadata = {
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
