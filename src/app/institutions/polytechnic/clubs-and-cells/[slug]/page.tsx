import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GroupDetailLayout } from "@/components/layout/GroupDetailLayout";
import { findGroupBySlug, listGroupSlugs } from "@/lib/group-slugs";
import { getPublishedPolytechnicClubs } from "@/lib/polytechnic-clubs-server";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

export async function generateStaticParams() {
  // A DB outage must not abort the build — the slugs then render on demand.
  const data = await getPublishedPolytechnicClubs();
  return listGroupSlugs(data.groups).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedPolytechnicClubs();
  const found = findGroupBySlug(data.groups, slug);
  return seoMetadata({
    scope: "polytechnic",
    path: `/institutions/polytechnic/clubs-and-cells/${slug}`,
    fallbackTitle: found
      ? `${found.group.name} | JCT Polytechnic College`
      : "Clubs & Cells | JCT Polytechnic College",
    fallbackDescription:
      found?.group.description ||
      "Student club at JCT Polytechnic College, Coimbatore.",
  });
}

export default async function PolytechnicClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublishedPolytechnicClubs();
  const found = findGroupBySlug(data.groups, slug);
  if (!found || found.group.name.trim() === "") return notFound();
  return (
    <GroupDetailLayout
      group={found.group}
      variant="clubs"
      institution="polytechnic"
    />
  );
}
