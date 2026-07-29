"use client";

import type { ReactNode } from "react";

/**
 * Standard frame for an admin screen: title, one-line explanation, and the
 * page's primary actions on the right.
 *
 * The same header block was copy-pasted into 23 files, which is why titles,
 * spacing and action placement had quietly drifted apart between screens.
 *
 * `description` is not decoration — it is where a screen says, in plain words,
 * what an editor is looking at and where it appears on the public site.
 */
export function PageShell({
  title,
  description,
  actions,
  children,
  /** Removes the max-width cap for split-pane editors. */
  wide = false,
  /** Removes padding for screens that render their own full-bleed surface. */
  flush = false,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  wide?: boolean;
  flush?: boolean;
}) {
  const cls = [
    "admin-content",
    wide ? "admin-content--wide" : "",
    flush ? "admin-content--flush" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <div className="admin-page-header">
        <div className="min-w-0">
          <h1 className="admin-page-title">{title}</h1>
          {description && <p className="admin-page-subtitle">{description}</p>}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
