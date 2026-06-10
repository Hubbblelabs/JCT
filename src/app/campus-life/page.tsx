import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { CampusLifePageLayout } from "@/components/layout/CampusLifePageLayout";
import type { CampusLifePageValue } from "@/lib/validation";

export const revalidate = 86400;

export default async function CampusLifePage() {
  // Published-only read that degrades to 404 (instead of aborting the build)
  // when the DB is unreachable; ISR retries on the next revalidation.
  const value = await getPublishedConfigValue("campusLifePage");

  if (!value || typeof value !== "object") return notFound();

  return <CampusLifePageLayout data={value as CampusLifePageValue} />;
}
