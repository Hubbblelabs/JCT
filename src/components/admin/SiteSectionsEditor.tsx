"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Info } from "lucide-react";
import { EditableRegion } from "@/components/admin/EditableRegion";
import {
  EditorSaveBar,
  EditorWorkspace,
  type WorkspaceSection,
} from "@/components/admin/kit";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import { FixedInstitutionProvider } from "@/contexts/InstitutionContext";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { saveEditableConfig, type SaveMode } from "@/lib/admin-site-config";

/** Read/write access to the drafts, handed to a section's form. */
export type SectionIO = {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
};

/**
 * One section of a page built from site-config keys (a landing page, the
 * global footer…). A section can edit config keys through a form, embed a
 * manager that saves on its own (testimonials), point at the screen where its
 * content really lives (programs, events), or any mix of those.
 */
export type SiteSectionDef = {
  id: string;
  label: string;
  /** One sentence: what this section is and where it shows on the site. */
  help: string;
  group?: string;
  /** The config keys the form edits, with what to start from when unset. */
  keys?: {
    key: string;
    defaultValue: unknown;
    /**
     * Reshape the loaded value before it reaches the form — for values that
     * can fall behind a code-side registry (the SEO rows run
     * `reconcileSeoPages`). Must be pure and idempotent.
     */
    reconcile?: (value: unknown) => unknown;
  }[];
  render?: (io: SectionIO) => ReactNode;
  /** A self-saving editor (e.g. testimonials) shown in the panel. */
  manager?: () => ReactNode;
  /** Where the rest of this section's content is edited. */
  links?: { href: string; label: string }[];
  /** What the section looks like on the page. Omit for settings that have
   *  no visible place (SEO), which are then only reachable from the list. */
  preview?: ReactNode;
};

type ConfigDoc = {
  config_key: string;
  value?: unknown;
  published_value?: unknown;
  status?: string;
};

type Institution = "main" | "engineering" | "arts-science" | "polytechnic";

type Props = {
  title: string;
  description: string;
  publicHref?: string;
  /** Which college's chrome (navbar, colours) the preview draws. */
  institution: Institution;
  sections: SiteSectionDef[];
  /** Classes for the element the preview sections sit in — the page's own
   *  `<main>` classes, so theme styles apply. */
  frameClassName?: string;
  headerExtra?: ReactNode;
};

export function SiteSectionsEditor(props: Props) {
  return (
    <DeferredUploadsProvider>
      <SiteSectionsEditorInner {...props} />
    </DeferredUploadsProvider>
  );
}

const stable = (v: unknown) => JSON.stringify(v ?? null);

