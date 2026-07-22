import { getPublishedConfigValue } from "@/lib/site-config-server";
import { GroupsPageLayout } from "@/components/layout/GroupsPageLayout";
import { GroupsPageSchema } from "@/lib/validation";
import type { GroupsPageValue } from "@/lib/validation";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

const DEFAULT: GroupsPageValue = GroupsPageSchema.parse({});

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering/committees",
    fallbackTitle: "Committees | JCT College of Engineering & Technology",
    fallbackDescription:
      "Statutory and institutional committees at JCT College of Engineering & Technology, Coimbatore.",
  });
}

export default async function EngineeringCommitteesPage() {
  const value = await getPublishedConfigValue("engineeringCommittees");
  const data =
    value && typeof value === "object" ? (value as GroupsPageValue) : DEFAULT;
  return <GroupsPageLayout data={data} variant="committees" />;
}
