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
 * `router.push()` calls are NOT covered — call `confirmDiscard` yourself there.
 */
export function useUnsavedGuard(
  dirty: boolean,
  message = "You have unsaved changes. Leave this page and discard them?",
) {
  useEffect(() => {
    if (!dirty) return;

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

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      // Same-document links only; external hrefs are handled by beforeunload.
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      if (!window.confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClickCapture, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, [dirty, message]);
}
