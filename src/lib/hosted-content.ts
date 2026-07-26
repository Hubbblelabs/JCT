import "server-only";
import { getPublishedConfigs } from "@/lib/site-config-server";
import { hostedContentPages, type ContentPageDef } from "@/lib/content-pages";
import { ContentPageSchema } from "@/lib/validation";
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
    // Stored values were written through this schema, so `safeParse` normally
    // succeeds; fall back to the raw object rather than dropping a page
    // outright if an older document predates a schema field.
    const parsed = ContentPageSchema.safeParse(raw);
    const data = (parsed.success ? parsed.data : raw) as ContentPageValue;

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
