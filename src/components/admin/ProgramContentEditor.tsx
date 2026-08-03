"use client";

import {
  Field,
  FormGrid,
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
import { PageBodySectionsEditor } from "@/components/admin/PageBodySectionsEditor";
import { SeoFields } from "@/components/admin/SeoFields";
import type { PageBodySection } from "@/lib/validation";
import type { HeroMetaItem, TabConfigItem } from "@/types/program";

// ─── Field schemas reused across sections ───────────────────────────────────

const PO_FIELDS: FieldDef[] = [
  { key: "code", label: "Code", placeholder: "PO1", span: 3 },
  { key: "title", label: "Title", span: 9 },
  { key: "description", label: "Description", type: "textarea", span: "full" },
];
const E_PO = { code: "", title: "", description: "" };

const FACULTY_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", span: 4 },
  { key: "designation", label: "Designation", span: 4 },
  { key: "qualification", label: "Qualification", span: 4 },
  { key: "experience", label: "Experience", placeholder: "10+ years", span: 3 },
  { key: "specialization", label: "Specialization", span: 5 },
  { key: "email", label: "Email", span: 4 },
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
  { key: "name", label: "Name", span: 3 },
  { key: "designation", label: "Designation", span: 3 },
  { key: "organization", label: "Organization", span: 3 },
  { key: "role", label: "Role", span: 3 },
];
const E_BOARD = { name: "", designation: "", organization: "", role: "" };

const EVENT_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", span: 5 },
  { key: "date", label: "Date", placeholder: "YYYY-MM-DD", span: 3 },
  {
    key: "type",
    label: "Type",
    placeholder: "Workshop / Conference…",
    span: 4,
  },
  { key: "description", label: "Description", type: "textarea", span: 8 },
  { key: "resourcePerson", label: "Resource Person", span: 4 },
];
const E_EVENT = {
  title: "",
  date: "",
  type: "",
  description: "",
  resourcePerson: "",
};

const ACHIEV_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", span: 4 },
  { key: "title", label: "Achievement Title", span: 6 },
  { key: "year", label: "Year", span: 2 },
  { key: "detail", label: "Detail", type: "textarea", span: "full" },
];
const E_ACHIEV = { name: "", title: "", detail: "", year: "" };

const VAC_FIELDS: FieldDef[] = [
  { key: "name", label: "Course Name", span: 5 },
  { key: "hours", label: "Hours", placeholder: "30 Hours", span: 3 },
  { key: "provider", label: "Provider", span: 4 },
  { key: "description", label: "Description", type: "textarea", span: "full" },
];
const E_VAC = { name: "", hours: "", provider: "", description: "" };

const SP_HL_FIELDS: FieldDef[] = [
  { key: "title", label: "Event / Activity", span: 8 },
  { key: "year", label: "Year", placeholder: "2024", span: 4 },
  { key: "description", label: "Description", type: "textarea", span: "full" },
];
const E_SP_HL = { title: "", year: "", description: "" };

const FP_CONF_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", span: 6 },
  { key: "faculty", label: "Faculty", span: 6 },
  { key: "venue", label: "Venue", span: 8 },
  { key: "year", label: "Year", span: 4 },
];
const E_FP_CONF = { title: "", faculty: "", venue: "", year: "" };

const HERO_META_FIELDS: FieldDef[] = [
  { key: "icon", label: "Icon (optional)", placeholder: "calendar", span: 4 },
  { key: "label", label: "Label", placeholder: "Duration", span: 8 },
  { key: "value", label: "Value", placeholder: "4 Years", span: "full" },
];
const E_HERO_META: HeroMetaItem = { icon: "", label: "", value: "" };

// Badge logos overlaid on the public program cards. Uploads land in R2 like
// every other image — they are no longer static files under /public.
const ACCREDITATION_FIELDS: FieldDef[] = [
  {
    key: "name",
    label: "Label (alt text)",
    placeholder: "AICTE",
    span: "full",
  },
  { key: "logo", label: "Logo", type: "image", span: "full" },
];
const E_ACCREDITATION = { name: "", logo: "" };

