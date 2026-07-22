"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { TextInput, ImageUploadInput } from "@/components/admin/inputs";
import {
  PROGRAM_CONTENT_SECTION_LABELS,
  ProgramSectionInspector,
  type ProgramContentSection,
} from "@/components/admin/ProgramContentEditor";
import { ProgramPageLayout } from "@/components/layout/ProgramPageLayout";
import { normalizeProgramData } from "@/lib/normalize-program-data";
import {
  Send,
  Trash2,
  EyeOff,
  ArrowLeft,
  Loader2,
  Check,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface ProgramFields {
  name: string;
  abbr: string;
  slug: string;
  institution: string;
  degree: string;
  duration: string;
  seats: number;
  highlight: string;
  description: string;
  image: string;
  outcomes: string[];
  is_active: boolean;
  sort_order: number;
}

const EMPTY_PROG: ProgramFields = {
  name: "",
  abbr: "",
  slug: "",
  institution: "engineering",
  degree: "",
  duration: "",
  seats: 0,
  highlight: "",
  description: "",
  image: "",
  outcomes: [],
  is_active: true,
  sort_order: 0,
};

function ProgramDetailInner() {
  const { flush } = useDeferredUploads();
  const toast = useToast();
  const confirm = useConfirm();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = id === "new";
  const urlCollege = searchParams.get("college") ?? "engineering";
  const selectedFromUrl = searchParams.get(
    "section",
  ) as ProgramContentSection | null;

  const [prog, setProg] = useState<ProgramFields>({
    ...EMPTY_PROG,
    institution: isNew ? urlCollege : "engineering",
  });
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [status, setStatus] = useState<string>("draft");
  const [selectedSection, setSelectedSection] = useState<string>(
    selectedFromUrl && selectedFromUrl in PROGRAM_CONTENT_SECTION_LABELS
      ? selectedFromUrl
      : "hero",
  );

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const pRes = await fetch(`/api/admin/programs/${id}`);
      const pData = (await pRes.json()) as Record<string, unknown>;

      const { _id, content: c, status: st, ...pRest } = pData;
      void _id;
      setProg({ ...EMPTY_PROG, ...(pRest as unknown as ProgramFields) });
      setContent((c as Record<string, unknown>) ?? {});
      setStatus(typeof st === "string" ? st : "draft");
      setLoading(false);
    })();
  }, [id, isNew]);

  // ── Live-preview data (raw content → normalized ProgramData) ───────────────
  const previewData = useMemo(() => {
    const merged = {
      ...content,
      name: prog.name || (content.name as string) || "",
      shortName: prog.abbr || "",
      college: prog.institution || "",
    };
    return normalizeProgramData(merged, prog.slug || "preview");
  }, [content, prog]);

  // ── URL helpers ────────────────────────────────────────────────────────────
  const setParam = (patch: Record<string, string>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [k, v] of Object.entries(patch)) params.set(k, v);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const selectSection = (section: string) => {
    setSelectedSection(section);
    setParam({ section });
    setIsInspectorOpen(true);
  };

  const inspectorTitle = selectedSection.startsWith("tab:")
    ? (() => {
        const tabId = selectedSection.slice("tab:".length);
        const tabs = Array.isArray(content.tabsConfig)
          ? (content.tabsConfig as Array<Record<string, unknown>>)
          : [];
        const t = tabs.find((it) => (it.id as string) === tabId);
        return (t?.label as string)?.trim() || "Custom Tab";
      })()
    : (PROGRAM_CONTENT_SECTION_LABELS[
        selectedSection as ProgramContentSection
      ] ?? "Section");

  const save = async () => {
    setSaving(true);
    setMsg(null);
    setApiError(null);

    try {
      const flushedPayload = await flush({ ...prog, content });
      const { content: flushedContent, ...flushedProg } = flushedPayload as {
        content: unknown;
        [k: string]: unknown;
      };

      if (isNew) {
        const r = await fetch("/api/admin/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...flushedProg, content: flushedContent }),
        });
        if (!r.ok) {
          const err = await parseApiError(r);
          setApiError(err);
          setMsg({
            text: err?.message ?? err?.error ?? "Error creating program",
            ok: false,
          });
          return;
        }
        const data = await r.json();
        router.replace(
          `/admin/programs/${data._id}?college=${prog.institution}`,
        );
        return;
      }

      const pRes = await fetch(`/api/admin/programs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...flushedProg,
          content: flushedContent,
          status: "draft",
        }),
      });
      if (!pRes.ok) {
        const err = await parseApiError(pRes);
        setApiError(err);
        setMsg({
          text: err?.message ?? err?.error ?? "Error saving program",
          ok: false,
        });
        return;
      }

      setStatus("draft");
      setMsg({ text: "Draft saved successfully", ok: true });
    } catch (err) {
      setMsg({
        text: err instanceof Error ? err.message : "Save failed",
        ok: false,
      });
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (isNew) return;
    setPublishing(true);
    setMsg(null);
    setApiError(null);
    try {
      const r = await fetch(`/api/admin/programs/${id}/publish`, {
        method: "POST",
      });
      if (r.ok) {
        setStatus("published");
        setMsg({ text: "Published successfully", ok: true });
      } else {
        const err = await parseApiError(r);
        setApiError(err);
        setMsg({
          text: err?.message ?? err?.error ?? "Error publishing",
          ok: false,
        });
      }
    } finally {
      setPublishing(false);
    }
  };

  const deactivate = async () => {
    const ok = await confirm({
      title: "Deactivate program",
      message: "It will be hidden from the public site. Continue?",
      confirmLabel: "Deactivate",
      destructive: true,
    });
    if (!ok) return;
    await fetch(`/api/admin/programs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: false }),
    });
    toast.success("Program deactivated.");
    router.push(`/admin/programs?college=${prog.institution}`);
  };

  const activate = async () => {
    const ok = await confirm({
      title: "Activate program",
      message: "Make this program active (as a draft)?",
      confirmLabel: "Activate",
    });
    if (!ok) return;
    await fetch(`/api/admin/programs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: true, status: "draft" }),
    });
    router.push(`/admin/programs?college=${prog.institution}`);
  };

  const remove = async () => {
    const ok = await confirm({
      title: "Delete program",
      message: `Permanently delete "${prog.name || "this program"}"? This removes it completely and cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    setMsg(null);
    try {
      const r = await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
      if (r.ok) {
        router.push(`/admin/programs?college=${prog.institution}`);
      } else {
        const err = await parseApiError(r);
        setMsg({
          text: err?.message ?? err?.error ?? "Error deleting program",
          ok: false,
        });
        setDeleting(false);
      }
    } catch {
      setMsg({ text: "Error deleting program", ok: false });
      setDeleting(false);
    }
  };

  const setP = (k: keyof ProgramFields, v: unknown) =>
    setProg((f) => ({ ...f, [k]: v }));
  const backHref = `/admin/programs?college=${isNew ? urlCollege : prog.institution}`;

  if (loading) {
    return (
      <div className="admin-content flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(backHref)}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="admin-page-title">
              {isNew ? "New Program" : prog.name || id}
            </h1>
            {!isNew && (
              <p className="admin-page-subtitle">
                {prog.institution === "arts-science"
                  ? "Arts & Science"
                  : prog.institution}
              </p>
            )}
          </div>
          {!isNew && (
            <span
              className={`admin-badge ${
                status === "published"
                  ? "admin-badge-green"
                  : "admin-badge-yellow"
              }`}
            >
              {status}
            </span>
          )}
          {!isNew && (
            <span
              className={`admin-badge ${
                prog.is_active ? "admin-badge-green" : "admin-badge-red"
              }`}
            >
              {prog.is_active ? "Active" : "Inactive"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {msg && (
            <span
              className={`text-sm font-medium ${
                msg.ok ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg.text}
            </span>
          )}

          {/* SEO edits the page's <head>, so there is nothing in the preview
              to click — it needs its own way into the inspector. */}
          {!isNew && (
            <button
              onClick={() => selectSection("seo")}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Search size={14} /> SEO
            </button>
          )}
          {!isNew && prog.slug && (
            <a
              href={`/institutions/${prog.institution}/programs/${prog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <ExternalLink size={14} /> Public Page
            </a>
          )}
          {!isNew && prog.is_active && (
            <button
              onClick={deactivate}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <EyeOff size={14} /> Deactivate
            </button>
          )}
          {!isNew && !prog.is_active && (
            <button
              onClick={activate}
              className="admin-btn admin-btn-green admin-btn-sm"
            >
              <Check size={14} /> Activate
            </button>
          )}
          {!isNew && (
            <button
              onClick={remove}
              disabled={deleting}
              className="admin-btn admin-btn-danger admin-btn-sm"
            >
              {deleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            {saving ? "Saving…" : isNew ? "Create Program" : "Save Draft"}
          </button>
          {!isNew && (
            <button
              onClick={publish}
              disabled={publishing}
              className="admin-btn admin-btn-gold"
            >
              {publishing ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {publishing ? "Publishing…" : "Publish"}
            </button>
          )}
        </div>
      </div>

      {apiError && (
        <ValidationErrors
          error={apiError.message ?? apiError.error}
          details={apiError.details}
        />
      )}

      <div>
        <div className="-mx-6 -mb-6 overflow-hidden rounded-t-xl border-t border-gray-200 bg-white xl:mx-0 xl:rounded-xl xl:border">
          {previewData ? (
            <ProgramPageLayout
              key={`${prog.slug || "new"}-builder`}
              dept={previewData}
              backHref={backHref}
              backLabel="Back"
              editable
              onEditSection={selectSection}
              onEditTab={(tabId) => {
                const defaults: Record<string, ProgramContentSection> = {
                  overview: "about",
                  academics: "curriculum",
                  faculty: "faculty",
                  facilities: "labs",
                  life: "events",
                  career: "careerProgression",
                };
                // Built-in tabs map to their default section; custom content
                // tabs open their own block editor (tab:<id>).
                selectSection(defaults[tabId] ?? `tab:${tabId}`);
              }}
            />
          ) : (
            <div className="px-6 py-28 text-sm text-gray-400">
              <div className="mx-auto max-w-md space-y-4 text-left">
                <h3 className="mb-6 text-xl font-bold text-gray-900">
                  Create New Program
                </h3>
                <TextInput
                  label="Program Name"
                  value={prog.name}
                  onChange={(e) => setP("name", e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  required
                />
                <TextInput
                  label="Abbreviation / Short Name"
                  value={prog.abbr}
                  onChange={(e) => setP("abbr", e.target.value)}
                  placeholder="e.g. AI"
                  required
                />
                <TextInput
                  label="Slug"
                  value={prog.slug}
                  onChange={(e) => setP("slug", e.target.value)}
                  placeholder="e.g. artificial-intelligence"
                  required
                />
                <ImageUploadInput
                  label="Program Photo"
                  value={prog.image}
                  onChange={(v) => setP("image", v)}
                  hideUrlField
                />
              </div>
            </div>
          )}
        </div>

        {isInspectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-0 sm:p-4">
            <aside className="flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-md sm:rounded-xl">
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
                  onClick={() => setIsInspectorOpen(false)}
                  className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
                >
                  <X size={14} />
                  <span className="sr-only">Close Settings</span>
                </button>
              </div>
              <div className="p-6">
                <ProgramSectionInspector
                  section={selectedSection}
                  content={content}
                  onChange={setContent}
                  programName={prog.name}
                  onProgramNameChange={(name) => setP("name", name)}
                  programAbbr={prog.abbr}
                  onProgramAbbrChange={(abbr) => setP("abbr", abbr)}
                  programSlug={prog.slug}
                  onProgramSlugChange={(slug) => setP("slug", slug)}
                  programCollege={prog.institution}
                  programCard={{
                    degree: prog.degree,
                    duration: prog.duration,
                    seats: prog.seats,
                    highlight: prog.highlight,
                    description: prog.description,
                  }}
                  onProgramCardChange={(patch) =>
                    setProg((f) => ({ ...f, ...patch }))
                  }
                />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProgramDetailPage() {
  return (
    <DeferredUploadsProvider>
      <Suspense fallback={null}>
        <ProgramDetailInner />
      </Suspense>
    </DeferredUploadsProvider>
  );
}
