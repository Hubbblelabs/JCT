import type { Metadata } from "next";
import { getPublishedConfig } from "@/lib/site-config-server";
import { seoMetadata } from "@/lib/seo";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import { MainAboutSchema } from "@/lib/validation";
import { DEFAULT_MAIN_ABOUT } from "@/lib/main-about-default";

export const revalidate = 86400;

const SEO_FALLBACK: Metadata = {
  title: "About Us | JCT Institutions",
  description:
    "Learn about JCT Institutions — our vision, mission, and leadership.",
};

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({ scope: "main", path: "/about-us" });
  return { ...SEO_FALLBACK, ...seo };
}

export default async function MainAboutPage() {
  const data = await getPublishedConfig(
    "mainAbout",
    MainAboutSchema,
    DEFAULT_MAIN_ABOUT,
  );

  return <AboutPageLayout data={data} institution="main" />;
}
