"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Check,
  TrendingUp,
  BarChart3,
  Users,
  Briefcase,
  Building2,
  FileText,
  Star,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  GraduationCap,
  CheckCircle2,
  CalendarDays,
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronDown,
  ExternalLink,
  History,
  Images,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageBlocksRenderer } from "@/components/shared/PageBlocksRenderer";
import { ContentPageBody } from "@/components/layout/ContentPageLayout";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { useDeferredUploadsOptional } from "@/lib/deferred-uploads";
import { getImageUrl } from "@/lib/utils";
import { PLACEMENT_GALLERY_ANCHOR } from "@/lib/page-anchors";
import { hostedSectionKey } from "@/lib/content-pages";
import {
  resolveSidebarItems,
  type ResolvedSidebarItem,
  type SidebarNavDefault,
} from "@/lib/sidebar-nav";
import type {
  ContentPageValue,
  PageBodySection,
  PlacementInfoValue,
} from "@/lib/validation";
import type {
  PublicPlacement,
  PublicNotablePlacement,
  PublicCompanyPlacement,
} from "@/lib/public-placements";

const INSTITUTION_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

// Sections the admin editor can select. The year-wise data (stats, recruiters,
// students, company-wise) is not here — it lives on the Placement records and
// is edited under /admin/placements.
export type PlacementEditableSection =
  "banner" | "process" | "tpo" | "mou" | "why-recruit" | "sidebar";

export const PLACEMENT_SECTION_LABELS: Record<
  PlacementEditableSection,
  string
> = {
  banner: "Highlights",
  process: "Placement Process",
  tpo: "TPO Contacts",
  mou: "MoUs & Collaborations",
  "why-recruit": "Why Recruit at JCT",
  sidebar: "Sidebar Navigation",
};

/**
 * The year-wise data on this page comes from `Placement` documents, not from
 * the page's site-config key, but it is authored here all the same — these are
 * the inspector keys for it.
 *
 * `PLACEMENT_RECORDS_SECTION` opens the year list (add / delete / pick the
 * current year); `placementRecordSection(id, key)` opens one year's data at
 * whichever block was clicked.
 */
export const PLACEMENT_RECORDS_SECTION = "records";

export type PlacementRecordSectionKey =
  "overview" | "recruiters" | "achievers" | "company-wise";

export const PLACEMENT_RECORD_SECTION_LABELS: Record<
  PlacementRecordSectionKey,
  string
> = {
  overview: "Year Summary & Stats",
  recruiters: "Top Recruiters",
  achievers: "Placed Students",
  "company-wise": "Placements by Company",
};

export function placementRecordSection(
  recordId: string,
  key: PlacementRecordSectionKey,
): string {
  return `record:${recordId}:${key}`;
}

export function parsePlacementRecordSection(
  section: string,
): { recordId: string; key: PlacementRecordSectionKey } | null {
  if (!section.startsWith("record:")) return null;
  const rest = section.slice("record:".length);
  const i = rest.lastIndexOf(":");
  if (i === -1) return null;
  const key = rest.slice(i + 1) as PlacementRecordSectionKey;
  if (!(key in PLACEMENT_RECORD_SECTION_LABELS)) return null;
  return { recordId: rest.slice(0, i), key };
}

type EditProps = {
  editable?: boolean;
  onEditSection?: (section: string) => void;
};

// In the editor an empty section still has to be clickable — otherwise there's
// no way to add its first entry.
function EmptyHint({ children }: { children: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-stone-200 py-8 text-center text-sm text-stone-400">
      {children}
    </div>
  );
}

// Sidebar entries in the order the page renders them. Admins can relabel,
// reorder, hide, or extend this list via the `sidebar.navItems` override on the
// <college>PlacementInfo site-config key.
export const PLACEMENT_NAV_DEFAULTS: SidebarNavDefault[] = [
  { anchor: "banner", navLabel: "Highlights", icon: Images },
  { anchor: "process", navLabel: "Placement Process", icon: ClipboardList },
  { anchor: "tpo", navLabel: "TPO Contacts", icon: Phone },
  { anchor: "mou", navLabel: "MoUs & Collaborations", icon: FileText },
  { anchor: "why-recruit", navLabel: "Why Recruit at JCT", icon: Star },
  { anchor: "overview", navLabel: "Placement Highlights", icon: TrendingUp },
  { anchor: "history", navLabel: "Year-wise History", icon: History },
  { anchor: "recruiters", navLabel: "Our Recruiters", icon: Building2 },
  { anchor: "achievers", navLabel: "Placed Students", icon: GraduationCap },
  {
    anchor: "company-wise",
    navLabel: "Placements by Company",
    icon: Briefcase,
  },
  {
    anchor: PLACEMENT_GALLERY_ANCHOR,
    navLabel: "Placement Gallery",
    icon: Camera,
  },
];

// Deterministic brand-ish gradients for recruiter/notable monograms so a card
// without a logo/photo still reads as a designed element, never a broken image.
const MONOGRAM_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-rose-600",
  "from-lime-500 to-emerald-600",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function gradientFor(name: string): string {
  return MONOGRAM_GRADIENTS[hashString(name) % MONOGRAM_GRADIENTS.length];
}

// Honorifics carry no identity — without stripping them every TPO officer's
// monogram would read "MR" or "DR".
const HONORIFICS = new Set(["mr", "mrs", "ms", "dr", "prof", "shri", "smt"]);

function initials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => !HONORIFICS.has(w.toLowerCase()));
  if (words.length === 0 || !words[0]) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

type StatDef = {
  key: keyof PublicPlacement;
  label: string;
  icon: typeof Award;
  suffix?: string;
};

// Headline stats shown as big cards for the current year.
const HEADLINE_STATS: StatDef[] = [
  {
    key: "placement_percentage",
    label: "Placement Rate",
    icon: TrendingUp,
    suffix: "%",
  },
  { key: "students_placed", label: "Students Placed", icon: Users },
  { key: "offers_made", label: "Offers Made", icon: Briefcase },
  { key: "companies_visited", label: "Companies Visited", icon: Building2 },
];

const PACKAGE_STATS: StatDef[] = [
  { key: "highest_package", label: "Highest Package", icon: Award },
  { key: "average_package", label: "Average Package", icon: BarChart3 },
  { key: "median_package", label: "Median Package", icon: BarChart3 },
];

// ─── Shared bits ─────────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  meta,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="bg-accent/10 text-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <div>
          {eyebrow && (
            <span className="text-accent text-sm font-bold tracking-[0.2em] uppercase">
              {eyebrow}
            </span>
          )}
          <h2 className="text-navy mt-0.5 font-serif text-2xl font-bold md:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      {meta && <span className="text-sm text-stone-500">{meta}</span>}
    </div>
  );
}

