/**
 * Single source of truth for admin navigation.
 *
 * The top nav used to carry every content link inside per-section dropdowns,
 * which grew far past a usable length. Now the nav only links to one hub page
 * per section (`/admin/hub/[section]`), and this registry drives both the nav
 * triggers and the grouped card grid rendered on each hub.
 */
import {
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  Camera,
  ClipboardList,
  FileEdit,
  FlaskConical,
  FolderOpen,
  Globe,
  GraduationCap,
  Home,
  Image as ImageIcon,
  Info,
  Layers,
  LayoutGrid,
  MessageSquare,
  MousePointerClick,
  PanelBottom,
  PanelTop,
  ScrollText,
  Settings,
  Sparkles,
  TreePalm,
  Users,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import { hasMinRole } from "@/lib/permissions";
import { CONTENT_PAGES } from "@/lib/content-pages";

export type AdminRole = "editor" | "admin";

export type AdminNavIcon = ComponentType<{
  size?: number;
  className?: string;
}>;

export type AdminNavItem = {
  label: string;
  href: string;
  icon: AdminNavIcon;
  /** One-line description shown on the hub card. */
  description: string;
  minRole?: AdminRole;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export type AdminNavSection = {
  /** URL segment: /admin/hub/<id> */
  id: string;
  label: string;
  /** Short label for the top nav trigger. */
  navLabel: string;
  description: string;
  icon: AdminNavIcon;
  /** Admin-only sections are hidden from editors entirely. */
  adminOnly?: boolean;
  /** Set for college sections — editors may only open their own institution. */
  institution?: College;
  groups: AdminNavGroup[];
};

export type College = "engineering" | "arts-science" | "polytechnic";

export const COLLEGE_LABELS: Record<College, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

const COLLEGE_NAV_LABELS: Record<College, string> = {
  engineering: "Engineering",
  "arts-science": "Arts",
  polytechnic: "Polytechnic",
};

/** Colleges that publish a committees & cells page — see /admin/committees. */
const COMMITTEE_COLLEGES: College[] = ["engineering", "polytechnic"];

/** Groups for one college. Engineering carries extra sub-pages. */
function collegeGroups(college: College): AdminNavGroup[] {
  const eng = college === "engineering";
  const q = `college=${college}`;
  const pc = (section: string) => `/admin/page-content?${q}&section=${section}`;

  // Editors for the block-based content pages (Library, NIRF, Timeline, …).
  // They all share one route — the registry decides which pages exist and
  // which hub group each card belongs to.
  const contentItems = (
    group: (typeof CONTENT_PAGES)[number]["group"],
  ): AdminNavItem[] =>
    CONTENT_PAGES.filter(
      (p) => p.institution === college && p.group === group,
    ).map((p) => ({
      label: p.label,
      href: `/admin/content/${p.slug}`,
      icon: p.icon,
      description: p.description,
    }));

  const homePage: AdminNavItem[] = [
    {
      label: "Navbar",
      href: pc("navbar"),
      icon: PanelTop,
      description: "Header links, dropdowns and their order.",
    },
    ...(eng
      ? [
          {
            label: "Announcement Bar",
            href: pc("announcement"),
            icon: Bell,
            description: "The strip above the header — enable text and links.",
          },
        ]
      : []),
    {
      label: "Hero",
      href: pc("hero"),
      icon: ImageIcon,
      description: "Landing banner headline, media and call-to-action.",
    },
    ...(eng
      ? [
          {
            label: "Performance Metrics",
            href: pc("metrics"),
            icon: BarChart3,
            description: "The numbers strip on the landing page.",
          },
        ]
      : []),
    {
      label: "Admissions",
      href: pc("admissions"),
      icon: ClipboardList,
      description: "Admissions block — steps, dates and contact details.",
    },
    {
      label: "Life at JCT",
      href: pc("lifeAtJct"),
      icon: Camera,
      description: "Photo gallery categories and images.",
    },
    {
      label: "Testimonials",
      href: pc("testimonials"),
      icon: MessageSquare,
      description: "Alumni, student and industry quotes.",
    },
  ];

  const academics: AdminNavItem[] = [
    {
      label: "Programs",
      href: `/admin/programs?${q}`,
      icon: GraduationCap,
      description: "Program cards and their full tabbed page content.",
    },
    ...(eng
      ? [
          {
            label: "Centre of Excellence",
            href: "/admin/coe",
            icon: ScrollText,
            description: "CoE page sections, live preview editor.",
          },
          {
            label: "Research",
            href: "/admin/research",
            icon: FlaskConical,
            description: "Research page sections and publications.",
          },
        ]
      : []),
    ...contentItems("Academics"),
  ];

  const placements: AdminNavItem[] = [
    {
      label: "Placements",
      href: `/admin/placements?${q}`,
      icon: Briefcase,
      description: "Placed-student records used across the site.",
    },
    {
      label: "Placements Page",
      href: `/admin/placements-page?${q}`,
      icon: ScrollText,
      description: "Layout and copy of the placements page.",
    },
    {
      label: "Placement Highlights",
      href: `/admin/recruiters?${q}`,
      icon: Award,
      description: "Recruiter logos and highlight stats.",
    },
    ...contentItems("Placements"),
  ];

  const campus: AdminNavItem[] = [
    {
      label: "News & Events",
      href: `/admin/events?${q}`,
      icon: CalendarDays,
      description: "Announcements, events and news entries.",
    },
    ...(eng
      ? [
          {
            label: "Clubs & Cells",
            href: "/admin/clubs",
            icon: Sparkles,
            description: "Student clubs and cells page.",
          },
        ]
      : []),
    // Engineering and Polytechnic both publish a committees & cells page; the
    // editor is one route scoped by `?college=`.
    ...(COMMITTEE_COLLEGES.includes(college)
      ? [
          {
            label: "Committees & Cells",
            href: `/admin/committees?${q}`,
            icon: Users,
            description: "Statutory committees and cells page.",
          },
        ]
      : []),
    ...contentItems("Campus & Community"),
  ];

  const institution: AdminNavItem[] = [
    {
      label: "About Us",
      href: `/admin/about?${q}`,
      icon: Info,
      description: "About page sections, live preview editor.",
    },
    {
      label: "Accreditations",
      href: `/admin/accreditations?${q}`,
      icon: Award,
      description: "Accreditation badges, bodies and certificates.",
    },
    ...(eng
      ? [
          {
            label: "NAAC",
            href: "/admin/naac",
            icon: BadgeCheck,
            description:
              "NAAC appeal tables, supporting documents and its sub-page tabs.",
          },
          // Sits here rather than under Campus & Community: the Documents page
          // now also hosts the NIRF, financial statements and ICT content tabs,
          // whose cards are in this group.
          {
            label: "Documents",
            href: "/admin/documents",
            icon: FolderOpen,
            description:
              "Downloads and the NIRF / financial / ICT tabs. Mandatory disclosures and the HR manual have pages of their own.",
          },
        ]
      : []),
    ...contentItems("Institution"),
  ];

  return [
    { title: "Landing Page", items: homePage },
    { title: "Academics", items: academics },
    { title: "Placements", items: placements },
    { title: "Campus & Community", items: campus },
    { title: "Institution", items: institution },
  ];
}

const MAIN_GROUPS: AdminNavGroup[] = [
  {
    title: "Landing Page",
    items: [
      {
        label: "Navbar",
        href: "/admin/main/page-content?section=navbar",
        icon: PanelTop,
        description: "Top-level site navigation links.",
      },
      {
        label: "Pamphlet Popup",
        href: "/admin/main/page-content?section=pamphlet",
        icon: Layers,
        description: "Entry popup with the downloadable pamphlet.",
      },
      {
        label: "Hero",
        href: "/admin/main/page-content?section=hero",
        icon: FileEdit,
        description: "Home banner headline, media and buttons.",
      },
      {
        label: "Accreditation Logos",
        href: "/admin/main/page-content?section=accreditations",
        icon: Award,
        description: "Logo strip shown under the hero.",
      },
      {
        label: "Statistics",
        href: "/admin/main/page-content?section=statistics",
        icon: BarChart3,
        description: "Headline numbers on the home page.",
      },
      {
        label: "Why Choose JCT",
        href: "/admin/main/page-content?section=whyChooseJct",
        icon: Sparkles,
        description: "Value-proposition block.",
      },
      {
        label: "Card",
        href: "/admin/main/page-content?section=card",
        icon: LayoutGrid,
        description: "Institution cards linking to each college.",
      },
      {
        label: "Placement Highlights",
        href: "/admin/recruiters?scope=main",
        icon: Award,
        description: "Site-wide recruiter logos and highlights.",
      },
      {
        label: "Life at JCT",
        href: "/admin/main/page-content?section=lifeAtJct",
        icon: Camera,
        description: "Home page photo gallery.",
      },
      {
        label: "News & Events",
        href: "/admin/events?scope=main",
        icon: CalendarDays,
        description: "Site-wide news and event entries.",
      },
      {
        label: "Testimonials",
        href: "/admin/main/page-content?section=testimonials",
        icon: MessageSquare,
        description: "Quotes shown on the home page.",
      },
      {
        label: "Admissions",
        href: "/admin/main/page-content?section=homeAdmissions",
        icon: ClipboardList,
        description: "Home page admissions block.",
      },
    ],
  },
  {
    title: "Other Pages",
    items: [
      {
        label: "About Us",
        href: "/admin/about?college=main",
        icon: Info,
        description: "Institution-wide about page.",
      },
      {
        label: "Accreditations",
        href: "/admin/accreditations?college=main",
        icon: Award,
        description: "Group-level accreditations page.",
      },
      {
        label: "Campus Life",
        href: "/admin/campus-life",
        icon: TreePalm,
        description: "Campus life page, live preview editor.",
      },
    ],
  },
];

const GLOBAL_GROUPS: AdminNavGroup[] = [
  {
    title: "Site-wide Elements",
    items: [
      {
        label: "Footer",
        href: "/admin/global/page-content?section=footer",
        icon: PanelBottom,
        description: "Footer columns, contact details and social links.",
      },
      {
        label: "Floating Elements",
        href: "/admin/global/page-content?section=floatingElements",
        icon: MousePointerClick,
        description: "Floating buttons and widgets shown on every page.",
      },
    ],
  },
];

const ADMIN_GROUPS: AdminNavGroup[] = [
  {
    title: "Content",
    items: [
      {
        label: "Dynamic Pages",
        href: "/admin/pages",
        icon: FileEdit,
        description: "Standalone CMS pages for any institution.",
        minRole: "editor",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        description: "Admin and editor accounts and their scope.",
        minRole: "admin",
      },
      {
        label: "Audit Log",
        href: "/admin/audit",
        icon: ClipboardList,
        description: "Every content write, newest first.",
        minRole: "admin",
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        description: "Backup, restore and reset site configuration.",
        minRole: "admin",
      },
    ],
  },
];

export const ADMIN_SECTIONS: AdminNavSection[] = [
  {
    id: "main",
    label: "Main Website",
    navLabel: "Main",
    description: "Home page sections and the institution-wide pages.",
    icon: Home,
    adminOnly: true,
    groups: MAIN_GROUPS,
  },
  {
    id: "global",
    label: "Global CMS",
    navLabel: "Global",
    description: "Content that appears on every page of every site.",
    icon: Globe,
    adminOnly: true,
    groups: GLOBAL_GROUPS,
  },
  {
    id: "engineering",
    label: "Engineering College",
    navLabel: COLLEGE_NAV_LABELS.engineering,
    description: "Everything published under /institutions/engineering.",
    icon: GraduationCap,
    institution: "engineering",
    groups: collegeGroups("engineering"),
  },
  {
    id: "arts-science",
    label: "Arts & Science College",
    navLabel: COLLEGE_NAV_LABELS["arts-science"],
    description: "Everything published under /institutions/arts-science.",
    icon: GraduationCap,
    institution: "arts-science",
    groups: collegeGroups("arts-science"),
  },
  {
    id: "polytechnic",
    label: "Polytechnic College",
    navLabel: COLLEGE_NAV_LABELS.polytechnic,
    description: "Everything published under /institutions/polytechnic.",
    icon: GraduationCap,
    institution: "polytechnic",
    groups: collegeGroups("polytechnic"),
  },
  {
    id: "admin",
    label: "Admin Tools",
    navLabel: "Admin",
    description: "Dynamic pages, users, audit trail and site settings.",
    icon: Wrench,
    groups: ADMIN_GROUPS,
  },
];

export function hubHref(sectionId: string): string {
  return `/admin/hub/${sectionId}`;
}

export function getAdminSection(id: string): AdminNavSection | undefined {
  return ADMIN_SECTIONS.find((s) => s.id === id);
}

/** Can this user open the section at all? */
export function canViewSection(
  section: AdminNavSection,
  role: string,
  institution: string,
): boolean {
  const isAdmin = hasMinRole(role, "admin");
  if (isAdmin) return true;
  if (section.adminOnly) return false;
  if (section.institution) return section.institution === institution;
  // Admin Tools stays visible to editors — its items are role-filtered below.
  return visibleGroups(section, role).length > 0;
}

/** Groups with role-hidden items dropped, and empty groups removed. */
export function visibleGroups(
  section: AdminNavSection,
  role: string,
): AdminNavGroup[] {
  return section.groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => hasMinRole(role, i.minRole ?? "editor")),
    }))
    .filter((g) => g.items.length > 0);
}

