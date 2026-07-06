"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Image,
  ClipboardList,
  Users,
  LogOut,
  User,
  ChevronDown,
  Wrench,
  FileEdit,
  Home,
  Bell,
  BarChart3,
  Camera,
  Layers,
  Globe,
  PanelTop,
  PanelBottom,
  Award,
  Sparkles,
  LayoutGrid,
  MousePointerClick,
  Settings,
  Info,
  ScrollText,
  TreePalm,
  CalendarDays,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";
import { hasMinRole } from "@/lib/permissions";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  minRole?: "editor" | "admin";
};

const COLLEGE_ITEMS: Record<string, NavItem[]> = {
  engineering: [
    {
      label: "Navbar",
      href: "/admin/page-content?college=engineering&section=navbar",
      icon: PanelTop,
    },
    {
      label: "Announcement Bar",
      href: "/admin/page-content?college=engineering&section=announcement",
      icon: Bell,
    },
    {
      label: "Hero",
      href: "/admin/page-content?college=engineering&section=hero",
      icon: Image,
    },
    {
      label: "Programs",
      href: "/admin/programs?college=engineering",
      icon: GraduationCap,
    },
    {
      label: "Performance Metrics",
      href: "/admin/page-content?college=engineering&section=metrics",
      icon: BarChart3,
    },
    {
      label: "Placements",
      href: "/admin/placements?college=engineering",
      icon: Briefcase,
    },
    {
      label: "Admissions",
      href: "/admin/page-content?college=engineering&section=admissions",
      icon: ClipboardList,
    },
    {
      label: "Life at JCT",
      href: "/admin/page-content?college=engineering&section=lifeAtJct",
      icon: Camera,
    },
    {
      label: "Testimonials",
      href: "/admin/page-content?college=engineering&section=testimonials",
      icon: MessageSquare,
    },
    {
      label: "News & Events",
      href: "/admin/events?college=engineering",
      icon: CalendarDays,
    },
    {
      label: "About Us",
      href: "/admin/about?college=engineering",
      icon: Info,
    },
    {
      label: "COE",
      href: "/admin/coe",
      icon: ScrollText,
    },
  ],
  "arts-science": [
    {
      label: "Navbar",
      href: "/admin/page-content?college=arts-science&section=navbar",
      icon: PanelTop,
    },
    {
      label: "Hero",
      href: "/admin/page-content?college=arts-science&section=hero",
      icon: FileEdit,
    },
    {
      label: "Programs",
      href: "/admin/programs?college=arts-science",
      icon: GraduationCap,
    },
    {
      label: "Placements",
      href: "/admin/placements?college=arts-science",
      icon: Briefcase,
    },
    {
      label: "Admissions",
      href: "/admin/page-content?college=arts-science&section=admissions",
      icon: ClipboardList,
    },
    {
      label: "Campus Life",
      href: "/admin/page-content?college=arts-science&section=campusLife",
      icon: Camera,
    },
    {
      label: "Testimonials",
      href: "/admin/page-content?college=arts-science&section=testimonials",
      icon: MessageSquare,
    },
    {
      label: "News & Events",
      href: "/admin/events?college=arts-science",
      icon: CalendarDays,
    },
    {
      label: "About Us",
      href: "/admin/about?college=arts-science",
      icon: Info,
    },
  ],
  polytechnic: [
    {
      label: "Navbar",
      href: "/admin/page-content?college=polytechnic&section=navbar",
      icon: PanelTop,
    },
    {
      label: "Hero",
      href: "/admin/page-content?college=polytechnic&section=hero",
      icon: FileEdit,
    },
    {
      label: "Programs",
      href: "/admin/programs?college=polytechnic",
      icon: GraduationCap,
    },
    {
      label: "Placements",
      href: "/admin/placements?college=polytechnic",
      icon: Briefcase,
    },
    {
      label: "Admissions",
      href: "/admin/page-content?college=polytechnic&section=admissions",
      icon: ClipboardList,
    },
    {
      label: "Campus Life",
      href: "/admin/page-content?college=polytechnic&section=campusLife",
      icon: Camera,
    },
    {
      label: "Testimonials",
      href: "/admin/page-content?college=polytechnic&section=testimonials",
      icon: MessageSquare,
    },
    {
      label: "News & Events",
      href: "/admin/events?college=polytechnic",
      icon: CalendarDays,
    },
    {
      label: "About Us",
      href: "/admin/about?college=polytechnic",
      icon: Info,
    },
  ],
};

