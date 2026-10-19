"use client";

import {
  Field,
  FormGrid,
  TextInput,
  TextArea,
  TextAreaList,
  DocumentUploadInput,
  Select,
  Repeater,
  type FieldSpan,
} from "@/components/admin/inputs";
import { SidebarNavEditor } from "@/components/admin/SidebarNavEditor";
import { PageBodySectionsEditor } from "@/components/admin/PageBodySectionsEditor";
import { NAAC_NAV_DEFAULTS } from "@/components/layout/NaacPageLayout";
import { TableEditor } from "@/components/admin/TableEditor";
import { columnsToStore, resolveColumns } from "@/lib/table-columns";
import {
  naacQualitativeBuiltins,
  naacQuantitativeBuiltins,
} from "@/lib/naac-table-columns";
import type { SidebarNavItemRaw } from "@/lib/sidebar-nav";
import type {
  NaacDocGroupValue,
  NaacDocSectionValue,
  NaacDocValue,
  NaacPageValue,
  NaacQualitativeRowValue,
  NaacQuantitativeRowValue,
  PageBodySection,
} from "@/lib/validation";

const emptyDoc = (): NaacDocValue => ({ label: "", file: "" });
const emptyGroup = (): NaacDocGroupValue => ({ title: "", docs: [] });
const emptySection = (): NaacDocSectionValue => ({
  title: "",
  description: "",
  layout: "cards",
  groups: [],
});

/** Shared editor for a list of downloadable documents. */
function DocRepeater({
  label,
  docs,
  onChange,
  span = "full",
}: {
  label: string;
  docs: NaacDocValue[];
  onChange: (docs: NaacDocValue[]) => void;
  span?: FieldSpan;
}) {
  return (
    <Repeater<NaacDocValue>
      label={label}
      span={span}
      itemSpan={6}
      items={docs}
      onChange={onChange}
      newItem={emptyDoc}
      renderItem={(doc, _i, oc) => (
        <FormGrid tight>
          <TextArea
            label="Link Label"
            span="full"
            rows={2}
            value={doc.label}
            placeholder="2.4.1 Average percentage of full time teachers…"
            onChange={(e) => oc({ ...doc, label: e.target.value })}
          />
          <DocumentUploadInput
            label="File (PDF)"
            span="full"
            value={doc.file}
            onChange={(file) => oc({ ...doc, file })}
            hint="Upload the document — its link powers the Download button."
          />
        </FormGrid>
      )}
    />
  );
}

