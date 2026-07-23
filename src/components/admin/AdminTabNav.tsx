"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BookOpen, LayoutDashboard, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";
import { hasMinRole } from "@/lib/permissions";
import { AdminQuickSearch } from "@/components/admin/AdminQuickSearch";
import {
  hubHref,
  isSectionActive,
  visibleSections,
  type NavScope,
} from "@/lib/admin-nav";

function TabNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const url: NavScope = {
    college: searchParams.get("college"),
    section: searchParams.get("section"),
    scope: searchParams.get("scope"),
  };

  const userRole =
    ((session?.user as Record<string, unknown>)?.role as string) ?? "editor";
  const userInstitution =
    ((session?.user as Record<string, unknown>)?.institution as string) ?? "";
  const isAdmin = hasMinRole(userRole, "admin");

  // One trigger per section — each opens that section's hub page, where the
  // content pages are listed as searchable cards. The nav used to carry every
  // link inside dropdowns, which grew unusably long.
  const sections = visibleSections(userRole, userInstitution);

  const dashActive = pathname === "/admin/dashboard" || pathname === "/admin";

  if (
    pathname.startsWith("/admin/programs/") &&
    pathname !== "/admin/programs"
  ) {
    return null;
  }

  // Full-bleed live-preview editors render the public page edge-to-edge; the
  // top nav would compete with the previewed site chrome.
  if (
    pathname === "/admin/about" ||
    pathname === "/admin/coe" ||
    pathname === "/admin/campus-life" ||
    pathname === "/admin/research" ||
    pathname === "/admin/clubs" ||
    pathname === "/admin/committees" ||
    pathname === "/admin/documents"
  ) {
    return null;
  }

  return (
    <div className="admin-top-nav">
      <div className="admin-brand-bar">
        {/* Brand */}
        <Link
          href={isAdmin ? "/admin/dashboard" : hubHref(sections[0]?.id ?? "")}
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <BookOpen size={18} color="#c9a84c" />
          <div>
            <p className="text-sm leading-tight font-bold text-white">
              JCT Admin
            </p>
            <p className="text-[10px] leading-tight text-white/40">
              Content Management
            </p>
          </div>
        </Link>

        {/* Section triggers — scroll horizontally on narrow viewports */}
        <nav className="scrollbar-hide flex min-w-0 items-center gap-0.5 overflow-x-auto">
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`admin-nav-trigger ${dashActive ? "active" : ""}`}
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
          )}

          {sections.map((s) => (
            <Link
              key={s.id}
              href={hubHref(s.id)}
              className={`admin-nav-trigger ${
                isSectionActive(s, userRole, pathname, url) ? "active" : ""
              }`}
            >
              <s.icon size={13} />
              {s.navLabel}
            </Link>
          ))}
        </nav>

        {/* Quick search + user info + sign out */}
        <div className="flex shrink-0 items-center gap-3">
          <AdminQuickSearch role={userRole} institution={userInstitution} />
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
