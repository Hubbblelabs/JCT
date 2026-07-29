"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  findNavTrail,
  isImmersiveRoute,
  type NavScope,
} from "@/lib/admin-nav";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminCommandPalette } from "./AdminCommandPalette";

const COLLAPSED_KEY = "jct-admin-sidebar-collapsed";

/**
 * Chrome for every admin screen: sidebar, topbar and command palette.
 *
 * Layout state lives here rather than in the individual pieces so the sidebar
 * width, the main column's offset and the mobile drawer can never disagree —
 * they all read the same `data-` attributes off this one element.
 */
function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const user = (session?.user ?? {}) as Record<string, unknown>;
  const role = (user.role as string) ?? "editor";
  const institution = (user.institution as string) ?? "";
  const userName =
    (session?.user?.name as string) ?? (session?.user?.email as string) ?? "";

  const url: NavScope = useMemo(
    () => ({
      college: searchParams.get("college"),
      section: searchParams.get("section"),
      scope: searchParams.get("scope"),
    }),
    [searchParams],
  );

  const trail = useMemo(
    () => findNavTrail(role, institution, pathname, url),
    [role, institution, pathname, url],
  );

  const [userCollapsed, setUserCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    setUserCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "1");
  }, []);

  // Live-preview editors need the width, so the rail collapses automatically
  // there — but stays present, unlike the old nav which removed itself and
  // stranded the editor with no way back.
  const immersive = isImmersiveRoute(pathname);
  const collapsed = userCollapsed || immersive;

  const toggleCollapse = () => {
    setUserCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      return next;
    });
  };

  // Route change closes the mobile drawer; without this it stays over the page
  // the user just navigated to.
  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  return (
    <div
      className="admin-shell"
      data-collapsed={collapsed || undefined}
      data-drawer={drawerOpen ? "open" : undefined}
    >
      <a href="#admin-main" className="admin-skip-link">
        Skip to content
      </a>

      <AdminSidebar
        role={role}
        institution={institution}
        pathname={pathname}
        url={url}
        collapsed={collapsed && !drawerOpen}
        onNavigate={() => setDrawerOpen(false)}
      />

      {drawerOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="admin-shell-main">
        <AdminTopbar
          trail={trail}
          userName={userName}
          userRole={role}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <main id="admin-main" className="admin-main">
          {children}
        </main>
      </div>

      <AdminCommandPalette
        role={role}
        institution={institution}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
      />
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="admin-shell">
          <div className="admin-shell-main">
            <div className="admin-topbar" />
            <main className="admin-main">{children}</main>
          </div>
        </div>
      }
    >
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
