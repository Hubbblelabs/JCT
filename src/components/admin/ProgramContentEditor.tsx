"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Users,
  FlaskConical,
  Trophy,
  TrendingUp,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import {
  TextInput,
  NumberInput,
  TextArea,
  StringList,
  Accordion,
  ImageUploadInput,
  ItemsEditor,
  LabsEditor,
  type FieldDef,
  type LabItem,
} from "@/components/admin/inputs";
import {
  CurriculumEditor,
  type CurriculumRegulation,
} from "@/components/admin/CurriculumEditor";
import {
  ProgramTabsEditor,
  type Tab as CustomTab,
} from "@/components/admin/ProgramTabsEditor";
import { ProgramLabelsEditor } from "@/components/admin/ProgramLabelsEditor";
import type { HeroMetaItem, LabelsTree, TabConfigItem } from "@/types/program";

// ─── Tab definitions (mirror ProgramPageLayout.tsx) ──────────────────────

const TAB_IDS = [
  "overview",
  "academics",
  "faculty",
  "facilities",
  "life",
  "career",
] as const;

type TabId = (typeof TAB_IDS)[number];

const TAB_LABELS: Record<TabId, string> = {
  overview: "Overview",
  academics: "Academics",
  faculty: "Faculty & Council",
  facilities: "Facilities",
  life: "Life & Achievements",
  career: "Career & Feedback",
};

const TAB_ICONS: Record<TabId, LucideIcon> = {
  overview: BookOpen,
  academics: GraduationCap,
  faculty: Users,
  facilities: FlaskConical,
  life: Trophy,
  career: TrendingUp,
};

// ─── Field schemas reused across tabs ───────────────────────────────────────

const PO_FIELDS: FieldDef[] = [
  { key: "code", label: "Code", placeholder: "PO1" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description", type: "textarea", span2: true },
];
const E_PO = { code: "", title: "", description: "" };

const FACULTY_FIELDS: FieldDef[] = [
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "qualification", label: "Qualification" },
  { key: "experience", label: "Experience", placeholder: "10+ years" },
  { key: "specialization", label: "Specialization" },
  { key: "email", label: "Email" },
];
const E_FACULTY = {
  name: "",
  designation: "",
  qualification: "",
  experience: "",
  specialization: "",
  email: "",
};

const BOARD_FIELDS: FieldDef[] = [
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "organization", label: "Organization" },
  { key: "role", label: "Role" },
];
const E_BOARD = { name: "", designation: "", organization: "", role: "" };

const EVENT_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", span2: true },
  { key: "date", label: "Date", placeholder: "YYYY-MM-DD" },
  { key: "type", label: "Type", placeholder: "Workshop / Conference…" },
  { key: "description", label: "Description", type: "textarea", span2: true },
  { key: "resourcePerson", label: "Resource Person" },
];
const E_EVENT = {
  title: "",
  date: "",
  type: "",
  description: "",
  resourcePerson: "",
};

const ACHIEV_FIELDS: FieldDef[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Achievement Title", span2: true },
  { key: "detail", label: "Detail", type: "textarea", span2: true },
  { key: "year", label: "Year" },
];
const E_ACHIEV = { name: "", title: "", detail: "", year: "" };

const VAC_FIELDS: FieldDef[] = [
  { key: "name", label: "Course Name", span2: true },
  { key: "hours", label: "Hours", placeholder: "30 Hours" },
  { key: "provider", label: "Provider" },
  { key: "description", label: "Description", type: "textarea", span2: true },
];
const E_VAC = { name: "", hours: "", provider: "", description: "" };

const SP_HL_FIELDS: FieldDef[] = [
  { key: "title", label: "Event / Activity", span2: true },
  { key: "year", label: "Year", placeholder: "2024" },
  { key: "description", label: "Description", type: "textarea", span2: true },
];
const E_SP_HL = { title: "", year: "", description: "" };

const FP_CONF_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", span2: true },
  { key: "faculty", label: "Faculty" },
  { key: "venue", label: "Venue" },
  { key: "year", label: "Year" },
];
const E_FP_CONF = { title: "", faculty: "", venue: "", year: "" };

const HERO_META_FIELDS: FieldDef[] = [
  { key: "icon", label: "Icon (optional)", placeholder: "calendar" },
  { key: "label", label: "Label", placeholder: "Duration" },
  { key: "value", label: "Value", placeholder: "4 Years", span2: true },
];
const E_HERO_META: HeroMetaItem = { icon: "", label: "", value: "" };

const TAB_CONFIG_FIELDS: FieldDef[] = [
  { key: "id", label: "Tab id", placeholder: "overview" },
  { key: "label", label: "Label", placeholder: "Overview" },
  { key: "icon", label: "Icon (optional)", placeholder: "bookOpen" },
];
const E_TAB_CONFIG: TabConfigItem = { id: "", label: "", icon: "" };

// ─── Read-side helpers (flat first, nested fallback) ────────────────────────

type RawContent = Record<string, unknown>;

