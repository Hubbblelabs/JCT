"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

/**
 * The one sidebar behaviour every "On This Page" layout shares — About, COE,
 * Placements, NAAC, Documents, Research: one section shows at a time, and only
 * a click on a sidebar entry changes which. There is no scroll-spy. Some pages
 * used to stack every section and highlight entries as they scrolled past while
 * others switched panels, so the same sidebar did two different things.
 *
 * Every panel stays in the markup, toggled with `hidden` (`panelProps`), rather
 * than mounting on demand: the panels carry indexable copy and tables that must
 * stay in the server-rendered HTML.
 *
 * `#<id>` deep-links a panel — the retired routes redirect to one — and with
 * `syncHash` a click writes the fragment back.
 */

/** Marks a panel; its value is the id the sidebar selects it by. */
export const SECTION_PANEL_ATTR = "data-section-panel";

/** Marks the element holding one page's panels (`containerProps`). */
const PANELS_ATTR = "data-section-panels";

/**
 * Dispatched, bubbling, on a hidden panel when something outside the page
 * needs what is inside it — the admin editor, when the section picked in its
 * list lives on a panel that isn't showing (`revealInPreview` in
 * EditorWorkspace). The page that owns the panel brings it forward
 * synchronously, so the dispatcher can measure it straight after.
 */
export const REVEAL_PANEL_EVENT = "jct:reveal-panel";

function readHash(): string {
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ""));
  } catch {
    // A malformed escape (`#%`) is not a panel id.
    return "";
  }
}

export function useSectionPanels(
  /** The panels the sidebar opens, in sidebar order; the first is the default. */
  ids: readonly string[],
  {
    /**
     * Mirror the open panel in the URL fragment. Off in the admin preview,
     * which must not rewrite the editor's own URL.
     */
    syncHash = true,
  }: { syncHash?: boolean } = {},
) {
  // Keyed on the joined list, not the array: callers rebuild it every render.
  const key = ids.join("\n");
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  // Deep links (`…/naac#aqar-report`) and back/forward both arrive as a
  // fragment, so the same handler serves the first paint and later changes.
  useEffect(() => {
    if (!syncHash) return;
    const valid = new Set(key ? key.split("\n") : []);
    const apply = () => {
      const hash = readHash();
      if (hash && valid.has(hash)) setActiveId(hash);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [key, syncHash]);

  // Keep the selection valid as the list changes under it — the admin preview
  // re-renders as content is edited, and a section can lose its last entry.
  useEffect(() => {
    const valid = key ? key.split("\n") : [];
    setActiveId((prev) => (valid.includes(prev) ? prev : (valid[0] ?? "")));
  }, [key]);

  useEffect(() => {
    const onReveal = (event: Event) => {
      const panel = event.target;
      const root = containerRef.current;
      if (!(panel instanceof HTMLElement) || !root) return;
      // Only this page's own panels, not those of a shell nested inside one.
      if (panel.parentElement?.closest(`[${PANELS_ATTR}]`) !== root) return;
      const id = panel.getAttribute(SECTION_PANEL_ATTR);
      if (id) flushSync(() => setActiveId(id));
    };
    document.addEventListener(REVEAL_PANEL_EVENT, onReveal);
    return () => document.removeEventListener(REVEAL_PANEL_EVENT, onReveal);
  }, []);

  const select = useCallback(
    (id: string) => {
      setActiveId(id);
      // `replaceState` rather than assigning `location.hash`: the latter would
      // jump to the anchor itself and push a history entry per click.
      if (syncHash) window.history.replaceState(null, "", `#${id}`);
      if (containerRef.current) bringIntoReach(containerRef.current);
    },
    [syncHash],
  );

  return {
    activeId,
    select,
    /** Spread on the element that holds the panels. */
    containerProps: { ref: containerRef, [PANELS_ATTR]: "" },
    /** Spread on each panel. */
    panelProps: (id: string) => ({
      [SECTION_PANEL_ATTR]: id,
      hidden: id !== activeId,
    }),
  };
}

/**
 * After a click in a pinned sidebar, pull the top of the panels back into view
 * if it has scrolled away — the new panel would otherwise open somewhere above
 * the reader. Someone still near the top of the page stays put; jumping them
 * down to the panels would be disorienting.
 *
 * The window scrolls on the public site. In the admin preview the page sits in
 * its own scrolling pane, which is moved directly: smooth scrolling into the
 * zoomed preview stalls part-way (see EditorWorkspace).
 */
export function bringIntoReach(el: HTMLElement) {
  const pane = scrollingAncestor(el);
  const viewTop = pane ? pane.getBoundingClientRect().top : 0;
  // Clear of the fixed public navbar; the preview has none.
  const margin = pane ? 16 : window.innerWidth >= 1024 ? 120 : 90;
  const delta = el.getBoundingClientRect().top - viewTop - margin;
  if (delta >= 0) return;
  if (pane) pane.scrollTop += delta;
  else window.scrollBy({ top: delta, behavior: "smooth" });
}

function scrollingAncestor(el: HTMLElement): HTMLElement | null {
  for (
    let p = el.parentElement;
    p && p !== document.body;
    p = p.parentElement
  ) {
    const { overflowY } = getComputedStyle(p);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      p.scrollHeight > p.clientHeight
    )
      return p;
  }
  return null;
}
