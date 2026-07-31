"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
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
 * so paging the server would add latency and complexity for no gain. `pageSize`
 * still chunks the rendering for the one list that isn't that shape — the audit
 * log, which is capped at hundreds of near-identical rows.
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
  pageSize,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
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
  /** Rows per page. Omit to render every row, which is the default. */
  pageSize?: number;
  /**
   * Incremental loading: the caller holds only part of the data and can fetch
   * the next chunk. Paging past the last loaded page asks for it.
   */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort ?? null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

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

  // Paging is a rendering concern only — search, sort and bulk actions all
  // still see the whole filtered set.
  const totalPages = pageSize
    ? Math.max(1, Math.ceil(sorted.length / pageSize))
    : 1;
  const safePage = Math.min(page, totalPages);
  const visible = useMemo(
    () =>
      pageSize
        ? sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
        : sorted,
    [sorted, pageSize, safePage],
  );

  // A narrowed result set must not leave the reader stranded on a page that no
  // longer exists — or worse, on page 4 of a 2-page result. `safePage` clamps
  // the rest; only a new search jumps back to the top. Resetting on `rows`
  // too would fight incremental loading, which appends to that same array.
  useEffect(() => {
    setPage(1);
  }, [deferredQuery]);

  const selectedRows = useMemo(
    () => sorted.filter((r) => selected.has(rowKey(r))),
    [sorted, selected, rowKey],
  );

  const allVisibleSelected =
    visible.length > 0 && visible.every((r) => selected.has(rowKey(r)));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of visible) {
        if (allVisibleSelected) next.delete(rowKey(r));
        else next.add(rowKey(r));
      }
      return next;
    });
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
        <div className="admin-toolbar">
          {searchable_ && (
            <div className="admin-search-field min-w-0 flex-1 sm:max-w-xs">
              <Search
                size={14}
                aria-hidden="true"
                className="admin-search-field-icon"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="admin-input"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="admin-icon-btn admin-search-field-clear"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
          {filters && <div className="admin-toolbar-filters">{filters}</div>}
          {toolbar && (
            <div className="ml-auto flex items-center gap-2">{toolbar}</div>
          )}
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
              {visible.map((row) => {
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
        <div className="admin-pagination">
          <span>
            {pageSize
              ? `${(safePage - 1) * pageSize + 1}–${
                  (safePage - 1) * pageSize + visible.length
                } of ${sorted.length}${
                  sorted.length === rows.length ? "" : ` (${rows.length} total)`
                }`
              : sorted.length === rows.length
                ? `${rows.length} ${rows.length === 1 ? "item" : "items"}`
                : `${sorted.length} of ${rows.length} items`}
          </span>

          {pageSize && (totalPages > 1 || hasMore) && (
            <nav aria-label="Pagination" className="admin-pagination-controls">
              <button
                type="button"
                onClick={() => setPage(safePage - 1)}
                disabled={safePage <= 1}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <ChevronLeft size={13} />
                Previous
              </button>
              <span aria-live="polite">
                Page {safePage} of {totalPages}
                {hasMore ? "+" : ""}
              </span>
              <button
                type="button"
                // At the end of what is loaded, Next fetches the next chunk
                // and steps onto the page it fills.
                onClick={() => {
                  if (safePage >= totalPages) {
                    onLoadMore?.();
                    setPage(safePage + 1);
                  } else {
                    setPage(safePage + 1);
                  }
                }}
                disabled={
                  loadingMore || (safePage >= totalPages && !(hasMore && onLoadMore))
                }
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                {loadingMore ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : null}
                {loadingMore ? "Loading…" : "Next"}
                {!loadingMore && <ChevronRight size={13} />}
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
