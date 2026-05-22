"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, X, ExternalLink } from "lucide-react";
import {
  AboutPageLayout,
  ABOUT_SECTION_LABELS,
  type AboutEditableSection,
} from "@/components/layout/AboutPageLayout";
import { AboutSectionInspector } from "@/components/admin/AboutSectionInspector";
import {
  ABOUT_CONFIG_KEY,
  ABOUT_DEFAULTS,
  type AboutPageValue,
  type Institution,
} from "@/data/about-content";

function AboutEditorInner() {
  const router = useRouter();
  const institution: Institution = "engineering";

  const [draft, setDraft] = useState<AboutPageValue>(
    ABOUT_DEFAULTS[institution],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<AboutEditableSection>("hero");
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMsg(null);
    fetch(`/api/public/site-config?key=${ABOUT_CONFIG_KEY[institution]}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.data && typeof res.data === "object") {
          setDraft({ ...ABOUT_DEFAULTS[institution], ...res.data });
        } else {
          setDraft(ABOUT_DEFAULTS[institution]);
        }
      })
      .catch(() => {
        if (!cancelled) setDraft(ABOUT_DEFAULTS[institution]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [institution]);

  const selectSection = (s: AboutEditableSection) => {
    setSelected(s);
    setInspectorOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config_key: ABOUT_CONFIG_KEY[institution],
          value: draft,
        }),
      });
      if (r.ok) {
        setMsg({ text: "Saved & published", ok: true });
      } else {
        const e = await r.json().catch(() => null);
        setMsg({
          text: e?.message ?? e?.error ?? "Save failed",
          ok: false,
        });
      }
    } catch {
      setMsg({ text: "Save failed", ok: false });
    } finally {
      setSaving(false);
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
            <h1 className="admin-page-title">About Page Editor</h1>
            <p className="admin-page-subtitle">
              Live CMS editor — click any section to edit
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/institutions/engineering/about"
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
          <button
            onClick={save}
            disabled={saving || loading}
            className="admin-btn admin-btn-primary"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-28">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="-mx-6 -mb-6 overflow-hidden border-t border-gray-200 bg-white xl:mx-0 xl:rounded-xl xl:border">
          <AboutPageLayout
            data={draft}
            institution={institution}
            editable
            onEditSection={selectSection}
          />
        </div>
      )}

      {inspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-0 sm:p-4">
          <aside className="flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-md sm:rounded-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                  Inspector
                </p>
                <h2 className="mt-0.5 font-semibold text-gray-900">
                  {ABOUT_SECTION_LABELS[selected]}
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
              <AboutSectionInspector
                section={selected}
                data={draft}
                onChange={setDraft}
              />
            </div>
            <div className="sticky bottom-0 mt-auto border-t border-gray-100 bg-white px-6 py-3">
              <button
                onClick={save}
                disabled={saving}
                className="admin-btn admin-btn-primary w-full justify-center"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {saving ? "Saving…" : "Save & Publish"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function AboutEditorPage() {
  return (
    <Suspense fallback={null}>
      <AboutEditorInner />
    </Suspense>
  );
}
