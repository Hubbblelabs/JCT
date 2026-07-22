/**
 * The public routes whose meta tags are editable per scope, and the label the
 * admin sees for each. Used as the seed value for the `<scope>Seo` site-config
 * key, so a fresh install lists every page instead of an empty form.
 *
 * A path only has an effect if that route reads it — every entry below is
 * wired to a `generateMetadata` that calls `seoMetadata`/`getPageSeo`. Adding
 * a row here without wiring the route does nothing.
 */
export type SeoPageDefault = {
  path: string;
  label: string;
};

export const MAIN_SEO_PAGES: SeoPageDefault[] = [
  { path: "/", label: "Home" },
  { path: "/about-us", label: "About Us" },
  { path: "/campus-life", label: "Campus Life" },
  { path: "/events", label: "News & Events" },
  { path: "/accreditations", label: "Accreditations" },
];

export const ENGINEERING_SEO_PAGES: SeoPageDefault[] = [
  { path: "/institutions/engineering", label: "Landing page" },
  { path: "/institutions/engineering/courses", label: "Courses" },
  { path: "/institutions/engineering/about", label: "About" },
  { path: "/institutions/engineering/coe", label: "Centre of Excellence" },
  { path: "/institutions/engineering/placements", label: "Placements" },
  { path: "/institutions/engineering/events", label: "News & Events" },
  { path: "/institutions/engineering/accreditations", label: "Accreditations" },
  { path: "/institutions/engineering/research", label: "Research" },
  {
    path: "/institutions/engineering/clubs-and-cells",
    label: "Clubs & Cells",
  },
  { path: "/institutions/engineering/committees", label: "Committees" },
  { path: "/institutions/engineering/documents", label: "Documents" },
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
];

export const SEO_PAGE_DEFAULTS: Record<string, SeoPageDefault[]> = {
  main: MAIN_SEO_PAGES,
  engineering: ENGINEERING_SEO_PAGES,
  "arts-science": ARTS_SCIENCE_SEO_PAGES,
  polytechnic: POLYTECHNIC_SEO_PAGES,
};

/** Blank rows for a scope, in the shape the `<scope>Seo` config stores. */
export function seoPagesDefaultValue(scope: string): {
  pages: { path: string; label: string; title: string; description: string }[];
} {
  return {
    pages: (SEO_PAGE_DEFAULTS[scope] ?? []).map((p) => ({
      ...p,
      title: "",
      description: "",
    })),
  };
}
