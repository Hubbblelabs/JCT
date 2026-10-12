"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ListTree,
  Loader2,
  MousePointerClick,
} from "lucide-react";
import { InspectorOverlay } from "@/components/admin/InspectorOverlay";
import { useTopbarSlot } from "@/components/admin/shell/topbar-slot";
import { ScaledPreview } from "./ScaledPreview";

/** One editable part of the page, as listed in the side panel. */
export type WorkspaceSection = {
  id: string;
  label: string;
  /** One sentence: what this section is and where it shows on the site. */
  help?: string;
  /** Optional heading the outline groups sections under. */
  group?: string;
};

const WIDE_QUERY = "(min-width: 1280px)";

function useIsWide(): boolean {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return wide;
}

/** Attribute selectors need `"` and `\` escaped; ids are app-generated. */
function attr(value: string): string {
  return value.replace(/["\\]/g, "\\$&");
}

/**
 * The preview elements that belong to a section: the clickable region
 * (`data-edit-section`) and any part of a public component marked as that
 * section (`data-preview-section`, e.g. the navbar's announcement strip).
 *
 * Scoped to one workspace: Next keeps recently visited pages mounted (hidden)
 * for back-navigation, so an unscoped query can land in a stale copy.
 */
function sectionSelector(scope: string, id: string): string {
  const v = attr(id);
  const root = `[data-workspace="${attr(scope)}"] [data-admin-preview]`;
  return `${root} [data-preview-section="${v}"], ${root} [data-edit-section="${v}"]`;
}

/**
 * Bring a section into view unless it already is — so choosing one from the
 * list or the sidebar finds it, while clicking it in the preview (where it is
 * visible by definition) doesn't jerk the page around.
 */
function revealInPreview(root: HTMLElement, scope: string, id: string) {
  const el = root.querySelector(sectionSelector(scope, id));
  const pane = root.querySelector(".admin-workspace-preview");
  if (!el || !pane) return;
  const r = el.getBoundingClientRect();
  const p = pane.getBoundingClientRect();
  const visible = r.bottom > p.top + 40 && r.top < p.bottom - 40;
  // A direct jump: smooth scrolling into the zoomed preview is unreliable
  // (it stalls part-way), and an editor jumping to the section is expected.
  if (!visible) pane.scrollTop += r.top - p.top - 8;
}

/**
 * The layout every page editor in the admin shares.
 *
 *  ┌───────────────────────────────────────────────────────┐
 *  │ Topbar: breadcrumb (?)     View live · Save · Publish │
 *  ├─────────────────────────────┬─────────────────────────┤
 *  │                             │ Sections list,          │
 *  │  The real page, clickable   │ or the form for         │
 *  │  section by section         │ the one picked          │
 *  └─────────────────────────────┴─────────────────────────┘
 *
 * The page has no heading of its own: the breadcrumb already names it, the
 * description sits behind the help icon beside it, and the header controls
 * and save bar are portalled into the admin topbar so the preview gets the
 * full height.
 *
 * Editors used to each build this frame themselves — a modal on one page, a
 * plain form with no preview on another, the save button in a different
 * corner on a third. This owns the frame; an editor supplies its preview, its
 * section list and the form for the selected section.
 *
 * Below 1280px there is no room for both columns, so the panel opens as a
 * slide-over instead and the section list moves behind a "Sections" button.
 */
export function EditorWorkspace({
  title,
  description,
  publicHref,
  headerExtra,
  loading = false,
  error,
  preview,
  previewWidth,
  sections,
  selected,
  onSelect,
  panelTitle,
  panelHelp,
  panel,
  saveBar,
  banner,
}: {
  /** Names the page in the breadcrumb when the nav trail doesn't. */
  title: string;
  /** Shown behind the help icon next to the breadcrumb. */
  description?: string;
  /** The live page this editor changes. */
  publicHref?: string;
  /** Extra topbar controls, e.g. back to the list or Delete. */
  headerExtra?: ReactNode;
  loading?: boolean;
  error?: string | null;
  preview: ReactNode;
  previewWidth?: number;
  sections: WorkspaceSection[];
  /** The section being edited, or null for the section list. */
  selected: string | null;
  onSelect: (id: string | null) => void;
  /** Panel heading; defaults to the selected section's label. */
  panelTitle?: ReactNode;
  /** Panel explanation; defaults to the selected section's help. */
  panelHelp?: ReactNode;
  /** The form for the selected section. */
  panel?: ReactNode;
  /** An EditorSaveBar — shown in the topbar. */
  saveBar: ReactNode;
  /** Full-width notice above the page — e.g. validation errors. */
  banner?: ReactNode;
}) {
  const wide = useIsWide();
  const [outlineOpen, setOutlineOpen] = useState(false);
  const scope = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const topbar = useTopbarSlot({ title, description });

  const current = sections.find((s) => s.id === selected);
  const heading = panelTitle ?? current?.label ?? "Section";
  const help = panelHelp ?? current?.help;

  const pick = (id: string) => {
    onSelect(id);
    setOutlineOpen(false);
  };

  useEffect(() => {
    if (!selected || loading) return;
    // Sections above the target are often still fetching their content and
    // take no space yet, so the target moves down as they arrive. Check again
    // as the page settles; each check is a no-op once it is in view.
    const timers = [0, 500, 1200, 2500].map((ms) =>
      window.setTimeout(() => {
        if (rootRef.current) revealInPreview(rootRef.current, scope, selected);
      }, ms),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [selected, loading, scope]);

  const outline = (
    <SectionOutline sections={sections} selected={selected} onPick={pick} />
  );

  const editor = (
    <>
      {help && <p className="admin-workspace-help">{help}</p>}
      {panel}
    </>
  );

  const actions = (
    <>
      {headerExtra}
      {!wide && sections.length > 0 && (
        <button
          type="button"
          onClick={() => setOutlineOpen(true)}
          className="admin-btn admin-btn-outline admin-btn-sm"
          title="Page sections"
        >
          <ListTree size={14} />
          <span className="admin-tb-label admin-tb-label--secondary">
            Sections
          </span>
        </button>
      )}
      {publicHref && (
        <a
          href={publicHref}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-outline admin-btn-sm"
          title="Open the live page in a new tab"
        >
          <ExternalLink size={14} />
          <span className="admin-tb-label admin-tb-label--secondary">
            View live page
          </span>
        </a>
      )}
      {saveBar}
    </>
  );

  return (
    <div className="admin-workspace" ref={rootRef} data-workspace={scope}>
      {topbar === undefined ? (
        <div className="admin-workspace-actions">{actions}</div>
      ) : (
        topbar && createPortal(actions, topbar)
      )}

      {banner && <div className="admin-workspace-banner">{banner}</div>}

      <div className="admin-workspace-body" data-wide={wide || undefined}>
        <div className="admin-workspace-preview">
          {error ? (
            <p className="m-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {selected && (
                <style>{`${sectionSelector(
                  scope,
                  selected,
                )}{outline:3px solid #d4a024 !important;outline-offset:-3px}`}</style>
              )}
              <ScaledPreview minWidth={previewWidth}>{preview}</ScaledPreview>
            </>
          )}
        </div>

        {wide && (
          <aside className="admin-workspace-panel" aria-label="Edit panel">
            {selected && !loading ? (
              <>
                <div className="admin-workspace-panel-head">
                  <button
                    type="button"
                    onClick={() => onSelect(null)}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                  >
                    <ArrowLeft size={14} /> All sections
                  </button>
                  <h2 className="admin-workspace-panel-title">{heading}</h2>
                </div>
                <div className="admin-workspace-panel-body">{editor}</div>
              </>
            ) : (
              <>
                <div className="admin-workspace-panel-head">
                  <h2 className="admin-workspace-panel-title">Page sections</h2>
                  <p className="admin-workspace-hint">
                    <MousePointerClick size={14} />
                    Click a section here or on the page to edit it.
                  </p>
                </div>
                <div className="admin-workspace-panel-body">{outline}</div>
              </>
            )}
          </aside>
        )}
      </div>

      {!wide && selected && !loading && (
        <InspectorOverlay
          title={heading}
          eyebrow="Editing"
          onClose={() => onSelect(null)}
        >
          {editor}
        </InspectorOverlay>
      )}
      {!wide && outlineOpen && (
        <InspectorOverlay
          title="Page sections"
          eyebrow="Choose what to edit"
          onClose={() => setOutlineOpen(false)}
        >
          {outline}
        </InspectorOverlay>
      )}
    </div>
  );
}

function SectionOutline({
  sections,
  selected,
  onPick,
}: {
  sections: WorkspaceSection[];
  selected: string | null;
  onPick: (id: string) => void;
}) {
  // Keep the authored order; a group heading appears where its first
  // section does.
  const seen = new Set<string>();
  return (
    <ul className="admin-workspace-outline">
      {sections.map((s) => {
        const showGroup = s.group && !seen.has(s.group);
        if (s.group) seen.add(s.group);
        return (
          <li key={s.id}>
            {showGroup && (
              <p className="admin-workspace-outline-group">{s.group}</p>
            )}
            <button
              type="button"
              onClick={() => onPick(s.id)}
              aria-current={s.id === selected || undefined}
              className="admin-workspace-outline-item"
            >
              <span className="min-w-0 flex-1">
                <span className="admin-workspace-outline-label">{s.label}</span>
                {s.help && (
                  <span className="admin-workspace-outline-help">{s.help}</span>
                )}
              </span>
              <ChevronRight size={16} className="shrink-0 text-gray-400" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
