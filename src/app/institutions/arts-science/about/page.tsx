import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import type { AboutPageValue } from "@/lib/validation";

export const revalidate = 86400;

type ConfigLean = {
  status: "draft" | "published";
  value?: unknown;
  published_value?: unknown;
};

export default async function ArtsScienceAboutPage() {
  await connectDB();
  const doc = await SiteConfig.findOne({
    config_key: "artsScienceAbout",
  }).lean<ConfigLean>();

  if (!doc) return notFound();

  const value =
    doc.status === "published" && doc.published_value
      ? doc.published_value
      : doc.value;

  if (!value || typeof value !== "object") return notFound();

  return (
    <AboutPageLayout
      data={value as AboutPageValue}
      institution="arts-science"
    />
  );
}
