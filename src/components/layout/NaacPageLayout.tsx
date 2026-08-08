"use client";

import { BadgeCheck, Download, FileText, FolderOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import {
  SectionedPageShell,
  SectionPanelHeading,
  type PageSectionItem,
} from "@/components/layout/SectionedPageShell";
import { PageBlocksRenderer } from "@/components/shared/PageBlocksRenderer";
import { hostedContentPages } from "@/lib/content-pages";
import { resolveSidebarItems, type SidebarNavDefault } from "@/lib/sidebar-nav";
import { getImageUrl } from "@/lib/utils";
import type {
  NaacDocValue,
  NaacDocSectionValue,
  NaacPageValue,
  PageBodySection,
} from "@/lib/validation";

export type NaacEditableSection =
  | "hero"
  | "intro"
  | "primaryDocs"
  | "appeal"
  | "qualitative"
  | "quantitative"
  | "docSections"
  | "sidebar"
  // Per-block sections, e.g. "docSection:2" — resolved in NAAC_SECTION_TITLE.
  | `docSection:${number}`
  // A sidebar tab the admin added, e.g. "custom:section-1730…".
  | `custom:${string}`;

export const NAAC_SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  intro: "Introduction",
  primaryDocs: "Key Documents",
  appeal: "Appeal Heading",
  qualitative: "Qualitative Parameters",
  quantitative: "Quantitative Parameters",
  docSections: "Document Sections",
  sidebar: "Sidebar Tabs",
};

export const NAAC_SECTION_ORDER: readonly string[] = [
  "hero",
  "intro",
  "primaryDocs",
  "appeal",
  "qualitative",
  "quantitative",
  "docSections",
  "sidebar",
];

/** Sidebar label for the NAAC page's own panel. */
export const NAAC_OVERVIEW_SECTION_ID = "naac";

const NAAC_PUBLIC_PATH = "/institutions/engineering/naac";

/**
 * The tabs this page ships with: its own appeal panel, then the content pages
 * it hosts (best practices, institutional distinctiveness, AQAR reports).
 * `data.sidebar.navItems` reorders, renames, hides or extends this list.
 */
export const NAAC_NAV_DEFAULTS: SidebarNavDefault[] = [
  {
    anchor: NAAC_OVERVIEW_SECTION_ID,
    navLabel: "Accreditation & Appeal",
    icon: BadgeCheck,
  },
  ...hostedContentPages(NAAC_PUBLIC_PATH).map((p) => ({
    anchor: p.host!.anchor,
    navLabel: p.host!.navLabel,
    icon: p.icon,
  })),
];

/** Inspector heading for a section key, including the per-block ones. */
export function naacSectionTitle(section: string, data: NaacPageValue): string {
  const m = /^docSection:(\d+)$/.exec(section);
  if (m) {
    const block = data.docSections[Number(m[1])];
    return block?.title?.trim() || "Document Section";
  }
  if (section.startsWith("custom:")) {
    const anchor = section.slice("custom:".length);
    const item = (data.sidebar?.navItems ?? []).find(
      (it) => (it.id || "") === anchor,
    );
    return item?.label?.trim() || "Custom Tab";
  }
  return NAAC_SECTION_LABELS[section] ?? "Section";
}

// Uploaded documents are stored as storage keys ("documents/…"), which are not valid
// hrefs on their own — resolve them the same way the Documents page does.
const docUrl = (v: string) => getImageUrl(v) || "";

/**
 * A document with a file but no typed-in label is still a real download, so
 * derive something readable from the storage key rather than hiding it.
 */
