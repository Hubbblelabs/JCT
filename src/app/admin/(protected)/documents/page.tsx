"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  DocumentsPageLayout,
  DOCUMENTS_SECTION_LABELS,
  DOCUMENTS_SECTION_ORDER,
  type DocumentsEditableSection,
} from "@/components/layout/DocumentsPageLayout";
import { DocumentsSectionInspector } from "@/components/admin/DocumentsSectionInspector";
import { DocumentsPageSchema } from "@/lib/validation";
import type { DocumentsPageValue } from "@/lib/validation";

export default function DocumentsEditorPage() {
  return (
    <LivePageEditor<DocumentsPageValue>
      configKey="engineeringDocuments"
      publicPath="/institutions/engineering/documents"
      title="Documents Page Editor"
      subtitle="Engineering — upload and organise downloadable documents"
      emptyValue={() => DocumentsPageSchema.parse({})}
      sectionOrder={DOCUMENTS_SECTION_ORDER}
      sectionLabels={DOCUMENTS_SECTION_LABELS}
      initialSection="categories"
      renderPreview={({ data, onEditSection }) => (
        <DocumentsPageLayout
          data={data}
          editable
          onEditSection={onEditSection as (s: DocumentsEditableSection) => void}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <DocumentsSectionInspector
          section={section}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}
