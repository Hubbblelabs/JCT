"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
  ArrowLeft,
  Trophy,
} from "lucide-react";
import type { DepartmentData } from "@/types/department";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SIDEBAR_ITEMS = [
  { id: "about", label: "About the Department", icon: BookOpen },
  { id: "hod", label: "HoD's Desk", icon: GraduationCap },
  { id: "vision-mission", label: "Vision & Mission", icon: Target },
  { id: "program-outcomes", label: "Program Outcomes (POs)", icon: Award },
  { id: "advisory-board", label: "Department Advisory Board", icon: Users },
  { id: "pac", label: "Program Assessment Committee", icon: Clipboard },
  { id: "bos", label: "Board of Studies", icon: FileText },
  { id: "curriculum", label: "Curriculum & Syllabus", icon: BookOpen },
  { id: "teaching", label: "Teaching Learning Process", icon: Microscope },
  { id: "value-added", label: "Value Added Courses", icon: Star },
  { id: "faculty", label: "Faculty Details", icon: Users },
  { id: "labs", label: "Laboratories", icon: FlaskConical },
  { id: "library", label: "Department Library", icon: Library },
  { id: "events", label: "Events Organized", icon: Calendar },
  { id: "student-participation", label: "Student Participation", icon: Users },
  { id: "faculty-participation", label: "Faculty Participation", icon: Users },
  { id: "student-achievements", label: "Student Achievements", icon: Award },
  { id: "faculty-achievements", label: "Faculty Achievements", icon: Award },
  { id: "magazine", label: "Dept. Magazine / Newsletter", icon: Newspaper },
  { id: "career", label: "Career Progression", icon: TrendingUp },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
] as const;

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
  const inView = useInView(ref, { once: true, margin: "-60px" });
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
  id,
  icon: Icon,
  title,
  accentColor,
  index,
}: {
  id: string;
  icon: ElementType;
  title: string;
  accentColor: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 scroll-mt-28"
    >
      <div className="flex items-start gap-4">
        <div
          className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `${accentColor}15`,
            border: `1.5px solid ${accentColor}30`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] font-black tracking-[0.18em] uppercase"
            style={{ color: `${accentColor}90` }}
          >
            Section {String(index).padStart(2, "0")}
          </p>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      <div
        className="mt-4 h-px w-full"
        style={{
          background: `linear-gradient(to right, ${accentColor}45, ${accentColor}10, transparent)`,
        }}
      />
    </motion.div>
  );
}

function SidebarItem({
  item,
  active,
  accentColor,
  index,
  onClick,
}: {
  item: (typeof SIDEBAR_ITEMS)[number];
  active: boolean;
  accentColor: string;
  index: number;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="group mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200"
      style={
        active
          ? {
              backgroundColor: `${accentColor}20`,
              borderLeft: `3px solid ${accentColor}`,
            }
          : { borderLeft: "3px solid transparent" }
      }
    >
      <span
        className="w-5 shrink-0 text-[10px] font-black tabular-nums"
        style={
          active ? { color: accentColor } : { color: "rgba(255,255,255,0.25)" }
        }
      >
        {String(index).padStart(2, "0")}
      </span>
      <Icon
        className="h-3.5 w-3.5 shrink-0 transition-colors"
        style={
          active ? { color: accentColor } : { color: "rgba(255,255,255,0.4)" }
        }
      />
      <span
        className="text-xs leading-tight transition-colors"
        style={
          active
            ? { color: accentColor, fontWeight: 600 }
            : { color: "rgba(255,255,255,0.55)", fontWeight: 400 }
        }
      >
        {item.label}
      </span>
    </button>
  );
}

