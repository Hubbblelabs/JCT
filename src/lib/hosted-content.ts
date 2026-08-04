import "server-only";
import { getPublishedConfigs } from "@/lib/site-config-server";
import { hostedContentPages, type ContentPageDef } from "@/lib/content-pages";
import { ContentPageSchema, ContentBlockSchema } from "@/lib/validation";
import type { ContentPageValue } from "@/lib/validation";

/**
 * Loads the published content pages that a host route absorbs — the `host`
 * entries in `src/lib/content-pages.ts`. A page whose config is missing,
 * unpublished or empty is dropped rather than surfaced as a blank tab: the
 * host's sidebar must never offer a dead entry.
 */
export type HostedContentPage = {
  def: ContentPageDef;
  data: ContentPageValue;
};

/**
 * Turn a stored value into a `ContentPageValue` that is actually one.
 *
 * Stored values are written through this schema, so `safeParse` normally
 * succeeds. When it doesn't — a document that predates a schema field, a block
 * whose `type` was retired, a paragraph over the length cap — the old code
 * handed back the raw object cast to `ContentPageValue`, a type promising
 * `blocks` and `intro` are always arrays. Consumers (ContentPageBody,
 * galleryForYear) dereference them unguarded, so one stale document 500'd the
 * entire hosting page rather than degrading one panel.
 *
 * Recovery is per field, and per block inside `blocks`, so a single bad entry
 * costs that entry and not the page.
 */
function coerceContentPage(raw: unknown, configKey: string): ContentPageValue {
  const parsed = ContentPageSchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  console.error(
    `[hosted-content:${configKey}] stored value failed validation:`,
    parsed.error.issues.slice(0, 5),
  );

  const base = ContentPageSchema.parse({});
  const r = (raw ?? {}) as Record<string, unknown>;
  const field = <K extends keyof ContentPageValue>(
    key: K,
  ): ContentPageValue[K] => {
    const res = ContentPageSchema.shape[key].safeParse(r[key]);
    return res.success ? (res.data as ContentPageValue[K]) : base[key];
  };

  return {
    hero: field("hero"),
    breadcrumb: field("breadcrumb"),
    intro: field("intro"),
    blocks: Array.isArray(r.blocks)
      ? r.blocks
          .map((b) => ContentBlockSchema.safeParse(b))
          .filter((res) => res.success)
          .map((res) => res.data)
      : base.blocks,
  };
}

export async function loadHostedContentPages(
  hostPath: string,
): Promise<HostedContentPage[]> {
  const defs = hostedContentPages(hostPath);
  if (defs.length === 0) return [];

  const configs = await getPublishedConfigs(defs.map((d) => d.configKey));
  const out: HostedContentPage[] = [];

  for (const def of defs) {
    const raw = configs[def.configKey];
    if (!raw || typeof raw !== "object") continue;
    const data = coerceContentPage(raw, def.configKey);

    const hasContent =
      (data.blocks?.length ?? 0) > 0 ||
      (data.intro ?? []).some((p) => p.trim() !== "");
    if (hasContent) out.push({ def, data });
  }

  return out;
}

/** One hosted page by its anchor, or null when it has nothing published. */
export async function loadHostedContentPage(
  hostPath: string,
  anchor: string,
): Promise<ContentPageValue | null> {
  const pages = await loadHostedContentPages(hostPath);
  return pages.find((p) => p.def.host?.anchor === anchor)?.data ?? null;
}
