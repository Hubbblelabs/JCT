"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, X, ExternalLink } from "lucide-react";
import { SaveButtons } from "@/components/admin/LivePageEditor";
import {
  loadEditableConfig,
  saveEditableConfig,
  type SaveMode,
} from "@/lib/admin-site-config";
import {
  PlacementsPageLayout,
  PLACEMENT_SECTION_LABELS,
  type PlacementEditableSection,
} from "@/components/layout/PlacementsPageLayout";
import { PlacementSectionInspector } from "@/components/admin/PlacementSectionInspector";
import { PlacementInfoSchema } from "@/lib/validation";
import type { PlacementInfoValue } from "@/lib/validation";
import type { PublicPlacement } from "@/lib/public-placements";
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
  const { flush } = useDeferredUploads();

  const raw = searchParams.get("college") ?? "engineering";
  const college: College =
    raw === "arts-science" || raw === "polytechnic" ? raw : "engineering";
  const { configKey, label } = COLLEGES[college];
  const publicPath = `/institutions/${college}/placements`;

  const [draft, setDraft] = useState<PlacementInfoValue | null>(null);
  // Year-wise records are read-only here (they're edited under /admin/placements)
  // but the preview needs them so the sidebar's year list and the data sections
  // look exactly like the live page.
  const [records, setRecords] = useState<PublicPlacement[]>([]);
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
      fetch(`/api/public/placements?institution=${college}`)
        .then((r) => r.json())
        .catch(() => null),
    ])
      .then(([configRes, placementsRes]) => {
        if (cancelled) return;
        // Parse through the schema so a partially-filled stored value still
        // arrives fully shaped — every inspector field reads `data.x.y`.
        const parsed = PlacementInfoSchema.safeParse(configRes?.value ?? {});
        setDraft(parsed.success ? parsed.data : PlacementInfoSchema.parse({}));
        const list = placementsRes?.data;
        setRecords(Array.isArray(list) ? (list as PublicPlacement[]) : []);
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

  const inspectorTitle =
    PLACEMENT_SECTION_LABELS[selected as PlacementEditableSection] ?? "Section";

  const save = async (mode: SaveMode) => {
    setSaving(mode);
    setMsg(null);
    try {
      const flushedDraft = await flush(draft);
      setDraft(flushedDraft as PlacementInfoValue);
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
              Live CMS editor — click any section to edit. Year-wise numbers,
              recruiters and placed students are managed under Placements.
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

      {loading || !draft ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="-mx-6 -mb-6 overflow-hidden border-t border-gray-200 bg-white xl:mx-0 xl:rounded-xl xl:border">
          <PlacementsPageLayout
            institution={college}
            records={records}
            info={draft}
            editable
            onEditSection={selectSection}
          />
        </div>
      )}

      {inspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-0 sm:p-4">
          <aside className="flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-3xl sm:rounded-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                  Inspector
                </p>
                <h2 className="mt-0.5 font-semibold text-gray-900">
                  {inspectorTitle}
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
              <PlacementSectionInspector
                section={selected}
                data={draft!}
                onChange={setDraft}
              />
            </div>
            <div className="sticky bottom-0 mt-auto border-t border-gray-100 bg-white px-6 py-3">
              <SaveButtons saving={saving} onSave={save} full />
            </div>
          </aside>
        </div>
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
