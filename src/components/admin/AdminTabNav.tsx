"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Building2,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Image,
  Settings,
  ClipboardList,
  Users,
  LogOut,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";

type TabId = "home" | "engineering" | "arts-science" | "polytechnic";

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "engineering", label: "Engineering" },
  { id: "arts-science", label: "Arts & Science" },
  { id: "polytechnic", label: "Polytechnic" },
];

type SubNavItem = { label: string; href: string; icon: React.ComponentType<{ size?: number }> };

const SUB_NAV: Record<TabId, SubNavItem[]> = {
  home: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Recruiters", href: "/admin/recruiters", icon: Briefcase },
    { label: "Site Config", href: "/admin/site-config", icon: Settings },
    { label: "Images", href: "/admin/images", icon: Image },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Audit Log", href: "/admin/audit", icon: ClipboardList },
  ],
  engineering: [
    { label: "Departments", href: "/admin/departments?college=engineering", icon: Building2 },
    { label: "Programs", href: "/admin/programs?college=engineering", icon: GraduationCap },
    { label: "Testimonials", href: "/admin/testimonials?college=engineering", icon: MessageSquare },
  ],
  "arts-science": [
    { label: "Departments", href: "/admin/departments?college=arts-science", icon: Building2 },
    { label: "Programs", href: "/admin/programs?college=arts-science", icon: GraduationCap },
    { label: "Testimonials", href: "/admin/testimonials?college=arts-science", icon: MessageSquare },
  ],
  polytechnic: [
    { label: "Departments", href: "/admin/departments?college=polytechnic", icon: Building2 },
    { label: "Programs", href: "/admin/programs?college=polytechnic", icon: GraduationCap },
    { label: "Testimonials", href: "/admin/testimonials?college=polytechnic", icon: MessageSquare },
  ],
};

function getActiveTab(pathname: string, college: string | null): TabId {
  if (college === "engineering") return "engineering";
  if (college === "arts-science") return "arts-science";
  if (college === "polytechnic") return "polytechnic";
  return "home";
}

function isSubNavActive(item: SubNavItem, pathname: string, college: string | null): boolean {
  const [itemPath, itemQuery] = item.href.split("?");
  if (pathname !== itemPath) return false;
  if (!itemQuery) return !college;
  const itemCollege = new URLSearchParams(itemQuery).get("college");
  return college === itemCollege;
}

function TabNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const college = searchParams.get("college");
  const activeTab = getActiveTab(pathname, college);

  return (
    <div className="admin-top-nav">
      {/* Brand bar: logo left | tabs center | user right */}
      <div className="admin-brand-bar">
        <div className="flex items-center gap-2">
          <BookOpen size={18} color="#c9a84c" />
          <div>
            <p className="text-sm font-bold text-white leading-tight">JCT Admin</p>
            <p className="text-[10px] text-white/40 leading-tight">Content Management</p>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              href={SUB_NAV[tab.id][0].href}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <User size={14} />
            <span className="hidden md:inline">{session?.user?.name ?? session?.user?.email}</span>
            <span className="admin-badge admin-badge-blue capitalize text-[11px]">
              {(session?.user as Record<string, unknown>)?.role as string ?? "admin"}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="admin-btn admin-btn-sm"
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="admin-sub-nav">
        {SUB_NAV[activeTab].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-sub-nav-item ${isSubNavActive(item, pathname, college) ? "active" : ""}`}
          >
            <item.icon size={13} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function AdminTabNav() {
  return (
    <Suspense fallback={<div className="admin-top-nav" style={{ height: 96 }} />}>
      <TabNavInner />
    </Suspense>
  );
}
