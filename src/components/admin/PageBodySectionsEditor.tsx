"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  Field,
  ImageUploadInput,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/inputs";
import type { PageBodySection } from "@/lib/validation";

type Section = PageBodySection;

const SECTION_TYPES: { value: Section["type"]; label: string }[] = [
  { value: "heading", label: "Heading" },
  { value: "text", label: "Paragraphs" },
  { value: "image", label: "Image" },
  { value: "list", label: "Bullet/Numbered List" },
  { value: "cards", label: "Card Grid" },
  { value: "cta", label: "Call-to-Action Button" },
];

function emptySection(type: Section["type"]): Section {
  switch (type) {
    case "heading":
      return { type: "heading", text: "", level: 2 };
    case "text":
      return { type: "text", paragraphs: [""] };
    case "image":
      return { type: "image", src: "", alt: "", caption: "" };
    case "list":
      return { type: "list", ordered: false, items: [""] };
    case "cards":
      return {
        type: "cards",
        columns: 3,
        items: [{ title: "", desc: "", image: "", href: "" }],
      };
    case "cta":
      return { type: "cta", label: "", href: "", variant: "primary" };
  }
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [v] = next.splice(from, 1);
  next.splice(to, 0, v);
  return next;
}

function SectionEditor({
  section,
  onChange,
}: {
  section: Section;
  onChange: (next: Section) => void;
}) {
  switch (section.type) {
    case "heading":
      return (
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <TextInput
              label="Heading Text"
              value={section.text}
              onChange={(e) => onChange({ ...section, text: e.target.value })}
            />
          </div>
          <Select
            label="Level"
            value={String(section.level ?? 2)}
            options={[
              { value: "2", label: "H2" },
              { value: "3", label: "H3" },
              { value: "4", label: "H4" },
            ]}
            onChange={(e) =>
              onChange({
                ...section,
                level: Number(e.target.value) as 2 | 3 | 4,
              })
            }
          />
        </div>
      );
    case "text":
      return (
        <div className="space-y-2">
          {section.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <TextArea
                  label={`Paragraph ${i + 1}`}
                  rows={4}
                  value={p}
                  onChange={(e) =>
                    onChange({
                      ...section,
                      paragraphs: section.paragraphs.map((x, j) =>
                        j === i ? e.target.value : x,
                      ),
                    })
                  }
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...section,
                    paragraphs: section.paragraphs.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-7"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...section,
                paragraphs: [...section.paragraphs, ""],
              })
            }
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={12} /> Add Paragraph
          </button>
        </div>
      );
    case "image":
      return (
        <>
          <ImageUploadInput
            label="Image"
            value={section.src ?? ""}
            onChange={(src) => onChange({ ...section, src })}
            hideUrlField
          />
          <TextInput
            label="Alt Text"
            value={section.alt ?? ""}
            onChange={(e) => onChange({ ...section, alt: e.target.value })}
          />
          <TextInput
            label="Caption (optional)"
            value={section.caption ?? ""}
            onChange={(e) =>
              onChange({ ...section, caption: e.target.value })
            }
          />
        </>
      );
    case "list":
      return (
        <>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={section.ordered === true}
              onChange={(e) =>
                onChange({ ...section, ordered: e.target.checked })
              }
            />
            Numbered list (otherwise bullet)
          </label>
          <div className="space-y-2">
            {section.items.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="admin-input"
                  value={it}
                  onChange={(e) =>
                    onChange({
                      ...section,
                      items: section.items.map((x, j) =>
                        j === i ? e.target.value : x,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...section,
                      items: section.items.filter((_, j) => j !== i),
                    })
                  }
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({ ...section, items: [...section.items, ""] })
              }
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Plus size={12} /> Add Item
            </button>
          </div>
        </>
      );
    case "cards":
      return (
        <>
          <Select
            label="Columns"
            value={String(section.columns ?? 3)}
            options={[
              { value: "2", label: "2 columns" },
              { value: "3", label: "3 columns" },
              { value: "4", label: "4 columns" },
            ]}
            onChange={(e) =>
              onChange({
                ...section,
                columns: Number(e.target.value) as 2 | 3 | 4,
              })
            }
          />
          <div className="space-y-3">
            {section.items.map((card, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Card {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...section,
                        items: section.items.filter((_, j) => j !== i),
                      })
                    }
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <ImageUploadInput
                  label="Image (optional)"
                  value={card.image ?? ""}
                  onChange={(image) =>
                    onChange({
                      ...section,
                      items: section.items.map((c, j) =>
                        j === i ? { ...c, image } : c,
                      ),
                    })
                  }
                  hideUrlField
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput
                    label="Title"
                    value={card.title}
                    onChange={(e) =>
                      onChange({
                        ...section,
                        items: section.items.map((c, j) =>
                          j === i ? { ...c, title: e.target.value } : c,
                        ),
                      })
                    }
                  />
                  <TextInput
                    label="Link URL (optional)"
                    value={card.href ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...section,
                        items: section.items.map((c, j) =>
                          j === i ? { ...c, href: e.target.value } : c,
                        ),
                      })
                    }
                  />
                </div>
                <TextArea
                  label="Description"
                  rows={3}
                  value={card.desc}
                  onChange={(e) =>
                    onChange({
                      ...section,
                      items: section.items.map((c, j) =>
                        j === i ? { ...c, desc: e.target.value } : c,
                      ),
                    })
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...section,
                  items: [
                    ...section.items,
                    { title: "", desc: "", image: "", href: "" },
                  ],
                })
              }
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Plus size={12} /> Add Card
            </button>
          </div>
        </>
      );
    case "cta":
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Button Label"
              value={section.label}
              onChange={(e) =>
                onChange({ ...section, label: e.target.value })
              }
            />
            <TextInput
              label="URL"
              value={section.href ?? ""}
              onChange={(e) =>
                onChange({ ...section, href: e.target.value })
              }
              placeholder="/path or https://..."
            />
          </div>
          <Select
            label="Style"
            value={section.variant ?? "primary"}
            options={[
              { value: "primary", label: "Primary (gold)" },
              { value: "secondary", label: "Secondary (outline)" },
            ]}
            onChange={(e) =>
              onChange({
                ...section,
                variant: e.target.value as "primary" | "secondary",
              })
            }
          />
        </>
      );
  }
}

