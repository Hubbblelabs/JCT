"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { hostedSectionKey } from "@/lib/content-pages";
import {
  EditorSaveBar,
  EditorWorkspace,
  type WorkspaceSection,
} from "@/components/admin/kit";

/**
 * Shared editor for a page backed by one site-config key: loads the draft,
 * renders the real public layout in `editable` mode inside the standard
 * EditorWorkspace, and shows the form for whichever section was clicked.
 *
 * Callers supply the two page-specific halves — `renderPreview` (the public
 * layout) and `renderInspector` (its section forms) — so a new page needs only
 * a schema, a layout and an inspector, not another copy of this file.
 */
type Props<T> = {
  configKey: string;
  publicPath: string;
  title: string;
  subtitle: string;
  /** Parsed schema defaults, used when the key has not been seeded yet. */
  emptyValue: () => T;
  /** The order sections are listed in the side panel. Defaults to the
   *  order of `sectionLabels`. */
  sectionOrder?: readonly string[];
  sectionLabels: Record<string, string>;
  /** One sentence per section explaining what it controls on the site. */
  sectionHelp?: Record<string, string>;
  /**
   * Panel heading for the selected section. Needed when a page has per-item
   * sections (e.g. `group:3`) whose titles come from the data rather than a
   * fixed label map. Falls back to `sectionLabels`.
   */
  sectionTitle?: (section: string, data: T) => string;
  /** Kept for callers; the panel now opens on the section list. */
  initialSection?: string;
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

type Snapshot<T> = { host: T | null; hosted: HostedDrafts };

function LivePageEditorInner<T>({
  configKey,
  publicPath,
  title,
  subtitle,
  emptyValue,
  sectionOrder,
  sectionLabels,
  sectionHelp,
  sectionTitle,
  renderPreview,
  renderInspector,
}: Props<T>) {
  const { flush } = useDeferredUploads();
  // The pages this route absorbs are edited here too, so the whole merged page
  // is one preview, one panel and one Save.
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
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [unpublished, setUnpublished] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDraft(null);
    setBaseline(null);
    setError(null);
    setMsg(null);
    loadEditableConfig<T>(configKey)
      .then((res) => {
        if (cancelled) return;
        // Key not yet seeded — open the editor with schema defaults so the
        // admin can fill in a brand-new page instead of hitting an error.
        setDraft(res.value ?? emptyValue());
        setUnpublished(res.status === "draft");
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(`[LivePageEditor:${configKey}]`, err);
          setError("This page's content could not be loaded. Reload to retry.");
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

  const ready = !loading && !hostedLoading && draft !== null;
  const current = useMemo(
    () => JSON.stringify({ host: draft, hosted } satisfies Snapshot<T>),
    [draft, hosted],
  );
  // The first settled state is the saved state everything is compared with.
  useEffect(() => {
    if (ready && baseline === null) setBaseline(current);
  }, [ready, baseline, current]);
  const dirty = baseline !== null && current !== baseline;

  // Any edit makes the last save's message stale.
  useEffect(() => {
    if (dirty) setMsg(null);
  }, [dirty]);

  const discard = () => {
    if (baseline === null) return;
    const snap = JSON.parse(baseline) as Snapshot<T>;
    setDraft(snap.host);
    setHosted(snap.hosted);
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
      await saveEditableConfig(configKey, flushed.host, mode);
      await saveHosted(flushed.hosted, mode);
      setDraft(flushed.host);
      setHosted(flushed.hosted);
      setBaseline(
        JSON.stringify({
          host: flushed.host,
          hosted: flushed.hosted,
        } satisfies Snapshot<T>),
      );
      setUnpublished(mode === "draft");
      setMsg({
        text:
          mode === "publish"
            ? "Published — the live page is updated"
            : "Draft saved — not on the live site yet",
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

  const sections = useMemo<WorkspaceSection[]>(() => {
    const ids = sectionOrder ?? Object.keys(sectionLabels);
    const own = ids.map((id) => ({
      id,
      label: sectionLabels[id] ?? id,
      help: sectionHelp?.[id],
    }));
    // Pages published as tabs of this one are edited here too.
    const tabs = hostedDefs.map((def) => ({
      id: hostedSectionKey(def.slug, "hero"),
      label: def.host?.navLabel ?? def.label,
      help: def.description,
      group: "Tabs on this page",
    }));
    return [...own, ...tabs];
  }, [sectionOrder, sectionLabels, sectionHelp, hostedDefs]);

  const panelTitle =
    selected && draft
      ? (hostedInspectorTitle(selected, hostedDefs, hosted) ??
        sectionTitle?.(selected, draft) ??
        sectionLabels[selected] ??
        "Section")
      : undefined;

  return (
    <EditorWorkspace
      title={title}
      description={subtitle}
      publicHref={publicPath}
      loading={!ready && !error}
      error={error}
      sections={sections}
      selected={selected}
      onSelect={setSelected}
      panelTitle={panelTitle}
      preview={
        draft &&
        renderPreview({
          data: draft,
          hosted,
          onEditSection: setSelected,
        })
      }
      panel={
        selected && draft ? (
          selected.startsWith("hosted:") ? (
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
          )
        ) : null
      }
      saveBar={
        <EditorSaveBar
          dirty={dirty}
          saving={saving}
          unpublished={unpublished}
          message={msg}
          disabled={!ready}
          onSaveDraft={() => save("draft")}
          onPublish={() => save("publish")}
          onDiscard={discard}
        />
      }
    />
  );
}
