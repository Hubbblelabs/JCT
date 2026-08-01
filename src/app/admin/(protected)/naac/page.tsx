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
import { hostedPanelItems } from "@/components/admin/hosted-content";
import { hostedContentPages } from "@/lib/content-pages";
import { NaacPageSchema } from "@/lib/validation";
import type { NaacPageValue } from "@/lib/validation";

const PUBLIC_PATH = "/institutions/engineering/naac";

// Best practices, institutional distinctiveness and AQAR are panels of this
// page and are edited right here — the preview renders their real content,
// every block click-to-edit, and one Save writes the lot.
const HOSTED_DEFS = hostedContentPages(PUBLIC_PATH);

export default function NaacEditorPage() {
  return (
    <LivePageEditor<NaacPageValue>
      configKey="engineeringNaac"
      publicPath={PUBLIC_PATH}
      title="NAAC Page Editor"
      subtitle="Engineering — appeal tables, documents, and the Best Practices / Distinctiveness / AQAR tabs"
      emptyValue={() => NaacPageSchema.parse({})}
      sectionOrder={NAAC_SECTION_ORDER}
      sectionLabels={NAAC_SECTION_LABELS}
      sectionTitle={naacSectionTitle}
      initialSection="primaryDocs"
      renderPreview={({ data, hosted, onEditSection }) => (
        <NaacPageLayout
          data={data}
          editable
          sections={hostedPanelItems(HOSTED_DEFS, hosted, onEditSection)}
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
