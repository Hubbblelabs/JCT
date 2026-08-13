/**
 * Single source of truth for admin navigation.
 *
 * Every destination is reachable from the sidebar tree alone — there is no
 * per-section hub page in between any more, so this registry is what the
 * sidebar, the breadcrumbs and the Ctrl+K palette all read.
 *
 * Item order inside a group follows the order the sections appear on the
 * public page it edits, so scanning the sidebar top-to-bottom walks the live
 * page top-to-bottom.
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
  DatabaseBackup,
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
  Newspaper,
  PanelBottom,
  PanelTop,
  ScrollText,
  Sparkles,
  TreePalm,
  Users,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import { hasMinRole } from "@/lib/permissions";
import { CONTENT_PAGES, mainContentPages } from "@/lib/content-pages";

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
  /** Stable key — used for the sidebar's expanded-branch state. */
  id: string;
  label: string;
  /** Short label for the sidebar row. */
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

/**
 * Order of the standalone content-page editors inside "Other Pages". Anything
 * the registry gains later that is not listed here lands at the end rather
 * than disappearing.
 */
const CONTENT_PAGE_ORDER: string[] = [
  "library",
  "professional-bodies",
  "cyber-safety",
  "nss",
  "feedback-system",
  "mandatory-disclosures",
  "hr-manual",
  "fine-arts-club",
];

/**
 * Groups for one college: what the landing page renders, then every other
 * page. Engineering carries extra sub-pages.
 */
