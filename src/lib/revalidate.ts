import { revalidatePath } from "next/cache";
import { publicCacheClear } from "@/lib/public-cache";

export type RevalidateTarget =
  "home" | "engineering" | "arts-science" | "polytechnic" | "all-institutions";

const TARGET_PATHS: Record<RevalidateTarget, string[]> = {
  home: ["/", "/campus-life", "/about-us", "/accreditations"],
  engineering: [
    "/institutions/engineering",
    "/institutions/engineering/programs",
    "/institutions/engineering/about",
    "/institutions/engineering/coe",
    "/institutions/engineering/placements",
    "/institutions/engineering/accreditations",
  ],
  "arts-science": [
    "/institutions/arts-science",
    "/institutions/arts-science/programs",
    "/institutions/arts-science/about",
    "/institutions/arts-science/placements",
    "/institutions/arts-science/accreditations",
  ],
  polytechnic: [
    "/institutions/polytechnic",
    "/institutions/polytechnic/programs",
    "/institutions/polytechnic/about",
    "/institutions/polytechnic/placements",
    "/institutions/polytechnic/accreditations",
  ],
  "all-institutions": [
    "/",
    "/institutions/engineering",
    "/institutions/engineering/programs",
    "/institutions/engineering/about",
    "/institutions/engineering/coe",
    "/institutions/engineering/placements",
    "/institutions/engineering/accreditations",
    "/institutions/arts-science",
    "/institutions/arts-science/programs",
    "/institutions/arts-science/about",
    "/institutions/arts-science/placements",
    "/institutions/arts-science/accreditations",
    "/institutions/polytechnic",
    "/institutions/polytechnic/programs",
    "/institutions/polytechnic/about",
    "/institutions/polytechnic/placements",
    "/institutions/polytechnic/accreditations",
  ],
};

const SITE_CONFIG_KEY_TARGETS: Record<string, RevalidateTarget[]> = {
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
  campusLifePage: ["home"],
  mainAccreditations: ["home"],
  engineeringAccreditations: ["engineering"],
  artsScienceAccreditations: ["arts-science"],
  polytechnicAccreditations: ["polytechnic"],
  // Rendered in the root layout, so it affects every public page. "home"
  // is included because "all-institutions" doesn't cover /campus-life.
  floatingElements: ["home", "all-institutions"],
};

export function revalidateTargets(...targets: RevalidateTarget[]): void {
  publicCacheClear();
  const paths = new Set<string>();
  for (const t of targets) {
    for (const p of TARGET_PATHS[t] ?? []) paths.add(p);
  }
  for (const path of paths) {
    try {
      revalidatePath(path);
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
