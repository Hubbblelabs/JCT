import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import {
  mainNavigation,
  engineeringNavigation,
  artsNavigation,
  polytechnicNavigation,
  type NavItem as StaticNavItem,
} from "@/data/all-navigations";

/**
 * Orphan detection for CMS pages.
 *
 * A published page that no navbar links to is reachable only by typing its
 * URL: invisible to visitors, still indexed by search engines, and the editor
 * who published it gets no signal. For a site whose whole purpose is
 * discoverability that is worth flagging, and the check is cheap — the navbars
 * are four SiteConfig documents.
 *
 * This must mirror what `Navbar.applyNavbarConfig` actually renders. Every
 * divergence between the two produces a wrong badge:
 *  - counting a link the navbar drops  -> false negative (real orphan, no badge)
 *  - missing a link the navbar renders -> false positive (linked page badged,
 *    pushing the editor to add a duplicate nav entry)
 * The second is the worse failure, so the collector errs toward counting.
 */

const NAVBAR_KEYS = [
  "mainNavbar",
  "engineeringNavbar",
  "artsScienceNavbar",
  "polytechnicNavbar",
] as const;

/**
 * `Navbar.applyNavbarConfig` falls back to these hard-coded menus when a
 * navbar config has no items, so for an unconfigured institution the rendered
 * links live here and in no SiteConfig document.
 */
const STATIC_NAV_BY_KEY: Record<string, StaticNavItem[]> = {
  mainNavbar: mainNavigation,
  engineeringNavbar: engineeringNavigation,
  artsScienceNavbar: artsNavigation,
  polytechnicNavbar: polytechnicNavigation,
};

/**
 * Hosts that mean "this site". An editor pasting a full URL out of the address
 * bar (the pages list's own "View public page" button opens one, and the nav
 * URL field's placeholder is literally `/path or https://...`) stores an
 * absolute link that renders fine but would never match a relative page path.
 *
 * Only same-origin absolute URLs are reduced to a path. Stripping the origin
 * unconditionally would be the mirror bug: `https://elsewhere.example/p/foo`
 * would start matching a local `/p/foo` and silently mark an unlinked page as
 * linked. In dev NEXTAUTH_URL is localhost, so a link typed against the
 * production domain still won't match — that direction only over-reports, and
 * is preferable to under-reporting.
 */
function siteHosts(): Set<string> {
  const hosts = new Set<string>();
  for (const raw of [process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_SITE_URL]) {
    if (!raw) continue;
    try {
      hosts.add(new URL(raw).host.toLowerCase());
    } catch {
      // Malformed env value — ignore rather than break orphan detection.
    }
  }
  return hosts;
}

/** Trailing slash, query and hash are noise when comparing to a page URL. */
function normalizeHref(href: unknown, hosts: Set<string>): string | null {
  if (typeof href !== "string") return null;
  const trimmed = href.trim();
  if (!trimmed) return null;

  let path = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      return null; // not a usable link; certainly not a match
    }
    // An off-site link never points at one of our pages.
    if (!hosts.has(parsed.host.toLowerCase())) return null;
    path = parsed.pathname;
  }

  const withoutFragment = path.split(/[?#]/)[0]!;
  const withoutSlash = withoutFragment.replace(/\/+$/, "");
  return withoutSlash.toLowerCase() || "/";
}

/** The public URL a page is served at. */
export function pageHref(institution: string, slug: string): string {
  return institution === "main"
    ? `/p/${slug}`
    : `/institutions/${institution}/p/${slug}`;
}

type NavEntry = { href?: unknown; children?: unknown; visible?: unknown };

/**
 * Collect hrefs from one navbar's `items[]`, applying the same visibility rule
 * the public Navbar does: a hidden item is dropped along with its entire
 * children array, and hidden children are dropped individually. `visible` is
 * optional, so only an explicit `false` hides (undefined means visible).
 */
function collectItems(items: unknown, into: Set<string>, hosts: Set<string>): number {
  if (!Array.isArray(items)) return 0;
  let seen = 0;
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as NavEntry;
    seen++;
    if (item.visible === false) continue; // takes its children with it
    const href = normalizeHref(item.href, hosts);
    if (href) into.add(href);
    if (Array.isArray(item.children)) {
      for (const child of item.children) {
        if (!child || typeof child !== "object") continue;
        const c = child as NavEntry;
        if (c.visible === false) continue;
        const childHref = normalizeHref(c.href, hosts);
        if (childHref) into.add(childHref);
      }
    }
  }
  return seen;
}

/** Static fallback menus have no `visible` flag — every entry renders. */
function collectStatic(
  items: StaticNavItem[],
  into: Set<string>,
  hosts: Set<string>,
): void {
  for (const item of items) {
    const href = normalizeHref(item.href, hosts);
    if (href) into.add(href);
    for (const child of item.children ?? []) {
      const childHref = normalizeHref(child.href, hosts);
      if (childHref) into.add(childHref);
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
  const hosts = siteHosts();
  const hrefs = new Set<string>();
  try {
    await connectDB();
    const docs = await SiteConfig.find({
      config_key: { $in: NAVBAR_KEYS },
    })
      .select("config_key value published_value")
      .lean<
        { config_key?: string; value?: unknown; published_value?: unknown }[]
      >();

    const configured = new Set<string>();
    for (const doc of docs) {
      const key = String(doc.config_key ?? "");
      const fromDraft = collectItems(
        (doc.value as { items?: unknown } | undefined)?.items,
        hrefs,
        hosts,
      );
      const fromPublished = collectItems(
        (doc.published_value as { items?: unknown } | undefined)?.items,
        hrefs,
        hosts,
      );
      if (fromDraft > 0 || fromPublished > 0) configured.add(key);
    }

    // Any navbar with no items renders the hard-coded menu instead.
    for (const key of NAVBAR_KEYS) {
      if (configured.has(key)) continue;
      collectStatic(STATIC_NAV_BY_KEY[key] ?? [], hrefs, hosts);
    }
  } catch (err) {
    // Non-fatal: the pages list is still useful without the badge. Returning
    // an empty set would mark every page orphaned, so signal failure instead.
    console.error("[page-nav-links] failed to read navbars:", err);
    throw err;
  }
  return hrefs;
}

/** No host allowlist needed: `pageHref()` is always a relative path. */
const NO_HOSTS: Set<string> = new Set();

/** True when some navbar links to this page. */
export function isPageLinked(
  navHrefs: Set<string>,
  institution: string,
  slug: string,
): boolean {
  const href = normalizeHref(pageHref(institution, slug), NO_HOSTS);
  return href !== null && navHrefs.has(href);
}
