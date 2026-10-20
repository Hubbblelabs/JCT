"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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
import {
  REVEAL_PANEL_EVENT,
  SECTION_PANEL_ATTR,
} from "@/lib/use-section-panels";
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

// The edit panel can be dragged wider (or narrower) from its left edge. The
// preview is scaled to fit whatever is left, so giving a long form or a wide
// table more room costs nothing but zoom. Remembered per browser.
const PANEL_WIDTH_KEY = "jct-admin-panel-width";
const PANEL_MIN = 380;
const PANEL_MAX = 960;
/** Never squeeze the preview below this. */
const PREVIEW_MIN = 560;

function clampPanel(width: number): number {
  const max = Math.min(PANEL_MAX, window.innerWidth - PREVIEW_MIN);
  return Math.round(Math.max(PANEL_MIN, Math.min(max, width)));
}

function usePanelWidth() {
  const [width, setWidth] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  // Read on mount rather than in useState so server and client render the
  // same markup.
  useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem(PANEL_WIDTH_KEY));
      if (stored >= PANEL_MIN && stored <= PANEL_MAX)
        setWidth(clampPanel(stored));
    } catch {
      // Storage blocked: keep the stylesheet's default width.
    }
  }, []);

  const commit = (next: number | null) => {
    setWidth(next);
    try {
      if (next === null) window.localStorage.removeItem(PANEL_WIDTH_KEY);
      else window.localStorage.setItem(PANEL_WIDTH_KEY, String(next));
    } catch {
      // Not remembered this time; the width still applies.
    }
  };

  // Listeners live on the document so the pointer can leave the thin handle
  // mid-drag without the resize stalling.
  useEffect(() => {
    if (!dragging) return;
    let latest: number | null = null;
    const onMove = (e: MouseEvent) => {
      latest = clampPanel(window.innerWidth - e.clientX);
      setWidth(latest);
    };
    const onUp = () => {
      setDragging(false);
      if (latest !== null) commit(latest);
    };
    const previous = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.body.style.userSelect = previous;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  return { width, dragging, startDrag: () => setDragging(true), commit };
}

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

const isRendered = (el: Element) => el.getClientRects().length > 0;

const HIDDEN_PANEL = `[${SECTION_PANEL_ATTR}][hidden]`;

/**
 * Bring a section into view unless it already is — so choosing one from the
 * list or the sidebar finds it, while clicking it in the preview (where it is
 * visible by definition) doesn't jerk the page around.
 *
 * A page with a sidebar shows one panel at a time (`useSectionPanels`), so the
 * section may sit on a closed one: the page is asked to open it first, and
 * answers synchronously. A region can also render twice — a sidebar's phone
 * and desktop copies, one hidden by CSS — so the copy on screen wins.
 */
function revealInPreview(root: HTMLElement, scope: string, id: string) {
  const matches = Array.from(
    root.querySelectorAll<HTMLElement>(sectionSelector(scope, id)),
  );
  const el =
    matches.find(isRendered) ?? matches.find((m) => m.closest(HIDDEN_PANEL));
  const pane = root.querySelector(".admin-workspace-preview");
  if (!el || !pane) return;
  for (
    let panel = el.closest<HTMLElement>(HIDDEN_PANEL);
    panel;
    panel = panel.parentElement?.closest<HTMLElement>(HIDDEN_PANEL) ?? null
  ) {
    panel.dispatchEvent(new CustomEvent(REVEAL_PANEL_EVENT, { bubbles: true }));
  }
  if (!isRendered(el)) return;
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
  const panelRef = useRef<HTMLElement>(null);
  const panelSize = usePanelWidth();
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
    <div
      className="admin-workspace"
      ref={rootRef}
      data-workspace={scope}
      style={
        panelSize.width
          ? ({ "--admin-panel-w": `${panelSize.width}px` } as CSSProperties)
          : undefined
      }
    >
      {topbar === undefined ? (
        <div className="admin-workspace-actions">{actions}</div>
      ) : (
        topbar && createPortal(actions, topbar)
      )}

      {banner && <div className="admin-workspace-banner">{banner}</div>}

      <div className="admin-workspace-body" data-wide={wide || undefined}>
        <div className="admin-workspace-preview">
          {error ? (
            <p className="m-6 rounded-lg bg-[var(--admin-danger-bg)] px-4 py-3 text-sm text-[var(--admin-danger)]">
              {error}
            </p>
          ) : loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2
                size={24}
                className="animate-spin text-[var(--admin-text-faint)]"
              />
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
          <aside
            ref={panelRef}
            className="admin-workspace-panel"
            aria-label="Edit panel"
          >
            {/* Drag to resize; arrow keys when focused; double-click resets. */}
            <div
              className="admin-workspace-resize"
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize the edit panel"
              aria-valuemin={PANEL_MIN}
              aria-valuemax={PANEL_MAX}
              aria-valuenow={panelSize.width ?? undefined}
              tabIndex={0}
              title="Drag to resize the panel — double-click to reset"
              data-dragging={panelSize.dragging || undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                panelSize.startDrag();
              }}
              onDoubleClick={() => panelSize.commit(null)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                e.preventDefault();
                const current =
                  panelSize.width ?? panelRef.current?.offsetWidth ?? PANEL_MIN;
                // The handle is the panel's left edge: left makes it wider.
                panelSize.commit(
                  clampPanel(current + (e.key === "ArrowLeft" ? 40 : -40)),
                );
              }}
            />
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
              <ChevronRight
                size={16}
                className="shrink-0 text-[var(--admin-text-faint)]"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
