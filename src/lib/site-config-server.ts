import "server-only";
import { connectDB } from "./mongodb";
import { SiteConfig } from "./models";

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

function resolveProspectusUrl(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const v = value as Record<string, unknown>;
  if (typeof v.url === "string") {
    const url = v.url.trim();
    if (
      url &&
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("/")
    ) {
      if (R2_PUBLIC_URL) return { ...v, url: `${R2_PUBLIC_URL}/${url}` };
    }
  }
  return v;
}

export async function getPublishedConfigs(
  keys: string[],
): Promise<Record<string, unknown>> {
  await connectDB();
  const docs = await SiteConfig.find({ config_key: { $in: keys } }).lean();
  const result: Record<string, unknown> = {};
  for (const doc of docs as Array<{
    config_key: string;
    status: string;
    published_value?: unknown;
    value: unknown;
  }>) {
    let value =
      doc.status === "published" && doc.published_value
        ? doc.published_value
        : doc.value;
    if (doc.config_key === "homeProspectus")
      value = resolveProspectusUrl(value);
    result[doc.config_key] = value;
  }
  return result;
}

export const HOME_CONFIG_KEYS = [
  "home",
  "homeProspectus",
  "homeStatistics",
  "whyChooseJct",
  "homeStats",
  "recruitersSection",
  "lifeAtJct",
  "homeAdmissions",
  "homePamphlet",
  "header",
  "mainHeader",
  "mainNavbar",
  "footer",
  "floatingElements",
  "accreditations",
] as const;

export const ENGINEERING_CONFIG_KEYS = [
  "engineeringHero",
  "engineeringMetrics",
  "engineeringAdmissions",
  "recruitersSection",
  "lifeAtJct",
  "header",
  "engineeringHeader",
  "engineeringNavbar",
  "footer",
  "floatingElements",
  "accreditations",
] as const;

export const ARTS_SCIENCE_CONFIG_KEYS = [
  "artsScienceHero",
  "artsScienceAdmissions",
  "recruitersSection",
  "lifeAtJct",
  "header",
  "artsScienceHeader",
  "artsScienceNavbar",
  "footer",
  "floatingElements",
  "accreditations",
] as const;

export const POLYTECHNIC_CONFIG_KEYS = [
  "polytechnicHero",
  "polytechnicAdmissions",
  "recruitersSection",
  "lifeAtJct",
  "header",
  "polytechnicHeader",
  "polytechnicNavbar",
  "footer",
  "floatingElements",
  "accreditations",
] as const;