function docLabel(doc: NaacDocValue): string {
  if (doc.label.trim()) return doc.label;
  const file = doc.file.trim();
  if (!file) return "Untitled Document";
  const base = (file.split("?")[0].split("/").pop() ?? "")
    .replace(/^\d{10,}-/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base || "Download";
}

const hasDoc = (d: NaacDocValue) =>
  d.file.trim() !== "" || d.label.trim() !== "";

function DocAnchor({
  doc,
  editable,
  className,
  children,
}: {
  doc: NaacDocValue;
  editable: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const href = docUrl(doc.file);
  return (
    <a
      href={href || "#"}
      target={href ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={editable || !href ? (e) => e.preventDefault() : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

/** Inline evidence links inside a table cell. */
function DocLinks({
  docs,
  editable,
}: {
  docs: NaacDocValue[];
  editable: boolean;
}) {
  const list = docs.filter(hasDoc);
  if (list.length === 0) return null;
  return (
    <span className="mt-2 flex flex-wrap gap-2">
      {list.map((doc, i) => (
        <DocAnchor
          key={i}
          doc={doc}
          editable={editable}
          className="border-gold/30 text-gold inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-white/5"
        >
          <Download size={12} />
          {docLabel(doc)}
        </DocAnchor>
      ))}
    </span>
  );
}

function DocCard({ doc, editable }: { doc: NaacDocValue; editable: boolean }) {
  return (
    <DocAnchor
      doc={doc}
      editable={editable}
      className="hover:border-gold/30 group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/10"
    >
      <span className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <FileText size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-foreground group-hover:text-gold block text-sm font-bold transition-colors duration-300">
          {docLabel(doc)}
        </span>
        <span className="text-gold mt-2 flex items-center gap-1.5 text-[11px] font-bold">
          <Download size={12} />
          Download
        </span>
      </span>
    </DocAnchor>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  if (!title.trim() && !description?.trim()) return null;
  return (
    <div className="mb-6">
      {title.trim() && (
        <h2 className="text-foreground font-serif text-xl font-bold md:text-2xl">
          {title}
        </h2>
      )}
      {description?.trim() && (
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function DocSectionBlock({
  block,
  editable,
}: {
  block: NaacDocSectionValue;
  editable: boolean;
}) {
  const groups = editable
    ? block.groups
    : block.groups
        .map((g) => ({ ...g, docs: g.docs.filter(hasDoc) }))
        .filter((g) => g.docs.length > 0);

  return (
    <>
      <SectionHeading title={block.title} description={block.description} />
      {groups.length > 0 ? (
        <div className="space-y-10">
          {groups.map((group, gi) => (
            <div key={gi}>
              {group.title.trim() && (
                <h3 className="text-foreground mb-4 flex items-center gap-3 font-serif text-lg font-bold md:text-xl">
                  <span className="bg-gold/20 text-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                    <FolderOpen size={18} />
                  </span>
                  {group.title}
                </h3>
              )}
              {block.layout === "chips" ? (
                <div className="flex flex-wrap gap-2">
                  {group.docs.map((doc, di) => (
                    <DocAnchor
                      key={di}
                      doc={doc}
                      editable={editable}
                      className="text-foreground hover:border-gold/40 hover:text-gold inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold transition-colors"
                    >
                      <FileText size={14} className="text-gold" />
                      {docLabel(doc)}
                    </DocAnchor>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.docs.map((doc, di) => (
                    <DocCard key={di} doc={doc} editable={editable} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm">
          {editable
            ? "No documents in this section yet. Click to add them."
            : "Documents will be published soon."}
        </div>
      )}
    </>
  );
}

const TH =
  "border-b border-white/10 px-4 py-3 text-left align-bottom text-xs font-bold tracking-wide text-muted-foreground uppercase";
const TD =
  "border-b border-white/5 px-4 py-4 align-top text-sm text-muted-foreground";

/**
 * Everything between the breadcrumb and the footer. Split out so the NAAC page
 * can render it as the first panel of its sidebar, alongside the content pages
 * that used to be separate routes (AQAR, best practices, distinctiveness).
 */
export function NaacPageBody({
  data,
  editable = false,
  onEditSection,
}: {
  data: NaacPageValue;
  editable?: boolean;
  onEditSection?: (section: NaacEditableSection) => void;
}) {
  const onEdit = onEditSection as ((s: string) => void) | undefined;
  const intro = data.intro.filter((p) => p.trim() !== "");
  const primaryDocs = editable
    ? data.primaryDocs.docs
    : data.primaryDocs.docs.filter(hasDoc);
  const qualitativeRows = editable
    ? data.qualitative.rows
    : data.qualitative.rows.filter(
        (r) => r.metric.trim() !== "" || r.description.trim() !== "",
      );
  const quantitativeRows = editable
    ? data.quantitative.rows
    : data.quantitative.rows.filter(
        (r) => r.metric.trim() !== "" || r.parameter.trim() !== "",
      );
  const docSections = editable
    ? data.docSections
    : data.docSections.filter((b) => b.groups.some((g) => g.docs.some(hasDoc)));
  const showAppeal =
    editable ||
    data.appeal.badge.trim() !== "" ||
    data.appeal.title.trim() !== "" ||
    qualitativeRows.length > 0 ||
    quantitativeRows.length > 0;

  return (
    <>
      {(intro.length > 0 || editable) && (
        <EditableRegion
          as="section"
          section="intro"
          label={NAAC_SECTION_LABELS.intro}
          editable={editable}
          onEditSection={onEdit}
          className="max-w-3xl"
        >
          {intro.length > 0 ? (
            <div className="space-y-4">
              {intro.map((p, i) => (
                <p
                  key={i}
                  className="text-muted-foreground text-justify text-base leading-relaxed md:text-lg"
                >
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground/60 text-sm italic">
              Click to add an introduction…
            </p>
          )}
        </EditableRegion>
      )}

      {(primaryDocs.length > 0 || editable) && (
        <EditableRegion
          as="section"
          section="primaryDocs"
          label={NAAC_SECTION_LABELS.primaryDocs}
          editable={editable}
          onEditSection={onEdit}
          className="mt-8 first:mt-0"
        >
          <SectionHeading title={data.primaryDocs.title} />
          {primaryDocs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {primaryDocs.map((doc, i) => (
                <DocAnchor
                  key={i}
                  doc={doc}
                  editable={editable}
                  className="hover:border-gold/40 group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="bg-gold/15 text-gold flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                    <FileText size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground group-hover:text-gold block font-serif text-base font-bold transition-colors duration-300">
                      {docLabel(doc)}
                    </span>
                    <span className="text-gold mt-1 flex items-center gap-1.5 text-xs font-bold">
                      <Download size={12} />
                      {data.primaryDocs.linkLabel}
                    </span>
                  </span>
                </DocAnchor>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm">
              Click to add the headline documents (SSR, DVV…).
            </div>
          )}
        </EditableRegion>
      )}

      {showAppeal && (
        <section className="mt-14">
          <EditableRegion
            as="div"
            section="appeal"
            label={NAAC_SECTION_LABELS.appeal}
            editable={editable}
            onEditSection={onEdit}
            className="mb-8"
          >
            {data.appeal.badge.trim() && (
              <span className="bg-gold/15 text-gold inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
                <BadgeCheck size={13} />
                {data.appeal.badge}
              </span>
            )}
            {data.appeal.title.trim() && (
              <h2 className="text-foreground mt-3 font-serif text-2xl font-bold md:text-3xl">
                {data.appeal.title}
              </h2>
            )}
            {editable &&
              !data.appeal.badge.trim() &&
              !data.appeal.title.trim() && (
                <p className="text-muted-foreground/60 text-sm italic">
                  Click to add the appeal heading…
                </p>
              )}
          </EditableRegion>

          {(qualitativeRows.length > 0 || editable) && (
            <EditableRegion
              as="div"
              section="qualitative"
              label={NAAC_SECTION_LABELS.qualitative}
              editable={editable}
              onEditSection={onEdit}
            >
              <SectionHeading
                title={data.qualitative.title}
                description={data.qualitative.description}
              />
              {qualitativeRows.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full min-w-[900px] border-collapse">
                    <thead className="bg-white/5">
                      <tr>
                        <th className={TH}>
                          {data.qualitative.columns.metric}
                        </th>
                        <th className={TH}>
                          {data.qualitative.columns.description}
                        </th>
                        <th className={TH}>
                          {data.qualitative.columns.expertsMarks}
                        </th>
                        <th className={TH}>
                          {data.qualitative.columns.marksRequested}
                        </th>
                        <th className={TH}>
                          {data.qualitative.columns.justification}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualitativeRows.map((row, i) => (
                        <tr
                          key={i}
                          className="transition-colors hover:bg-white/5"
                        >
                          <td className={`${TD} text-foreground font-bold`}>
                            {row.metric}
                          </td>
                          <td className={`${TD} whitespace-pre-line`}>
                            {row.description}
                          </td>
                          <td className={`${TD} text-center`}>
                            {row.expertsMarks}
                          </td>
                          <td
                            className={`${TD} text-gold text-center font-bold`}
                          >
                            {row.marksRequested}
                          </td>
                          <td className={TD}>
                            <span className="block whitespace-pre-line">
                              {row.justification}
                            </span>
                            <DocLinks docs={row.docs} editable={editable} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm">
                  Click to add qualitative appeal rows.
                </div>
              )}
            </EditableRegion>
          )}

          {(quantitativeRows.length > 0 || editable) && (
            <EditableRegion
              as="div"
              section="quantitative"
              label={NAAC_SECTION_LABELS.quantitative}
              editable={editable}
              onEditSection={onEdit}
              className="mt-12"
            >
              <SectionHeading
                title={data.quantitative.title}
                description={data.quantitative.description}
              />
              {quantitativeRows.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full min-w-[1000px] border-collapse">
                    <thead className="bg-white/5">
                      <tr>
                        <th className={TH} rowSpan={2}>
                          {data.quantitative.columns.metric}
                        </th>
                        <th className={TH} rowSpan={2}>
                          {data.quantitative.columns.parameter}
                        </th>
                        <th className={`${TH} text-center`} colSpan={2}>
                          {data.quantitative.columns.values}
                        </th>
                        <th className={`${TH} text-center`} colSpan={2}>
                          {data.quantitative.columns.marks}
                        </th>
                        <th className={TH} rowSpan={2}>
                          {data.quantitative.columns.justification}
                        </th>
                      </tr>
                      <tr>
                        <th className={`${TH} text-center`}>
                          {data.quantitative.columns.ssr}
                        </th>
                        <th className={`${TH} text-center`}>
                          {data.quantitative.columns.dvv}
                        </th>
                        <th className={`${TH} text-center`}>
                          {data.quantitative.columns.awarded}
                        </th>
                        <th className={`${TH} text-center`}>
                          {data.quantitative.columns.requested}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quantitativeRows.map((row, i) => (
                        <tr
                          key={i}
                          className="transition-colors hover:bg-white/5"
                        >
                          <td className={`${TD} text-foreground font-bold`}>
                            {row.metric}
                          </td>
                          <td className={TD}>{row.parameter}</td>
                          <td className={`${TD} text-center`}>{row.ssr}</td>
                          <td className={`${TD} text-center`}>{row.dvv}</td>
                          <td className={`${TD} text-center`}>{row.awarded}</td>
                          <td
                            className={`${TD} text-gold text-center font-bold`}
                          >
                            {row.requested}
                          </td>
                          <td className={TD}>
                            <span className="block whitespace-pre-line">
                              {row.justification}
                            </span>
                            <DocLinks docs={row.docs} editable={editable} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm">
                  Click to add quantitative appeal rows.
                </div>
              )}
            </EditableRegion>
          )}
        </section>
      )}

      {docSections.length > 0
        ? docSections.map((block, i) => (
            <EditableRegion
              key={i}
              as="section"
              section={`docSection:${i}`}
              label={block.title.trim() || `Document Section ${i + 1}`}
              editable={editable}
              onEditSection={onEdit}
              className="mt-16"
            >
              <DocSectionBlock block={block} editable={editable} />
            </EditableRegion>
          ))
        : editable && (
            <EditableRegion
              as="section"
              section="docSections"
              label={NAAC_SECTION_LABELS.docSections}
              editable={editable}
              onEditSection={onEdit}
              className="mt-16"
            >
              <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-16 text-center text-sm">
                No document sections yet. Click to add the first one.
              </div>
            </EditableRegion>
          )}
    </>
  );
}

export function NaacPageLayout({
  data,
  editable = false,
  onEditSection,
  sections = [],
}: {
  data: NaacPageValue;
  editable?: boolean;
  onEditSection?: (section: NaacEditableSection) => void;
  /**
   * The content pages hosted by this route — AQAR, best practices and
   * institutional distinctiveness. Empty in the admin preview unless the
   * editor passes link-only entries.
   */
  sections?: PageSectionItem[];
}) {
  const onEdit = onEditSection as ((s: string) => void) | undefined;
  const body = (
    <NaacPageBody
      data={data}
      editable={editable}
      onEditSection={onEditSection}
    />
  );

  // The sidebar is whatever the admin configured: built-in tabs (this page's
  // appeal panel and the hosted sub-pages) in their saved order, plus any link
  // or block tabs they added. A hosted tab with nothing published never
  // reaches `sections`, so it drops out here rather than dead-ending.
  const hostedById = new Map(sections.map((s) => [s.id, s]));
  const items: PageSectionItem[] = [];
  for (const item of resolveSidebarItems(
    NAAC_NAV_DEFAULTS,
    data.sidebar?.navItems,
  )) {
    const Icon = item.icon;
    if (item.customHref) {
      items.push({
        id: item.id,
        label: item.navLabel,
        icon: <Icon />,
        href: item.customHref,
      });
    } else if (item.customSection) {
      const blocks = (item.blocks ?? []) as unknown as PageBodySection[];
      items.push({
        id: item.anchor,
        label: item.navLabel,
        icon: <Icon />,
        content: (
          <EditableRegion
            as="div"
            section={`custom:${item.anchor}`}
            label={item.navLabel}
            editable={editable}
            onEditSection={onEdit}
          >
            <SectionPanelHeading title={item.navLabel} />
            {blocks.length > 0 ? (
              <PageBlocksRenderer blocks={blocks} />
            ) : (
              <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-16 text-center text-sm">
                {editable
                  ? "Click to add content blocks to this tab."
                  : "Content will be published soon."}
              </div>
            )}
          </EditableRegion>
        ),
      });
    } else if (item.anchor === NAAC_OVERVIEW_SECTION_ID) {
      items.push({
        id: item.anchor,
        label: item.navLabel,
        icon: <Icon />,
        content: body,
      });
    } else {
      const hosted = hostedById.get(item.anchor);
      if (hosted)
        items.push({ ...hosted, label: item.navLabel, icon: <Icon /> });
    }
  }
  // One tab is not a sidebar — render it as the page.
  const single = items.length <= 1;

  return (
    <main className="bg-surface text-foreground min-h-screen">
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={NAAC_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEdit}
      >
        <PageHero title={data.hero.title} subtitle={data.hero.subtitle} />
      </EditableRegion>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "NAAC" },
          ]}
        />

        {single ? (
          <div className="mt-8">{items[0]?.content ?? body}</div>
        ) : (
          <SectionedPageShell
            className="mt-8"
            navTitle="NAAC"
            items={items}
            editable={editable}
            navSection="sidebar"
            onEditSection={onEdit}
          />
        )}
      </div>

      {!editable && <Footer />}
    </main>
  );
}
