import { revalidatePath } from "next/cache";
import { publicCacheClear } from "@/lib/public-cache";

export type RevalidateTarget =
  | "home"
  | "engineering"
  | "arts-science"
  | "polytechnic"
  | "all-institutions";

const TARGET_PATHS: Record<RevalidateTarget, string[]> = {
  home: ["/", "/campus-life", "/about-us"],
  engineering: [
    "/institutions/engineering",
    "/institutions/engineering/programs",
    "/institutions/engineering/about",
    "/institutions/engineering/coe",
  ],
  "arts-science": [
    "/institutions/arts-science",
    "/institutions/arts-science/programs",
    "/institutions/arts-science/about",
  ],
  polytechnic: [
    "/institutions/polytechnic",
    "/institutions/polytechnic/programs",
    "/institutions/polytechnic/about",
  ],
  "all-institutions": [
    "/",
    "/institutions/engineering",
    "/institutions/engineering/programs",
    "/institutions/engineering/about",
    "/institutions/engineering/coe",
    "/institutions/arts-science",
    "/institutions/arts-science/programs",
    "/institutions/arts-science/about",
    "/institutions/polytechnic",
    "/institutions/polytechnic/programs",
    "/institutions/polytechnic/about",
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
  recruitersSection: ["home"],
  lifeAtJct: ["home", "engineering"],
  engineeringAnnouncement: ["engineering"],
  engineeringHero: ["engineering"],
  engineeringMetrics: ["engineering"],
  engineeringFacilities: ["engineering"],
  engineeringResearchHighlights: ["engineering"],
  engineeringAdmissions: ["engineering"],
  artsScienceHero: ["arts-science"],
  artsScienceHeroStats: ["arts-science"],
  artsScienceCampusLife: ["arts-science"],
  artsScienceAdmissions: ["arts-science"],
  polytechnicHero: ["polytechnic"],
  polytechnicCampusLife: ["polytechnic"],
  polytechnicAdmissions: ["polytechnic"],
  mainAbout: ["home"],
  engineeringAbout: ["engineering"],
  artsScienceAbout: ["arts-science"],
  polytechnicAbout: ["polytechnic"],
  engineeringCoe: ["engineering"],
  campusLifePage: ["home"],
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
