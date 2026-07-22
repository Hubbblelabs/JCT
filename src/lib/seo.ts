import "server-only";
import type { Metadata } from "next";
import type { ProgramData } from "@/types/program";
import { getPublishedConfigValue } from "./site-config-server";

export type SeoScope = "main" | "engineering" | "arts-science" | "polytechnic";

/** Site-config key holding the per-page meta tags for each scope. */
export const SEO_CONFIG_KEY: Record<SeoScope, string> = {
  main: "mainSeo",
  engineering: "engineeringSeo",
  "arts-science": "artsScienceSeo",
  polytechnic: "polytechnicSeo",
};

export type PageSeo = { title: string; description: string };

/** "/institutions/engineering/" and "/Institutions/Engineering" both match
 * the stored "/institutions/engineering" entry. */
function normalizePath(path: string): string {
  const trimmed = path.trim().toLowerCase();
  if (!trimmed) return "/";
  const withoutTrailing = trimmed.replace(/\/+$/, "");
  return withoutTrailing || "/";
}

/**
 * Look up the admin-managed meta tags for one public page. Returns null when
 * the scope has no config, the path has no entry, or both fields are blank —
 * callers then keep whatever metadata their route file declares.
 */
export async function getPageSeo(
  scope: SeoScope,
  path: string,
): Promise<PageSeo | null> {
  const value = await getPublishedConfigValue(SEO_CONFIG_KEY[scope]);
  if (!value || typeof value !== "object") return null;
  const pages = (value as { pages?: unknown }).pages;
  if (!Array.isArray(pages)) return null;

  const wanted = normalizePath(path);
  for (const raw of pages) {
    if (!raw || typeof raw !== "object") continue;
    const entry = raw as Record<string, unknown>;
    if (typeof entry.path !== "string") continue;
    if (normalizePath(entry.path) !== wanted) continue;
    const title = typeof entry.title === "string" ? entry.title.trim() : "";
    const description =
      typeof entry.description === "string" ? entry.description.trim() : "";
    if (!title && !description) return null;
    return { title, description };
  }
  return null;
}

/**
 * Build a page's `Metadata` from the CMS, falling back to the values passed
 * in. `canonical` is left relative — the root layout sets `metadataBase`, so
 * Next resolves it against the deployed origin.
 */
export async function seoMetadata({
  scope,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackOgTitle,
  fallbackOgDescription,
}: {
  scope: SeoScope;
  path: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackOgTitle?: string;
  fallbackOgDescription?: string;
}): Promise<Metadata> {
  const seo = await getPageSeo(scope, path);

  const title = seo?.title || fallbackTitle;
  const description = seo?.description || fallbackDescription;
  // A CMS-set title/description also becomes the social preview, so admins
  // don't have to maintain two copies of the same sentence.
  const ogTitle = seo?.title || fallbackOgTitle || fallbackTitle;
  const ogDescription =
    seo?.description || fallbackOgDescription || fallbackDescription;

  const metadata: Metadata = {
    alternates: { canonical: path },
  };
  if (title) metadata.title = title;
  if (description) metadata.description = description;
  if (ogTitle || ogDescription) {
    metadata.openGraph = {
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      url: path,
      type: "website",
    };
  }
  return metadata;
}

/**
 * Metadata for a program detail page. Prefers the program's own CMS meta
 * tags (`content.seo`, edited in the program builder) and falls back to the
 * program name plus its first "about" paragraph.
 */
export function programMetadata({
  program,
  path,
  titleSuffix,
}: {
  program: ProgramData;
  path: string;
  titleSuffix: string;
}): Metadata {
  const title = program.seo?.title || `${program.name} | ${titleSuffix}`;
  const description =
    program.seo?.description || (program.about.paragraphs[0] ?? "");

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
  };
}