function readNested(c: RawContent, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = c;
  for (const p of parts) {
    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

function flatStr(c: RawContent, key: string, nestedPath?: string): string {
  const f = c[key];
  if (typeof f === "string" && f) return f;
  if (typeof f === "number") return String(f);
  if (nestedPath) {
    const n = readNested(c, nestedPath);
    if (typeof n === "string") return n;
    if (typeof n === "number") return String(n);
  }
  return "";
}

function flatNum(c: RawContent, key: string, nestedPath?: string): number {
  const f = c[key];
  if (typeof f === "number") return f;
  if (typeof f === "string" && f) {
    const n = parseInt(f, 10);
    if (!isNaN(n)) return n;
  }
  if (nestedPath) {
    const v = readNested(c, nestedPath);
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = parseInt(v, 10);
      if (!isNaN(n)) return n;
    }
  }
  return 0;
}

function flatArr<T = unknown>(
  c: RawContent,
  key: string,
  nestedPath?: string,
): T[] {
  const f = c[key];
  if (Array.isArray(f)) return f as T[];
  if (nestedPath) {
    const n = readNested(c, nestedPath);
    if (Array.isArray(n)) return n as T[];
  }
  return [];
}

function flatObj(c: RawContent, key: string): Record<string, unknown> {
  const v = c[key];
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

/** Lines helper for fields that may be string (newline-joined) or array. */
function joinLines(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    return (v as unknown[]).filter((x) => typeof x === "string").join("\n");
  }
  return "";
}

/** Read flat string field that on nested-shape sources may be an array. */
function flatMultilineStr(
  c: RawContent,
  key: string,
  nestedPath?: string,
): string {
  const f = c[key];
  if (typeof f === "string") return f;
  if (Array.isArray(f)) return joinLines(f);
  if (nestedPath) {
    const v = readNested(c, nestedPath);
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return joinLines(v);
  }
  return "";
}

/** Read `about1` / `about2` / `about3`, with fallback to nested paragraphs[i]. */
function readAboutParagraph(c: RawContent, idx: 1 | 2 | 3): string {
  const flat = c[`about${idx}`];
  if (typeof flat === "string") return flat;
  const paras = readNested(c, "about.paragraphs");
  if (Array.isArray(paras)) {
    const v = paras[idx - 1];
    if (typeof v === "string") return v;
  }
  return "";
}

// ─── Component ──────────────────────────────────────────────────────────────

export type DepartmentContentEditorProps = {
  content: RawContent;
  onChange: (next: RawContent) => void;
  /** When provided, shows a "Preview public page" link. */
  slug?: string;
  /** When provided alongside slug, builds the preview URL. */
  college?: string;
  /** Override the search-param key used for the active tab (default: editTab). */
  tabParam?: string;
};

export type ProgramContentSection =
  | "hero"
  | "stats"
  | "about"
  | "hod"
  | "visionMission"
  | "programOutcomes"
  | "curriculum"
  | "teachingLearning"
  | "valueAddedCourses"
  | "faculty"
  | "advisoryBoard"
  | "pac"
  | "bos"
  | "labs"
  | "library"
  | "events"
  | "studentAchievements"
  | "facultyAchievements"
  | "magazine"
  | "participation"
  | "careerProgression"
  | "feedback";

export const PROGRAM_CONTENT_SECTION_LABELS: Record<
  ProgramContentSection,
  string
> = {
  hero: "Hero",
  stats: "Quick stats",
  about: "About",
  hod: "HOD's desk",
  visionMission: "Vision & mission",
  programOutcomes: "Program outcomes",
  curriculum: "Curriculum",
  teachingLearning: "Teaching & learning",
  valueAddedCourses: "Value-added courses",
  faculty: "Core faculty",
  advisoryBoard: "Advisory board",
  pac: "PAC",
  bos: "BOS",
  labs: "Laboratories",
  library: "Library",
  events: "Events",
  studentAchievements: "Student achievements",
  facultyAchievements: "Faculty achievements",
  magazine: "Newsletter / magazine",
  participation: "Participation & clubs",
  careerProgression: "Career progression",
  feedback: "Feedback & improvements",
};

export function ProgramSectionInspector({
  section,
  content,
  onChange,
}: {
  section: ProgramContentSection;
  content: RawContent;
  onChange: (next: RawContent) => void;
}) {
  const set = (key: string, val: unknown) =>
    onChange({ ...content, [key]: val });
  const setObj = (key: string, sub: string, val: unknown) =>
    onChange({
      ...content,
      [key]: {
        ...((content[key] as Record<string, unknown>) ?? {}),
        [sub]: val,
      },
    });

  switch (section) {
    case "hero":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <TextInput
              label="Program Name"
              value={String(content.name ?? "")}
              onChange={(e) => set("name", e.target.value)}
            />
            <TextInput
              label="Short Name"
              value={String(content.shortName ?? "")}
              onChange={(e) => set("shortName", e.target.value)}
            />
            <ImageUploadInput
              label="Hero Image"
              value={String(content.heroImage ?? "")}
              onChange={(url) => set("heroImage", url)}
              uploadOnly
            />
            <TextInput
              label="Accent Color"
              value={String(content.accentColor ?? "")}
              onChange={(e) => set("accentColor", e.target.value)}
              placeholder="#0F4C81"
            />
            <TextInput
              label="Degree Prefix"
              value={String(content.degreePrefix ?? "")}
              onChange={(e) => set("degreePrefix", e.target.value)}
              placeholder="B.E/B.Tech "
            />
          </div>
          <ItemsEditor
            items={flatArr<Record<string, unknown>>(content, "heroMeta")}
            onChange={(v) => set("heroMeta", v)}
            fields={HERO_META_FIELDS}
            emptyItem={E_HERO_META as unknown as Record<string, unknown>}
            addLabel="Add Pill"
          />
        </div>
      );
    case "stats":
      return (
        <div className="grid grid-cols-1 gap-3">
          <TextInput
            label="Established"
            value={flatStr(content, "established", "about.established")}
            onChange={(e) => set("established", e.target.value)}
          />
          <TextInput
            label="Intake"
            value={flatStr(content, "intake", "about.intake")}
            onChange={(e) => set("intake", e.target.value)}
          />
          <TextInput
            label="Accreditation"
            value={flatStr(content, "accreditation", "about.accreditation")}
            onChange={(e) => set("accreditation", e.target.value)}
          />
          <TextInput
            label="Duration"
            value={flatStr(content, "duration", "about.duration")}
            onChange={(e) => set("duration", e.target.value)}
          />
          <TextInput
            label="Affiliation"
            value={flatStr(content, "affiliation", "about.affiliation")}
            onChange={(e) => set("affiliation", e.target.value)}
          />
        </div>
      );
    case "about":
      return (
        <>
          {[1, 2, 3].map((idx) => (
            <TextArea
              key={idx}
              label={`Paragraph ${idx}`}
              value={readAboutParagraph(content, idx as 1 | 2 | 3)}
              onChange={(e) => set(`about${idx}`, e.target.value)}
              rows={4}
            />
          ))}
        </>
      );
    case "hod":
      return (
        <>
          <div className="grid grid-cols-1 gap-3">
            <TextInput
              label="HOD Name"
              value={flatStr(content, "hodName", "hod.name")}
              onChange={(e) => set("hodName", e.target.value)}
            />
            <TextInput
              label="Designation"
              value={flatStr(content, "hodDesignation", "hod.designation")}
              onChange={(e) => set("hodDesignation", e.target.value)}
            />
            <TextInput
              label="Qualification"
              value={flatStr(content, "hodQualification", "hod.qualification")}
              onChange={(e) => set("hodQualification", e.target.value)}
            />
            <TextInput
              label="Experience"
              value={flatStr(content, "hodExperience", "hod.experience")}
              onChange={(e) => set("hodExperience", e.target.value)}
            />
            <ImageUploadInput
              label="Photo"
              value={flatStr(content, "hodPhoto", "hod.photo")}
              onChange={(url) => set("hodPhoto", url)}
              uploadOnly
            />
          </div>
          <TextArea
            label="HOD Message"
            value={flatMultilineStr(content, "hodMessage", "hod.message")}
            onChange={(e) => set("hodMessage", e.target.value)}
            rows={5}
          />
        </>
      );
    case "visionMission":
      return (
        <>
          <TextArea
            label="Vision"
            value={flatStr(content, "vision", "visionMission.vision")}
            onChange={(e) => set("vision", e.target.value)}
            rows={3}
          />
          <TextArea
            label="Mission (one point per line)"
            value={flatMultilineStr(
              content,
              "mission",
              "visionMission.mission",
            )}
            onChange={(e) => set("mission", e.target.value)}
            rows={5}
          />
        </>
      );
    case "programOutcomes":
      return (
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "programOutcomes")}
          onChange={(v) => set("programOutcomes", v)}
          fields={PO_FIELDS}
          emptyItem={E_PO}
          addLabel="Add Outcome"
        />
      );
    case "curriculum":
      return (
        <CurriculumEditor
          value={
            (content.curriculum as CurriculumRegulation[] | undefined) ?? []
          }
          onChange={(v) => set("curriculum", v)}
        />
      );
    case "teachingLearning":
      return (
        <>
          <TextArea
            label="Overview"
            value={String(flatObj(content, "teachingLearning").overview ?? "")}
            onChange={(e) =>
              setObj("teachingLearning", "overview", e.target.value)
            }
            rows={3}
          />
          <StringList
            label="Teaching Methods"
            values={
              (flatObj(content, "teachingLearning").methods as string[]) ?? []
            }
            onChange={(v) => setObj("teachingLearning", "methods", v)}
          />
          <StringList
            label="Tools & Technologies"
            values={
              (flatObj(content, "teachingLearning").tools as string[]) ?? []
            }
            onChange={(v) => setObj("teachingLearning", "tools", v)}
          />
          <StringList
            label="Best Practices"
            values={
              (flatObj(content, "teachingLearning").practices as string[]) ?? []
            }
            onChange={(v) => setObj("teachingLearning", "practices", v)}
          />
        </>
      );
    case "valueAddedCourses":
      return (
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "valueAddedCourses")}
          onChange={(v) => set("valueAddedCourses", v)}
          fields={VAC_FIELDS}
          emptyItem={E_VAC}
          addLabel="Add Course"
        />
      );
    case "faculty":
      return (
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "faculty")}
          onChange={(v) => set("faculty", v)}
          fields={FACULTY_FIELDS}
          emptyItem={E_FACULTY}
          addLabel="Add Faculty Member"
        />
      );
    case "advisoryBoard":
    case "pac":
    case "bos":
      return (
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, section)}
          onChange={(v) => set(section, v)}
          fields={BOARD_FIELDS}
          emptyItem={E_BOARD}
          addLabel="Add Member"
        />
      );
    case "labs":
      return (
        <LabsEditor
          labs={(content.labs as LabItem[] | undefined) ?? []}
          onChange={(v) => set("labs", v)}
        />
      );
    case "library":
      return (
        <>
          <TextArea
            label="Description"
            value={String(flatObj(content, "library").description ?? "")}
            onChange={(e) => setObj("library", "description", e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <NumberInput
              label="Books / Volumes"
              value={Number(flatObj(content, "library").books ?? 0)}
              min={0}
              onChange={(e) =>
                setObj("library", "books", Number(e.target.value))
              }
            />
            <NumberInput
              label="Journals"
              value={Number(flatObj(content, "library").journals ?? 0)}
              min={0}
              onChange={(e) =>
                setObj("library", "journals", Number(e.target.value))
              }
            />
            <NumberInput
              label="Magazines"
              value={Number(flatObj(content, "library").magazines ?? 0)}
              min={0}
              onChange={(e) =>
                setObj("library", "magazines", Number(e.target.value))
              }
            />
          </div>
          <StringList
            label="Digital Access / Online Resources"
            values={
              (flatObj(content, "library").digitalAccess as string[]) ?? []
            }
            onChange={(v) => setObj("library", "digitalAccess", v)}
          />
        </>
      );
    case "events":
      return (
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "events")}
          onChange={(v) => set("events", v)}
          fields={EVENT_FIELDS}
          emptyItem={E_EVENT}
          addLabel="Add Event"
        />
      );
    case "studentAchievements":
    case "facultyAchievements":
      return (
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, section)}
          onChange={(v) => set(section, v)}
          fields={ACHIEV_FIELDS}
          emptyItem={E_ACHIEV}
          addLabel="Add Achievement"
        />
      );
    case "magazine":
      return (
        <>
          <div className="grid grid-cols-1 gap-3">
            <TextInput
              label="Name"
              value={String(flatObj(content, "magazine").name ?? "")}
              onChange={(e) => setObj("magazine", "name", e.target.value)}
            />
            <TextInput
              label="Frequency"
              value={String(flatObj(content, "magazine").frequency ?? "")}
              onChange={(e) => setObj("magazine", "frequency", e.target.value)}
            />
            <TextInput
              label="Latest Issue"
              value={String(flatObj(content, "magazine").latestIssue ?? "")}
              onChange={(e) =>
                setObj("magazine", "latestIssue", e.target.value)
              }
            />
          </div>
          <TextArea
            label="Description"
            value={String(flatObj(content, "magazine").description ?? "")}
            onChange={(e) => setObj("magazine", "description", e.target.value)}
            rows={3}
          />
          <StringList
            label="Highlights"
            values={(flatObj(content, "magazine").highlights as string[]) ?? []}
            onChange={(v) => setObj("magazine", "highlights", v)}
          />
        </>
      );
    case "participation":
      return (
        <>
          <StringList
            label="Student Clubs"
            values={
              (flatObj(content, "studentParticipation").clubs as string[]) ?? []
            }
            onChange={(v) => setObj("studentParticipation", "clubs", v)}
          />
          <ItemsEditor
            items={
              (flatObj(content, "studentParticipation").highlights as Record<
                string,
                unknown
              >[]) ?? []
            }
            onChange={(v) => setObj("studentParticipation", "highlights", v)}
            fields={SP_HL_FIELDS}
            emptyItem={E_SP_HL}
            addLabel="Add Highlight"
          />
          <StringList
            label="Faculty Workshops"
            values={
              (flatObj(content, "facultyParticipation")
                .workshops as string[]) ?? []
            }
            onChange={(v) => setObj("facultyParticipation", "workshops", v)}
          />
          <ItemsEditor
            items={
              (flatObj(content, "facultyParticipation").conferences as Record<
                string,
                unknown
              >[]) ?? []
            }
            onChange={(v) => setObj("facultyParticipation", "conferences", v)}
            fields={FP_CONF_FIELDS}
            emptyItem={E_FP_CONF}
            addLabel="Add Conference"
          />
        </>
      );
    case "careerProgression":
      return (
        <>
          <div className="grid grid-cols-1 gap-3">
            <TextInput
              label="Placement Rate"
              value={flatStr(
                content,
                "placementRate",
                "careerProgression.placementRate",
              )}
              onChange={(e) => set("placementRate", e.target.value)}
            />
            <TextInput
              label="Average Package"
              value={flatStr(
                content,
                "averagePackage",
                "careerProgression.averagePackage",
              )}
              onChange={(e) => set("averagePackage", e.target.value)}
            />
            <TextInput
              label="Highest Package"
              value={flatStr(
                content,
                "highestPackage",
                "careerProgression.highestPackage",
              )}
              onChange={(e) => set("highestPackage", e.target.value)}
            />
          </div>
          <StringList
            label="Top Recruiters"
            values={flatArr<string>(
              content,
              "topRecruiters",
              "careerProgression.topRecruiters",
            )}
            onChange={(v) => set("topRecruiters", v)}
          />
          <StringList
            label="Higher Studies Paths"
            values={flatArr<string>(
              content,
              "higherStudies",
              "careerProgression.higherStudies",
            )}
            onChange={(v) => set("higherStudies", v)}
          />
        </>
      );
    case "feedback":
      return (
        <>
          <StringList
            label="Curriculum Feedback Process"
            values={
              (flatObj(content, "feedback").curriculumProcess as string[]) ?? []
            }
            onChange={(v) => setObj("feedback", "curriculumProcess", v)}
          />
          <StringList
            label="Facility Feedback Process"
            values={
              (flatObj(content, "feedback").facilityProcess as string[]) ?? []
            }
            onChange={(v) => setObj("feedback", "facilityProcess", v)}
          />
          <StringList
            label="Recent Improvements"
            values={
              (flatObj(content, "feedback").recentImprovements as string[]) ??
              []
            }
            onChange={(v) => setObj("feedback", "recentImprovements", v)}
          />
        </>
      );
  }
}

