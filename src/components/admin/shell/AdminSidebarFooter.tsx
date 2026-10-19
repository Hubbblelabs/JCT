"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  ExternalLink,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
} from "lucide-react";
import { signOut } from "next-auth/react";

/** "Audit Admin" → "AA", "editor@jct.ac.in" → "E". */
function initials(name: string): string {
  const words = name
    .replace(/@.*$/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * The foot of the sidebar: page search, the public site, Clear cache and the
 * account menu. They used to crowd the topbar, which now belongs to the open
 * screen's own actions (Save draft, Publish, …).
 *
 * Every row carries its label in `.admin-sidebar-label`, so the collapsed rail
 * shows just the icons and reveals the labels on hover like the nav above.
 */
export function AdminSidebarFooter({
  userName,
  userRole,
  collapsed,
  onOpenPalette,
  onNavigate,
}: {
  userName: string;
  userRole: string;
  collapsed: boolean;
  onOpenPalette: () => void;
  /** Closes the mobile drawer once an action is picked. */
  onNavigate?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Clearing the cache is a recovery action, not part of editing — but it was
  // buried three screens deep in Settings, which is the wrong place for the
  // thing you reach for when the live site is still showing old content. The
  // route is admin-only (`requireRole(req, "admin")`), so editors don't get the
  // button rather than getting a 403 from it.
  const [cacheState, setCacheState] = useState<
    "idle" | "busy" | "done" | "error"
  >("idle");
  const cacheResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (cacheResetRef.current) clearTimeout(cacheResetRef.current);
    },
    [],
  );

  const clearCache = async () => {
    if (cacheState === "busy") return;
    setCacheState("busy");
    try {
      const res = await fetch("/api/admin/cache", { method: "POST" });
      setCacheState(res.ok ? "done" : "error");
    } catch {
      setCacheState("error");
    }
    if (cacheResetRef.current) clearTimeout(cacheResetRef.current);
    cacheResetRef.current = setTimeout(() => setCacheState("idle"), 4000);
  };

  const cacheLabel =
    cacheState === "busy"
      ? "Clearing the site cache…"
      : cacheState === "done"
        ? "Site cache cleared — each public page rebuilds on its next visit"
        : cacheState === "error"
          ? "Could not clear the site cache. Try again."
          : "Clear the site cache — use it when the live site still shows old content";

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="admin-sidebar-footer">
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onOpenPalette();
        }}
        className="admin-sidebar-link admin-sidebar-tool"
        title={collapsed ? "Search pages (Ctrl K)" : undefined}
      >
        <Search size={14} className="shrink-0" />
        <span className="admin-sidebar-label">Search pages…</span>
        <kbd className="admin-sidebar-kbd admin-sidebar-label">Ctrl K</kbd>
      </button>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="admin-sidebar-link admin-sidebar-tool"
        title={collapsed ? "Open the public site" : undefined}
        aria-label="Open the public site in a new tab"
      >
        <ExternalLink size={14} className="shrink-0" />
        <span className="admin-sidebar-label">View public site</span>
      </a>

      {userRole === "admin" && (
        <button
          type="button"
          onClick={clearCache}
          disabled={cacheState === "busy"}
          className="admin-sidebar-link admin-sidebar-tool"
          aria-label={cacheLabel}
          title={cacheLabel}
          data-state={cacheState}
        >
          {cacheState === "busy" ? (
            <Loader2 size={14} className="shrink-0 animate-spin" />
          ) : cacheState === "done" ? (
            <Check size={14} className="shrink-0 text-emerald-400" />
          ) : (
            <RefreshCw
              size={14}
              className={`shrink-0 ${cacheState === "error" ? "text-red-400" : ""}`}
            />
          )}
          <span className="admin-sidebar-label">
            {cacheState === "busy"
              ? "Clearing…"
              : cacheState === "done"
                ? "Cache cleared"
                : cacheState === "error"
                  ? "Failed — retry"
                  : "Clear cache"}
          </span>
        </button>
      )}

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="admin-sidebar-link admin-sidebar-tool admin-sidebar-user"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title={collapsed ? userName : undefined}
        >
          <span className="admin-avatar" aria-hidden="true">
            {initials(userName)}
          </span>
          <span className="admin-sidebar-label admin-sidebar-user-text">
            <span className="admin-sidebar-user-name">{userName}</span>
            <span className="admin-sidebar-user-role">{userRole}</span>
          </span>
          <ChevronsUpDown
            size={14}
            className="admin-sidebar-label shrink-0 opacity-50"
            aria-hidden="true"
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute bottom-full left-0 z-[var(--admin-z-modal)] mb-1 w-56 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-raised)] p-1 shadow-[var(--admin-shadow-lg)]"
          >
            <div className="border-b border-[var(--admin-border-subtle)] px-3 py-2">
              <p className="truncate text-[length:var(--admin-text-body)] font-semibold text-[var(--admin-text)]">
                {userName}
              </p>
              <p className="text-[length:var(--admin-text-sm)] text-[var(--admin-text-muted)] capitalize">
                {userRole}
                {userRole === "editor" && " · scoped to one college"}
              </p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-block mt-1 justify-start"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
