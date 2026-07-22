import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { GroupDetailLayout } from "@/components/layout/GroupDetailLayout";
import { GroupsPageSchema } from "@/lib/validation";
import type { GroupsPageValue } from "@/lib/validation";
import { findGroupBySlug, listGroupSlugs } from "@/lib/group-slugs";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

const EMPTY: GroupsPageValue = GroupsPageSchema.parse({});

async function getData(): Promise<GroupsPageValue> {
  const value = await getPublishedConfigValue("engineeringClubs");
  return value && typeof value === "object"
    ? (value as GroupsPageValue)
    : EMPTY;
}

export async function generateStaticParams() {
  // A DB outage must not abort the build — the slugs then render on demand.
  const data = await getData();
  return listGroupSlugs(data.groups).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData();
  const found = findGroupBySlug(data.groups, slug);
  return seoMetadata({
    scope: "engineering",
    path: `/institutions/engineering/clubs-and-cells/${slug}`,
    fallbackTitle: found
      ? `${found.group.name} | JCT College of Engineering & Technology`
      : "Clubs & Cells | JCT College of Engineering & Technology",
    fallbackDescription:
      found?.group.description ||
      "Student club at JCT College of Engineering & Technology, Coimbatore.",
  });
}

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getData();
  const found = findGroupBySlug(data.groups, slug);
  if (!found || found.group.name.trim() === "") return notFound();
  return <GroupDetailLayout group={found.group} variant="clubs" />;
}
