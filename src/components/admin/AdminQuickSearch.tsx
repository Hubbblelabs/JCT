"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { allNavItems } from "@/lib/admin-nav";

/**
 * Ctrl/⌘+K palette over every admin content page. The top nav now only links to
 * section hubs, so this is the shortcut for jumping straight to a known page.
 */
export function AdminQuickSearch({
  role,
  institution,
}: {
  role: string;
  institution: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(
    () => allNavItems(role, institution),
    [role, institution],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.sectionLabel.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q),
        )
      : items;
    return pool.slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      // Focus after the dialog paints.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/40 hover:text-white lg:flex"
      >
        <Search size={13} />
        Search
        <span className="rounded border border-white/20 px-1 text-[10px]">
          Ctrl K
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
          onMouseDown={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Search admin pages"
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-gray-100 px-4">
              <Search size={16} className="shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setCursor((c) => (c + 1) % Math.max(results.length, 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setCursor(
                      (c) =>
                        (c - 1 + Math.max(results.length, 1)) %
                        Math.max(results.length, 1),
                    );
                  } else if (e.key === "Enter" && results[cursor]) {
                    e.preventDefault();
                    go(results[cursor].href);
                  }
                }}
                placeholder="Jump to a page…"
                className="w-full bg-transparent py-3.5 text-sm text-gray-800 outline-none"
              />
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-gray-400">
                  No matching page.
                </p>
              ) : (
                results.map((item, idx) => (
                  <button
                    key={`${item.sectionId}:${item.href}`}
                    type="button"
                    onMouseEnter={() => setCursor(idx)}
                    onClick={() => go(item.href)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                      idx === cursor ? "bg-[#0a1628]/6" : ""
                    }`}
                  >
                    <item.icon size={15} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        {item.label}
                      </span>
                      <span className="block truncate text-[11px] text-gray-400">
                        {item.sectionLabel}
                      </span>
                    </span>
                    {idx === cursor && (
                      <CornerDownLeft size={13} className="text-gray-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
