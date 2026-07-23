"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import {
  getAdminSection,
  hubHref,
  visibleGroups,
  visibleSections,
  type AdminNavGroup,
} from "@/lib/admin-nav";

/**
 * Landing page for one admin section: every content page it owns, grouped and
 * searchable. Icons are React components, so the registry is read here in the
 * client rather than passed down from the server page.
 */
export function AdminHub({
  sectionId,
  role,
  institution,
}: {
  sectionId: string;
  role: string;
  institution: string;
}) {
  const [query, setQuery] = useState("");
  const section = getAdminSection(sectionId);

  const groups: AdminNavGroup[] = useMemo(
    () => (section ? visibleGroups(section, role) : []),
    [section, role],
  );

  const siblings = useMemo(
    () => visibleSections(role, institution),
    [role, institution],
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
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{section.label}</h1>
          <p className="admin-page-subtitle">{section.description}</p>
        </div>
      </div>

      {/* Section switcher — jump between hubs without going through the nav */}
      {siblings.length > 1 && (
        <div className="scrollbar-hide mb-5 flex gap-2 overflow-x-auto">
          {siblings.map((s) => (
            <Link
              key={s.id}
              href={hubHref(s.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap no-underline transition-colors ${
                s.id === section.id
                  ? "border-[#0a1628] bg-[#0a1628] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <s.icon size={13} />
              {s.navLabel}
            </Link>
          ))}
        </div>
      )}

      {/* Search within this section */}
      <div className="relative mb-6 max-w-md">
        <Search
          size={15}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${total} items in ${section.navLabel}…`}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-9 text-sm text-gray-800 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          Nothing matches &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="space-y-7">
          {filtered.map((group) => (
            <section key={group.title}>
              <h2 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                {group.title}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group admin-card flex items-start gap-3 no-underline transition-all hover:border-[#c9a84c] hover:shadow-md"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0a1628]/8 text-[#0a1628] transition-colors group-hover:bg-[#c9a84c]/20">
                      <item.icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                        {item.label}
                        <ArrowRight
                          size={13}
                          className="-translate-x-1 text-[#c9a84c] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
