"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  NaacPageLayout,
  NAAC_SECTION_LABELS,
  NAAC_SECTION_ORDER,
  naacSectionTitle,
  type NaacEditableSection,
} from "@/components/layout/NaacPageLayout";
import { NaacSectionInspector } from "@/components/admin/NaacSectionInspector";
import { NaacPageSchema } from "@/lib/validation";
import type { NaacPageValue } from "@/lib/validation";

export default function NaacEditorPage() {
  return (
    <LivePageEditor<NaacPageValue>
      configKey="engineeringNaac"
      publicPath="/institutions/engineering/accreditations/naac"
      title="NAAC Page Editor"
      subtitle="Engineering — NAAC appeal tables and supporting documents"
      emptyValue={() => NaacPageSchema.parse({})}
      sectionOrder={NAAC_SECTION_ORDER}
      sectionLabels={NAAC_SECTION_LABELS}
      sectionTitle={naacSectionTitle}
      initialSection="primaryDocs"
      renderPreview={({ data, onEditSection }) => (
        <NaacPageLayout
          data={data}
          editable
          onEditSection={onEditSection as (s: NaacEditableSection) => void}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <NaacSectionInspector
          section={section}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}
