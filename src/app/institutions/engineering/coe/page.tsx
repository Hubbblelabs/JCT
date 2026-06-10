import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { CoePageLayout } from "@/components/layout/CoePageLayout";
import type { CoePageValue } from "@/lib/validation";

export const revalidate = 86400;

export default async function COEPage() {
  // Published-only read that degrades to 404 (instead of aborting the build)
  // when the DB is unreachable; ISR retries on the next revalidation.
  const value = await getPublishedConfigValue("engineeringCoe");

  if (!value || typeof value !== "object") return notFound();

  return <CoePageLayout data={value as CoePageValue} />;
}
