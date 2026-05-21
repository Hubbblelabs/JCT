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
  Settings,
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
  FileDown,
  Layers,
  Globe,
  PanelTop,
  PanelBottom,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
};

const COLLEGE_ITEMS: Record<string, NavItem[]> = {
  engineering: [
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
      label: "Performance Metrics",
      href: "/admin/page-content?college=engineering&section=metrics",
      icon: BarChart3,
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
      label: "Programs",
      href: "/admin/programs?college=engineering",
      icon: GraduationCap,
    },
  ],
  "arts-science": [
    {
      label: "Hero",
      href: "/admin/page-content?college=arts-science&section=hero",
      icon: FileEdit,
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
      href: "/admin/testimonials?college=arts-science",
      icon: MessageSquare,
    },
    {
      label: "Programs",
      href: "/admin/programs?college=arts-science",
      icon: GraduationCap,
    },
  ],
  polytechnic: [
    {
      label: "Hero",
      href: "/admin/page-content?college=polytechnic&section=hero",
      icon: FileEdit,
    },
    {
      label: "Campus Life",
      href: "/admin/page-content?college=polytechnic&section=campusLife",
      icon: Camera,
    },
    {
      label: "Admissions",
      href: "/admin/page-content?college=polytechnic&section=admissions",
      icon: ClipboardList,
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials?college=polytechnic",
      icon: MessageSquare,
    },
    {
      label: "Programs",
      href: "/admin/programs?college=polytechnic",
      icon: GraduationCap,
    },
  ],
};

const MAIN_ITEMS: NavItem[] = [
  {
    label: "Hero",
    href: "/admin/main/page-content?section=hero",
    icon: FileEdit,
  },
  {
    label: "Card",
    href: "/admin/main/page-content?section=card",
    icon: BarChart3,
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
    label: "Prospectus",
    href: "/admin/main/page-content?section=prospectus",
    icon: FileDown,
  },
  {
    label: "Pamphlet Popup",
    href: "/admin/main/page-content?section=pamphlet",
    icon: Layers,
  },
];

const GLOBAL_CMS_ITEMS: NavItem[] = [
  { label: "Header", href: "/admin/global/page-content?section=header", icon: PanelTop },
  { label: "Footer", href: "/admin/global/page-content?section=footer", icon: PanelBottom },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Recruiters", href: "/admin/recruiters", icon: Briefcase },
  { label: "Site Config", href: "/admin/site-config", icon: Settings },
  { label: "Images", href: "/admin/images", icon: Image },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Audit Log", href: "/admin/audit", icon: ClipboardList },
];

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

  const dashActive = pathname === "/admin/dashboard" || pathname === "/admin";
  const adminMenuActive = ADMIN_ITEMS.some((i) => pathname === i.href);
  const mainActive = isDropdownActive(MAIN_ITEMS, pathname, null);
  const globalCmsActive = isDropdownActive(GLOBAL_CMS_ITEMS, pathname, null);

  if (pathname.startsWith("/admin/programs/") && pathname !== "/admin/programs") {
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

        {/* Nav items */}
        <nav className="flex items-center gap-0.5">
          {/* Dashboard — direct link */}
          <Link
            href="/admin/dashboard"
            className={`admin-nav-trigger ${dashActive ? "active" : ""}`}
          >
            <LayoutDashboard size={13} />
            Dashboard
          </Link>

          {/* Main (landing page) dropdown */}
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

          {/* College dropdowns */}
          {(
            [
              { id: "engineering", label: "Engineering" },
              { id: "arts-science", label: "Arts & Science" },
              { id: "polytechnic", label: "Polytechnic" },
            ] as const
          ).map(({ id, label }) => {
            const items = COLLEGE_ITEMS[id];
            const active = isDropdownActive(items, pathname, college);
            return (
              <div key={id} className="admin-nav-item">
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

          {/* Global CMS dropdown */}
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
                    isItemActive(item.href, pathname, null, section) ? "active" : ""
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Admin tools dropdown */}
          <div className="admin-nav-item">
            <button
              className={`admin-nav-trigger ${adminMenuActive ? "active" : ""}`}
            >
              <Wrench size={13} />
              Admin
              <ChevronDown size={11} />
            </button>
            <div className="admin-nav-dropdown-menu">
              {ADMIN_ITEMS.map((item) => (
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
        </nav>

        {/* User info + sign out */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-white/75">
            <User size={14} />
            <span className="hidden md:inline">
              {session?.user?.name ?? session?.user?.email}
            </span>
            <span className="admin-badge admin-badge-blue text-[11px] capitalize">
              {((session?.user as Record<string, unknown>)?.role as string) ??
                "admin"}
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
