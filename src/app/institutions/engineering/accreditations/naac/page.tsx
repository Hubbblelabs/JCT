import { getPublishedConfigValue } from "@/lib/site-config-server";
import { NaacPageLayout } from "@/components/layout/NaacPageLayout";
import { NaacPageSchema } from "@/lib/validation";
import type { NaacPageValue } from "@/lib/validation";

export const revalidate = 3600;

const DEFAULT: NaacPageValue = NaacPageSchema.parse({});

export default async function EngineeringNaacPage() {
  const value = await getPublishedConfigValue("engineeringNaac");
  const data =
    value && typeof value === "object" ? (value as NaacPageValue) : DEFAULT;
  return <NaacPageLayout data={data} />;
}
