import type { Metadata } from "next";
import { PlacementsPageLayout } from "@/components/layout/PlacementsPageLayout";
import { listPublicPlacements } from "@/lib/public-placements";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Placements | JCT Polytechnic College, Coimbatore",
  description:
    "Placement statistics, top recruiters, and notable student placements at JCT Polytechnic College — year-wise career outcomes.",
};

export default async function PolytechnicPlacementsPage() {
  const records = await listPublicPlacements("polytechnic");
  return <PlacementsPageLayout institution="polytechnic" records={records} />;
}
