"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  Field,
  ImageUploadInput,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/inputs";
import type { Section, Tab } from "@/lib/department-tabs";

export type { Section, Tab } from "@/lib/department-tabs";

const ICON_OPTIONS = [
  { value: "overview", label: "Overview (book)" },
  { value: "academics", label: "Academics (cap)" },
  { value: "faculty", label: "Faculty (users)" },
  { value: "facilities", label: "Facilities (flask)" },
  { value: "life", label: "Life (trophy)" },
  { value: "career", label: "Career (trending up)" },
  { value: "image", label: "Image" },
  { value: "message", label: "Message" },
  { value: "briefcase", label: "Briefcase" },
];

function emptySection(kind: Section["kind"]): Section {
  switch (kind) {
    case "richText":
      return { kind: "richText", html: "" };
    case "stats":
      return { kind: "stats", items: [] };
    case "list":
      return { kind: "list", title: "", items: [] };
    case "cards":
      return { kind: "cards", title: "", items: [] };
    case "image":
      return { kind: "image", src: "", caption: "" };
    case "people":
      return { kind: "people", items: [] };
  }
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function StatsSectionEditor({
  section,
  onChange,
}: {
  section: Extract<Section, { kind: "stats" }>;
  onChange: (s: Section) => void;
}) {
  return (
    <Field label="Stat Items">
      <div className="space-y-2">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-md border border-slate-100 p-2"
          >
            <TextInput
              label=""
              value={item.label}
              placeholder="Label"
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((s, j) =>
                    j === i ? { ...s, label: e.target.value } : s,
                  ),
                })
              }
            />
            <TextInput
              label=""
              value={item.value}
              placeholder="Value"
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((s, j) =>
                    j === i ? { ...s, value: e.target.value } : s,
                  ),
                })
              }
            />
            <TextInput
              label=""
              value={item.sub ?? ""}
              placeholder="Sub (optional)"
              onChange={(e) =>
                onChange({
                  ...section,
                  items: section.items.map((s, j) =>
                    j === i ? { ...s, sub: e.target.value } : s,
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
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...section,
              items: [...section.items, { label: "", value: "", sub: "" }],
            })
          }
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={14} /> Add Stat
        </button>
      </div>
    </Field>
  );
}

