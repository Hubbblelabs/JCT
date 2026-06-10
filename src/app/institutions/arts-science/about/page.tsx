import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

export default async function ArtsScienceAboutPage() {
  // Published-only read that degrades to 404 (instead of aborting the build)
  // when the DB is unreachable; ISR retries on the next revalidation.
  const value = await getPublishedConfigValue("artsScienceAbout");

  if (!value || typeof value !== "object") return notFound();

  return (
    <AboutPageLayout
      data={value as AboutPageValue}
      institution="arts-science"
    />
  );
}
