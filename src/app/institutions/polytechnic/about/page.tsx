import { getPublishedConfig } from "@/lib/site-config-server";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import { PolytechnicAboutSchema } from "@/lib/validation";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

const DEFAULT: AboutPageValue = PolytechnicAboutSchema.parse(
  {},
) as AboutPageValue;

export default async function PolytechnicAboutPage() {
  const data = await getPublishedConfig(
    "polytechnicAbout",
    PolytechnicAboutSchema,
    DEFAULT,
  );
  return <AboutPageLayout data={data} institution="polytechnic" />;
}
