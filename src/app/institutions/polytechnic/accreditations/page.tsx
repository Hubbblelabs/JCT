import { getPublishedConfigValue } from "@/lib/site-config-server";
import { AccreditationsPageLayout } from "@/components/layout/AccreditationsPageLayout";
import { AccreditationsPageSchema } from "@/lib/validation";
import type { AccreditationsPageValue } from "@/lib/validation";

export const revalidate = 86400;

const DEFAULT: AccreditationsPageValue = AccreditationsPageSchema.parse({});

export default async function PolytechnicAccreditationsPage() {
  const value = await getPublishedConfigValue("polytechnicAccreditations");
  const data =
    value && typeof value === "object"
      ? (value as AccreditationsPageValue)
      : DEFAULT;
  return <AccreditationsPageLayout data={data} institution="polytechnic" />;
}