const MAIN_ITEMS: NavItem[] = [
  {
    label: "Navbar",
    href: "/admin/main/page-content?section=navbar",
    icon: PanelTop,
  },
  {
    label: "Pamphlet Popup",
    href: "/admin/main/page-content?section=pamphlet",
    icon: Layers,
  },
  {
    label: "Hero",
    href: "/admin/main/page-content?section=hero",
    icon: FileEdit,
  },
  {
    label: "Accreditations",
    href: "/admin/main/page-content?section=accreditations",
    icon: Award,
  },
  {
    label: "Statistics",
    href: "/admin/main/page-content?section=statistics",
    icon: BarChart3,
  },
  {
    label: "Why Choose JCT",
    href: "/admin/main/page-content?section=whyChooseJct",
    icon: Sparkles,
  },
  {
    label: "Card",
    href: "/admin/main/page-content?section=card",
    icon: LayoutGrid,
  },
  {
    label: "Life at JCT",
    href: "/admin/main/page-content?section=lifeAtJct",
    icon: Camera,
  },
  {
    label: "Testimonials",
    href: "/admin/main/page-content?section=testimonials",
    icon: MessageSquare,
  },
  {
    label: "News & Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Admissions",
    href: "/admin/main/page-content?section=homeAdmissions",
    icon: ClipboardList,
  },
  {
    label: "About Us",
    href: "/admin/about?college=main",
    icon: Info,
  },
  {
    label: "Campus Life",
    href: "/admin/campus-life",
    icon: TreePalm,
  },
];

const GLOBAL_CMS_ITEMS: NavItem[] = [
  {
    label: "Footer",
    href: "/admin/global/page-content?section=footer",
    icon: PanelBottom,
  },
  { label: "Recruiters", href: "/admin/recruiters", icon: Briefcase },
  {
    label: "Floating Elements",
    href: "/admin/global/page-content?section=floatingElements",
    icon: MousePointerClick,
  },
];

const ADMIN_ITEMS: NavItem[] = [
  {
    label: "Dynamic Pages",
    href: "/admin/pages",
    icon: FileEdit,
    minRole: "editor",
  },
  { label: "Users", href: "/admin/users", icon: Users, minRole: "admin" },
  {
    label: "Audit Log",
    href: "/admin/audit",
    icon: ClipboardList,
    minRole: "admin",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    minRole: "admin",
  },
];

const ALL_COLLEGES = [
  { id: "engineering", label: "Engineering" },
  { id: "arts-science", label: "Arts" },
  { id: "polytechnic", label: "Polytechnic" },
] as const;

function isItemActive(
  href: string,
  pathname: string,
  college: string | null,
  section: string | null,
): boolean {
  const qIdx = href.indexOf("?");
  const itemPath = qIdx >= 0 ? href.slice(0, qIdx) : href;
  const itemQuery = qIdx >= 0 ? href.slice(qIdx + 1) : "";

  const pathMatch =
    pathname === itemPath || pathname.startsWith(itemPath + "/");
  if (!pathMatch) return false;
  if (!itemQuery) return true;

  const params = new URLSearchParams(itemQuery);
  const wantedCollege = params.get("college");
  const wantedSection = params.get("section");

  if (wantedCollege && wantedCollege !== college) return false;
  if (wantedSection && wantedSection !== section) return false;
  return true;
}

function isDropdownActive(
  items: NavItem[],
  pathname: string,
  college: string | null,
): boolean {
  return items.some((item) => {
    const qIdx = item.href.indexOf("?");
    const itemPath = qIdx >= 0 ? item.href.slice(0, qIdx) : item.href;
    const itemQuery = qIdx >= 0 ? item.href.slice(qIdx + 1) : "";
    const pathMatch =
      pathname === itemPath || pathname.startsWith(itemPath + "/");
    if (!pathMatch) return false;
    if (!itemQuery) return true;
    const wantedCollege = new URLSearchParams(itemQuery).get("college");
    return !wantedCollege || wantedCollege === college;
  });
}

function TabNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const college = searchParams.get("college");
  const section = searchParams.get("section");

  const userRole =
    ((session?.user as Record<string, unknown>)?.role as string) ?? "editor";
  const userInstitution =
    ((session?.user as Record<string, unknown>)?.institution as string) ?? "";
  const isAdmin = hasMinRole(userRole, "admin");

  const visibleAdminItems = ADMIN_ITEMS.filter((item) =>
    hasMinRole(userRole, item.minRole ?? "editor"),
  );

  // Editors see only their assigned college; admins see all three
  const visibleColleges = isAdmin
    ? ALL_COLLEGES
    : ALL_COLLEGES.filter((c) => c.id === userInstitution);

  const dashActive = pathname === "/admin/dashboard" || pathname === "/admin";
  const adminMenuActive = isDropdownActive(visibleAdminItems, pathname, null);
  const mainActive = isDropdownActive(MAIN_ITEMS, pathname, null);
  const globalCmsActive = isDropdownActive(GLOBAL_CMS_ITEMS, pathname, null);

  if (
    pathname.startsWith("/admin/programs/") &&
    pathname !== "/admin/programs"
  ) {
    return null;
  }

  if (
    pathname === "/admin/about" ||
    pathname === "/admin/coe" ||
    pathname === "/admin/campus-life"
  ) {
    return null;
  }

  return (
    <div className="admin-top-nav">
      <div className="admin-brand-bar">
        {/* Brand */}
        <div className="flex shrink-0 items-center gap-2">
          <BookOpen size={18} color="#c9a84c" />
          <div>
            <p className="text-sm leading-tight font-bold text-white">
              JCT Admin
            </p>
            <p className="text-[10px] leading-tight text-white/40">
              Content Management
            </p>
          </div>
        </div>

        {/* Nav items — scroll horizontally on narrow viewports instead of clipping */}
        <nav className="scrollbar-hide flex min-w-0 items-center gap-0.5 overflow-x-clip">
          {/* Dashboard — admin only */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`admin-nav-trigger ${dashActive ? "active" : ""}`}
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
          )}

          {/* Admin tools dropdown — admin only */}
          {isAdmin && visibleAdminItems.length > 0 && (
            <div className="admin-nav-item">
              <button
                className={`admin-nav-trigger ${adminMenuActive ? "active" : ""}`}
              >
                <Wrench size={13} />
                Admin
                <ChevronDown size={11} />
              </button>
              <div className="admin-nav-dropdown-menu">
                {visibleAdminItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-dropdown-item ${pathname === item.href ? "active" : ""}`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Global CMS — admin only */}
          {isAdmin && (
            <div className="admin-nav-item">
              <Link
                href="/admin/global/page-content"
                className={`admin-nav-trigger ${globalCmsActive ? "active" : ""}`}
              >
                <Globe size={13} />
                Global CMS
                <ChevronDown size={11} />
              </Link>
              <div className="admin-nav-dropdown-menu">
                {GLOBAL_CMS_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-dropdown-item ${
                      isItemActive(item.href, pathname, null, section)
                        ? "active"
                        : ""
                    }`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Main (landing page) — admin only */}
          {isAdmin && (
            <div className="admin-nav-item">
              <Link
                href="/admin/main/page-content"
                className={`admin-nav-trigger ${mainActive ? "active" : ""}`}
              >
                <Home size={13} />
                Main
                <ChevronDown size={11} />
              </Link>
              <div className="admin-nav-dropdown-menu">
                {MAIN_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-dropdown-item ${
                      isItemActive(item.href, pathname, null, section)
                        ? "active"
                        : ""
                    }`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* College dropdowns — editors see only their assigned college */}
          {visibleColleges.map(({ id, label }) => {
            const items = COLLEGE_ITEMS[id];
            const active = isDropdownActive(items, pathname, college);
            return (
              <div key={id} className="admin-nav-item admin-nav-item--right">
                <Link
                  href={`/admin/page-content?college=${id}`}
                  className={`admin-nav-trigger ${active ? "active" : ""}`}
                >
                  {label}
                  <ChevronDown size={11} />
                </Link>
                <div className="admin-nav-dropdown-menu">
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`admin-nav-dropdown-item ${
                        isItemActive(item.href, pathname, college, section)
                          ? "active"
                          : ""
                      }`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User info + sign out */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-white/75">
            <User size={14} />
            <span className="hidden md:inline">
              {session?.user?.name ?? session?.user?.email}
            </span>
            <span className="admin-badge admin-badge-blue text-[11px] capitalize">
              {userRole}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="admin-btn admin-btn-sm"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.78)",
            }}
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminTabNav() {
  return (
    <Suspense
      fallback={<div className="admin-top-nav" style={{ height: 56 }} />}
    >
      <TabNavInner />
    </Suspense>
  );
}
