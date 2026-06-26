import { getPublishedConfigValue } from "@/lib/site-config-server";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import { EngineeringAboutSchema } from "@/lib/validation";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

const DEFAULT: AboutPageValue = EngineeringAboutSchema.parse({}) as AboutPageValue;

export default async function EngineeringAboutPage() {
  const value = await getPublishedConfigValue("engineeringAbout");
  const data =
    value && typeof value === "object" ? (value as AboutPageValue) : DEFAULT;
  return <AboutPageLayout data={data} institution="engineering" />;
}
