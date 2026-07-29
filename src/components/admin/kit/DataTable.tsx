"use client";

import {
  useDeferredValue,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, X } from "lucide-react";
import { EmptyState, SkeletonRows } from "./primitives";

export type Column<T> = {
  /** Stable key; also used as the sort key when `sortable` is set. */
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Value used for sorting and for the built-in text search. */
  value?: (row: T) => string | number;
  sortable?: boolean;
  /** Right-align numeric columns and action columns. */
  align?: "left" | "right";
  width?: string;
  /** Hide below the tablet breakpoint to keep narrow tables readable. */
  hideOnMobile?: boolean;
};

export type BulkAction<T> = {
  label: string;
  icon?: ComponentType<{ size?: number }>;
  onRun: (rows: T[]) => void | Promise<void>;
  destructive?: boolean;
};

/**
 * The panel's one table.
 *
 * Six screens each carried their own copy of the same markup — card wrapper,
 * spinner branch, `<thead>`, and a hand-written empty `<tr>` whose `colSpan`
 * had to be kept in sync by hand (one screen had no empty state at all, so an
 * empty list rendered as bare headers). None of them could sort, filter or act
 * on more than one row, which made term-rollover work needlessly manual.
 *
 * Everything here is client-side: these lists are tens to low hundreds of rows,
 * so paging the server would add latency and complexity for no gain.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search…",
  filters,
  bulkActions,
  empty,
  toolbar,
  onRowClick,
  initialSort,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Rendered to the right of the search box — selects, segmented controls. */
  filters?: ReactNode;
  bulkActions?: BulkAction<T>[];
  empty?: { title: string; body?: string; action?: ReactNode };
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
  initialSort?: { key: string; dir: "asc" | "desc" };
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort ?? null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Keeps typing responsive on the larger lists — filtering runs against the
  // deferred value while the input itself stays on the urgent path.
  const deferredQuery = useDeferredValue(query);

  const searchable_ = searchable && columns.some((c) => c.value);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      columns.some((c) =>
        String(c.value?.(row) ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, columns, deferredQuery]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.value) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = col.value!(a);
      const bv = col.value!(b);
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, {
        numeric: true,
      }) * dir;
    });
  }, [filtered, sort, columns]);

  const selectedRows = useMemo(
    () => sorted.filter((r) => selected.has(rowKey(r))),
    [sorted, selected, rowKey],
  );

  const allVisibleSelected =
    sorted.length > 0 && sorted.every((r) => selected.has(rowKey(r)));

  const toggleAll = () => {
    setSelected(
      allVisibleSelected ? new Set() : new Set(sorted.map((r) => rowKey(r))),
    );
  };

  const toggleOne = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const cycleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null; // third click restores the list's natural order
    });
  };

  const showBulk = !!bulkActions?.length;
  const colCount = columns.length + (showBulk ? 1 : 0);

  return (
    <div className="admin-card admin-card--flush">
      {(searchable_ || filters || toolbar) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--admin-border-subtle)] p-3">
          {searchable_ && (
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--admin-text-faint)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="admin-input pr-8 pl-8"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="admin-icon-btn absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
          {filters}
          <div className="ml-auto flex items-center gap-2">{toolbar}</div>
        </div>
      )}

      {showBulk && selected.size > 0 && (
        <div className="admin-bulk-bar">
          <span>
            {selected.size} selected
          </span>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            Clear
          </button>
          <div className="ml-auto flex items-center gap-2">
            {bulkActions!.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => void a.onRun(selectedRows)}
                className={`admin-btn admin-btn-sm ${
                  a.destructive ? "admin-btn-danger" : "admin-btn-outline"
                }`}
              >
                {a.icon && <a.icon size={13} />}
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <SkeletonRows cols={Math.min(colCount, 5)} />
      ) : sorted.length === 0 ? (
        <EmptyState
          title={
            query
              ? `Nothing matches “${query}”`
              : (empty?.title ?? "Nothing here yet")
          }
          body={
            query
              ? "Try a different search term, or clear the search to see everything."
              : empty?.body
          }
          action={query ? undefined : empty?.action}
        />
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table admin-table--stack">
            <thead>
              <tr>
                {showBulk && (
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAll}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((c) => {
                  const active = sort?.key === c.key;
                  const ariaSort = c.sortable
                    ? active
                      ? sort!.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                    : undefined;
                  return (
                    <th
                      key={c.key}
                      style={c.width ? { width: c.width } : undefined}
                      aria-sort={ariaSort}
                      className={[
                        c.align === "right" ? "text-right" : "",
                        c.hideOnMobile ? "hidden md:table-cell" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={c.sortable ? () => cycleSort(c.key) : undefined}
                    >
                      {c.sortable ? (
                        <span className="inline-flex items-center gap-1">
                          {c.header}
                          {active ? (
                            sort!.dir === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            )
                          ) : (
                            <ChevronsUpDown size={12} className="opacity-40" />
                          )}
                        </span>
                      ) : (
                        c.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const key = rowKey(row);
                return (
                  <tr
                    key={key}
                    data-selected={selected.has(key) || undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    style={onRowClick ? { cursor: "pointer" } : undefined}
                  >
                    {showBulk && (
                      <td
                        data-label="Select"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => toggleOne(key)}
                          aria-label={`Select row ${key}`}
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        data-label={c.header}
                        className={[
                          c.align === "right" ? "text-right" : "",
                          c.hideOnMobile ? "hidden md:table-cell" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <p className="border-t border-[var(--admin-border-subtle)] px-4 py-2 text-[length:var(--admin-text-sm)] text-[var(--admin-text-muted)]">
          {sorted.length === rows.length
            ? `${rows.length} ${rows.length === 1 ? "item" : "items"}`
            : `${sorted.length} of ${rows.length} items`}
        </p>
      )}
    </div>
  );
}
