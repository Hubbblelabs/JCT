"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  EditorSaveBar,
  EditorWorkspace,
  type WorkspaceSection,
} from "@/components/admin/kit";
import {
  loadEditableConfig,
  saveEditableConfig,
  type SaveMode,
} from "@/lib/admin-site-config";
import {
  PlacementsPageLayout,
  PLACEMENT_RECORDS_SECTION,
  PLACEMENT_SECTION_LABELS,
  parsePlacementRecordSection,
  placementRecordSection,
  type PlacementEditableSection,
} from "@/components/layout/PlacementsPageLayout";
import { PlacementSectionInspector } from "@/components/admin/PlacementSectionInspector";
import {
  PlacementRecordInspector,
  PlacementYearsInspector,
  placementRecordInspectorTitle,
} from "@/components/admin/PlacementRecordInspector";
import {
  HostedInspector,
  hostedInspectorTitle,
  useHostedDrafts,
} from "@/components/admin/hosted-content";
import {
  createPlacementRecord,
  deletePlacementRecord,
  loadPlacementRecords,
  nextFreeYear,
  savePlacementRecords,
  toPreviewRecord,
  type AdminPlacementRecord,
} from "@/lib/admin-placement-records";
import { hostedSectionKey } from "@/lib/content-pages";
import {
  columnsToStore,
  resolveColumns,
  type TableColumn,
} from "@/lib/table-columns";
import { PLACEMENT_HISTORY_COLUMNS } from "@/lib/placement-history-columns";
import { emptyContentBlock, PlacementInfoSchema } from "@/lib/validation";
import type { PlacementInfoValue } from "@/lib/validation";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";

type College = "engineering" | "arts-science" | "polytechnic";

const COLLEGES: Record<College, { configKey: string; label: string }> = {
  engineering: {
    configKey: "engineeringPlacementInfo",
    label: "Engineering",
  },
  "arts-science": {
    configKey: "artsSciencePlacementInfo",
    label: "Arts & Science",
  },
  polytechnic: {
    configKey: "polytechnicPlacementInfo",
    label: "Polytechnic",
  },
};

const SECTION_HELP: Record<PlacementEditableSection, string> = {
  banner: "The highlight figures at the top of the page.",
  process: "How placements work, step by step.",
  tpo: "The Training & Placement Officer and other contacts.",
  mou: "Companies and organisations the college has MoUs with.",
  "why-recruit": "Reasons recruiters should hire from JCT.",
  sidebar: "The side menu of this page.",
};

