"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  ResearchPageLayout,
  RESEARCH_SECTION_LABELS,
  RESEARCH_SECTION_ORDER,
  type ResearchEditableSection,
} from "@/components/layout/ResearchPageLayout";
import { ResearchSectionInspector } from "@/components/admin/ResearchSectionInspector";
import { ResearchPageSchema } from "@/lib/validation";
import type { ResearchPageValue } from "@/lib/validation";

export default function ResearchEditorPage() {
  return (
    <LivePageEditor<ResearchPageValue>
      configKey="engineeringResearch"
      publicPath="/institutions/engineering/research"
      title="Engineering — Research"
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      sectionHelp={{
        hero: "The banner at the top of the page: title and subtitle.",
        tabs: "The tabs down the side of the page, and the content of any tab you add.",
        intro: "The paragraphs introducing research at the college.",
        stats: "The headline research numbers.",
        areas: "The research focus areas.",
        centres: "The research centres and what each one does.",
        publications: "Published papers, patents and similar output.",
      }}
      emptyValue={() => ResearchPageSchema.parse({})}
      sectionOrder={RESEARCH_SECTION_ORDER}
      sectionLabels={RESEARCH_SECTION_LABELS}
      initialSection="hero"
      renderPreview={({ data, onEditSection }) => (
        <ResearchPageLayout
          data={data}
          editable
          onEditSection={onEditSection as (s: ResearchEditableSection) => void}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <ResearchSectionInspector
          section={section}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}