function Monogram({ name, className }: { name: string; className: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradientFor(
        name,
      )} font-bold text-white shadow-sm ${className}`}
    >
      {initials(name)}
    </div>
  );
}

// ─── Sidebar navigation ──────────────────────────────────────────────────────

function PlacementSideNav({
  items,
  activeId,
  onNavigate,
  records,
  selectedId,
  onSelectYear,
  editable,
  onEditSection,
}: {
  items: ResolvedSidebarItem[];
  activeId: string;
  onNavigate: (anchor: string) => void;
  records: PublicPlacement[];
  selectedId: string;
  onSelectYear: (id: string) => void;
} & EditProps) {
  // The year list is the entry point to the year-wise data: the current year is
  // selected by default (records arrive is_current-first) and past years sit
  // under it, so visitors switch years from the sidebar instead of a separate
  // row above the stats.
  const pastYears = records.filter((r) => !r.is_current);
  const currentYears = records.filter((r) => r.is_current);

  return (
    <>
      {/* Mobile: horizontally scrollable pill bar */}
      <div className="-mx-4 w-full overflow-x-auto px-4 pb-2 lg:hidden">
        <div className="flex w-max gap-2">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
              isActive
                ? "border-navy bg-navy text-white"
                : "border-border text-navy bg-white hover:bg-stone-50"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
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
                type="button"
                onClick={() => onNavigate(it.anchor)}
                className={cls}
              >
                <Icon size={13} className="shrink-0" />
                {it.navLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: current year + past-year dropdown */}
      {records.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 lg:hidden">
          {currentYears.map((r) => (
            <YearButton
              key={r._id}
              record={r}
              active={r._id === selectedId}
              onSelect={onSelectYear}
              className="w-auto"
            />
          ))}
          {pastYears.length > 0 && (
            <PastYearSelect
              records={pastYears}
              selectedId={selectedId}
              onSelect={onSelectYear}
            />
          )}
        </div>
      )}

      {/* Desktop: sticky "On This Page" card */}
      <EditableRegion
        as="nav"
        section="sidebar"
        label={PLACEMENT_SECTION_LABELS.sidebar}
        editable={editable}
        onEditSection={onEditSection}
        className="border-border hidden rounded-2xl border bg-white p-5 shadow-sm lg:block"
      >
        <h3 className="text-navy border-border mb-4 border-b pb-3 text-xs font-bold tracking-[0.15em] uppercase">
          On This Page
        </h3>
        <div className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
              isActive ? "bg-navy text-white" : "text-navy hover:bg-stone-50"
            }`;
            const iconCls = `shrink-0 ${
              isActive ? "text-accent" : "text-stone-400"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
                  className={cls}
                >
                  <Icon size={16} className={iconCls} />
                  <span className="min-w-0 flex-1">{it.navLabel}</span>
                  {it.isExternal && (
                    <ExternalLink
                      size={12}
                      className="shrink-0 text-stone-300"
                    />
                  )}
                </Link>
              );
            }
            return (
              <button
                key={it.id}
                type="button"
                // Picking a section must scroll the preview, not open the
                // sidebar inspector this nav sits inside — matching
                // SectionNavEntry in SectionedPageShell.
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(it.anchor);
                }}
                className={cls}
              >
                <Icon size={16} className={iconCls} />
                <span className="min-w-0 flex-1">{it.navLabel}</span>
                {isActive && (
                  <span className="bg-accent h-1.5 w-1.5 shrink-0 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Nested region: the year list is the door to the year-wise records,
            which are their own documents rather than page copy. Clicking a
            year still switches years — only the surrounding chrome opens the
            record inspector. */}
        {(records.length > 0 || editable) && (
          <EditableRegion
            as="div"
            section={PLACEMENT_RECORDS_SECTION}
            label="Placement Years"
            editable={editable}
            onEditSection={onEditSection}
            className="border-border mt-5 border-t pt-5"
          >
            <h3 className="text-navy mb-3 text-xs font-bold tracking-[0.15em] uppercase">
              Placement Data
            </h3>
            {records.length === 0 ? (
              <p className="text-sm text-stone-400 italic">
                No years yet. Click to add the first one.
              </p>
            ) : (
              <>
                <div className="space-y-1">
                  {currentYears.map((r) => (
                    <YearButton
                      key={r._id}
                      record={r}
                      active={r._id === selectedId}
                      onSelect={onSelectYear}
                    />
                  ))}
                </div>
                {pastYears.length > 0 && (
                  <div className="mt-3">
                    <PastYearSelect
                      records={pastYears}
                      selectedId={selectedId}
                      onSelect={onSelectYear}
                    />
                  </div>
                )}
              </>
            )}
          </EditableRegion>
        )}
      </EditableRegion>
    </>
  );
}

function YearButton({
  record,
  active,
  onSelect,
  className = "w-full",
}: {
  record: PublicPlacement;
  active: boolean;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      // Stop short of the surrounding EditableRegion in the admin preview:
      // picking a year must switch years, not open the inspector.
      onClick={(e) => {
        e.stopPropagation();
        onSelect(record._id);
      }}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${className} ${
        active
          ? "bg-accent/10 text-accent ring-accent/30 ring-1"
          : "border-border text-navy border hover:bg-stone-50"
      }`}
    >
      <CalendarDays
        size={16}
        className={`shrink-0 ${active ? "text-accent" : "text-stone-400"}`}
      />
      <span className="min-w-0 flex-1">{record.year}</span>
      {record.is_current && (
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
            active ? "bg-accent text-white" : "bg-accent/10 text-accent"
          }`}
        >
          Latest
        </span>
      )}
    </button>
  );
}

// Past years collapse into a dropdown so the sidebar stays short no matter how
// many academic years accumulate. Hand-rolled rather than a native <select> so
// each year can carry its placement rate — and so it matches the page's card
// styling instead of the OS widget. Implements the listbox keyboard contract
// (arrows / Home / End / Enter / Escape) that <select> would have given us.
function PastYearSelect({
  records,
  selectedId,
  onSelect,
}: {
  records: PublicPlacement[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Opens upward when the panel wouldn't fit below — the sidebar sits low on
  // the page once it's pinned.
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Focus never leaves the trigger, so the highlighted option has to be
  // announced through aria-activedescendant — otherwise arrowing through the
  // list is silent to a screen reader and Enter commits a year the user was
  // never told about.
  const listId = useId();
  const optionId = (recordId: string) => `${listId}-opt-${recordId}`;

  const selectedIdx = records.findIndex((r) => r._id === selectedId);
  const selected = selectedIdx >= 0 ? records[selectedIdx] : null;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const panelHeight = Math.min(records.length * 52 + 16, 264);

  const openPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setDropUp(below < panelHeight + 16 && rect.top > below);
    }
    setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
    setOpen(true);
  };

  const commit = (i: number) => {
    const record = records[i];
    if (!record) return;
    onSelect(record._id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPanel();
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % records.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + records.length) % records.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(records.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onKeyDown}
      // Everything in this dropdown is year-switching, never page editing —
      // keep its clicks away from the surrounding EditableRegion.
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open && records[activeIndex]
            ? optionId(records[activeIndex]._id)
            : undefined
        }
        className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
          selected
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border text-navy bg-white hover:border-stone-300 hover:bg-stone-50"
        } ${open ? "ring-accent/20 ring-2" : ""}`}
      >
        <CalendarDays
          size={16}
          className={`shrink-0 ${selected ? "text-accent" : "text-stone-400"}`}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
            Past Years
          </span>
          <span className="block text-sm font-semibold">
            {selected ? selected.year : `${records.length} earlier batches`}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-stone-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label="Past years"
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{ maxHeight: panelHeight }}
            className={`border-border absolute right-0 left-0 z-30 overflow-y-auto rounded-xl border bg-white p-1.5 shadow-xl ${
              dropUp ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {records.map((r, i) => {
              const isSelected = r._id === selectedId;
              const isActive = i === activeIndex;
              return (
                // The option IS the interactive element. It used to wrap a
                // <button>, which both gave role="option" an interactive
                // descendant (forbidden) and put every year in the tab order
                // of a widget driven entirely from the trigger.
                <li
                  key={r._id}
                  id={optionId(r._id)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commit(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    isSelected
                      ? "bg-accent/10 text-accent"
                      : isActive
                        ? "text-navy bg-stone-100"
                        : "text-navy"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {r.year}
                    </span>
                    {r.placement_percentage > 0 && (
                      <span className="block text-[11px] text-stone-400">
                        {r.placement_percentage}% placed
                        {r.students_placed > 0 &&
                          ` · ${r.students_placed} students`}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <Check size={15} className="text-accent shrink-0" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Highlights (banner images) ─────────────────────────────────────────────

const BANNER_CAROUSEL_INTERVAL_MS = 4000;

// Poster artwork (the annual "Distinguished Alumni" sheet and friends) carries
// its own layout, type, and aspect ratio, so it renders at its natural shape
// instead of being cropped into one of the fixed frames the rest of the page
// uses.
function BannerImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  // Inside the admin editor a freshly-picked file is still a `pending:`
  // placeholder backed by a blob: URL — next/image accepts neither, so the
  // live preview falls back to a plain <img> until the upload is flushed.
  const deferred = useDeferredUploadsOptional();
  const [failed, setFailed] = useState(false);
  const isPending = src.startsWith("pending:");
  const pendingPreview = isPending ? (deferred?.getPreview(src) ?? null) : null;
  const url = isPending ? null : getImageUrl(src);

  if (pendingPreview) {
    // eslint-disable-next-line @next/next/no-img-element -- a deferred upload's preview is a local blob: URL, which /_next/image cannot fetch or optimize.
    return <img src={pendingPreview} alt={alt} className="h-auto w-full" />;
  }

  if (!url || failed) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-stone-50 text-sm text-stone-400">
        {isPending ? "Uploading on save…" : "Image unavailable"}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      // Only a pre-load placeholder — `h-auto` hands the final height back to
      // the image's own ratio, which is whatever the poster was designed at.
      width={1600}
      height={900}
      sizes="(max-width: 1280px) 100vw, 1200px"
      className="h-auto w-full"
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

type PlacementBannerImage = PlacementInfoValue["banner"]["images"][number];

function BannerFigure({
  img,
  fallbackAlt,
  priority,
}: {
  img: PlacementBannerImage;
  fallbackAlt: string;
  priority: boolean;
}) {
  return (
    <figure className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
      <BannerImage
        src={img.image}
        alt={img.alt || img.caption || fallbackAlt}
        priority={priority}
      />
      {img.caption && (
        <figcaption className="border-t border-stone-100 px-5 py-3 text-sm text-stone-600">
          {img.caption}
        </figcaption>
      )}
    </figure>
  );
}

function BannerSection({
  data,
  editable,
  onEditSection,
}: { data: PlacementInfoValue["banner"] } & EditProps) {
  const images = data.images.filter((img) => img.image);
  const [activeIndex, setActiveIndex] = useState(0);
  // WCAG 2.2.2 (Level A): auto-updating content needs a way to pause, stop or
  // hide it.
  //
  // Two separate states on purpose. `hovering` is transient (pointer or
  // keyboard focus inside the carousel) and must not be what the toggle
  // writes — sharing one flag means clicking Pause while the pointer is over
  // the button flips the hover-set `true` back to `false` and the slideshow
  // resumes under the cursor. `userPaused` is the explicit, sticky choice.
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeImage = images[activeIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setActiveIndex((index) =>
      images.length === 0 ? 0 : Math.min(index, images.length - 1),
    );
  }, [images.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const autoplayRunning =
    hasMultipleImages && !hovering && !userPaused && !reducedMotion;

  useEffect(() => {
    if (!autoplayRunning) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, BANNER_CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [autoplayRunning, images.length]);

  const stepSlide = (
    direction: "previous" | "next",
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (!hasMultipleImages) return;

    setActiveIndex((index) =>
      direction === "previous"
        ? (index - 1 + images.length) % images.length
        : (index + 1) % images.length,
    );
  };

  const selectSlide = (
    index: number,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <EditableRegion
      as="section"
      id="banner"
      section="banner"
      label={PLACEMENT_SECTION_LABELS.banner}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={Images}
        eyebrow="Highlights"
        title={data.heading || "Placement Highlights"}
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}
      {images.length === 0 && editable && (
        <EmptyHint>Click to upload a banner image</EmptyHint>
      )}
      {activeImage && (
        <div
          className="relative"
          // Reading a caption must not be cut short at 4s. Hover and focus
          // both suspend the timer; it resumes when the pointer/focus leaves,
          // unless the visitor pressed Pause.
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setHovering(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setHovering(false);
            }
          }}
        >
          {hasMultipleImages && (
            <div className="mb-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setUserPaused((p) => !p);
                }}
                aria-label={
                  userPaused
                    ? "Play placement highlight slideshow"
                    : "Pause placement highlight slideshow"
                }
                aria-pressed={userPaused}
                className="border-border text-navy hover:border-gold/30 hover:text-gold inline-flex h-10 items-center justify-center gap-1.5 rounded-full border bg-white px-3.5 text-xs font-semibold shadow-sm transition-colors"
              >
                {userPaused ? "Play" : "Pause"}
              </button>
              <button
                type="button"
                onClick={(event) => stepSlide("previous", event)}
                aria-label="Show previous placement highlight"
                className="border-border text-navy hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(event) => stepSlide("next", event)}
                aria-label="Show next placement highlight"
                className="border-border text-navy hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeImage.image}-${activeIndex}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeImage.href && !editable ? (
                  <Link
                    href={activeImage.href}
                    target={
                      /^https?:\/\//i.test(activeImage.href)
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      /^https?:\/\//i.test(activeImage.href)
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="block"
                  >
                    <BannerFigure
                      img={activeImage}
                      fallbackAlt={data.heading || "Placements"}
                      priority={activeIndex === 0}
                    />
                  </Link>
                ) : (
                  <BannerFigure
                    img={activeImage}
                    fallbackAlt={data.heading || "Placements"}
                    priority={activeIndex === 0}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {hasMultipleImages && (
            // A bare <div> maps to `generic`, and ARIA forbids naming generic
            // elements — the label was being dropped, not announced.
            <div
              role="group"
              className="mt-4 flex justify-center gap-2"
              aria-label="Placement highlight slides"
            >
              {images.map((img, i) => (
                <button
                  key={`${img.image}-${i}-dot`}
                  type="button"
                  onClick={(event) => selectSlide(i, event)}
                  aria-label={`Show placement highlight ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all ${
                    i === activeIndex
                      ? "bg-accent w-8"
                      : "w-2.5 bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </EditableRegion>
  );
}

