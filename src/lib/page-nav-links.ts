import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";

/**
 * Orphan detection for CMS pages.
 *
 * A published page that no navbar links to is reachable only by typing its
 * URL: invisible to visitors, still indexed by search engines, and the editor
 * who published it gets no signal. For a site whose whole purpose is
 * discoverability that is worth flagging, and the check is cheap — the navbars
 * are four SiteConfig documents.
 */

const NAVBAR_KEYS = [
  "mainNavbar",
  "engineeringNavbar",
  "artsScienceNavbar",
  "polytechnicNavbar",
] as const;

/** Trailing slash, query and hash are noise when comparing to a page URL. */
function normalizeHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const trimmed = href.trim();
  if (!trimmed) return null;
  const withoutFragment = trimmed.split(/[?#]/)[0]!;
  const withoutSlash = withoutFragment.replace(/\/+$/, "");
  return withoutSlash.toLowerCase() || "/";
}

/** The public URL a page is served at. */
export function pageHref(institution: string, slug: string): string {
  return institution === "main"
    ? `/p/${slug}`
    : `/institutions/${institution}/p/${slug}`;
}

type NavItem = { href?: unknown; children?: unknown };

function collectFrom(value: unknown, into: Set<string>): void {
  if (!value || typeof value !== "object") return;
  const items = (value as { items?: unknown }).items;
  if (!Array.isArray(items)) return;
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as NavItem;
    const href = normalizeHref(item.href);
    if (href) into.add(href);
    if (Array.isArray(item.children)) {
      for (const child of item.children) {
        if (!child || typeof child !== "object") continue;
        const childHref = normalizeHref((child as NavItem).href);
        if (childHref) into.add(childHref);
      }
    }
  }
}

/**
 * Every href reachable from the four navbars. Draft *and* published values are
 * included: a link sitting in an unpublished navbar draft still means the
 * editor intends the page to be reachable, and flagging it as orphaned then
 * would be a false alarm.
 */
export async function collectNavHrefs(): Promise<Set<string>> {
  const hrefs = new Set<string>();
  try {
    await connectDB();
    const docs = await SiteConfig.find({
      config_key: { $in: NAVBAR_KEYS },
    })
      .select("value published_value")
      .lean<{ value?: unknown; published_value?: unknown }[]>();

    for (const doc of docs) {
      collectFrom(doc.value, hrefs);
      collectFrom(doc.published_value, hrefs);
    }
  } catch (err) {
    // Non-fatal: the pages list is still useful without the badge. Returning
    // an empty set would mark every page orphaned, so signal failure instead.
    console.error("[page-nav-links] failed to read navbars:", err);
    throw err;
  }
  return hrefs;
}

/** True when some navbar links to this page. */
export function isPageLinked(
  navHrefs: Set<string>,
  institution: string,
  slug: string,
): boolean {
  const href = normalizeHref(pageHref(institution, slug));
  return href !== null && navHrefs.has(href);
}
