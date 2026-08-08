"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
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
  ClipboardList,
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
  Mail,
  X,
  User,
  type LucideIcon,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import type {
  AboutPageValue,
  ContentPageValue,
  PageBodySection,
} from "@/lib/validation";
import { PageBlocksRenderer } from "@/components/shared/PageBlocksRenderer";
import { ContentPageBody } from "@/components/layout/ContentPageLayout";
import { hostedSectionKey } from "@/lib/content-pages";
import {
  resolveSidebarItems,
  type ResolvedSidebarItem,
  type SidebarNavDefault,
} from "@/lib/sidebar-nav";

type Institution = "main" | "engineering" | "arts-science" | "polytechnic";

/**
 * A content page (see `content-pages.ts`) hosted as a panel of this page's
 * sidebar instead of a route of its own — e.g. Engineering's Timeline. Both
 * the public route and the admin preview pass `data`; the admin also passes
 * `slug`, which turns the panel into a click-to-edit region whose inspector
 * keys are namespaced (`hosted:<slug>:<section>`). `href` remains for a
 * link-only entry.
 *
 * `icon` arrives pre-rendered (`<Icon />`), not as a component reference: the
 * public route builds this on the server and a bare component reference
 * cannot cross into this client component, only a rendered element can. The
 * wrapper sets size/colour via CSS, which lucide icons pick up through
 * `currentColor`.
 */
export type AboutHostedItem = {
  anchor: string;
  navLabel: string;
  icon: ReactNode;
  data?: ContentPageValue;
  href?: string;
  /** Set in the admin preview — makes this panel editable in place. */
  slug?: string;
};

type PersonModalData = {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  email?: string;
  quote?: string;
  messages?: string[];
  bio?: string;
};

// ─── Editable sections ───────────────────────────────────────────────────────

