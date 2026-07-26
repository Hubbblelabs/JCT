"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  DocumentUploadInput,
  ImageUploadInput,
  Repeater,
  Select,
  StringList,
  TextArea,
  TextAreaList,
  TextInput,
} from "@/components/admin/inputs";
import {
  CONTENT_BLOCK_LABELS,
  CONTENT_BLOCK_TYPES,
  emptyContentBlock,
} from "@/lib/validation";
import type {
  ContentAccordionItemValue,
  ContentBlockType,
  ContentBlockValue,
  ContentBreadcrumbValue,
  ContentDocGroupValue,
  ContentDocValue,
  ContentImageGroupValue,
  ContentImageValue,
  ContentPageValue,
  ContentTableRowValue,
  ContentTimelineEntryValue,
} from "@/lib/validation";

/**
 * The one inspector behind every block-based content page. `section` is either
 * a page-level key ("hero" | "breadcrumb" | "intro" | "blocks") or a per-block
 * key ("block:3") — the same convention the NAAC and CoE editors use.
 */

const emptyDoc = (): ContentDocValue => ({
  label: "",
  description: "",
  file: "",
});
const emptyDocGroup = (): ContentDocGroupValue => ({ title: "", docs: [] });
const emptyImage = (): ContentImageValue => ({ src: "", alt: "", caption: "" });
const emptyImageGroup = (): ContentImageGroupValue => ({
  title: "",
  images: [],
});

function DocRepeater({
  label,
  docs,
  onChange,
}: {
  label: string;
  docs: ContentDocValue[];
  onChange: (docs: ContentDocValue[]) => void;
}) {
  return (
    <Repeater<ContentDocValue>
      label={label}
      items={docs}
      onChange={onChange}
      newItem={emptyDoc}
      renderItem={(doc, _i, oc) => (
        <div className="space-y-1">
          <TextArea
            label="Link Label"
            rows={2}
            value={doc.label}
            placeholder="Balance Sheet 2023-2024"
            onChange={(e) => oc({ ...doc, label: e.target.value })}
          />
          <TextInput
            label="Caption (optional)"
            value={doc.description}
            onChange={(e) => oc({ ...doc, description: e.target.value })}
          />
          <DocumentUploadInput
            label="File"
            value={doc.file}
            onChange={(file) => oc({ ...doc, file })}
            hint="Upload the file, or paste a storage key / external URL below."
          />
          <TextInput
            label="File link"
            value={doc.file}
            placeholder="documents/… or https://…"
            onChange={(e) => oc({ ...doc, file: e.target.value })}
          />
        </div>
      )}
    />
  );
}

function ImageRepeater({
  label,
  images,
  onChange,
}: {
  label: string;
  images: ContentImageValue[];
  onChange: (images: ContentImageValue[]) => void;
}) {
  return (
    <Repeater<ContentImageValue>
      label={label}
      items={images}
      onChange={onChange}
      newItem={emptyImage}
      renderItem={(image, _i, oc) => (
        <div className="space-y-1">
          <ImageUploadInput
            label="Image"
            value={image.src}
            onChange={(src) => oc({ ...image, src })}
          />
          <TextInput
            label="Caption"
            value={image.caption}
            onChange={(e) => oc({ ...image, caption: e.target.value })}
          />
          <TextInput
            label="Alt Text"
            value={image.alt}
            onChange={(e) => oc({ ...image, alt: e.target.value })}
            hint="Describes the photo for screen readers."
          />
        </div>
      )}
    />
  );
}

// ─── Per-block editors ──────────────────────────────────────────────────────

