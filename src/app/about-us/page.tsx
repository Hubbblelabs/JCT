import { notFound } from "next/navigation";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

export const metadata = {
  title: "About Us | JCT Institutions",
  description:
    "Learn about JCT Institutions — our vision, mission, and leadership.",
};

export default async function MainAboutPage() {
  const value = await getPublishedConfigValue("mainAbout");

  if (!value || typeof value !== "object") return notFound();

  return (
    <AboutPageLayout data={value as AboutPageValue} institution="main" />
  );
}
