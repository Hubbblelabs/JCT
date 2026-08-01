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
        <p className="text-sm text-gray-500">
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
      return <p className="text-sm text-gray-500">Section removed.</p>;
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
          {/* Column headings edit in the order the table renders them. */}
          <Field label="Column Headings" span="full">
            <div className="admin-form-grid admin-form-grid--tight rounded-lg border border-gray-200 p-3">
              <TextInput
                label="Metrics"
                span={2}
                value={t.columns.metric}
                onChange={(e) =>
                  patchTable({
                    columns: { ...t.columns, metric: e.target.value },
                  })
                }
              />
              <TextInput
                label="Description"
                span={3}
                value={t.columns.description}
                onChange={(e) =>
                  patchTable({
                    columns: { ...t.columns, description: e.target.value },
                  })
                }
              />
              <TextInput
                label="Experts Marks"
                span={2}
                value={t.columns.expertsMarks}
                onChange={(e) =>
                  patchTable({
                    columns: { ...t.columns, expertsMarks: e.target.value },
                  })
                }
              />
              <TextInput
                label="Marks Requested"
                span={2}
                value={t.columns.marksRequested}
                onChange={(e) =>
                  patchTable({
                    columns: { ...t.columns, marksRequested: e.target.value },
                  })
                }
              />
              <TextInput
                label="Justification"
                span={3}
                value={t.columns.justification}
                onChange={(e) =>
                  patchTable({
                    columns: { ...t.columns, justification: e.target.value },
                  })
                }
              />
            </div>
          </Field>
          <Repeater<NaacQualitativeRowValue>
            label="Rows"
            span="full"
            items={t.rows}
            onChange={(rows) => patchTable({ rows })}
            newItem={() => ({
              metric: "",
              description: "",
              expertsMarks: "",
              marksRequested: "",
              justification: "",
              docs: [],
            })}
            renderItem={(row, _i, oc) => (
              <FormGrid tight>
                <TextInput
                  label="Metric"
                  span={2}
                  value={row.metric}
                  placeholder="2.2.1"
                  onChange={(e) => oc({ ...row, metric: e.target.value })}
                />
                <TextArea
                  label="Description"
                  span={6}
                  rows={2}
                  value={row.description}
                  onChange={(e) => oc({ ...row, description: e.target.value })}
                />
                <TextInput
                  label="Experts Marks"
                  span={2}
                  value={row.expertsMarks}
                  placeholder="2"
                  onChange={(e) => oc({ ...row, expertsMarks: e.target.value })}
                />
                <TextInput
                  label="Marks Requested"
                  span={2}
                  value={row.marksRequested}
                  placeholder="4"
                  onChange={(e) =>
                    oc({ ...row, marksRequested: e.target.value })
                  }
                />
                <TextArea
                  label="Justification"
                  span="full"
                  rows={2}
                  value={row.justification}
                  onChange={(e) =>
                    oc({ ...row, justification: e.target.value })
                  }
                />
                <DocRepeater
                  label="Supporting Documents"
                  docs={row.docs}
                  onChange={(docs) => oc({ ...row, docs })}
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );
    }

    case "quantitative": {
      const t = data.quantitative;
      const patchTable = (p: Partial<typeof t>) =>
        patch({ quantitative: { ...t, ...p } });
      const col = (
        key: keyof typeof t.columns,
        label: string,
        span: FieldSpan,
      ) => (
        <TextInput
          label={label}
          span={span}
          value={t.columns[key]}
          onChange={(e) =>
            patchTable({ columns: { ...t.columns, [key]: e.target.value } })
          }
        />
      );
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
          <Field label="Column Headings" span="full">
            <div className="admin-form-grid admin-form-grid--tight rounded-lg border border-gray-200 p-3">
              {col("metric", "Metrics", 3)}
              {col("parameter", "Parameter", 5)}
              {col("values", "Values (group heading)", 2)}
              {col("marks", "Marks (group heading)", 2)}
              {col("ssr", "SSR", 3)}
              {col("dvv", "DVV", 3)}
              {col("awarded", "Awarded", 3)}
              {col("requested", "Requested", 3)}
              {col("justification", "Justification", "full")}
            </div>
          </Field>
          <Repeater<NaacQuantitativeRowValue>
            label="Rows"
            span="full"
            items={t.rows}
            onChange={(rows) => patchTable({ rows })}
            newItem={() => ({
              metric: "",
              parameter: "",
              ssr: "",
              dvv: "",
              awarded: "",
              requested: "",
              justification: "",
              docs: [],
            })}
            renderItem={(row, _i, oc) => (
              <FormGrid tight>
                <TextInput
                  label="Metric"
                  span={3}
                  value={row.metric}
                  placeholder="3.4.3"
                  onChange={(e) => oc({ ...row, metric: e.target.value })}
                />
                <TextArea
                  label="Parameter"
                  span={9}
                  rows={2}
                  value={row.parameter}
                  onChange={(e) => oc({ ...row, parameter: e.target.value })}
                />
                <TextInput
                  label="SSR Values"
                  span={3}
                  value={row.ssr}
                  placeholder="11/10/5/4/4, 30"
                  onChange={(e) => oc({ ...row, ssr: e.target.value })}
                />
                <TextInput
                  label="DVV Values"
                  span={3}
                  value={row.dvv}
                  placeholder="5/8/4/2/3, 22"
                  onChange={(e) => oc({ ...row, dvv: e.target.value })}
                />
                <TextInput
                  label="Marks Awarded"
                  span={3}
                  value={row.awarded}
                  placeholder="1"
                  onChange={(e) => oc({ ...row, awarded: e.target.value })}
                />
                <TextInput
                  label="Marks Requested"
                  span={3}
                  value={row.requested}
                  placeholder="2"
                  onChange={(e) => oc({ ...row, requested: e.target.value })}
                />
                <TextArea
                  label="Justification"
                  span="full"
                  rows={2}
                  value={row.justification}
                  onChange={(e) =>
                    oc({ ...row, justification: e.target.value })
                  }
                />
                <DocRepeater
                  label="Supporting Documents"
                  docs={row.docs}
                  onChange={(docs) => oc({ ...row, docs })}
                />
              </FormGrid>
            )}
          />
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
              <p className="admin-col-full text-xs text-gray-500">
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
          <p className="mb-3 text-xs text-gray-500">
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
      return <p className="text-sm text-gray-500">Select a section to edit.</p>;
  }
}