function SiteSectionsEditorInner({
  title,
  description,
  publicHref,
  institution,
  sections,
  frameClassName = "bg-background text-foreground",
  headerExtra,
}: Props) {
  const { flush } = useDeferredUploads();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  // Pages build `sections` inline, so it is a new array every render. Key the
  // memo on the list of config keys instead, or every render would reload.
  const keySig = sections
    .flatMap((s) => (s.keys ?? []).map((k) => k.key))
    .join("|");
  const keyDefs = useMemo(
    () => sections.flatMap((s) => s.keys ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keySig],
  );

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [baseline, setBaseline] = useState<Record<string, string>>({});
  /** Keys with a saved draft the live site doesn't show yet. */
  const [drafted, setDrafted] = useState<Set<string>>(new Set());
  /** Keys that exist in the database — the preview only overrides those
   *  (and edited ones), so an unseeded key renders as the live page does. */
  const [stored, setStored] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [selected, setSelectedState] = useState<string | null>(
    sectionParam && sections.some((s) => s.id === sectionParam)
      ? sectionParam
      : null,
  );
  /** Bumped when a self-saving manager closes so its preview refetches. */
  const [epoch, setEpoch] = useState(0);

  // The sidebar links straight to `?section=…`; follow it when it changes.
  useEffect(() => {
    if (sectionParam && sections.some((s) => s.id === sectionParam)) {
      setSelectedState(sectionParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionParam]);

  const setSelected = useCallback(
    (id: string | null) => {
      setSelectedState((prev) => {
        if (prev && prev !== id && sections.find((s) => s.id === prev)?.manager)
          setEpoch((n) => n + 1);
        return id;
      });
      // Keep the URL (and so the sidebar highlight) on the open section.
      const params = new URLSearchParams(window.location.search);
      if (id) params.set("section", id);
      else params.delete("section");
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}`,
      );
    },
    [sections],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch("/api/admin/site-config");
        if (!r.ok) throw new Error("load failed");
        const docs = (await r.json()) as ConfigDoc[];
        if (cancelled) return;
        const nextValues: Record<string, unknown> = {};
        const nextBase: Record<string, string> = {};
        const nextDrafted = new Set<string>();
        const nextStored = new Set<string>();
        for (const def of keyDefs) {
          const doc = docs.find((d) => d.config_key === def.key);
          // A key seeded straight into `published_value` still opens with
          // something to edit.
          const raw = doc?.value ?? doc?.published_value ?? def.defaultValue;
          const value = def.reconcile ? def.reconcile(raw) : raw;
          nextValues[def.key] = value;
          nextBase[def.key] = stable(value);
          if (doc) nextStored.add(def.key);
          if (doc?.status === "draft") nextDrafted.add(def.key);
        }
        setValues(nextValues);
        setBaseline(nextBase);
        setDrafted(nextDrafted);
        setStored(nextStored);
      } catch {
        if (!cancelled)
          setError("This page's content could not be loaded. Reload to retry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [keyDefs]);

  const dirtyKeys = useMemo(
    () =>
      keyDefs
        .map((d) => d.key)
        .filter((k) => k in baseline && stable(values[k]) !== baseline[k]),
    [keyDefs, values, baseline],
  );
  const dirty = dirtyKeys.length > 0;

  useEffect(() => {
    if (dirty) setMsg(null);
  }, [dirty]);

  const io: SectionIO = useMemo(
    () => ({
      get: (key) => values[key],
      set: (key, value) => setValues((prev) => ({ ...prev, [key]: value })),
    }),
    [values],
  );

  const discard = () => {
    setValues((prev) => {
      const next = { ...prev };
      for (const k of dirtyKeys) next[k] = JSON.parse(baseline[k]);
      return next;
    });
  };

  const save = async (mode: SaveMode) => {
    setSaving(mode);
    setMsg(null);
    // Publishing also publishes drafts saved earlier and left unpublished.
    const targets = [
      ...new Set(mode === "publish" ? [...dirtyKeys, ...drafted] : dirtyKeys),
    ];
    try {
      // One flush for the whole map: `flush` drops any pending upload it
      // cannot find in the value it is handed.
      const flushed = (await flush(values)) as Record<string, unknown>;
      setValues(flushed);
      const failed = new Map<string, string>();
      for (const key of targets) {
        try {
          await saveEditableConfig(key, flushed[key], mode);
        } catch (err) {
          failed.set(
            key,
            `${sectionLabelForKey(sections, key)}: ${
              err instanceof Error ? err.message : "save failed"
            }`,
          );
        }
      }
      const saved = targets.filter((k) => !failed.has(k));
      setBaseline((prev) => {
        const next = { ...prev };
        for (const k of saved) next[k] = stable(flushed[k]);
        return next;
      });
      setStored((prev) => new Set([...prev, ...saved]));
      setDrafted((prev) => {
        const next = new Set(prev);
        for (const k of saved) {
          if (mode === "draft") next.add(k);
          else next.delete(k);
        }
        return next;
      });
      setMsg(
        failed.size > 0
          ? {
              text: `Not saved — ${[...failed.values()].join("; ")}`,
              ok: false,
            }
          : {
              text:
                mode === "publish"
                  ? "Published — the live page is updated"
                  : "Draft saved — not on the live site yet",
              ok: true,
            },
      );
    } catch (err) {
      setMsg({
        text: err instanceof Error ? err.message : "Save failed",
        ok: false,
      });
    } finally {
      setSaving(null);
    }
  };

  const previewConfigs = useMemo(() => {
    const out: Record<string, unknown> = {};
    for (const def of keyDefs) {
      if (stored.has(def.key) || dirtyKeys.includes(def.key)) {
        out[def.key] = values[def.key];
      }
    }
    return out;
  }, [keyDefs, stored, dirtyKeys, values]);

  const outline: WorkspaceSection[] = sections.map((s) => ({
    id: s.id,
    label: s.label,
    help: s.help,
    group: s.group,
  }));

  const current = sections.find((s) => s.id === selected);

  return (
    <EditorWorkspace
      title={title}
      description={description}
      publicHref={publicHref}
      headerExtra={headerExtra}
      unpublished={drafted.size > 0}
      loading={loading}
      error={error}
      sections={outline}
      selected={selected}
      onSelect={setSelected}
      preview={
        <FixedInstitutionProvider institution={institution}>
          <SiteConfigProvider configs={previewConfigs}>
            <div
              className={frameClassName}
              // Parts of a public component that belong to a different section
              // than the one wrapping them (the announcement strip inside the
              // navbar) are marked `data-preview-section`; the innermost mark
              // wins over the enclosing region.
              onClickCapture={(event) => {
                const marked = (event.target as HTMLElement).closest(
                  "[data-preview-section]",
                );
                const id = marked?.getAttribute("data-preview-section");
                if (id && sections.some((s) => s.id === id)) {
                  event.stopPropagation();
                  setSelected(id);
                }
              }}
            >
              {sections
                .filter((s) => s.preview !== undefined)
                .map((s) => (
                  <EditableRegion
                    key={s.manager ? `${s.id}:${epoch}` : s.id}
                    as="div"
                    section={s.id}
                    label={s.label}
                    editable
                    onEditSection={setSelected}
                    className="rounded-none!"
                  >
                    <div className="admin-preview-slot">{s.preview}</div>
                    {/* Shown by CSS only when the slot rendered nothing — a
                        section with no content yet must still be clickable. */}
                    <div className="admin-preview-empty">
                      <strong>{s.label}</strong>
                      <span>Nothing to show yet — click to add content.</span>
                    </div>
                  </EditableRegion>
                ))}
            </div>
          </SiteConfigProvider>
        </FixedInstitutionProvider>
      }
      panel={current && <SectionPanel section={current} io={io} />}
      saveBar={
        <EditorSaveBar
          dirty={dirty}
          saving={saving}
          unpublished={drafted.size > 0}
          message={msg}
          disabled={loading || !!error}
          onSaveDraft={() => save("draft")}
          onPublish={() => save("publish")}
          onDiscard={discard}
        />
      }
    />
  );
}

function sectionLabelForKey(sections: SiteSectionDef[], key: string): string {
  return sections.find((s) => s.keys?.some((k) => k.key === key))?.label ?? key;
}

function SectionPanel({
  section,
  io,
}: {
  section: SiteSectionDef;
  io: SectionIO;
}) {
  return (
    <div className="space-y-5">
      {section.render?.(io)}
      {section.manager && (
        <>
          <p className="admin-workspace-hint">
            <Info size={14} />
            Changes in this section save straight away with their own buttons.
          </p>
          {/* Its own upload map: a manager's save must not flush (and drop)
              files picked in the page's other sections. */}
          <DeferredUploadsProvider>{section.manager()}</DeferredUploadsProvider>
        </>
      )}
      {section.links && section.links.length > 0 && (
        <div className="flex flex-col gap-2">
          {section.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="admin-btn admin-btn-outline justify-between"
            >
              {l.label}
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
