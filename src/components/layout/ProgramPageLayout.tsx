"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  Target,
  Award,
  Users,
  Clipboard,
  FileText,
  FlaskConical,
  Library,
  Calendar,
  Newspaper,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Star,
  Microscope,
  Quote,
  Trophy,
  Mail,
  Beaker,
  Briefcase,
  Layers,
  Info,
  BookMarked,
  Zap,
  Pencil,
} from "lucide-react";
import type {
  AcademicsLabels,
  CareerLabels,
  ProgramData,
  FacilitiesLabels,
  FacultyLabels,
  LifeLabels,
  OverviewLabels,
  TabConfigItem,
} from "@/types/program";
import { getImageUrl } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ─── Tab Definition ──────────────────────────────────────────────────────────

const KNOWN_TAB_IDS = [
  "overview",
  "academics",
  "faculty",
  "facilities",
  "life",
  "career",
] as const;

type TabId = (typeof KNOWN_TAB_IDS)[number];

const DEFAULT_TAB_ICONS: Record<TabId, ElementType> = {
  overview: BookOpen,
  academics: GraduationCap,
  faculty: Users,
  facilities: FlaskConical,
  life: Trophy,
  career: TrendingUp,
};

const DEFAULT_TAB_LABELS: Record<TabId, string> = {
  overview: "Overview",
  academics: "Academics",
  faculty: "Faculty & Council",
  facilities: "Facilities",
  life: "Life & Achievements",
  career: "Career & Feedback",
};

const DEFAULT_TABS: TabConfigItem[] = KNOWN_TAB_IDS.map((id) => ({
  id,
  label: DEFAULT_TAB_LABELS[id],
}));

const ICON_REGISTRY: Record<string, ElementType> = {
  bookOpen: BookOpen,
  graduationCap: GraduationCap,
  users: Users,
  flaskConical: FlaskConical,
  trophy: Trophy,
  trendingUp: TrendingUp,
  target: Target,
  award: Award,
  clipboard: Clipboard,
  fileText: FileText,
  library: Library,
  calendar: Calendar,
  newspaper: Newspaper,
  messageSquare: MessageSquare,
  star: Star,
  microscope: Microscope,
  mail: Mail,
  beaker: Beaker,
  briefcase: Briefcase,
  layers: Layers,
  info: Info,
  bookMarked: BookMarked,
  zap: Zap,
};

function iconFromName(name?: string): ElementType | undefined {
  if (!name) return undefined;
  return ICON_REGISTRY[name];
}

export type ProgramEditableSection =
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

const EDITABLE_SECTION_LABELS: Record<ProgramEditableSection, string> = {
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

type EditableSectionProps = {
  editable?: boolean;
  onEditSection?: (section: ProgramEditableSection) => void;
};

function EditableRegion({
  as = "section",
  section,
  editable,
  onEditSection,
  className = "",
  style,
  children,
}: EditableSectionProps & {
  as?: ElementType;
  section: ProgramEditableSection;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const Component = as;
  const handleSelect = () => {
    if (editable) onEditSection?.(section);
  };

  return (
    <Component
      className={`${className} ${
        editable
          ? "group/editable-region relative cursor-pointer rounded-2xl outline-2 outline-transparent transition hover:outline-yellow-400/80 hover:outline-dashed focus:outline-yellow-400/80 focus:outline-dashed"
          : ""
      }`}
      style={style}
      onClick={editable ? handleSelect : undefined}
      onKeyDown={
        editable
          ? (event: React.KeyboardEvent) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect();
              }
            }
          : undefined
      }
      role={editable ? "button" : undefined}
      tabIndex={editable ? 0 : undefined}
      data-edit-section={editable ? section : undefined}
      title={editable ? `Edit ${EDITABLE_SECTION_LABELS[section]}` : undefined}
    >
      {editable && (
        <span className="pointer-events-none absolute top-2 right-2 z-20 hidden items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black tracking-wider text-slate-950 uppercase shadow-sm group-hover/editable-region:inline-flex group-focus/editable-region:inline-flex">
          <Pencil className="h-3 w-3" />
          Edit
        </span>
      )}
      {children}
    </Component>
  );
}

// ─── Content predicates (used for empty-data hiding) ─────────────────────────

const hasText = (s?: string) => typeof s === "string" && s.trim().length > 0;
const hasArr = (a?: unknown[]) => Array.isArray(a) && a.length > 0;

function hasAboutStats(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasText(d.about.established) ||
    !!d.about.intake ||
    hasText(d.about.accreditation) ||
    hasText(d.about.affiliation)
  );
}
function hasAboutSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.about.paragraphs);
}
function hasHodSection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasText(d.hod.name) ||
    hasText(d.hod.designation) ||
    hasText(d.hod.qualification) ||
    hasText(d.hod.experience) ||
    hasArr(d.hod.message)
  );
}
function hasVisionMissionSection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasText(d.visionMission.vision) ||
    hasArr(d.visionMission.mission)
  );
}
function hasProgramOutcomesSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.programOutcomes);
}
function hasOverviewContent(
  d: ProgramData,
  l?: OverviewLabels,
  editable?: boolean,
) {
  const sec = (visible: boolean | undefined, predicate: boolean) =>
    visible !== false && predicate;
  return (
    editable ||
    sec(l?.stats?.visible, hasAboutStats(d)) ||
    sec(l?.about?.visible, hasAboutSection(d, editable)) ||
    sec(l?.hod?.visible, hasHodSection(d, editable)) ||
    sec(l?.visionMission?.visible, hasVisionMissionSection(d, editable)) ||
    sec(l?.programOutcomes?.visible, hasProgramOutcomesSection(d, editable))
  );
}

function hasCurriculumSection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    (hasArr(d.curriculum) && d.curriculum.some((r) => hasArr(r.semesters)))
  );
}
function hasTeachingLearningSection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasText(d.teachingLearning.overview) ||
    hasArr(d.teachingLearning.methods) ||
    hasArr(d.teachingLearning.tools) ||
    hasArr(d.teachingLearning.practices)
  );
}
function hasValueAddedSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.valueAddedCourses);
}
function hasAcademicsContent(
  d: ProgramData,
  l?: AcademicsLabels,
  editable?: boolean,
) {
  const sec = (visible: boolean | undefined, predicate: boolean) =>
    visible !== false && predicate;
  return (
    editable ||
    sec(l?.curriculum?.visible, hasCurriculumSection(d, editable)) ||
    sec(l?.teachingLearning?.visible, hasTeachingLearningSection(d, editable)) ||
    sec(l?.valueAddedCourses?.visible, hasValueAddedSection(d, editable))
  );
}

