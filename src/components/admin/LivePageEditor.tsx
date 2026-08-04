"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, Save, ExternalLink } from "lucide-react";
import { InspectorOverlay } from "@/components/admin/InspectorOverlay";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import {
  loadEditableConfig,
  saveEditableConfig,
  type SaveMode,
} from "@/lib/admin-site-config";
import {
  HostedInspector,
  hostedInspectorTitle,
  useHostedDrafts,
  type HostedDrafts,
} from "@/components/admin/hosted-content";

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
    /**
     * Drafts of the content pages this route absorbs, keyed by slug. Empty
     * until they load, and always empty for a route that hosts none.
     */
    hosted: HostedDrafts;
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
  // The pages this route absorbs are edited here too, so the whole merged page
  // is one preview, one inspector and one Save.
  const {
    defs: hostedDefs,
    drafts: hosted,
    setDrafts: setHosted,
    setDraft: setHostedDraft,
    loading: hostedLoading,
    saveAll: saveHosted,
  } = useHostedDrafts(publicPath);

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
      // Flush host and hosted drafts in one call: `flush` drops any pending
      // upload it cannot find in the value it is handed, so flushing them
      // separately would discard the other half's images.
      const flushed = (await flush({ host: draft, hosted })) as {
        host: T;
        hosted: HostedDrafts;
      };
      setDraft(flushed.host);
      setHosted(flushed.hosted);
      await saveEditableConfig(configKey, flushed.host, mode);
      await saveHosted(flushed.hosted, mode);
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

      {loading || hostedLoading || !draft ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="-mx-6 -mb-6 overflow-hidden border-t border-gray-200 bg-white xl:mx-0 xl:rounded-xl xl:border">
          {renderPreview({
            data: draft,
            hosted,
            onEditSection: selectSection,
          })}
        </div>
      )}

      {inspectorOpen && draft && (
        <InspectorOverlay
          title={
            hostedInspectorTitle(selected, hostedDefs, hosted) ??
            sectionTitle?.(selected, draft) ??
            sectionLabels[selected] ??
            "Section"
          }
          onClose={() => setInspectorOpen(false)}
          footer={saveButtons(true)}
        >
          {selected.startsWith("hosted:") ? (
            <HostedInspector
              sectionKey={selected}
              defs={hostedDefs}
              drafts={hosted}
              onChange={setHostedDraft}
              onSelectSection={setSelected}
            />
          ) : (
            renderInspector({
              section: selected,
              data: draft,
              onChange: setDraft,
              onSelectSection: setSelected,
            })
          )}
        </InspectorOverlay>
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