// ─── CMS-backed sections ─────────────────────────────────────────────────────

function MouSection({
  data,
  editable,
  onEditSection,
}: { data: PlacementInfoValue["mou"] } & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="mou"
      section="mou"
      label={PLACEMENT_SECTION_LABELS.mou}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={FileText}
        eyebrow="Industry Partnerships"
        title={data.heading || "MoUs & Collaborations"}
        meta={
          data.items.length > 0
            ? `${data.items.length} ${data.items.length === 1 ? "partner" : "partners"}`
            : undefined
        }
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}
      {data.items.length === 0 && editable && (
        <EmptyHint>Click to add MoUs</EmptyHint>
      )}
      {/* Two columns from md up; partner logos vary wildly in aspect ratio, so
          each gets a fixed padded tile it can `object-contain` into rather than
          a cramped icon slot. */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {data.items.map((m, i) => {
          const logo = getImageUrl(m.logo);
          const card = (
            <div className="border-border flex h-full flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:p-6">
              {logo ? (
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50 sm:w-28 lg:w-32">
                  <Image
                    src={logo}
                    alt={m.organization}
                    fill
                    sizes="(max-width: 640px) 100vw, 128px"
                    className="object-contain p-3"
                    loading="lazy"
                  />
                </div>
              ) : (
                <Monogram
                  name={m.organization || "MoU"}
                  className="h-24 w-full shrink-0 rounded-xl text-2xl sm:w-28 lg:w-32"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-2">
                  <h3 className="text-navy min-w-0 flex-1 font-serif text-base leading-snug font-bold lg:text-lg">
                    {m.organization}
                  </h3>
                  {m.href && (
                    <ExternalLink
                      size={15}
                      className="mt-1 shrink-0 text-stone-300"
                    />
                  )}
                </div>
                {m.purpose && (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {m.purpose}
                  </p>
                )}
                {(m.signedOn || m.validity) && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                    {m.signedOn && (
                      <span className="flex items-center gap-1.5 rounded-full bg-stone-50 px-2.5 py-1 text-[11px] font-bold text-stone-500">
                        <CalendarDays size={11} /> Signed {m.signedOn}
                      </span>
                    )}
                    {m.validity && (
                      <span className="bg-accent/10 text-accent rounded-full px-2.5 py-1 text-[11px] font-bold">
                        Valid {m.validity}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
          return m.href ? (
            <Link
              key={`${m.organization}-${i}`}
              href={m.href}
              target={/^https?:\/\//i.test(m.href) ? "_blank" : undefined}
              rel={
                /^https?:\/\//i.test(m.href) ? "noopener noreferrer" : undefined
              }
              className="block h-full"
            >
              {card}
            </Link>
          ) : (
            <div key={`${m.organization}-${i}`} className="h-full">
              {card}
            </div>
          );
        })}
      </div>
    </EditableRegion>
  );
}

function WhyRecruitSection({
  data,
  label,
  editable,
  onEditSection,
}: {
  data: PlacementInfoValue["whyRecruit"];
  label: string;
} & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="why-recruit"
      section="why-recruit"
      label={PLACEMENT_SECTION_LABELS["why-recruit"]}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={Star}
        eyebrow="For Recruiters"
        title={data.heading || `Why Recruit at JCT ${label}`}
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}
      {data.points.length === 0 && editable && (
        <EmptyHint>Click to add reasons to recruit here</EmptyHint>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.points.map((p, i) => (
          <motion.div
            key={`${p.title}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.06 }}
            className="border-border h-full rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
              <CheckCircle2 size={19} strokeWidth={1.75} />
            </div>
            <h3 className="text-navy font-serif text-base font-bold">
              {p.title}
            </h3>
            {p.desc && (
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {p.desc}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </EditableRegion>
  );
}

function TpoSection({
  data,
  editable,
  onEditSection,
}: { data: PlacementInfoValue["tpo"] } & EditProps) {
  const { office } = data;
  const hasOffice = !!(office.address || office.phone || office.email);
  return (
    <EditableRegion
      as="section"
      id="tpo"
      section="tpo"
      label={PLACEMENT_SECTION_LABELS.tpo}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={Phone}
        eyebrow="Get In Touch"
        title={data.heading || "Training & Placement Cell"}
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}

      {hasOffice && (
        <div className="from-navy to-navy/85 mb-6 grid grid-cols-1 gap-5 rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg sm:grid-cols-3">
          {office.address && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <span className="block text-[11px] font-bold tracking-wider text-white/60 uppercase">
                  Office
                </span>
                <span className="text-sm leading-relaxed whitespace-pre-line">
                  {office.address}
                </span>
              </div>
            </div>
          )}
          {office.phone && (
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <span className="block text-[11px] font-bold tracking-wider text-white/60 uppercase">
                  Phone
                </span>
                <a
                  href={`tel:${office.phone.replace(/\s+/g, "")}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {office.phone}
                </a>
              </div>
            </div>
          )}
          {office.email && (
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <span className="block text-[11px] font-bold tracking-wider text-white/60 uppercase">
                  Email
                </span>
                <a
                  href={`mailto:${office.email}`}
                  className="text-sm font-semibold break-all hover:underline"
                >
                  {office.email}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {data.contacts.length === 0 && editable && (
        <EmptyHint>Click to add placement officers</EmptyHint>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.contacts.map((c, i) => {
          const photo = getImageUrl(c.image);
          return (
            <div
              key={`${c.name}-${i}`}
              className="border-border flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {data.showPhotos &&
                (photo ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-50">
                    <Image
                      src={photo}
                      alt={c.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <Monogram
                    name={c.name || "TPO"}
                    className="h-14 w-14 shrink-0 rounded-xl text-base"
                  />
                ))}
              <div className="min-w-0">
                <h3 className="text-navy text-sm font-bold">{c.name}</h3>
                {c.designation && (
                  <p className="text-xs text-stone-500">{c.designation}</p>
                )}
                <div className="mt-2 space-y-1">
                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, "")}`}
                      className="text-navy flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    >
                      <Phone size={11} className="text-accent shrink-0" />
                      {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="text-navy flex items-center gap-1.5 text-xs font-semibold break-all hover:underline"
                    >
                      <Mail size={11} className="text-accent shrink-0" />
                      {c.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </EditableRegion>
  );
}

function ProcessSection({
  data,
  editable,
  onEditSection,
}: { data: PlacementInfoValue["process"] } & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="process"
      section="process"
      label={PLACEMENT_SECTION_LABELS.process}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={ClipboardList}
        eyebrow="How It Works"
        title={data.heading || "Placement Process"}
        meta={data.steps.length > 0 ? `${data.steps.length} steps` : undefined}
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}
      {data.steps.length === 0 && editable && (
        <EmptyHint>Click to add the placement process steps</EmptyHint>
      )}
      <ol className="relative space-y-4 border-l-2 border-dashed border-stone-200 pl-6 md:pl-8">
        {data.steps.map((step, i) => (
          <motion.li
            key={`${step.title}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i, 5) * 0.06 }}
            className="border-border relative rounded-2xl border bg-white p-5 shadow-sm"
          >
            <span className="bg-navy absolute top-6 -left-[2.15rem] flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-md md:-left-[2.65rem]">
              {i + 1}
            </span>
            <h3 className="text-navy font-serif text-base font-bold">
              {step.title}
            </h3>
            {step.desc && (
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                {step.desc}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </EditableRegion>
  );
}

// ─── Year-wise placement data ────────────────────────────────────────────────

function CurrentYear({
  record,
  editable,
  onEditSection,
}: { record: PublicPlacement } & EditProps) {
  const headline = HEADLINE_STATS.filter((s) => Number(record[s.key]) > 0);
  const packages = PACKAGE_STATS.filter((s) => String(record[s.key]).trim());

  return (
    <EditableRegion
      as="div"
      section={placementRecordSection(record._id, "overview")}
      label={`${record.year} — ${PLACEMENT_RECORD_SECTION_LABELS.overview}`}
      editable={editable}
      onEditSection={onEditSection}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-accent text-sm font-bold tracking-[0.2em] uppercase">
            {record.is_current ? "Latest Results" : "Placement Record"}
          </span>
          <h2 className="text-navy mt-1 font-serif text-3xl font-bold md:text-4xl">
            Class of {record.year}
          </h2>
        </div>
        {record.total_students > 0 && (
          <p className="text-sm text-stone-500">
            {record.students_placed} of {record.total_students} eligible
            students placed
          </p>
        )}
      </div>

      {record.summary && (
        <p className="mb-10 max-w-3xl text-base leading-relaxed text-stone-600 md:text-lg">
          {record.summary}
        </p>
      )}

      {headline.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {headline.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="from-navy to-navy/85 relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-center shadow-lg md:p-6"
              >
                <div className="bg-accent/20 absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl" />
                <Icon
                  size={22}
                  className="text-accent relative mx-auto mb-2"
                  strokeWidth={1.5}
                />
                <span className="relative block font-sans text-3xl font-bold text-white md:text-4xl">
                  {String(record[stat.key])}
                  {stat.suffix}
                </span>
                <span className="relative mt-1 block text-xs font-bold tracking-wider text-white/70 uppercase">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {packages.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {packages.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="border-border flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="bg-accent/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <Icon size={22} className="text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-navy block font-sans text-2xl font-bold">
                    {String(record[stat.key])}
                  </span>
                  <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editable && headline.length === 0 && packages.length === 0 && (
        <EmptyHint>Click to add this year&apos;s figures</EmptyHint>
      )}
    </EditableRegion>
  );
}

function RecruiterTile({ name, logo }: { name: string; logo: string | null }) {
  // Brand logos come from an external CDN and aren't guaranteed to exist for
  // every recruiter — if one 404s, fall back to a designed monogram so the
  // grid never shows a broken image.
  const [failed, setFailed] = useState(false);
  const showLogo = logo && !failed;
  return (
    <div className="border-border group flex h-28 flex-col items-center justify-center gap-2.5 rounded-2xl border bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {showLogo ? (
        <div className="relative h-11 w-full">
          <Image
            src={logo}
            alt={name}
            fill
            sizes="160px"
            className="object-contain"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <Monogram name={name} className="h-11 w-11 rounded-xl text-sm" />
      )}
      <span className="line-clamp-2 text-[11px] leading-tight font-semibold text-stone-500">
        {name}
      </span>
    </div>
  );
}

function StudentCard({ student }: { student: PublicNotablePlacement }) {
  // Photo comes from the media library; if it's missing or 404s, fall back to a
  // designed monogram so the card never shows a broken image.
  const [failed, setFailed] = useState(false);
  const showPhoto = student.image && !failed;
  return (
    <div className="border-border group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex aspect-square items-center justify-center bg-stone-50">
        {showPhoto ? (
          <Image
            src={student.image!}
            alt={student.name}
            fill
            sizes="(max-width: 640px) 33vw, 160px"
            className="object-cover"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <Monogram
            name={student.name}
            className="h-12 w-12 rounded-xl text-base"
          />
        )}
        {student.package && (
          <span className="bg-navy absolute right-1.5 bottom-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
            {student.package}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <h4 className="text-navy line-clamp-1 text-sm font-bold">
          {student.name}
        </h4>
        {student.program && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-500">
            {student.program}
          </p>
        )}
        {student.company && (
          <div className="mt-auto flex items-center gap-1 pt-2">
            <Building2 size={11} className="text-accent shrink-0" />
            <span className="text-navy line-clamp-1 text-xs font-semibold">
              {student.company}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function PlacedStudents({
  record,
  editable,
  onEditSection,
}: { record: PublicPlacement } & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="achievers"
      section={placementRecordSection(record._id, "achievers")}
      label={`${record.year} — ${PLACEMENT_RECORD_SECTION_LABELS.achievers}`}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={GraduationCap}
        eyebrow="Our Achievers"
        title="Placed Students"
        meta={`${record.notable_placements.length} students`}
      />
      {record.notable_placements.length === 0 ? (
        <EmptyHint>Click to add this year&apos;s placed students</EmptyHint>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
          {record.notable_placements.map((s, i) => (
            <motion.div
              key={`${s.name}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
            >
              <StudentCard student={s} />
            </motion.div>
          ))}
        </div>
      )}
    </EditableRegion>
  );
}

function TopRecruiters({
  record,
  editable,
  onEditSection,
}: { record: PublicPlacement } & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="recruiters"
      section={placementRecordSection(record._id, "recruiters")}
      label={`${record.year} — ${PLACEMENT_RECORD_SECTION_LABELS.recruiters}`}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={Building2}
        eyebrow="Hiring Partners"
        title="Our Recruiters"
        meta={`${record.top_recruiters.length} companies`}
      />
      {record.top_recruiters.length === 0 ? (
        <EmptyHint>Click to add this year&apos;s recruiters</EmptyHint>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {record.top_recruiters.map((r, i) => (
            <RecruiterTile key={`${r.name}-${i}`} name={r.name} logo={r.logo} />
          ))}
        </div>
      )}
    </EditableRegion>
  );
}

function CompanyLogo({ company }: { company: PublicCompanyPlacement }) {
  const [failed, setFailed] = useState(false);
  const showLogo = company.logo && !failed;
  return showLogo ? (
    <div className="relative h-9 w-9 shrink-0">
      <Image
        src={company.logo!}
        alt={company.company}
        fill
        sizes="40px"
        className="rounded-lg object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  ) : (
    <Monogram
      name={company.company}
      className="h-9 w-9 shrink-0 rounded-lg text-xs"
    />
  );
}

// Company-wise placed students: one card per recruiter, listing every student
// it hired with their program and package. Sits alongside the recruiter grid so
// visitors can see who was placed where.
function CompanyPlacements({
  record,
  editable,
  onEditSection,
}: { record: PublicPlacement } & EditProps) {
  const totalStudents = record.company_placements.reduce(
    (sum, c) => sum + c.students.length,
    0,
  );
  return (
    <EditableRegion
      as="section"
      id="company-wise"
      section={placementRecordSection(record._id, "company-wise")}
      label={`${record.year} — ${PLACEMENT_RECORD_SECTION_LABELS["company-wise"]}`}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={Briefcase}
        eyebrow="Company-wise"
        title="Placements by Company"
        meta={`${totalStudents} students · ${record.company_placements.length} companies`}
      />
      {record.company_placements.length === 0 && (
        <EmptyHint>
          Click to group this year&apos;s students by company
        </EmptyHint>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {record.company_placements.map((c, i) => (
          <div
            key={`${c.company}-${i}`}
            className="border-border flex flex-col rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3 border-b border-stone-100 pb-3">
              <CompanyLogo company={c} />
              <div className="min-w-0">
                <h4 className="text-navy line-clamp-1 font-serif text-base font-bold">
                  {c.company}
                </h4>
                <span className="text-xs text-stone-400">
                  {c.students.length}{" "}
                  {c.students.length === 1 ? "student" : "students"} placed
                </span>
              </div>
            </div>
            <ul className="space-y-2.5">
              {c.students.map((s, j) => (
                <li
                  key={`${s.name}-${j}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-navy line-clamp-1 text-sm font-semibold">
                      {s.name}
                    </p>
                    {s.program && (
                      <p className="line-clamp-1 text-[11px] text-stone-500">
                        {s.program}
                      </p>
                    )}
                  </div>
                  {s.package && (
                    <span className="bg-accent/10 text-accent shrink-0 rounded-full px-2.5 py-1 text-xs font-bold">
                      {s.package}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </EditableRegion>
  );
}

// ─── Year-wise history ───────────────────────────────────────────────────────

/**
 * Columns of the history table. A column is dropped entirely when no year on
 * record carries it — a college that never tracked "offers made" shouldn't get
 * a column of dashes.
 */
type HistoryColumn = {
  id: string;
  label: string;
  has: (r: PublicPlacement) => boolean;
  format: (r: PublicPlacement) => string;
};

const HISTORY_COLUMNS: HistoryColumn[] = [
  {
    id: "placement_percentage",
    label: "Placement Rate",
    has: (r) => r.placement_percentage > 0,
    format: (r) => `${r.placement_percentage}%`,
  },
  {
    id: "students_placed",
    label: "Students Placed",
    has: (r) => r.students_placed > 0,
    format: (r) => String(r.students_placed),
  },
  {
    id: "total_students",
    label: "Eligible",
    has: (r) => r.total_students > 0,
    format: (r) => String(r.total_students),
  },
  {
    id: "offers_made",
    label: "Offers",
    has: (r) => r.offers_made > 0,
    format: (r) => String(r.offers_made),
  },
  {
    id: "companies_visited",
    label: "Companies",
    has: (r) => r.companies_visited > 0,
    format: (r) => String(r.companies_visited),
  },
  {
    id: "recruiters",
    label: "Recruiters Listed",
    has: (r) => r.top_recruiters.length > 0,
    format: (r) => String(r.top_recruiters.length),
  },
  {
    id: "highest_package",
    label: "Highest",
    has: (r) => !!r.highest_package.trim(),
    format: (r) => r.highest_package,
  },
  {
    id: "average_package",
    label: "Average",
    has: (r) => !!r.average_package.trim(),
    format: (r) => r.average_package,
  },
  {
    id: "median_package",
    label: "Median",
    has: (r) => !!r.median_package.trim(),
    format: (r) => r.median_package,
  },
];

// Year labels are free text ("2024-2025", "2024-25", "2024"); order by the
// first four-digit number in them rather than by string, so "2009-2010" doesn't
// sort above "2024-2025" on a stray prefix.
function yearSortKey(year: string): number {
  const m = year.match(/\d{4}/);
  return m ? Number(m[0]) : -1;
}

/**
 * The gallery is authored as one block per academic year ("2024-2025"), so the
 * photographs follow the year selected on the page instead of stacking every
 * year's albums into one very long section. A block whose title carries no year
 * (an intro, say) always shows.
 *
 * In the editor nothing is filtered: block inspector keys are indexes into this
 * list, and a block hidden from the preview could not be clicked to edit. The
 * editor shows a badge instead when the public page would show fewer.
 *
 * Fails OPEN. Album titles and Placement record years are authored on two
 * different admin screens with no shared convention — records read "2024-2025"
 * while an album may read "Class of 2025" — so a mismatch is entirely possible.
 * Failing closed made the whole gallery section, its sidebar entry and the
 * `/placements/gallery` redirect target disappear with no warning anywhere; an
 * unfiltered gallery is a far better wrong answer than a missing one.
 */
function galleryForYear(
  gallery: ContentPageValue | null,
  year: string,
): ContentPageValue | null {
  if (!gallery) return null;
  const target = yearSortKey(year);
  // `blocks` can be absent on a value that failed schema validation upstream.
  const all = gallery.blocks ?? [];
  if (target < 0) return gallery;
  const blocks = all.filter((b) => {
    // Compare the *first* year in the label, not any of them: "2023-2024" and
    // "2024-2025" both contain 2024, and matching on either would publish two
    // years' albums at once.
    const blockYear = yearSortKey(b.title ?? "");
    return blockYear < 0 || blockYear === target;
  });
  return blocks.length > 0 ? { ...gallery, blocks } : gallery;
}

/**
 * Every academic year on record in one table — the page otherwise shows a
 * single selected year at a time, which hides the older batches behind the
 * sidebar's "Past Years" dropdown. No cap: as many years as the college has
 * published are listed here, newest first.
 */
function PlacementHistory({
  records,
  selectedId,
  onSelectYear,
  editable,
  onEditSection,
}: {
  records: PublicPlacement[];
  selectedId: string;
  onSelectYear: (id: string) => void;
} & EditProps) {
  const rows = useMemo(
    () =>
      [...records].sort((a, b) => yearSortKey(b.year) - yearSortKey(a.year)),
    [records],
  );
  const columns = useMemo(() => {
    const present = HISTORY_COLUMNS.filter((c) => rows.some((r) => c.has(r)));
    // The recruiter count is derived from the listed logos and only stands in
    // for "companies visited" when that figure was never entered — showing both
    // gives two near-identical columns.
    return present.some((c) => c.id === "companies_visited")
      ? present.filter((c) => c.id !== "recruiters")
      : present;
  }, [rows]);
  const peakRate = rows.reduce(
    (max, r) => Math.max(max, r.placement_percentage),
    0,
  );

  return (
    <EditableRegion
      as="section"
      id="history"
      section={PLACEMENT_RECORDS_SECTION}
      label="Placement Years"
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={History}
        eyebrow="Track Record"
        title="Year-wise Placement History"
        meta={`${rows.length} academic ${rows.length === 1 ? "year" : "years"}`}
      />
      {/* Tables of this width can't wrap on a phone; it scrolls inside its own
          box so the page body never scrolls sideways. */}
      <div className="border-border overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-stone-50 text-left">
              <th
                scope="col"
                className="text-navy px-4 py-3 text-xs font-bold tracking-wider whitespace-nowrap uppercase"
              >
                Academic Year
              </th>
              {columns.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className="text-navy px-4 py-3 text-right text-xs font-bold tracking-wider whitespace-nowrap uppercase"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isSelected = r._id === selectedId;
              return (
                <tr
                  key={r._id}
                  // Picking a year here drives the detailed sections above; the
                  // click must not bubble into the surrounding EditableRegion,
                  // which would open the inspector in the admin preview.
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectYear(r._id);
                  }}
                  className={`cursor-pointer border-t border-stone-100 transition-colors ${
                    isSelected ? "bg-accent/5" : "hover:bg-stone-50"
                  }`}
                >
                  <th scope="row" className="px-4 py-3 text-left font-semibold">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectYear(r._id);
                      }}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-2 text-left text-sm font-bold ${
                        isSelected ? "text-accent" : "text-navy"
                      }`}
                    >
                      <CalendarDays
                        size={14}
                        className={`shrink-0 ${
                          isSelected ? "text-accent" : "text-stone-400"
                        }`}
                      />
                      {r.year}
                      {r.is_current && (
                        <span className="bg-accent/10 text-accent rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                          Latest
                        </span>
                      )}
                    </button>
                    {r.placement_percentage > 0 && peakRate > 0 && (
                      <span
                        aria-hidden="true"
                        className="mt-2 block h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-stone-100"
                      >
                        <span
                          className="bg-accent/70 block h-full rounded-full"
                          style={{
                            width: `${Math.max(
                              6,
                              (r.placement_percentage / peakRate) * 100,
                            )}%`,
                          }}
                        />
                      </span>
                    )}
                  </th>
                  {columns.map((c) => (
                    <td
                      key={c.id}
                      className={`px-4 py-3 text-right whitespace-nowrap ${
                        c.has(r)
                          ? "text-navy font-semibold"
                          : // stone-300 on white is ~1.5:1, far under the
                            // 4.5:1 WCAG 1.4.3 minimum — and the dash is the
                            // only thing saying "no figure for this year".
                            "font-normal text-stone-500"
                      }`}
                    >
                      {c.has(r) ? (
                        c.format(r)
                      ) : (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">Not recorded</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        Select a year to load its figures, recruiters, placed students and
        company-wise breakdown on this page.
      </p>
    </EditableRegion>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function PlacementsPageLayout({
  institution,
  records,
  info,
  gallery = null,
  gallerySlug,
  selectedRecordId,
  onSelectRecord,
  editable = false,
  onEditSection,
}: {
  institution: string;
  records: PublicPlacement[];
  info: PlacementInfoValue;
  /**
   * The placement-gallery content page, which used to live at
   * `/placements/gallery` and now renders as a section of this page. The admin
   * preview passes its draft too, so it is edited here rather than anywhere
   * else.
   */
  gallery?: ContentPageValue | null;
  /**
   * Set in the admin preview alongside `gallery` — makes the gallery section
   * click-to-edit, keyed `hosted:<slug>:<section>`.
   */
  gallerySlug?: string;
  /**
   * Controlled year selection. The admin preview owns it, so the year showing
   * on the page and the year open in the inspector cannot drift apart; the
   * public route leaves both unset and the switcher keeps its own state.
   */
  selectedRecordId?: string;
  onSelectRecord?: (id: string) => void;
} & EditProps) {
  const label = INSTITUTION_LABELS[institution] ?? "JCT";
  // The current record is the one flagged is_current, else the newest (records
  // arrive sorted is_current desc, then year desc).
  const current = records.find((r) => r.is_current) ?? records[0] ?? null;
  const [ownSelectedId, setOwnSelectedId] = useState<string>(
    current?._id ?? "",
  );
  const selectedId = selectedRecordId ?? ownSelectedId;
  const setSelectedId = onSelectRecord ?? setOwnSelectedId;
  const active = records.find((r) => r._id === selectedId) ?? current ?? null;

  // Only the selected year's photographs are published; the editor keeps every
  // block so each one stays clickable.
  const filteredGallery = useMemo(
    () => galleryForYear(gallery ?? null, active?.year ?? ""),
    [gallery, active],
  );
  const visibleGallery = editable ? (gallery ?? null) : filteredGallery;

  // What the public page would show for the selected year, surfaced in the
  // editor — otherwise an admin sees every album in the preview and has no way
  // to tell that visitors see a subset (or, when titles don't carry the year,
  // all of them regardless of the year picker).
  const galleryFilterNote = useMemo(() => {
    if (!editable || !gallery) return null;
    const total = gallery.blocks?.length ?? 0;
    const shown = filteredGallery?.blocks?.length ?? 0;
    if (total === 0 || shown === total) return null;
    return { shown, total, year: active?.year ?? "" };
  }, [editable, gallery, filteredGallery, active]);

  // A built-in nav entry only appears once its section actually has content —
  // an empty MoU list or a college with no placement records must not leave a
  // dead anchor in the sidebar.
  // In the admin editor every CMS section is always shown, empty or not —
  // otherwise there'd be nothing to click to fill it in.
  const present = useMemo(() => {
    const set = new Set<string>();
    if (editable || info.banner.images.some((img) => img.image))
      set.add("banner");
    if (editable || info.mou.items.length > 0) set.add("mou");
    if (editable || info.whyRecruit.points.length > 0) set.add("why-recruit");
    if (
      editable ||
      info.tpo.contacts.length > 0 ||
      info.tpo.office.address ||
      info.tpo.office.phone ||
      info.tpo.office.email
    )
      set.add("tpo");
    if (editable || info.process.steps.length > 0) set.add("process");
    // Publicly the gallery appears only once it has content; in the editor it
    // is always shown, empty or not, so there is something to click to fill in.
    if (editable ? !!gallery : (visibleGallery?.blocks?.length ?? 0) > 0)
      set.add(PLACEMENT_GALLERY_ANCHOR);
    if (active) {
      set.add("overview");
      // The history table only earns its place once there is more than one year
      // to compare — with a single record it would just restate the overview.
      if (records.length > 1) set.add("history");
      // Empty year-wise blocks are hidden publicly but always shown in the
      // editor — otherwise there is nothing to click to add the first entry.
      if (editable || active.top_recruiters.length > 0) set.add("recruiters");
      if (editable || active.notable_placements.length > 0)
        set.add("achievers");
      if (editable || active.company_placements.length > 0)
        set.add("company-wise");
    }
    return set;
  }, [info, active, editable, gallery, visibleGallery, records.length]);

  const navItems = useMemo(
    () =>
      resolveSidebarItems(PLACEMENT_NAV_DEFAULTS, info.sidebar.navItems).filter(
        (it) => it.customHref || it.customSection || present.has(it.anchor),
      ),
    [info.sidebar.navItems, present],
  );

  const customSections = navItems.filter((it) => it.customSection);
  const [activeId, setActiveId] = useState<string>("");
  const rootRef = useRef<HTMLElement>(null);

  /**
   * Sections are looked up inside this page's own subtree, never with
   * `document.getElementById`. React's streaming leaves a second, hidden copy
   * of the document in the DOM carrying the same ids, and a document-wide
   * lookup resolves to that copy — scrolling to an element that is not
   * displayed, i.e. not scrolling at all.
   */
  const findSection = (anchor: string) =>
    rootRef.current?.querySelector<HTMLElement>(`[id="${anchor}"]`) ?? null;

  // Scroll-spy: highlight the sidebar entry whose section is in view. Keyed on
  // the anchor list so the observers are rebuilt only when the nav changes,
  // not on every render.
  const anchorKey = navItems
    .filter((it) => !it.customHref)
    .map((it) => it.anchor)
    .join(",");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const anchors = anchorKey ? anchorKey.split(",") : [];
    if (anchors.length === 0) return;
    setActiveId((prev) => (prev && anchors.includes(prev) ? prev : anchors[0]));
    const observers: IntersectionObserver[] = [];
    for (const anchor of anchors) {
      const el = findSection(anchor);
      if (!el) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(anchor);
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((obs) => obs.disconnect());
  }, [anchorKey]);

  const handleNavigate = (anchor: string) => {
    setActiveId(anchor);
    const el = findSection(anchor);
    if (!el) return;
    const offset = window.innerWidth >= 1024 ? 120 : 90;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // A deep link — `…/placements#gallery`, where the retired gallery route now
  // redirects — has to land on its section. The browser's own fragment scroll
  // can't do it: it resolves the id to the hidden streamed copy, and even when
  // it lands it puts the heading under the sticky header.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || editable) return;
    const anchor = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!anchor || !anchorKey.split(",").includes(anchor)) return;
    if (!findSection(anchor)) return;
    deepLinked.current = true;
    handleNavigate(anchor);
    // `handleNavigate` is redefined every render; the anchor list is what
    // decides whether the target exists yet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorKey, editable]);

  // Switching years from the sidebar swaps the record in place; on mobile the
  // year pills sit above the content, so jump to the stats the choice affects.
  const handleSelectYear = (id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) handleNavigate("overview");
  };

  // The editor always renders the shell, even for a college with nothing yet:
  // the sidebar is where a first year — and every other section — is added.
  const hasSections = editable || records.length > 0 || present.size > 0;
  const isEmpty = !hasSections;

  // No `overflow-x-hidden` here: `overflow-x: hidden` computes overflow-y to
  // `auto`, which makes <main> the sticky sidebar's scroll container — the
  // sidebar would then scroll away with the page instead of pinning.
  return (
    <main ref={rootRef} className="bg-background text-foreground min-h-screen">
      {!editable && <Navbar />}
      <PageHero
        title="Placements"
        subtitle={`Career outcomes at JCT ${label}`}
      />
      <div className="section-padding bg-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label, href: `/institutions/${institution}` },
                { label: "Placements" },
              ]}
            />
          </div>

          {isEmpty ? (
            <div className="border-border rounded-2xl border border-dashed bg-white py-20 text-center">
              <Briefcase size={32} className="mx-auto mb-3 text-stone-300" />
              <p className="text-stone-500">
                Placement details will be published here soon.
              </p>
            </div>
          ) : !hasSections ? null : (
            <>
              <div className="mb-6 lg:hidden">
                <PlacementSideNav
                  items={navItems}
                  activeId={activeId}
                  onNavigate={handleNavigate}
                  records={records}
                  selectedId={active?._id ?? ""}
                  onSelectYear={handleSelectYear}
                  editable={editable}
                  onEditSection={onEditSection}
                />
              </div>

              <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-10 xl:grid-cols-[300px_1fr] xl:gap-12">
                {/* `sticky` needs the grid item to be its own box, not stretched
                    to the row height — hence `items-start` above. */}
                <div className="sticky top-24 hidden max-h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain lg:block">
                  <PlacementSideNav
                    items={navItems}
                    activeId={activeId}
                    onNavigate={handleNavigate}
                    records={records}
                    selectedId={active?._id ?? ""}
                    onSelectYear={handleSelectYear}
                    editable={editable}
                    onEditSection={onEditSection}
                  />
                </div>

                <div className="min-w-0 space-y-16">
                  {present.has("banner") && (
                    <BannerSection
                      data={info.banner}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}
                  {present.has("process") && (
                    <ProcessSection
                      data={info.process}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}
                  {present.has("tpo") && (
                    <TpoSection
                      data={info.tpo}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}
                  {present.has("mou") && (
                    <MouSection
                      data={info.mou}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}
                  {present.has("why-recruit") && (
                    <WhyRecruitSection
                      data={info.whyRecruit}
                      label={label}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}

                  {active && (
                    <>
                      <section id="overview" className="scroll-mt-28">
                        <CurrentYear
                          record={active}
                          editable={editable}
                          onEditSection={onEditSection}
                        />
                      </section>
                      {present.has("history") && (
                        <PlacementHistory
                          records={records}
                          selectedId={active._id}
                          onSelectYear={handleSelectYear}
                          editable={editable}
                          onEditSection={onEditSection}
                        />
                      )}
                      {present.has("recruiters") && (
                        <TopRecruiters
                          record={active}
                          editable={editable}
                          onEditSection={onEditSection}
                        />
                      )}
                      {present.has("achievers") && (
                        <PlacedStudents
                          record={active}
                          editable={editable}
                          onEditSection={onEditSection}
                        />
                      )}
                      {present.has("company-wise") && (
                        <CompanyPlacements
                          record={active}
                          editable={editable}
                          onEditSection={onEditSection}
                        />
                      )}
                    </>
                  )}

                  {present.has(PLACEMENT_GALLERY_ANCHOR) && visibleGallery && (
                    <section
                      id={PLACEMENT_GALLERY_ANCHOR}
                      className="scroll-mt-28"
                    >
                      <EditableRegion
                        as="div"
                        section={
                          gallerySlug
                            ? hostedSectionKey(gallerySlug, "hero")
                            : ""
                        }
                        label="Placement Gallery — Heading"
                        editable={editable && !!gallerySlug}
                        onEditSection={onEditSection}
                      >
                        <SectionHeading
                          icon={Camera}
                          eyebrow="Gallery"
                          title={
                            visibleGallery.hero?.title?.trim() ||
                            "Placement Gallery"
                          }
                          meta={
                            !editable && active
                              ? `${active.year} photos`
                              : undefined
                          }
                        />
                      </EditableRegion>
                      {galleryFilterNote && (
                        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                          Editing view shows all {galleryFilterNote.total}{" "}
                          albums. Visitors who select{" "}
                          {galleryFilterNote.year || "this year"} see{" "}
                          {galleryFilterNote.shown} — an album is matched to a
                          year by the first four-digit number in its title.
                        </p>
                      )}
                      <ContentPageBody
                        data={visibleGallery}
                        editable={editable && !!gallerySlug}
                        onEditSection={
                          gallerySlug
                            ? (s) =>
                                onEditSection?.(
                                  hostedSectionKey(gallerySlug, s),
                                )
                            : undefined
                        }
                      />
                    </section>
                  )}

                  {/* Custom in-page sections defined by admins in the sidebar editor */}
                  {customSections.map((sec) => (
                    <EditableRegion
                      key={sec.id}
                      as="section"
                      id={sec.anchor}
                      section={`custom:${sec.anchor}`}
                      label={sec.navLabel}
                      editable={editable}
                      onEditSection={onEditSection}
                      className="scroll-mt-28"
                    >
                      <SectionHeading icon={sec.icon} title={sec.navLabel} />
                      {editable && (sec.blocks?.length ?? 0) === 0 ? (
                        <EmptyHint>Click to add content blocks</EmptyHint>
                      ) : (
                        <PageBlocksRenderer
                          blocks={
                            (sec.blocks ?? []) as unknown as PageBodySection[]
                          }
                        />
                      )}
                    </EditableRegion>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {!editable && (
        <div id="footer">
          <Footer />
        </div>
      )}
    </main>
  );
}
