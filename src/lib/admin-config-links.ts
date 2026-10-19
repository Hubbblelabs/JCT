/**
 * Turns a SiteConfig key into something an editor can read and act on: a
 * plain-language name and the admin screen that edits it.
 *
 * The dashboard lists keys with unpublished drafts. Shown raw
 * ("artsSciencePlacementInfo") they meant nothing to the people who have to
 * publish them, and with no link the only way to find the editor was to guess
 * through the sidebar.
 */
import { CONTENT_PAGES } from "@/lib/content-pages";

type Scope = {
  /** Key prefix as it appears in the config key. */
  prefix: string;
  label: string;
  /** `?college=` value for college-scoped editors; null for the main site. */
  college: string | null;
};

const SCOPES: Scope[] = [
  { prefix: "artsScience", label: "Arts & Science", college: "arts-science" },
  { prefix: "engineering", label: "Engineering", college: "engineering" },
  { prefix: "polytechnic", label: "Polytechnic", college: "polytechnic" },
  { prefix: "main", label: "Main website", college: null },
  { prefix: "home", label: "Main website", college: null },
];

const ACRONYMS: Record<string, string> = {
  aqar: "AQAR",
  coe: "CoE",
  hr: "HR",
  ict: "ICT",
  jct: "JCT",
  naac: "NAAC",
  nirf: "NIRF",
  nss: "NSS",
  seo: "SEO",
};

/** "PlacementInfo" → "Placement info", "whyChooseJct" → "Why choose JCT". */
function words(camel: string): string {
  const spaced = camel
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .split(" ")
    .map((w) => ACRONYMS[w] ?? w)
    .join(" ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function splitScope(key: string): { scope: Scope | null; rest: string } {
  for (const scope of SCOPES) {
    if (
      key.startsWith(scope.prefix) &&
      key.length > scope.prefix.length &&
      /[A-Z]/.test(key[scope.prefix.length])
    ) {
      return { scope, rest: key.slice(scope.prefix.length) };
    }
  }
  return { scope: null, rest: key };
}

/** Screens that edit one whole config key per college. */
const PAGE_EDITORS: Record<string, string> = {
  About: "/admin/about",
  Accreditations: "/admin/accreditations",
  PlacementInfo: "/admin/placements-page",
  Clubs: "/admin/clubs",
  Committees: "/admin/committees",
};

/** Engineering-only editors with a fixed route. */
const FIXED_EDITORS: Record<string, string> = {
  engineeringCoe: "/admin/coe",
  engineeringResearch: "/admin/research",
  engineeringNaac: "/admin/naac",
  engineeringDocuments: "/admin/documents",
  campusLifePage: "/admin/campus-life",
  footer: "/admin/global/page-content?section=footer",
  floatingElements: "/admin/global/page-content?section=floatingElements",
};

export type ConfigKeyLink = { label: string; href: string | null };

export function describeConfigKey(key: string): ConfigKeyLink {
  const content = CONTENT_PAGES.find((p) => p.configKey === key);
  if (content) {
    return { label: content.label, href: `/admin/content/${content.slug}` };
  }

  const { scope, rest } = splitScope(key);
  const label = scope ? `${scope.label} · ${words(rest)}` : words(key);

  if (FIXED_EDITORS[key]) return { label, href: FIXED_EDITORS[key] };

  if (scope) {
    const page = PAGE_EDITORS[rest];
    if (page) {
      return { label, href: `${page}?college=${scope.college ?? "main"}` };
    }
    // Anything else under a scope is a landing-page section, and both landing
    // editors open on their section outline when no `section` is given.
    return {
      label,
      href: scope.college
        ? `/admin/page-content?college=${scope.college}`
        : "/admin/main/page-content",
    };
  }

  return { label, href: null };
}
