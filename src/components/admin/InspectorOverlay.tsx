"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * The slide-over inspector shared by every click-to-edit editor.
 *
 * It looks like a modal, so it has to behave like one. Previously it was a
 * plain `<div className="fixed inset-0">` with no `role="dialog"`, no
 * `aria-modal`, no Escape handler, no focus move on open and no focus restore
 * on close — Tab walked straight out of the panel and into the preview
 * underneath it, and closing dropped focus onto document.body. The Lightbox in
 * this codebase already gets this right; this is the same contract for the
 * admin side, in one place so the two editors that use it cannot drift apart.
 */
export function InspectorOverlay({
  title,
  eyebrow = "Inspector",
  onClose,
  footer,
  children,
}: {
  title: ReactNode;
  eyebrow?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const headingId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Captured at mount so focus goes back to the region the admin clicked,
  // not to the top of the page.
  const returnFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      const target = returnFocusRef.current;
      if (target instanceof HTMLElement && document.contains(target)) {
        target.focus();
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      // Keep Tab inside the panel. The page behind is not inert, so without
      // this the next Tab lands on a control hidden under the overlay.
      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-0 sm:p-4"
      // Clicking the dimmed backdrop dismisses, the way every other overlay in
      // the app does. Guarded on target so a click inside the panel that
      // bubbles here doesn't close it.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* Wide enough for the two-column form grid the inspectors use. */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-3xl sm:rounded-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              {eyebrow}
            </p>
            <h2 id={headingId} className="mt-0.5 font-semibold text-gray-900">
              {title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
          >
            <X size={14} />
            <span className="sr-only">Close inspector</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="sticky bottom-0 mt-auto border-t border-gray-100 bg-white px-6 py-3">
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}
