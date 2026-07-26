import { revalidatePath } from "next/cache";
import { publicCacheClear } from "@/lib/public-cache";
import { CONTENT_PAGES } from "@/lib/content-pages";

export type RevalidateTarget =
  "home" | "engineering" | "arts-science" | "polytechnic" | "all-institutions";

// Per-institution page lists, composed into "all-institutions" below so a page
// added to one institution can't drift out of the site-wide target.
const ENGINEERING_PATHS = [
  "/institutions/engineering",
  "/institutions/engineering/programs",
  "/institutions/engineering/about",
  "/institutions/engineering/coe",
  "/institutions/engineering/placements",
  "/institutions/engineering/accreditations",
  "/institutions/engineering/research",
  "/institutions/engineering/clubs-and-cells",
  "/institutions/engineering/committees",
  "/institutions/engineering/documents",
  "/institutions/engineering/accreditations/naac",
  // Block-based content pages (Library, NIRF, Timeline, …) — sourced from the
  // registry so a page added there can't drift out of the institution target.
  ...CONTENT_PAGES.filter((p) => p.institution === "engineering").map(
    (p) => p.path,
  ),
];

const ARTS_SCIENCE_PATHS = [
  "/institutions/arts-science",
  "/institutions/arts-science/programs",
  "/institutions/arts-science/about",
  "/institutions/arts-science/placements",
  "/institutions/arts-science/accreditations",
];

const POLYTECHNIC_PATHS = [
  "/institutions/polytechnic",
  "/institutions/polytechnic/programs",
  "/institutions/polytechnic/about",
  "/institutions/polytechnic/placements",
  "/institutions/polytechnic/accreditations",
];

const TARGET_PATHS: Record<RevalidateTarget, string[]> = {
  home: ["/", "/campus-life", "/about-us", "/accreditations"],
  engineering: ENGINEERING_PATHS,
  "arts-science": ARTS_SCIENCE_PATHS,
  polytechnic: POLYTECHNIC_PATHS,
  "all-institutions": [
    "/",
    ...ENGINEERING_PATHS,
    ...ARTS_SCIENCE_PATHS,
    ...POLYTECHNIC_PATHS,
  ],
};

const SITE_CONFIG_KEY_TARGETS: Record<string, RevalidateTarget[]> = {
  // Every block-based content page revalidates its own institution.
  ...Object.fromEntries(
    CONTENT_PAGES.map(
      (p) => [p.configKey, [p.institution]] as [string, RevalidateTarget[]],
    ),
  ),
  contact: ["all-institutions"],
  social: ["all-institutions"],
  address: ["all-institutions"],
  stats: ["home"],
  accreditations: ["all-institutions"],
  header: ["all-institutions"],
  mainHeader: ["home"],
  engineeringHeader: ["engineering"],
  artsScienceHeader: ["arts-science"],
  polytechnicHeader: ["polytechnic"],
  mainNavbar: ["home"],
  engineeringNavbar: ["engineering"],
  artsScienceNavbar: ["arts-science"],
  polytechnicNavbar: ["polytechnic"],
  footer: ["all-institutions"],
  home: ["home"],
  homeStats: ["home"],
  homeStatistics: ["home"],
  homeProspectus: ["home"],
  homePamphlet: ["home"],
  homeAdmissions: ["home"],
  whyChooseJct: ["home"],
  mainPlacementHighlights: ["home"],
  engineeringPlacementHighlights: ["engineering"],
  artsSciencePlacementHighlights: ["arts-science"],
  polytechnicPlacementHighlights: ["polytechnic"],
  engineeringPlacementInfo: ["engineering"],
  artsSciencePlacementInfo: ["arts-science"],
  polytechnicPlacementInfo: ["polytechnic"],
  lifeAtJct: ["home"],
  engineeringAnnouncement: ["engineering"],
  engineeringHero: ["engineering"],
  engineeringMetrics: ["engineering"],
  engineeringFacilities: ["engineering"],
  engineeringResearchHighlights: ["engineering"],
  engineeringAdmissions: ["engineering"],
  engineeringLifeAtJct: ["engineering"],
  artsScienceHero: ["arts-science"],
  artsScienceHeroStats: ["arts-science"],
  artsScienceLifeAtJct: ["arts-science"],
  artsScienceAdmissions: ["arts-science"],
  polytechnicHero: ["polytechnic"],
  polytechnicLifeAtJct: ["polytechnic"],
  polytechnicAdmissions: ["polytechnic"],
  mainAbout: ["home"],
  engineeringAbout: ["engineering"],
  artsScienceAbout: ["arts-science"],
  polytechnicAbout: ["polytechnic"],
  engineeringCoe: ["engineering"],
  engineeringResearch: ["engineering"],
  engineeringClubs: ["engineering"],
  engineeringCommittees: ["engineering"],
  engineeringDocuments: ["engineering"],
  campusLifePage: ["home"],
  mainAccreditations: ["home"],
  engineeringAccreditations: ["engineering"],
  engineeringNaac: ["engineering"],
  artsScienceAccreditations: ["arts-science"],
  polytechnicAccreditations: ["polytechnic"],
  // Meta tags are read inside generateMetadata, so every page in the scope
  // has to be re-rendered for a title/description change to take effect.
  mainSeo: ["home"],
  engineeringSeo: ["engineering"],
  artsScienceSeo: ["arts-science"],
  polytechnicSeo: ["polytechnic"],
  // Rendered in the root layout, so it affects every public page. "home"
  // is included because "all-institutions" doesn't cover /campus-life.
  floatingElements: ["home", "all-institutions"],
};

/**
 * Dynamic detail routes. `revalidatePath` needs the route *pattern* plus the
 * "page" type for these — passing a concrete URL only clears that one entry,
 * which would leave every other slug stale after an edit.
 */
const DYNAMIC_PAGE_PATTERNS: Partial<Record<RevalidateTarget, string[]>> = {
  engineering: [
    "/institutions/engineering/committees/[slug]",
    "/institutions/engineering/clubs-and-cells/[slug]",
  ],
};
DYNAMIC_PAGE_PATTERNS["all-institutions"] =
  DYNAMIC_PAGE_PATTERNS.engineering ?? [];

export function revalidateTargets(...targets: RevalidateTarget[]): void {
  publicCacheClear();
  const paths = new Set<string>();
  const patterns = new Set<string>();
  for (const t of targets) {
    for (const p of TARGET_PATHS[t] ?? []) paths.add(p);
    for (const p of DYNAMIC_PAGE_PATTERNS[t] ?? []) patterns.add(p);
  }
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      /* non-fatal */
    }
  }
  for (const pattern of patterns) {
    try {
      revalidatePath(pattern, "page");
    } catch {
      /* non-fatal */
    }
  }
}

export function revalidatePaths(...paths: string[]): void {
  publicCacheClear();
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      /* non-fatal */
    }
  }
}

export function revalidateForConfigKey(key: string): void {
  // Clear the in-memory public API cache so client-side fetches get fresh
  // data (the /api/public/* routes are dynamic — revalidatePath can't
  // invalidate them).
  publicCacheClear();
  const targets = SITE_CONFIG_KEY_TARGETS[key];
  if (targets?.length) revalidateTargets(...targets);
}
