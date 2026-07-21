import type { Metadata } from "next";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";
import { getPlacementInfo } from "@/lib/public-placement-info";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Placements | JCT College of Arts & Science, Coimbatore",
  description:
    "Placement statistics, top recruiters, and notable student placements at JCT College of Arts & Science — year-wise career outcomes.",
};

export default async function ArtsSciencePlacementsPage() {
  const [records, info] = await Promise.all([
    listPublicPlacements("arts-science"),
    getPlacementInfo("arts-science"),
  ]);
  return (
    <PlacementsPageLayout
      institution="arts-science"
      records={records}
      info={info}
    />
  );
}
