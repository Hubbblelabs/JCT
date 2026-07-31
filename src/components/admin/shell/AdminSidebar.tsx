"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronRight, LayoutDashboard } from "lucide-react";
import { hasMinRole } from "@/lib/permissions";
import {
  findNavTrail,
  firstNavHref,
  isItemActive,
  visibleGroups,
  visibleSections,
  type NavScope,
} from "@/lib/admin-nav";

// New key on purpose: the old one held a JSON array of open sections, which is
// not a shape this reader understands.
const EXPANDED_KEY = "jct-admin-sidebar-section";

/**
 * Persistent section tree — the only navigation in the panel.
 *
 * Every destination lives here, one click from anywhere. Sections open one at
 * a time: with six of them expanded at once the tree ran to several screens of
 * scrolling, which buried the branch the user was actually working in.
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

  // Exactly one section is open at a time — opening one closes the rest.
  const [expanded, setExpanded] = useState<string | null>(null);

  // The branch the user is actually on always wins over what was stored.
  useEffect(() => {
    if (trail.section) {
      setExpanded(trail.section.id);
      return;
    }
    try {
      setExpanded(window.localStorage.getItem(EXPANDED_KEY) || null);
    } catch {
      setExpanded(null);
    }
  }, [trail.section]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = prev === id ? null : id;
      try {
        if (next) window.localStorage.setItem(EXPANDED_KEY, next);
        else window.localStorage.removeItem(EXPANDED_KEY);
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
        href={isAdmin ? "/admin/dashboard" : firstNavHref(role, institution)}
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
          const open = expanded === section.id;
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

              {/* Rendered whenever the section is open, collapsed or not —
                  the rail hides this in CSS and reveals it again on hover, so
                  it has to exist in the DOM to be revealable. */}
              {open && (
                <div className="admin-sidebar-sub mt-0.5 mb-2">
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
