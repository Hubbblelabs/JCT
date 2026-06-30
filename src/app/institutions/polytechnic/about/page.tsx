import { getPublishedConfigValue } from "@/lib/site-config-server";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import { PolytechnicAboutSchema } from "@/lib/validation";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

const DEFAULT: AboutPageValue = PolytechnicAboutSchema.parse(
  {},
) as AboutPageValue;

export default async function PolytechnicAboutPage() {
  const value = await getPublishedConfigValue("polytechnicAbout");
  const data =
    value && typeof value === "object" ? (value as AboutPageValue) : DEFAULT;
  return <AboutPageLayout data={data} institution="polytechnic" />;
}
