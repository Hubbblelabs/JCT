"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X, ExternalLink } from "lucide-react";
import { SaveButtons } from "@/components/admin/LivePageEditor";
import {
  loadEditableConfig,
  saveEditableConfig,
  type SaveMode,
} from "@/lib/admin-site-config";
import {
  CoePageLayout,
  COE_SECTION_LABELS,
  type CoeEditableSection,
} from "@/components/layout/CoePageLayout";
import { CoeSectionInspector } from "@/components/admin/CoeSectionInspector";
import { CoePageSchema } from "@/lib/validation";
import type { CoePageValue } from "@/lib/validation";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";

const CONFIG_KEY = "engineeringCoe";
const PREVIEW_URL = "/institutions/engineering/coe";

export default function CoeEditorPage() {
  return (
    <DeferredUploadsProvider>
      <CoeEditorInner />
    </DeferredUploadsProvider>
  );
}

function CoeEditorInner() {
  const router = useRouter();
  const { flush } = useDeferredUploads();

  const [draft, setDraft] = useState<CoePageValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<string>("hero");
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMsg(null);
    loadEditableConfig<CoePageValue>(CONFIG_KEY)
      .then((res) => {
        if (cancelled) return;
        // Key not yet seeded — open editor with schema defaults
        setDraft(res.value ?? (CoePageSchema.parse({}) as CoePageValue));
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[CoeEditor]", err);
          setMsg({ text: "Failed to load content", ok: false });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectSection = (s: string) => {
    setSelected(s);
    setInspectorOpen(true);
  };

  const inspectorTitle = (() => {
    if (selected.startsWith("custom:")) {
      const anchor = selected.slice("custom:".length);
      const item = (draft?.sidebar.navItems ?? []).find(
        (it) => (it.id || "") === anchor,
      );
      return item?.label?.trim() || "Custom Section";
    }
    return COE_SECTION_LABELS[selected as CoeEditableSection] ?? "Section";
  })();

  const save = async (mode: SaveMode) => {
    setSaving(mode);
    setMsg(null);
    try {
      const flushedDraft = await flush(draft);
      setDraft(flushedDraft as CoePageValue);
      await saveEditableConfig(CONFIG_KEY, flushedDraft, mode);
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
            <h1 className="admin-page-title">COE Page Editor</h1>
            <p className="admin-page-subtitle">
              Controller of Examinations — click any section to edit
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={PREVIEW_URL}
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
          <CoePageLayout data={draft!} editable onEditSection={selectSection} />
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
              <CoeSectionInspector
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
