import type {
  ProgramData,
  HeroMetaItem,
  LabelsTree,
  TabConfigItem,
} from "@/types/program";

const KNOWN_LABEL_KEYS = [
  "overview",
  "academics",
  "faculty",
  "facilities",
  "life",
  "career",
] as const;

function normalizeHeroMeta(v: unknown): HeroMetaItem[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: HeroMetaItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const label = typeof r.label === "string" ? r.label : "";
    const value = typeof r.value === "string" ? r.value : "";
    if (!label && !value) continue;
    const icon = typeof r.icon === "string" && r.icon ? r.icon : undefined;
    out.push({ label, value, ...(icon ? { icon } : {}) });
  }
  return out.length > 0 ? out : undefined;
}

function normalizeTabsConfig(v: unknown): TabConfigItem[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: TabConfigItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id.trim() : "";
    if (!id) continue;
    const label = typeof r.label === "string" ? r.label : "";
    const icon = typeof r.icon === "string" && r.icon ? r.icon : undefined;
    const visible = typeof r.visible === "boolean" ? r.visible : undefined;
    out.push({
      id,
      label,
      ...(icon ? { icon } : {}),
      ...(visible === undefined ? {} : { visible }),
    });
  }
  return out.length > 0 ? out : undefined;
}

function normalizeLabels(v: unknown): LabelsTree | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const r = v as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of KNOWN_LABEL_KEYS) {
    const val = r[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      out[key] = val;
    }
  }
  return Object.keys(out).length > 0 ? (out as LabelsTree) : undefined;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return isNaN(n) ? fallback : n;
  }
  return fallback;
}

function lines(v: unknown): string[] {
  if (typeof v === "string")
    return v
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  if (Array.isArray(v))
    return (v as unknown[]).filter((x) => typeof x === "string") as string[];
  return [];
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function obj<T>(v: unknown, fallback: T): T {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as T) : fallback;
}

export function normalizeProgramData(
  content: unknown,
  slug: string,
): ProgramData | null {
  if (!content || typeof content !== "object") return null;
  const c = content as Record<string, unknown>;

  const name = str(c.name);
  const college = c.college;
  if (
    !name ||
    (college !== "engineering" &&
      college !== "arts-science" &&
      college !== "polytechnic")
  ) {
    return null;
  }

  const defaultBg =
    college === "engineering"
      ? "#0F172A"
      : college === "polytechnic"
        ? "#1a3a2a"
        : "#800020";
  const defaultHero =
    college === "engineering"
      ? "/site_assests/engineering.jpeg"
      : college === "polytechnic"
        ? "/site_assests/polytechnic.jpeg"
        : "/site_assests/arts.jpeg";

  const paragraphs = [str(c.about1), str(c.about2), str(c.about3)].filter(
    Boolean,
  );

  return {
    slug,
    name,
    shortName: str(c.shortName),
    college,
    bgColor: str(c.bgColor, defaultBg),
    accentColor: str(c.accentColor, "#FFC917"),
    heroImage: str(c.heroImage, defaultHero),

    about: {
      paragraphs: paragraphs.length > 0 ? paragraphs : [name],
      established: str(c.established),
      accreditation: str(c.accreditation),
      intake: num(c.intake),
      affiliation: str(c.affiliation),
      duration: str(c.duration, "4 Years"),
    },

    hod: {
      name: str(c.hodName),
      designation: str(c.hodDesignation, "Head of Department"),
      qualification: str(c.hodQualification),
      experience: str(c.hodExperience),
      message: lines(c.hodMessage),
    },

    visionMission: {
      vision: str(c.vision),
      mission: lines(c.mission),
    },

    programOutcomes: arr(c.programOutcomes),
    advisoryBoard: arr(c.advisoryBoard),
    pac: arr(c.pac),
    bos: arr(c.bos),
    curriculum: arr(c.curriculum),

    teachingLearning: obj(c.teachingLearning, {
      overview: "",
      methods: [],
      tools: [],
      practices: [],
    }),

    valueAddedCourses: arr(c.valueAddedCourses),
    faculty: arr(c.faculty),
    labs: arr(c.labs),

    library: obj(c.library, {
      books: 0,
      journals: 0,
      magazines: 0,
      digitalAccess: [],
      description: "",
    }),

    events: arr(c.events),

    studentParticipation: obj(c.studentParticipation, {
      clubs: [],
      highlights: [],
    }),

    facultyParticipation: obj(c.facultyParticipation, {
      conferences: [],
      workshops: [],
    }),

    studentAchievements: arr(c.studentAchievements),
    facultyAchievements: arr(c.facultyAchievements),

    magazine:
      c.magazine && typeof c.magazine === "object" && !Array.isArray(c.magazine)
        ? (c.magazine as ProgramData["magazine"])
        : undefined,

    careerProgression: {
      topRecruiters: arr(c.topRecruiters),
      higherStudies: arr(c.higherStudies),
      averagePackage: str(c.averagePackage),
      placementRate: str(c.placementRate),
    },

    feedback: obj(c.feedback, {
      curriculumProcess: [],
      facilityProcess: [],
      recentImprovements: [],
    }),

    degreePrefix:
      typeof c.degreePrefix === "string" ? c.degreePrefix : undefined,
    heroMeta: normalizeHeroMeta(c.heroMeta),
    tabsConfig: normalizeTabsConfig(c.tabsConfig),
    labels: normalizeLabels(c.labels),
  };
}
