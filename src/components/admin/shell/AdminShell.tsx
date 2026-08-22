"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { findNavTrail, isImmersiveRoute, type NavScope } from "@/lib/admin-nav";
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
  const [isMobile, setIsMobile] = useState(false);

  // Mirrors admin.css's mobile breakpoint so the toggle, the button's label
  // and the stylesheet can never disagree about which layout is on screen.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setDrawerOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Below the tablet breakpoint the rail is the default, but it is decided
  // here rather than in CSS: the stylesheet used to shrink the sidebar width
  // on its own while this component still believed it was expanded, so labels
  // and sub-links kept rendering at full size inside a 60px column and were
  // merely clipped. A stored preference still wins — the toggle has to work.
  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSED_KEY);
    if (stored !== null) {
      setUserCollapsed(stored === "1");
      return;
    }
    setUserCollapsed(window.matchMedia("(max-width: 1024px)").matches);
  }, []);

  // Live-preview editors need the width, so the rail collapses automatically
  // there — but stays present, unlike the old nav which removed itself and
  // stranded the editor with no way back.
  const immersive = isImmersiveRoute(pathname);
  const collapsed = userCollapsed || immersive;

  // One button now does both jobs: below the drawer breakpoint the rail is
  // off-screen (transformed, not just narrowed), so "collapse" has nothing to
  // toggle — open the drawer instead. This reads the same media query the CSS
  // uses rather than comparing `innerWidth`: at exactly 640px the two
  // disagreed, CSS putting the sidebar off-screen while the button went on
  // toggling a width nobody could see, and the navigation became unreachable.
  const toggleCollapse = () => {
    if (isMobile) {
      setDrawerOpen((prev) => !prev);
      return;
    }
    setUserCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      return next;
    });
  };

  // Escape closes the drawer — on a phone the backdrop is the only other way
  // out, and a keyboard user tabbing through the tree has none.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

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
      data-collapsed={(collapsed && !drawerOpen) || undefined}
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
          collapsed={isMobile ? !drawerOpen : collapsed}
          mobile={isMobile}
          onToggleCollapse={toggleCollapse}
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