export function NaacSectionInspector({
  section,
  data,
  onChange,
}: {
  section: string;
  data: NaacPageValue;
  onChange: (next: NaacPageValue) => void;
}) {
  const patch = (p: Partial<NaacPageValue>) => onChange({ ...data, ...p });

  // A sidebar tab the admin added: its label and its content blocks.
  if (section.startsWith("custom:")) {
    const anchor = section.slice("custom:".length);
    const items = data.sidebar?.navItems ?? [];
    const idx = items.findIndex((it) => (it.id || "") === anchor);
    if (idx === -1) {
      return (
        <p className="text-sm text-[var(--admin-text-muted)]">
          This tab no longer exists. Re-open the inspector.
        </p>
      );
    }
    const item = items[idx];
    const updateItem = (next: Partial<typeof item>) =>
      patch({
        sidebar: {
          ...data.sidebar,
          navItems: items.map((it, j) => (j === idx ? { ...it, ...next } : it)),
        },
      });
    return (
      <FormGrid>
        <TextInput
          label="Tab Label"
          span={5}
          value={item.label ?? ""}
          placeholder="Name shown in the NAAC sidebar"
          onChange={(e) => updateItem({ label: e.target.value })}
        />
        <Field label="Content Blocks" span="full">
          <PageBodySectionsEditor
            value={(item.blocks ?? []) as PageBodySection[]}
            onChange={(blocks) => updateItem({ blocks })}
            allowedTypes={["heading", "text", "image", "list", "cards"]}
          />
        </Field>
      </FormGrid>
    );
  }

  const patchDocSection = (index: number, next: NaacDocSectionValue) =>
    patch({
      docSections: data.docSections.map((b, i) => (i === index ? next : b)),
    });

  const blockMatch = /^docSection:(\d+)$/.exec(section);
  if (blockMatch) {
    const index = Number(blockMatch[1]);
    const block = data.docSections[index];
    if (!block)
      return (
        <p className="text-sm text-[var(--admin-text-muted)]">
          Section removed.
        </p>
      );
    return (
      <FormGrid>
        <TextInput
          label="Section Title"
          span={4}
          value={block.title}
          placeholder="Extended Profile"
          onChange={(e) =>
            patchDocSection(index, { ...block, title: e.target.value })
          }
        />
        <TextArea
          label="Section Description"
          span={5}
          rows={2}
          value={block.description}
          onChange={(e) =>
            patchDocSection(index, { ...block, description: e.target.value })
          }
        />
        <Select
          label="Layout"
          span={3}
          value={block.layout}
          options={[
            { value: "cards", label: "Cards — full titles" },
            { value: "chips", label: "Chips — short metric codes" },
          ]}
          onChange={(e) =>
            patchDocSection(index, {
              ...block,
              layout: e.target.value === "chips" ? "chips" : "cards",
            })
          }
        />
        <Repeater<NaacDocGroupValue>
          label="Groups"
          span="full"
          items={block.groups}
          onChange={(groups) => patchDocSection(index, { ...block, groups })}
          newItem={emptyGroup}
          renderItem={(group, _i, ocGroup) => (
            <FormGrid tight>
              <TextInput
                label="Group Title"
                span={4}
                value={group.title}
                placeholder="Criterion 1"
                onChange={(e) => ocGroup({ ...group, title: e.target.value })}
              />
              <DocRepeater
                label="Documents"
                docs={group.docs}
                onChange={(docs) => ocGroup({ ...group, docs })}
              />
            </FormGrid>
          )}
        />
      </FormGrid>
    );
  }

  switch (section) {
    case "hero":
      return (
        <FormGrid>
          <TextInput
            label="Hero Title"
            span={5}
            value={data.hero.title}
            placeholder="National Assessment and Accreditation Council (NAAC)"
            onChange={(e) =>
              patch({ hero: { ...data.hero, title: e.target.value } })
            }
          />
          <TextArea
            label="Hero Subtitle"
            span={7}
            rows={3}
            value={data.hero.subtitle}
            onChange={(e) =>
              patch({ hero: { ...data.hero, subtitle: e.target.value } })
            }
          />
        </FormGrid>
      );

    case "intro":
      return (
        <TextAreaList
          label="Introduction Paragraphs"
          values={data.intro}
          onChange={(intro) => patch({ intro })}
          placeholder="A short introduction to the NAAC accreditation…"
        />
      );

    case "primaryDocs":
      return (
        <FormGrid>
          <TextInput
            label="Section Title (optional)"
            span={6}
            value={data.primaryDocs.title}
            placeholder="Key Documents"
            onChange={(e) =>
              patch({
                primaryDocs: { ...data.primaryDocs, title: e.target.value },
              })
            }
          />
          <TextInput
            label="Card Link Text"
            span={6}
            value={data.primaryDocs.linkLabel}
            placeholder="Click here to view"
            onChange={(e) =>
              patch({
                primaryDocs: { ...data.primaryDocs, linkLabel: e.target.value },
              })
            }
          />
          <DocRepeater
            label="Documents"
            docs={data.primaryDocs.docs}
            onChange={(docs) =>
              patch({ primaryDocs: { ...data.primaryDocs, docs } })
            }
          />
        </FormGrid>
      );

    case "appeal":
      return (
        <FormGrid>
          <TextInput
            label="Badge Text"
            span={4}
            value={data.appeal.badge}
            placeholder="Appeal Documents"
            onChange={(e) =>
              patch({ appeal: { ...data.appeal, badge: e.target.value } })
            }
          />
          <TextArea
            label="Heading"
            span={8}
            rows={2}
            value={data.appeal.title}
            placeholder='NAAC Accreditation – Appeal Towards NAAC "A Grade"'
            onChange={(e) =>
              patch({ appeal: { ...data.appeal, title: e.target.value } })
            }
          />
        </FormGrid>
      );

    case "qualitative": {
      const t = data.qualitative;
      const patchTable = (p: Partial<typeof t>) =>
        patch({ qualitative: { ...t, ...p } });
      const qualitativeBuiltins = naacQualitativeBuiltins(t.columns);
      return (
        <FormGrid>
          <TextInput
            label="Table Title"
            span={4}
            value={t.title}
            placeholder="Qualitative Parameters"
            onChange={(e) => patchTable({ title: e.target.value })}
          />
          <TextArea
            label="Table Description"
            span={8}
            rows={2}
            value={t.description}
            onChange={(e) => patchTable({ description: e.target.value })}
          />
          <Field label="Table" span="full">
            <TableEditor<NaacQualitativeRowValue>
              label="Qualitative Parameters"
              columns={resolveColumns(t.columnList, qualitativeBuiltins)}
              builtins={qualitativeBuiltins}
              rows={t.rows}
              onChange={({ columns, rows }) =>
                patchTable({
                  columnList: columnsToStore(
                    t.columnList,
                    columns,
                    qualitativeBuiltins,
                  ),
                  rows,
                })
              }
              newRow={() => ({
                metric: "",
                description: "",
                expertsMarks: "",
                marksRequested: "",
                justification: "",
                docs: [],
              })}
              hint="Supporting documents are listed under the last column."
              renderExtra={(row, oc) => (
                <DocRepeater
                  label="Supporting Documents"
                  docs={row.docs}
                  onChange={(docs) => oc({ ...row, docs })}
                />
              )}
            />
          </Field>
        </FormGrid>
      );
    }

    case "quantitative": {
      const t = data.quantitative;
      const patchTable = (p: Partial<typeof t>) =>
        patch({ quantitative: { ...t, ...p } });
      const quantitativeBuiltins = naacQuantitativeBuiltins(t.columns);
      return (
        <FormGrid>
          <TextInput
            label="Table Title"
            span={4}
            value={t.title}
            placeholder="Quantitative Parameters"
            onChange={(e) => patchTable({ title: e.target.value })}
          />
          <TextArea
            label="Table Description"
            span={8}
            rows={2}
            value={t.description}
            onChange={(e) => patchTable({ description: e.target.value })}
          />
          {/* The grouped header exists only until the columns are changed:
              a column list is drawn as one header row. */}
          {!t.columnList && (
            <Field
              label="Group headings"
              span="full"
              hint="Shown above the SSR / DVV and Awarded / Requested columns. Changing the columns below switches the table to a single header row."
            >
              <div className="admin-form-grid admin-form-grid--tight">
                <TextInput
                  label="Over SSR and DVV"
                  span={6}
                  value={t.columns.values}
                  onChange={(e) =>
                    patchTable({
                      columns: { ...t.columns, values: e.target.value },
                    })
                  }
                />
                <TextInput
                  label="Over Awarded and Requested"
                  span={6}
                  value={t.columns.marks}
                  onChange={(e) =>
                    patchTable({
                      columns: { ...t.columns, marks: e.target.value },
                    })
                  }
                />
              </div>
            </Field>
          )}
          <Field label="Table" span="full">
            <TableEditor<NaacQuantitativeRowValue>
              label="Quantitative Parameters"
              columns={resolveColumns(t.columnList, quantitativeBuiltins)}
              builtins={quantitativeBuiltins}
              rows={t.rows}
              onChange={({ columns, rows }) =>
                patchTable({
                  columnList: columnsToStore(
                    t.columnList,
                    columns,
                    quantitativeBuiltins,
                  ),
                  rows,
                })
              }
              newRow={() => ({
                metric: "",
                parameter: "",
                ssr: "",
                dvv: "",
                awarded: "",
                requested: "",
                justification: "",
                docs: [],
              })}
              hint="Supporting documents are listed under the last column."
              renderExtra={(row, oc) => (
                <DocRepeater
                  label="Supporting Documents"
                  docs={row.docs}
                  onChange={(docs) => oc({ ...row, docs })}
                />
              )}
            />
          </Field>
        </FormGrid>
      );
    }

    case "docSections":
      return (
        <Repeater<NaacDocSectionValue>
          label="Document Sections"
          itemSpan={6}
          items={data.docSections}
          onChange={(docSections) => patch({ docSections })}
          newItem={emptySection}
          renderItem={(block, i, oc) => (
            <FormGrid tight>
              <TextInput
                label="Section Title"
                span={7}
                value={block.title}
                placeholder="Extended Profile"
                onChange={(e) => oc({ ...block, title: e.target.value })}
              />
              <Select
                label="Layout"
                span={5}
                value={block.layout}
                options={[
                  { value: "cards", label: "Cards — full titles" },
                  { value: "chips", label: "Chips — short metric codes" },
                ]}
                onChange={(e) =>
                  oc({
                    ...block,
                    layout: e.target.value === "chips" ? "chips" : "cards",
                  })
                }
              />
              <TextArea
                label="Section Description"
                span="full"
                rows={2}
                value={block.description}
                onChange={(e) => oc({ ...block, description: e.target.value })}
              />
              <p className="admin-col-full text-xs text-[var(--admin-text-muted)]">
                {block.groups.length} group
                {block.groups.length === 1 ? "" : "s"} —{" "}
                {block.groups.reduce((n, g) => n + g.docs.length, 0)}{" "}
                document(s). Click section {i + 1} in the preview to edit its
                documents.
              </p>
            </FormGrid>
          )}
        />
      );

    case "sidebar":
      return (
        <>
          <p className="mb-3 text-xs text-[var(--admin-text-muted)]">
            Rename, reorder or hide the NAAC page&rsquo;s tabs — its own appeal
            panel and the Best Practices / Institutional Distinctiveness / AQAR
            pages — and add custom link or content tabs. A hosted tab stays
            hidden on the public page until that page has published content.
          </p>
          <SidebarNavEditor
            defaults={NAAC_NAV_DEFAULTS}
            value={data.sidebar?.navItems as SidebarNavItemRaw[] | undefined}
            onChange={(navItems) =>
              patch({
                sidebar: {
                  ...data.sidebar,
                  navItems: navItems as typeof data.sidebar.navItems,
                },
              })
            }
          />
        </>
      );

    default:
      return (
        <p className="text-sm text-[var(--admin-text-muted)]">
          Select a section to edit.
        </p>
      );
  }
}
