"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Loader2, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import { StatusBadge } from "@/components/admin/kit/primitives";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

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
 * The log recorded everything but could only be read as a flat list of the 200
 * newest rows, which made it useless for the question people actually bring to
 * an audit log: "who changed this, and when?". Actor, entity, action and date
 * are all filterable now, and the row cap is stated rather than silent.
 */
export function AuditLogTable({
  rows,
  cap,
}: {
  rows: AuditRow[];
  cap: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [actor, setActor] = useState("");
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");
  const [range, setRange] = useState("");

  const [purgeWindow, setPurgeWindow] = useState(String(PURGE_WINDOWS[0].value));
  const [purging, setPurging] = useState(false);

  const purge = async () => {
    const days = Number(purgeWindow);
    const chosen = PURGE_WINDOWS.find((w) => w.value === days);
    const affected = rows.filter(
      (r) => +new Date(r.createdAt) < Date.now() - days * 24 * 60 * 60 * 1000,
    ).length;

    const ok = await confirm({
      title: "Delete old audit entries",
      // The count is qualified rather than stated flatly: this list is capped
      // at the newest `cap` rows, so older entries the operator cannot see here
      // are still inside the cutoff and will go too.
      message: `Every entry created more than ${days} days ago will be deleted permanently — at least ${affected} of the ${rows.length} shown, plus any older ones beyond this view. This cannot be undone.`,
      confirmLabel: `Delete ${chosen?.label.toLowerCase() ?? `older than ${days} days`}`,
      destructive: true,
    });
    if (!ok) return;

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
    <DataTable
      rows={filtered}
      columns={columns}
      rowKey={(r) => r.id}
      searchPlaceholder="Search summaries…"
      initialSort={{ key: "createdAt", dir: "desc" }}
      pageSize={PAGE_SIZE}
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
        <>
          {rows.length >= cap && (
            <span className="admin-help">
              <ClipboardList size={12} className="mr-1 inline" />
              Showing the {cap} most recent entries
            </span>
          )}
          <select
            value={purgeWindow}
            onChange={(e) => setPurgeWindow(e.target.value)}
            aria-label="Retention window to delete"
            className="admin-select admin-select--auto"
          >
            {PURGE_WINDOWS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void purge()}
            disabled={purging}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            {purging ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            {purging ? "Deleting…" : "Delete"}
          </button>
        </>
      }
    />
  );
}
