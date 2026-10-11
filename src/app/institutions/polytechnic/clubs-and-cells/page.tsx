import type { Metadata } from "next";
import { GroupsPageLayout } from "@/components/layout/GroupsPageLayout";
import { getPublishedPolytechnicClubs } from "@/lib/polytechnic-clubs-server";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "polytechnic",
    path: "/institutions/polytechnic/clubs-and-cells",
    fallbackTitle: "Clubs & Cells | JCT Polytechnic College",
    fallbackDescription:
      "Student clubs and cells at JCT Polytechnic College, Coimbatore — fine arts, cultural, technical and social activities.",
  });
}

export default async function PolytechnicClubsPage() {
  const data = await getPublishedPolytechnicClubs();
  return (
    <GroupsPageLayout data={data} variant="clubs" institution="polytechnic" />
  );
}
