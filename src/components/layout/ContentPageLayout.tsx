"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Download,
  Expand,
  ExternalLink,
  FileText,
  FolderOpen,
  Mail,
  Phone,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { useLightbox } from "@/components/ui/Lightbox";
import { useDeferredUploadsOptional } from "@/lib/deferred-uploads";
import { getImageUrl } from "@/lib/utils";
import { CONTENT_BLOCK_LABELS } from "@/lib/validation";
import type {
  ContentBlockValue,
  ContentCellValue,
  ContentDocValue,
  ContentImageValue,
  ContentPageValue,
} from "@/lib/validation";

/**
 * Renders any block-based content page (see `contentPage.ts`). Exactly one
 * component serves the public route and the admin live preview — passing
 * `editable` turns each block into a click target that opens its inspector.
 */

export type ContentEditableSection =
  | "hero"
  | "breadcrumb"
  | "intro"
  | "blocks"
  // Per-block sections, e.g. "block:2".
  | `block:${number}`;

export const CONTENT_SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  breadcrumb: "Breadcrumb",
  intro: "Introduction",
  blocks: "Blocks",
};

export const CONTENT_SECTION_ORDER: readonly string[] = [
  "hero",
  "breadcrumb",
  "intro",
  "blocks",
];

/** Inspector heading for a section key, including the per-block ones. */
export function contentSectionTitle(
  section: string,
  data: ContentPageValue,
): string {
  const m = /^block:(\d+)$/.exec(section);
  if (m) {
    const i = Number(m[1]);
    const block = data.blocks[i];
    if (!block) return "Block";
    return block.title?.trim()
      ? block.title
      : `${CONTENT_BLOCK_LABELS[block.type]} ${i + 1}`;
  }
  return CONTENT_SECTION_LABELS[section] ?? "Section";
}

/** Public label for a block in the preview's edit badge / block list. */
export function blockLabel(block: ContentBlockValue, index: number): string {
  return (
    block.title?.trim() || `${CONTENT_BLOCK_LABELS[block.type]} ${index + 1}`
  );
}

// ─── Shared bits ────────────────────────────────────────────────────────────

/** R2 keys are not valid hrefs on their own; absolute URLs pass straight through. */
const linkUrl = (v: string) => getImageUrl(v.trim()) || "";

/**
 * A file with no typed-in label is still a real download, so derive something
 * readable from the storage key rather than hiding it.
 */