export function visibleSections(
  role: string,
  institution: string,
): AdminNavSection[] {
  return ADMIN_SECTIONS.filter((s) => canViewSection(s, role, institution));
}

export function sectionItems(
  section: AdminNavSection,
  role: string,
): AdminNavItem[] {
  return visibleGroups(section, role).flatMap((g) => g.items);
}

/** Every reachable item, tagged with its section — powers the quick search. */
export function allNavItems(
  role: string,
  institution: string,
): (AdminNavItem & { sectionLabel: string; sectionId: string })[] {
  return visibleSections(role, institution).flatMap((s) =>
    sectionItems(s, role).map((i) => ({
      ...i,
      sectionLabel: s.label,
      sectionId: s.id,
    })),
  );
}

/**
 * Scoping params compared with strict null-aware equality: an item that omits a
 * param must NOT match a URL that carries it (and vice-versa). This is what
 * keeps the bare `/admin/events` (Main) item from lighting up on every
 * college's `/admin/events?college=X` page.
 */
const SCOPE_PARAMS = ["college", "section", "scope"] as const;

export type NavScope = {
  college: string | null;
  section: string | null;
  scope: string | null;
};

export function isItemActive(
  href: string,
  pathname: string,
  url: NavScope,
): boolean {
  const qIdx = href.indexOf("?");
  const itemPath = qIdx >= 0 ? href.slice(0, qIdx) : href;
  const itemQuery = qIdx >= 0 ? href.slice(qIdx + 1) : "";

  const pathMatch =
    pathname === itemPath || pathname.startsWith(itemPath + "/");
  if (!pathMatch) return false;

  const params = new URLSearchParams(itemQuery);
  for (const key of SCOPE_PARAMS) {
    if ((params.get(key) ?? null) !== (url[key] ?? null)) return false;
  }
  return true;
}

/** A section is active on its own hub page or on any page it links to. */
export function isSectionActive(
  section: AdminNavSection,
  role: string,
  pathname: string,
  url: NavScope,
): boolean {
  if (pathname === hubHref(section.id)) return true;
  return sectionItems(section, role).some((i) =>
    isItemActive(i.href, pathname, url),
  );
}
