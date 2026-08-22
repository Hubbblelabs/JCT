import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { CoePageLayout } from "@/components/layout/CoePageLayout";
import type { CoePageValue } from "@/lib/validation";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering/coe",
    fallbackTitle:
      "Controller of Examination | JCT College of Engineering & Technology",
    fallbackDescription:
      "Industry-partnered Centres of Excellence at JCT College of Engineering & Technology, Coimbatore — advanced labs, certifications, and applied research.",
  });
}

export default async function COEPage() {
  // Published-only read that degrades to 404 (instead of aborting the build)
  // when the DB is unreachable; ISR retries on the next revalidation.
  const value = await getPublishedConfigValue("engineeringCoe");

  if (!value || typeof value !== "object") return notFound();

  return <CoePageLayout data={value as CoePageValue} />;
}
