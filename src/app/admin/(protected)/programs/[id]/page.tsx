"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  PROGRAM_CONTENT_SECTION_LABELS,
  ProgramSectionInspector,
  type ProgramContentSection,
} from "@/components/admin/ProgramContentEditor";
import { ProgramPageLayout } from "@/components/layout/ProgramPageLayout";
import {
  normalizeProgramData,
  withProgramCardFields,
} from "@/lib/normalize-program-data";
import { Trash2, EyeOff, ArrowLeft, Loader2, Check } from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import {
  EditorSaveBar,
  EditorWorkspace,
  type WorkspaceSection,
} from "@/components/admin/kit";
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
  accreditations: { name: string; logo: string }[];
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
  accreditations: [],
  is_active: true,
  sort_order: 0,
};

/** The sections of a program page, grouped by the tab they appear on. */
const SECTION_GROUPS: {
  group: string;
  tab?: string;
  ids: ProgramContentSection[];
}[] = [
  { group: "Top of the page", ids: ["hero", "stats"] },
  {
    group: "Overview tab",
    tab: "overview",
    ids: ["about", "hod", "visionMission", "programOutcomes"],
  },
  {
    group: "Academics tab",
    tab: "academics",
    ids: ["curriculum", "teachingLearning", "valueAddedCourses"],
  },
  {
    group: "Faculty tab",
    tab: "faculty",
    ids: ["faculty", "advisoryBoard", "pac", "bos"],
  },
  { group: "Facilities tab", tab: "facilities", ids: ["labs", "library"] },
  {
    group: "Student life tab",
    tab: "life",
    ids: [
      "events",
      "studentAchievements",
      "facultyAchievements",
      "magazine",
      "participation",
    ],
  },
  {
    group: "Career tab",
    tab: "career",
    ids: ["careerProgression", "feedback"],
  },
  { group: "Page settings", ids: ["tabs", "seo"] },
];

const SECTION_HELP: Partial<Record<ProgramContentSection, string>> = {
  hero: "The banner at the top: program name, photo and the key facts strip. Also the program card shown on the college pages.",
  stats: "The row of quick numbers under the banner.",
  tabs: "The tabs down the side of the page: rename, reorder or hide them, and add tabs of your own or links to other pages.",
  seo: "The title and description Google shows for this program. Not visible on the page itself.",
};

