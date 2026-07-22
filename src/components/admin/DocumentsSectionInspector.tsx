"use client";

import {
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
        <>
          <TextInput
            label="Hero Title"
            value={data.hero.title}
            placeholder="Documents & Downloads"
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
            <div className="space-y-1">
              <TextInput
                label="Category Title"
                value={category.title}
                placeholder="Mandatory Disclosures"
                onChange={(e) =>
                  ocCategory({ ...category, title: e.target.value })
                }
              />
              <TextArea
                label="Category Description"
                rows={2}
                value={category.description}
                onChange={(e) =>
                  ocCategory({ ...category, description: e.target.value })
                }
              />
              <Repeater<DocumentItemValue>
                label="Documents"
                items={category.documents}
                onChange={(documents) => ocCategory({ ...category, documents })}
                newItem={() => ({
                  title: "",
                  description: "",
                  file: "",
                  updatedOn: "",
                })}
                renderItem={(doc, _j, ocDoc) => (
                  <div className="space-y-1">
                    <TextInput
                      label="Document Title"
                      value={doc.title}
                      onChange={(e) => ocDoc({ ...doc, title: e.target.value })}
                    />
                    <TextArea
                      label="Description"
                      rows={2}
                      value={doc.description}
                      onChange={(e) =>
                        ocDoc({ ...doc, description: e.target.value })
                      }
                    />
                    <DocumentUploadInput
                      label="File (PDF)"
                      value={doc.file}
                      onChange={(file) => ocDoc({ ...doc, file })}
                      hint="Upload the document — its link powers the Download button."
                    />
                    <TextInput
                      label="Last Updated (optional)"
                      value={doc.updatedOn}
                      placeholder="Jul 2026"
                      onChange={(e) =>
                        ocDoc({ ...doc, updatedOn: e.target.value })
                      }
                    />
                  </div>
                )}
              />
            </div>
          )}
        />
      );

    default:
      return null;
  }
}
