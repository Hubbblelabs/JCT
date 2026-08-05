/**
 * The public routes whose meta tags are editable per scope, and the label the
 * admin sees for each. Used as the seed value for the `<scope>Seo` site-config
 * key, so a fresh install lists every page instead of an empty form.
 *
 * A path only has an effect if that route reads it — every entry below is
 * wired to a `generateMetadata` that calls `seoMetadata`/`getPageSeo`. Adding
 * a row here without wiring the route does nothing.
 */
import { CONTENT_PAGES } from "@/lib/content-pages";
import { LIMITS as SEO_LIMITS } from "@/lib/validation/seo";

export type SeoPageDefault = {
  path: string;
  label: string;
};

/**
 * SEO rows for the block-based content pages of one institution. Hosted pages
 * are skipped: they have no route of their own, so the host's row already owns
 * the meta tags for that URL.
 */
function contentPageSeoRows(institution: string): SeoPageDefault[] {
  return CONTENT_PAGES.filter(
    (p) => p.institution === institution && !p.host,
  ).map((p) => ({ path: p.path, label: p.seoLabel }));
}

export const MAIN_SEO_PAGES: SeoPageDefault[] = [
  { path: "/", label: "Home" },
  { path: "/about-us", label: "About Us" },
  { path: "/campus-life", label: "Campus Life" },
  { path: "/events", label: "News & Events" },
  { path: "/accreditations", label: "Accreditations" },
  ...contentPageSeoRows("main"),
];

export const ENGINEERING_SEO_PAGES: SeoPageDefault[] = [
  { path: "/institutions/engineering", label: "Landing page" },
  { path: "/institutions/engineering/courses", label: "Courses" },
  { path: "/institutions/engineering/about", label: "About" },
  { path: "/institutions/engineering/coe", label: "Centre of Excellence" },
  { path: "/institutions/engineering/placements", label: "Placements" },
  { path: "/institutions/engineering/events", label: "News & Events" },
  { path: "/institutions/engineering/accreditations", label: "Accreditations" },
  { path: "/institutions/engineering/naac", label: "NAAC" },
  { path: "/institutions/engineering/research", label: "Research" },
  {
    path: "/institutions/engineering/clubs-and-cells",
    label: "Clubs & Cells",
  },
  { path: "/institutions/engineering/committees", label: "Committees" },
  { path: "/institutions/engineering/documents", label: "Documents" },
  ...contentPageSeoRows("engineering"),
];

export const ARTS_SCIENCE_SEO_PAGES: SeoPageDefault[] = [
  { path: "/institutions/arts-science", label: "Landing page" },
  { path: "/institutions/arts-science/courses", label: "Courses" },
  { path: "/institutions/arts-science/about", label: "About" },
  { path: "/institutions/arts-science/placements", label: "Placements" },
  { path: "/institutions/arts-science/events", label: "News & Events" },
  {
    path: "/institutions/arts-science/accreditations",
    label: "Accreditations",
  },
];

export const POLYTECHNIC_SEO_PAGES: SeoPageDefault[] = [
  { path: "/institutions/polytechnic", label: "Landing page" },
  { path: "/institutions/polytechnic/courses", label: "Courses" },
  { path: "/institutions/polytechnic/about", label: "About" },
  { path: "/institutions/polytechnic/placements", label: "Placements" },
  { path: "/institutions/polytechnic/events", label: "News & Events" },
  { path: "/institutions/polytechnic/accreditations", label: "Accreditations" },
  {
    path: "/institutions/polytechnic/committees",
    label: "Committees & Cells",
  },
  ...contentPageSeoRows("polytechnic"),
];

export const SEO_PAGE_DEFAULTS: Record<string, SeoPageDefault[]> = {
  main: MAIN_SEO_PAGES,
  engineering: ENGINEERING_SEO_PAGES,
  "arts-science": ARTS_SCIENCE_SEO_PAGES,
  polytechnic: POLYTECHNIC_SEO_PAGES,
};

export type SeoPageRow = {
  path: string;
  label: string;
  title: string;
  description: string;
};

/**
 * "/institutions/engineering/" and "/Institutions/Engineering" both address the
 * stored "/institutions/engineering" row. Shared with `getPageSeo` so the
 * editor and the lookup agree on when two rows are the same page.
 */
export function normalizeSeoPath(path: string): string {
  const trimmed = path.trim().toLowerCase();
  if (!trimmed) return "/";
  return trimmed.replace(/\/+$/, "") || "/";
}

/** Blank rows for a scope, in the shape the `<scope>Seo` config stores. */
export function seoPagesDefaultValue(scope: string): { pages: SeoPageRow[] } {
  return reconcileSeoPages(scope, null);
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Bring a stored `<scope>Seo` value back in step with the page registry.
 *
 * `seoPagesDefaultValue` only ever seeded a key that had never been saved, so
 * a scope saved once was frozen: pages added to the registry afterwards never
 * got a row, and rows for deleted routes lingered forever (the CMS shipped
 * with a `/support` row long after that page was removed). The editors run
 * this on load instead, which self-heals every existing database.
 *
 * Admin-entered text is never discarded — a row for a path the registry does
 * not know about is kept as long as it carries a title or description, since
 * that is a page someone deliberately added by hand. Only blank unknown rows,
 * which are pure noise, are dropped.
 */
export function reconcileSeoPages(
  scope: string,
  stored: unknown,
): { pages: SeoPageRow[] } {
  const defaults = SEO_PAGE_DEFAULTS[scope] ?? [];

  const rawRows = (stored as { pages?: unknown } | null)?.pages;
  const rows: Record<string, unknown>[] = Array.isArray(rawRows)
    ? rawRows.filter(
        (r): r is Record<string, unknown> =>
          !!r && typeof r === "object" && typeof r.path === "string",
      )
    : [];

  const storedByPath = new Map<string, Record<string, unknown>>();
  for (const row of rows) {
    const key = normalizeSeoPath(row.path as string);
    // First row wins, so a duplicated path collapses to one entry.
    if (!storedByPath.has(key)) storedByPath.set(key, row);
  }

  // Registry order, registry path and registry label all win — a renamed page
  // shows its new name — while the admin's own title/description carry over.
  const merged: SeoPageRow[] = defaults.map((d) => {
    const found = storedByPath.get(normalizeSeoPath(d.path));
    return {
      path: d.path,
      label: d.label,
      title: str(found?.title),
      description: str(found?.description),
    };
  });

  const known = new Set(defaults.map((d) => normalizeSeoPath(d.path)));
  const extras: SeoPageRow[] = [];
  const seenExtras = new Set<string>();
  for (const row of rows) {
    const key = normalizeSeoPath(row.path as string);
    if (known.has(key) || seenExtras.has(key)) continue;
    const title = str(row.title).trim();
    const description = str(row.description).trim();
    if (!title && !description) continue;
    seenExtras.add(key);
    extras.push({
      path: row.path as string,
      label: str(row.label),
      title: str(row.title),
      description: str(row.description),
    });
  }

  return { pages: [...merged, ...extras].slice(0, SEO_LIMITS.pagesMax) };
}