export type AboutEditableSection =
  | "hero"
  | "about"
  | "visionMission"
  | "qualityPolicy"
  | "planningBoard"
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
  qualityPolicy: "Quality Policy",
  planningBoard: "Planning & Monitoring Board",
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
  "qualityPolicy",
  "principal",
  "management",
  "hod",
  "governingCouncil",
  "planningBoard",
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
  main: {
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
  main: {
    label: "JCT Institutions",
    breadcrumbHref: "/",
    whyTitle: "Why Choose JCT?",
  },
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
export const ABOUT_NAV_DEFAULTS: SidebarNavDefault[] = [
  { anchor: "about", navLabel: "About", icon: Landmark },
  { anchor: "vision", navLabel: "Vision & Mission", icon: Target },
  { anchor: "quality-policy", navLabel: "Quality Policy", icon: ShieldCheck },
  {
    anchor: "principal",
    navLabel: "Principal's Message",
    icon: MessageSquareQuote,
  },
  { anchor: "management", navLabel: "Management", icon: Briefcase },
  { anchor: "hod", navLabel: "Administration — HOD", icon: BookOpen },
  { anchor: "governing-council", navLabel: "Governing Council", icon: Users },
  {
    anchor: "planning-board",
    navLabel: "Planning & Monitoring Board",
    icon: ClipboardList,
  },
  { anchor: "core-values", navLabel: "Core Values", icon: Heart },
  { anchor: "accreditations", navLabel: "Accreditations", icon: Award },
  { anchor: "campus", navLabel: "Campus", icon: School },
  { anchor: "why-jct", navLabel: "Why JCT?", icon: Star },
];

// Images come only from storage/CMS. Empty value -> "" so the call site skips the
// <Image> and the neutral wrapper (bg-white/5 etc.) shows as the placeholder.
const imgUrl = (v: string) => getImageUrl(v) || "";

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
  visibleAnchors,
  hosted,
  editable,
  onEditSection,
}: {
  data: AboutPageValue;
  theme: ThemeTokens;
  activeId: string;
  setActiveId: (id: string) => void;
  /** Built-in anchors that actually render — others are dropped from the nav
   * so a link never scrolls to a section hidden for lack of content. */
  visibleAnchors: Set<string>;
  /** Content pages hosted as extra panels of this sidebar (e.g. Timeline). */
  hosted?: AboutHostedItem[];
  editable?: boolean;
  onEditSection?: (section: string) => void;
}) {
  const navItems: ResolvedSidebarItem[] = resolveSidebarItems(
    ABOUT_NAV_DEFAULTS,
    data.sidebar.navItems,
  ).filter(
    (n) => n.customHref || n.customSection || visibleAnchors.has(n.anchor),
  );
  const builtins = navItems.filter((n) => !n.customHref);
  // Only the entries with real content render an element to observe — the
  // admin-preview link-only entries have no in-page anchor.
  const hostedPanels = (hosted ?? []).filter((h) => !h.href);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    const observers: IntersectionObserver[] = [];
    [...builtins, ...hostedPanels].forEach(({ anchor }) => {
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
  }, [setActiveId, builtins, hostedPanels]);

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
      <EditableRegion
        as="div"
        section="sidebar"
        label={ABOUT_SECTION_LABELS.sidebar}
        editable={editable}
        onEditSection={onEditSection}
        className="-mx-4 w-full overflow-x-auto px-4 pb-2 lg:hidden"
      >
        <div className="flex w-max gap-2">
          {navItems.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? theme.navActivePill
                : "text-muted-foreground hover:text-foreground border-white/10 bg-white/5 hover:border-white/20"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
                  onClick={editable ? (e) => e.preventDefault() : undefined}
                  className={cls}
                >
                  <Icon size={13} className="shrink-0" />
                  {it.navLabel}
                </Link>
              );
            }
            return (
              <button
                key={it.id}
                onClick={editable ? undefined : () => handleClick(it.anchor)}
                className={cls}
              >
                <Icon size={13} className="shrink-0" />
                {it.navLabel}
              </button>
            );
          })}
          {(hosted ?? []).map((h) => {
            const isActive = !h.href && activeId === h.anchor;
            const cls = `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? theme.navActivePill
                : "text-muted-foreground hover:text-foreground border-white/10 bg-white/5 hover:border-white/20"
            }`;
            const icon = (
              <span className="shrink-0 [&>svg]:size-3.5">{h.icon}</span>
            );
            // A hosted page's link (admin preview only) always navigates —
            // it opens the page's own editor, not a link an admin authored.
            if (h.href) {
              return (
                <Link key={`h:${h.anchor}`} href={h.href} className={cls}>
                  {icon}
                  {h.navLabel}
                </Link>
              );
            }
            return (
              <button
                key={`h:${h.anchor}`}
                onClick={editable ? undefined : () => handleClick(h.anchor)}
                className={cls}
              >
                {icon}
                {h.navLabel}
              </button>
            );
          })}
        </div>
      </EditableRegion>

      {/* Desktop sticky sidebar — whole card is editable as "sidebar" section */}
      <EditableRegion
        as="div"
        section="sidebar"
        label={ABOUT_SECTION_LABELS.sidebar}
        editable={editable}
        onEditSection={onEditSection}
        className="bg-surface border-border hidden rounded-3xl border p-6 lg:block"
      >
        <h3 className="mb-5 border-b border-white/10 pb-4 text-sm font-bold tracking-wider uppercase">
          On This Page
        </h3>
        <nav className="space-y-1">
          {navItems.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
              isActive
                ? theme.navActive
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`;
            const iconCls = `shrink-0 transition-colors ${
              isActive
                ? theme.accentText
                : "text-muted-foreground group-hover:text-foreground"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
                  onClick={editable ? (e) => e.preventDefault() : undefined}
                  className={cls}
                >
                  <Icon size={16} className={iconCls} />
                  <span>{it.navLabel}</span>
                </Link>
              );
            }
            return (
              <button
                key={it.id}
                onClick={editable ? undefined : () => handleClick(it.anchor)}
                className={cls}
              >
                <Icon size={16} className={iconCls} />
                <span>{it.navLabel}</span>
                {isActive && (
                  <span
                    className={`${theme.accentDot} ml-auto h-1.5 w-1.5 rounded-full`}
                  />
                )}
              </button>
            );
          })}
          {(hosted ?? []).map((h) => {
            const isActive = !h.href && activeId === h.anchor;
            const cls = `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
              isActive
                ? theme.navActive
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`;
            const iconCls = `shrink-0 transition-colors [&>svg]:size-4 ${
              isActive
                ? theme.accentText
                : "text-muted-foreground group-hover:text-foreground"
            }`;
            if (h.href) {
              return (
                <Link key={`h:${h.anchor}`} href={h.href} className={cls}>
                  <span className={iconCls}>{h.icon}</span>
                  <span>{h.navLabel}</span>
                </Link>
              );
            }
            return (
              <button
                key={`h:${h.anchor}`}
                onClick={editable ? undefined : () => handleClick(h.anchor)}
                className={cls}
              >
                <span className={iconCls}>{h.icon}</span>
                <span>{h.navLabel}</span>
                {isActive && (
                  <span
                    className={`${theme.accentDot} ml-auto h-1.5 w-1.5 rounded-full`}
                  />
                )}
              </button>
            );
          })}
        </nav>

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
    </>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export function AboutPageLayout({
  data,
  institution,
  editable = false,
  onEditSection,
  hosted = [],
}: {
  data: AboutPageValue;
  institution: Institution;
  editable?: boolean;
  onEditSection?: (section: string) => void;
  /** Content pages hosted as extra panels of this sidebar (e.g. Timeline). */
  hosted?: AboutHostedItem[];
}) {
  const theme = THEME[institution];
  const meta = INSTITUTION_META[institution];
  const [activeId, setActiveId] = useState<string>("about");
  const [activePerson, setActivePerson] = useState<PersonModalData | null>(
    null,
  );

  useEffect(() => {
    if (!activePerson) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePerson(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activePerson]);

  const openPerson = (person: PersonModalData, e: MouseEvent) => {
    if (editable) return;
    e.stopPropagation();
    setActivePerson(person);
  };

  const resolved = resolveSidebarItems(
    ABOUT_NAV_DEFAULTS,
    data.sidebar.navItems,
  );
  const customSections = resolved.filter((r) => r.customSection);

  // Added after the About configs were first stored, so a document written
  // before this section existed simply has no key — read it as empty (the
  // section then stays hidden) rather than substituting canned copy.
  const qualityPolicy = {
    intro: data.qualityPolicy?.intro ?? "",
    points: data.qualityPolicy?.points ?? [],
  };
  const planningBoard = {
    paragraphs: data.planningBoard?.paragraphs ?? [],
    members: data.planningBoard?.members ?? [],
  };

  // In editable mode every section stays visible so it can be selected.
  const mobileVis = (anchor: string) =>
    editable
      ? "block"
      : activeId === anchor
        ? "block opacity-100"
        : "hidden lg:block lg:opacity-100";

  const sectionHasContent = (anchor: string): boolean => {
    switch (anchor) {
      case "about":
        return data.about.paragraphs.some((p) => p.trim() !== "");
      case "vision":
        return (
          data.visionMission.visionText.trim() !== "" ||
          data.visionMission.missionPoints.length > 0
        );
      case "quality-policy":
        return (
          qualityPolicy.intro.trim() !== "" || qualityPolicy.points.length > 0
        );
      case "planning-board":
        return (
          planningBoard.paragraphs.length > 0 ||
          planningBoard.members.length > 0
        );
      case "principal":
        return data.principal.name.trim() !== "";
      case "management":
        return data.management.members.length > 0;
      case "hod":
        return data.hod.members.length > 0;
      case "governing-council":
        return data.governingCouncil.members.length > 0;
      case "core-values":
        return data.coreValues.length > 0;
      case "accreditations":
        return data.accreditations.length > 0;
      case "campus":
        return data.campusHighlights.length > 0;
      case "why-jct":
        return data.whyJct.length > 0;
      default:
        return true;
    }
  };

  // Anchors the sidebar nav will show — filtered by content in view mode.
  const visibleBuiltins = new Set(
    resolved
      .filter((r) => !r.customHref && !r.customSection)
      .filter((r) => editable || sectionHasContent(r.anchor))
      .map((r) => r.anchor),
  );

  const sectionVis = (anchor: string) => {
    if (!editable && !visibleBuiltins.has(anchor)) return "hidden";
    return mobileVis(anchor);
  };

  // Like sectionVis, but visible if ANY of the given anchors qualifies —
  // used for elements (e.g. a shared heading) that span multiple sections.
  const sectionVisAny = (...anchors: string[]) => {
    if (!editable && !anchors.some((a) => visibleBuiltins.has(a))) {
      return "hidden";
    }
    if (editable) return "block";
    if (anchors.some((a) => activeId === a)) return "block opacity-100";
    return "hidden lg:block lg:opacity-100";
  };

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
          items={
            institution === "main"
              ? [{ label: "Home", href: "/" }, { label: "About Us" }]
              : [
                  { label: "Institutions", href: "/institutions" },
                  { label: meta.label, href: meta.breadcrumbHref },
                  { label: "About" },
                ]
          }
        />

        <div id="mobile-nav-container" className="mt-8 lg:hidden">
          <AboutSideNav
            data={data}
            theme={theme}
            activeId={activeId}
            setActiveId={setActiveId}
            visibleAnchors={visibleBuiltins}
            hosted={hosted}
            editable={editable}
            onEditSection={onEditSection}
          />
        </div>

        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:grid-cols-[300px_1fr]">
          <div className="hidden lg:block">
            {/* Capped to the viewport and scrollable so a long nav list stays
                fully reachable — a pinned element can't be scrolled into view
                by the page scroll. The cap subtracts the `top-32` offset plus
                the bottom band held by the floating Apply / WhatsApp buttons,
                so the rail never ends underneath them. */}
            <div className="sticky top-32 max-h-[calc(100vh-14rem)] overflow-y-auto overscroll-contain">
              <AboutSideNav
                data={data}
                theme={theme}
                activeId={activeId}
                setActiveId={setActiveId}
                visibleAnchors={visibleBuiltins}
                hosted={hosted}
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
              <div className="text-muted-foreground space-y-4 text-justify text-base leading-relaxed md:text-lg">
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
            </EditableRegion>

            {/* 3. Quality Policy */}
            <EditableRegion
              as="section"
              id="quality-policy"
              section="qualityPolicy"
              label={ABOUT_SECTION_LABELS.qualityPolicy}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("quality-policy")}`}
            >
              <SectionHeading
                icon={ShieldCheck}
                title="Quality Policy"
                theme={theme}
              />
              <div
                className={`${theme.border20} ${theme.softBg5} rounded-2xl border p-5 md:p-6`}
              >
                {qualityPolicy.intro && (
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed md:text-base">
                    {qualityPolicy.intro}
                  </p>
                )}
                <ul className="space-y-3">
                  {qualityPolicy.points.map((point, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex items-start gap-2.5 text-sm leading-relaxed md:text-base"
                    >
                      <CheckCircle
                        size={15}
                        className={`${theme.accentText} mt-1 shrink-0`}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </EditableRegion>

            {/* 3. Leadership heading (shared by Principal + Management) */}
            <div
              className={`text-center transition-all duration-300 ${sectionVisAny("principal", "management")}`}
            >
              <h2
                className={`${theme.accentText} font-serif text-xl font-black tracking-wide uppercase md:text-2xl`}
              >
                {data.management.tagline ||
                  "Great Minds. Passionate Leaders. One Vision."}
              </h2>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <span
                  className={`h-1 w-16 rounded-full bg-current ${theme.accentText}`}
                />
                <span
                  className={`h-1 w-6 rounded-full bg-current opacity-70 ${theme.accentText}`}
                />
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-current opacity-50 ${theme.accentText}`}
                />
              </div>
            </div>

            {/* 4. Principal */}
            <EditableRegion
              as="section"
              id="principal"
              section="principal"
              label={ABOUT_SECTION_LABELS.principal}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("principal")}`}
            >
              <div
                className={`${theme.softBg5} ${theme.border20} rounded-3xl border p-6 md:p-10`}
              >
                <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left md:gap-10">
                  <div className="relative h-48 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg sm:h-60 sm:w-48 md:h-64 md:w-52">
                    {imgUrl(data.principal.image) ? (
                      <Image
                        src={imgUrl(data.principal.image)}
                        alt={data.principal.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 160px, 208px"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col items-center sm:items-start">
                    <p className="text-foreground text-2xl font-bold md:text-3xl">
                      {data.principal.name}
                    </p>
                    <p
                      className={`${theme.accentText} mt-1 text-base font-semibold md:text-lg`}
                    >
                      {data.principal.role}
                    </p>
                    {data.principal.institution && (
                      <p className="text-muted-foreground mt-0.5 text-sm">
                        {data.principal.institution}
                      </p>
                    )}
                    {(data.principal.linkedin || data.principal.email) && (
                      <div className="mt-4 flex items-center gap-2">
                        {data.principal.linkedin && (
                          <a
                            href={data.principal.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`${data.principal.name} on LinkedIn`}
                            className={`${theme.accentText} flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10`}
                          >
                            <FaLinkedinIn size={16} />
                          </a>
                        )}
                        {data.principal.email && (
                          <a
                            href={`mailto:${data.principal.email}`}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Email ${data.principal.name}`}
                            className={`${theme.accentText} flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10`}
                          >
                            <Mail size={16} />
                          </a>
                        )}
                      </div>
                    )}
                    {data.principal.quote && (
                      <blockquote
                        className={`text-foreground/80 ${theme.border50} mt-4 line-clamp-2 border-l-4 pl-4 text-sm leading-relaxed italic md:text-base`}
                      >
                        &quot;{data.principal.quote}&quot;
                      </blockquote>
                    )}
                    {(data.principal.quote ||
                      data.principal.messages.length > 0) && (
                      <button
                        type="button"
                        onClick={(e) =>
                          openPerson(
                            {
                              name: data.principal.name,
                              role: `${data.principal.role}${data.principal.institution ? ` · ${data.principal.institution}` : ""}`,
                              image: data.principal.image,
                              linkedin: data.principal.linkedin,
                              email: data.principal.email,
                              quote: data.principal.quote,
                              messages: data.principal.messages,
                            },
                            e,
                          )
                        }
                        className={`${theme.accentText} mt-4 flex items-center gap-1 self-center text-sm font-semibold hover:underline sm:self-end`}
                      >
                        Know more
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </EditableRegion>

            {/* 5. Management */}
            <EditableRegion
              as="section"
              id="management"
              section="management"
              label={ABOUT_SECTION_LABELS.management}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("management")}`}
            >
              {data.management.description && (
                <p className="text-muted-foreground mb-6 text-center text-sm leading-relaxed md:text-base">
                  {data.management.description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {data.management.members.map((person, i) => (
                  <div
                    key={i}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:bg-white/10 md:p-6"
                  >
                    <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10 transition-transform group-hover:scale-[1.02]">
                      {imgUrl(person.image) ? (
                        <Image
                          src={imgUrl(person.image)}
                          alt={person.name}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 45vw, 320px"
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                          <User size={48} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-foreground text-base font-bold md:text-lg">
                        {person.name}
                      </p>
                      <p
                        className={`${theme.accentText} mt-0.5 text-xs font-medium md:text-sm`}
                      >
                        {person.role}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) =>
                        openPerson(
                          {
                            name: person.name,
                            role: person.role,
                            image: person.image,
                            bio: person.bio,
                          },
                          e,
                        )
                      }
                      className={`${theme.accentText} flex items-center gap-1 self-end text-sm font-semibold hover:underline`}
                    >
                      Know more
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </EditableRegion>

            {/* 6. Administration — HOD */}
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
                      {imgUrl(d.avatar) && (
                        <Image
                          src={imgUrl(d.avatar)}
                          alt={d.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
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

            {/* 6b. Planning & Monitoring Board */}
            <EditableRegion
              as="section"
              id="planning-board"
              section="planningBoard"
              label={ABOUT_SECTION_LABELS.planningBoard}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("planning-board")}`}
            >
              <SectionHeading
                icon={ClipboardList}
                title="Planning & Monitoring Board"
                theme={theme}
              />
              <div className="text-muted-foreground mb-8 space-y-3 text-sm leading-relaxed md:text-base">
                {planningBoard.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        S.No
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Name
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Position
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Category
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Qualification
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {planningBoard.members.map((m, i) => (
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
                        <td
                          className={`${theme.accentText} px-4 py-3 text-xs font-semibold`}
                        >
                          {m.position}
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {m.category}
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {m.qualification}
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
                      {imgUrl(acc.logo) && (
                        <Image
                          src={imgUrl(acc.logo)}
                          alt={acc.name}
                          fill
                          className="object-contain"
                          sizes="120px"
                        />
                      )}
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

            {/* Custom in-page sections (admin-defined sidebar items) */}
            {customSections.map((sec) => (
              <EditableRegion
                key={sec.id}
                as="section"
                id={sec.anchor}
                section={`custom:${sec.anchor}`}
                label={sec.navLabel}
                editable={editable}
                onEditSection={onEditSection}
                className={`scroll-mt-28 transition-all duration-300 ${mobileVis(sec.anchor)}`}
              >
                <h2
                  className={`mb-6 flex items-center gap-3 font-serif text-2xl font-bold md:text-3xl`}
                >
                  <span
                    className={`${theme.iconBg20} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl`}
                  >
                    <sec.icon size={20} />
                  </span>
                  {sec.navLabel}
                </h2>
                {editable && (!sec.blocks || sec.blocks.length === 0) ? (
                  <div className="text-muted-foreground rounded-xl border-2 border-dashed border-white/10 py-8 text-center text-sm">
                    Click to add content blocks
                  </div>
                ) : (
                  <PageBlocksRenderer
                    blocks={(sec.blocks ?? []) as unknown as PageBodySection[]}
                  />
                )}
              </EditableRegion>
            ))}

            {/* Hosted content pages (e.g. Timeline). They render inline on the
                public route and in the admin preview alike — in the admin the
                `slug` makes every region click-to-edit, so the host editor is
                the one place the whole merged page is authored. */}
            {hosted
              .filter((h): h is AboutHostedItem & { data: ContentPageValue } =>
                Boolean(h.data),
              )
              .map((h) => {
                const hostedEditable = editable && !!h.slug;
                const key = (s: string) => hostedSectionKey(h.slug!, s);
                return (
                  <section
                    key={h.anchor}
                    id={h.anchor}
                    className={`scroll-mt-28 transition-all duration-300 ${mobileVis(h.anchor)}`}
                  >
                    <EditableRegion
                      as="div"
                      section={hostedEditable ? key("hero") : ""}
                      label={`${h.navLabel} — Heading`}
                      editable={hostedEditable}
                      onEditSection={onEditSection}
                    >
                      <h2 className="text-foreground mb-5 flex items-center gap-3 font-serif text-2xl font-bold md:text-3xl">
                        <span
                          className={`${theme.iconBg20} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:size-5`}
                        >
                          {h.icon}
                        </span>
                        {h.data.hero?.title?.trim() || h.navLabel}
                      </h2>
                    </EditableRegion>
                    <ContentPageBody
                      data={h.data}
                      editable={hostedEditable}
                      onEditSection={
                        hostedEditable
                          ? (s) => onEditSection?.(key(s))
                          : undefined
                      }
                    />
                  </section>
                );
              })}
          </div>
        </div>
      </div>

      {!editable && <Footer />}

      {activePerson && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm md:p-6"
          onClick={() => setActivePerson(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-surface relative flex max-h-[90vh] w-full max-w-lg flex-col items-center overflow-y-auto rounded-2xl border border-white/10 p-6 text-center shadow-xl md:max-w-xl md:p-8"
          >
            <button
              type="button"
              onClick={() => setActivePerson(null)}
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-sm transition hover:bg-black/60 md:top-4 md:right-4"
            >
              <X size={18} />
            </button>
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:h-48 md:w-48">
              {imgUrl(activePerson.image) ? (
                <Image
                  src={imgUrl(activePerson.image)}
                  alt={activePerson.name}
                  fill
                  className="object-cover object-top"
                  sizes="192px"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                  <User size={56} />
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-foreground text-xl font-bold md:text-2xl">
                {activePerson.name}
              </p>
              <p
                className={`${theme.accentText} text-sm font-medium md:text-base`}
              >
                {activePerson.role}
              </p>
            </div>
            {(activePerson.linkedin || activePerson.email) && (
              <div className="mt-3 flex items-center gap-2">
                {activePerson.linkedin && (
                  <a
                    href={activePerson.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${activePerson.name} on LinkedIn`}
                    className={`${theme.accentText} flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10`}
                  >
                    <FaLinkedinIn size={16} />
                  </a>
                )}
                {activePerson.email && (
                  <a
                    href={`mailto:${activePerson.email}`}
                    aria-label={`Email ${activePerson.name}`}
                    className={`${theme.accentText} flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10`}
                  >
                    <Mail size={16} />
                  </a>
                )}
              </div>
            )}
            <div className="mt-6 w-full space-y-4 text-left">
              {activePerson.quote && (
                <blockquote
                  className={`text-foreground/90 ${theme.border50} border-l-4 pl-5 text-base leading-relaxed italic md:text-lg`}
                >
                  &quot;{activePerson.quote}&quot;
                </blockquote>
              )}
              {activePerson.messages?.map((msg, i) => (
                <p
                  key={i}
                  className="text-muted-foreground text-sm leading-relaxed md:text-base"
                >
                  {msg}
                </p>
              ))}
              {activePerson.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                  {activePerson.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
