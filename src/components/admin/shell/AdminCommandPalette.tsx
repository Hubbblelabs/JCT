"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { allNavItems } from "@/lib/admin-nav";

const RECENTS_KEY = "jct-admin-recent-pages";
const MAX_RECENTS = 6;

type Entry = ReturnType<typeof allNavItems>[number];

/**
 * Cmd+K navigation over every page the signed-in user can reach.
 *
 * The panel had a quick search already, but it lived inside the top nav bar
 * and only ran while that bar was on screen — the live-preview editors removed
 * the bar entirely, so search vanished exactly where an editor was deepest in
 * the tree and most likely to want it. This is mounted by the shell, so the
 * shortcut works on every admin screen.
 */
export function AdminCommandPalette({
  role,
  institution,
  open,
  onOpenChange,
}: {
  role: string;
  institution: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);

  const items = useMemo(
    () => allNavItems(role, institution),
    [role, institution],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENTS_KEY);
      if (raw) setRecents(JSON.parse(raw) as string[]);
    } catch {
      setRecents([]);
    }
  }, [open]);

  // Global shortcut. Registered here rather than on the trigger button so it
  // keeps working on screens that render no topbar.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === "Escape" && open) onOpenChange(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      // Focus after paint so the input exists to receive it.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const recentItems = recents
        .map((href) => items.find((i) => i.href === href))
        .filter((i): i is Entry => !!i);
      return recentItems.length > 0 ? recentItems : items.slice(0, 12);
    }
    // Rank exact label prefix over label substring over description/section, so
    // typing "prog" surfaces Programs above pages that merely mention it.
    const score = (i: Entry) => {
      const label = i.label.toLowerCase();
      if (label.startsWith(q)) return 0;
      if (label.includes(q)) return 1;
      if (i.sectionLabel.toLowerCase().includes(q)) return 2;
      if (i.description.toLowerCase().includes(q)) return 3;
      return 99;
    };
    return items
      .map((i) => ({ i, s: score(i) }))
      .filter((r) => r.s < 99)
      .sort((a, b) => a.s - b.s)
      .slice(0, 40)
      .map((r) => r.i);
  }, [query, items, recents]);

  useEffect(() => setCursor(0), [query]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const go = (item: Entry) => {
    try {
      const next = [item.href, ...recents.filter((h) => h !== item.href)].slice(
        0,
        MAX_RECENTS,
      );
      window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — navigation still works */
    }
    onOpenChange(false);
    router.push(item.href);
  };

  if (!open) return null;

  const showingRecents = !query.trim() && recents.length > 0;

  return (
    <div
      className="admin-palette-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        className="admin-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search admin pages"
      >
        <div className="admin-palette-input-row">
          <Search
            size={18}
            className="shrink-0 text-[var(--admin-text-faint)]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            className="admin-palette-input"
            placeholder="Search pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="admin-palette-results"
            aria-activedescendant={
              results[cursor] ? `palette-${cursor}` : undefined
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && results[cursor]) {
                e.preventDefault();
                go(results[cursor]);
              }
            }}
          />
          <kbd className="admin-kbd">Esc</kbd>
        </div>

        <div
          ref={listRef}
          id="admin-palette-results"
          role="listbox"
          className="admin-palette-results"
        >
          {results.length === 0 ? (
            <p className="px-3 py-10 text-center text-[length:var(--admin-text-body)] text-[var(--admin-text-muted)]">
              No page matches “{query}”.
            </p>
          ) : (
            <>
              <p className="admin-palette-group">
                {showingRecents ? "Recent" : "Pages"}
              </p>
              {results.map((item, i) => (
                <button
                  key={`${item.href}-${i}`}
                  id={`palette-${i}`}
                  type="button"
                  role="option"
                  aria-selected={i === cursor}
                  data-active={i === cursor || undefined}
                  className="admin-palette-item"
                  onMouseMove={() => setCursor(i)}
                  onClick={() => go(item)}
                >
                  <span className="admin-palette-item-icon">
                    <item.icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {item.label}
                    </span>
                    <span className="block truncate text-[length:var(--admin-text-sm)] text-[var(--admin-text-muted)]">
                      {item.sectionLabel} · {item.description}
                    </span>
                  </span>
                  {i === cursor && (
                    <CornerDownLeft
                      size={13}
                      className="shrink-0 text-[var(--admin-text-faint)]"
                    />
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="admin-palette-footer">
          <span>
            <kbd className="admin-kbd">↑</kbd>{" "}
            <kbd className="admin-kbd">↓</kbd> navigate
          </span>
          <span>
            <kbd className="admin-kbd">↵</kbd> open
          </span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
