"use client";

import { useEffect, type ReactNode } from "react";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { useUnsavedGuard } from "./useUnsavedGuard";

export type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Sticky footer that tells an editor, at all times, whether their work is
 * safe. Every editor screen in the panel used to answer that question
 * differently — a toast on one page, a coloured `<span>` next to the button on
 * another, nothing at all on a third — so there was no habit an editor could
 * form about where to look.
 *
 * It also registers the unsaved-changes guard, so mounting a SaveBar is all a
 * screen has to do to stop silently discarding work.
 */
export function SaveBar({
  dirty,
  state,
  onSave,
  onDiscard,
  saveLabel = "Save & publish",
  /** Explains what saving actually does — "publishes to the live site" is not
   *  obvious from a button labelled Save. */
  hint,
  error,
  extra,
  disabled,
}: {
  dirty: boolean;
  state: SaveState;
  onSave: () => void;
  onDiscard?: () => void;
  saveLabel?: string;
  hint?: string;
  error?: string | null;
  extra?: ReactNode;
  disabled?: boolean;
}) {
  useUnsavedGuard(dirty);

  // Cmd/Ctrl+S saves, matching what anyone who has used a document editor
  // expects — and stops the browser opening its "save page" dialog.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !disabled && state !== "saving") onSave();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dirty, disabled, state, onSave]);

  const status = (() => {
    if (state === "saving") return { dot: "dirty", text: "Saving…" } as const;
    if (state === "error")
      return { dot: "error", text: error ?? "Save failed" } as const;
    if (dirty) return { dot: "dirty", text: "Unsaved changes" } as const;
    if (state === "saved")
      return { dot: "saved", text: "All changes saved" } as const;
    return { dot: "saved", text: "No changes" } as const;
  })();

  return (
    <div className="admin-savebar" data-dirty={dirty || undefined}>
      <p className="admin-savebar-status" role="status" aria-live="polite">
        <span className={`admin-dot admin-dot--${status.dot}`} />
        <span>{status.text}</span>
        {hint && !dirty && state !== "error" && (
          <span className="admin-help ml-2">{hint}</span>
        )}
      </p>

      <div className="flex items-center gap-2">
        {extra}
        {onDiscard && dirty && (
          <button
            type="button"
            onClick={onDiscard}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <RotateCcw size={14} />
            Discard
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={disabled || state === "saving" || !dirty}
          className="admin-btn admin-btn-primary"
        >
          {state === "saving" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Check size={15} />
          )}
          {state === "saving" ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
}
