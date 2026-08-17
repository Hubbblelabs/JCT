"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { EmptyState } from "@/components/admin/kit/primitives";

/**
 * The manual's frame: a filter box, a contents list that follows you down the
 * page, and the chapters themselves.
 *
 * The chapters arrive already rendered from the server — icons included, as
 * elements rather than component types, since a lucide component cannot cross
 * the server/client boundary. This file therefore holds no content of its own;
 * everything a reader sees comes from `help-chapters.tsx`.
 */

export type HelpDocItem = {
  id: string;
  title: string;
  summary: string;
  /** Extra search terms — never displayed. */
  keywords: string;
  icon: ReactNode;
  body: ReactNode;
};

export function HelpDoc({ items }: { items: HelpDocItem[] }) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    // Every word has to appear somewhere in the chapter's own text — "publish
    // image" should find the media chapter, not every chapter mentioning one
    // of the two.
    const words = q.split(/\s+/);
    return items.filter((item) => {
      const hay =
        `${item.title} ${item.summary} ${item.keywords}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, query]);

  return (
    <div className="admin-doc-layout">
      <div className="admin-doc">
        {matches.length === 0 ? (
          <EmptyState
            icon={<Search size={20} />}
            title={`Nothing in the manual matches “${query.trim()}”`}
            body="Try a single word — the name of a screen, or what you are trying to do."
          />
        ) : (
          matches.map((item) => (
            <section
              key={item.id}
              id={item.id}
              className="admin-doc-chapter"
              aria-labelledby={`${item.id}-title`}
            >
              <h2 id={`${item.id}-title`} className="admin-doc-h2">
                <span className="admin-doc-h2-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.title}
              </h2>
              {item.body}
            </section>
          ))
        )}
      </div>

      <aside className="admin-doc-toc" aria-label="Contents">
        <div className="admin-doc-toc-inner">
          <div className="admin-search-field admin-doc-toc-search">
            <Search size={14} className="admin-search-field-icon" />
            <input
              type="search"
              className="admin-input"
              placeholder="Search the manual…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search the manual"
            />
            {query && (
              <button
                type="button"
                className="admin-search-field-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <p className="admin-doc-toc-heading">Contents</p>
          <nav>
            {matches.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="admin-doc-toc-link"
              >
                <span className="admin-doc-toc-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="admin-doc-toc-title">{item.title}</span>
                  <span className="admin-doc-toc-summary">{item.summary}</span>
                </span>
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