function BoardTable({
  members,
  accentColor,
}: {
  members: DepartmentData["advisoryBoard"];
  accentColor: string;
}) {
  return (
    <div className="border-border overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: `${accentColor}0d` }}>
            {["Name", "Designation", "Organization", "Role"].map((h) => (
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
            <tr key={i} className="hover:bg-surface/60 transition-colors">
              <td className="px-5 py-3.5 font-semibold text-gray-900">
                {m.name}
              </td>
              <td className="px-5 py-3.5 text-gray-600">{m.designation}</td>
              <td className="px-5 py-3.5 text-gray-500">{m.organization}</td>
              <td className="px-5 py-3.5">
                {m.role && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {m.role}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AchievementGrid({
  achievements,
  accentColor,
}: {
  achievements: DepartmentData["studentAchievements"];
  accentColor: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {achievements.map((a, i) => (
        <FadeUp key={i} delay={i * 0.05}>
          <div className="border-border relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div
              className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-bl-[2.5rem] opacity-[0.06]"
              style={{ backgroundColor: accentColor }}
            />
            <div className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${accentColor}12`,
                  border: `1px solid ${accentColor}25`,
                }}
              >
                <Trophy className="h-5 w-5" style={{ color: accentColor }} />
              </div>
              <div className="flex-1">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {a.year}
                </span>
                <h4 className="mt-1.5 font-bold text-gray-900">{a.name}</h4>
                <p className="text-sm font-medium text-gray-700">{a.title}</p>
                <p className="mt-1 text-xs text-gray-400">{a.detail}</p>
              </div>
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  accentColor,
}: {
  label: string;
  value: string | number;
  accentColor: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-white p-5 text-center shadow-sm"
      style={{ borderColor: `${accentColor}22` }}
    >
      <p
        className="font-serif text-2xl font-black md:text-3xl"
        style={{ color: accentColor }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
        {label}
      </p>
    </div>
  );
}

export function DepartmentPageLayout({
  dept,
  backHref,
  backLabel,
}: {
  dept: DepartmentData;
  backHref: string;
  backLabel: string;
}) {
  const [activeId, setActiveId] = useState<string>("about");
  const [activeSemester, setActiveSemester] = useState(0);
  const ac = dept.accentColor;
  const bg = dept.bgColor;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SIDEBAR_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-15% 0px -80% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

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

  function scrollTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const collegeLabel =
    dept.college === "engineering"
      ? "B.E. Department"
      : dept.college === "arts-science"
        ? "UG Program"
        : "Diploma Program";

  return (
    <>
      <Navbar />

      <header
        className="relative overflow-hidden"
        style={{ backgroundColor: bg, minHeight: "520px" }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={dept.heroImage}
            alt={dept.name}
            fill
            sizes="100vw"
            className="object-cover opacity-[0.14]"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/55 to-black/15" />
          <div
            className="absolute -right-32 -bottom-32 h-112 w-md rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: ac }}
          />
          <div
            className="absolute top-1/3 -left-16 h-64 w-64 rounded-full opacity-10 blur-2xl"
            style={{ backgroundColor: ac }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 right-0 h-full w-2/5 opacity-[0.04]"
            style={{
              background: `repeating-linear-gradient(-55deg, ${ac}, ${ac} 1px, transparent 1px, transparent 18px)`,
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-28 pt-40 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={backHref}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-sm transition-all hover:bg-white/14 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span
                  className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-black tracking-[0.15em] uppercase"
                  style={{
                    backgroundColor: `${ac}20`,
                    color: ac,
                    borderColor: `${ac}35`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full"
                    style={{ backgroundColor: ac }}
                  />
                  {collegeLabel} · {dept.about.intake} Seats
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-5 font-serif text-4xl leading-[1.04] font-black tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                {dept.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55"
              >
                {[
                  dept.about.established && `Est. ${dept.about.established}`,
                  dept.about.affiliation,
                  dept.about.accreditation,
                ]
                  .filter(Boolean)
                  .map((label, i) => (
                    <span key={i} className="flex items-center gap-2">
                      {i > 0 && (
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                      )}
                      {label}
                    </span>
                  ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-3 lg:flex-col"
            >
              {[
                { value: `${dept.about.intake}`, label: "Annual Intake" },
                { value: dept.about.accreditation, label: "Accreditation" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm"
                >
                  <p
                    className="font-serif text-xl font-black text-white"
                    style={{ textShadow: `0 0 24px ${ac}70` }}
                  >
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-xs text-white/45">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="from-surface absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent" />
      </header>

      <div
        className="border-border sticky top-16 z-40 border-b bg-white/95 backdrop-blur-md lg:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all"
              style={
                activeId === item.id
                  ? { backgroundColor: ac, color: "#fff" }
                  : { color: "#6b7280" }
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface flex min-h-screen">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div
            className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-5"
            style={{ backgroundColor: bg }}
          >
            <div className="mb-3 px-5">
              <p
                className="text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ color: `${ac}80` }}
              >
                {dept.college === "engineering"
                  ? "B.E."
                  : dept.college === "arts-science"
                    ? "UG"
                    : "Diploma"}
                {" · "}
                <span style={{ color: ac }}>
                  {dept.name.split(" ").slice(0, 3).join(" ")}
                </span>
              </p>
              <div
                className="mt-2 h-px"
                style={{
                  background: `linear-gradient(to right, ${ac}40, transparent)`,
                }}
              />
            </div>

            <nav className="px-3">
              {SIDEBAR_ITEMS.map((item, i) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  active={activeId === item.id}
                  accentColor={ac}
                  index={i + 1}
                  onClick={() => scrollTo(item.id)}
                />
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-14 md:px-8 lg:px-14">
          <section className="mb-20">
            <SectionHeading
              id="about"
              icon={BookOpen}
              title="About the Department"
              accentColor={ac}
              index={1}
            />

            <FadeUp delay={0.05}>
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Established", value: dept.about.established },
                  { label: "Annual Intake", value: dept.about.intake },
                  { label: "Accreditation", value: dept.about.accreditation },
                  { label: "Affiliation", value: dept.about.affiliation },
                ].map((s) => (
                  <StatCard
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    accentColor={ac}
                  />
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              <div className="border-border rounded-2xl border bg-white p-6 shadow-sm md:p-8">
                <div className="space-y-4 leading-relaxed text-gray-700">
                  {dept.about.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="hod"
              icon={GraduationCap}
              title="HoD's Desk"
              accentColor={ac}
              index={2}
            />

            <FadeUp delay={0.08}>
              <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div
                  className="flex flex-wrap items-center gap-4 px-6 py-5"
                  style={{
                    background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 80%, transparent) 100%)`,
                  }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
                    style={{
                      backgroundColor: ac,
                      boxShadow: `0 8px 24px ${ac}50`,
                    }}
                  >
                    {dept.hod.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">
                      {dept.hod.name}
                    </p>
                    <p className="text-sm text-white/70">
                      {dept.hod.designation}
                    </p>
                    <p className="text-xs text-white/50">
                      {dept.hod.qualification}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-4 py-1.5 text-xs font-bold"
                    style={{ backgroundColor: `${ac}30`, color: ac }}
                  >
                    {dept.hod.experience}
                  </span>
                </div>

                <div className="px-6 py-6 md:px-8 md:py-8">
                  <Quote
                    className="mb-4 h-8 w-8 opacity-10"
                    style={{ color: ac }}
                  />
                  <div className="space-y-4 leading-relaxed text-gray-700">
                    {dept.hod.message.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="vision-mission"
              icon={Target}
              title="Vision & Mission"
              accentColor={ac}
              index={3}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <FadeUp delay={0.08}>
                <div
                  className="h-full rounded-2xl p-6 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 85%, black) 100%)`,
                  }}
                >
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-[11px] font-black tracking-widest uppercase"
                    style={{ color: ac }}
                  >
                    <Target className="h-3 w-3" />
                    Vision
                  </div>
                  <p className="text-lg leading-relaxed font-medium">
                    {dept.visionMission.vision}
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.14}>
                <div className="border-border h-full rounded-2xl border bg-white p-6 shadow-sm">
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black tracking-widest uppercase"
                    style={{
                      color: ac,
                      borderColor: `${ac}30`,
                      backgroundColor: `${ac}08`,
                    }}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Mission
                  </div>
                  <ul className="space-y-3">
                    {dept.visionMission.mission.map((m, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <div
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                          style={{ backgroundColor: ac }}
                        >
                          {i + 1}
                        </div>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="program-outcomes"
              icon={Award}
              title="Program Outcomes (POs)"
              accentColor={ac}
              index={4}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dept.programOutcomes.map((po, idx) => (
                <motion.div
                  key={po.code}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.04 }}
                  className="border-border rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    className="mb-3 inline-block rounded-lg px-2.5 py-0.5 text-xs font-black text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {po.code}
                  </span>
                  <h4 className="mb-1.5 font-bold text-gray-900">{po.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {po.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="advisory-board"
              icon={Users}
              title="Department Advisory Board (DAB)"
              accentColor={ac}
              index={5}
            />
            <FadeUp delay={0.08}>
              <BoardTable members={dept.advisoryBoard} accentColor={ac} />
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="pac"
              icon={Clipboard}
              title="Program Assessment Committee (PAC)"
              accentColor={ac}
              index={6}
            />
            <FadeUp delay={0.08}>
              <BoardTable members={dept.pac} accentColor={ac} />
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="bos"
              icon={FileText}
              title="Board of Studies (BOS)"
              accentColor={ac}
              index={7}
            />
            <FadeUp delay={0.08}>
              <BoardTable members={dept.bos} accentColor={ac} />
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="curriculum"
              icon={BookOpen}
              title="Curriculum & Syllabus"
              accentColor={ac}
              index={8}
            />

            <FadeUp delay={0.06}>
              <div className="mb-5 flex flex-wrap gap-2">
                {dept.curriculum.map((sem, i) => (
                  <button
                    key={sem.semester}
                    onClick={() => setActiveSemester(i)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                    style={
                      activeSemester === i
                        ? {
                            backgroundColor: ac,
                            color: "#fff",
                            boxShadow: `0 4px 14px ${ac}40`,
                          }
                        : {
                            border: "1px solid var(--color-border)",
                            backgroundColor: "#fff",
                            color: "#4b5563",
                          }
                    }
                  >
                    Sem {sem.semester}
                  </button>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              {dept.curriculum[activeSemester] && (
                <div className="border-border overflow-x-auto rounded-2xl border bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: `${ac}0d` }}>
                        {["Code", "Subject", "Credits", "Type"].map((h) => (
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
                      {dept.curriculum[activeSemester].subjects.map((sub) => (
                        <tr
                          key={sub.code}
                          className="hover:bg-surface/40 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                            {sub.code}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-gray-900">
                            {sub.name}
                          </td>
                          <td
                            className="px-5 py-3.5 text-center font-bold"
                            style={{ color: ac }}
                          >
                            {sub.credits}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                sub.type === "Lab"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : sub.type === "Elective"
                                    ? "bg-violet-50 text-violet-700"
                                    : sub.type === "Project"
                                      ? "bg-orange-50 text-orange-700"
                                      : "bg-blue-50 text-blue-700"
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
              )}
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="teaching"
              icon={Microscope}
              title="Teaching Learning Process"
              accentColor={ac}
              index={9}
            />

            <FadeUp delay={0.06}>
              <div className="border-border mb-6 rounded-2xl border bg-white p-6 shadow-sm">
                <p className="leading-relaxed text-gray-700">
                  {dept.teachingLearning.overview}
                </p>
              </div>
            </FadeUp>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  label: "Teaching Methods",
                  items: dept.teachingLearning.methods,
                },
                {
                  label: "Tools & Technologies",
                  items: dept.teachingLearning.tools,
                },
                {
                  label: "Best Practices",
                  items: dept.teachingLearning.practices,
                },
              ].map((col, ci) => (
                <FadeUp key={col.label} delay={0.1 + ci * 0.06}>
                  <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
                    <div
                      className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-black tracking-wider uppercase"
                      style={{ backgroundColor: `${ac}10`, color: ac }}
                    >
                      {col.label}
                    </div>
                    <ul className="space-y-2.5">
                      {col.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-gray-700"
                        >
                          <div
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: ac }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="value-added"
              icon={Star}
              title="Value Added Courses"
              accentColor={ac}
              index={10}
            />

            <div className="grid gap-5 md:grid-cols-2">
              {dept.valueAddedCourses.map((course, ci) => (
                <FadeUp key={course.name} delay={ci * 0.07}>
                  <div className="group border-border relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div
                      className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-[0.06] transition-all duration-300 group-hover:scale-125"
                      style={{ backgroundColor: ac }}
                    />
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h4 className="font-bold text-gray-900">{course.name}</h4>
                      <span
                        className="shrink-0 rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: ac }}
                      >
                        {course.hours}
                      </span>
                    </div>
                    <p
                      className="mb-2 text-xs font-semibold"
                      style={{ color: ac }}
                    >
                      {course.provider}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {course.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="faculty"
              icon={Users}
              title="Faculty Details"
              accentColor={ac}
              index={11}
            />

            <FadeUp delay={0.08}>
              <div className="border-border overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: `${ac}0d` }}>
                      {[
                        "Faculty Member",
                        "Designation",
                        "Qualification",
                        "Experience",
                        "Specialization",
                      ].map((h) => (
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
                        className="hover:bg-surface/50 transition-colors"
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
                            <span className="font-semibold text-gray-900">
                              {f.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
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
          </section>

          <section className="mb-20">
            <SectionHeading
              id="labs"
              icon={FlaskConical}
              title="Laboratories"
              accentColor={ac}
              index={12}
            />

            <div className="grid gap-5 md:grid-cols-2">
              {dept.labs.map((lab, li) => (
                <FadeUp key={lab.name} delay={li * 0.07}>
                  <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div
                      className="flex items-center gap-3 px-5 py-4"
                      style={{
                        background: `linear-gradient(135deg, ${ac}12 0%, ${ac}05 100%)`,
                      }}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${ac}18` }}
                      >
                        <FlaskConical
                          className="h-5 w-5"
                          style={{ color: ac }}
                        />
                      </div>
                      <h4 className="font-bold text-gray-900">{lab.name}</h4>
                    </div>

                    <div className="p-5">
                      <p className="mb-4 text-sm leading-relaxed text-gray-600">
                        {lab.description}
                      </p>
                      <p
                        className="mb-2.5 text-[10px] font-black tracking-widest uppercase"
                        style={{ color: ac }}
                      >
                        Equipment
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lab.equipment.map((eq) => (
                          <span
                            key={eq}
                            className="rounded-lg border px-2.5 py-1 text-xs text-gray-700"
                            style={{
                              borderColor: `${ac}20`,
                              backgroundColor: `${ac}08`,
                            }}
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="library"
              icon={Library}
              title="Department Library"
              accentColor={ac}
              index={13}
            />

            <FadeUp delay={0.06}>
              <div className="border-border mb-5 rounded-2xl border bg-white p-6 shadow-sm">
                <p className="leading-relaxed text-gray-700">
                  {dept.library.description}
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mb-5 grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Books",
                    value: dept.library.books.toLocaleString(),
                  },
                  { label: "Journals", value: dept.library.journals },
                  { label: "Magazines", value: dept.library.magazines },
                ].map((s) => (
                  <StatCard
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    accentColor={ac}
                  />
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
                <p
                  className="mb-3 text-[10px] font-black tracking-widest uppercase"
                  style={{ color: ac }}
                >
                  Digital Access & Online Resources
                </p>
                <div className="flex flex-wrap gap-2">
                  {dept.library.digitalAccess.map((r) => (
                    <span
                      key={r}
                      className="rounded-xl border px-3 py-1.5 text-sm font-medium text-gray-700"
                      style={{
                        borderColor: `${ac}22`,
                        backgroundColor: `${ac}08`,
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="events"
              icon={Calendar}
              title="Events Organized"
              accentColor={ac}
              index={14}
            />

            <div
              className="relative border-l-2 pl-8"
              style={{ borderColor: `${ac}25` }}
            >
              {dept.events.map((ev, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="relative mb-8 last:mb-0">
                    <div
                      className="border-surface absolute -left-[2.35rem] flex h-5 w-5 items-center justify-center rounded-full border-2 shadow"
                      style={{ backgroundColor: ac }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>

                    <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
                      <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2">
                        <h4 className="font-bold text-gray-900">{ev.title}</h4>
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                            style={{ backgroundColor: ac }}
                          >
                            {ev.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {ev.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {ev.description}
                      </p>
                      {ev.resourcePerson && (
                        <p
                          className="mt-2.5 text-xs font-semibold"
                          style={{ color: ac }}
                        >
                          Resource Person: {ev.resourcePerson}
                        </p>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="student-participation"
              icon={Users}
              title="Student Participation"
              accentColor={ac}
              index={15}
            />

            <FadeUp delay={0.06}>
              <div className="border-border mb-6 rounded-2xl border bg-white p-5 shadow-sm">
                <p
                  className="mb-3 text-[10px] font-black tracking-widest uppercase"
                  style={{ color: ac }}
                >
                  Clubs & Associations
                </p>
                <div className="flex flex-wrap gap-2">
                  {dept.studentParticipation.clubs.map((club) => (
                    <span
                      key={club}
                      className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-white"
                      style={{
                        backgroundColor: ac,
                        boxShadow: `0 2px 8px ${ac}30`,
                      }}
                    >
                      {club}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>

            <div className="grid gap-5 md:grid-cols-2">
              {dept.studentParticipation.highlights.map((h, hi) => (
                <FadeUp key={h.title} delay={hi * 0.06}>
                  <div className="border-border rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div
                      className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: ac }}
                    >
                      {h.year}
                    </div>
                    <h4 className="mb-2 font-bold text-gray-900">{h.title}</h4>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {h.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="faculty-participation"
              icon={Users}
              title="Faculty Participation"
              accentColor={ac}
              index={16}
            />

            <FadeUp delay={0.06}>
              <div className="mb-6">
                <p
                  className="mb-3 text-[10px] font-black tracking-widest uppercase"
                  style={{ color: ac }}
                >
                  Conferences & Paper Presentations
                </p>
                <div className="border-border overflow-x-auto rounded-2xl border bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: `${ac}0d` }}>
                        {["Faculty", "Conference / Event", "Venue", "Year"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-5 py-3.5 text-left text-[11px] font-black tracking-wider text-gray-500 uppercase"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {dept.facultyParticipation.conferences.map((c, i) => (
                        <tr
                          key={i}
                          className="hover:bg-surface/40 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-semibold text-gray-900">
                            {c.faculty}
                          </td>
                          <td className="px-5 py-3.5 text-gray-700">
                            {c.title}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">
                            {c.venue}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">
                            {c.year}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p
                className="mb-3 text-[10px] font-black tracking-widest uppercase"
                style={{ color: ac }}
              >
                Workshops & FDPs Attended
              </p>
              <div className="flex flex-wrap gap-2">
                {dept.facultyParticipation.workshops.map((w) => (
                  <span
                    key={w}
                    className="border-border rounded-xl border bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="student-achievements"
              icon={Award}
              title="Student Achievements"
              accentColor={ac}
              index={17}
            />
            <AchievementGrid
              achievements={dept.studentAchievements}
              accentColor={ac}
            />
          </section>

          <section className="mb-20">
            <SectionHeading
              id="faculty-achievements"
              icon={Award}
              title="Faculty Achievements"
              accentColor={ac}
              index={18}
            />
            <AchievementGrid
              achievements={dept.facultyAchievements}
              accentColor={ac}
            />
          </section>

          <section className="mb-20">
            <SectionHeading
              id="magazine"
              icon={Newspaper}
              title="Department Magazine / Newsletter"
              accentColor={ac}
              index={19}
            />

            <FadeUp delay={0.08}>
              <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div
                  className="relative overflow-hidden px-6 py-8 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 75%, black) 60%, color-mix(in srgb, ${ac} 30%, ${bg}) 100%)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute top-4 right-4 h-40 w-40 rounded-full opacity-10 blur-2xl"
                    style={{ backgroundColor: ac }}
                  />
                  <p className="mb-1 text-[10px] font-black tracking-widest uppercase opacity-60">
                    Department Publication
                  </p>
                  <h3 className="mb-2 font-serif text-3xl font-black">
                    {dept.magazine.name}
                  </h3>
                  <p className="leading-relaxed opacity-75">
                    {dept.magazine.description}
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex gap-8 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Frequency</p>
                      <p className="font-bold text-gray-900">
                        {dept.magazine.frequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Latest Issue</p>
                      <p className="font-bold text-gray-900">
                        {dept.magazine.latestIssue}
                      </p>
                    </div>
                  </div>
                  <p
                    className="mb-3 text-[10px] font-black tracking-widest uppercase"
                    style={{ color: ac }}
                  >
                    Recent Highlights
                  </p>
                  <ul className="space-y-2.5">
                    {dept.magazine.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-gray-700"
                      >
                        <ChevronRight
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: ac }}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="career"
              icon={TrendingUp}
              title="Career Progression"
              accentColor={ac}
              index={20}
            />

            <FadeUp delay={0.06}>
              <div className="mb-6 grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Placement Rate",
                    value: dept.careerProgression.placementRate,
                  },
                  {
                    label: "Avg. Package",
                    value: dept.careerProgression.averagePackage,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="relative overflow-hidden rounded-2xl p-6 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 80%, black) 100%)`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-10"
                      style={{
                        background: `radial-gradient(circle at top right, ${ac}, transparent 60%)`,
                      }}
                    />
                    <p
                      className="relative font-serif text-3xl font-black"
                      style={{ color: ac }}
                    >
                      {s.value}
                    </p>
                    <p className="relative mt-1 text-sm text-white/55">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </FadeUp>

            <div className="grid gap-5 md:grid-cols-2">
              <FadeUp delay={0.1}>
                <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
                  <p
                    className="mb-4 text-[10px] font-black tracking-widest uppercase"
                    style={{ color: ac }}
                  >
                    Top Recruiters
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dept.careerProgression.topRecruiters.map((r) => (
                      <span
                        key={r}
                        className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-white"
                        style={{ backgroundColor: ac }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.13}>
                <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
                  <p
                    className="mb-4 text-[10px] font-black tracking-widest uppercase"
                    style={{ color: ac }}
                  >
                    Higher Studies
                  </p>
                  <ul className="space-y-2.5">
                    {dept.careerProgression.higherStudies.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-gray-700"
                      >
                        <ChevronRight
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: ac }}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            </div>
          </section>

          <section className="mb-20">
            <SectionHeading
              id="feedback"
              icon={MessageSquare}
              title="Feedback (Curriculum / Facility)"
              accentColor={ac}
              index={21}
            />

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  label: "Curriculum Feedback Process",
                  items: dept.feedback.curriculumProcess,
                },
                {
                  label: "Facility Feedback Process",
                  items: dept.feedback.facilityProcess,
                },
                {
                  label: "Recent Improvements",
                  items: dept.feedback.recentImprovements,
                },
              ].map((col, ci) => (
                <FadeUp key={col.label} delay={ci * 0.08}>
                  <div className="border-border rounded-2xl border bg-white p-5 shadow-sm">
                    <div
                      className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-black tracking-wider uppercase"
                      style={{ backgroundColor: `${ac}10`, color: ac }}
                    >
                      {col.label}
                    </div>
                    <ol className="space-y-3">
                      {col.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-gray-700"
                        >
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                            style={{ backgroundColor: ac }}
                          >
                            {i + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
