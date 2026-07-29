"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import {
  getAdminSection,
  visibleGroups,
  type AdminNavGroup,
} from "@/lib/admin-nav";
import { PageShell } from "@/components/admin/kit/PageShell";
import { EmptyState, SectionLabel } from "@/components/admin/kit/primitives";

/**
 * Overview of one admin section: every page it owns, grouped and searchable.
 *
 * This used to be the only route into any editor, so it also carried a
 * section switcher along the top. The sidebar now exposes both the sections
 * and their pages directly, so the hub is what it should have been all along —
 * a wide, scannable index for someone who does not yet know what they are
 * looking for.
 */
export function AdminHub({
  sectionId,
  role,
}: {
  sectionId: string;
  role: string;
  /** Kept for the server page's call signature; scoping is enforced there. */
  institution?: string;
}) {
  const [query, setQuery] = useState("");
  const section = getAdminSection(sectionId);

  const groups: AdminNavGroup[] = useMemo(
    () => (section ? visibleGroups(section, role) : []),
    [section, role],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            g.title.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  if (!section) return null;

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <PageShell title={section.label} description={section.description}>
      <div className="relative mb-6 max-w-md">
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--admin-text-faint)]"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${total} pages in ${section.navLabel}…`}
          aria-label={`Search pages in ${section.label}`}
          className="admin-input pr-9 pl-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="admin-icon-btn absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card admin-card--flush">
          <EmptyState
            title={`Nothing matches “${query}”`}
            body="Try a different word, or press Ctrl+K to search every section at once."
          />
        </div>
      ) : (
        <div className="space-y-7">
          {filtered.map((group) => (
            <section key={group.title}>
              <SectionLabel>{group.title}</SectionLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group admin-card admin-card--interactive"
                  >
                    <span className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--admin-radius)] bg-[var(--admin-neutral-bg)] text-[var(--admin-text-secondary)] transition-colors group-hover:bg-[var(--admin-selected)]">
                        <item.icon size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1 font-semibold text-[var(--admin-text)]">
                          {item.label}
                          <ArrowRight
                            size={13}
                            aria-hidden="true"
                            className="-translate-x-1 text-[var(--admin-gold)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </span>
                        <span className="admin-help mt-0.5 block">
                          {item.description}
                        </span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