export function PageBodySectionsEditor({
  value,
  onChange,
  allowedTypes,
}: {
  value: Section[] | undefined;
  onChange: (next: Section[]) => void;
  allowedTypes?: Section["type"][];
}) {
  const sections = Array.isArray(value) ? value : [];
  const visibleTypes = allowedTypes
    ? SECTION_TYPES.filter((t) => allowedTypes.includes(t.value))
    : SECTION_TYPES;
  return (
    <div className="space-y-3">
      {sections.map((sec, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-gray-50 p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Block {i + 1} · {sec.name?.trim() || sec.type}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => onChange(moveItem(sections, i, i - 1))}
                className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                disabled={i === sections.length - 1}
                onClick={() => onChange(moveItem(sections, i, i + 1))}
                className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowDown size={12} />
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange(sections.filter((_, j) => j !== i))
                }
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
          <div className="mb-3">
            <TextInput
              label="Block name (admin only)"
              value={sec.name ?? ""}
              placeholder="Internal label — not shown on the public site"
              onChange={(e) =>
                onChange(
                  sections.map((s, j) =>
                    j === i ? { ...s, name: e.target.value } : s,
                  ),
                )
              }
            />
          </div>
          <SectionEditor
            section={sec}
            onChange={(next) =>
              onChange(sections.map((s, j) => (j === i ? next : s)))
            }
          />
        </div>
      ))}
      <Field label="Add Block">
        <div className="flex flex-wrap gap-2">
          {visibleTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange([...sections, emptySection(t.value)])}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Plus size={12} /> {t.label}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
