import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { CoePageLayout } from "@/components/layout/CoePageLayout";
import { CoePageSchema, type CoePageValue } from "@/lib/validation";
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
      "Office of the Controller of Examinations at JCT College of Engineering & Technology, Coimbatore — examination schedules, results, circulars and academic regulations.",
  });
}

export default async function COEPage() {
  // Published-only read that degrades to 404 (instead of aborting the build)
  // when the DB is unreachable; ISR retries on the next revalidation.
  const value = await getPublishedConfigValue("engineeringCoe");

  if (!value || typeof value !== "object") return notFound();

  // Parsed, not cast: a stored value may predate a field (restore keeps the
  // archive's value verbatim), and the layout dereferences `data.sidebar`,
  // `data.overview` and friends without guards — a 500 for the whole page.
  // Parsing fills every missing part from the schema defaults.
  const parsed = CoePageSchema.safeParse(value);
  if (!parsed.success) {
    console.error(
      "[coe] published engineeringCoe failed validation:",
      parsed.error.issues.slice(0, 5),
    );
    return notFound();
  }
  return <CoePageLayout data={parsed.data as CoePageValue} />;
}
