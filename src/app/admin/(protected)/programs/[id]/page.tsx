"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  TextInput,
  NumberInput,
  TextArea,
  StringList,
  Accordion,
  ImageUploadInput,
} from "@/components/admin/inputs";
import {
  PROGRAM_CONTENT_SECTION_LABELS,
  ProgramContentEditor,
  ProgramSectionInspector,
  type ProgramContentSection,
} from "@/components/admin/ProgramContentEditor";
import { ProgramPageLayout } from "@/components/layout/ProgramPageLayout";
import { normalizeProgramData } from "@/lib/normalize-program-data";
import {
  Send,
  Trash2,
  ArrowLeft,
  Loader2,
  Check,
  ExternalLink,
  X,
} from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";

interface ProgramFields {
  name: string;
  abbr: string;
  slug: string;
  institution: string;
  degree: string;
  duration: string;
  seats: number;
  image: string;
  highlight: string;
  description: string;
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
  seats: 60,
  image: "",
  highlight: "",
  description: "",
  outcomes: [],
  is_active: true,
  sort_order: 0,
};

function ProgramDetailInner() {
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
  const [selectedSection, setSelectedSection] = useState<ProgramContentSection>(
    selectedFromUrl && selectedFromUrl in PROGRAM_CONTENT_SECTION_LABELS
      ? selectedFromUrl
      : "hero",
  );

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
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
      name: (content.name as string) || prog.name,
      shortName: (content.shortName as string) || prog.abbr,
      college: (content.college as string) || prog.institution,
    };
    return normalizeProgramData(merged, prog.slug || "preview");
  }, [content, prog]);

  // ── URL helpers ────────────────────────────────────────────────────────────
  const setParam = (patch: Record<string, string>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [k, v] of Object.entries(patch)) params.set(k, v);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const selectSection = (section: ProgramContentSection) => {
    setSelectedSection(section);
    setParam({ section });
    setIsInspectorOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    setApiError(null);

    try {
      if (isNew) {
        const r = await fetch("/api/admin/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...prog, content }),
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
        body: JSON.stringify({ ...prog, content, status: "draft" }),
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
    if (!confirm("Deactivate this program?")) return;
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
    router.push(`/admin/programs?college=${prog.institution}`);
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
                {prog.institution} · {prog.degree}
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

          {!isNew && prog.slug && (
            <a
              href={`/institutions/engineering/programs/${prog.slug}`}
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
              className="admin-btn admin-btn-danger admin-btn-sm"
            >
              <Trash2 size={14} /> Deactivate
            </button>
          )}
          {!isNew && (
            <button
              onClick={() => setIsInspectorOpen(true)}
              className="admin-btn admin-btn-outline"
            >
              Edit Settings
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
                selectSection(defaults[tabId] ?? "hero");
              }}
            />
          ) : (
            <div className="py-28 text-center text-sm text-gray-400">
              Add a program name to start the live builder preview.
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
                    {PROGRAM_CONTENT_SECTION_LABELS[selectedSection]}
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
                />

                <Accordion title="Program Basics">
                  <div className="grid grid-cols-1 gap-3">
                    <TextInput
                      label="Program Name"
                      value={prog.name}
                      onChange={(e) => setP("name", e.target.value)}
                      required
                    />
                    <TextInput
                      label="Abbreviation"
                      value={prog.abbr}
                      onChange={(e) => setP("abbr", e.target.value)}
                      placeholder="CSE"
                      required
                    />
                    <TextInput
                      label="Slug"
                      value={prog.slug}
                      onChange={(e) => setP("slug", e.target.value)}
                      placeholder="cse"
                      required
                    />
                    <TextInput
                      label="Degree"
                      value={prog.degree}
                      onChange={(e) => setP("degree", e.target.value)}
                      placeholder="B.E."
                    />
                    <TextInput
                      label="Duration"
                      value={prog.duration}
                      onChange={(e) => setP("duration", e.target.value)}
                      placeholder="4 Years"
                    />
                    <NumberInput
                      label="Seats"
                      value={prog.seats}
                      min={0}
                      onChange={(e) =>
                        setP("seats", parseInt(e.target.value) || 0)
                      }
                    />
                    <TextInput
                      label="Highlight"
                      value={prog.highlight}
                      onChange={(e) => setP("highlight", e.target.value)}
                    />
                    <NumberInput
                      label="Sort Order"
                      value={prog.sort_order}
                      onChange={(e) =>
                        setP("sort_order", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <TextArea
                    label="Description"
                    value={prog.description}
                    onChange={(e) => setP("description", e.target.value)}
                    rows={3}
                  />
                  <StringList
                    label="Outcomes (card-level bullets)"
                    values={prog.outcomes}
                    onChange={(v) => setP("outcomes", v)}
                  />
                  <ImageUploadInput
                    label="Program Image"
                    value={prog.image}
                    onChange={(url) => setP("image", url)}
                    uploadOnly
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={prog.is_active}
                      onChange={(e) => setP("is_active", e.target.checked)}
                    />
                    <label
                      htmlFor="is_active"
                      className="text-sm text-gray-700"
                    >
                      Active (show on public site)
                    </label>
                  </div>
                </Accordion>

                <Accordion title="Advanced full editor / raw JSON">
                  <ProgramContentEditor
                    content={content}
                    onChange={setContent}
                    slug={prog.slug}
                    college={prog.institution}
                  />
                </Accordion>
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
    <Suspense fallback={null}>
      <ProgramDetailInner />
    </Suspense>
  );
}
