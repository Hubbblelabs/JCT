"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Monitor,
  FlaskConical,
  Clock,
  BookOpen,
  Trophy,
  Bus,
  Target,
  Lightbulb,
  Award,
  CheckCircle,
  MessageSquareQuote,
  School,
  Star,
  Landmark,
  Heart,
  Users,
  ShieldCheck,
  Gem,
  Handshake,
  Globe,
  Rocket,
  Briefcase,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import type { AboutPageValue, Institution } from "@/data/about-content";

// ─── Editable sections ───────────────────────────────────────────────────────

export type AboutEditableSection =
  | "hero"
  | "about"
  | "visionMission"
  | "principal"
  | "management"
  | "hod"
  | "governingCouncil"
  | "coreValues"
  | "accreditations"
  | "campusHighlights"
  | "whyJct"
  | "sidebar";

export const ABOUT_SECTION_LABELS: Record<AboutEditableSection, string> = {
  hero: "Hero",
  about: "About the Institution",
  visionMission: "Vision & Mission",
  principal: "Principal's Message",
  management: "Management",
  hod: "Administration — HOD",
  governingCouncil: "Governing Council",
  coreValues: "Core Values",
  accreditations: "Approvals & Accreditations",
  campusHighlights: "Campus Highlights",
  whyJct: "Why Choose JCT",
  sidebar: "Sidebar (Quick Facts & CTA)",
};

/** Order of editable sections — used by the admin editor's section list. */
export const ABOUT_SECTION_ORDER: AboutEditableSection[] = [
  "hero",
  "about",
  "visionMission",
  "principal",
  "management",
  "hod",
  "governingCouncil",
  "coreValues",
  "accreditations",
  "campusHighlights",
  "whyJct",
  "sidebar",
];

// ─── Theme tokens (static class strings so Tailwind keeps them) ──────────────

type ThemeTokens = {
  themeClass: string;
  accentText: string;
  iconBg20: string;
  iconBg15: string;
  softBg5: string;
  border20: string;
  border50: string;
  valueHover: string;
  navActive: string;
  navActivePill: string;
  accentDot: string;
  ctaBtn: string;
};

const THEME: Record<Institution, ThemeTokens> = {
  engineering: {
    themeClass: "",
    accentText: "text-gold",
    iconBg20: "bg-gold/20 text-gold",
    iconBg15: "bg-gold/15 text-gold",
    softBg5: "bg-gold/5",
    border20: "border-gold/20",
    border50: "border-gold/50",
    valueHover: "hover:border-gold/20 hover:bg-gold/5",
    navActive: "bg-gold/15 text-gold",
    navActivePill: "border-gold bg-gold/15 text-gold",
    accentDot: "bg-gold",
    ctaBtn: "bg-gold text-navy hover:bg-[#e8b84a]",
  },
  "arts-science": {
    themeClass: "arts-science-theme",
    accentText: "text-arts-science-accent",
    iconBg20: "bg-arts-science-accent/20 text-arts-science-accent",
    iconBg15: "bg-arts-science-accent/15 text-arts-science-accent",
    softBg5: "bg-arts-science-accent/5",
    border20: "border-arts-science-accent/20",
    border50: "border-arts-science-accent/50",
    valueHover:
      "hover:border-arts-science-accent/20 hover:bg-arts-science-accent/5",
    navActive: "bg-arts-science-accent/15 text-arts-science-accent",
    navActivePill:
      "border-arts-science-accent bg-arts-science-accent/15 text-arts-science-accent",
    accentDot: "bg-arts-science-accent",
    ctaBtn: "bg-arts-science-accent text-white hover:opacity-90",
  },
  polytechnic: {
    themeClass: "polytechnic-theme",
    accentText: "text-polytechnic",
    iconBg20: "bg-polytechnic/20 text-polytechnic",
    iconBg15: "bg-polytechnic/15 text-polytechnic",
    softBg5: "bg-polytechnic/5",
    border20: "border-polytechnic/20",
    border50: "border-polytechnic/50",
    valueHover: "hover:border-polytechnic/20 hover:bg-polytechnic/5",
    navActive: "bg-polytechnic/15 text-polytechnic",
    navActivePill: "border-polytechnic bg-polytechnic/15 text-polytechnic",
    accentDot: "bg-polytechnic",
    ctaBtn: "bg-polytechnic text-white hover:opacity-90",
  },
};

