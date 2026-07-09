"use client";

// Command-style module search: filters the static MODULE_REGISTRY and
// navigates to existing admin pages. Ctrl+K / Cmd+K / "/" focuses the field;
// arrow keys move through results; Enter navigates.

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { rememberPage } from "./recent-pages";
import { SEARCH_SUGGESTIONS, searchModules, type ModuleLink } from "./registry";
import { useDismiss } from "./ui";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function DashboardSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const rootRef = useDismiss<HTMLDivElement>(open, close);

  const results = useMemo<ModuleLink[]>(
    () => (query.trim() ? searchModules(query) : SEARCH_SUGGESTIONS),
    [query],
  );

  // Global shortcuts: Ctrl/Cmd+K always, "/" when not typing elsewhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "/" && !isEditableTarget(e.target)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const select = (mod: ModuleLink) => {
    rememberPage({ label: mod.label, href: mod.href });
    setOpen(false);
    inputRef.current?.blur();
    router.push(mod.href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) =>
          (i - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1),
      );
    } else if (e.key === "Enter") {
      const mod = results[activeIndex];
      if (mod) select(mod);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-(--dash-subtle)"
      />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="dash-search-listbox"
        aria-activedescendant={
          open && results[activeIndex]
            ? `dash-search-option-${activeIndex}`
            : undefined
        }
        aria-label="Search admin modules"
        placeholder="Search programs, events, placements, pages…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="h-11 w-full rounded-xl border border-(--dash-border) bg-(--dash-card) pr-20 pl-11 text-sm text-(--dash-fg) shadow-xs transition-shadow outline-none placeholder:text-(--dash-subtle) focus:border-(--dash-gold) focus:ring-4 focus:ring-(--dash-gold)/10"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 sm:flex"
      >
        <kbd className="rounded border border-(--dash-border) bg-(--dash-hover) px-1.5 py-0.5 font-sans text-[10px] font-medium text-(--dash-muted)">
          Ctrl
        </kbd>
        <kbd className="rounded border border-(--dash-border) bg-(--dash-hover) px-1.5 py-0.5 font-sans text-[10px] font-medium text-(--dash-muted)">
          K
        </kbd>
      </span>

      {open && results.length > 0 && (
        <ul
          id="dash-search-listbox"
          role="listbox"
          aria-label="Module results"
          className="absolute z-40 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-(--dash-border) bg-(--dash-card) p-1.5 shadow-lg"
        >
          {!query.trim() && (
            <li
              aria-hidden
              className="px-3 pt-1.5 pb-1 text-[11px] font-semibold tracking-wider text-(--dash-subtle) uppercase"
            >
              Quick navigation
            </li>
          )}
          {results.map((mod, i) => (
            <li
              key={`${mod.section}-${mod.href}`}
              id={`dash-search-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
            >
              <button
                type="button"
                tabIndex={-1}
                onClick={() => select(mod)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                  i === activeIndex && "bg-(--dash-hover)",
                )}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-(--dash-hover) text-(--dash-muted)">
                  <mod.icon size={14} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-(--dash-fg)">
                  {mod.label}
                </span>
                <span className="shrink-0 text-[11px] text-(--dash-subtle)">
                  {mod.section}
                </span>
                {i === activeIndex && (
                  <CornerDownLeft
                    size={13}
                    className="shrink-0 text-(--dash-subtle)"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() !== "" && results.length === 0 && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-card) px-4 py-6 text-center shadow-lg">
          <p className="text-sm text-(--dash-muted)">
            No modules match “{query.trim()}”.
          </p>
        </div>
      )}
    </div>
  );
}