export function ProgramContentEditor({
  content,
  onChange,
  slug,
  college,
  tabParam = "editTab",
}: DepartmentContentEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTabRaw = searchParams.get(tabParam);
  const activeTab: TabId = TAB_IDS.includes(activeTabRaw as TabId)
    ? (activeTabRaw as TabId)
    : "overview";

  const setActive = useCallback(
    (id: TabId) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set(tabParam, id);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, tabParam],
  );

  // ── Mutation helpers ──────────────────────────────────────────────────────

  const set = useCallback(
    (key: string, val: unknown) => onChange({ ...content, [key]: val }),
    [content, onChange],
  );
  const setObj = useCallback(
    (key: string, sub: string, val: unknown) =>
      onChange({
        ...content,
        [key]: {
          ...((content[key] as Record<string, unknown>) ?? {}),
          [sub]: val,
        },
      }),
    [content, onChange],
  );

  // ── Public preview URL ────────────────────────────────────────────────────
  const previewHref = useMemo(() => {
    if (!slug) return null;
    const c = college || (content.college as string) || "engineering";
    return `/institutions/${c}/programs/${slug}`;
  }, [slug, college, content.college]);

  // ── Empty-state predicates (one per section, kept small) ──────────────────
  const isEmpty = useMemo(
    () => ({
      about:
        !readAboutParagraph(content, 1) &&
        !readAboutParagraph(content, 2) &&
        !readAboutParagraph(content, 3),
      stats:
        !flatStr(content, "established", "about.established") &&
        !flatStr(content, "intake", "about.intake") &&
        !flatStr(content, "accreditation", "about.accreditation") &&
        !flatStr(content, "affiliation", "about.affiliation"),
      hod: !flatStr(content, "hodName", "hod.name"),
      visionMission:
        !flatStr(content, "vision", "visionMission.vision") &&
        !flatMultilineStr(content, "mission", "visionMission.mission"),
      programOutcomes: flatArr(content, "programOutcomes").length === 0,
      curriculum: flatArr(content, "curriculum").length === 0,
      teachingLearning:
        !flatStr(content, "", "teachingLearning.overview") &&
        flatArr(content, "", "teachingLearning.methods").length === 0,
      valueAddedCourses: flatArr(content, "valueAddedCourses").length === 0,
      faculty: flatArr(content, "faculty").length === 0,
      advisoryBoard: flatArr(content, "advisoryBoard").length === 0,
      pac: flatArr(content, "pac").length === 0,
      bos: flatArr(content, "bos").length === 0,
      labs: flatArr(content, "labs").length === 0,
      library:
        flatNum(content, "", "library.books") === 0 &&
        flatArr(content, "", "library.digitalAccess").length === 0,
      events: flatArr(content, "events").length === 0,
      studentAchievements: flatArr(content, "studentAchievements").length === 0,
      facultyAchievements: flatArr(content, "facultyAchievements").length === 0,
      magazine: !flatStr(content, "", "magazine.name"),
      studentParticipation:
        flatArr(content, "", "studentParticipation.clubs").length === 0 &&
        flatArr(content, "", "studentParticipation.highlights").length === 0,
      facultyParticipation:
        flatArr(content, "", "facultyParticipation.workshops").length === 0 &&
        flatArr(content, "", "facultyParticipation.conferences").length === 0,
      careerProgression:
        !flatStr(content, "placementRate", "careerProgression.placementRate") &&
        !flatStr(
          content,
          "averagePackage",
          "careerProgression.averagePackage",
        ) &&
        flatArr(content, "topRecruiters", "careerProgression.topRecruiters")
          .length === 0,
      feedback:
        flatArr(content, "", "feedback.curriculumProcess").length === 0 &&
        flatArr(content, "", "feedback.facilityProcess").length === 0 &&
        flatArr(content, "", "feedback.recentImprovements").length === 0,
    }),
    [content],
  );

  // ── Tab bodies ────────────────────────────────────────────────────────────

  const OverviewBody = (
    <>
      <SectionAccordion title="About the Department" empty={isEmpty.about}>
        <TextArea
          label="Paragraph 1"
          value={readAboutParagraph(content, 1)}
          onChange={(e) => set("about1", e.target.value)}
          rows={4}
        />
        <TextArea
          label="Paragraph 2"
          value={readAboutParagraph(content, 2)}
          onChange={(e) => set("about2", e.target.value)}
          rows={4}
        />
        <TextArea
          label="Paragraph 3"
          value={readAboutParagraph(content, 3)}
          onChange={(e) => set("about3", e.target.value)}
          rows={4}
        />
      </SectionAccordion>

      <SectionAccordion title="Quick Stats" empty={isEmpty.stats}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <TextInput
            label="Established"
            value={flatStr(content, "established", "about.established")}
            onChange={(e) => set("established", e.target.value)}
            placeholder="2009"
          />
          <TextInput
            label="Intake"
            value={flatStr(content, "intake", "about.intake")}
            onChange={(e) => set("intake", e.target.value)}
            placeholder="60"
          />
          <TextInput
            label="Accreditation"
            value={flatStr(content, "accreditation", "about.accreditation")}
            onChange={(e) => set("accreditation", e.target.value)}
            placeholder="NBA Accredited"
          />
          <TextInput
            label="Duration"
            value={flatStr(content, "duration", "about.duration")}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="4 Years"
          />
          <TextInput
            label="Affiliation"
            value={flatStr(content, "affiliation", "about.affiliation")}
            onChange={(e) => set("affiliation", e.target.value)}
            placeholder="Anna University"
          />
        </div>
      </SectionAccordion>

      <SectionAccordion title="HOD's Desk" empty={isEmpty.hod}>
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="HOD Name"
            value={flatStr(content, "hodName", "hod.name")}
            onChange={(e) => set("hodName", e.target.value)}
          />
          <TextInput
            label="Designation"
            value={flatStr(content, "hodDesignation", "hod.designation")}
            onChange={(e) => set("hodDesignation", e.target.value)}
          />
          <TextInput
            label="Qualification"
            value={flatStr(content, "hodQualification", "hod.qualification")}
            onChange={(e) => set("hodQualification", e.target.value)}
          />
          <TextInput
            label="Experience"
            value={flatStr(content, "hodExperience", "hod.experience")}
            onChange={(e) => set("hodExperience", e.target.value)}
            placeholder="20+ years"
          />
          <ImageUploadInput
            label="Photo"
            value={flatStr(content, "hodPhoto", "hod.photo")}
            onChange={(url) => set("hodPhoto", url)}
            uploadOnly
          />
        </div>
        <TextArea
          label="HOD Message (one paragraph per line)"
          value={flatMultilineStr(content, "hodMessage", "hod.message")}
          onChange={(e) => set("hodMessage", e.target.value)}
          rows={5}
        />
      </SectionAccordion>

      <SectionAccordion title="Vision & Mission" empty={isEmpty.visionMission}>
        <TextArea
          label="Vision"
          value={flatStr(content, "vision", "visionMission.vision")}
          onChange={(e) => set("vision", e.target.value)}
          rows={3}
        />
        <TextArea
          label="Mission (one point per line)"
          value={flatMultilineStr(content, "mission", "visionMission.mission")}
          onChange={(e) => set("mission", e.target.value)}
          rows={5}
        />
      </SectionAccordion>

      <SectionAccordion
        title="Program Outcomes"
        empty={isEmpty.programOutcomes}
      >
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "programOutcomes")}
          onChange={(v) => set("programOutcomes", v)}
          fields={PO_FIELDS}
          emptyItem={E_PO}
          addLabel="Add Outcome"
        />
      </SectionAccordion>
    </>
  );

  const AcademicsBody = (
    <>
      <SectionAccordion
        title="Curriculum (Regulations, Semesters & Subjects)"
        empty={isEmpty.curriculum}
      >
        <CurriculumEditor
          value={
            (content.curriculum as CurriculumRegulation[] | undefined) ?? []
          }
          onChange={(v) => set("curriculum", v)}
        />
      </SectionAccordion>

      <SectionAccordion
        title="Teaching & Learning"
        empty={isEmpty.teachingLearning}
      >
        <TextArea
          label="Overview"
          value={String(flatObj(content, "teachingLearning").overview ?? "")}
          onChange={(e) =>
            setObj("teachingLearning", "overview", e.target.value)
          }
          rows={3}
        />
        <div className="mt-3 grid grid-cols-3 gap-4">
          <StringList
            label="Teaching Methods"
            values={
              (flatObj(content, "teachingLearning").methods as string[]) ?? []
            }
            onChange={(v) => setObj("teachingLearning", "methods", v)}
            placeholder="e.g. Problem-based learning"
          />
          <StringList
            label="Tools & Technologies"
            values={
              (flatObj(content, "teachingLearning").tools as string[]) ?? []
            }
            onChange={(v) => setObj("teachingLearning", "tools", v)}
            placeholder="e.g. MATLAB"
          />
          <StringList
            label="Best Practices"
            values={
              (flatObj(content, "teachingLearning").practices as string[]) ?? []
            }
            onChange={(v) => setObj("teachingLearning", "practices", v)}
            placeholder="e.g. Flipped classroom"
          />
        </div>
      </SectionAccordion>

      <SectionAccordion
        title="Value-Added Courses"
        empty={isEmpty.valueAddedCourses}
      >
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "valueAddedCourses")}
          onChange={(v) => set("valueAddedCourses", v)}
          fields={VAC_FIELDS}
          emptyItem={E_VAC}
          addLabel="Add Course"
        />
      </SectionAccordion>
    </>
  );

  const FacultyBody = (
    <>
      <SectionAccordion title="Core Faculty" empty={isEmpty.faculty}>
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "faculty")}
          onChange={(v) => set("faculty", v)}
          fields={FACULTY_FIELDS}
          emptyItem={E_FACULTY}
          addLabel="Add Faculty Member"
        />
      </SectionAccordion>

      <SectionAccordion
        title="Department Advisory Board (DAB)"
        empty={isEmpty.advisoryBoard}
      >
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "advisoryBoard")}
          onChange={(v) => set("advisoryBoard", v)}
          fields={BOARD_FIELDS}
          emptyItem={E_BOARD}
          addLabel="Add DAB Member"
        />
      </SectionAccordion>

      <SectionAccordion
        title="Program Assessment Committee (PAC)"
        empty={isEmpty.pac}
      >
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "pac")}
          onChange={(v) => set("pac", v)}
          fields={BOARD_FIELDS}
          emptyItem={E_BOARD}
          addLabel="Add PAC Member"
        />
      </SectionAccordion>

      <SectionAccordion title="Board of Studies (BOS)" empty={isEmpty.bos}>
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "bos")}
          onChange={(v) => set("bos", v)}
          fields={BOARD_FIELDS}
          emptyItem={E_BOARD}
          addLabel="Add BOS Member"
        />
      </SectionAccordion>
    </>
  );

  const FacilitiesBody = (
    <>
      <SectionAccordion title="Laboratories & Workspaces" empty={isEmpty.labs}>
        <LabsEditor
          labs={(content.labs as LabItem[] | undefined) ?? []}
          onChange={(v) => set("labs", v)}
        />
      </SectionAccordion>

      <SectionAccordion title="Department Library" empty={isEmpty.library}>
        <TextArea
          label="Description"
          value={String(flatObj(content, "library").description ?? "")}
          onChange={(e) => setObj("library", "description", e.target.value)}
          rows={3}
        />
        <div className="mt-3 grid grid-cols-3 gap-4">
          <NumberInput
            label="Books / Volumes"
            value={Number(flatObj(content, "library").books ?? 0)}
            min={0}
            onChange={(e) => setObj("library", "books", Number(e.target.value))}
          />
          <NumberInput
            label="Journals"
            value={Number(flatObj(content, "library").journals ?? 0)}
            min={0}
            onChange={(e) =>
              setObj("library", "journals", Number(e.target.value))
            }
          />
          <NumberInput
            label="Magazines"
            value={Number(flatObj(content, "library").magazines ?? 0)}
            min={0}
            onChange={(e) =>
              setObj("library", "magazines", Number(e.target.value))
            }
          />
        </div>
        <div className="mt-3">
          <StringList
            label="Digital Access / Online Resources"
            values={
              (flatObj(content, "library").digitalAccess as string[]) ?? []
            }
            onChange={(v) => setObj("library", "digitalAccess", v)}
            placeholder="e.g. IEEE Xplore"
          />
        </div>
      </SectionAccordion>
    </>
  );

  const LifeBody = (
    <>
      <SectionAccordion title="Events Organised" empty={isEmpty.events}>
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "events")}
          onChange={(v) => set("events", v)}
          fields={EVENT_FIELDS}
          emptyItem={E_EVENT}
          addLabel="Add Event"
        />
      </SectionAccordion>

      <SectionAccordion
        title="Student Achievements"
        empty={isEmpty.studentAchievements}
      >
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(
            content,
            "studentAchievements",
          )}
          onChange={(v) => set("studentAchievements", v)}
          fields={ACHIEV_FIELDS}
          emptyItem={E_ACHIEV}
          addLabel="Add Achievement"
        />
      </SectionAccordion>

      <SectionAccordion
        title="Faculty Achievements"
        empty={isEmpty.facultyAchievements}
      >
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(
            content,
            "facultyAchievements",
          )}
          onChange={(v) => set("facultyAchievements", v)}
          fields={ACHIEV_FIELDS}
          emptyItem={E_ACHIEV}
          addLabel="Add Achievement"
        />
      </SectionAccordion>

      <SectionAccordion title="Newsletter / Magazine" empty={isEmpty.magazine}>
        <div className="grid grid-cols-3 gap-4">
          <TextInput
            label="Name"
            value={String(flatObj(content, "magazine").name ?? "")}
            onChange={(e) => setObj("magazine", "name", e.target.value)}
          />
          <TextInput
            label="Frequency"
            value={String(flatObj(content, "magazine").frequency ?? "")}
            onChange={(e) => setObj("magazine", "frequency", e.target.value)}
            placeholder="Annual / Bi-annual"
          />
          <TextInput
            label="Latest Issue"
            value={String(flatObj(content, "magazine").latestIssue ?? "")}
            onChange={(e) => setObj("magazine", "latestIssue", e.target.value)}
            placeholder="Vol. 5, 2024"
          />
        </div>
        <TextArea
          label="Description"
          value={String(flatObj(content, "magazine").description ?? "")}
          onChange={(e) => setObj("magazine", "description", e.target.value)}
          rows={2}
        />
        <StringList
          label="Highlights"
          values={(flatObj(content, "magazine").highlights as string[]) ?? []}
          onChange={(v) => setObj("magazine", "highlights", v)}
          placeholder="e.g. Student research articles"
        />
      </SectionAccordion>

      <SectionAccordion
        title="Student Clubs & Participation"
        empty={isEmpty.studentParticipation}
      >
        <StringList
          label="Clubs"
          values={
            (flatObj(content, "studentParticipation").clubs as string[]) ?? []
          }
          onChange={(v) => setObj("studentParticipation", "clubs", v)}
          placeholder="e.g. IEEE Student Chapter"
        />
        <div className="mt-3">
          <p className="admin-label mb-2">Highlights</p>
          <ItemsEditor
            items={
              (flatObj(content, "studentParticipation").highlights as Record<
                string,
                unknown
              >[]) ?? []
            }
            onChange={(v) => setObj("studentParticipation", "highlights", v)}
            fields={SP_HL_FIELDS}
            emptyItem={E_SP_HL}
            addLabel="Add Highlight"
          />
        </div>
      </SectionAccordion>

      <SectionAccordion
        title="Faculty Participation"
        empty={isEmpty.facultyParticipation}
      >
        <StringList
          label="Workshops Attended"
          values={
            (flatObj(content, "facultyParticipation").workshops as string[]) ??
            []
          }
          onChange={(v) => setObj("facultyParticipation", "workshops", v)}
          placeholder="e.g. AI Workshop, IIT Madras"
        />
        <div className="mt-3">
          <p className="admin-label mb-2">Conferences</p>
          <ItemsEditor
            items={
              (flatObj(content, "facultyParticipation").conferences as Record<
                string,
                unknown
              >[]) ?? []
            }
            onChange={(v) => setObj("facultyParticipation", "conferences", v)}
            fields={FP_CONF_FIELDS}
            emptyItem={E_FP_CONF}
            addLabel="Add Conference"
          />
        </div>
      </SectionAccordion>
    </>
  );

  const CareerBody = (
    <>
      <SectionAccordion
        title="Career Progression"
        empty={isEmpty.careerProgression}
      >
        <div className="grid grid-cols-3 gap-4">
          <TextInput
            label="Placement Rate"
            value={flatStr(
              content,
              "placementRate",
              "careerProgression.placementRate",
            )}
            onChange={(e) => set("placementRate", e.target.value)}
            placeholder="98%"
          />
          <TextInput
            label="Average Package"
            value={flatStr(
              content,
              "averagePackage",
              "careerProgression.averagePackage",
            )}
            onChange={(e) => set("averagePackage", e.target.value)}
            placeholder="9 LPA"
          />
          <TextInput
            label="Highest Package"
            value={flatStr(
              content,
              "highestPackage",
              "careerProgression.highestPackage",
            )}
            onChange={(e) => set("highestPackage", e.target.value)}
            placeholder="70 LPA"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <StringList
            label="Top Recruiters"
            values={flatArr<string>(
              content,
              "topRecruiters",
              "careerProgression.topRecruiters",
            )}
            onChange={(v) => set("topRecruiters", v)}
            placeholder="e.g. TCS, Infosys"
          />
          <StringList
            label="Higher Studies Paths"
            values={flatArr<string>(
              content,
              "higherStudies",
              "careerProgression.higherStudies",
            )}
            onChange={(v) => set("higherStudies", v)}
            placeholder="e.g. M.E. / M.Tech."
          />
        </div>
      </SectionAccordion>

      <SectionAccordion
        title="Feedback & Improvements"
        empty={isEmpty.feedback}
      >
        <div className="grid grid-cols-3 gap-6">
          <StringList
            label="Curriculum Feedback Process"
            values={
              (flatObj(content, "feedback").curriculumProcess as string[]) ?? []
            }
            onChange={(v) => setObj("feedback", "curriculumProcess", v)}
            placeholder="e.g. Annual student survey"
          />
          <StringList
            label="Facility Feedback Process"
            values={
              (flatObj(content, "feedback").facilityProcess as string[]) ?? []
            }
            onChange={(v) => setObj("feedback", "facilityProcess", v)}
            placeholder="e.g. Lab usage review"
          />
          <StringList
            label="Recent Improvements"
            values={
              (flatObj(content, "feedback").recentImprovements as string[]) ??
              []
            }
            onChange={(v) => setObj("feedback", "recentImprovements", v)}
            placeholder="e.g. Added new lab equipment"
          />
        </div>
      </SectionAccordion>
    </>
  );

  const BODIES: Record<TabId, React.ReactNode> = {
    overview: OverviewBody,
    academics: AcademicsBody,
    faculty: FacultyBody,
    facilities: FacilitiesBody,
    life: LifeBody,
    career: CareerBody,
  };

  const customTabs = (content.tabs as CustomTab[] | undefined) ?? [];

  return (
    <div className="space-y-4">
      {/* ── Page Settings (above tabs) ─────────────────────────────────── */}
      <Accordion title="Page Settings" defaultOpen>
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Slug"
            value={String(content.slug ?? "")}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="cse"
          />
          <div>
            <label className="admin-label">College</label>
            <select
              className="admin-select"
              value={String(content.college ?? "")}
              onChange={(e) => set("college", e.target.value)}
            >
              <option value="">Select college</option>
              <option value="engineering">Engineering</option>
              <option value="arts-science">Arts & Science</option>
              <option value="polytechnic">Polytechnic</option>
            </select>
          </div>
          <TextInput
            label="Department Name"
            value={String(content.name ?? "")}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Computer Science & Engineering"
          />
          <TextInput
            label="Short Name"
            value={String(content.shortName ?? "")}
            onChange={(e) => set("shortName", e.target.value)}
            placeholder="CSE"
          />
          <ImageUploadInput
            label="Hero Image"
            value={String(content.heroImage ?? "")}
            onChange={(url) => set("heroImage", url)}
            uploadOnly
          />
          <TextInput
            label="Accent Color"
            value={String(content.accentColor ?? "")}
            onChange={(e) => set("accentColor", e.target.value)}
            placeholder="#0F4C81"
          />
          <TextInput
            label="Degree Prefix"
            value={String(content.degreePrefix ?? "")}
            onChange={(e) => set("degreePrefix", e.target.value)}
            placeholder="B.E/B.Tech "
            hint="Prepended to the name in the hero. Include a trailing space."
          />
        </div>
        <div className="mt-4">
          <p className="admin-label mb-2">Hero Meta Pills</p>
          <p className="mb-2 text-xs text-gray-400">
            Shown under the title. When empty, the page falls back to Duration /
            Affiliation / Accreditation from Quick Stats.
          </p>
          <ItemsEditor
            items={flatArr<Record<string, unknown>>(content, "heroMeta")}
            onChange={(v) => set("heroMeta", v)}
            fields={HERO_META_FIELDS}
            emptyItem={E_HERO_META as unknown as Record<string, unknown>}
            addLabel="Add Pill"
          />
        </div>
      </Accordion>

      {/* ── Tab strip ─────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-2 py-2">
          <div className="flex flex-wrap gap-1">
            {TAB_IDS.map((id) => {
              const Icon = TAB_ICONS[id];
              const active = id === activeTab;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition " +
                    (active
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100")
                  }
                >
                  <Icon size={15} />
                  {TAB_LABELS[id]}
                </button>
              );
            })}
          </div>
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              Preview public page
              <ExternalLink size={12} />
            </a>
          )}
        </div>
        <div className="p-4">{BODIES[activeTab]}</div>
      </div>

      {/* ── Page Layout (collapsed) ───────────────────────────────────── */}
      <Accordion title="Page Layout (Sidebar tabs & section labels)">
        <p className="mb-3 text-xs text-gray-500">
          Override the six sidebar tab labels / icons / visibility and the
          per-section titles & column headers used on the public page.
        </p>
        <p className="admin-label mb-2">Sidebar Tab Overrides</p>
        <ItemsEditor
          items={flatArr<Record<string, unknown>>(content, "tabsConfig")}
          onChange={(v) => set("tabsConfig", v)}
          fields={TAB_CONFIG_FIELDS}
          emptyItem={E_TAB_CONFIG as unknown as Record<string, unknown>}
          addLabel="Add Tab Override"
        />
        <button
          type="button"
          onClick={() => set("tabsConfig", [])}
          className="admin-btn admin-btn-outline admin-btn-sm mt-2"
        >
          Reset to default 6 tabs
        </button>
        <div className="mt-6">
          <ProgramLabelsEditor
            value={(content.labels as LabelsTree | undefined) ?? undefined}
            onChange={(next) => set("labels", next)}
          />
        </div>
      </Accordion>

      {/* ── Advanced (collapsed) ──────────────────────────────────────── */}
      <Accordion title="Advanced">
        <p className="mb-3 text-xs text-gray-500">
          Custom tabs override the structured fields above on the public page.
          Use these only if the standard six-tab layout is insufficient.
        </p>
        <p className="admin-label mb-2">Custom Page Tabs</p>
        <ProgramTabsEditor
          tabs={customTabs}
          onChange={(next) => set("tabs", next)}
        />
        <div className="mt-6">
          <p className="admin-label mb-2">Raw JSON</p>
          <p className="mb-2 text-xs text-gray-400">
            Full department content as JSON. Editing this overwrites all fields
            above on save.
          </p>
          <textarea
            className="admin-textarea font-mono text-xs"
            rows={20}
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                /* ignore invalid JSON while typing */
              }
            }}
          />
        </div>
      </Accordion>
    </div>
  );
}

// ─── Section accordion w/ empty-state pill ──────────────────────────────────

function SectionAccordion({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  const label = (
    <span className="flex items-center gap-2">
      {title}
      {empty && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-400 uppercase">
          empty
        </span>
      )}
    </span>
  );
  return (
    <Accordion title={label} defaultOpen>
      {children}
    </Accordion>
  );
}
