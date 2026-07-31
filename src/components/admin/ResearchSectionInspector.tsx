"use client";

import {
  Field,
  FormGrid,
  TextInput,
  TextArea,
  TextAreaList,
  StringList,
  ImageUploadInput,
  ItemsEditor,
  Repeater,
} from "@/components/admin/inputs";
import { ProgramTabsEditor } from "@/components/admin/ProgramTabsEditor";
import type { Tab } from "@/lib/program-tabs";
import type {
  ResearchPageValue,
  ResearchCentreValue,
  PublicationValue,
} from "@/lib/validation";

type Stat = ResearchPageValue["stats"][number];
type Area = ResearchPageValue["areas"][number];
type ResearchTab = ResearchPageValue["tabs"][number];

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
        <FormGrid>
          <TextInput
            label="Hero Title"
            span={5}
            value={data.hero.title}
            placeholder="Research & Innovation"
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

    // Reuses the program builder's tab editor — the Research tab shape mirrors
    // TabsProgram exactly, so the two stay editable through one component.
    case "tabs":
      return (
        <Field
          label="Sidebar tabs"
          hint="Adding a tab switches the public page to the sidebar layout; the single-column sections below are then hidden."
        >
          <ProgramTabsEditor
            tabs={data.tabs as Tab[]}
            onChange={(tabs) => patch({ tabs: tabs as ResearchTab[] })}
          />
        </Field>
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
        <Field label="Research at a Glance">
          <ItemsEditor
            items={data.stats as unknown as Record<string, unknown>[]}
            onChange={(v) => patch({ stats: v as unknown as Stat[] })}
            fields={[
              { key: "value", label: "Value", placeholder: "120+" },
              { key: "label", label: "Label", placeholder: "Publications" },
            ]}
            emptyItem={{ value: "", label: "" }}
            addLabel="Add statistic"
            cardSpan={4}
          />
        </Field>
      );

    case "areas":
      return (
        <Field label="Research Focus Areas">
          <ItemsEditor
            items={data.areas as unknown as Record<string, unknown>[]}
            onChange={(v) => patch({ areas: v as unknown as Area[] })}
            fields={[
              { key: "title", label: "Area", span: "full" },
              {
                key: "desc",
                label: "Description",
                type: "textarea",
                span: "full",
              },
            ]}
            emptyItem={{ title: "", desc: "" }}
            addLabel="Add focus area"
            cardSpan={4}
          />
        </Field>
      );

    case "centres":
      return (
        <Repeater<ResearchCentreValue>
          label="Research Centres"
          itemSpan={6}
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
            <FormGrid tight>
              <TextInput
                label="Centre Name"
                span={6}
                value={item.name}
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Head / Coordinator"
                span={6}
                value={item.head}
                onChange={(e) => oc({ ...item, head: e.target.value })}
              />
              <TextArea
                label="Description"
                span="full"
                rows={3}
                value={item.description}
                onChange={(e) => oc({ ...item, description: e.target.value })}
              />
              <ImageUploadInput
                label="Photo"
                span="full"
                ratio="card"
                value={item.image}
                onChange={(image) => oc({ ...item, image })}
                hideUrlField
              />
              <StringList
                label="Focus Tags"
                span="full"
                columns
                values={item.focus}
                onChange={(focus) => oc({ ...item, focus })}
                placeholder="e.g. Machine Learning"
              />
            </FormGrid>
          )}
        />
      );

    case "publications":
      return (
        <Repeater<PublicationValue>
          label="Publications"
          itemSpan={6}
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
            <FormGrid tight>
              <TextArea
                label="Title"
                span="full"
                rows={2}
                value={item.title}
                onChange={(e) => oc({ ...item, title: e.target.value })}
              />
              <TextInput
                label="Authors"
                span={8}
                value={item.authors}
                placeholder="R. Kumar, S. Priya"
                onChange={(e) => oc({ ...item, authors: e.target.value })}
              />
              <TextInput
                label="Year"
                span={4}
                value={item.year}
                placeholder="2026"
                onChange={(e) => oc({ ...item, year: e.target.value })}
              />
              <TextInput
                label="Journal / Conference"
                span={6}
                value={item.journal}
                onChange={(e) => oc({ ...item, journal: e.target.value })}
              />
              <TextInput
                label="Link (DOI / URL)"
                span={6}
                value={item.link}
                placeholder="https://doi.org/…"
                onChange={(e) => oc({ ...item, link: e.target.value })}
              />
            </FormGrid>
          )}
        />
      );

    default:
      return null;
  }
}
