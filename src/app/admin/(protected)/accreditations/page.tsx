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
  AccreditationsPageLayout,
  ACCREDITATIONS_SECTION_LABELS,
  type AccreditationsEditableSection,
} from "@/components/layout/AccreditationsPageLayout";
import { AccreditationsSectionInspector } from "@/components/admin/AccreditationsSectionInspector";
import { AccreditationsPageSchema } from "@/lib/validation";
import type { AccreditationsPageValue } from "@/lib/validation";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";

type Institution = "main" | "engineering" | "arts-science" | "polytechnic";

const INSTITUTION_MAP: Record<
  string,
  {
    institution: Institution;
    configKey: string;
    publicPath: string;
    label: string;
  }
> = {
  main: {
    institution: "main",
    configKey: "mainAccreditations",
    publicPath: "/accreditations",
    label: "JCT Institutions",
  },
  engineering: {
    institution: "engineering",
    configKey: "engineeringAccreditations",
    publicPath: "/institutions/engineering/accreditations",
    label: "Engineering",
  },
  "arts-science": {
    institution: "arts-science",
    configKey: "artsScienceAccreditations",
    publicPath: "/institutions/arts-science/accreditations",
    label: "Arts & Science",
  },
  polytechnic: {
    institution: "polytechnic",
    configKey: "polytechnicAccreditations",
    publicPath: "/institutions/polytechnic/accreditations",
    label: "Polytechnic",
  },
};

function getDefaultDraft(): AccreditationsPageValue {
  return AccreditationsPageSchema.parse({});
}

function AccreditationsEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { flush } = useDeferredUploads();

  const college = searchParams.get("college") ?? "engineering";
  const config = INSTITUTION_MAP[college] ?? INSTITUTION_MAP["engineering"];
  const { institution, configKey, publicPath, label } = config;

  const [draft, setDraft] = useState<AccreditationsPageValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [selected, setSelected] =
    useState<AccreditationsEditableSection>("hero");
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDraft(null);
    setMsg(null);
    loadEditableConfig<AccreditationsPageValue>(configKey)
      .then((res) => {
        if (cancelled) return;
        setDraft(res.value ?? getDefaultDraft());
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[AccreditationsEditor]", err);
          setMsg({ text: "Failed to load content", ok: false });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [configKey]);

  const selectSection = (s: AccreditationsEditableSection) => {
    setSelected(s);
    setInspectorOpen(true);
  };

  const save = async (mode: SaveMode) => {
    setSaving(mode);
    setMsg(null);
    try {
      const flushedDraft = await flush(draft);
      setDraft(flushedDraft as AccreditationsPageValue);
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
              {label} — Accreditations Page Editor
            </h1>
            <p className="admin-page-subtitle">
              Live CMS editor — click any section to edit
            </p>
          </div>
        </div>

        {/* No section quick-jump strip: the preview below is the navigation —
            clicking the section you want opens its inspector. */}
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
          <AccreditationsPageLayout
            data={draft}
            institution={institution}
            editable
            onEditSection={selectSection}
          />
        </div>
      )}

      {inspectorOpen && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-0 sm:p-4">
          <aside className="flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-3xl sm:rounded-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                  Inspector
                </p>
                <h2 className="mt-0.5 font-semibold text-gray-900">
                  {ACCREDITATIONS_SECTION_LABELS[selected]}
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
              <AccreditationsSectionInspector
                section={selected}
                data={draft}
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

export default function AccreditationsEditorPage() {
  return (
    <DeferredUploadsProvider>
      <Suspense fallback={null}>
        <AccreditationsEditorInner />
      </Suspense>
    </DeferredUploadsProvider>
  );
}
