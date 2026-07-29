"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronRight, LayoutDashboard } from "lucide-react";
import { hasMinRole } from "@/lib/permissions";
import {
  findNavTrail,
  hubHref,
  isItemActive,
  visibleGroups,
  visibleSections,
  type NavScope,
} from "@/lib/admin-nav";

const EXPANDED_KEY = "jct-admin-sidebar-expanded";

/**
 * Persistent section tree.
 *
 * The panel used to reach every editor through a top nav of section triggers,
 * each opening a hub page of cards — so every destination was two clicks and a
 * full page load away, and once you arrived nothing on screen said where you
 * were or what else lived nearby. The tree puts all ~120 destinations one
 * click away and keeps the current branch visible while you work.
 */
export function AdminSidebar({
  role,
  institution,
  pathname,
  url,
  collapsed,
  onNavigate,
}: {
  role: string;
  institution: string;
  pathname: string;
  url: NavScope;
  collapsed: boolean;
  /** Closes the mobile drawer once a destination is picked. */
  onNavigate?: () => void;
}) {
  const isAdmin = hasMinRole(role, "admin");
  const sections = useMemo(
    () => visibleSections(role, institution),
    [role, institution],
  );
  const trail = useMemo(
    () => findNavTrail(role, institution, pathname, url),
    [role, institution, pathname, url],
  );

  const [expanded, setExpanded] = useState<string[]>([]);

  // Restore the editor's open sections, then make sure the branch they are
  // actually on is open regardless of what was stored.
  useEffect(() => {
    let stored: string[] = [];
    try {
      const raw = window.localStorage.getItem(EXPANDED_KEY);
      if (raw) stored = JSON.parse(raw) as string[];
    } catch {
      stored = [];
    }
    setExpanded(
      trail.section && !stored.includes(trail.section.id)
        ? [...stored, trail.section.id]
        : stored,
    );
  }, [trail.section]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];
      try {
        window.localStorage.setItem(EXPANDED_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — the tree still works, it just won't persist */
      }
      return next;
    });
  };

  const dashActive = pathname === "/admin/dashboard" || pathname === "/admin";

  return (
    <aside className="admin-sidebar" aria-label="Admin sections">
      <Link
        href={isAdmin ? "/admin/dashboard" : hubHref(sections[0]?.id ?? "")}
        className="admin-sidebar-brand"
        onClick={onNavigate}
      >
        <BookOpen size={18} color="var(--admin-gold)" className="shrink-0" />
        <span className="admin-sidebar-brand-text">
          <span className="block text-[length:var(--admin-text-body)] leading-tight font-bold text-white">
            JCT Admin
          </span>
          <span className="block text-[length:var(--admin-text-xs)] leading-tight text-[var(--admin-text-on-navy-muted)]">
            Content Management
          </span>
        </span>
      </Link>

      <nav className="admin-sidebar-scroll">
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            onClick={onNavigate}
            className="admin-sidebar-section"
            data-active={dashActive || undefined}
            title={collapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard size={15} className="shrink-0" />
            <span className="admin-sidebar-label">Dashboard</span>
          </Link>
        )}

        {sections.map((section) => {
          const open = expanded.includes(section.id);
          const groups = visibleGroups(section, role);
          const isCurrent = trail.section?.id === section.id;

          return (
            <div key={section.id} className="mt-0.5">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="admin-sidebar-section"
                aria-expanded={open}
                data-active={isCurrent || undefined}
                title={collapsed ? section.label : undefined}
              >
                <section.icon size={15} className="shrink-0" />
                <span className="admin-sidebar-label">{section.navLabel}</span>
                <ChevronRight
                  size={14}
                  className="admin-sidebar-section-chevron"
                  aria-hidden="true"
                />
              </button>

              {open && !collapsed && (
                <div className="mt-0.5 mb-2">
                  {/* The hub still exists as an overview of the section — it is
                      just no longer the only way in. */}
                  <Link
                    href={hubHref(section.id)}
                    onClick={onNavigate}
                    className="admin-sidebar-link"
                    aria-current={
                      pathname === hubHref(section.id) ? "page" : undefined
                    }
                  >
                    <span className="admin-sidebar-label italic">
                      All {section.navLabel} pages
                    </span>
                  </Link>

                  {groups.map((group) => (
                    <div key={group.title}>
                      <p className="admin-sidebar-group">{group.title}</p>
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onNavigate}
                          className="admin-sidebar-link"
                          title={item.description}
                          aria-current={
                            isItemActive(item.href, pathname, url)
                              ? "page"
                              : undefined
                          }
                        >
                          <item.icon size={14} className="shrink-0" />
                          <span className="admin-sidebar-label truncate">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