function ListSectionEditor({
  section,
  onChange,
}: {
  section: Extract<Section, { kind: "list" }>;
  onChange: (s: Section) => void;
}) {
  return (
    <>
      <TextInput
        label="List Title (optional)"
        value={section.title ?? ""}
        onChange={(e) => onChange({ ...section, title: e.target.value })}
      />
      <Field label="Items">
        <div className="space-y-2">
          {section.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="admin-input"
                value={item}
                onChange={(e) =>
                  onChange({
                    ...section,
                    items: section.items.map((it, j) =>
                      j === i ? e.target.value : it,
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
                className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
              >
                <Trash2 size={13} />
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
            <Plus size={14} /> Add Item
          </button>
        </div>
      </Field>
    </>
  );
}

function CardsSectionEditor({
  section,
  onChange,
}: {
  section: Extract<Section, { kind: "cards" }>;
  onChange: (s: Section) => void;
}) {
  return (
    <>
      <TextInput
        label="Cards Title (optional)"
        value={section.title ?? ""}
        onChange={(e) => onChange({ ...section, title: e.target.value })}
      />
      <Field label="Cards">
        <div className="space-y-2">
          {section.items.map((item, i) => (
            <div key={i} className="rounded-md border border-slate-100 p-3">
              <TextInput
                label="Title"
                value={item.title}
                onChange={(e) =>
                  onChange({
                    ...section,
                    items: section.items.map((c, j) =>
                      j === i ? { ...c, title: e.target.value } : c,
                    ),
                  })
                }
              />
              <TextArea
                label="Description"
                rows={2}
                value={item.description}
                onChange={(e) =>
                  onChange({
                    ...section,
                    items: section.items.map((c, j) =>
                      j === i ? { ...c, description: e.target.value } : c,
                    ),
                  })
                }
              />
              <ImageUploadInput
                label="Image (optional)"
                value={item.image ?? ""}
                onChange={(url) =>
                  onChange({
                    ...section,
                    items: section.items.map((c, j) =>
                      j === i ? { ...c, image: url } : c,
                    ),
                  })
                }
                uploadOnly
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...section,
                    items: section.items.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove card
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...section,
                items: [
                  ...section.items,
                  { title: "", description: "", image: "" },
                ],
              })
            }
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={14} /> Add Card
          </button>
        </div>
      </Field>
    </>
  );
}

function PeopleSectionEditor({
  section,
  onChange,
}: {
  section: Extract<Section, { kind: "people" }>;
  onChange: (s: Section) => void;
}) {
  return (
    <Field label="People">
      <div className="space-y-2">
        {section.items.map((p, i) => (
          <div key={i} className="rounded-md border border-slate-100 p-3">
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Name"
                value={p.name}
                onChange={(e) =>
                  onChange({
                    ...section,
                    items: section.items.map((it, j) =>
                      j === i ? { ...it, name: e.target.value } : it,
                    ),
                  })
                }
              />
              <TextInput
                label="Title"
                value={p.title}
                onChange={(e) =>
                  onChange({
                    ...section,
                    items: section.items.map((it, j) =>
                      j === i ? { ...it, title: e.target.value } : it,
                    ),
                  })
                }
              />
              <TextInput
                label="Email"
                value={p.email ?? ""}
                onChange={(e) =>
                  onChange({
                    ...section,
                    items: section.items.map((it, j) =>
                      j === i ? { ...it, email: e.target.value } : it,
                    ),
                  })
                }
              />
              <TextInput
                label="Qualifications"
                value={p.qualifications ?? ""}
                onChange={(e) =>
                  onChange({
                    ...section,
                    items: section.items.map((it, j) =>
                      j === i ? { ...it, qualifications: e.target.value } : it,
                    ),
                  })
                }
              />
            </div>
            <ImageUploadInput
              label="Photo"
              value={p.image ?? ""}
              onChange={(url) =>
                onChange({
                  ...section,
                  items: section.items.map((it, j) =>
                    j === i ? { ...it, image: url } : it,
                  ),
                })
              }
              uploadOnly
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...section,
                  items: section.items.filter((_, j) => j !== i),
                })
              }
              className="admin-btn admin-btn-danger admin-btn-sm mt-2"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...section,
              items: [
                ...section.items,
                { name: "", title: "", image: "", email: "", qualifications: "" },
              ],
            })
          }
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={14} /> Add Person
        </button>
      </div>
    </Field>
  );
}

function SectionEditor({
  section,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  section: Section;
  onChange: (s: Section) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
          {section.kind}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            className="admin-btn admin-btn-outline admin-btn-sm"
            title="Move up"
          >
            <ArrowUp size={13} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="admin-btn admin-btn-outline admin-btn-sm"
            title="Move down"
          >
            <ArrowDown size={13} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {section.kind === "richText" && (
        <TextArea
          label="HTML / Markdown content"
          rows={6}
          value={section.html}
          onChange={(e) => onChange({ ...section, html: e.target.value })}
          hint="HTML is rendered as-is. Use <p>, <h3>, <strong>, etc."
        />
      )}
      {section.kind === "stats" && (
        <StatsSectionEditor section={section} onChange={onChange} />
      )}
      {section.kind === "list" && (
        <ListSectionEditor section={section} onChange={onChange} />
      )}
      {section.kind === "cards" && (
        <CardsSectionEditor section={section} onChange={onChange} />
      )}
      {section.kind === "image" && (
        <>
          <ImageUploadInput
            label="Image"
            value={section.src}
            onChange={(url) => onChange({ ...section, src: url })}
            uploadOnly
          />
          <TextInput
            label="Caption (optional)"
            value={section.caption ?? ""}
            onChange={(e) => onChange({ ...section, caption: e.target.value })}
          />
        </>
      )}
      {section.kind === "people" && (
        <PeopleSectionEditor section={section} onChange={onChange} />
      )}
    </div>
  );
}

type Props = {
  tabs: Tab[];
  onChange: (next: Tab[]) => void;
};

export function DepartmentTabsEditor({ tabs, onChange }: Props) {
  return (
    <div className="space-y-3">
      {tabs.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
          No tabs yet. Click &quot;Add Tab&quot; to start, or use &quot;Migrate
          to tabs&quot; on the toolbar to generate the default six tabs from
          legacy fields.
        </p>
      )}
      {tabs.map((tab, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-48">
              <TextInput
                label="Tab Label"
                value={tab.label}
                onChange={(e) =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i ? { ...t, label: e.target.value } : t,
                    ),
                  )
                }
              />
            </div>
            <div className="w-40">
              <TextInput
                label="Tab ID"
                value={tab.id}
                onChange={(e) =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i ? { ...t, id: e.target.value } : t,
                    ),
                  )
                }
                hint="URL-safe identifier"
              />
            </div>
            <div className="w-52">
              <Select
                label="Icon"
                options={ICON_OPTIONS}
                value={tab.icon ?? "overview"}
                onChange={(e) =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i ? { ...t, icon: e.target.value } : t,
                    ),
                  )
                }
              />
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChange(move(tabs, i, i - 1))}
                className="admin-btn admin-btn-outline admin-btn-sm"
                title="Move tab up"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => onChange(move(tabs, i, i + 1))}
                className="admin-btn admin-btn-outline admin-btn-sm"
                title="Move tab down"
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                onClick={() => onChange(tabs.filter((_, j) => j !== i))}
                className="admin-btn admin-btn-danger admin-btn-sm"
                title="Remove tab"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {tab.sections.map((section, k) => (
              <SectionEditor
                key={k}
                section={section}
                onChange={(next) =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i
                        ? {
                            ...t,
                            sections: t.sections.map((s, m) =>
                              m === k ? next : s,
                            ),
                          }
                        : t,
                    ),
                  )
                }
                onRemove={() =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i
                        ? {
                            ...t,
                            sections: t.sections.filter((_, m) => m !== k),
                          }
                        : t,
                    ),
                  )
                }
                onMoveUp={() =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i
                        ? { ...t, sections: move(t.sections, k, k - 1) }
                        : t,
                    ),
                  )
                }
                onMoveDown={() =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i
                        ? { ...t, sections: move(t.sections, k, k + 1) }
                        : t,
                    ),
                  )
                }
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                "richText",
                "stats",
                "list",
                "cards",
                "image",
                "people",
              ] as const
            ).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() =>
                  onChange(
                    tabs.map((t, j) =>
                      j === i
                        ? { ...t, sections: [...t.sections, emptySection(kind)] }
                        : t,
                    ),
                  )
                }
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <Plus size={13} /> {kind}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...tabs,
            {
              id: `tab-${tabs.length + 1}`,
              label: "New Tab",
              icon: "overview",
              sections: [],
            },
          ])
        }
        className="admin-btn admin-btn-primary admin-btn-sm"
      >
        <Plus size={14} /> Add Tab
      </button>
    </div>
  );
}
