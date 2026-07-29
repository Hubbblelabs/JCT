"use client";

import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

/**
 * Small presentational pieces the whole admin panel shares.
 *
 * Before these existed each page hand-rolled its own empty row, its own
 * "Active/Inactive" badge (with labels that disagreed between pages) and its
 * own loading spinner. Anything defined here must be styled purely through the
 * tokens in admin.css — no raw colour values.
 */

/* ── EmptyState ───────────────────────────────────────────────────────────*/

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  /**
   * A rendered node, not a component type. Server Components render several of
   * these, and a lucide icon is a `forwardRef` object — passing the component
   * itself across the RSC boundary throws "Functions cannot be passed directly
   * to Client Components". Passing the element instead serialises cleanly.
   */
  icon?: ReactNode;
  title: string;
  /** Say what the thing is and how to create the first one — an empty list is
   *  the moment an editor most needs to be told what to do next. */
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-empty">
      {icon && <span className="admin-empty-icon">{icon}</span>}
      <p className="admin-empty-title">{title}</p>
      {body && <p className="admin-empty-body">{body}</p>}
      {action}
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────────────*/

export function Skeleton({
  className = "",
  width,
  height = 16,
}: {
  className?: string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`admin-skeleton block ${className}`}
      style={{ width: width ?? "100%", height }}
    />
  );
}

/** Placeholder rows sized to a table, so the layout does not jump on load. */
export function SkeletonRows({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div
      className="p-4"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="mb-3 flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={c === 0 ? "28%" : `${72 / (cols - 1)}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── StatusBadge ──────────────────────────────────────────────────────────*/

export type StatusTone =
  | "draft"
  | "published"
  | "archived"
  | "active"
  | "inactive"
  | "neutral"
  | "info";

const TONE_CLASS: Record<StatusTone, string> = {
  draft: "admin-badge-draft",
  published: "admin-badge-published",
  archived: "admin-badge-gray",
  active: "admin-badge-green",
  inactive: "admin-badge-gray",
  neutral: "admin-badge-gray",
  info: "admin-badge-blue",
};

const TONE_LABEL: Record<StatusTone, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
  active: "Visible",
  inactive: "Hidden",
  neutral: "—",
  info: "Info",
};

/**
 * One badge for every status in the panel. The list pages previously described
 * the same `is_active` boolean as "Active/Inactive" on some screens and
 * "Active/Hidden" on others; the wording now lives in one place.
 *
 * "Hidden" rather than "Inactive" because the boolean's actual effect is
 * whether the record shows on the public site.
 */
export function StatusBadge({
  tone,
  label,
  icon,
}: {
  tone: StatusTone;
  label?: string;
  /** A rendered node — see the note on EmptyState's `icon`. */
  icon?: ReactNode;
}) {
  return (
    <span className={`admin-badge ${TONE_CLASS[tone]}`}>
      {icon}
      {label ?? TONE_LABEL[tone]}
    </span>
  );
}

/** Convenience for the `is_active` boolean every content model carries. */
export function VisibilityBadge({ isActive }: { isActive: boolean }) {
  return <StatusBadge tone={isActive ? "active" : "inactive"} />;
}

/** Convenience for the draft/published pair on Program and Page. */
export function PublishBadge({ status }: { status?: string }) {
  if (status === "published") return <StatusBadge tone="published" />;
  if (status === "archived") return <StatusBadge tone="archived" />;
  return <StatusBadge tone="draft" />;
}

/* ── Banner ───────────────────────────────────────────────────────────────*/

const BANNER_ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

export function Banner({
  tone = "info",
  title,
  children,
  action,
}: {
  tone?: keyof typeof BANNER_ICON;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const Icon = BANNER_ICON[tone];
  return (
    <div
      className={`admin-banner admin-banner--${tone}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
      {action}
    </div>
  );
}

/* ── Fieldset ─────────────────────────────────────────────────────────────*/

/**
 * Groups a long form into a named chunk. The page-content forms run to dozens
 * of fields in a flat column; naming the groups is what makes them scannable.
 */
export function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="admin-fieldset">
      <legend className="admin-fieldset-legend">{legend}</legend>
      {hint && <p className="admin-help mb-3">{hint}</p>}
      {children}
    </fieldset>
  );
}

/* ── SectionLabel ─────────────────────────────────────────────────────────*/

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="admin-section-label mb-2">{children}</h2>;
}