/** Which tab a section lives on, so the preview can switch to it. */
function tabForSection(section: string): string | undefined {
  if (section.startsWith("tab:")) return section.slice("tab:".length);
  return SECTION_GROUPS.find((g) =>
    g.ids.includes(section as ProgramContentSection),
  )?.tab;
}

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
  const [selectedSection, setSelectedSection] = useState<string | null>(
    selectedFromUrl && selectedFromUrl in PROGRAM_CONTENT_SECTION_LABELS
      ? selectedFromUrl
      : // A new program starts on Hero, which holds its name and slug.
        isNew
        ? "hero"
        : null,
  );
  /** The saved `{prog, content}` the editor compares against. */
  const [baseline, setBaseline] = useState<string | null>(null);

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
      const loadedProg = {
        ...EMPTY_PROG,
        ...(pRest as unknown as ProgramFields),
      };
      const loadedContent = (c as Record<string, unknown>) ?? {};
      setProg(loadedProg);
      setContent(loadedContent);
      setBaseline(JSON.stringify({ prog: loadedProg, content: loadedContent }));
      setStatus(typeof st === "string" ? st : "draft");
      setLoading(false);
    })();
  }, [id, isNew]);

  // ── Live-preview data (raw content → normalized ProgramData) ───────────────
  const previewData = useMemo(() => {
    const merged = withProgramCardFields(
      {
        ...content,
        name: prog.name || (content.name as string) || "",
        shortName: prog.abbr || "",
        college: prog.institution || "",
      },
      { degree: prog.degree, duration: prog.duration, seats: prog.seats },
    );
    return normalizeProgramData(merged, prog.slug || "preview");
  }, [content, prog]);

  // ── URL helpers ────────────────────────────────────────────────────────────
  const setParam = (patch: Record<string, string>) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [k, v] of Object.entries(patch)) params.set(k, v);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const selectSection = (section: string | null) => {
    setSelectedSection(section);
    if (section) setParam({ section });
  };

  const current = JSON.stringify({ prog, content });
  // A new program has nothing saved: anything typed is unsaved.
  const savedState =
    baseline ??
    JSON.stringify({
      prog: { ...EMPTY_PROG, institution: urlCollege },
      content: {},
    });
  const dirty = current !== savedState;

  const inspectorTitle = !selectedSection
    ? undefined
    : selectedSection.startsWith("tab:")
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

  /** Returns whether the write landed — "Save & Publish" needs to know. */
  const save = async (): Promise<boolean> => {
    setSaving(true);
    setMsg(null);
    setApiError(null);

    try {
      const flushedPayload = await flush({ ...prog, content });
      const { content: flushedContent, ...flushedProg } = flushedPayload as {
        content: unknown;
        [k: string]: unknown;
      };

      // Adopt the flushed value as the new editor state. `flush` uploads each
      // pending pick, revokes its blob: URL and forgets the placeholder, so
      // state left holding `pending:` keys is state pointing at nothing: the
      // field renders "No preview" under a stuck "Pending" badge, and — worse —
      // the next save re-flushes a placeholder the queue no longer knows about,
      // which passes through unreplaced and overwrites the real storage key in
      // the database with a dead `pending:` string.
      setProg((f) => ({ ...f, ...(flushedProg as Partial<ProgramFields>) }));
      setContent(flushedContent as Record<string, unknown>);

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
          return false;
        }
        const data = await r.json();
        router.replace(
          `/admin/programs/${data._id}?college=${prog.institution}`,
        );
        return true;
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
        return false;
      }

      setStatus("draft");
      setBaseline(
        JSON.stringify({
          prog: { ...prog, ...(flushedProg as Partial<ProgramFields>) },
          content: flushedContent,
        }),
      );
      setMsg({ text: "Draft saved — not on the live site yet", ok: true });
      return true;
    } catch (err) {
      setMsg({
        text: err instanceof Error ? err.message : "Save failed",
        ok: false,
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  /** Save first, then publish — publishing a stale draft was too easy to do. */
  const publish = async () => {
    if (isNew) return;
    if (!(await save())) return;
    setPublishing(true);
    setMsg(null);
    setApiError(null);
    try {
      const r = await fetch(`/api/admin/programs/${id}/publish`, {
        method: "POST",
      });
      if (r.ok) {
        setStatus("published");
        setMsg({ text: "Published — the live page is updated", ok: true });
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

  const customTabs = (
    Array.isArray(content.tabsConfig)
      ? (content.tabsConfig as Array<Record<string, unknown>>)
      : []
  ).filter((t) => Array.isArray(t.blocks));

  const sections: WorkspaceSection[] = [
    ...SECTION_GROUPS.flatMap(({ group, ids }) =>
      ids.map((id) => ({
        id,
        label: PROGRAM_CONTENT_SECTION_LABELS[id],
        help: SECTION_HELP[id],
        group,
      })),
    ),
    ...customTabs.map((t) => ({
      id: `tab:${t.id as string}`,
      label: ((t.label as string) || "").trim() || "Custom Tab",
      help: "A tab of your own, built from content blocks.",
      group: "Your custom tabs",
    })),
  ];

  const collegeLabel =
    (isNew ? urlCollege : prog.institution) === "arts-science"
      ? "Arts & Science"
      : (isNew ? urlCollege : prog.institution) === "polytechnic"
        ? "Polytechnic"
        : "Engineering";

  return (
    <EditorWorkspace
      title={isNew ? "New Program" : `${prog.name || "Program"} — Program Page`}
      description={
        isNew
          ? `A new ${collegeLabel} program. Fill in the name and save it as a draft — you can publish it once it has been created.`
          : `${collegeLabel} · ${prog.is_active ? "Shown on the site" : "Hidden from the site"}. Click any part of the page to edit it.`
      }
      publicHref={
        !isNew && prog.slug
          ? `/institutions/${prog.institution}/programs/${prog.slug}`
          : undefined
      }
      unpublished={!isNew && status !== "published"}
      loading={loading}
      headerExtra={
        <>
          <button
            onClick={() => router.push(backHref)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <ArrowLeft size={14} /> All programs
          </button>
          {!isNew && prog.is_active && (
            <button
              onClick={deactivate}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <EyeOff size={14} /> Hide from site
            </button>
          )}
          {!isNew && !prog.is_active && (
            <button
              onClick={activate}
              className="admin-btn admin-btn-green admin-btn-sm"
            >
              <Check size={14} /> Show on site
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
              Delete
            </button>
          )}
        </>
      }
      banner={
        apiError && (
          <ValidationErrors
            error={apiError.message ?? apiError.error}
            details={apiError.details}
          />
        )
      }
      sections={sections}
      selected={selectedSection}
      onSelect={selectSection}
      panelTitle={inspectorTitle}
      preview={
        previewData ? (
          <ProgramPageLayout
            key={`${prog.slug || "new"}-builder`}
            dept={previewData}
            backHref={backHref}
            backLabel="Back"
            editable
            focusTab={
              selectedSection ? tabForSection(selectedSection) : undefined
            }
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
          <div className="px-6 py-16 text-center text-sm text-gray-400">
            Enter the program name in the panel to see the page.
          </div>
        )
      }
      panel={
        selectedSection && (
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
              accreditations: prog.accreditations ?? [],
            }}
            onProgramCardChange={(patch) =>
              setProg((f) => ({ ...f, ...patch }))
            }
          />
        )
      }
      saveBar={
        <EditorSaveBar
          dirty={dirty}
          saving={saving ? "draft" : publishing ? "publish" : null}
          unpublished={!isNew && status !== "published"}
          message={msg}
          disabled={loading}
          onSaveDraft={() => void save()}
          onPublish={isNew ? undefined : () => void publish()}
          onDiscard={
            isNew || baseline === null
              ? undefined
              : () => {
                  const snap = JSON.parse(baseline) as {
                    prog: ProgramFields;
                    content: Record<string, unknown>;
                  };
                  setProg(snap.prog);
                  setContent(snap.content);
                }
          }
        />
      }
    />
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
