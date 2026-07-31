"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { type NavTrail } from "@/lib/admin-nav";

/**
 * Breadcrumbs, search and the account menu.
 *
 * The breadcrumbs are the point: until now no admin screen showed its own
 * position, so an editor deep in a college's page-content form had no way to
 * tell which college they were editing except by re-reading the URL. Getting
 * that wrong means publishing Engineering copy onto Arts & Science.
 */
export function AdminTopbar({
  trail,
  userName,
  userRole,
  collapsed,
  onToggleCollapse,
  onOpenPalette,
}: {
  trail: NavTrail;
  userName: string;
  userRole: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenPalette: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <header className="admin-topbar">
      <button
        type="button"
        onClick={onToggleCollapse}
        className="admin-icon-btn"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-pressed={collapsed}
      >
        {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
      </button>

      <nav aria-label="Breadcrumb" className="admin-breadcrumb min-w-0">
        {trail.section ? (
          <Fragment>
            <span className="admin-breadcrumb-crumb">
              {trail.section.label}
            </span>
            {trail.group && (
              <Fragment>
                <ChevronRight
                  size={13}
                  className="admin-breadcrumb-sep"
                  aria-hidden="true"
                />
                <span className="hidden md:inline">{trail.group.title}</span>
              </Fragment>
            )}
            {trail.item && (
              <Fragment>
                <ChevronRight
                  size={13}
                  className="admin-breadcrumb-sep"
                  aria-hidden="true"
                />
                <span className="admin-breadcrumb-current" aria-current="page">
                  {trail.item.label}
                </span>
              </Fragment>
            )}
          </Fragment>
        ) : (
          <span className="admin-breadcrumb-current">Dashboard</span>
        )}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-icon-btn admin-topbar-only-md"
          aria-label="Open the public site in a new tab"
          title="Open the public site"
        >
          <ExternalLink size={16} />
        </a>

        <button
          type="button"
          onClick={onOpenPalette}
          className="admin-search-trigger admin-topbar-only-lg"
        >
          <Search size={14} aria-hidden="true" />
          <span>Search pages…</span>
          <kbd className="admin-kbd ml-auto">Ctrl K</kbd>
        </button>

        {/* Phones get neither form of the page search: the breadcrumb already
            eats the row, and the drawer lists every destination anyway. */}
        <button
          type="button"
          onClick={onOpenPalette}
          className="admin-icon-btn admin-topbar-only-sm"
          aria-label="Search pages"
        >
          <Search size={16} />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <User size={15} />
            <span className="hidden max-w-[14ch] truncate md:inline">
              {userName}
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-[var(--admin-z-modal)] mt-1 w-56 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-raised)] p-1 shadow-[var(--admin-shadow-lg)]"
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
    </header>
  );
}