function PlacementsPageEditorInner() {
  const searchParams = useSearchParams();
  const { flush, getPreview } = useDeferredUploads();
  const toast = useToast();
  const confirm = useConfirm();

  const raw = searchParams.get("college") ?? "engineering";
  const college: College =
    raw === "arts-science" || raw === "polytechnic" ? raw : "engineering";
  const { configKey, label } = COLLEGES[college];
  const publicPath = `/institutions/${college}/placements`;
  // The gallery is a hosted content page: it renders as a section of this page
  // and is edited right here.
  const {
    defs: hostedDefs,
    drafts: hostedDrafts,
    setDrafts: setHostedDrafts,
    setDraft: setHostedDraft,
    loading: hostedLoading,
    saveAll: saveHosted,
  } = useHostedDrafts(publicPath);
  const gallerySlug = hostedDefs[0]?.slug;

  const [draft, setDraft] = useState<PlacementInfoValue | null>(null);
  // The year-wise records are edited here too. They are `Placement` documents,
  // not part of the config key, so they are held separately and PATCHed on
  // save — `loaded` is the baseline that decides which ones actually changed.
  const [records, setRecords] = useState<AdminPlacementRecord[]>([]);
  const [loadedRecords, setLoadedRecords] = useState<AdminPlacementRecord[]>(
    [],
  );
  const [recordBusy, setRecordBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [unpublished, setUnpublished] = useState(false);
  const [selected, setSelectedRaw] = useState<string | null>(null);
  /** The saved state `{host, hosted, records}` is compared against. */
  const [baseline, setBaseline] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDraft(null);
    setBaseline(null);
    setLoadError(null);
    setMsg(null);
    Promise.all([
      loadEditableConfig<PlacementInfoValue>(configKey).catch(() => null),
      loadPlacementRecords(college).catch(() => [] as AdminPlacementRecord[]),
    ])
      .then(([configRes, placementRecords]) => {
        if (cancelled) return;
        // Parse through the schema so a partially-filled stored value still
        // arrives fully shaped — every inspector field reads `data.x.y`.
        const parsed = PlacementInfoSchema.safeParse(configRes?.value ?? {});
        setDraft(parsed.success ? parsed.data : PlacementInfoSchema.parse({}));
        setUnpublished(configRes?.status === "draft");
        setRecords(placementRecords);
        setLoadedRecords(placementRecords);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[PlacementsPageEditor]", err);
          setLoadError(
            "This page's content could not be loaded. Reload to retry.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [configKey, college]);

  const setSelected = setSelectedRaw;
  const selectSection = (s: string) => setSelected(s);

  const ready = !loading && !hostedLoading && draft !== null;
  const current = useMemo(
    () => JSON.stringify({ host: draft, hosted: hostedDrafts, records }),
    [draft, hostedDrafts, records],
  );
  // The first settled state is the saved state everything is compared with.
  useEffect(() => {
    if (ready && baseline === null) setBaseline(current);
  }, [ready, baseline, current]);
  const dirty = baseline !== null && current !== baseline;
  useEffect(() => {
    if (dirty) setMsg(null);
  }, [dirty]);

  const discard = () => {
    if (baseline === null) return;
    const snap = JSON.parse(baseline) as {
      host: PlacementInfoValue;
      hosted: typeof hostedDrafts;
      records: AdminPlacementRecord[];
    };
    setDraft(snap.host);
    setHostedDrafts(snap.hosted);
    setRecords(snap.records);
  };

  // Which year the preview shows — held here rather than inside the layout so
  // the inspector always edits the year on screen. Falls back to the current
  // (or newest) record once the list loads, and again if that year is deleted.
  const [activeRecordId, setActiveRecordId] = useState("");
  const fallbackRecordId =
    records.find((r) => r.is_current)?._id ?? records[0]?._id ?? "";
  const resolvedRecordId = records.some((r) => r._id === activeRecordId)
    ? activeRecordId
    : fallbackRecordId;
  const activeRecord = records.find((r) => r._id === resolvedRecordId);

  const recordSection = selected ? parsePlacementRecordSection(selected) : null;

  const previewRecords = useMemo(
    () => records.map((r) => toPreviewRecord(r, getPreview)),
    // `getPreview` reads a ref, so it is stable enough to leave out; the drafts
    // are what change as the editor types.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records],
  );

  // The gallery is one image block per academic year, and the preview shows
  // only the selected year's — so the block is created from the page rather
  // than hunted for in the inspector's block list, pre-titled with the year so
  // it matches on the public page (which pairs album to year by that title).
  const addGalleryBlock = useCallback(
    (year: string) => {
      if (!gallerySlug) return;
      const current = hostedDrafts[gallerySlug];
      if (!current) return;
      const blocks = current.blocks ?? [];
      const block = emptyContentBlock("gallery");
      const next = [...blocks, { ...block, title: year }];
      setHostedDraft(gallerySlug, { ...current, blocks: next });
      setSelected(hostedSectionKey(gallerySlug, `block:${next.length - 1}`));
    },
    [gallerySlug, hostedDrafts, setHostedDraft, setSelected],
  );

  const patchRecord = useCallback((next: AdminPlacementRecord) => {
    setRecords((prev) =>
      prev.map((r) =>
        r._id === next._id
          ? // Only one year can be the current one, same as the public page's
            // "latest results" panel assumes.
            next
          : next.is_current
            ? { ...r, is_current: false }
            : r,
      ),
    );
  }, []);

  // Adding and deleting a year hit the API immediately: the preview keys its
  // click targets off a record's id, so the document has to exist first.
  const addYear = async () => {
    setRecordBusy(true);
    try {
      const created = await createPlacementRecord(
        college,
        nextFreeYear(records),
      );
      setRecords((prev) => [...prev, created]);
      setLoadedRecords((prev) => [...prev, created]);
      setBaseline((prev) => {
        if (prev === null) return prev;
        const snap = JSON.parse(prev);
        return JSON.stringify({ ...snap, records: [...snap.records, created] });
      });
      setActiveRecordId(created._id);
      setSelected(placementRecordSection(created._id, "overview"));
      toast.success(`Added ${created.year}.`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not add the year",
      );
    } finally {
      setRecordBusy(false);
    }
  };

  const removeYear = async (record: AdminPlacementRecord) => {
    const ok = await confirm({
      title: `Delete ${record.year || "this year"}`,
      message:
        "This year's figures, recruiters and placed students will be permanently removed. Continue?",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setRecordBusy(true);
    try {
      await deletePlacementRecord(record._id);
      setRecords((prev) => prev.filter((r) => r._id !== record._id));
      setLoadedRecords((prev) => prev.filter((r) => r._id !== record._id));
      setBaseline((prev) => {
        if (prev === null) return prev;
        const snap = JSON.parse(prev);
        return JSON.stringify({
          ...snap,
          records: snap.records.filter(
            (r: AdminPlacementRecord) => r._id !== record._id,
          ),
        });
      });
      // The inspector was showing a year that no longer exists — fall back to
      // the year list rather than an empty panel.
      if (recordSection?.recordId === record._id)
        setSelected(PLACEMENT_RECORDS_SECTION);
      toast.success("Year deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete the year",
      );
    } finally {
      setRecordBusy(false);
    }
  };

  const historyColumns = resolveColumns(
    draft?.historyColumns,
    PLACEMENT_HISTORY_COLUMNS,
  );
  // The column list is page copy (draft / publish); an added column's values
  // live on each year's record, so deleting one clears it from every year.
  const changeHistoryColumns = (next: TableColumn[], deletedId?: string) => {
    setDraft((d) =>
      d
        ? {
            ...d,
            historyColumns: columnsToStore(
              d.historyColumns,
              next,
              PLACEMENT_HISTORY_COLUMNS,
            ),
          }
        : d,
    );
    if (deletedId)
      setRecords((prev) =>
        prev.map((r) => {
          if (!(deletedId in r.history_cells)) return r;
          const history_cells = { ...r.history_cells };
          delete history_cells[deletedId];
          return { ...r, history_cells };
        }),
      );
  };

  const inspectorTitle = (() => {
    if (!selected) return undefined;
    if (selected === PLACEMENT_RECORDS_SECTION) return "Placement Years";
    if (recordSection)
      return placementRecordInspectorTitle(activeRecord, recordSection.key);
    return (
      hostedInspectorTitle(selected, hostedDefs, hostedDrafts) ??
      PLACEMENT_SECTION_LABELS[selected as PlacementEditableSection] ??
      "Section"
    );
  })();

  const save = async (mode: SaveMode) => {
    setSaving(mode);
    setMsg(null);
    try {
      // Page copy, the hosted gallery and the year-wise records flush together:
      // `flush` drops any pending upload it cannot find in the value it is
      // handed, so splitting them would discard the others' images.
      const flushed = (await flush({
        host: draft,
        hosted: hostedDrafts,
        records,
      })) as {
        host: PlacementInfoValue;
        hosted: typeof hostedDrafts;
        records: AdminPlacementRecord[];
      };
      setDraft(flushed.host);
      setHostedDrafts(flushed.hosted);
      setRecords(flushed.records);
      await saveEditableConfig(configKey, flushed.host, mode);
      await saveHosted(flushed.hosted, mode);
      // Placement documents have no draft/publish split — they go live either
      // way, which the subtitle spells out.
      await savePlacementRecords(flushed.records, loadedRecords);
      setLoadedRecords(flushed.records);
      setBaseline(
        JSON.stringify({
          host: flushed.host,
          hosted: flushed.hosted,
          records: flushed.records,
        }),
      );
      setUnpublished(mode === "draft");
      setMsg({
        text:
          mode === "publish"
            ? "Published — the live page is updated"
            : "Draft saved — year-wise records are live already",
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

  const sections: WorkspaceSection[] = [
    {
      id: PLACEMENT_RECORDS_SECTION,
      label: "Placement Years",
      help: "Year-wise results: figures, recruiters and placed students for each academic year. These go live as soon as they are saved.",
    },
    ...(
      Object.keys(PLACEMENT_SECTION_LABELS) as PlacementEditableSection[]
    ).map((id) => ({
      id,
      label: PLACEMENT_SECTION_LABELS[id],
      help: SECTION_HELP[id],
    })),
    ...hostedDefs.map((def) => ({
      id: hostedSectionKey(def.slug, "hero"),
      label: def.host?.navLabel ?? def.label,
      help: def.description,
      group: "Tabs on this page",
    })),
  ];

  return (
    <EditorWorkspace
      // A college switch is a different page: drop the selection.
      key={college}
      title={`${label} — Placements Page`}
      description="Click any part of the page to edit it. The page text follows Save draft / Publish; year-wise records go live as soon as they are saved."
      publicHref={publicPath}
      loading={!ready && !loadError}
      error={loadError}
      sections={sections}
      selected={selected}
      onSelect={setSelected}
      panelTitle={inspectorTitle}
      preview={
        draft && (
          <PlacementsPageLayout
            institution={college}
            records={previewRecords}
            info={draft}
            gallery={gallerySlug ? hostedDrafts[gallerySlug] : null}
            gallerySlug={gallerySlug}
            onAddGalleryBlock={addGalleryBlock}
            selectedRecordId={resolvedRecordId}
            onSelectRecord={setActiveRecordId}
            editable
            onEditSection={selectSection}
          />
        )
      }
      panel={
        !selected || !draft ? null : selected === PLACEMENT_RECORDS_SECTION ? (
          <PlacementYearsInspector
            records={records}
            selectedId={resolvedRecordId}
            busy={recordBusy}
            onSelect={(id) => {
              setActiveRecordId(id);
              setSelected(placementRecordSection(id, "overview"));
            }}
            onAdd={() => void addYear()}
            onDelete={(r) => void removeYear(r)}
            historyColumns={historyColumns}
            onHistoryColumnsChange={changeHistoryColumns}
          />
        ) : recordSection ? (
          activeRecord ? (
            <PlacementRecordInspector
              record={activeRecord}
              sectionKey={recordSection.key}
              historyColumns={historyColumns}
              onChange={patchRecord}
            />
          ) : (
            <p className="text-sm text-gray-500">
              This year is no longer part of the page.
            </p>
          )
        ) : selected.startsWith("hosted:") ? (
          <HostedInspector
            sectionKey={selected}
            defs={hostedDefs}
            drafts={hostedDrafts}
            onChange={setHostedDraft}
            onSelectSection={setSelected}
          />
        ) : (
          <PlacementSectionInspector
            section={selected}
            data={draft}
            onChange={setDraft}
          />
        )
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

export default function PlacementsPageEditor() {
  return (
    <DeferredUploadsProvider>
      <Suspense fallback={null}>
        <PlacementsPageEditorInner />
      </Suspense>
    </DeferredUploadsProvider>
  );
}
