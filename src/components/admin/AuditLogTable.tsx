"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import { StatusBadge } from "@/components/admin/kit/primitives";

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
  const [actor, setActor] = useState("");
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");
  const [range, setRange] = useState("");

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
      className="admin-select w-auto"
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
        rows.length >= cap ? (
          <span className="admin-help">
            <ClipboardList size={12} className="mr-1 inline" />
            Showing the {cap} most recent entries
          </span>
        ) : null
      }
    />
  );
}
