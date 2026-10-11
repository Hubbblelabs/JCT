"use client";

import { useEffect } from "react";
import { Check, Loader2, RotateCcw, Save } from "lucide-react";
import { useUnsavedGuard } from "./useUnsavedGuard";

export type EditorSaveMode = "draft" | "publish";

/**
 * The one save control every page editor shares: status on the left, then
 * Discard, Save draft and Publish.
 *
 * "Save draft" keeps the change out of the live site; "Publish" makes it live.
 * Publish stays enabled with nothing edited when a saved draft is still
 * waiting, so a draft saved yesterday can be published today.
 *
 * Mounting it also guards the page against leaving with unsaved changes, and
 * binds Ctrl/Cmd+S to "Save draft".
 */
export function EditorSaveBar({
  dirty,
  saving,
  unpublished = false,
  message,
  disabled = false,
  onSaveDraft,
  onPublish,
  onDiscard,
}: {
  dirty: boolean;
  saving: EditorSaveMode | null;
  /** A saved draft exists that the live site does not show yet. */
  unpublished?: boolean;
  /** Outcome of the last save — shown until the next edit. */
  message?: { text: string; ok: boolean } | null;
  disabled?: boolean;
  /** Omit for content that has no draft stage (it publishes on save). */
  onSaveDraft?: () => void;
  /** Omit when publishing isn't possible yet (e.g. an unsaved new item). */
  onPublish?: () => void;
  onDiscard?: () => void;
}) {
  useUnsavedGuard(dirty);

  const busy = saving !== null || disabled;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "s") return;
      e.preventDefault();
      if (!dirty || busy) return;
      (onSaveDraft ?? onPublish)?.();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dirty, busy, onSaveDraft, onPublish]);

  const status = (() => {
    if (saving === "draft") return { dot: "dirty", text: "Saving draft…" };
    if (saving === "publish") return { dot: "dirty", text: "Publishing…" };
    if (dirty) return { dot: "dirty", text: "Unsaved changes" };
    if (message && !message.ok) return { dot: "error", text: message.text };
    if (message) return { dot: "saved", text: message.text };
    if (unpublished)
      return {
        dot: "dirty",
        text: "Draft saved — not on the live site yet",
      };
    return { dot: "saved", text: "Live — everything is published" };
  })();

  return (
    <div className="admin-savebar" data-dirty={dirty || undefined}>
      <p className="admin-savebar-status" role="status" aria-live="polite">
        <span className={`admin-dot admin-dot--${status.dot}`} />
        <span>{status.text}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {onDiscard && dirty && (
          <button
            type="button"
            onClick={onDiscard}
            disabled={busy}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <RotateCcw size={14} />
            Discard changes
          </button>
        )}
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={busy || !dirty}
            title="Save without changing the live site"
            className="admin-btn admin-btn-outline"
          >
            {saving === "draft" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Save draft
          </button>
        )}
        {onPublish && (
          <button
            type="button"
            onClick={onPublish}
            disabled={busy || (!dirty && !unpublished)}
            title="Save and show the changes on the live site"
            className="admin-btn admin-btn-primary"
          >
            {saving === "publish" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            Publish
          </button>
        )}
      </div>
    </div>
  );
}
