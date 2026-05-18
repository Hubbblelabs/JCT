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
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ size?: number }> };

const COLLEGE_ITEMS: Record<string, NavItem[]> = {
  engineering: [
    { label: "Programs", href: "/admin/programs?college=engineering", icon: GraduationCap },
    { label: "Testimonials", href: "/admin/testimonials?college=engineering", icon: MessageSquare },
  ],
  "arts-science": [
    { label: "Programs", href: "/admin/programs?college=arts-science", icon: GraduationCap },
    { label: "Testimonials", href: "/admin/testimonials?college=arts-science", icon: MessageSquare },
  ],
  polytechnic: [
    { label: "Programs", href: "/admin/programs?college=polytechnic", icon: GraduationCap },
    { label: "Testimonials", href: "/admin/testimonials?college=polytechnic", icon: MessageSquare },
  ],
};

const ADMIN_ITEMS: NavItem[] = [
  { label: "Recruiters", href: "/admin/recruiters", icon: Briefcase },
  { label: "Site Config", href: "/admin/site-config", icon: Settings },
  { label: "Images", href: "/admin/images", icon: Image },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Audit Log", href: "/admin/audit", icon: ClipboardList },
];

function isItemActive(href: string, pathname: string, college: string | null): boolean {
  const [itemPath, itemQuery] = href.split("?");
  const pathMatch = pathname === itemPath || pathname.startsWith(itemPath + "/");
  if (!pathMatch) return false;
  if (!itemQuery) return true;
  return new URLSearchParams(itemQuery).get("college") === college;
}

function isDropdownActive(items: NavItem[], pathname: string, college: string | null): boolean {
  return items.some((item) => isItemActive(item.href, pathname, college));
}

function TabNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const college = searchParams.get("college");

  const dashActive = pathname === "/admin/dashboard" || pathname === "/admin";
  const adminMenuActive = ADMIN_ITEMS.some((i) => pathname === i.href);

  return (
    <div className="admin-top-nav">
      <div className="admin-brand-bar">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <BookOpen size={18} color="#c9a84c" />
          <div>
            <p className="text-sm font-bold text-white leading-tight">JCT Admin</p>
            <p className="text-[10px] text-white/40 leading-tight">Content Management</p>
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
                  href={`/admin/programs?college=${id}`}
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
                      className={`admin-nav-dropdown-item ${isItemActive(item.href, pathname, college) ? "active" : ""}`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Admin tools dropdown */}
          <div className="admin-nav-item">
            <button className={`admin-nav-trigger ${adminMenuActive ? "active" : ""}`}>
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
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-sm text-white/75">
            <User size={14} />
            <span className="hidden md:inline">{session?.user?.name ?? session?.user?.email}</span>
            <span className="admin-badge admin-badge-blue capitalize text-[11px]">
              {(session?.user as Record<string, unknown>)?.role as string ?? "admin"}
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
    <Suspense fallback={<div className="admin-top-nav" style={{ height: 56 }} />}>
      <TabNavInner />
    </Suspense>
  );
}
