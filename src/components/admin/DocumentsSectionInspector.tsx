"use client";

import {
  FormGrid,
  TextInput,
  TextArea,
  TextAreaList,
  DocumentUploadInput,
  Repeater,
} from "@/components/admin/inputs";
import type {
  DocumentsPageValue,
  DocumentCategoryValue,
  DocumentItemValue,
} from "@/lib/validation";

export function DocumentsSectionInspector({
  section,
  data,
  onChange,
}: {
  section: string;
  data: DocumentsPageValue;
  onChange: (next: DocumentsPageValue) => void;
}) {
  const patch = (p: Partial<DocumentsPageValue>) => onChange({ ...data, ...p });

  switch (section) {
    case "hero":
      return (
        <FormGrid>
          <TextInput
            label="Hero Title"
            span={5}
            value={data.hero.title}
            placeholder="Documents & Downloads"
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
          placeholder="A paragraph about the documents published here…"
        />
      );

    case "categories":
      return (
        <Repeater<DocumentCategoryValue>
          label="Document Categories"
          items={data.categories}
          onChange={(categories) => patch({ categories })}
          newItem={() => ({ title: "", description: "", documents: [] })}
          renderItem={(category, _i, ocCategory) => (
            <FormGrid tight>
              <TextInput
                label="Category Title"
                span={4}
                value={category.title}
                placeholder="Audit Reports"
                onChange={(e) =>
                  ocCategory({ ...category, title: e.target.value })
                }
              />
              <TextArea
                label="Category Description"
                span={8}
                rows={2}
                value={category.description}
                onChange={(e) =>
                  ocCategory({ ...category, description: e.target.value })
                }
              />
              <Repeater<DocumentItemValue>
                label="Documents"
                span="full"
                itemSpan={6}
                items={category.documents}
                onChange={(documents) => ocCategory({ ...category, documents })}
                newItem={() => ({
                  title: "",
                  description: "",
                  file: "",
                  updatedOn: "",
                })}
                renderItem={(doc, _j, ocDoc) => (
                  <FormGrid tight>
                    <TextInput
                      label="Document Title"
                      span={8}
                      value={doc.title}
                      placeholder="Campus Security Audit Report 2026"
                      onChange={(e) => ocDoc({ ...doc, title: e.target.value })}
                    />
                    <TextInput
                      label="Last Updated (optional)"
                      span={4}
                      value={doc.updatedOn}
                      placeholder="Jul 2026"
                      onChange={(e) =>
                        ocDoc({ ...doc, updatedOn: e.target.value })
                      }
                    />
                    <TextArea
                      label="Description"
                      span="full"
                      rows={2}
                      value={doc.description}
                      onChange={(e) =>
                        ocDoc({ ...doc, description: e.target.value })
                      }
                    />
                    <DocumentUploadInput
                      label="File (PDF)"
                      span="full"
                      value={doc.file}
                      onChange={(file) => ocDoc({ ...doc, file })}
                      hint="Upload the document — its link powers the Download button."
                    />
                  </FormGrid>
                )}
              />
            </FormGrid>
          )}
        />
      );

    default:
      return null;
  }
}