const INSTITUTION_META: Record<
  Institution,
  { label: string; breadcrumbHref: string; whyTitle: string }
> = {
  engineering: {
    label: "Engineering",
    breadcrumbHref: "/institutions/engineering",
    whyTitle: "Why Choose JCT Engineering?",
  },
  "arts-science": {
    label: "Arts & Science",
    breadcrumbHref: "/institutions/arts-science",
    whyTitle: "Why Choose JCT Arts & Science?",
  },
  polytechnic: {
    label: "Polytechnic",
    breadcrumbHref: "/institutions/polytechnic",
    whyTitle: "Why Choose JCT Polytechnic?",
  },
};

// Position-based icons — Lucide icons cannot be persisted in the DB, so the
// admin edits titles/descriptions while icons cycle by list index.
const CAMPUS_ICONS: LucideIcon[] = [
  Monitor,
  FlaskConical,
  Clock,
  BookOpen,
  Trophy,
  Bus,
  School,
  Globe,
];
const VALUE_ICONS: LucideIcon[] = [
  ShieldCheck,
  Gem,
  Handshake,
  Globe,
  Rocket,
  Heart,
  Star,
  Award,
];

// Section anchors used by the on-page side navigation.
const NAV_SECTIONS: {
  anchor: string;
  navLabel: string;
  icon: LucideIcon;
}[] = [
  { anchor: "about", navLabel: "About", icon: Landmark },
  { anchor: "vision", navLabel: "Vision & Mission", icon: Target },
  {
    anchor: "principal",
    navLabel: "Principal's Message",
    icon: MessageSquareQuote,
  },
  { anchor: "management", navLabel: "Management", icon: Briefcase },
  { anchor: "hod", navLabel: "Administration — HOD", icon: BookOpen },
  { anchor: "governing-council", navLabel: "Governing Council", icon: Users },
  { anchor: "core-values", navLabel: "Core Values", icon: Heart },
  { anchor: "accreditations", navLabel: "Accreditations", icon: Award },
  { anchor: "campus", navLabel: "Campus", icon: School },
  { anchor: "why-jct", navLabel: "Why JCT?", icon: Star },
];

const imgUrl = (v: string) => getImageUrl(v) || v || "/avatars/male_avatar.png";

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  title,
  theme,
}: {
  icon: LucideIcon;
  title: string;
  theme: ThemeTokens;
}) {
  return (
    <h2 className="text-foreground mb-5 flex items-center gap-3 font-serif text-2xl font-bold md:text-3xl">
      <span
        className={`${theme.iconBg20} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl`}
      >
        <Icon size={20} />
      </span>
      {title}
    </h2>
  );
}