const TAB_CONFIG_FIELDS: FieldDef[] = [
  { key: "id", label: "Tab id", placeholder: "overview", span: 4 },
  { key: "label", label: "Label", placeholder: "Overview", span: 4 },
  { key: "icon", label: "Icon (optional)", placeholder: "bookOpen", span: 4 },
  {
    key: "href",
    label: "Custom URL (optional)",
    placeholder: "/path or https://… — turns this entry into a sidebar link",
    span: "full",
  },
];
const E_TAB_CONFIG: TabConfigItem = { id: "", label: "", icon: "", href: "" };

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
  | "feedback"
  | "tabs"
  | "seo";

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
  tabs: "Sidebar tabs",
  seo: "SEO / Meta tags",
};

/** Card-level display fields rendered on the public program cards. */
export interface ProgramCardExtras {
  degree: string;
  duration: string;
  seats: number;
  highlight: string;
  description: string;
  accreditations: { name: string; logo: string }[];
}

export function ProgramSectionInspector({
  section,
  content,
  onChange,
  programName,
  onProgramNameChange,
  programAbbr,
  onProgramAbbrChange,
  programSlug,
  onProgramSlugChange,
  programCollege,
  programCard,
  onProgramCardChange,
}: {
  section: string;
  content: RawContent;
  onChange: (next: RawContent) => void;
  programName?: string;
  onProgramNameChange?: (name: string) => void;
  programAbbr?: string;
  onProgramAbbrChange?: (abbr: string) => void;
  programSlug?: string;
  onProgramSlugChange?: (slug: string) => void;
  /** Institution slug — only used to build the SEO preview URL. */
  programCollege?: string;
  programCard?: ProgramCardExtras;
  onProgramCardChange?: (patch: Partial<ProgramCardExtras>) => void;
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

  // Custom content tab: edit its label + content blocks (stored on tabsConfig).
  if (section.startsWith("tab:")) {
    const tabId = section.slice("tab:".length);
    const tabs = Array.isArray(content.tabsConfig)
      ? (content.tabsConfig as Array<Record<string, unknown>>)
      : [];
    const idx = tabs.findIndex((t) => (t.id as string) === tabId);
    if (idx === -1) {
      return (
        <p className="text-sm text-gray-500">
          This tab no longer exists. Re-open the inspector.
        </p>
      );
    }
    const tab = tabs[idx];
    const updateTab = (next: Record<string, unknown>) =>
      set(
        "tabsConfig",
        tabs.map((t, j) => (j === idx ? { ...t, ...next } : t)),
      );
    return (
      <FormGrid>
        <TextInput
          label="Tab Label"
          span={5}
          value={(tab.label as string) ?? ""}
          placeholder="Name shown in the sidebar"
          onChange={(e) => updateTab({ label: e.target.value })}
        />
        <Field label="Content Blocks" span="full">
          <PageBodySectionsEditor
            value={(tab.blocks ?? []) as PageBodySection[]}
            onChange={(blocks) => updateTab({ blocks })}
            allowedTypes={["heading", "text", "image", "list", "cards"]}
          />
        </Field>
      </FormGrid>
    );
  }

  const sectionBody = (() => {
    switch (section) {
      case "hero":
        // Identity, then the card fields, then the hero image and pill strip.
        return (
          <FormGrid>
            <TextInput
              label="Program Name"
              span={5}
              value={
                onProgramNameChange
                  ? (programName ?? "")
                  : String(content.name ?? "")
              }
              onChange={(e) =>
                onProgramNameChange
                  ? onProgramNameChange(e.target.value)
                  : set("name", e.target.value)
              }
            />
            <TextInput
              label="Abbreviation"
              span={3}
              value={
                onProgramAbbrChange
                  ? (programAbbr ?? "")
                  : String(content.abbr ?? "")
              }
              onChange={(e) =>
                onProgramAbbrChange
                  ? onProgramAbbrChange(e.target.value)
                  : set("abbr", e.target.value)
              }
              placeholder="e.g., CSE, ECE"
            />
            <TextInput
              label="Slug"
              span={4}
              value={
                onProgramSlugChange
                  ? (programSlug ?? "")
                  : String(content.slug ?? "")
              }
              onChange={(e) =>
                onProgramSlugChange
                  ? onProgramSlugChange(e.target.value)
                  : set("slug", e.target.value)
              }
              placeholder="e.g., computer-science"
            />
            {programCard && onProgramCardChange && (
              <>
                <TextInput
                  label="Degree"
                  span={4}
                  value={programCard.degree}
                  onChange={(e) =>
                    onProgramCardChange({ degree: e.target.value })
                  }
                  placeholder="e.g., B.E, B.Sc, M.Tech, Diploma"
                  hint="Prefixes the hero title and shows on program cards; also splits UG/PG listings."
                />
                <TextInput
                  label="Duration"
                  span={3}
                  value={programCard.duration}
                  onChange={(e) =>
                    onProgramCardChange({ duration: e.target.value })
                  }
                  placeholder="e.g., 4 Years"
                  hint="Fills the hero's Duration pill unless a custom pill overrides it."
                />
                <NumberInput
                  label="Seats"
                  span={2}
                  value={programCard.seats || ""}
                  min={0}
                  onChange={(e) =>
                    onProgramCardChange({
                      seats: Math.max(0, parseInt(e.target.value, 10) || 0),
                    })
                  }
                  placeholder="e.g., 60"
                  hint="Also drives the Annual Intake stat and hero pill."
                />
                <TextInput
                  label="Card Highlight"
                  span={3}
                  value={programCard.highlight}
                  onChange={(e) =>
                    onProgramCardChange({ highlight: e.target.value })
                  }
                  placeholder="e.g., NBA Accredited"
                />
                <TextArea
                  label="Card Description"
                  span="full"
                  value={programCard.description}
                  rows={2}
                  onChange={(e) =>
                    onProgramCardChange({ description: e.target.value })
                  }
                  placeholder="Short summary shown on the program card"
                />
                <Field
                  label="Accreditation Badges"
                  span="full"
                  hint="Logos shown over the program card image on the listing pages."
                >
                  <ItemsEditor
                    items={
                      (programCard.accreditations ?? []) as unknown as Record<
                        string,
                        unknown
                      >[]
                    }
                    onChange={(v) =>
                      onProgramCardChange({
                        accreditations:
                          v as unknown as ProgramCardExtras["accreditations"],
                      })
                    }
                    fields={ACCREDITATION_FIELDS}
                    emptyItem={E_ACCREDITATION}
                    addLabel="Add Badge"
                    cardSpan={6}
                  />
                </Field>
              </>
            )}
            <ImageUploadInput
              label="Hero Image"
              span="full"
              ratio="hero"
              value={String(content.heroImage ?? "")}
              onChange={(url) => set("heroImage", url)}
              hideUrlField
            />
            {/* Both fall back to a per-college default in the renderer when
                left blank — until now there was no way to set them at all. */}
            <TextInput
              label="Hero Background Colour"
              span={6}
              value={String(content.bgColor ?? "")}
              onChange={(e) => set("bgColor", e.target.value)}
              placeholder="#0F172A — blank uses the college default"
            />
            <TextInput
              label="Accent Colour"
              span={6}
              value={String(content.accentColor ?? "")}
              onChange={(e) => set("accentColor", e.target.value)}
              placeholder="#FFC917 — blank uses the college default"
            />
            <Field
              label="Extra Hero Pills"
              span="full"
              hint="Degree, Duration, Intake, Affiliation and Accreditation are added automatically from the fields above and the Quick stats section — list only additional pills here."
            >
              <ItemsEditor
                items={flatArr<Record<string, unknown>>(content, "heroMeta")}
                onChange={(v) => set("heroMeta", v)}
                fields={HERO_META_FIELDS}
                emptyItem={E_HERO_META as unknown as Record<string, unknown>}
                addLabel="Add Pill"
                cardSpan={4}
              />
            </Field>
          </FormGrid>
        );
      case "stats":
        // Annual Intake is deliberately absent: it reads the card's "Seats",
        // edited in the Hero section. Two fields writing one stat meant the
        // one you happened to edit was often the one being ignored.
        return (
          <FormGrid>
            <TextInput
              label="Established"
              span={4}
              value={flatStr(content, "established", "about.established")}
              onChange={(e) => set("established", e.target.value)}
            />
            <TextInput
              label="Accreditation"
              span={4}
              value={flatStr(content, "accreditation", "about.accreditation")}
              onChange={(e) => set("accreditation", e.target.value)}
            />
            <TextInput
              label="Affiliation"
              span={4}
              value={flatStr(content, "affiliation", "about.affiliation")}
              onChange={(e) => set("affiliation", e.target.value)}
            />
          </FormGrid>
        );
      case "about":
        return (
          <FormGrid>
            {[1, 2, 3].map((idx) => (
              <TextArea
                key={idx}
                label={`Paragraph ${idx}`}
                span={4}
                value={readAboutParagraph(content, idx as 1 | 2 | 3)}
                onChange={(e) => set(`about${idx}`, e.target.value)}
                rows={6}
              />
            ))}
          </FormGrid>
        );
      case "hod":
        return (
          <FormGrid>
            <TextInput
              label="HOD Name"
              span={6}
              value={flatStr(content, "hodName", "hod.name")}
              onChange={(e) => set("hodName", e.target.value)}
            />
            <TextInput
              label="Designation"
              span={6}
              value={flatStr(content, "hodDesignation", "hod.designation")}
              onChange={(e) => set("hodDesignation", e.target.value)}
            />
            <TextInput
              label="Qualification"
              span={6}
              value={flatStr(content, "hodQualification", "hod.qualification")}
              onChange={(e) => set("hodQualification", e.target.value)}
            />
            <TextInput
              label="Experience"
              span={6}
              value={flatStr(content, "hodExperience", "hod.experience")}
              onChange={(e) => set("hodExperience", e.target.value)}
            />
            <ImageUploadInput
              label="Photo"
              span={5}
              ratio="portrait"
              value={flatStr(content, "hodPhoto", "hod.photo")}
              onChange={(url) => set("hodPhoto", url)}
              hideUrlField
            />
            <TextArea
              label="HOD Message"
              span={7}
              value={flatMultilineStr(content, "hodMessage", "hod.message")}
              onChange={(e) => set("hodMessage", e.target.value)}
              rows={6}
            />
          </FormGrid>
        );
      case "visionMission":
        return (
          <FormGrid>
            <TextArea
              label="Vision"
              span={5}
              value={flatStr(content, "vision", "visionMission.vision")}
              onChange={(e) => set("vision", e.target.value)}
              rows={5}
            />
            <TextArea
              label="Mission (one point per line)"
              span={7}
              value={flatMultilineStr(
                content,
                "mission",
                "visionMission.mission",
              )}
              onChange={(e) => set("mission", e.target.value)}
              rows={5}
            />
          </FormGrid>
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
          <FormGrid>
            <TextArea
              label="Overview"
              span="full"
              value={String(
                flatObj(content, "teachingLearning").overview ?? "",
              )}
              onChange={(e) =>
                setObj("teachingLearning", "overview", e.target.value)
              }
              rows={2}
            />
            <StringList
              label="Teaching Methods"
              span={4}
              values={
                (flatObj(content, "teachingLearning").methods as string[]) ?? []
              }
              onChange={(v) => setObj("teachingLearning", "methods", v)}
            />
            <StringList
              label="Tools & Technologies"
              span={4}
              values={
                (flatObj(content, "teachingLearning").tools as string[]) ?? []
              }
              onChange={(v) => setObj("teachingLearning", "tools", v)}
            />
            <StringList
              label="Best Practices"
              span={4}
              values={
                (flatObj(content, "teachingLearning").practices as string[]) ??
                []
              }
              onChange={(v) => setObj("teachingLearning", "practices", v)}
            />
          </FormGrid>
        );
      case "valueAddedCourses":
        return (
          <ItemsEditor
            items={flatArr<Record<string, unknown>>(
              content,
              "valueAddedCourses",
            )}
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
          <FormGrid>
            <TextArea
              label="Description"
              span={6}
              value={String(flatObj(content, "library").description ?? "")}
              onChange={(e) => setObj("library", "description", e.target.value)}
              rows={3}
            />
            <NumberInput
              label="Books / Volumes"
              span={2}
              value={Number(flatObj(content, "library").books ?? 0)}
              min={0}
              onChange={(e) =>
                setObj("library", "books", Number(e.target.value))
              }
            />
            <NumberInput
              label="Journals"
              span={2}
              value={Number(flatObj(content, "library").journals ?? 0)}
              min={0}
              onChange={(e) =>
                setObj("library", "journals", Number(e.target.value))
              }
            />
            <NumberInput
              label="Magazines"
              span={2}
              value={Number(flatObj(content, "library").magazines ?? 0)}
              min={0}
              onChange={(e) =>
                setObj("library", "magazines", Number(e.target.value))
              }
            />
            <StringList
              label="Digital Access / Online Resources"
              span="full"
              columns
              values={
                (flatObj(content, "library").digitalAccess as string[]) ?? []
              }
              onChange={(v) => setObj("library", "digitalAccess", v)}
            />
          </FormGrid>
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
          <FormGrid>
            <TextInput
              label="Name"
              span={4}
              value={String(flatObj(content, "magazine").name ?? "")}
              onChange={(e) => setObj("magazine", "name", e.target.value)}
            />
            <TextInput
              label="Frequency"
              span={4}
              value={String(flatObj(content, "magazine").frequency ?? "")}
              onChange={(e) => setObj("magazine", "frequency", e.target.value)}
            />
            <TextInput
              label="Latest Issue"
              span={4}
              value={String(flatObj(content, "magazine").latestIssue ?? "")}
              onChange={(e) =>
                setObj("magazine", "latestIssue", e.target.value)
              }
            />
            <TextArea
              label="Description"
              span={5}
              value={String(flatObj(content, "magazine").description ?? "")}
              onChange={(e) =>
                setObj("magazine", "description", e.target.value)
              }
              rows={4}
            />
            <StringList
              label="Highlights"
              span={7}
              values={
                (flatObj(content, "magazine").highlights as string[]) ?? []
              }
              onChange={(v) => setObj("magazine", "highlights", v)}
            />
          </FormGrid>
        );
      case "participation":
        return (
          <FormGrid>
            <StringList
              label="Student Clubs"
              span={6}
              values={
                (flatObj(content, "studentParticipation").clubs as string[]) ??
                []
              }
              onChange={(v) => setObj("studentParticipation", "clubs", v)}
            />
            <StringList
              label="Faculty Workshops"
              span={6}
              values={
                (flatObj(content, "facultyParticipation")
                  .workshops as string[]) ?? []
              }
              onChange={(v) => setObj("facultyParticipation", "workshops", v)}
            />
            <Field label="Student Highlights" span={6}>
              <ItemsEditor
                items={
                  (flatObj(content, "studentParticipation")
                    .highlights as Record<string, unknown>[]) ?? []
                }
                onChange={(v) =>
                  setObj("studentParticipation", "highlights", v)
                }
                fields={SP_HL_FIELDS}
                emptyItem={E_SP_HL}
                addLabel="Add Highlight"
              />
            </Field>
            <Field label="Faculty Conferences" span={6}>
              <ItemsEditor
                items={
                  (flatObj(content, "facultyParticipation")
                    .conferences as Record<string, unknown>[]) ?? []
                }
                onChange={(v) =>
                  setObj("facultyParticipation", "conferences", v)
                }
                fields={FP_CONF_FIELDS}
                emptyItem={E_FP_CONF}
                addLabel="Add Conference"
              />
            </Field>
          </FormGrid>
        );
      case "careerProgression":
        return (
          <FormGrid>
            <TextInput
              label="Placement Rate"
              span={4}
              value={flatStr(
                content,
                "placementRate",
                "careerProgression.placementRate",
              )}
              onChange={(e) => set("placementRate", e.target.value)}
            />
            <TextInput
              label="Average Package"
              span={4}
              value={flatStr(
                content,
                "averagePackage",
                "careerProgression.averagePackage",
              )}
              onChange={(e) => set("averagePackage", e.target.value)}
            />
            <TextInput
              label="Highest Package"
              span={4}
              value={flatStr(
                content,
                "highestPackage",
                "careerProgression.highestPackage",
              )}
              onChange={(e) => set("highestPackage", e.target.value)}
            />
            <StringList
              label="Top Recruiters"
              span={6}
              values={flatArr<string>(
                content,
                "topRecruiters",
                "careerProgression.topRecruiters",
              )}
              onChange={(v) => set("topRecruiters", v)}
            />
            <StringList
              label="Higher Studies Paths"
              span={6}
              values={flatArr<string>(
                content,
                "higherStudies",
                "careerProgression.higherStudies",
              )}
              onChange={(v) => set("higherStudies", v)}
            />
          </FormGrid>
        );
      case "feedback":
        return (
          <FormGrid>
            <StringList
              label="Curriculum Feedback Process"
              span={4}
              values={
                (flatObj(content, "feedback").curriculumProcess as string[]) ??
                []
              }
              onChange={(v) => setObj("feedback", "curriculumProcess", v)}
            />
            <StringList
              label="Facility Feedback Process"
              span={4}
              values={
                (flatObj(content, "feedback").facilityProcess as string[]) ?? []
              }
              onChange={(v) => setObj("feedback", "facilityProcess", v)}
            />
            <StringList
              label="Recent Improvements"
              span={4}
              values={
                (flatObj(content, "feedback").recentImprovements as string[]) ??
                []
              }
              onChange={(v) => setObj("feedback", "recentImprovements", v)}
            />
          </FormGrid>
        );
      case "tabs":
        return (
          <>
            <p className="mb-3 text-xs text-gray-500">
              Reorder, rename, hide, or add custom sidebar entries. Set a Custom
              URL to turn any entry into a direct link. For a custom content
              tab, add an entry with a unique id and no URL, then click that tab
              in the preview to add its content blocks.
            </p>
            <ItemsEditor
              items={flatArr<Record<string, unknown>>(content, "tabsConfig")}
              onChange={(v) => set("tabsConfig", v)}
              fields={TAB_CONFIG_FIELDS}
              emptyItem={E_TAB_CONFIG as unknown as Record<string, unknown>}
              addLabel="Add Tab"
              cardSpan={6}
            />
            <button
              type="button"
              onClick={() => set("tabsConfig", [])}
              className="admin-btn admin-btn-outline admin-btn-sm mt-2"
            >
              Reset to default 6 tabs
            </button>
          </>
        );
      case "seo": {
        const seo = flatObj(content, "seo");
        return (
          <>
            <p className="mb-3 text-xs text-gray-500">
              The title and description search engines show for this
              program&apos;s public page. Leave blank to fall back to the
              program name and its first About paragraph. Publish the program
              for changes to go live.
            </p>
            <SeoFields
              title={String(seo.title ?? "")}
              description={String(seo.description ?? "")}
              path={
                programSlug
                  ? `/institutions/${programCollege ?? "engineering"}/programs/${programSlug}`
                  : undefined
              }
              onChange={(patch) => set("seo", { ...seo, ...patch })}
            />
          </>
        );
      }
    }
  })();

  // "hero" and "tabs" edit page chrome, and "seo" edits head tags — none of
  // them render a body section that extra blocks could attach to.
  const showBlocksEditor =
    section !== "hero" && section !== "tabs" && section !== "seo";

  return (
    <div className="space-y-6">
      {sectionBody}
      {showBlocksEditor && (
        <SectionBlocksEditor
          section={section}
          content={content}
          onChange={onChange}
        />
      )}
    </div>
  );
}

/**
 * Appended to every built-in section's inspector. Lets the admin add
 * free-form blocks (heading/text/image/list/cards/CTA) alongside a
 * section's structured fields — the same mechanism custom tabs use — and
 * choose whether they render before or after the section's fixed content.
 */
function SectionBlocksEditor({
  section,
  content,
  onChange,
}: {
  section: string;
  content: RawContent;
  onChange: (next: RawContent) => void;
}) {
  const allBlocks =
    (content.sectionBlocks as Record<string, PageBodySection[]> | undefined) ??
    {};
  const allPositions =
    (content.sectionBlocksPosition as
      Record<string, "before" | "after"> | undefined) ?? {};
  const blocks = allBlocks[section] ?? [];
  const position = allPositions[section] ?? "after";

  const setBlocks = (next: PageBodySection[]) =>
    onChange({
      ...content,
      sectionBlocks: { ...allBlocks, [section]: next },
    });

  const setPosition = (next: "before" | "after") =>
    onChange({
      ...content,
      sectionBlocksPosition: { ...allPositions, [section]: next },
    });

  return (
    <Accordion
      title={
        <span className="flex items-center gap-2">
          Additional Content Blocks
          {blocks.length > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-500">
              {blocks.length}
            </span>
          )}
        </span>
      }
      defaultOpen={blocks.length > 0}
    >
      <p className="mb-3 text-xs text-gray-500">
        Add extra paragraphs, images, lists, cards, or a call-to-action button
        alongside this section&apos;s fields above — the same block types
        available on custom tabs.
      </p>
      {blocks.length > 0 && (
        <div className="mb-3">
          <label
            className="admin-label mb-1 block"
            htmlFor={`blocks-position-${section}`}
          >
            Position
          </label>
          <select
            id={`blocks-position-${section}`}
            className="admin-select"
            value={position}
            onChange={(e) => setPosition(e.target.value as "before" | "after")}
          >
            <option value="after">After this section&apos;s content</option>
            <option value="before">Before this section&apos;s content</option>
          </select>
        </div>
      )}
      <PageBodySectionsEditor value={blocks} onChange={setBlocks} />
    </Accordion>
  );
}
