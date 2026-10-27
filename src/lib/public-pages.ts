import "server-only";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/lib/models";
import type { PageContent } from "@/lib/validation";

export type PublicPage = {
  _id: string;
  slug: string;
  institution: "main" | "engineering" | "arts-science" | "polytechnic";
  title: string;
  template: "standard" | "hero-content" | "sidebar" | "gallery" | "contact";
  content: PageContent;
  version: number;
  published_at?: string;
};

type PageLean = {
  _id: unknown;
  slug?: string;
  institution?: string;
  title?: string;
  template?: string;
  status?: string;
  version?: number;
  published_at?: Date | string;
  published_content?: unknown;
};

function asPublic(doc: PageLean): PublicPage | null {
  if (
    !doc.published_content ||
    typeof doc.published_content !== "object" ||
    Array.isArray(doc.published_content)
  ) {
    return null;
  }
  return {
    _id: String(doc._id),
    slug: doc.slug ?? "",
    institution: (doc.institution as PublicPage["institution"]) ?? "main",
    title: doc.title ?? "",
    template: (doc.template as PublicPage["template"]) ?? "standard",
    content: doc.published_content as PageContent,
    version: doc.version ?? 1,
    ...(doc.published_at
      ? { published_at: new Date(doc.published_at).toISOString() }
      : {}),
  };
}

export async function listPublishedPageSlugs(
  institution: PublicPage["institution"],
): Promise<{ slug: string }[]> {
  const entries = await listPublishedPageEntries(institution);
  return entries.map(({ slug }) => ({ slug }));
}

/**
 * Published slugs with their last write, for the sitemap. `updated_at`, not
 * `published_at`, because the title is read live off the document.
 */
export async function listPublishedPageEntries(
  institution: PublicPage["institution"],
): Promise<{ slug: string; lastModified?: Date }[]> {
  // Runs inside generateStaticParams at build time. If the DB is briefly
  // unreachable during `next build`, degrade to zero prerendered slugs
  // instead of aborting the entire build — pages still render on demand
  // via ISR (dynamicParams defaults to true).
  try {
    await connectDB();
    const docs = await Page.find({
      institution,
      status: "published",
      published_content: { $exists: true, $ne: null },
    })
      .select("slug updated_at")
      .lean<{ slug?: string; updated_at?: Date }[]>();
    return docs
      .filter((d) => typeof d.slug === "string" && d.slug.length > 0)
      .map((d) => ({ slug: d.slug as string, lastModified: d.updated_at }));
  } catch (err) {
    console.warn(
      `[public-pages] listPublishedPageSlugs(${institution}) failed; ` +
        "falling back to on-demand rendering:",
      err,
    );
    return [];
  }
}

export async function getPublishedPageBySlug({
  institution,
  slug,
}: {
  institution: PublicPage["institution"];
  slug: string;
}): Promise<PublicPage | null> {
  await connectDB();
  const doc = await Page.findOne({
    institution,
    slug,
    status: "published",
    published_content: { $exists: true, $ne: null },
  })
    .select(
      "slug institution title template status version published_at published_content",
    )
    .lean<PageLean | null>();
  if (!doc) return null;
  return asPublic(doc);
}
