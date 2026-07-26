import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { seoMetadata } from "@/lib/seo";
import { getContentPage } from "@/lib/content-pages";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { ContentPageSchema } from "@/lib/validation";
import type { ContentPageValue } from "@/lib/validation";

/**
 * Server half of a block-based content page. Every public route in the
 * registry is a three-line `page.tsx` that renders `<ContentPage slug="…" />`
 * and re-exports `contentPageMetadata` — the shape of the page itself lives
 * entirely in the CMS.
 */

const EMPTY: ContentPageValue = ContentPageSchema.parse({});

export async function ContentPage({ slug }: { slug: string }) {
  const def = getContentPage(slug);
  if (!def) notFound();

  const value = await getPublishedConfigValue(def.configKey);
  const data =
    value && typeof value === "object" ? (value as ContentPageValue) : EMPTY;

  // Nothing seeded yet: fall back to the registry label so the page still has
  // a heading instead of rendering a blank hero.
  const withFallbackHero: ContentPageValue = data.hero?.title?.trim()
    ? data
    : { ...data, hero: { ...data.hero, title: def.label } };

  return <ContentPageLayout data={withFallbackHero} />;
}

/** Admin-managed meta tags win; the registry fallback stands otherwise. */
export async function contentPageMetadata(slug: string): Promise<Metadata> {
  const def = getContentPage(slug);
  if (!def) return {};
  return seoMetadata({
    scope: def.institution,
    path: def.path,
    fallbackTitle: def.seoTitle,
    fallbackDescription: def.seoDescription,
  });
}
