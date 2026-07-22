"use client";

import {
  TextInput,
  TextArea,
  TextAreaList,
  StringList,
  ImageUploadInput,
  ItemsEditor,
  Repeater,
} from "@/components/admin/inputs";
import type {
  ResearchPageValue,
  ResearchCentreValue,
  PublicationValue,
} from "@/lib/validation";

type Stat = ResearchPageValue["stats"][number];
type Area = ResearchPageValue["areas"][number];

export function ResearchSectionInspector({
  section,
  data,
  onChange,
}: {
  section: string;
  data: ResearchPageValue;
  onChange: (next: ResearchPageValue) => void;
}) {
  const patch = (p: Partial<ResearchPageValue>) => onChange({ ...data, ...p });

  switch (section) {
    case "hero":
      return (
        <>
          <TextInput
            label="Hero Title"
            value={data.hero.title}
            placeholder="Research & Innovation"
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
          placeholder="A paragraph about the research ecosystem…"
        />
      );

    case "stats":
      return (
        <>
          <div className="admin-label mb-2">Research at a Glance</div>
          <ItemsEditor
            items={data.stats as unknown as Record<string, unknown>[]}
            onChange={(v) => patch({ stats: v as unknown as Stat[] })}
            fields={[
              { key: "value", label: "Value", placeholder: "120+" },
              { key: "label", label: "Label", placeholder: "Publications" },
            ]}
            emptyItem={{ value: "", label: "" }}
            addLabel="Add statistic"
          />
        </>
      );

    case "areas":
      return (
        <>
          <div className="admin-label mb-2">Research Focus Areas</div>
          <ItemsEditor
            items={data.areas as unknown as Record<string, unknown>[]}
            onChange={(v) => patch({ areas: v as unknown as Area[] })}
            fields={[
              { key: "title", label: "Area", span2: true },
              {
                key: "desc",
                label: "Description",
                type: "textarea",
                span2: true,
              },
            ]}
            emptyItem={{ title: "", desc: "" }}
            addLabel="Add focus area"
          />
        </>
      );

    case "centres":
      return (
        <Repeater<ResearchCentreValue>
          label="Research Centres"
          items={data.centres}
          onChange={(centres) => patch({ centres })}
          newItem={() => ({
            name: "",
            head: "",
            description: "",
            image: "",
            focus: [],
          })}
          renderItem={(item, _i, oc) => (
            <div className="space-y-1">
              <TextInput
                label="Centre Name"
                value={item.name}
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Head / Coordinator"
                value={item.head}
                onChange={(e) => oc({ ...item, head: e.target.value })}
              />
              <TextArea
                label="Description"
                rows={3}
                value={item.description}
                onChange={(e) => oc({ ...item, description: e.target.value })}
              />
              <ImageUploadInput
                label="Photo"
                ratio="card"
                value={item.image}
                onChange={(image) => oc({ ...item, image })}
                hideUrlField
              />
              <StringList
                label="Focus Tags"
                values={item.focus}
                onChange={(focus) => oc({ ...item, focus })}
                placeholder="e.g. Machine Learning"
              />
            </div>
          )}
        />
      );

    case "publications":
      return (
        <Repeater<PublicationValue>
          label="Publications"
          items={data.publications}
          onChange={(publications) => patch({ publications })}
          newItem={() => ({
            title: "",
            authors: "",
            journal: "",
            year: "",
            link: "",
          })}
          renderItem={(item, _i, oc) => (
            <div className="space-y-1">
              <TextArea
                label="Title"
                rows={2}
                value={item.title}
                onChange={(e) => oc({ ...item, title: e.target.value })}
              />
              <TextInput
                label="Authors"
                value={item.authors}
                placeholder="R. Kumar, S. Priya"
                onChange={(e) => oc({ ...item, authors: e.target.value })}
              />
              <TextInput
                label="Journal / Conference"
                value={item.journal}
                onChange={(e) => oc({ ...item, journal: e.target.value })}
              />
              <TextInput
                label="Year"
                value={item.year}
                placeholder="2026"
                onChange={(e) => oc({ ...item, year: e.target.value })}
              />
              <TextInput
                label="Link (DOI / URL)"
                value={item.link}
                placeholder="https://doi.org/…"
                onChange={(e) => oc({ ...item, link: e.target.value })}
              />
            </div>
          )}
        />
      );

    default:
      return null;
  }
}