function AboutSideNav({
  data,
  theme,
  activeId,
  setActiveId,
  editable,
  onEditSection,
}: {
  data: AboutPageValue;
  theme: ThemeTokens;
  activeId: string;
  setActiveId: (id: string) => void;
  editable?: boolean;
  onEditSection?: (section: AboutEditableSection) => void;
}) {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ anchor }) => {
      const el = document.getElementById(anchor);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(anchor);
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [setActiveId]);

  const handleClick = (id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const facts = data.sidebar.quickFacts;
  const cta = { label: data.sidebar.ctaLabel, href: data.sidebar.ctaHref };

  return (
    <>
      {/* Mobile pill bar */}
      <div className="-mx-4 w-full overflow-x-auto px-4 pb-2 lg:hidden">
        <div className="flex w-max gap-2">
          {NAV_SECTIONS.map(({ anchor, navLabel, icon: Icon }) => {
            const isActive = activeId === anchor;
            return (
              <button
                key={anchor}
                onClick={() => handleClick(anchor)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? theme.navActivePill
                    : "text-muted-foreground hover:text-foreground border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <Icon size={13} className="shrink-0" />
                {navLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop sticky sidebar */}
      <div className="bg-surface border-border hidden rounded-3xl border p-6 lg:block">
        <h3 className="mb-5 border-b border-white/10 pb-4 text-sm font-bold tracking-wider uppercase">
          On This Page
        </h3>
        <nav className="space-y-1">
          {NAV_SECTIONS.map(({ anchor, navLabel, icon: Icon }) => {
            const isActive = activeId === anchor;
            return (
              <button
                key={anchor}
                onClick={() => handleClick(anchor)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  isActive
                    ? theme.navActive
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? theme.accentText
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span>{navLabel}</span>
                {isActive && (
                  <span
                    className={`${theme.accentDot} ml-auto h-1.5 w-1.5 rounded-full`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Facts + CTA — editable as the "sidebar" section */}
        <EditableRegion
          as="div"
          section="sidebar"
          label={ABOUT_SECTION_LABELS.sidebar}
          editable={editable}
          onEditSection={onEditSection}
        >
          <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
            <h3 className="text-sm font-bold tracking-wider uppercase">
              Quick Facts
            </h3>
            <div className="space-y-3">
              {facts.map((fact, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {fact.label}
                  </span>
                  <span className="text-foreground text-sm font-bold">
                    {fact.value}
                  </span>
                </div>
              ))}
              {data.sidebar.counsellingCode && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Counselling Code
                  </span>
                  <span className={`${theme.accentText} text-2xl font-bold`}>
                    {data.sidebar.counsellingCode}
                  </span>
                </div>
              )}
            </div>
          </div>
          {cta.label && (
            <Link
              href={cta.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={editable ? (e) => e.preventDefault() : undefined}
              className={`${theme.ctaBtn} mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-center font-bold transition-colors`}
            >
              {cta.label}
              <ChevronRight size={16} />
            </Link>
          )}
        </EditableRegion>
      </div>
    </>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export function AboutPageLayout({
  data,
  institution,
  editable = false,
  onEditSection,
}: {
  data: AboutPageValue;
  institution: Institution;
  editable?: boolean;
  onEditSection?: (section: AboutEditableSection) => void;
}) {
  const theme = THEME[institution];
  const meta = INSTITUTION_META[institution];
  const [activeId, setActiveId] = useState<string>("about");

  // In editable mode every section stays visible so it can be selected.
  const sectionVis = (anchor: string) =>
    editable
      ? "block"
      : activeId === anchor
        ? "block opacity-100"
        : "hidden lg:block lg:opacity-100";

  return (
    <main
      className={`bg-surface text-foreground min-h-screen ${theme.themeClass}`}
    >
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={ABOUT_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEditSection}
      >
        <PageHero title={data.hero.title} subtitle={data.hero.subtitle} />
      </EditableRegion>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: meta.label, href: meta.breadcrumbHref },
            { label: "About" },
          ]}
        />

        <div id="mobile-nav-container" className="mt-8 lg:hidden">
          <AboutSideNav
            data={data}
            theme={theme}
            activeId={activeId}
            setActiveId={setActiveId}
            editable={editable}
            onEditSection={onEditSection}
          />
        </div>

        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:grid-cols-[300px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <AboutSideNav
                data={data}
                theme={theme}
                activeId={activeId}
                setActiveId={setActiveId}
                editable={editable}
                onEditSection={onEditSection}
              />
            </div>
          </div>

          <div className="mt-8 min-w-0 space-y-16 lg:mt-0">
            {/* 1. About */}
            <EditableRegion
              as="section"
              id="about"
              section="about"
              label={ABOUT_SECTION_LABELS.about}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("about")}`}
            >
              <SectionHeading
                icon={Landmark}
                title="About the Institution"
                theme={theme}
              />
              <div className="text-muted-foreground space-y-4 text-base leading-relaxed md:text-lg">
                {data.about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {data.about.stats.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <p
                      className={`${theme.accentText} text-2xl font-bold md:text-3xl`}
                    >
                      {s.value}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </EditableRegion>

            {/* 2. Vision & Mission */}
            <EditableRegion
              as="section"
              id="vision"
              section="visionMission"
              label={ABOUT_SECTION_LABELS.visionMission}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("vision")}`}
            >
              <SectionHeading
                icon={Target}
                title="Vision & Mission"
                theme={theme}
              />
              <div className="mb-4 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <div
                  className={`${theme.iconBg15} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl`}
                >
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-foreground mb-2 text-lg font-bold">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                    {data.visionMission.visionText}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <div
                  className={`${theme.iconBg15} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl`}
                >
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3 className="text-foreground mb-3 text-lg font-bold">
                    Our Mission
                  </h3>
                  <ul className="space-y-2">
                    {data.visionMission.missionPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground flex items-start gap-2.5 text-sm leading-relaxed md:text-base"
                      >
                        <CheckCircle
                          size={15}
                          className={`${theme.accentText} mt-0.5 shrink-0`}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {data.visionMission.qualityPolicy && (
                <div
                  className={`${theme.border20} ${theme.softBg5} mt-4 rounded-2xl border p-5 md:p-6`}
                >
                  <h3 className="text-foreground mb-2 flex items-center gap-2 text-lg font-bold">
                    <ShieldCheck size={18} className={theme.accentText} />
                    Quality Policy
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                    {data.visionMission.qualityPolicy}
                  </p>
                </div>
              )}
            </EditableRegion>

            {/* 3. Principal's Message */}
            <EditableRegion
              as="section"
              id="principal"
              section="principal"
              label={ABOUT_SECTION_LABELS.principal}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("principal")}`}
            >
              <SectionHeading
                icon={MessageSquareQuote}
                title="Principal's Message"
                theme={theme}
              />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start md:p-8">
                  <div className="flex flex-col items-center gap-3 sm:w-44 sm:shrink-0">
                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-56 sm:w-44">
                      <Image
                        src={imgUrl(data.principal.image)}
                        alt={data.principal.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 144px, 176px"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold">
                        {data.principal.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {data.principal.role}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {data.principal.institution}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <blockquote
                      className={`text-foreground/90 ${theme.border50} border-l-4 pl-5 text-base leading-relaxed italic md:text-lg`}
                    >
                      &quot;{data.principal.quote}&quot;
                    </blockquote>
                    {data.principal.messages.map((msg, i) => (
                      <p
                        key={i}
                        className="text-muted-foreground text-sm leading-relaxed md:text-base"
                      >
                        {msg}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </EditableRegion>

            {/* 4. Management */}
            <EditableRegion
              as="section"
              id="management"
              section="management"
              label={ABOUT_SECTION_LABELS.management}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("management")}`}
            >
              <SectionHeading
                icon={Briefcase}
                title="Management"
                theme={theme}
              />
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                {data.management.description}
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {data.management.members.map((person, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                        <Image
                          src={imgUrl(person.image)}
                          alt={person.name}
                          fill
                          className="object-cover object-top"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-bold md:text-base">
                          {person.name}
                        </p>
                        <p
                          className={`${theme.accentText} text-xs font-medium md:text-sm`}
                        >
                          {person.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
                      {person.bio}
                    </p>
                  </div>
                ))}
              </div>
            </EditableRegion>

            {/* 5. Administration — HOD */}
            <EditableRegion
              as="section"
              id="hod"
              section="hod"
              label={ABOUT_SECTION_LABELS.hod}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("hod")}`}
            >
              <SectionHeading
                icon={BookOpen}
                title="Administration — HOD"
                theme={theme}
              />
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                {data.hod.description}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.hod.members.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                      <Image
                        src={imgUrl(d.avatar)}
                        alt={d.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h4 className="text-foreground text-sm leading-tight font-bold">
                        {d.name}
                      </h4>
                      <p
                        className={`${theme.accentText} mt-0.5 text-[11px] font-medium`}
                      >
                        {d.designation}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px] leading-tight font-medium">
                        {d.dept}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </EditableRegion>

            {/* 6. Governing Council */}
            <EditableRegion
              as="section"
              id="governing-council"
              section="governingCouncil"
              label={ABOUT_SECTION_LABELS.governingCouncil}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("governing-council")}`}
            >
              <SectionHeading
                icon={Users}
                title="Governing Council"
                theme={theme}
              />
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                {data.governingCouncil.description}
              </p>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        S.No
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Member
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.governingCouncil.members.map((m, i) => (
                      <tr
                        key={i}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {i + 1}
                        </td>
                        <td className="text-foreground px-4 py-3 font-medium">
                          {m.name}
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {m.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </EditableRegion>

            {/* 7. Core Values */}
            <EditableRegion
              as="section"
              id="core-values"
              section="coreValues"
              label={ABOUT_SECTION_LABELS.coreValues}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("core-values")}`}
            >
              <SectionHeading icon={Heart} title="Core Values" theme={theme} />
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {data.coreValues.map((val, i) => {
                  const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                  return (
                    <div
                      key={i}
                      className={`${theme.valueHover} flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors`}
                    >
                      <div
                        className={`${theme.iconBg15} flex h-10 w-10 items-center justify-center rounded-xl`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-foreground mb-1.5 text-sm font-bold md:text-base">
                          {val.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
                          {val.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </EditableRegion>

            {/* 8. Accreditations */}
            <EditableRegion
              as="section"
              id="accreditations"
              section="accreditations"
              label={ABOUT_SECTION_LABELS.accreditations}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("accreditations")}`}
            >
              <SectionHeading
                icon={Award}
                title="Approvals & Accreditations"
                theme={theme}
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {data.accreditations.map((acc, i) => (
                  <div
                    key={i}
                    className="bg-surface border-border flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-10 w-full">
                      <Image
                        src={imgUrl(acc.logo)}
                        alt={acc.name}
                        fill
                        className="object-contain"
                        sizes="120px"
                      />
                    </div>
                    <div>
                      <h3 className="text-foreground text-xs font-bold">
                        {acc.name}
                      </h3>
                      <p className="text-muted-foreground mt-0.5 text-[10px]">
                        {acc.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </EditableRegion>

            {/* 9. Campus Highlights */}
            <EditableRegion
              as="section"
              id="campus"
              section="campusHighlights"
              label={ABOUT_SECTION_LABELS.campusHighlights}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("campus")}`}
            >
              <SectionHeading
                icon={School}
                title="Campus Highlights"
                theme={theme}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {data.campusHighlights.map((feature, i) => {
                  const Icon = CAMPUS_ICONS[i % CAMPUS_ICONS.length];
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                    >
                      <div
                        className={`${theme.iconBg20} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-semibold md:text-base">
                          {feature.title}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs leading-relaxed md:text-sm">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </EditableRegion>

            {/* 10. Why Choose JCT */}
            <EditableRegion
              as="section"
              id="why-jct"
              section="whyJct"
              label={ABOUT_SECTION_LABELS.whyJct}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("why-jct")}`}
            >
              <SectionHeading icon={Star} title={meta.whyTitle} theme={theme} />
              <div className="flex flex-wrap gap-2.5">
                {data.whyJct.map((point, i) => (
                  <span
                    key={i}
                    className="bg-surface flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium md:text-sm"
                  >
                    <CheckCircle
                      size={13}
                      className={`${theme.accentText} shrink-0`}
                    />
                    {point}
                  </span>
                ))}
              </div>
            </EditableRegion>
          </div>
        </div>
      </div>

      {!editable && <Footer />}
    </main>
  );
}
