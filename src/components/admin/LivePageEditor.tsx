"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, Save, X, ExternalLink } from "lucide-react";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import {
  loadEditableConfig,
  saveEditableConfig,
  type SaveMode,
} from "@/lib/admin-site-config";

/**
 * Shared shell for the click-to-edit + inspector editors (the same pattern the
 * Programs builder and the COE/About editors use): loads a site-config key,
 * renders the real public layout in `editable` mode on the left, and opens a
 * slide-over inspector for whichever section was clicked.
 *
 * Callers supply the two page-specific halves — `renderPreview` (the public
 * layout) and `renderInspector` (its section inspector) — so a new page needs
 * only a schema, a layout and an inspector, not another copy of this file.
 */
type Props<T> = {
  configKey: string;
  publicPath: string;
  title: string;
  subtitle: string;
  /** Parsed schema defaults, used when the key has not been seeded yet. */
  emptyValue: () => T;
  /**
   * Kept on the type because callers pass it, but no longer rendered: the
   * quick-jump button strip duplicated the preview itself, where clicking the
   * section you want is both faster and unambiguous.
   */
  sectionOrder?: readonly string[];
  sectionLabels: Record<string, string>;
  /**
   * Inspector heading for the selected section. Needed when a page has
   * per-item sections (e.g. `group:3`) whose titles come from the data rather
   * than a fixed label map. Falls back to `sectionLabels`.
   */
  sectionTitle?: (section: string, data: T) => string;
  initialSection: string;
  renderPreview: (args: {
    data: T;
    onEditSection: (section: string) => void;
  }) => ReactNode;
  renderInspector: (args: {
    section: string;
    data: T;
    onChange: (next: T) => void;
    /** Lets an inspector jump the panel to another section (e.g. a block list
     * whose rows open the individual block editors). */
    onSelectSection: (section: string) => void;
  }) => ReactNode;
};

export function LivePageEditor<T>(props: Props<T>) {
  return (
    <DeferredUploadsProvider>
      <LivePageEditorInner {...props} />
    </DeferredUploadsProvider>
  );
}

function LivePageEditorInner<T>({
  configKey,
  publicPath,
  title,
  subtitle,
  emptyValue,
  sectionLabels,
  sectionTitle,
  initialSection,
  renderPreview,
  renderInspector,
}: Props<T>) {
  const router = useRouter();
  const { flush } = useDeferredUploads();

  const [draft, setDraft] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<string>(initialSection);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDraft(null);
    setMsg(null);
    loadEditableConfig<T>(configKey)
      .then((res) => {
        if (cancelled) return;
        // Key not yet seeded — open the editor with schema defaults so the
        // admin can fill in a brand-new page instead of hitting an error.
        setDraft(res.value ?? emptyValue());
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(`[LivePageEditor:${configKey}]`, err);
          setMsg({ text: "Failed to load content", ok: false });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // `emptyValue` is a fresh closure each render; the key alone identifies the
    // document to load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  const selectSection = (s: string) => {
    setSelected(s);
    setInspectorOpen(true);
  };

  const save = async (mode: SaveMode) => {
    setSaving(mode);
    setMsg(null);
    try {
      const flushedDraft = (await flush(draft)) as T;
      setDraft(flushedDraft);
      await saveEditableConfig(configKey, flushedDraft, mode);
      setMsg({
        text: mode === "publish" ? "Saved & published" : "Draft saved",
        ok: true,
      });
    } catch (err) {
      setMsg({
        text: err instanceof Error ? err.message : "Save failed",
        ok: false,
      });
    } finally {
      setSaving(null);
    }
  };

  const saveButtons = (full?: boolean) => (
    <SaveButtons saving={saving} disabled={loading} onSave={save} full={full} />
  );

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="admin-page-title">{title}</h1>
            <p className="admin-page-subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <ExternalLink size={14} /> Public Page
          </a>
          {msg && (
            <span
              className={`text-sm font-medium ${
                msg.ok ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg.text}
            </span>
          )}
          {saveButtons()}
        </div>
      </div>

      {loading || !draft ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="-mx-6 -mb-6 overflow-hidden border-t border-gray-200 bg-white xl:mx-0 xl:rounded-xl xl:border">
          {renderPreview({ data: draft, onEditSection: selectSection })}
        </div>
      )}

      {inspectorOpen && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-0 sm:p-4">
          {/* Wide enough for the two-column form grid the inspectors use. */}
          <aside className="flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-3xl sm:rounded-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                  Inspector
                </p>
                <h2 className="mt-0.5 font-semibold text-gray-900">
                  {sectionTitle?.(selected, draft) ??
                    sectionLabels[selected] ??
                    "Section"}
                </h2>
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
              >
                <X size={14} />
                <span className="sr-only">Close inspector</span>
              </button>
            </div>
            <div className="p-6">
              {renderInspector({
                section: selected,
                data: draft,
                onChange: setDraft,
                onSelectSection: setSelected,
              })}
            </div>
            <div className="sticky bottom-0 mt-auto border-t border-gray-100 bg-white px-6 py-3">
              {saveButtons(true)}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/**
 * The editors' one save control: "Save" keeps the change as a draft, "Save &
 * Publish" also makes it live. Shared so the header and the inspector footer
 * cannot drift apart.
 */
export function SaveButtons({
  saving,
  disabled,
  onSave,
  full,
}: {
  saving: SaveMode | null;
  disabled?: boolean;
  onSave: (mode: SaveMode) => void;
  /** Stretch to fill the row — used in the inspector footer. */
  full?: boolean;
}) {
  const busy = saving !== null || disabled;
  return (
    <div className={`flex items-center gap-2 ${full ? "w-full" : ""}`}>
      <button
        onClick={() => onSave("draft")}
        disabled={busy}
        title="Save without publishing — the live page keeps its current content"
        className={`admin-btn admin-btn-outline ${full ? "flex-1 justify-center" : ""}`}
      >
        {saving === "draft" ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Save size={15} />
        )}
        {saving === "draft" ? "Saving…" : "Save"}
      </button>
      <button
        onClick={() => onSave("publish")}
        disabled={busy}
        className={`admin-btn admin-btn-primary ${full ? "flex-1 justify-center" : ""}`}
      >
        {saving === "publish" ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Check size={15} />
        )}
        {saving === "publish" ? "Publishing…" : "Save & Publish"}
      </button>
    </div>
  );
}