function collegeGroups(college: College): AdminNavGroup[] {
  const eng = college === "engineering";
  const q = `college=${college}`;
  const pc = (section: string) => `/admin/page-content?${q}&section=${section}`;

  // Editors for the block-based content pages (Library, NSS, HR Manual, …).
  // They all share one route — the registry decides which pages exist.
  //
  // A page with a `host` is deliberately absent: it publishes as a panel of
  // another page (Timeline inside About, NIRF inside Reports & Downloads, the
  // NAAC sub-pages inside NAAC…), and its editor is reached from that page's
  // own editor. Listing it here as well would offer two doors to one panel.
  const contentItems = (): AdminNavItem[] =>
    CONTENT_PAGES.filter((p) => p.institution === college && !p.host)
      .slice()
      .sort((a, b) => {
        const ai = CONTENT_PAGE_ORDER.indexOf(a.slug);
        const bi = CONTENT_PAGE_ORDER.indexOf(b.slug);
        return (
          (ai === -1 ? CONTENT_PAGE_ORDER.length : ai) -
          (bi === -1 ? CONTENT_PAGE_ORDER.length : bi)
        );
      })
      .map((p) => ({
        label: p.label,
        href: `/admin/content/${p.slug}`,
        icon: p.icon,
        description: p.description,
      }));

  // Ordered as every college landing page renders, top to bottom.
  const landingPage: AdminNavItem[] = [
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
      label: "Navbar",
      href: pc("navbar"),
      icon: PanelTop,
      description: "Header links, dropdowns and their order.",
    },
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
      label: "News & Events Section",
      href: pc("upcomingEvents"),
      icon: CalendarDays,
      description:
        "Wording of the landing-page events strip. The entries come from News & Events.",
    },
    {
      label: "Admissions",
      href: pc("admissions"),
      icon: ClipboardList,
      description: "Admissions block — steps, dates and contact details.",
    },
    {
      label: "Placement Highlights",
      href: `/admin/recruiters?${q}`,
      icon: Award,
      description: "Recruiter logos and highlight stats.",
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

  const otherPages: AdminNavItem[] = [
    {
      label: "Programs",
      href: `/admin/programs?${q}`,
      icon: GraduationCap,
      description: "Program cards and their full tabbed page content.",
    },
    {
      label: "News & Events",
      href: `/admin/events?${q}`,
      icon: CalendarDays,
      description: "Announcements, events and news entries.",
    },
    {
      // Posts are owned by a college (that is what scopes who may edit them)
      // but they all publish to the one site-wide /blogs listing.
      label: "Blogs",
      href: `/admin/blogs?${q}`,
      icon: Newspaper,
      description: "Blog posts published on the site-wide /blogs page.",
    },
    {
      label: "About Us",
      href: `/admin/about?${q}`,
      icon: Info,
      description:
        "About page sections and the Timeline tab, live preview editor.",
    },
    {
      // One door to everything placements: the page editor owns the layout and
      // links across to the year-wise records and the gallery tab.
      label: "Placements",
      href: `/admin/placements-page?${q}`,
      icon: Briefcase,
      description:
        "Placements page layout, the year-wise records and the gallery tab.",
    },
    ...(eng
      ? [
          {
            label: "Centre of Excellence",
            href: "/admin/coe",
            icon: ScrollText,
            description: "CoE page sections, live preview editor.",
          },
        ]
      : []),
    {
      // Named as the public navbar names it, so the admin entry and the live
      // link read the same.
      label: "Affiliation & Accreditation",
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
              "NAAC appeal tables, documents and the best practices / distinctiveness / AQAR tabs.",
          },
          {
            label: "Research",
            href: "/admin/research",
            icon: FlaskConical,
            description: "Research page sections and publications.",
          },
          {
            label: "Clubs",
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
    ...(eng
      ? [
          {
            // Public label is "Reports & Downloads" — kept in step here so the
            // admin entry and the navbar entry name the same page.
            label: "Reports & Downloads",
            href: "/admin/documents",
            icon: FolderOpen,
            description:
              "Downloads and the NIRF / financial statements / ICT content tabs.",
          },
        ]
      : []),
    ...contentItems(),
  ];

  return [
    { title: "Landing Page", items: landingPage },
    { title: "Other Pages", items: otherPages },
  ];
}

const MAIN_GROUPS: AdminNavGroup[] = [
  {
    // Ordered as the home page renders: the pamphlet popup that greets the
    // visitor, the header, then hero, accreditation strip, statistics,
    // why-choose, institution cards, placements, campus life, testimonials and
    // admissions.
    title: "Landing Page",
    items: [
      {
        label: "Pamphlet Popup",
        href: "/admin/main/page-content?section=pamphlet",
        icon: Layers,
        description: "Entry popup with the downloadable pamphlet.",
      },
      {
        label: "Navbar",
        href: "/admin/main/page-content?section=navbar",
        icon: PanelTop,
        description: "Top-level site navigation links.",
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
        // Has no section of its own on the home page, so it lives here rather
        // than in the Landing Page group.
        label: "News & Events",
        href: "/admin/events?scope=main",
        icon: CalendarDays,
        description: "Site-wide news and event entries.",
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
  {
    // The pages the footer links to from every site. They are block-based
    // content pages like the college ones, but belong to no college — so they
    // are listed here rather than under a college's "Other Pages" group.
    title: "Pages",
    items: [
      ...mainContentPages()
        .filter((p) => !p.host)
        .map((p) => ({
          label: p.label,
          href: `/admin/content/${p.slug}`,
          icon: p.icon,
          description: p.description,
        })),
      {
        // /blogs is one institution-agnostic listing carrying every college's
        // posts, and the footer links it from every site — so it belongs with
        // the other footer pages here rather than under Main Website. This
        // entry is the read-only aggregate; authoring happens in a college's
        // own Blogs screen, which is what scopes who may edit a post.
        label: "Blogs",
        href: "/admin/blogs?scope=main",
        icon: Newspaper,
        description: "Every blog post across all colleges (read-only).",
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
        label: "Backup & restore",
        href: "/admin/settings",
        icon: DatabaseBackup,
        description:
          "Export or schedule an archive, restore one, or reset everything.",
        minRole: "admin",
      },
    ],
  },
];

/**
 * Sidebar order: tools first, then content from the widest scope inwards —
 * global (every page of every site) → main site → each college.
 */
export const ADMIN_SECTIONS: AdminNavSection[] = [
  {
    id: "admin",
    label: "Admin Tools",
    navLabel: "Admin",
    description: "Dynamic pages, users, audit trail and site settings.",
    icon: Wrench,
    groups: ADMIN_GROUPS,
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
    id: "main",
    label: "Main Website",
    navLabel: "Main",
    description: "Home page sections and the institution-wide pages.",
    icon: Home,
    adminOnly: true,
    groups: MAIN_GROUPS,
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
];

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

/** A section is active on any page it links to. */
export function isSectionActive(
  section: AdminNavSection,
  role: string,
  pathname: string,
  url: NavScope,
): boolean {
  return sectionItems(section, role).some((i) =>
    isItemActive(i.href, pathname, url),
  );
}

/**
 * First page this user can actually open — where an editor lands, now that
 * there is no per-section hub to send them to.
 */
export function firstNavHref(role: string, institution: string): string {
  const sections = visibleSections(role, institution);
  // An editor's own college comes first even though Admin Tools sits above it
  // in the tree — landing them on Dynamic Pages instead of their college would
  // be a worse start than the college hub they used to get.
  const ordered = [
    ...sections.filter((s) => s.institution === institution),
    ...sections.filter((s) => s.institution !== institution),
  ];
  for (const section of ordered) {
    const first = sectionItems(section, role)[0];
    if (first) return first.href;
  }
  return "/admin/programs";
}

/**
 * Where the user currently is, as section → group → item.
 *
 * The sidebar uses it to expand and highlight the right branch, and the topbar
 * turns it into breadcrumbs. Before this, no admin screen told you where you
 * were: every editor page rendered a bare title with a Back button hardcoded
 * to `/admin/dashboard` — a page editors are redirected away from.
 */
export type NavTrail = {
  section?: AdminNavSection;
  group?: AdminNavGroup;
  item?: AdminNavItem;
};

export function findNavTrail(
  role: string,
  institution: string,
  pathname: string,
  url: NavScope,
): NavTrail {
  for (const section of visibleSections(role, institution)) {
    for (const group of visibleGroups(section, role)) {
      for (const item of group.items) {
        if (isItemActive(item.href, pathname, url))
          return { section, group, item };
      }
    }
  }
  return {};
}

/**
 * Routes that render the public page edge-to-edge for live preview. The
 * sidebar collapses to its icon rail on these so the preview gets the width,
 * but it is no longer removed outright — the old top nav hid itself entirely
 * here, which left the editor with no way out of the page except the browser's
 * Back button.
 */
const IMMERSIVE_ROUTES = [
  "/admin/about",
  "/admin/coe",
  "/admin/campus-life",
  "/admin/research",
  "/admin/clubs",
  "/admin/committees",
  "/admin/documents",
  "/admin/naac",
  "/admin/accreditations",
  "/admin/placements-page",
];

export function isImmersiveRoute(pathname: string): boolean {
  if (IMMERSIVE_ROUTES.includes(pathname)) return true;
  // The program builder and the Page editor are split-pane too.
  if (pathname.startsWith("/admin/programs/") && pathname !== "/admin/programs")
    return true;
  if (pathname.startsWith("/admin/pages/") && pathname !== "/admin/pages")
    return true;
  if (pathname.startsWith("/admin/content/")) return true;
  return false;
}
