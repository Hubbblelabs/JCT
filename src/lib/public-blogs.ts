import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models";
import { getImageUrl } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize-html";

type BlogLean = {
  _id: unknown;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  published_at?: Date | string;
  image?: string;
  institution?: string;
};

export type PublicBlogCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO
  image: string | null;
  institution: string;
};

export type PublicBlogDetail = PublicBlogCard & {
  // Sanitized HTML — safe to render with dangerouslySetInnerHTML.
  contentHtml: string;
};

function asCard(doc: BlogLean): PublicBlogCard {
  return {
    _id: String(doc._id),
    title: doc.title ?? "",
    slug: doc.slug ?? "",
    excerpt: doc.excerpt ?? "",
    category: doc.category ?? "",
    author: doc.author ?? "",
    date: doc.published_at ? new Date(doc.published_at).toISOString() : "",
    image: getImageUrl(doc.image),
    institution: doc.institution ?? "",
  };
}

const CARD_FIELDS =
  "title slug excerpt category author published_at image institution";

export async function listPublicBlogs({
  institution,
  limit,
}: {
  institution?: string | null;
  limit?: number;
} = {}): Promise<PublicBlogCard[]> {
  await connectDB();

  const query: Record<string, unknown> = { is_active: true };
  if (institution) query.institution = institution;

  let cursor = Blog.find(query)
    .select(CARD_FIELDS)
    .sort({ published_at: -1, sort_order: 1 });
  if (limit && limit > 0) cursor = cursor.limit(limit);

  const docs = await cursor.lean<BlogLean[]>();
  return docs.map(asCard);
}

export async function listPublicBlogSlugs(): Promise<{ slug: string }[]> {
  // Runs inside generateStaticParams at build time. If the DB is briefly
  // unreachable during `next build`, degrade to zero prerendered slugs — blog
  // pages still render on demand via ISR.
  try {
    await connectDB();
    const docs = await Blog.find({ is_active: true })
      .select("slug")
      .lean<{ slug?: string }[]>();
    return docs
      .map((doc) => doc.slug)
      .filter((slug): slug is string => typeof slug === "string" && !!slug)
      .map((slug) => ({ slug }));
  } catch (err) {
    console.warn(
      "[public-blogs] listPublicBlogSlugs failed; " +
        "falling back to on-demand rendering:",
      err,
    );
    return [];
  }
}

export async function getPublicBlogBySlug(
  slug: string,
): Promise<PublicBlogDetail | null> {
  await connectDB();

  const doc = await Blog.findOne({ slug, is_active: true })
    .select(`${CARD_FIELDS} content`)
    .lean<BlogLean | null>();
  if (!doc) return null;

  return {
    ...asCard(doc),
    // Sanitized here rather than at render, so the HTML is already clean by the
    // time it reaches the layout — same contract as getPublicEventBySlug.
    contentHtml: sanitizeHtml(doc.content),
  };
}

/**
 * The other published posts, for the "Read next" strip on a detail page.
 * Same-college posts come first so a reader on the Engineering post is offered
 * Engineering reading before anything else.
 */
export async function listRelatedBlogs({
  slug,
  institution,
  limit = 3,
}: {
  slug: string;
  institution: string;
  limit?: number;
}): Promise<PublicBlogCard[]> {
  await connectDB();

  const sameCollege = await Blog.find({
    is_active: true,
    institution,
    slug: { $ne: slug },
  })
    .select(CARD_FIELDS)
    .sort({ published_at: -1, sort_order: 1 })
    .limit(limit)
    .lean<BlogLean[]>();

  const cards = sameCollege.map(asCard);
  const shortfall = limit - cards.length;
  if (shortfall <= 0) return cards;

  const rest = await Blog.find({
    is_active: true,
    institution: { $ne: institution },
    slug: { $ne: slug },
  })
    .select(CARD_FIELDS)
    .sort({ published_at: -1, sort_order: 1 })
    .limit(shortfall)
    .lean<BlogLean[]>();

  return [...cards, ...rest.map(asCard)];
}