function hasCoreFacultySection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.faculty);
}
function hasAdvisorySection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.advisoryBoard);
}
function hasPacSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.pac);
}
function hasBosSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.bos);
}
function hasFacultyContent(
  d: ProgramData,
  l?: FacultyLabels,
  editable?: boolean,
) {
  const sec = (visible: boolean | undefined, predicate: boolean) =>
    visible !== false && predicate;
  return (
    editable ||
    sec(l?.coreFaculty?.visible, hasCoreFacultySection(d, editable)) ||
    sec(l?.advisoryBoard?.visible, hasAdvisorySection(d, editable)) ||
    sec(l?.pac?.visible, hasPacSection(d, editable)) ||
    sec(l?.bos?.visible, hasBosSection(d, editable))
  );
}

function hasLabsSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.labs);
}
function hasLibrarySection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasText(d.library.description) ||
    !!d.library.books ||
    !!d.library.journals ||
    !!d.library.magazines ||
    hasArr(d.library.digitalAccess)
  );
}
function hasFacilitiesContent(
  d: ProgramData,
  l?: FacilitiesLabels,
  editable?: boolean,
) {
  const sec = (visible: boolean | undefined, predicate: boolean) =>
    visible !== false && predicate;
  return (
    editable ||
    sec(l?.labs?.visible, hasLabsSection(d, editable)) ||
    sec(l?.library?.visible, hasLibrarySection(d, editable))
  );
}

function hasEventsSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.events);
}
function hasStudentAchievementsSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.studentAchievements);
}
function hasFacultyAchievementsSection(d: ProgramData, editable?: boolean) {
  return editable || hasArr(d.facultyAchievements);
}
function hasMagazineSection(d: ProgramData, editable?: boolean) {
  return editable || !!d.magazine;
}
function hasParticipationSection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasArr(d.studentParticipation.clubs) ||
    hasArr(d.facultyParticipation.workshops)
  );
}
function hasLifeContent(d: ProgramData, l?: LifeLabels, editable?: boolean) {
  const sec = (visible: boolean | undefined, predicate: boolean) =>
    visible !== false && predicate;
  return (
    editable ||
    sec(l?.events?.visible, hasEventsSection(d, editable)) ||
    sec(l?.studentAchievements?.visible, hasStudentAchievementsSection(d, editable)) ||
    sec(l?.facultyAchievements?.visible, hasFacultyAchievementsSection(d, editable)) ||
    sec(l?.magazine?.visible, hasMagazineSection(d, editable)) ||
    sec(l?.participation?.visible, hasParticipationSection(d, editable))
  );
}

function hasCareerProgressionSection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasText(d.careerProgression.placementRate) ||
    hasText(d.careerProgression.averagePackage) ||
    hasArr(d.careerProgression.topRecruiters) ||
    hasArr(d.careerProgression.higherStudies)
  );
}
function hasFeedbackSection(d: ProgramData, editable?: boolean) {
  return (
    editable ||
    hasArr(d.feedback.curriculumProcess) ||
    hasArr(d.feedback.facilityProcess) ||
    hasArr(d.feedback.recentImprovements)
  );
}
function hasCareerContent(
  d: ProgramData,
  l?: CareerLabels,
  editable?: boolean,
) {
  const sec = (visible: boolean | undefined, predicate: boolean) =>
    visible !== false && predicate;
  return (
    editable ||
    sec(l?.careerProgression?.visible, hasCareerProgressionSection(d, editable)) ||
    sec(l?.feedback?.visible, hasFeedbackSection(d, editable))
  );
}

function hasContentForTab(id: string, dept: ProgramData, editable?: boolean) {
  const labels = dept.labels;
  switch (id) {
    case "overview":
      return hasOverviewContent(dept, labels?.overview, editable);
    case "academics":
      return hasAcademicsContent(dept, labels?.academics, editable);
    case "faculty":
      return hasFacultyContent(dept, labels?.faculty, editable);
    case "facilities":
      return hasFacilitiesContent(dept, labels?.facilities, editable);
    case "life":
      return hasLifeContent(dept, labels?.life, editable);
    case "career":
      return hasCareerContent(dept, labels?.career, editable);
    default:
      return true; // unknown tab ids (admin-defined) — show by default
  }
}

// ─── Shared Micro Utilities ───────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  ac,
  subtitle,
}: {
  icon: ElementType;
  title: string;
  ac: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${ac}18`, border: `1.5px solid ${ac}30` }}
        >
          <Icon className="h-4 w-4" style={{ color: ac }} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          {title}
        </h2>
      </div>
      {subtitle && <p className="ml-12 text-sm text-gray-500">{subtitle}</p>}
      <div className="relative mt-3 h-0.5 w-full bg-gray-100">
        <span
          className="absolute top-0 left-0 h-0.5 w-16 rounded-full"
          style={{ backgroundColor: ac }}
        />
      </div>
    </div>
  );
}

function StatBento({
  label,
  value,
  ac,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  ac: string;
  icon?: ElementType;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${ac}0d 0%, ${ac}05 100%)`,
        border: `1px solid ${ac}20`,
      }}
    >
      <div
        className="pointer-events-none absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150"
        style={{ backgroundColor: ac }}
      />
      {Icon && (
        <div className="mb-2">
          <Icon className="h-4 w-4 opacity-40" style={{ color: ac }} />
        </div>
      )}
      <p
        className="text-2xl font-black tracking-tight md:text-3xl"
        style={{ color: ac }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>
    </div>
  );
}

function Card({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${
        hover
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-md"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({
  children,
  ac,
  variant = "solid",
}: {
  children: React.ReactNode;
  ac: string;
  variant?: "solid" | "outline" | "ghost";
}) {
  const styles =
    variant === "solid"
      ? { backgroundColor: ac, color: "#fff" }
      : variant === "outline"
        ? { border: `1px solid ${ac}40`, color: ac, backgroundColor: `${ac}0a` }
        : { backgroundColor: `${ac}12`, color: ac };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase"
      style={styles}
    >
      {children}
    </span>
  );
}

