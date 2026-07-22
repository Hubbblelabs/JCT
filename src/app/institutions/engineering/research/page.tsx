import { getPublishedConfigValue } from "@/lib/site-config-server";
import { ResearchPageLayout } from "@/components/layout/ResearchPageLayout";
import { ResearchPageSchema } from "@/lib/validation";
import type { ResearchPageValue } from "@/lib/validation";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

const DEFAULT: ResearchPageValue = ResearchPageSchema.parse({});

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering/research",
    fallbackTitle:
      "Research & Innovation | JCT College of Engineering & Technology",
    fallbackDescription:
      "Research centres, focus areas, and publications at JCT College of Engineering & Technology, Coimbatore.",
  });
}

export default async function EngineeringResearchPage() {
  const value = await getPublishedConfigValue("engineeringResearch");
  const data =
    value && typeof value === "object" ? (value as ResearchPageValue) : DEFAULT;
  return <ResearchPageLayout data={data} />;
}