function docLabel(doc: ContentDocValue): string {
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

const hasDoc = (d: ContentDocValue) =>
  d.file.trim() !== "" || d.label.trim() !== "";

function Anchor({
  href,
  editable,
  className,
  children,
}: {
  href: string;
  editable: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const url = linkUrl(href);
  return (
    <a
      href={url || "#"}
      target={url ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={editable || !url ? (e) => e.preventDefault() : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

function BlockHeading({
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
        <p className="text-muted-foreground mt-2 text-justify text-sm leading-relaxed md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function GroupHeading({ title }: { title: string }) {
  if (!title.trim()) return null;
  return (
    <h3 className="text-foreground mb-4 flex items-center gap-3 font-serif text-lg font-bold md:text-xl">
      <span className="bg-gold/20 text-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
        <FolderOpen size={18} />
      </span>
      {title}
    </h3>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm">
      {children}
    </div>
  );
}

/**
 * Inside the admin editor a freshly-picked file is still a `pending:`
 * placeholder backed by a blob: URL — next/image accepts neither, so the live
 * preview falls back to a plain <img> until the upload is flushed on save.
 */
function ContentImg({ image }: { image: ContentImageValue }) {
  const deferred = useDeferredUploadsOptional();
  const [failed, setFailed] = useState(false);
  const src = image.src.trim();
  const isPending = src.startsWith("pending:");
  const pendingPreview = isPending ? (deferred?.getPreview(src) ?? null) : null;
  const url = isPending ? null : getImageUrl(src);
  const alt = image.alt.trim() || image.caption.trim() || "";

  if (pendingPreview) {
    // eslint-disable-next-line @next/next/no-img-element -- a deferred upload's preview is a local blob: URL, which /_next/image cannot fetch or optimize.
    return <img src={pendingPreview} alt={alt} className="h-auto w-full" />;
  }
  if (!url || failed) {
    return (
      <div className="text-muted-foreground/60 flex aspect-video w-full items-center justify-center bg-white/5 text-xs">
        {isPending ? "Uploading on save…" : "Image unavailable"}
      </div>
    );
  }
  return (
    <Image
      src={url}
      alt={alt}
      width={1200}
      height={900}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

// ─── Block renderers ────────────────────────────────────────────────────────

function TextBlockView({
  block,
}: {
  block: Extract<ContentBlockValue, { type: "text" }>;
}) {
  const paragraphs = block.paragraphs.filter((p) => p.trim() !== "");
  return (
    <>
      <BlockHeading title={block.title} />
      {paragraphs.length > 0 && (
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-muted-foreground text-justify text-base leading-relaxed whitespace-pre-line"
            >
              {p}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

function ListBlockView({
  block,
}: {
  block: Extract<ContentBlockValue, { type: "list" }>;
}) {
  const items = block.items.filter((i) => i.trim() !== "");
  const ListTag = block.ordered ? "ol" : "ul";
  return (
    <>
      <BlockHeading title={block.title} description={block.intro} />
      {items.length > 0 ? (
        <ListTag
          className={`text-muted-foreground space-y-3 ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-gold pl-5`}
        >
          {items.map((item, i) => (
            <li
              key={i}
              className="text-justify text-base leading-relaxed whitespace-pre-line"
            >
              {item}
            </li>
          ))}
        </ListTag>
      ) : (
        <EmptyHint>Click to add list items.</EmptyHint>
      )}
    </>
  );
}

function DocCard({
  doc,
  editable,
}: {
  doc: ContentDocValue;
  editable: boolean;
}) {
  return (
    <Anchor
      href={doc.file}
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
        {doc.description.trim() && (
          <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
            {doc.description}
          </span>
        )}
        <span className="text-gold mt-2 flex items-center gap-1.5 text-[11px] font-bold">
          <Download size={12} />
          Download
        </span>
      </span>
    </Anchor>
  );
}

function DocsBlockView({
  block,
  editable,
}: {
  block: Extract<ContentBlockValue, { type: "docs" }>;
  editable: boolean;
}) {
  const groups = editable
    ? block.groups
    : block.groups
        .map((g) => ({ ...g, docs: g.docs.filter(hasDoc) }))
        .filter((g) => g.docs.length > 0);

  return (
    <>
      <BlockHeading title={block.title} description={block.description} />
      {groups.length > 0 ? (
        <div className="space-y-10">
          {groups.map((group, gi) => (
            <div key={gi}>
              <GroupHeading title={group.title} />
              {block.layout === "chips" ? (
                <div className="flex flex-wrap gap-2">
                  {group.docs.map((doc, di) => (
                    <Anchor
                      key={di}
                      href={doc.file}
                      editable={editable}
                      className="text-foreground hover:border-gold/40 hover:text-gold inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold transition-colors"
                    >
                      <FileText size={14} className="text-gold" />
                      {docLabel(doc)}
                    </Anchor>
                  ))}
                </div>
              ) : block.layout === "rows" ? (
                <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
                  {group.docs.map((doc, di) => (
                    <Anchor
                      key={di}
                      href={doc.file}
                      editable={editable}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5"
                    >
                      <FileText size={16} className="text-gold shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="text-foreground group-hover:text-gold block text-sm font-semibold transition-colors">
                          {docLabel(doc)}
                        </span>
                        {doc.description.trim() && (
                          <span className="text-muted-foreground mt-0.5 block text-xs">
                            {doc.description}
                          </span>
                        )}
                      </span>
                      <span className="text-gold flex shrink-0 items-center gap-1.5 text-[11px] font-bold">
                        <Download size={12} />
                        {block.linkLabel}
                      </span>
                    </Anchor>
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
        <EmptyHint>Click to add documents.</EmptyHint>
      )}
    </>
  );
}

function Cell({
  cell,
  editable,
}: {
  cell: ContentCellValue;
  editable: boolean;
}) {
  const text = cell.text.trim();
  if (!cell.href.trim())
    return <span className="whitespace-pre-line">{text}</span>;
  return (
    <Anchor
      href={cell.href}
      editable={editable}
      className="text-gold inline-flex items-center gap-1.5 font-semibold hover:underline"
    >
      {text || "View"}
      <ExternalLink size={12} className="shrink-0" />
    </Anchor>
  );
}

const TH =
  "border-b border-white/10 px-4 py-3 text-left align-bottom text-xs font-bold tracking-wide text-muted-foreground uppercase";
const TD =
  "border-b border-white/5 px-4 py-3 align-top text-sm text-muted-foreground";

function TableBlockView({
  block,
  editable,
}: {
  block: Extract<ContentBlockValue, { type: "table" }>;
  editable: boolean;
}) {
  const columnCount = Math.max(
    block.columns.length,
    ...block.rows.map((r) => r.cells.length),
    1,
  );
  const rows = editable
    ? block.rows
    : block.rows.filter((r) =>
        r.cells.some((c) => c.text.trim() || c.href.trim()),
      );

  return (
    <>
      <BlockHeading title={block.title} description={block.description} />
      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] border-collapse">
            {block.columns.some((c) => c.trim()) && (
              <thead className="bg-white/5">
                <tr>
                  {Array.from({ length: columnCount }, (_, i) => (
                    <th key={i} className={TH}>
                      {block.columns[i] ?? ""}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, ri) =>
                row.heading ? (
                  <tr key={ri} className="bg-white/[0.03]">
                    <td
                      className={`${TD} text-foreground font-serif font-bold`}
                      colSpan={columnCount}
                    >
                      {row.cells[0]?.text ?? ""}
                    </td>
                  </tr>
                ) : (
                  <tr key={ri} className="transition-colors hover:bg-white/5">
                    {Array.from({ length: columnCount }, (_, ci) => {
                      const cell = row.cells[ci];
                      return (
                        <td key={ci} className={TD}>
                          {cell ? (
                            <Cell cell={cell} editable={editable} />
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyHint>Click to add table rows.</EmptyHint>
      )}
    </>
  );
}

const GALLERY_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * A gallery is revealed in two steps, because the placement gallery alone runs
 * to thirty albums and ~300 photographs — rendering it whole pushed every
 * section below it off the page and downloaded hundreds of images nobody
 * scrolled to. Albums past the first are hidden behind one button, and a long
 * album is itself capped until its own button is pressed.
 *
 * The collapsed state is deliberately short: one album heading plus three grid
 * rows of photographs, so the gallery costs about four rows of page length
 * until a visitor asks for more.
 */
const GALLERY_INITIAL_ROWS = 3;
const GALLERY_GROUP_PAGE_SIZE = 1;

/** Photos shown before the album's own "show more" — three grid rows of them. */
function galleryPageSize(columns: number): number {
  return Math.max(1, columns) * GALLERY_INITIAL_ROWS;
}

/** "1 photo" / "5 photos" — the counts are user-facing. */
function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function GalleryGroup({
  group,
  columns,
  viewerIndexes,
  onOpen,
  editable,
}: {
  group: { title: string; images: ContentImageValue[] };
  columns: number;
  /** Lightbox index per image, or -1 when the image can't be opened. */
  viewerIndexes: number[];
  onOpen: (index: number) => void;
  editable: boolean;
}) {
  // In the editor every photo stays on screen — a hidden one can't be clicked
  // to edit, and the inspector's list has to match what the preview shows.
  const [expanded, setExpanded] = useState(false);
  const pageSize = galleryPageSize(columns);
  const collapsed = !editable && !expanded;
  const hidden = collapsed ? Math.max(0, group.images.length - pageSize) : 0;
  const images = collapsed ? group.images.slice(0, pageSize) : group.images;

  return (
    <div>
      <GroupHeading title={group.title} />
      <div className={`grid gap-4 ${GALLERY_COLS[columns] ?? GALLERY_COLS[3]}`}>
        {images.map((image, ii) => {
          const viewerIndex = viewerIndexes[ii];
          return (
            <figure
              key={ii}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              {viewerIndex >= 0 ? (
                <button
                  type="button"
                  onClick={() => onOpen(viewerIndex)}
                  aria-label="View full image"
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
                >
                  <ContentImg image={image} />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Expand size={22} className="text-white" />
                  </span>
                </button>
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ContentImg image={image} />
                </div>
              )}
              {image.caption.trim() && (
                <figcaption className="text-muted-foreground px-4 py-3 text-xs leading-relaxed">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {!editable && group.images.length > pageSize && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="border-border text-navy inline-flex items-center gap-2 rounded-full border bg-white px-6 py-2.5 font-sans text-sm font-semibold shadow-sm transition-colors hover:bg-stone-50"
          >
            {expanded
              ? "Show fewer photos"
              : `Show ${plural(hidden, "more photo")}`}
            <ChevronDown
              size={15}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

function GalleryBlockView({
  block,
  editable,
}: {
  block: Extract<ContentBlockValue, { type: "gallery" }>;
  editable: boolean;
}) {
  const groups = editable
    ? block.groups
    : block.groups
        .map((g) => ({ ...g, images: g.images.filter((i) => i.src.trim()) }))
        .filter((g) => g.images.length > 0);

  // One viewer list across every group of the block, so prev/next walks the
  // whole gallery. Pending uploads have no public URL yet, so they open
  // nothing — and in the admin preview a click belongs to the inspector.
  const flat: { src: string; alt: string; caption: string }[] = [];
  const indexOf: number[][] = groups.map((group) =>
    group.images.map((image) => {
      const url = editable ? "" : getImageUrl(image.src.trim());
      if (!url) return -1;
      flat.push({
        src: url,
        alt: image.alt.trim() || image.caption.trim() || "",
        caption: image.caption.trim(),
      });
      return flat.length - 1;
    }),
  );
  const { open, overlay } = useLightbox(flat, !editable);

  // As with the per-album cap, the editor shows everything — a hidden album
  // can't be clicked to edit.
  const [allGroups, setAllGroups] = useState(false);
  const groupsCollapsed =
    !editable && !allGroups && groups.length > GALLERY_GROUP_PAGE_SIZE;
  const visibleGroups = groupsCollapsed
    ? groups.slice(0, GALLERY_GROUP_PAGE_SIZE)
    : groups;
  const hiddenGroups = groups.length - visibleGroups.length;

  return (
    <>
      <BlockHeading title={block.title} description={block.description} />
      {groups.length > 0 ? (
        <div className="space-y-10">
          {visibleGroups.map((group, gi) => (
            <GalleryGroup
              // Keyed by identity for the same reason the blocks above are:
              // a positional key lets one album's expanded state survive onto
              // a different album.
              key={`${group.title}:${gi}`}
              group={group}
              columns={block.columns}
              viewerIndexes={indexOf[gi]}
              onOpen={open}
              editable={editable}
            />
          ))}

          {!editable && groups.length > GALLERY_GROUP_PAGE_SIZE && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setAllGroups((v) => !v)}
                aria-expanded={allGroups}
                className="bg-navy hover:bg-navy-light inline-flex items-center gap-2 rounded-full px-7 py-3 font-sans text-sm font-bold text-white shadow-md transition-colors"
              >
                {allGroups
                  ? "Show fewer albums"
                  : `Show ${plural(hiddenGroups, "more album")}`}
                <ChevronDown
                  size={15}
                  className={`transition-transform ${allGroups ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyHint>Click to add photographs.</EmptyHint>
      )}
      {overlay}
    </>
  );
}

function TimelineBlockView({
  block,
}: {
  block: Extract<ContentBlockValue, { type: "timeline" }>;
}) {
  const entries = block.entries.filter(
    (e) => e.label.trim() || e.items.some((i) => i.trim()),
  );
  return (
    <>
      <BlockHeading title={block.title} description={block.description} />
      {entries.length > 0 ? (
        <ol className="border-gold/20 relative space-y-10 border-l pl-8">
          {entries.map((entry, ei) => (
            <li key={ei} className="relative">
              <span className="bg-gold ring-surface absolute top-1.5 -left-[2.3rem] h-3 w-3 rounded-full ring-4" />
              <h3 className="text-gold font-serif text-xl font-bold">
                {entry.label}
              </h3>
              <ul className="text-muted-foreground marker:text-gold/60 mt-3 list-disc space-y-2 pl-5">
                {entry.items
                  .filter((i) => i.trim())
                  .map((item, ii) => (
                    <li key={ii} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyHint>Click to add timeline entries.</EmptyHint>
      )}
    </>
  );
}

function AccordionBlockView({
  block,
  editable,
}: {
  block: Extract<ContentBlockValue, { type: "accordion" }>;
  editable: boolean;
}) {
  const [open, setOpen] = useState<number | null>(block.openFirst ? 0 : null);
  const items = editable
    ? block.items
    : block.items.filter(
        (i) =>
          i.title.trim() ||
          i.paragraphs.some((p) => p.trim()) ||
          i.bullets.some((b) => b.trim()),
      );

  return (
    <>
      <BlockHeading title={block.title} description={block.description} />
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, i) => {
            const expanded = open === i;
            const paragraphs = item.paragraphs.filter((p) => p.trim());
            const bullets = item.bullets.filter((b) => b.trim());
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={(e) => {
                    // The whole block is a click target in the admin preview;
                    // don't let a toggle steal the inspector click.
                    if (editable) return;
                    e.stopPropagation();
                    setOpen(expanded ? null : i);
                  }}
                  className="text-foreground hover:text-gold flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-serif text-base font-bold transition-colors md:text-lg"
                >
                  {item.title || `Item ${i + 1}`}
                  <ChevronDown
                    size={18}
                    className={`text-gold shrink-0 transition-transform duration-300 ${
                      expanded || editable ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {(expanded || editable) && (
                  <div className="space-y-3 border-t border-white/10 px-5 py-4">
                    {paragraphs.map((p, pi) => (
                      <p
                        key={pi}
                        className="text-muted-foreground text-justify text-base leading-relaxed whitespace-pre-line"
                      >
                        {p}
                      </p>
                    ))}
                    {bullets.length > 0 && (
                      <ul className="text-muted-foreground marker:text-gold list-disc space-y-2 pl-5 text-base">
                        {bullets.map((b, bi) => (
                          <li key={bi} className="text-justify leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyHint>Click to add accordion items.</EmptyHint>
      )}
    </>
  );
}

function ContactBlockView({
  block,
  editable,
}: {
  block: Extract<ContentBlockValue, { type: "contact" }>;
  editable: boolean;
}) {
  return (
    <div className="border-gold/20 from-gold/10 rounded-2xl border bg-gradient-to-br to-transparent p-6 md:p-8">
      {block.title.trim() && (
        <h2 className="text-foreground font-serif text-xl font-bold md:text-2xl">
          {block.title}
        </h2>
      )}
      {block.text.trim() && (
        <p className="text-muted-foreground mt-2 text-justify text-sm leading-relaxed md:text-base">
          {block.text}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {block.email.trim() && (
          <a
            href={`mailto:${block.email.trim()}`}
            onClick={editable ? (e) => e.preventDefault() : undefined}
            className="text-gold inline-flex items-center gap-2 text-sm font-bold hover:underline"
          >
            <Mail size={14} />
            {block.email}
          </a>
        )}
        {block.phone.trim() && (
          <a
            href={`tel:${block.phone.replace(/\s+/g, "")}`}
            onClick={editable ? (e) => e.preventDefault() : undefined}
            className="text-gold inline-flex items-center gap-2 text-sm font-bold hover:underline"
          >
            <Phone size={14} />
            {block.phone}
          </a>
        )}
        {block.linkHref.trim() && (
          <Anchor
            href={block.linkHref}
            editable={editable}
            className="border-gold/40 text-gold inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors hover:bg-white/5"
          >
            {block.linkLabel.trim() || "Open link"}
            <ExternalLink size={13} />
          </Anchor>
        )}
      </div>
    </div>
  );
}

function BlockView({
  block,
  editable,
}: {
  block: ContentBlockValue;
  editable: boolean;
}) {
  switch (block.type) {
    case "text":
      return <TextBlockView block={block} />;
    case "list":
      return <ListBlockView block={block} />;
    case "docs":
      return <DocsBlockView block={block} editable={editable} />;
    case "table":
      return <TableBlockView block={block} editable={editable} />;
    case "gallery":
      return <GalleryBlockView block={block} editable={editable} />;
    case "timeline":
      return <TimelineBlockView block={block} />;
    case "accordion":
      return <AccordionBlockView block={block} editable={editable} />;
    case "contact":
      return <ContactBlockView block={block} editable={editable} />;
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────

/**
 * Intro + blocks, without the page chrome (navbar, hero, breadcrumb, footer).
 * Rendered on its own route by `ContentPageLayout` below, and as one sidebar
 * panel of a host page (NAAC, Documents, Placements) for the entries in
 * `CONTENT_PAGES` that carry a `host`.
 */
export function ContentPageBody({
  data,
  editable = false,
  onEditSection,
  blockIndices,
  emptyBlocksHint = "No blocks yet. Click to add the first one.",
}: {
  data: ContentPageValue;
  editable?: boolean;
  onEditSection?: (section: ContentEditableSection) => void;
  /**
   * Original index of each block in `data`, for callers that hand over a
   * *filtered* list (the placements page shows one academic year at a time).
   * Inspector keys are indexes into the full stored array, so without this the
   * editor would open — and overwrite — the wrong block.
   */
  blockIndices?: number[];
  /** Placeholder copy when there is nothing to render but the editor is on. */
  emptyBlocksHint?: string;
}) {
  const onEdit = onEditSection as ((s: string) => void) | undefined;
  // `intro`/`blocks` are optional-in-practice: a stored value that fails schema
  // validation still reaches here through the loaders' raw fallbacks, and
  // dereferencing a missing array 500s the whole hosting page.
  const intro = (data.intro ?? []).filter((p) => p.trim() !== "");
  const blocks = data.blocks ?? [];

  return (
    <>
      {(intro.length > 0 || editable) && (
        <EditableRegion
          as="section"
          section="intro"
          label={CONTENT_SECTION_LABELS.intro}
          editable={editable}
          onEditSection={onEdit}
        >
          {intro.length > 0 ? (
            <div className="space-y-4">
              {intro.map((p, i) => (
                <p
                  key={i}
                  className="text-muted-foreground text-justify text-base leading-relaxed whitespace-pre-line md:text-lg"
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

      {blocks.length > 0
        ? blocks.map((block, i) => {
            // Where this block sits in the stored array — the same as `i`
            // unless the caller filtered the list (see `blockIndices`).
            const index = blockIndices?.[i] ?? i;
            return (
              <EditableRegion
                // Keyed by identity, not position. The placements page hands
                // this component a *filtered* block array that changes when the
                // visitor picks another academic year; with a bare index key
                // React kept the same GalleryBlockView mounted and handed it a
                // different block, so one year's "show all albums/photos" state
                // carried over to the next — defeating the lazy-expansion the
                // caps exist for and firing every image request at once.
                key={`${block.type}:${block.title}:${index}`}
                as="section"
                section={`block:${index}`}
                label={blockLabel(block, index)}
                editable={editable}
                onEditSection={onEdit}
                className="mt-14 first:mt-10"
              >
                <BlockView block={block} editable={editable} />
              </EditableRegion>
            );
          })
        : editable && (
            <EditableRegion
              as="section"
              section="blocks"
              label={CONTENT_SECTION_LABELS.blocks}
              editable={editable}
              onEditSection={onEdit}
              className="mt-14"
            >
              <div className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-16 text-center text-sm">
                {emptyBlocksHint}
              </div>
            </EditableRegion>
          )}
    </>
  );
}

export function ContentPageLayout({
  data,
  editable = false,
  onEditSection,
  showBreadcrumb = true,
}: {
  data: ContentPageValue;
  editable?: boolean;
  onEditSection?: (section: ContentEditableSection) => void;
  /**
   * False for a hosted page: it renders inside a host route whose own
   * breadcrumb applies, so its stored trail is never published and the editor
   * must not invite anyone to fill it in.
   */
  showBreadcrumb?: boolean;
}) {
  const onEdit = onEditSection as ((s: string) => void) | undefined;
  const crumbs = data.breadcrumb.filter((c) => c.label.trim() !== "");

  return (
    <main className="bg-surface text-foreground min-h-screen">
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={CONTENT_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEdit}
      >
        <PageHero title={data.hero.title} subtitle={data.hero.subtitle} />
      </EditableRegion>

      {/*
       * One centred column, not a full-width container: the blocks below no
       * longer carry their own `max-w-4xl`, so without a cap a paragraph would
       * run the whole 1536px container — and with the old cap the text sat
       * against the left edge with the right half of the page empty. The same
       * column serves the public route and the admin live preview.
       */}
      <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-12">
        {showBreadcrumb && (crumbs.length > 0 || editable) && (
          <EditableRegion
            as="div"
            section="breadcrumb"
            label={CONTENT_SECTION_LABELS.breadcrumb}
            editable={editable}
            onEditSection={onEdit}
            className="mb-8"
          >
            {crumbs.length > 0 ? (
              <Breadcrumb
                items={crumbs.map((c) => ({
                  label: c.label,
                  href: c.href.trim() || undefined,
                }))}
              />
            ) : (
              <p className="text-muted-foreground/60 text-sm italic">
                Click to add the breadcrumb trail…
              </p>
            )}
          </EditableRegion>
        )}

        <ContentPageBody
          data={data}
          editable={editable}
          onEditSection={onEditSection}
        />
      </div>

      {!editable && <Footer />}
    </main>
  );
}
