import {
  Award,
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  Camera,
  ClipboardList,
  FileEdit,
  GraduationCap,
  Image,
  Info,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  MessageSquare,
  MousePointerClick,
  PanelBottom,
  PanelTop,
  ScrollText,
  Settings,
  Sparkles,
  TreePalm,
  Users,
} from "lucide-react";
import type { IconType } from "./types";

export type ModuleLink = {
  label: string;
  href: string;
  icon: IconType;
  section: string;
  keywords?: string;
};

export type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: IconType;
};

export const INSTITUTION_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
  all: "All colleges",
  main: "Main site",
};

/** Large action cards on the dashboard + the header quick-actions menu. */
export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Add Program",
    description: "Create or edit degree programs",
    href: "/admin/programs",
    icon: GraduationCap,
  },
  {
    label: "Create Event",
    description: "Publish news and campus events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Add Placement",
    description: "Record placement statistics",
    href: "/admin/placements",
    icon: Briefcase,
  },
  {
    label: "Manage Testimonials",
    description: "Curate alumni and student voices",
    href: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    label: "Dynamic Pages",
    description: "Build standalone CMS pages",
    href: "/admin/pages",
    icon: FileEdit,
  },
  {
    label: "Site Settings",
    description: "Backups, restore and configuration",
    href: "/admin/settings",
    icon: Settings,
  },
];

function collegeModules(id: string, label: string): ModuleLink[] {
  const items: ModuleLink[] = [
    {
      label: "Hero",
      href: `/admin/page-content?college=${id}&section=hero`,
      icon: Image,
      section: label,
      keywords: "banner landing",
    },
    {
      label: "Programs",
      href: `/admin/programs?college=${id}`,
      icon: GraduationCap,
      section: label,
      keywords: "courses degrees departments",
    },
    {
      label: "Placements",
      href: `/admin/placements?college=${id}`,
      icon: Briefcase,
      section: label,
      keywords: "recruiters packages jobs",
    },
    {
      label: "Placement Highlights",
      href: `/admin/recruiters?college=${id}`,
      icon: Award,
      section: label,
      keywords: "recruiters logos companies",
    },
    {
      label: "Admissions",
      href: `/admin/page-content?college=${id}&section=admissions`,
      icon: ClipboardList,
      section: label,
      keywords: "apply enquiry",
    },
    {
      label: "Life at JCT",
      href: `/admin/page-content?college=${id}&section=lifeAtJct`,
      icon: Camera,
      section: label,
      keywords: "gallery photos campus",
    },
    {
      label: "News & Events",
      href: `/admin/events?college=${id}`,
      icon: CalendarDays,
      section: label,
      keywords: "announcements calendar",
    },
    {
      label: "Testimonials",
      href: `/admin/page-content?college=${id}&section=testimonials`,
      icon: MessageSquare,
      section: label,
      keywords: "reviews quotes alumni",
    },
    {
      label: "About Us",
      href: `/admin/about?college=${id}`,
      icon: Info,
      section: label,
    },
    {
      label: "Accreditations",
      href: `/admin/accreditations?college=${id}`,
      icon: Award,
      section: label,
      keywords: "naac nba certifications",
    },
    {
      label: "Navbar",
      href: `/admin/page-content?college=${id}&section=navbar`,
      icon: PanelTop,
      section: label,
      keywords: "menu navigation links",
    },
  ];
  if (id === "engineering") {
    items.push(
      {
        label: "Announcement Bar",
        href: "/admin/page-content?college=engineering&section=announcement",
        icon: Bell,
        section: label,
      },
      {
        label: "Performance Metrics",
        href: "/admin/page-content?college=engineering&section=metrics",
        icon: BarChart3,
        section: label,
        keywords: "stats numbers",
      },
      {
        label: "Centre of Excellence",
        href: "/admin/coe",
        icon: ScrollText,
        section: label,
        keywords: "coe",
      },
    );
  }
  return items;
}

