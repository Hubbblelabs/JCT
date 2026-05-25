import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { CampusLifePageLayout } from "@/components/layout/CampusLifePageLayout";
import type { CampusLifePageValue } from "@/lib/validation";

export const revalidate = 86400;

type ConfigLean = {
  status: "draft" | "published";
  value?: unknown;
  published_value?: unknown;
};

export default async function CampusLifePage() {
  await connectDB();
  const doc = await SiteConfig.findOne({
    config_key: "campusLifePage",
  }).lean<ConfigLean>();

  if (!doc) return notFound();

  const value =
    doc.status === "published" && doc.published_value
      ? doc.published_value
      : doc.value;

  if (!value || typeof value !== "object") return notFound();

  return <CampusLifePageLayout data={value as CampusLifePageValue} />;
}
