"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { ContentPageInspector } from "@/components/admin/ContentPageInspector";
import {
  ContentPageBody,
  contentSectionTitle,
} from "@/components/layout/ContentPageLayout";
import {
  SectionPanelHeading,
  type PageSectionItem,
} from "@/components/layout/SectionedPageShell";
import {
  hostedContentPages,
  hostedSectionKey,
  parseHostedSection,
  type ContentPageDef,
} from "@/lib/content-pages";
import {
  loadEditableConfig,
  saveEditableConfig,
  type SaveMode,
} from "@/lib/admin-site-config";
import { ContentPageSchema } from "@/lib/validation";
import type { ContentPageValue } from "@/lib/validation";

/**
 * The pages a host route absorbs are edited *inside* the host's own editor —
 * one preview, one inspector, one Save button — rather than linking out to a
 * second editor per panel. This module is the shared half of that: it loads
 * every hosted page's draft, renders each as an editable panel, and routes the
 * `hosted:<slug>:<section>` inspector keys to the content-page inspector.
 *
 * Each hosted page keeps its own SiteConfig key, so the public site is
 * unchanged — only the editing surface is merged.
 */

export type HostedDrafts = Record<string, ContentPageValue>;

/**
 * Loads and holds the drafts for every page hosted by `hostPath`. Returns
 * `null` drafts until the load settles so a host editor can hold its own
 * spinner until the whole merged page is ready.
 */
export function useHostedDrafts(hostPath: string) {
  const defs = useMemo(() => hostedContentPages(hostPath), [hostPath]);
  const [drafts, setDrafts] = useState<HostedDrafts>({});
  const [loading, setLoading] = useState(defs.length > 0);

  useEffect(() => {
    if (defs.length === 0) {
      setDrafts({});
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(
      defs.map((def) =>
        loadEditableConfig<ContentPageValue>(def.configKey)
          .then((res) => res.value)
          .catch(() => null),
      ),
    )
      .then((values) => {
        if (cancelled) return;
        const next: HostedDrafts = {};
        defs.forEach((def, i) => {
          // An unseeded key still has to open with something editable.
          next[def.slug] = values[i] ?? ContentPageSchema.parse({});
        });
        setDrafts(next);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [defs]);

  const setDraft = useCallback((slug: string, value: ContentPageValue) => {
    setDrafts((prev) => ({ ...prev, [slug]: value }));
  }, []);

  /**
   * Writes every hosted key. The host and its panels publish as one page, so a
   * "Save & Publish" on the host publishes the panels with it — there is no
   * other editor that could be holding an unrelated draft for them.
   */
  const saveAll = useCallback(
    async (values: HostedDrafts, mode: SaveMode) => {
      await Promise.all(
        defs
          .filter((def) => values[def.slug])
          .map((def) =>
            saveEditableConfig(def.configKey, values[def.slug], mode),
          ),
      );
    },
    [defs],
  );

  return { defs, drafts, setDrafts, setDraft, loading, saveAll };
}

/** Heading + body of one hosted page, every region click-to-edit. */
export function HostedPanelBody({
  def,
  data,
  onEditSection,
}: {
  def: ContentPageDef;
  data: ContentPageValue;
  onEditSection: (section: string) => void;
}) {
  return (
    <>
      <EditableRegion
        as="div"
        section={hostedSectionKey(def.slug, "hero")}
        label={`${def.label} — Heading`}
        editable
        onEditSection={onEditSection}
      >
        <SectionPanelHeading
          title={data.hero?.title?.trim() || def.label}
          subtitle={data.hero?.subtitle}
        />
      </EditableRegion>
      <ContentPageBody
        data={data}
        editable
        onEditSection={(s) => onEditSection(hostedSectionKey(def.slug, s))}
      />
    </>
  );
}

/**
 * The hosted pages as `SectionedPageShell` panels — the same tabs the public
 * route renders, but editable in place. Used by the NAAC and Reports &
 * Downloads editors.
 */
export function hostedPanelItems(
  defs: ContentPageDef[],
  drafts: HostedDrafts,
  onEditSection: (section: string) => void,
): PageSectionItem[] {
  return defs
    .filter((def) => drafts[def.slug])
    .map((def) => {
      const Icon = def.icon;
      return {
        id: def.host!.anchor,
        label: def.host!.navLabel,
        icon: <Icon />,
        content: (
          <HostedPanelBody
            def={def}
            data={drafts[def.slug]}
            onEditSection={onEditSection}
          />
        ),
      };
    });
}

/** Inspector heading for a `hosted:…` key, or null when it isn't one. */
export function hostedInspectorTitle(
  key: string,
  defs: ContentPageDef[],
  drafts: HostedDrafts,
): string | null {
  const parsed = parseHostedSection(key);
  if (!parsed) return null;
  const def = defs.find((d) => d.slug === parsed.slug);
  const data = drafts[parsed.slug];
  if (!def || !data) return null;
  return `${def.label} — ${contentSectionTitle(parsed.section, data)}`;
}

/** The content-page inspector, bound to one hosted draft. */
export function HostedInspector({
  sectionKey,
  defs,
  drafts,
  onChange,
  onSelectSection,
}: {
  sectionKey: string;
  defs: ContentPageDef[];
  drafts: HostedDrafts;
  onChange: (slug: string, next: ContentPageValue) => void;
  onSelectSection: (key: string) => void;
}) {
  const parsed = parseHostedSection(sectionKey);
  const def = parsed ? defs.find((d) => d.slug === parsed.slug) : undefined;
  const data = parsed ? drafts[parsed.slug] : undefined;
  if (!parsed || !def || !data) {
    return (
      <p className="text-sm text-gray-500">
        This panel is no longer part of the page.
      </p>
    );
  }
  return (
    <ContentPageInspector
      section={parsed.section}
      data={data}
      onChange={(next) => onChange(parsed.slug, next)}
      onSelectSection={(s) => onSelectSection(hostedSectionKey(parsed.slug, s))}
    />
  );
}
