"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

const MIN_WIDTH = 340;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 440;
const WIDTH_KEY = "jct-admin-drawer-width";

/**
 * Slide-over panel used by every inspector and modal form in the admin.
 *
 * The hand-rolled overlays this replaces had no focus trap, no Escape key, no
 * scroll lock and no dialog role — a keyboard or screen-reader user could tab
 * straight out of an open inspector into the page behind it. This one:
 *
 *  - traps Tab within the panel and restores focus to the trigger on close
 *  - closes on Escape and on backdrop click
 *  - locks background scroll while open
 *  - can be dragged wider, and remembers that width across sessions
 *  - refuses to close on a stray backdrop click when there are unsaved edits
 */
export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  description,
  icon: Icon,
  children,
  footer,
  resizable = true,
  /** When true, backdrop and Escape ask before discarding. */
  dirty = false,
  onConfirmDiscard,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: ComponentType<{ size?: number }>;
  children: ReactNode;
  footer?: ReactNode;
  resizable?: boolean;
  dirty?: boolean;
  onConfirmDiscard?: () => Promise<boolean>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState(false);

  // Restore the editor's preferred inspector width. Read on mount rather than
  // in useState so server and client render the same markup.
  useEffect(() => {
    const stored = Number(window.localStorage.getItem(WIDTH_KEY));
    if (stored >= MIN_WIDTH && stored <= MAX_WIDTH) setWidth(stored);
  }, []);

  const requestClose = useCallback(async () => {
    if (dirty && onConfirmDiscard) {
      const ok = await onConfirmDiscard();
      if (!ok) return;
    }
    onClose();
  }, [dirty, onConfirmDiscard, onClose]);

  // Remember the trigger, move focus into the panel, and put it back on close.
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    (first ?? panelRef.current)?.focus();
    return () => previousFocus.current?.focus?.();
  }, [open]);

  // Background scroll lock — without it the page behind scrolls under the
  // panel whenever the pointer leaves the drawer body.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape to close, Tab cycles within the panel.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        void requestClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, requestClose]);

  // Drag-to-resize. Listeners live on the document so the pointer can leave
  // the 6px handle mid-drag without the resize stalling.
  useEffect(() => {
    if (!dragging) return;
    function onMove(e: MouseEvent) {
      const next = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, window.innerWidth - e.clientX),
      );
      setWidth(next);
    }
    function onUp() {
      setDragging(false);
      setWidth((w) => {
        window.localStorage.setItem(WIDTH_KEY, String(w));
        return w;
      });
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  if (!open) return null;

  return (
    <div
      className="admin-drawer-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) void requestClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="admin-drawer relative"
        style={{ maxWidth: width }}
      >
        {resizable && (
          <div
            className="admin-drawer-resize"
            data-dragging={dragging || undefined}
            onMouseDown={() => setDragging(true)}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel"
          />
        )}

        <div className="admin-drawer-header">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="admin-empty-icon h-8 w-8 shrink-0">
                <Icon size={16} />
              </span>
            )}
            <div className="min-w-0">
              {eyebrow && <p className="admin-section-label">{eyebrow}</p>}
              <h2 className="admin-card-title mt-0.5 truncate">{title}</h2>
              {description && <p className="admin-help">{description}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void requestClose()}
            className="admin-icon-btn"
            aria-label={`Close ${title}`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="admin-drawer-body">{children}</div>

        {footer && <div className="admin-drawer-footer">{footer}</div>}
      </div>
    </div>
  );
}
