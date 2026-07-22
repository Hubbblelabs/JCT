import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { CampusLifePageLayout } from "@/components/layout/CampusLifePageLayout";
import type { CampusLifePageValue } from "@/lib/validation";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "main",
    path: "/campus-life",
    fallbackTitle: "Campus Life | JCT Institutions, Coimbatore",
    fallbackDescription:
      "Clubs, sports, hostels, events, and everyday student life across the JCT Institutions campus in Coimbatore.",
  });
}

export default async function CampusLifePage() {
  // Published-only read that degrades to 404 (instead of aborting the build)
  // when the DB is unreachable; ISR retries on the next revalidation.
  const value = await getPublishedConfigValue("campusLifePage");

  if (!value || typeof value !== "object") return notFound();

  return <CampusLifePageLayout data={value as CampusLifePageValue} />;
}
