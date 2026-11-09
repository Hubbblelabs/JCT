"use client";

import { useEffect } from "react";

/**
 * Warns before unsaved editor changes are thrown away.
 *
 * The admin had no dirty-state signal at all: closing the tab, hitting the
 * browser Back button or clicking any nav link discarded in-progress edits
 * silently. That is the single most damaging thing a CMS can do to a
 * non-technical editor, because the work is simply gone with no trace.
 *
 * Two escape routes are covered:
 *
 *  - leaving the site or reloading  → the browser's native beforeunload prompt
 *  - clicking an in-app link        → intercepted in the capture phase, before
 *                                     the router sees the click, and confirmed
 *
 * Next's App Router exposes no navigation-blocking hook, so link interception
 * is the only way to guard client-side transitions. Programmatic
 * `router.push()` calls are NOT covered — call `confirmDiscardIfDirty` before
 * them. The browser's Back button is covered by a duplicate history entry that
 * absorbs the first press (see below).
 */
const DEFAULT_MESSAGE =
  "You have unsaved changes. Leave this page and discard them?";

/** Mounted guards currently holding unsaved changes. */
let dirtyGuards = 0;

/**
 * For programmatic navigation (`router.push`), which the click interception
 * below cannot see: true when nothing is unsaved or the user agrees to
 * discard it.
 */
export function confirmDiscardIfDirty(message = DEFAULT_MESSAGE): boolean {
  return dirtyGuards === 0 || window.confirm(message);
}

/**
 * Same page as far as unsaved work is concerned: only `?section=` (which
 * panel is open) may differ. Every per-college editor is one pathname keyed by
 * `?college=`, and remounts when it changes — so treating any same-path link
 * as harmless let a college switch throw the edits away unasked.
 */
function sameEditor(url: URL): boolean {
  if (url.pathname !== window.location.pathname) return false;
  const strip = (params: URLSearchParams) => {
    const copy = new URLSearchParams(params);
    copy.delete("section");
    copy.sort();
    return copy.toString();
  };
  return (
    strip(url.searchParams) ===
    strip(new URLSearchParams(window.location.search))
  );
}

export function useUnsavedGuard(dirty: boolean, message = DEFAULT_MESSAGE) {
  useEffect(() => {
    if (!dirty) return;
    dirtyGuards += 1;

    function onBeforeUnload(e: BeforeUnloadEvent) {
      // Browsers ignore custom text now and show their own wording; assigning
      // returnValue is still what triggers the prompt at all.
      e.preventDefault();
      e.returnValue = "";
    }

    function onClickCapture(e: MouseEvent) {
      // Let modified clicks through — they open a new tab, so this page (and
      // its unsaved state) survives.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      // Links inside an editor's live preview never navigate (ScaledPreview
      // cancels them) — the click opens that section's editor instead.
      if (target?.closest?.("[data-admin-preview]")) return;

      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      // Same-document links only; external hrefs are handled by beforeunload.
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (sameEditor(url)) return;

      if (!window.confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClickCapture, true);
    return () => {
      dirtyGuards -= 1;
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, [dirty, message]);

  // Browser Back. The App Router handles it as a client-side popstate — no
  // beforeunload, no click — so it discarded edits unasked. While dirty, a
  // copy of the current entry sits on top of history: Back pops onto that copy
  // (same URL and router state, so nothing re-renders), and the popstate is
  // where the question gets asked.
  useEffect(() => {
    if (!dirty) return;
    const pushGuard = () => {
      const state = (window.history.state ?? {}) as Record<string, unknown>;
      if (state[GUARD_STATE_KEY]) return;
      window.history.pushState(
        { ...state, [GUARD_STATE_KEY]: true },
        "",
        window.location.href,
      );
    };
    pushGuard();

    let leaving = false;
    function onPopState() {
      if (leaving) return;
      if (window.confirm(message)) {
        leaving = true;
        // Already off the copy and onto the real entry: one more step back
        // is the page the user asked for.
        window.history.back();
      } else {
        pushGuard();
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [dirty, message]);
}

/** Marks the duplicate history entry the Back-button guard pushes. */
const GUARD_STATE_KEY = "__jctUnsavedGuard";
