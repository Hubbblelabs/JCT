"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { SaveButtons } from "@/components/admin/LivePageEditor";
import { InspectorOverlay } from "@/components/admin/InspectorOverlay";
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

function PlacementsPageEditorInner() {
  const router = useRouter();
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
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<string>("process");
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDraft(null);
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
        setRecords(placementRecords);
        setLoadedRecords(placementRecords);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[PlacementsPageEditor]", err);
          setMsg({ text: "Failed to load content", ok: false });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [configKey, college]);

  const selectSection = (s: string) => {
    setSelected(s);
    setInspectorOpen(true);
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

  const recordSection = parsePlacementRecordSection(selected);

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
      setInspectorOpen(true);
    },
    [gallerySlug, hostedDrafts, setHostedDraft],
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

  const inspectorTitle = (() => {
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
            <h1 className="admin-page-title">
              {label} — Placements Page Editor
            </h1>
            <p className="admin-page-subtitle">
              Live CMS editor — click any section to edit. Year-wise records go
              live as soon as they are saved; the page copy follows the usual
              draft/publish split.
            </p>
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
          <SaveButtons saving={saving} disabled={loading} onSave={save} />
        </div>
      </div>

      {loading || hostedLoading || !draft ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="-mx-6 -mb-6 overflow-hidden border-t border-gray-200 bg-white xl:mx-0 xl:rounded-xl xl:border">
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
        </div>
      )}

      {inspectorOpen && (
        <InspectorOverlay
          title={inspectorTitle}
          onClose={() => setInspectorOpen(false)}
          footer={<SaveButtons saving={saving} onSave={save} full />}
        >
          {selected === PLACEMENT_RECORDS_SECTION ? (
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
            />
          ) : recordSection ? (
            activeRecord ? (
              <PlacementRecordInspector
                record={activeRecord}
                sectionKey={recordSection.key}
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
              data={draft!}
              onChange={setDraft}
            />
          )}
        </InspectorOverlay>
      )}
    </div>
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
