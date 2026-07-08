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

/**
 * Fetch one config's published value for a public page. Returns null when
 * the key is missing, unpublished, or the DB is unreachable — so a build
 * with a briefly unavailable DB degrades to a 404'd ISR page that retries
 * on the next revalidation instead of aborting the whole `next build`.
 * Drafts are never returned: public pages render published content only.
 */
export async function getPublishedConfigValue(
  key: string,
): Promise<unknown | null> {
  try {
    await connectDB();
    const doc = await SiteConfig.findOne({ config_key: key }).lean<{
      status?: string;
      published_value?: unknown;
    }>();
    if (!doc || doc.status !== "published" || !doc.published_value) {
      return null;
    }
    if (key === "homeProspectus") {
      return resolveProspectusUrl(doc.published_value);
    }
    return doc.published_value;
  } catch (err) {
    console.warn(
      `[site-config-server] getPublishedConfigValue(${key}) failed:`,
      err,
    );
    return null;
  }
}

export async function getPublishedConfigs(
  keys: string[],
): Promise<Record<string, unknown>> {
  // Degrade to an empty config map when the DB is unreachable (e.g. during
  // `next build` without a DB) — pages render their static fallbacks and
  // ISR retries later, instead of the whole build aborting.
  let docs: unknown[];
  try {
    await connectDB();
    docs = await SiteConfig.find({ config_key: { $in: keys } }).lean();
  } catch (err) {
    console.warn("[site-config-server] getPublishedConfigs failed:", err);
    return {};
  }
  const result: Record<string, unknown> = {};
  for (const doc of docs as Array<{
    config_key: string;
    status: string;
    published_value?: unknown;
    value: unknown;
  }>) {
    // Public pages must only ever render published values. Falling back to
    // the draft `value` would leak unpublished edits to anonymous visitors
    // (the public API route enforces the same rule).
    if (doc.status !== "published" || !doc.published_value) continue;
    let value: unknown = doc.published_value;
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
  "mainPlacementHighlights",
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
  "engineeringPlacementHighlights",
  "engineeringLifeAtJct",
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
  "artsSciencePlacementHighlights",
  "artsScienceLifeAtJct",
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
  "polytechnicPlacementHighlights",
  "polytechnicLifeAtJct",
  "header",
  "polytechnicHeader",
  "polytechnicNavbar",
  "footer",
  "floatingElements",
  "accreditations",
] as const;
