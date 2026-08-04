import { getPublishedConfig } from "@/lib/site-config-server";
import { GroupsPageLayout } from "@/components/layout/GroupsPageLayout";
import { GroupsPageSchema } from "@/lib/validation";
import type { GroupsPageValue } from "@/lib/validation";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

const DEFAULT: GroupsPageValue = GroupsPageSchema.parse({});

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "polytechnic",
    path: "/institutions/polytechnic/committees",
    fallbackTitle: "Committees & Cells | JCT Polytechnic College",
    fallbackDescription:
      "Committees and cells at JCT Polytechnic College, Coimbatore — their objectives, activities and faculty in charge.",
  });
}

export default async function PolytechnicCommitteesPage() {
  const data = await getPublishedConfig(
    "polytechnicCommittees",
    GroupsPageSchema,
    DEFAULT,
  );
  return (
    <GroupsPageLayout
      data={data}
      variant="committees"
      institution="polytechnic"
    />
  );
}
