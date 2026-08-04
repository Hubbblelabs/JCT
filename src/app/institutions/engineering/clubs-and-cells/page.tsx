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
    scope: "engineering",
    path: "/institutions/engineering/clubs-and-cells",
    fallbackTitle: "Clubs & Cells | JCT College of Engineering & Technology",
    fallbackDescription:
      "Student clubs and cells at JCT College of Engineering & Technology, Coimbatore — technical, cultural, and social initiatives.",
  });
}

export default async function EngineeringClubsPage() {
  const data = await getPublishedConfig(
    "engineeringClubs",
    GroupsPageSchema,
    DEFAULT,
  );
  return <GroupsPageLayout data={data} variant="clubs" />;
}
