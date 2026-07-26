"use client";

import {
  TextInput,
  TextArea,
  TextAreaList,
  DocumentUploadInput,
  Select,
  Repeater,
} from "@/components/admin/inputs";
import type {
  NaacDocGroupValue,
  NaacDocSectionValue,
  NaacDocValue,
  NaacPageValue,
  NaacQualitativeRowValue,
  NaacQuantitativeRowValue,
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
}: {
  label: string;
  docs: NaacDocValue[];
  onChange: (docs: NaacDocValue[]) => void;
}) {
  return (
    <Repeater<NaacDocValue>
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
            placeholder="2.4.1 Average percentage of full time teachers…"
            onChange={(e) => oc({ ...doc, label: e.target.value })}
          />
          <DocumentUploadInput
            label="File (PDF)"
            value={doc.file}
            onChange={(file) => oc({ ...doc, file })}
            hint="Upload the document — its link powers the Download button."
          />
        </div>
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
      <>
        <TextInput
          label="Section Title"
          value={block.title}
          placeholder="Extended Profile"
          onChange={(e) =>
            patchDocSection(index, { ...block, title: e.target.value })
          }
        />
        <TextArea
          label="Section Description"
          rows={2}
          value={block.description}
          onChange={(e) =>
            patchDocSection(index, { ...block, description: e.target.value })
          }
        />
        <Select
          label="Layout"
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
          items={block.groups}
          onChange={(groups) => patchDocSection(index, { ...block, groups })}
          newItem={emptyGroup}
          renderItem={(group, _i, ocGroup) => (
            <div className="space-y-1">
              <TextInput
                label="Group Title"
                value={group.title}
                placeholder="Criterion 1"
                onChange={(e) => ocGroup({ ...group, title: e.target.value })}
              />
              <DocRepeater
                label="Documents"
                docs={group.docs}
                onChange={(docs) => ocGroup({ ...group, docs })}
              />
            </div>
          )}
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
            placeholder="National Assessment and Accreditation Council (NAAC)"
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
        <>
          <TextInput
            label="Section Title (optional)"
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
        </>
      );

    case "appeal":
      return (
        <>
          <TextInput
            label="Badge Text"
            value={data.appeal.badge}
            placeholder="Appeal Documents"
            onChange={(e) =>
              patch({ appeal: { ...data.appeal, badge: e.target.value } })
            }
          />
          <TextArea
            label="Heading"
            rows={2}
            value={data.appeal.title}
            placeholder='NAAC Accreditation – Appeal Towards NAAC "A Grade"'
            onChange={(e) =>
              patch({ appeal: { ...data.appeal, title: e.target.value } })
            }
          />
        </>
      );

    case "qualitative": {
      const t = data.qualitative;
      const patchTable = (p: Partial<typeof t>) =>
        patch({ qualitative: { ...t, ...p } });
      return (
        <>
          <TextInput
            label="Table Title"
            value={t.title}
            placeholder="Qualitative Parameters"
            onChange={(e) => patchTable({ title: e.target.value })}
          />
          <TextArea
            label="Table Description"
            rows={2}
            value={t.description}
            onChange={(e) => patchTable({ description: e.target.value })}
          />
          <div className="mb-4 rounded-lg border border-gray-200 p-3">
            <p className="admin-label mb-2">Column Headings</p>
            <TextInput
              label="Metrics"
              value={t.columns.metric}
              onChange={(e) =>
                patchTable({
                  columns: { ...t.columns, metric: e.target.value },
                })
              }
            />
            <TextInput
              label="Description"
              value={t.columns.description}
              onChange={(e) =>
                patchTable({
                  columns: { ...t.columns, description: e.target.value },
                })
              }
            />
            <TextInput
              label="Experts Marks"
              value={t.columns.expertsMarks}
              onChange={(e) =>
                patchTable({
                  columns: { ...t.columns, expertsMarks: e.target.value },
                })
              }
            />
            <TextInput
              label="Marks Requested"
              value={t.columns.marksRequested}
              onChange={(e) =>
                patchTable({
                  columns: { ...t.columns, marksRequested: e.target.value },
                })
              }
            />
            <TextInput
              label="Justification"
              value={t.columns.justification}
              onChange={(e) =>
                patchTable({
                  columns: { ...t.columns, justification: e.target.value },
                })
              }
            />
          </div>
          <Repeater<NaacQualitativeRowValue>
            label="Rows"
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
              <div className="space-y-1">
                <TextInput
                  label="Metric"
                  value={row.metric}
                  placeholder="2.2.1"
                  onChange={(e) => oc({ ...row, metric: e.target.value })}
                />
                <TextArea
                  label="Description"
                  rows={3}
                  value={row.description}
                  onChange={(e) => oc({ ...row, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    label="Experts Marks"
                    value={row.expertsMarks}
                    placeholder="2"
                    onChange={(e) =>
                      oc({ ...row, expertsMarks: e.target.value })
                    }
                  />
                  <TextInput
                    label="Marks Requested"
                    value={row.marksRequested}
                    placeholder="4"
                    onChange={(e) =>
                      oc({ ...row, marksRequested: e.target.value })
                    }
                  />
                </div>
                <TextArea
                  label="Justification"
                  rows={3}
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
              </div>
            )}
          />
        </>
      );
    }

    case "quantitative": {
      const t = data.quantitative;
      const patchTable = (p: Partial<typeof t>) =>
        patch({ quantitative: { ...t, ...p } });
      const col = (key: keyof typeof t.columns, label: string) => (
        <TextInput
          label={label}
          value={t.columns[key]}
          onChange={(e) =>
            patchTable({ columns: { ...t.columns, [key]: e.target.value } })
          }
        />
      );
      return (
        <>
          <TextInput
            label="Table Title"
            value={t.title}
            placeholder="Quantitative Parameters"
            onChange={(e) => patchTable({ title: e.target.value })}
          />
          <TextArea
            label="Table Description"
            rows={2}
            value={t.description}
            onChange={(e) => patchTable({ description: e.target.value })}
          />
          <div className="mb-4 rounded-lg border border-gray-200 p-3">
            <p className="admin-label mb-2">Column Headings</p>
            {col("metric", "Metrics")}
            {col("parameter", "Parameter")}
            {col("values", "Values (group heading)")}
            {col("marks", "Marks (group heading)")}
            {col("ssr", "SSR")}
            {col("dvv", "DVV")}
            {col("awarded", "Awarded")}
            {col("requested", "Requested")}
            {col("justification", "Justification")}
          </div>
          <Repeater<NaacQuantitativeRowValue>
            label="Rows"
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
              <div className="space-y-1">
                <TextInput
                  label="Metric"
                  value={row.metric}
                  placeholder="3.4.3"
                  onChange={(e) => oc({ ...row, metric: e.target.value })}
                />
                <TextArea
                  label="Parameter"
                  rows={2}
                  value={row.parameter}
                  onChange={(e) => oc({ ...row, parameter: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    label="SSR Values"
                    value={row.ssr}
                    placeholder="11/10/5/4/4, 30"
                    onChange={(e) => oc({ ...row, ssr: e.target.value })}
                  />
                  <TextInput
                    label="DVV Values"
                    value={row.dvv}
                    placeholder="5/8/4/2/3, 22"
                    onChange={(e) => oc({ ...row, dvv: e.target.value })}
                  />
                  <TextInput
                    label="Marks Awarded"
                    value={row.awarded}
                    placeholder="1"
                    onChange={(e) => oc({ ...row, awarded: e.target.value })}
                  />
                  <TextInput
                    label="Marks Requested"
                    value={row.requested}
                    placeholder="2"
                    onChange={(e) => oc({ ...row, requested: e.target.value })}
                  />
                </div>
                <TextArea
                  label="Justification"
                  rows={3}
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
              </div>
            )}
          />
        </>
      );
    }

    case "docSections":
      return (
        <Repeater<NaacDocSectionValue>
          label="Document Sections"
          items={data.docSections}
          onChange={(docSections) => patch({ docSections })}
          newItem={emptySection}
          renderItem={(block, i, oc) => (
            <div className="space-y-1">
              <TextInput
                label="Section Title"
                value={block.title}
                placeholder="Extended Profile"
                onChange={(e) => oc({ ...block, title: e.target.value })}
              />
              <TextArea
                label="Section Description"
                rows={2}
                value={block.description}
                onChange={(e) => oc({ ...block, description: e.target.value })}
              />
              <Select
                label="Layout"
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
              <p className="text-xs text-gray-500">
                {block.groups.length} group
                {block.groups.length === 1 ? "" : "s"} —{" "}
                {block.groups.reduce((n, g) => n + g.docs.length, 0)}{" "}
                document(s). Click section {i + 1} in the preview to edit its
                documents.
              </p>
            </div>
          )}
        />
      );

    default:
      return <p className="text-sm text-gray-500">Select a section to edit.</p>;
  }
}
