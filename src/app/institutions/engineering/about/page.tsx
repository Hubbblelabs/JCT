import { getPublishedConfig } from "@/lib/site-config-server";
import {
  AboutPageLayout,
  type AboutHostedItem,
} from "@/components/layout/AboutPageLayout";
import { loadHostedContentPages } from "@/lib/hosted-content";
import { EngineeringAboutSchema } from "@/lib/validation";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

const PUBLIC_PATH = "/institutions/engineering/about";

const DEFAULT: AboutPageValue = EngineeringAboutSchema.parse(
  {},
) as AboutPageValue;

export default async function EngineeringAboutPage() {
  // Timeline used to be a route of its own; it is now a panel of this page's
  // sidebar (see the `host` entry in content-pages.ts).
  const [data, hostedPages] = await Promise.all([
    getPublishedConfig("engineeringAbout", EngineeringAboutSchema, DEFAULT),
    loadHostedContentPages(PUBLIC_PATH),
  ]);
  const hosted: AboutHostedItem[] = hostedPages.map(({ def, data: page }) => {
    const Icon = def.icon;
    return {
      anchor: def.host!.anchor,
      navLabel: def.host!.navLabel,
      icon: <Icon />,
      data: page,
    };
  });
  return (
    <AboutPageLayout data={data} institution="engineering" hosted={hosted} />
  );
}
