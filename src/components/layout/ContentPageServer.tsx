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
 *
 * The published SiteConfig value is the only source of copy. The footer pages
 * (`/disclaimer`, `/privacy`, `/terms`, `/faq`) used to fall back to a module
 * of hard-coded text whenever their key looked unsaved, which meant the live
 * page was rendered from the deployed bundle rather than the database, and an
 * editor's first save silently changed where the text came from. Their copy is
 * now bootstrapped into SiteConfig by `POST /api/admin/site-config/seed` (see
 * `content-page-seeds.ts`) and read from there like every other page.
 */

const EMPTY: ContentPageValue = ContentPageSchema.parse({});

export async function ContentPage({ slug }: { slug: string }) {
  const def = getContentPage(slug);
  if (!def) notFound();

  const value = await getPublishedConfigValue(def.configKey);
  // Validate rather than cast. `getPublishedConfigValue` hands back the raw
  // Mongo document, and an `as` on a partial or hand-edited value (or one that
  // arrived through site-config/restore, which stores entries verbatim) turns
  // a missing `blocks`/`breadcrumb` array into an uncaught TypeError and a 500
  // — instead of the empty page EMPTY exists to render.
  const parsed = ContentPageSchema.safeParse(value);
  if (!parsed.success && value && typeof value === "object") {
    console.error(
      `[ContentPage:${def.configKey}] stored value failed validation:`,
      parsed.error.issues.slice(0, 5),
    );
  }
  const data: ContentPageValue = parsed.success ? parsed.data : EMPTY;

  // The registry label is a heading of last resort, not content: a page whose
  // key has not been seeded yet still renders with a title rather than an
  // empty hero. Everything below the heading comes from the database.
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