/** Every admin destination reachable from dashboard search. */
export const MODULE_REGISTRY: ModuleLink[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    section: "Admin",
    keywords: "home overview",
  },
  {
    label: "Dynamic Pages",
    href: "/admin/pages",
    icon: FileEdit,
    section: "Admin",
    keywords: "cms standalone custom pages",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    section: "Admin",
    keywords: "editors admins accounts roles",
  },
  {
    label: "Audit Log",
    href: "/admin/audit",
    icon: ClipboardList,
    section: "Admin",
    keywords: "activity history changes",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    section: "Admin",
    keywords: "backup restore config",
  },
  {
    label: "Footer",
    href: "/admin/global/page-content?section=footer",
    icon: PanelBottom,
    section: "Global",
    keywords: "links contact",
  },
  {
    label: "Floating Elements",
    href: "/admin/global/page-content?section=floatingElements",
    icon: MousePointerClick,
    section: "Global",
    keywords: "whatsapp buttons",
  },
  {
    label: "Navbar",
    href: "/admin/main/page-content?section=navbar",
    icon: PanelTop,
    section: "Main site",
    keywords: "menu navigation",
  },
  {
    label: "Pamphlet Popup",
    href: "/admin/main/page-content?section=pamphlet",
    icon: Layers,
    section: "Main site",
    keywords: "brochure prospectus modal",
  },
  {
    label: "Hero",
    href: "/admin/main/page-content?section=hero",
    icon: Image,
    section: "Main site",
    keywords: "banner homepage",
  },
  {
    label: "Accreditation Logos",
    href: "/admin/main/page-content?section=accreditations",
    icon: Award,
    section: "Main site",
  },
  {
    label: "Statistics",
    href: "/admin/main/page-content?section=statistics",
    icon: BarChart3,
    section: "Main site",
    keywords: "numbers counters",
  },
  {
    label: "Why Choose JCT",
    href: "/admin/main/page-content?section=whyChooseJct",
    icon: Sparkles,
    section: "Main site",
  },
  {
    label: "Card",
    href: "/admin/main/page-content?section=card",
    icon: LayoutGrid,
    section: "Main site",
  },
  {
    label: "Placement Highlights",
    href: "/admin/recruiters?scope=main",
    icon: Award,
    section: "Main site",
    keywords: "recruiters logos",
  },
  {
    label: "Life at JCT",
    href: "/admin/main/page-content?section=lifeAtJct",
    icon: Camera,
    section: "Main site",
    keywords: "gallery photos",
  },
  {
    label: "News & Events",
    href: "/admin/events?scope=main",
    icon: CalendarDays,
    section: "Main site",
    keywords: "announcements",
  },
  {
    label: "Testimonials",
    href: "/admin/main/page-content?section=testimonials",
    icon: MessageSquare,
    section: "Main site",
    keywords: "reviews quotes",
  },
  {
    label: "Admissions",
    href: "/admin/main/page-content?section=homeAdmissions",
    icon: ClipboardList,
    section: "Main site",
  },
  {
    label: "About Us",
    href: "/admin/about?college=main",
    icon: Info,
    section: "Main site",
  },
  {
    label: "Accreditations",
    href: "/admin/accreditations?college=main",
    icon: Award,
    section: "Main site",
  },
  {
    label: "Campus Life",
    href: "/admin/campus-life",
    icon: TreePalm,
    section: "Main site",
    keywords: "hostel sports library",
  },
  ...collegeModules("engineering", "Engineering"),
  ...collegeModules("arts-science", "Arts & Science"),
  ...collegeModules("polytechnic", "Polytechnic"),
];

/** Shown when the search field is focused with an empty query. */
export const SEARCH_SUGGESTIONS: ModuleLink[] = [
  MODULE_REGISTRY.find((m) => m.label === "Dynamic Pages")!,
  MODULE_REGISTRY.find(
    (m) => m.label === "Programs" && m.section === "Engineering",
  )!,
  MODULE_REGISTRY.find(
    (m) => m.label === "News & Events" && m.section === "Main site",
  )!,
  MODULE_REGISTRY.find(
    (m) => m.label === "Placements" && m.section === "Engineering",
  )!,
  MODULE_REGISTRY.find((m) => m.label === "Users")!,
  MODULE_REGISTRY.find((m) => m.label === "Audit Log")!,
  MODULE_REGISTRY.find((m) => m.label === "Settings")!,
];

export function searchModules(query: string, limit = 9): ModuleLink[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MODULE_REGISTRY.map((mod) => {
    const label = mod.label.toLowerCase();
    const haystack =
      `${label} ${mod.section.toLowerCase()} ${mod.keywords ?? ""}`.trim();
    let score = 0;
    if (label.startsWith(q)) score = 3;
    else if (label.includes(q)) score = 2;
    else if (haystack.includes(q)) score = 1;
    return { mod, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.mod);
}

/** Icon lookup for "Continue editing" chips saved by href. */
export function iconForHref(href: string): IconType | undefined {
  return (
    MODULE_REGISTRY.find((m) => m.href === href) ??
    QUICK_ACTIONS.find((a) => a.href === href)
  )?.icon;
}
