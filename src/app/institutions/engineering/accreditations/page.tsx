import { getPublishedConfig } from "@/lib/site-config-server";
import { AccreditationsPageLayout } from "@/components/layout/AccreditationsPageLayout";
import { AccreditationsPageSchema } from "@/lib/validation";
import type { AccreditationsPageValue } from "@/lib/validation";

export const revalidate = 86400;

const DEFAULT: AccreditationsPageValue = AccreditationsPageSchema.parse({});

export default async function EngineeringAccreditationsPage() {
  const data = await getPublishedConfig(
    "engineeringAccreditations",
    AccreditationsPageSchema,
    DEFAULT,
  );
  return <AccreditationsPageLayout data={data} institution="engineering" />;
}
