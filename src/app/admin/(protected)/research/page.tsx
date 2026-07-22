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
      title="Research Page Editor"
      subtitle="Engineering — click any section to edit"
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
