"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import { StatusBadge } from "@/components/admin/kit/primitives";
import { useToast } from "@/components/ui/Toast";

export type AuditRow = {
  id: string;
  entityType: string;
  action: string;
  userEmail: string;
  summary: string;
  createdAt: string;
};

const RANGES = [
  { value: "", label: "Any time" },
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

/** Enough rows to scan a session's worth of activity without endless scroll. */
const PAGE_SIZE = 25;

/**
 * Retention windows offered for trimming. Must stay in step with PURGE_WINDOWS
 * in `src/app/api/admin/audit/route.ts` — the server rejects anything else.
 */
const PURGE_WINDOWS = [
  { value: 15, label: "Older than 15 days" },
  { value: 30, label: "Older than 30 days" },
  { value: 90, label: "Older than 3 months" },
  { value: 180, label: "Older than 6 months" },
  { value: 365, label: "Older than 1 year" },
];

const ACTION_TONE: Record<string, "active" | "info" | "draft" | "neutral"> = {
  create: "active",
  update: "info",
  publish: "active",
  delete: "draft",
};

/**
 * Filterable view of the audit trail.
 *
 * Only the newest page arrives with the document; walking past the end of what
 * is loaded fetches the next chunk from `/api/admin/audit`. Reading the whole
 * trail up-front was the slowest query in the panel and almost none of it was
 * ever looked at.
 *
 * Actor, entity, action and date filters apply to the rows that are loaded —
 * which is why the footer says how many that is.
 */
export function AuditLogTable({
  initialRows,
  initialHasMore,
}: {
  initialRows: AuditRow[];
  initialHasMore: boolean;
}) {
  const router = useRouter();
  const toast = useToast();

  const [rows, setRows] = useState<AuditRow[]>(initialRows);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const [actor, setActor] = useState("");
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");
  const [range, setRange] = useState("");

  const [purgeOpen, setPurgeOpen] = useState(false);
  const [purgeWindow, setPurgeWindow] = useState(String(PURGE_WINDOWS[0].value));
  const [purging, setPurging] = useState(false);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    const oldest = rows[rows.length - 1];
    setLoadingMore(true);
    try {
      const qs = oldest ? `?before=${encodeURIComponent(oldest.createdAt)}` : "";
      const res = await fetch(`/api/admin/audit${qs}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as {
        rows: AuditRow[];
        hasMore: boolean;
      };
      // Guard against a row arriving twice if a purge shifted the window.
      setRows((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        return [...prev, ...data.rows.filter((r) => !seen.has(r.id))];
      });
      setHasMore(Boolean(data.hasMore));
    } catch {
      toast.error("Could not load older entries.");
    } finally {
      setLoadingMore(false);
    }
  }, [rows, hasMore, loadingMore, toast]);

  const purge = async () => {
    const days = Number(purgeWindow);
    setPurging(true);
    try {
      const res = await fetch("/api/admin/audit", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ olderThanDays: days }),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        toast.error(
          (data.message as string) ??
            (data.error as string) ??
            "Could not delete entries.",
        );
        return;
      }
      const n = (data.deleted as number) ?? 0;
      toast.success(`Deleted ${n} ${n === 1 ? "entry" : "entries"}.`);
      setPurgeOpen(false);
      // The page is a server component; re-fetch rather than patch local state.
      router.refresh();
    } catch {
      toast.error("Could not delete entries. Nothing was changed.");
    } finally {
      setPurging(false);
    }
  };

  const actors = useMemo(
    () => [...new Set(rows.map((r) => r.userEmail))].sort(),
    [rows],
  );
  const entities = useMemo(
    () => [...new Set(rows.map((r) => r.entityType))].sort(),
    [rows],
  );
  const actions = useMemo(
    () => [...new Set(rows.map((r) => r.action))].sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const cutoff = range
      ? Date.now() - Number(range) * 24 * 60 * 60 * 1000
      : null;
    return rows.filter(
      (r) =>
        (!actor || r.userEmail === actor) &&
        (!entity || r.entityType === entity) &&
        (!action || r.action === action) &&
        (!cutoff || +new Date(r.createdAt) >= cutoff),
    );
  }, [rows, actor, entity, action, range]);

  const columns: Column<AuditRow>[] = [
    {
      key: "entityType",
      header: "Type",
      sortable: true,
      value: (r) => r.entityType,
      render: (r) => (
        <span className="admin-badge admin-badge-gray capitalize">
          {r.entityType}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      value: (r) => r.action,
      render: (r) => (
        <StatusBadge
          tone={ACTION_TONE[r.action] ?? "neutral"}
          label={r.action}
        />
      ),
    },
    {
      key: "userEmail",
      header: "By",
      sortable: true,
      value: (r) => r.userEmail,
      render: (r) => (
        <span className="text-[var(--admin-text-secondary)]">
          {r.userEmail}
        </span>
      ),
    },
    {
      key: "summary",
      header: "What changed",
      value: (r) => r.summary,
      render: (r) => (
        <span className="text-[var(--admin-text-secondary)]">{r.summary}</span>
      ),
    },
    {
      key: "createdAt",
      header: "When",
      sortable: true,
      align: "right",
      value: (r) => +new Date(r.createdAt),
      render: (r) => (
        <span className="whitespace-nowrap text-[length:var(--admin-text-sm)] text-[var(--admin-text-faint)]">
          {new Date(r.createdAt).toLocaleString("en-IN")}
        </span>
      ),
    },
  ];

  const select = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: { value: string; label: string }[],
  ) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="admin-select admin-select--auto"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <DataTable
        rows={filtered}
        columns={columns}
        rowKey={(r) => r.id}
        searchPlaceholder="Search summaries…"
        initialSort={{ key: "createdAt", dir: "desc" }}
        pageSize={PAGE_SIZE}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={() => void loadMore()}
        filters={
          <>
            {select("Filter by person", actor, setActor, [
              { value: "", label: "Anyone" },
              ...actors.map((a) => ({ value: a, label: a })),
            ])}
            {select("Filter by content type", entity, setEntity, [
              { value: "", label: "Any type" },
              ...entities.map((e) => ({ value: e, label: e })),
            ])}
            {select("Filter by action", action, setAction, [
              { value: "", label: "Any action" },
              ...actions.map((a) => ({ value: a, label: a })),
            ])}
            {select("Filter by date", range, setRange, RANGES)}
          </>
        }
        empty={{
          title: "No matching activity",
          body: "Every content change made in this panel is recorded here for a year. Widen the filters to see more.",
        }}
        toolbar={
          <button
            type="button"
            onClick={() => setPurgeOpen(true)}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={13} />
            Delete old entries
          </button>
        }
      />

      {purgeOpen && (
        <PurgeDialog
          window={purgeWindow}
          onWindowChange={setPurgeWindow}
          purging={purging}
          onCancel={() => setPurgeOpen(false)}
          onConfirm={() => void purge()}
        />
      )}
    </>
  );
}

/**
 * The retention window is chosen inside the confirmation, not in the toolbar:
 * a dropdown sitting next to a Delete button reads as a filter, and picking
 * the cutoff at the moment of confirming is what makes the choice deliberate.
 */
function PurgeDialog({
  window: value,
  onWindowChange,
  purging,
  onCancel,
  onConfirm,
}: {
  window: string;
  onWindowChange: (v: string) => void;
  purging: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const days = Number(value);
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4"
      onClick={purging ? undefined : onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="audit-purge-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h2
              id="audit-purge-title"
              className="text-base font-bold text-gray-900"
            >
              Delete old audit entries
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Choose how far back to keep. Everything older is deleted
              permanently, including entries not loaded into this view. This
              cannot be undone.
            </p>
          </div>
        </div>

        <label
          htmlFor="audit-purge-window"
          className="admin-label mt-5 mb-1 block"
        >
          Delete entries
        </label>
        <select
          id="audit-purge-window"
          value={value}
          onChange={(e) => onWindowChange(e.target.value)}
          disabled={purging}
          className="admin-select w-full"
        >
          {PURGE_WINDOWS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={purging}
            className="admin-btn admin-btn-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={purging}
            className="admin-btn admin-btn-danger"
          >
            {purging ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {purging ? "Deleting…" : `Delete older than ${days} days`}
          </button>
        </div>
      </div>
    </div>
  );
}