function BlockEditor({
  block,
  onChange,
}: {
  block: ContentBlockValue;
  onChange: (next: ContentBlockValue) => void;
}) {
  switch (block.type) {
    case "text":
      return (
        <>
          <TextInput
            label="Heading (optional)"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextAreaList
            label="Paragraphs"
            values={block.paragraphs}
            onChange={(paragraphs) => onChange({ ...block, paragraphs })}
          />
        </>
      );

    case "list":
      return (
        <>
          <TextInput
            label="Heading (optional)"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextArea
            label="Intro (optional)"
            rows={2}
            value={block.intro}
            onChange={(e) => onChange({ ...block, intro: e.target.value })}
          />
          <Select
            label="Marker"
            value={block.ordered ? "ordered" : "bulleted"}
            options={[
              { value: "bulleted", label: "Bulleted" },
              { value: "ordered", label: "Numbered" },
            ]}
            onChange={(e) =>
              onChange({ ...block, ordered: e.target.value === "ordered" })
            }
          />
          <TextAreaList
            label="Items"
            rows={2}
            values={block.items}
            onChange={(items) => onChange({ ...block, items })}
          />
        </>
      );

    case "docs":
      return (
        <>
          <TextInput
            label="Heading (optional)"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextArea
            label="Description (optional)"
            rows={2}
            value={block.description}
            onChange={(e) => onChange({ ...block, description: e.target.value })}
          />
          <Select
            label="Layout"
            value={block.layout}
            options={[
              { value: "cards", label: "Cards — full titles" },
              { value: "rows", label: "Rows — compact list" },
              { value: "chips", label: "Chips — short codes (3.4.2)" },
            ]}
            onChange={(e) =>
              onChange({
                ...block,
                layout: e.target.value as typeof block.layout,
              })
            }
          />
          <TextInput
            label="Link Text"
            value={block.linkLabel}
            placeholder="Download"
            onChange={(e) => onChange({ ...block, linkLabel: e.target.value })}
          />
          <Repeater<ContentDocGroupValue>
            label="Groups"
            items={block.groups}
            onChange={(groups) => onChange({ ...block, groups })}
            newItem={emptyDocGroup}
            renderItem={(group, _i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Group Title (optional)"
                  value={group.title}
                  placeholder="Criterion 1"
                  onChange={(e) => oc({ ...group, title: e.target.value })}
                />
                <DocRepeater
                  label="Documents"
                  docs={group.docs}
                  onChange={(docs) => oc({ ...group, docs })}
                />
              </div>
            )}
          />
        </>
      );

    case "table":
      return (
        <>
          <TextInput
            label="Heading (optional)"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextArea
            label="Description (optional)"
            rows={2}
            value={block.description}
            onChange={(e) => onChange({ ...block, description: e.target.value })}
          />
          <StringList
            label="Column Headings"
            values={block.columns}
            onChange={(columns) => onChange({ ...block, columns })}
            placeholder="S.No"
          />
          <Repeater<ContentTableRowValue>
            label="Rows"
            items={block.rows}
            onChange={(rows) => onChange({ ...block, rows })}
            newItem={() => ({
              heading: false,
              cells: block.columns.map(() => ({ text: "", href: "" })),
            })}
            renderItem={(row, _i, oc) => (
              <div className="space-y-1">
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={row.heading}
                    onChange={(e) => oc({ ...row, heading: e.target.checked })}
                  />
                  Sub-heading row (spans every column)
                </label>
                {row.cells.map((cell, ci) => (
                  <div
                    key={ci}
                    className="rounded-lg border border-gray-100 p-2"
                  >
                    <TextArea
                      label={block.columns[ci]?.trim() || `Column ${ci + 1}`}
                      rows={2}
                      value={cell.text}
                      onChange={(e) =>
                        oc({
                          ...row,
                          cells: row.cells.map((c, j) =>
                            j === ci ? { ...c, text: e.target.value } : c,
                          ),
                        })
                      }
                    />
                    <TextInput
                      label="Link (optional)"
                      value={cell.href}
                      placeholder="https://… or documents/…"
                      onChange={(e) =>
                        oc({
                          ...row,
                          cells: row.cells.map((c, j) =>
                            j === ci ? { ...c, href: e.target.value } : c,
                          ),
                        })
                      }
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline admin-btn-sm"
                    onClick={() =>
                      oc({ ...row, cells: [...row.cells, { text: "", href: "" }] })
                    }
                  >
                    <Plus size={13} /> Cell
                  </button>
                  {row.cells.length > 0 && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-outline admin-btn-sm"
                      onClick={() =>
                        oc({ ...row, cells: row.cells.slice(0, -1) })
                      }
                    >
                      <Trash2 size={13} /> Last cell
                    </button>
                  )}
                </div>
              </div>
            )}
          />
        </>
      );

    case "gallery":
      return (
        <>
          <TextInput
            label="Heading (optional)"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextArea
            label="Description (optional)"
            rows={2}
            value={block.description}
            onChange={(e) => onChange({ ...block, description: e.target.value })}
          />
          <Select
            label="Columns"
            value={String(block.columns)}
            options={[
              { value: "2", label: "2 per row" },
              { value: "3", label: "3 per row" },
              { value: "4", label: "4 per row" },
            ]}
            onChange={(e) =>
              onChange({
                ...block,
                columns: Number(e.target.value) as 2 | 3 | 4,
              })
            }
          />
          <Repeater<ContentImageGroupValue>
            label="Albums"
            items={block.groups}
            onChange={(groups) => onChange({ ...block, groups })}
            newItem={emptyImageGroup}
            renderItem={(group, _i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Album Title (optional)"
                  value={group.title}
                  onChange={(e) => oc({ ...group, title: e.target.value })}
                />
                <ImageRepeater
                  label={`Photographs (${group.images.length})`}
                  images={group.images}
                  onChange={(images) => oc({ ...group, images })}
                />
              </div>
            )}
          />
        </>
      );

    case "timeline":
      return (
        <>
          <TextInput
            label="Heading (optional)"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextArea
            label="Description (optional)"
            rows={2}
            value={block.description}
            onChange={(e) => onChange({ ...block, description: e.target.value })}
          />
          <Repeater<ContentTimelineEntryValue>
            label="Entries"
            items={block.entries}
            onChange={(entries) => onChange({ ...block, entries })}
            newItem={() => ({ label: "", items: [] })}
            renderItem={(entry, _i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Year / Label"
                  value={entry.label}
                  placeholder="2016"
                  onChange={(e) => oc({ ...entry, label: e.target.value })}
                />
                <TextAreaList
                  label="Milestones"
                  rows={2}
                  values={entry.items}
                  onChange={(items) => oc({ ...entry, items })}
                />
              </div>
            )}
          />
        </>
      );

    case "accordion":
      return (
        <>
          <TextInput
            label="Heading (optional)"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextArea
            label="Description (optional)"
            rows={2}
            value={block.description}
            onChange={(e) => onChange({ ...block, description: e.target.value })}
          />
          <Select
            label="First panel"
            value={block.openFirst ? "open" : "closed"}
            options={[
              { value: "open", label: "Open on load" },
              { value: "closed", label: "All collapsed" },
            ]}
            onChange={(e) =>
              onChange({ ...block, openFirst: e.target.value === "open" })
            }
          />
          <Repeater<ContentAccordionItemValue>
            label="Panels"
            items={block.items}
            onChange={(items) => onChange({ ...block, items })}
            newItem={() => ({ title: "", paragraphs: [], bullets: [] })}
            renderItem={(item, _i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Panel Title"
                  value={item.title}
                  placeholder="Computer Society of India"
                  onChange={(e) => oc({ ...item, title: e.target.value })}
                />
                <TextAreaList
                  label="Paragraphs"
                  values={item.paragraphs}
                  onChange={(paragraphs) => oc({ ...item, paragraphs })}
                />
                <TextAreaList
                  label="Bullet Points"
                  rows={2}
                  values={item.bullets}
                  onChange={(bullets) => oc({ ...item, bullets })}
                />
              </div>
            )}
          />
        </>
      );

    case "contact":
      return (
        <>
          <TextInput
            label="Heading"
            value={block.title}
            placeholder="For Feedback and Comments"
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <TextArea
            label="Text"
            rows={3}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
          <TextInput
            label="Email"
            value={block.email}
            placeholder="principal@jct.ac.in"
            onChange={(e) => onChange({ ...block, email: e.target.value })}
          />
          <TextInput
            label="Phone"
            value={block.phone}
            onChange={(e) => onChange({ ...block, phone: e.target.value })}
          />
          <TextInput
            label="Button Label"
            value={block.linkLabel}
            onChange={(e) => onChange({ ...block, linkLabel: e.target.value })}
          />
          <TextInput
            label="Button Link"
            value={block.linkHref}
            placeholder="https://…"
            onChange={(e) => onChange({ ...block, linkHref: e.target.value })}
          />
        </>
      );
  }
}

// ─── Block list (add / reorder / remove) ────────────────────────────────────

function blockSummary(block: ContentBlockValue): string {
  switch (block.type) {
    case "text":
      return `${block.paragraphs.length} paragraph(s)`;
    case "list":
      return `${block.items.length} item(s)`;
    case "docs":
      return `${block.groups.length} group(s), ${block.groups.reduce(
        (n, g) => n + g.docs.length,
        0,
      )} document(s)`;
    case "table":
      return `${block.columns.length} column(s), ${block.rows.length} row(s)`;
    case "gallery":
      return `${block.groups.length} album(s), ${block.groups.reduce(
        (n, g) => n + g.images.length,
        0,
      )} photo(s)`;
    case "timeline":
      return `${block.entries.length} entry(ies)`;
    case "accordion":
      return `${block.items.length} panel(s)`;
    case "contact":
      return block.email || block.linkHref || "call-out";
  }
}

function BlockList({
  blocks,
  onChange,
  onSelect,
}: {
  blocks: ContentBlockValue[];
  onChange: (blocks: ContentBlockValue[]) => void;
  onSelect: (index: number) => void;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {blocks.map((block, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg border border-gray-200 p-3"
          >
            <button
              type="button"
              onClick={() => onSelect(i)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block text-sm font-semibold text-gray-900">
                {block.title?.trim() ||
                  `${CONTENT_BLOCK_LABELS[block.type]} ${i + 1}`}
              </span>
              <span className="mt-0.5 block text-xs text-gray-500">
                {CONTENT_BLOCK_LABELS[block.type]} — {blockSummary(block)}
              </span>
            </button>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                title="Move up"
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
                className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-40"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                title="Move down"
                disabled={i === blocks.length - 1}
                onClick={() => move(i, i + 1)}
                className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-40"
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                title="Remove block"
                onClick={() => onChange(blocks.filter((_, j) => j !== i))}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {blocks.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
            No blocks yet — add one below.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 p-3">
        <p className="admin-label mb-2">Add a block</p>
        <div className="flex flex-wrap gap-2">
          {CONTENT_BLOCK_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onChange([...blocks, emptyContentBlock(type)]);
                onSelect(blocks.length);
              }}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Plus size={13} /> {CONTENT_BLOCK_LABELS[type as ContentBlockType]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Inspector ──────────────────────────────────────────────────────────────

export function ContentPageInspector({
  section,
  data,
  onChange,
  onSelectSection,
}: {
  section: string;
  data: ContentPageValue;
  onChange: (next: ContentPageValue) => void;
  onSelectSection?: (section: string) => void;
}) {
  const patch = (p: Partial<ContentPageValue>) => onChange({ ...data, ...p });

  const blockMatch = /^block:(\d+)$/.exec(section);
  if (blockMatch) {
    const index = Number(blockMatch[1]);
    const block = data.blocks[index];
    if (!block) return <p className="text-sm text-gray-500">Block removed.</p>;
    return (
      <>
        <div className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500">
          {CONTENT_BLOCK_LABELS[block.type]} block · #{index + 1}
        </div>
        <BlockEditor
          block={block}
          onChange={(next) =>
            patch({
              blocks: data.blocks.map((b, i) => (i === index ? next : b)),
            })
          }
        />
      </>
    );
  }

  switch (section) {
    case "hero":
      return (
        <>
          <TextInput
            label="Hero Title"
            value={data.hero.title}
            onChange={(e) =>
              patch({ hero: { ...data.hero, title: e.target.value } })
            }
          />
          <TextArea
            label="Hero Subtitle"
            rows={3}
            value={data.hero.subtitle}
            onChange={(e) =>
              patch({ hero: { ...data.hero, subtitle: e.target.value } })
            }
          />
        </>
      );

    case "breadcrumb":
      return (
        <Repeater<ContentBreadcrumbValue>
          label="Breadcrumb Trail"
          items={data.breadcrumb}
          onChange={(breadcrumb) => patch({ breadcrumb })}
          newItem={() => ({ label: "", href: "" })}
          renderItem={(crumb, _i, oc) => (
            <div className="space-y-1">
              <TextInput
                label="Label"
                value={crumb.label}
                placeholder="Engineering"
                onChange={(e) => oc({ ...crumb, label: e.target.value })}
              />
              <TextInput
                label="Link (leave blank for the current page)"
                value={crumb.href}
                placeholder="/institutions/engineering"
                onChange={(e) => oc({ ...crumb, href: e.target.value })}
              />
            </div>
          )}
        />
      );

    case "intro":
      return (
        <TextAreaList
          label="Introduction Paragraphs"
          values={data.intro}
          onChange={(intro) => patch({ intro })}
          placeholder="A short introduction to this page…"
        />
      );

    case "blocks":
      return (
        <BlockList
          blocks={data.blocks}
          onChange={(blocks) => patch({ blocks })}
          onSelect={(i) => onSelectSection?.(`block:${i}`)}
        />
      );

    default:
      return <p className="text-sm text-gray-500">Select a section to edit.</p>;
  }
}
