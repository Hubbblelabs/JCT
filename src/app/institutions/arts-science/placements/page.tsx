import type { Metadata } from "next";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Placements | JCT College of Arts & Science, Coimbatore",
  description:
    "Placement statistics, top recruiters, and notable student placements at JCT College of Arts & Science — year-wise career outcomes.",
};

export default async function ArtsSciencePlacementsPage() {
  const records = await listPublicPlacements("arts-science");
  return <PlacementsPageLayout institution="arts-science" records={records} />;
}