function BoardTable({
  members,
  ac,
  cols,
}: {
  members: ProgramData["advisoryBoard"];
  ac: string;
  cols?: FacultyLabels["boardCols"];
}) {
  if (!members || members.length === 0) return null;
  const headers = [
    cols?.colName || "Name",
    cols?.colDesignation || "Designation",
    cols?.colOrganization || "Organization",
    cols?.colRole || "Role",
  ];
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: `${ac}08` }}>
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-[11px] font-black tracking-wider text-gray-500 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {members.map((m, i) => (
            <tr key={i} className="transition-colors hover:bg-gray-50/70">
              <td className="px-5 py-3.5 font-semibold text-gray-900">
                {m.name}
              </td>
              <td className="px-5 py-3.5 text-gray-600">{m.designation}</td>
              <td className="px-5 py-3.5 text-gray-500">{m.organization}</td>
              <td className="px-5 py-3.5">
                {m.role && <Badge ac={ac}>{m.role}</Badge>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab: Overview ───────────────────────────────────────────────────────────

function OverviewTab({
  dept,
  ac,
  bg,
  labels,
  editable,
  onEditSection,
}: {
  dept: ProgramData;
  ac: string;
  bg: string;
  labels?: OverviewLabels;
} & EditableSectionProps) {
  const showStats =
    labels?.stats?.visible !== false && hasAboutStats(dept, editable);
  const showAbout =
    labels?.about?.visible !== false && hasAboutSection(dept, editable);
  const showHod =
    labels?.hod?.visible !== false && hasHodSection(dept, editable);
  const showVisionMission =
    labels?.visionMission?.visible !== false &&
    hasVisionMissionSection(dept, editable);
  const showPOs =
    labels?.programOutcomes?.visible !== false &&
    hasProgramOutcomesSection(dept, editable);

  return (
    <div className="space-y-14">
      {/* Quick Stats Bento */}
      {showStats && (
        <FadeUp>
          <EditableRegion
            as="div"
            section="stats"
            editable={editable}
            onEditSection={onEditSection}
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            <StatBento
              label={labels?.stats?.established || "Established"}
              value={dept.about.established}
              ac={ac}
              icon={Calendar}
            />
            <StatBento
              label={labels?.stats?.intake || "Annual Intake"}
              value={dept.about.intake}
              ac={ac}
              icon={Users}
            />
            <StatBento
              label={labels?.stats?.accreditation || "Accreditation"}
              value={dept.about.accreditation}
              ac={ac}
              icon={Award}
            />
            <StatBento
              label={labels?.stats?.affiliation || "Affiliation"}
              value={dept.about.affiliation}
              ac={ac}
              icon={BookMarked}
            />
          </EditableRegion>
        </FadeUp>
      )}

      {/* About */}
      {showAbout && (
        <EditableRegion
          section="about"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Info}
            title={labels?.about?.title || "About the Department"}
            ac={ac}
          />
          <FadeUp delay={0.05}>
            <Card hover={false} className="p-6 sm:p-8">
              <div className="space-y-4 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                {dept.about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Card>
          </FadeUp>
        </EditableRegion>
      )}

      {/* HoD's Desk */}
      {showHod && (
        <EditableRegion
          section="hod"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={GraduationCap}
            title={labels?.hod?.title || "HoD's Desk"}
            ac={ac}
          />
          <FadeUp delay={0.05}>
            <Card hover={false} className="overflow-hidden">
              {/* Header band */}
              <div
                className="relative flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:px-8"
                style={{
                  background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 75%, #000) 100%)`,
                }}
              >
                <div
                  className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full opacity-20 blur-2xl"
                  style={{ backgroundColor: ac }}
                />
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-xl sm:h-20 sm:w-20 sm:text-3xl"
                  style={{
                    backgroundColor: ac,
                    boxShadow: `0 12px 32px ${ac}50`,
                  }}
                >
                  {dept.hod.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-white sm:text-2xl">
                    {dept.hod.name}
                  </p>
                  <p className="text-sm font-medium text-white/75">
                    {dept.hod.designation}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-black/25 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
                      {dept.hod.qualification}
                    </span>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold text-white"
                      style={{ backgroundColor: `${ac}50` }}
                    >
                      {dept.hod.experience} experience
                    </span>
                  </div>
                </div>
              </div>
              {/* Message */}
              <div className="p-6 sm:p-8">
                <Quote
                  className="mb-4 h-8 w-8 opacity-10"
                  style={{ color: ac }}
                />
                <div className="space-y-4 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
                  {dept.hod.message.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </Card>
          </FadeUp>
        </EditableRegion>
      )}

      {/* Vision & Mission */}
      {showVisionMission && (
        <EditableRegion
          section="visionMission"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Target}
            title={labels?.visionMission?.title || "Vision & Mission"}
            ac={ac}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <FadeUp delay={0.05}>
              {/* Vision */}
              <div
                className="relative h-full overflow-hidden rounded-2xl p-7 text-white sm:p-8"
                style={{
                  background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 65%, #000) 100%)`,
                }}
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
                  style={{ backgroundColor: ac }}
                />
                <div className="relative z-10">
                  <Badge ac={ac} variant="outline">
                    <Target className="h-3 w-3" />{" "}
                    {labels?.visionMission?.visionLabel || "Vision"}
                  </Badge>
                  <p className="mt-5 text-lg leading-relaxed font-medium sm:text-xl">
                    {dept.visionMission.vision}
                  </p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              {/* Mission */}
              <Card hover={false} className="h-full p-7 sm:p-8">
                <Badge ac={ac} variant="ghost">
                  <CheckCircle2 className="h-3 w-3" />{" "}
                  {labels?.visionMission?.missionLabel || "Mission"}
                </Badge>
                <ul className="mt-5 space-y-4">
                  {dept.visionMission.mission.map((m, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-gray-700 sm:text-[15px]"
                    >
                      <div
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                        style={{ backgroundColor: ac }}
                      >
                        {i + 1}
                      </div>
                      <span className="leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeUp>
          </div>
        </EditableRegion>
      )}

      {/* Program Outcomes */}
      {showPOs && (
        <EditableRegion
          section="programOutcomes"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Award}
            title={labels?.programOutcomes?.title || "Program Outcomes (POs)"}
            ac={ac}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dept.programOutcomes.map((po, idx) => (
              <FadeUp key={po.code} delay={idx * 0.04}>
                <Card className="h-full p-5">
                  <span
                    className="mb-3 inline-block rounded-lg px-3 py-1 text-xs font-black text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {po.code}
                  </span>
                  <h4 className="mb-2 line-clamp-2 font-bold text-gray-900">
                    {po.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {po.description}
                  </p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </EditableRegion>
      )}
    </div>
  );
}

// ─── Tab: Academics ──────────────────────────────────────────────────────────

function AcademicsTab({
  dept,
  ac,
  labels,
  editable,
  onEditSection,
}: {
  dept: ProgramData;
  ac: string;
  labels?: AcademicsLabels;
} & EditableSectionProps) {
  const [activeSemester, setActiveSemester] = useState(0);

  // Use regulations from the actual data
  const regulations = dept.curriculum.map((c) => c.regulationName);
  const [activeRegulation, setActiveRegulation] = useState(
    regulations[0] || "",
  );

  const currentRegulationData = dept.curriculum.find(
    (c) => c.regulationName === activeRegulation,
  );
  const semesters = currentRegulationData?.semesters || [];

  const showCurriculum =
    labels?.curriculum?.visible !== false &&
    hasCurriculumSection(dept, editable);
  const showTeachingLearning =
    labels?.teachingLearning?.visible !== false &&
    hasTeachingLearningSection(dept, editable);
  const showValueAdded =
    labels?.valueAddedCourses?.visible !== false &&
    hasValueAddedSection(dept, editable);

  const courseHeaders = [
    labels?.curriculum?.colCode || "Code",
    labels?.curriculum?.colName || "Course Name",
    labels?.curriculum?.colCredits || "Credits",
    labels?.curriculum?.colType || "Type",
  ];

  return (
    <div className="space-y-14">
      {/* Curriculum */}
      {showCurriculum && (
        <EditableRegion
          section="curriculum"
          editable={editable}
          onEditSection={onEditSection}
        >
          <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <SectionHeading
              icon={BookOpen}
              title={labels?.curriculum?.title || "Curriculum & Syllabus"}
              ac={ac}
            />

            {regulations.length > 0 && (
              <div className="flex shrink-0 items-center justify-between gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:mt-1">
                {regulations.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      setActiveRegulation(reg);
                      setActiveSemester(0); // Reset to Semester 1 on regulation change
                    }}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all sm:text-xs ${
                      activeRegulation === reg
                        ? "text-white shadow-sm"
                        : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    style={
                      activeRegulation === reg ? { backgroundColor: ac } : {}
                    }
                  >
                    {reg}
                  </button>
                ))}
              </div>
            )}
          </div>

          <FadeUp>
            <div className="scrollbar-hide mb-5 flex gap-2 overflow-x-auto pb-1">
              {semesters.map((sem, i) => (
                <button
                  key={sem.semester}
                  onClick={() => setActiveSemester(i)}
                  className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300"
                  style={
                    activeSemester === i
                      ? {
                          backgroundColor: ac,
                          color: "#fff",
                          boxShadow: `0 6px 16px ${ac}35`,
                        }
                      : { backgroundColor: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  Sem {sem.semester}
                </button>
              ))}
            </div>
          </FadeUp>

          <AnimatePresence mode="wait">
            {semesters[activeSemester] && (
              <motion.div
                key={`${activeRegulation}-${activeSemester}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
              >
                <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: `${ac}08` }}>
                        {courseHeaders.map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3.5 text-left text-[11px] font-black tracking-wider text-gray-500 uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {semesters[activeSemester].subjects.map((sub) => (
                        <tr
                          key={sub.code}
                          className="transition-colors hover:bg-gray-50/70"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-400">
                            {sub.code}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-gray-900">
                            {sub.name}
                          </td>
                          <td
                            className="px-5 py-3.5 font-bold"
                            style={{ color: ac }}
                          >
                            {sub.credits}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                sub.type === "Lab"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : sub.type === "Elective"
                                    ? "bg-violet-50 text-violet-700"
                                    : sub.type === "Project"
                                      ? "bg-orange-50 text-orange-700"
                                      : "bg-sky-50 text-sky-700"
                              }`}
                            >
                              {sub.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </EditableRegion>
      )}

      {/* Teaching & Learning */}
      {showTeachingLearning && (
        <EditableRegion
          section="teachingLearning"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Microscope}
            title={
              labels?.teachingLearning?.title || "Teaching Learning Process"
            }
            ac={ac}
          />
          <FadeUp>
            <Card hover={false} className="mb-6 p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-gray-700 sm:text-[15px]">
                {dept.teachingLearning.overview}
              </p>
            </Card>
          </FadeUp>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                label:
                  labels?.teachingLearning?.methodsLabel || "Teaching Methods",
                items: dept.teachingLearning.methods,
                icon: BookOpen,
              },
              {
                label:
                  labels?.teachingLearning?.toolsLabel ||
                  "Tools & Technologies",
                items: dept.teachingLearning.tools,
                icon: Zap,
              },
              {
                label:
                  labels?.teachingLearning?.practicesLabel || "Best Practices",
                items: dept.teachingLearning.practices,
                icon: Star,
              },
            ].map((col, ci) => (
              <FadeUp key={col.label} delay={ci * 0.08}>
                <Card className="h-full p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${ac}12` }}
                    >
                      <col.icon className="h-4 w-4" style={{ color: ac }} />
                    </div>
                    <span className="text-[11px] font-black tracking-wider text-gray-500 uppercase">
                      {col.label}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-gray-700"
                      >
                        <ChevronRight
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60"
                          style={{ color: ac }}
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeUp>
            ))}
          </div>
        </EditableRegion>
      )}

      {/* Value Added Courses */}
      {showValueAdded && (
        <EditableRegion
          section="valueAddedCourses"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Star}
            title={labels?.valueAddedCourses?.title || "Value Added Courses"}
            ac={ac}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {dept.valueAddedCourses.map((course, ci) => (
              <FadeUp key={course.name} delay={ci * 0.07}>
                <Card className="h-full p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h4 className="font-bold text-gray-900">{course.name}</h4>
                    <Badge ac={ac}>{course.hours}</Badge>
                  </div>
                  <div
                    className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: `${ac}0d`, color: ac }}
                  >
                    <Briefcase className="h-3 w-3" />
                    {course.provider}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {course.description}
                  </p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </EditableRegion>
      )}
    </div>
  );
}

// ─── Tab: Faculty & Council ───────────────────────────────────────────────────

function FacultyTab({
  dept,
  ac,
  labels,
  editable,
  onEditSection,
}: {
  dept: ProgramData;
  ac: string;
  labels?: FacultyLabels;
} & EditableSectionProps) {
  const showCore =
    labels?.coreFaculty?.visible !== false &&
    hasCoreFacultySection(dept, editable);
  const showAdvisory =
    labels?.advisoryBoard?.visible !== false &&
    hasAdvisorySection(dept, editable);
  const showPac =
    labels?.pac?.visible !== false && hasPacSection(dept, editable);
  const showBos =
    labels?.bos?.visible !== false && hasBosSection(dept, editable);

  const facultyHeaders = [
    labels?.coreFaculty?.colName || "Faculty Member",
    labels?.coreFaculty?.colDesignation || "Designation",
    labels?.coreFaculty?.colQualification || "Qualification",
    labels?.coreFaculty?.colExperience || "Experience",
    labels?.coreFaculty?.colSpecialization || "Specialization",
  ];

  return (
    <div className="space-y-14">
      {/* Faculty Cards (mobile) / Table (md+) */}
      {showCore && (
        <EditableRegion
          section="faculty"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Users}
            title={labels?.coreFaculty?.title || "Core Faculty"}
            ac={ac}
          />

          {/* Mobile cards */}
          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {dept.faculty.map((f) => (
              <FadeUp key={f.name}>
                <Card className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                      style={{ backgroundColor: ac }}
                    >
                      {f.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {f.name}
                      </p>
                      <p className="text-xs text-gray-500">{f.designation}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <Detail label="Qualification" value={f.qualification} />
                    <Detail label="Experience" value={f.experience} />
                    <Detail label="Specialization" value={f.specialization} />
                    {f.email && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail
                          className="h-3 w-3 opacity-40"
                          style={{ color: ac }}
                        />
                        <span style={{ color: ac }}>{f.email}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </FadeUp>
            ))}
          </div>

          {/* Desktop table */}
          <FadeUp className="hidden md:block">
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: `${ac}08` }}>
                    {facultyHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[11px] font-black tracking-wider text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dept.faculty.map((f) => (
                    <tr
                      key={f.name}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                            style={{ backgroundColor: ac }}
                          >
                            {f.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <span className="font-bold text-gray-900">
                            {f.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-700">
                        {f.designation}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {f.qualification}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {f.experience}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {f.specialization}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </EditableRegion>
      )}

      {/* Advisory Board */}
      {showAdvisory && (
        <EditableRegion
          section="advisoryBoard"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Users}
            title={
              labels?.advisoryBoard?.title || "Department Advisory Board (DAB)"
            }
            ac={ac}
          />
          <FadeUp>
            <BoardTable
              members={dept.advisoryBoard}
              ac={ac}
              cols={labels?.boardCols}
            />
          </FadeUp>
        </EditableRegion>
      )}

      {/* PAC */}
      {showPac && (
        <EditableRegion
          section="pac"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Clipboard}
            title={labels?.pac?.title || "Program Assessment Committee (PAC)"}
            ac={ac}
          />
          <FadeUp>
            <BoardTable members={dept.pac} ac={ac} cols={labels?.boardCols} />
          </FadeUp>
        </EditableRegion>
      )}

      {/* BOS */}
      {showBos && (
        <EditableRegion
          section="bos"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={FileText}
            title={labels?.bos?.title || "Board of Studies (BOS)"}
            ac={ac}
          />
          <FadeUp>
            <BoardTable members={dept.bos} ac={ac} cols={labels?.boardCols} />
          </FadeUp>
        </EditableRegion>
      )}
    </div>
  );
}

// ─── Tab: Facilities ─────────────────────────────────────────────────────────

function FacilitiesTab({
  dept,
  ac,
  labels,
  editable,
  onEditSection,
}: {
  dept: ProgramData;
  ac: string;
  labels?: FacilitiesLabels;
} & EditableSectionProps) {
  const showLabs =
    labels?.labs?.visible !== false && hasLabsSection(dept, editable);
  const showLibrary =
    labels?.library?.visible !== false && hasLibrarySection(dept, editable);

  return (
    <div className="space-y-14">
      {/* Labs */}
      {showLabs && (
        <EditableRegion
          section="labs"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Beaker}
            title={labels?.labs?.title || "Laboratories & Workspaces"}
            ac={ac}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {dept.labs.map((lab, li) => (
              <FadeUp key={lab.name} delay={li * 0.07}>
                <Card className="h-full overflow-hidden">
                  {/* Lab header */}
                  <div
                    className="flex items-center gap-3.5 px-6 py-4"
                    style={{
                      background: `linear-gradient(135deg, ${ac}12 0%, ${ac}04 100%)`,
                    }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm"
                      style={{ border: `1px solid ${ac}25` }}
                    >
                      <FlaskConical className="h-5 w-5" style={{ color: ac }} />
                    </div>
                    <h4 className="font-bold text-gray-900">{lab.name}</h4>
                  </div>
                  <div className="p-6">
                    <p className="mb-5 text-sm leading-relaxed text-gray-600">
                      {lab.description}
                    </p>
                    <p className="mb-2.5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Equipment & Tools
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lab.equipment.map((eq) => (
                        <span
                          key={eq}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700"
                          style={{
                            backgroundColor: `${ac}08`,
                            border: `1px solid ${ac}1a`,
                          }}
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </FadeUp>
            ))}
          </div>
        </EditableRegion>
      )}

      {/* Library */}
      {showLibrary && (
        <EditableRegion
          section="library"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Library}
            title={labels?.library?.title || "Department Library"}
            ac={ac}
          />
          <FadeUp>
            <Card hover={false} className="mb-5 p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-gray-700 sm:text-[15px]">
                {dept.library.description}
              </p>
            </Card>
          </FadeUp>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <FadeUp delay={0.04}>
              <StatBento
                label={labels?.library?.booksLabel || "Volumes & Books"}
                value={dept.library.books.toLocaleString()}
                ac={ac}
              />
            </FadeUp>
            <FadeUp delay={0.08}>
              <StatBento
                label={labels?.library?.journalsLabel || "Journals"}
                value={dept.library.journals}
                ac={ac}
              />
            </FadeUp>
            <FadeUp delay={0.12}>
              <StatBento
                label={labels?.library?.magazinesLabel || "Magazines"}
                value={dept.library.magazines}
                ac={ac}
              />
            </FadeUp>
          </div>
          <FadeUp delay={0.16}>
            <Card hover={false} className="p-6 sm:p-8">
              <p className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                {labels?.library?.digitalAccessLabel ||
                  "Digital Access & Online Resources"}
              </p>
              <div className="flex flex-wrap gap-2">
                {dept.library.digitalAccess.map((r) => (
                  <span
                    key={r}
                    className="rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: `${ac}0d`,
                      color: ac,
                      border: `1px solid ${ac}20`,
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </Card>
          </FadeUp>
        </EditableRegion>
      )}
    </div>
  );
}

// ─── Tab: Life & Achievements ────────────────────────────────────────────────

function LifeTab({
  dept,
  ac,
  bg,
  labels,
  editable,
  onEditSection,
}: {
  dept: ProgramData;
  ac: string;
  bg: string;
  labels?: LifeLabels;
} & EditableSectionProps) {
  const showEvents =
    labels?.events?.visible !== false && hasEventsSection(dept, editable);
  const showStudentAch =
    labels?.studentAchievements?.visible !== false &&
    hasStudentAchievementsSection(dept, editable);
  const showFacultyAch =
    labels?.facultyAchievements?.visible !== false &&
    hasFacultyAchievementsSection(dept, editable);
  const showMagazine =
    labels?.magazine?.visible !== false && hasMagazineSection(dept, editable);
  const showParticipation =
    labels?.participation?.visible !== false &&
    hasParticipationSection(dept, editable);

  return (
    <div className="space-y-14">
      <div className="grid gap-14 lg:grid-cols-2">
        {/* Events Timeline */}
        {showEvents && (
          <EditableRegion
            section="events"
            editable={editable}
            onEditSection={onEditSection}
          >
            <SectionHeading
              icon={Calendar}
              title={labels?.events?.title || "Events Organized"}
              ac={ac}
            />
            <div className="relative ml-3 border-l-2 border-gray-100 pl-6">
              {dept.events.map((ev, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="relative mb-8 last:mb-0">
                    <div
                      className="absolute -left-[1.85rem] mt-1 h-5 w-5 rounded-full border-4 border-white shadow-sm"
                      style={{ backgroundColor: ac }}
                    />
                    <Card className="p-5">
                      <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2">
                        <h4 className="leading-snug font-bold text-gray-900">
                          {ev.title}
                        </h4>
                        <Badge ac={ac}>{ev.type}</Badge>
                      </div>
                      <p className="mb-2 text-xs font-semibold text-gray-400">
                        {ev.date}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {ev.description}
                      </p>
                      {ev.resourcePerson && (
                        <div
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
                          style={{ backgroundColor: `${ac}08` }}
                        >
                          <span className="font-bold text-gray-500">
                            Resource Person:
                          </span>
                          <span className="font-semibold" style={{ color: ac }}>
                            {ev.resourcePerson}
                          </span>
                        </div>
                      )}
                    </Card>
                  </div>
                </FadeUp>
              ))}
            </div>
          </EditableRegion>
        )}

        <div className="space-y-14">
          {/* Student Achievements */}
          {showStudentAch && (
            <EditableRegion
              section="studentAchievements"
              editable={editable}
              onEditSection={onEditSection}
            >
              <SectionHeading
                icon={Trophy}
                title={
                  labels?.studentAchievements?.title || "Student Achievements"
                }
                ac={ac}
              />
              <div className="space-y-4">
                {dept.studentAchievements.map((a, i) => (
                  <FadeUp key={i} delay={i * 0.05}>
                    <Card className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `${ac}12`,
                            border: `1px solid ${ac}20`,
                          }}
                        >
                          <Trophy className="h-4 w-4" style={{ color: ac }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <Badge ac={ac}>{a.year}</Badge>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {a.name}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {a.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {a.detail}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </FadeUp>
                ))}
              </div>
            </EditableRegion>
          )}

          {/* Faculty Achievements */}
          {showFacultyAch && (
            <EditableRegion
              section="facultyAchievements"
              editable={editable}
              onEditSection={onEditSection}
            >
              <SectionHeading
                icon={Award}
                title={
                  labels?.facultyAchievements?.title || "Faculty Achievements"
                }
                ac={ac}
              />
              <div className="space-y-4">
                {dept.facultyAchievements.map((a, i) => (
                  <FadeUp key={i} delay={i * 0.05}>
                    <Card className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `${ac}12`,
                            border: `1px solid ${ac}20`,
                          }}
                        >
                          <Award className="h-4 w-4" style={{ color: ac }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge ac={ac}>{a.year}</Badge>
                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {a.name}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {a.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {a.detail}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </FadeUp>
                ))}
              </div>
            </EditableRegion>
          )}

          {/* Magazine */}
          {showMagazine && dept.magazine && (
            <EditableRegion
              section="magazine"
              editable={editable}
              onEditSection={onEditSection}
            >
              <SectionHeading
                icon={Newspaper}
                title={labels?.magazine?.title || "Newsletter / Magazine"}
                ac={ac}
              />
              <FadeUp>
                <Card hover={false} className="overflow-hidden">
                  <div
                    className="relative p-6 text-white sm:p-8"
                    style={{
                      background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 60%, #000) 100%)`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full opacity-25 blur-xl"
                      style={{ backgroundColor: ac }}
                    />
                    <p className="mb-1 text-[10px] font-black tracking-widest text-white/60 uppercase">
                      Department Publication
                    </p>
                    <h3 className="text-2xl font-black">
                      {dept.magazine.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {dept.magazine.description}
                    </p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="mb-5 flex gap-8">
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                          Frequency
                        </p>
                        <p className="mt-1 font-bold text-gray-900">
                          {dept.magazine.frequency}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                          Latest Issue
                        </p>
                        <p className="mt-1 font-bold text-gray-900">
                          {dept.magazine.latestIssue}
                        </p>
                      </div>
                    </div>
                    <p className="mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Recent Highlights
                    </p>
                    <ul className="space-y-2.5">
                      {dept.magazine.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-gray-700"
                        >
                          <ChevronRight
                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                            style={{ color: ac }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </FadeUp>
            </EditableRegion>
          )}
        </div>
      </div>

      {/* Clubs & Participation */}
      {showParticipation && (
        <EditableRegion
          section="participation"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={Users}
            title={labels?.participation?.title || "Participation & Clubs"}
            ac={ac}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <FadeUp>
              <Card hover={false} className="p-6 sm:p-8">
                <h4 className="mb-4 font-bold text-gray-900">
                  {labels?.participation?.clubsLabel || "Student Clubs"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dept.studentParticipation.clubs.map((club) => (
                    <span
                      key={club}
                      className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-white"
                      style={{ backgroundColor: ac }}
                    >
                      {club}
                    </span>
                  ))}
                </div>
              </Card>
            </FadeUp>
            <FadeUp delay={0.08}>
              <Card hover={false} className="p-6 sm:p-8">
                <h4 className="mb-4 font-bold text-gray-900">
                  {labels?.participation?.workshopsLabel || "Faculty Workshops"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dept.facultyParticipation.workshops.map((w) => (
                    <span
                      key={w}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-sm text-gray-700"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </Card>
            </FadeUp>
          </div>
        </EditableRegion>
      )}
    </div>
  );
}

// ─── Tab: Career & Feedback ───────────────────────────────────────────────────

function CareerTab({
  dept,
  ac,
  bg: _bg,
  labels,
  editable,
  onEditSection,
}: {
  dept: ProgramData;
  ac: string;
  bg: string;
  labels?: CareerLabels;
} & EditableSectionProps) {
  // It appears `has` was undeclared or intended to be something else.
  // Replacing with a safe default boolean or true for now as a fallback to fix the build error.
  const showCareer =
    labels?.careerProgression?.visible !== false;
  const showFeedback =
    labels?.feedback?.visible !== false;

  return (
    <div className="space-y-14">
      {/* Career Progression */}
      {showCareer && (
        <EditableRegion
          section="careerProgression"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={TrendingUp}
            title={labels?.careerProgression?.title || "Career Progression"}
            ac={ac}
          />
          <FadeUp>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <StatBento
                label={
                  labels?.careerProgression?.placementRateLabel ||
                  "Placement Rate"
                }
                value={dept.careerProgression.placementRate}
                ac={ac}
                icon={TrendingUp}
              />
              <StatBento
                label={
                  labels?.careerProgression?.avgPackageLabel || "Avg. Package"
                }
                value={dept.careerProgression.averagePackage}
                ac={ac}
                icon={Briefcase}
              />
            </div>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Recruiters */}
            <FadeUp delay={0.08}>
              <Card className="h-full p-6 sm:p-8">
                <h5 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                  <Layers className="h-4 w-4" style={{ color: ac }} />
                  {labels?.careerProgression?.topRecruitersLabel ||
                    "Top Recruiters"}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {dept.careerProgression.topRecruiters.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-gray-100 bg-gray-50 px-3.5 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-200 hover:bg-white"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </Card>
            </FadeUp>

            {/* Higher Studies */}
            <FadeUp delay={0.12}>
              <Card className="h-full p-6 sm:p-8">
                <h5 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                  <GraduationCap className="h-4 w-4" style={{ color: ac }} />
                  {labels?.careerProgression?.higherStudiesLabel ||
                    "Higher Studies"}
                </h5>
                <ul className="space-y-3">
                  {dept.careerProgression.higherStudies.map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm text-gray-700">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: ac }}
                      />
                      <span className="font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeUp>
          </div>
        </EditableRegion>
      )}

      {/* Feedback */}
      {showFeedback && (
        <EditableRegion
          section="feedback"
          editable={editable}
          onEditSection={onEditSection}
        >
          <SectionHeading
            icon={MessageSquare}
            title={labels?.feedback?.title || "Feedback & Improvements"}
            ac={ac}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                label:
                  labels?.feedback?.curriculumColTitle || "Curriculum Feedback",
                items: dept.feedback.curriculumProcess,
              },
              {
                label:
                  labels?.feedback?.facilityColTitle || "Facility Feedback",
                items: dept.feedback.facilityProcess,
              },
              {
                label:
                  labels?.feedback?.improvementsColTitle ||
                  "Recent Improvements",
                items: dept.feedback.recentImprovements,
              },
            ].map((col, ci) => (
              <FadeUp key={col.label} delay={ci * 0.08}>
                <Card className="h-full p-6">
                  <span
                    className="mb-4 inline-block rounded-xl px-3 py-1.5 text-[10px] font-black tracking-wider uppercase"
                    style={{ backgroundColor: `${ac}0d`, color: ac }}
                  >
                    {col.label}
                  </span>
                  <ul className="space-y-4">
                    {col.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-sm text-gray-700"
                      >
                        <div
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                          style={{ backgroundColor: ac }}
                        >
                          {i + 1}
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeUp>
            ))}
          </div>
        </EditableRegion>
      )}
    </div>
  );
}

// ─── Small helper used in faculty mobile card ─────────────────────────────────
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1 text-xs">
      <span className="shrink-0 font-black tracking-wide text-gray-400 uppercase">
        {label}:
      </span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────

export function ProgramPageLayout({
  dept,
  backHref: _backHref,
  backLabel: _backLabel,
  editable = false,
  onEditSection,
}: {
  dept: ProgramData;
  backHref: string;
  backLabel: string;
  /** When true, renders inline "Edit this section" affordances and shows all tabs. */
  editable?: boolean;
  /** Called with the active tab id when the editor affordance is clicked. */
  onEditTab?: (tabId: string) => void;
  /** Called with the clicked page section in builder mode. */
  onEditSection?: (section: ProgramEditableSection) => void;
}) {
  const ac = dept.accentColor;
  const bg = dept.bgColor;

  const effectiveTabs: TabConfigItem[] =
    dept.tabsConfig && dept.tabsConfig.length > 0
      ? dept.tabsConfig
      : DEFAULT_TABS;

  // In editable mode every tab is reachable (even empty ones) so the editor
  // can fill in sections that have no content yet.
  const visibleTabs = editable
    ? effectiveTabs
    : effectiveTabs.filter(
        (t) => t.visible !== false && hasContentForTab(t.id, dept),
      );

  const [activeTab, setActiveTab] = useState<string>(
    visibleTabs[0]?.id ?? "overview",
  );

  useEffect(() => {
    if (
      visibleTabs.length > 0 &&
      !visibleTabs.some((t) => t.id === activeTab)
    ) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.collegeTheme;
    root.dataset.collegeTheme = dept.college;
    return () => {
      if (previous) {
        root.dataset.collegeTheme = previous;
      } else {
        delete root.dataset.collegeTheme;
      }
    };
  }, [dept.college]);

  const labels = dept.labels;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            dept={dept}
            ac={ac}
            bg={bg}
            labels={labels?.overview}
            editable={editable}
            onEditSection={onEditSection}
          />
        );
      case "academics":
        return (
          <AcademicsTab
            dept={dept}
            ac={ac}
            labels={labels?.academics}
            editable={editable}
            onEditSection={onEditSection}
          />
        );
      case "faculty":
        return (
          <FacultyTab
            dept={dept}
            ac={ac}
            labels={labels?.faculty}
            editable={editable}
            onEditSection={onEditSection}
          />
        );
      case "facilities":
        return (
          <FacilitiesTab
            dept={dept}
            ac={ac}
            labels={labels?.facilities}
            editable={editable}
            onEditSection={onEditSection}
          />
        );
      case "life":
        return (
          <LifeTab
            dept={dept}
            ac={ac}
            bg={bg}
            labels={labels?.life}
            editable={editable}
            onEditSection={onEditSection}
          />
        );
      case "career":
        return (
          <CareerTab
            dept={dept}
            ac={ac}
            bg={bg}
            labels={labels?.career}
            editable={editable}
            onEditSection={onEditSection}
          />
        );
      default:
        return null;
    }
  };

  const degreePrefix =
    typeof dept.degreePrefix === "string"
      ? dept.degreePrefix
      : dept.college === "engineering"
        ? "B.E/B.Tech "
        : "";

  const heroPills =
    dept.heroMeta && dept.heroMeta.length > 0
      ? dept.heroMeta
      : [
          { label: "Duration", value: dept.about.duration },
          { label: "Affiliation", value: dept.about.affiliation },
          { label: "Accreditation", value: dept.about.accreditation },
        ];

  return (
    <>
      {!editable && <Navbar forceSolidOnTop />}

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <EditableRegion
        as="header"
        section="hero"
        editable={editable}
        onEditSection={onEditSection}
        className="relative min-h-120 overflow-hidden pt-28 pb-14 md:min-h-135"
        style={{ backgroundColor: bg }}
      >
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          {dept.heroImage && (
            <Image
              src={getImageUrl(dept.heroImage) ?? dept.heroImage}
              alt={dept.name}
              fill
              sizes="100vw"
              className="object-cover opacity-20 mix-blend-overlay"
              priority
            />
          )}
          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/85 via-black/65 to-black/40" />
          {/* Glow orb 1 */}
          <div
            className="absolute -top-24 -right-24 h-80 w-80 animate-pulse rounded-full opacity-30 blur-[90px]"
            style={{ backgroundColor: ac }}
          />
          {/* Glow orb 2 */}
          <div
            className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full opacity-15 blur-[70px]"
            style={{ backgroundColor: ac }}
          />
          {/* Subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* <Link
              href={backHref}
              className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link> */}
          </motion.div>

          <div className="max-w-4xl">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-6 text-4xl leading-[1.1] font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {degreePrefix}
              {dept.name}
            </motion.h1>

            {/* Meta pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-white/70"
            >
              {heroPills.map((item, i) => {
                if (!item.value) return null;
                const PillIcon = iconFromName(item.icon);
                return (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && (
                      <span className="h-1 w-1 rounded-full bg-white/30" />
                    )}
                    <span className="flex items-center gap-1.5">
                      {PillIcon && (
                        <PillIcon className="h-3.5 w-3.5 opacity-70" />
                      )}
                      {item.label && (
                        <span className="mr-1 opacity-60">{item.label}</span>
                      )}
                      <span className="font-semibold text-white">
                        {item.value}
                      </span>
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </EditableRegion>

      {/* ── Main Layout with Sidebar ──────────────────────────────────── */}
      <main className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            {/* ── Floating Sidebar (Tabs) ──────────────────────────────── */}
            <aside className="shrink-0 lg:w-72">
              <div className="sticky top-24 z-40 lg:rounded-2xl lg:border lg:border-slate-200/60 lg:bg-white lg:p-3 lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <nav className="grid grid-cols-2 gap-2 pb-4 sm:grid-cols-3 lg:flex lg:flex-col lg:items-stretch lg:gap-1 lg:pb-0">
                  {visibleTabs.map((tab) => {
                    const Icon =
                      iconFromName(tab.icon) ??
                      DEFAULT_TAB_ICONS[tab.id as TabId] ??
                      BookOpen;
                    const isActive = activeTab === tab.id;
                    const label =
                      tab.label ||
                      DEFAULT_TAB_LABELS[tab.id as TabId] ||
                      tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 lg:justify-start lg:px-4 lg:py-3.5 ${
                          isActive
                            ? ""
                            : "text-slate-600 hover:bg-slate-200/50 lg:hover:bg-slate-50"
                        }`}
                        style={isActive ? { color: ac } : {}}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "opacity-60"}`}
                        />
                        <span className="whitespace-nowrap">{label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute inset-0 z-[-1] rounded-xl"
                            style={{
                              backgroundColor: `${ac}12`,
                              border: `1.5px solid ${ac}25`,
                            }}
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.55,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* ── Tab Content Container ───────────────────────────────── */}
            <div className="min-w-0 flex-1 pb-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {!editable && <Footer />}
    </>
  );
}
