import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { CampusLifePageLayout } from "@/components/layout/CampusLifePageLayout";
import { CampusLifePageSchema } from "@/lib/validation";
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

  // Validate rather than cast: the layout dereferences nested arrays, so a
  // partial or hand-edited document would 500 the page instead of 404ing.
  const parsed = CampusLifePageSchema.safeParse(value);
  if (!parsed.success) {
    console.error(
      "[campus-life] stored value failed validation:",
      parsed.error.issues.slice(0, 5),
    );
    return notFound();
  }

  return <CampusLifePageLayout data={parsed.data} />;
}
