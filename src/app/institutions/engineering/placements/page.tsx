import type { Metadata } from "next";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Placements | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Placement statistics, top recruiters, and notable student placements at JCT College of Engineering & Technology — year-wise career outcomes.",
};

export default async function EngineeringPlacementsPage() {
  const records = await listPublicPlacements("engineering");
  return <PlacementsPageLayout institution="engineering" records={records} />;
}
