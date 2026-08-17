import type { ReactNode } from "react";

/**
 * Presentational pieces the help manual is written with.
 *
 * They exist so the chapter file stays readable as prose — a chapter should be
 * a sequence of `<P>`, `<Steps>` and `<Note>` calls, not a wall of class
 * names. Everything styles itself through the tokens in admin.css.
 *
 * None of these are client components: the manual is static text, so the whole
 * chapter tree renders on the server and ships no JavaScript of its own.
 */

/* ── Text ─────────────────────────────────────────────────────────────────*/

export function P({ children }: { children: ReactNode }) {
  return <p className="admin-doc-p">{children}</p>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="admin-doc-h3">{children}</h3>;
}

/** Names a control exactly as it is labelled in the panel. */
export function UI({ children }: { children: ReactNode }) {
  return <span className="admin-doc-ui">{children}</span>;
}

export function Key({ children }: { children: ReactNode }) {
  return <kbd className="admin-kbd">{children}</kbd>;
}

/* ── Lists ────────────────────────────────────────────────────────────────*/

/** Numbered instructions. Each child is one step. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="admin-doc-steps">{children}</ol>;
}

export function Bullets({ children }: { children: ReactNode }) {
  return <ul className="admin-doc-bullets">{children}</ul>;
}

/* ── Callouts ─────────────────────────────────────────────────────────────*/

/**
 * `tone` is meaning, not decoration:
 *   info    — a useful aside
 *   warning — a way to lose work or publish the wrong thing
 *   danger  — something that cannot be undone
 */
export function Note({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "danger";
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`admin-doc-note admin-doc-note--${tone}`}>
      {title && <p className="admin-doc-note-title">{title}</p>}
      <div className="admin-doc-note-body">{children}</div>
    </div>
  );
}

/* ── Definition table ─────────────────────────────────────────────────────*/

export type DefRow = { term: ReactNode; body: ReactNode };

/**
 * Term → explanation. Used for the glossary, the field references and the
 * troubleshooting list, so those three read the same way.
 */
export function Defs({ rows }: { rows: DefRow[] }) {
  return (
    <dl className="admin-doc-defs">
      {rows.map((row, i) => (
        <div key={i} className="admin-doc-def">
          <dt className="admin-doc-def-term">{row.term}</dt>
          <dd className="admin-doc-def-body">{row.body}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Comparison card ──────────────────────────────────────────────────────*/

/**
 * One box per "kind of screen" in the save-behaviour chapter. Which of the
 * four a screen is decides whether pressing Save changes the live site, so it
 * gets a layout that can be compared at a glance rather than a paragraph.
 */
export function Cards({ children }: { children: ReactNode }) {
  return <div className="admin-doc-cards">{children}</div>;
}

export function Card({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="admin-doc-card">
      <p className="admin-doc-card-title">
        {title}
        {badge}
      </p>
      <div className="admin-doc-card-body">{children}</div>
    </div>
  );
}
