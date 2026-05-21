import { revalidatePath } from "next/cache";

export type RevalidateTarget =
  | "home"
  | "engineering"
  | "arts-science"
  | "polytechnic"
  | "all-institutions";

const TARGET_PATHS: Record<RevalidateTarget, string[]> = {
  home: ["/"],
  engineering: [
    "/institutions/engineering",
    "/institutions/engineering/programs",
  ],
  "arts-science": [
    "/institutions/arts-science",
    "/institutions/arts-science/programs",
  ],
  polytechnic: [
    "/institutions/polytechnic",
    "/institutions/polytechnic/programs",
  ],
  "all-institutions": [
    "/",
    "/institutions/engineering",
    "/institutions/engineering/programs",
    "/institutions/arts-science",
    "/institutions/arts-science/programs",
    "/institutions/polytechnic",
    "/institutions/polytechnic/programs",
  ],
};

const SITE_CONFIG_KEY_TARGETS: Record<string, RevalidateTarget[]> = {
  contact: ["all-institutions"],
  social: ["all-institutions"],
  address: ["all-institutions"],
  stats: ["home"],
  accreditations: ["all-institutions"],
  header: ["all-institutions"],
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
};

export function revalidateTargets(...targets: RevalidateTarget[]): void {
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
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      /* non-fatal */
    }
  }
}

export function revalidateForConfigKey(key: string): void {
  const targets = SITE_CONFIG_KEY_TARGETS[key];
  if (targets?.length) revalidateTargets(...targets);
  // Also clear the public API route cache so client-side fetches get fresh data
  try {
    revalidatePath("/api/public/site-config");
  } catch {
    /* non-fatal */
  }
}
