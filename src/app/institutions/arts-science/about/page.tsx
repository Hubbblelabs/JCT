import { getPublishedConfig } from "@/lib/site-config-server";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import { ArtsScienceAboutSchema } from "@/lib/validation";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

const DEFAULT: AboutPageValue = ArtsScienceAboutSchema.parse(
  {},
) as AboutPageValue;

export default async function ArtsScienceAboutPage() {
  const data = await getPublishedConfig(
    "artsScienceAbout",
    ArtsScienceAboutSchema,
    DEFAULT,
  );
  return <AboutPageLayout data={data} institution="arts-science" />;
}
