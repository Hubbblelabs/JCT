"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  DocumentsPageLayout,
  DOCUMENTS_SECTION_LABELS,
  DOCUMENTS_SECTION_ORDER,
  type DocumentsEditableSection,
} from "@/components/layout/DocumentsPageLayout";
import { DocumentsSectionInspector } from "@/components/admin/DocumentsSectionInspector";
import { hostedPanelItems } from "@/components/admin/hosted-content";
import { hostedContentPages } from "@/lib/content-pages";
import { DocumentsPageSchema } from "@/lib/validation";
import type { DocumentsPageValue } from "@/lib/validation";

const PUBLIC_PATH = "/institutions/engineering/documents";

// NIRF, financial statements and ICT content are panels of this page and are
// edited right here — the preview renders their real content, every block
// click-to-edit, and one Save writes the lot.
const HOSTED_DEFS = hostedContentPages(PUBLIC_PATH);

export default function DocumentsEditorPage() {
  return (
    <LivePageEditor<DocumentsPageValue>
      configKey="engineeringDocuments"
      publicPath={PUBLIC_PATH}
      title="Reports & Downloads Editor"
      subtitle="Engineering — downloads and the NIRF / financial statements / ICT content tabs"
      emptyValue={() => DocumentsPageSchema.parse({})}
      sectionOrder={DOCUMENTS_SECTION_ORDER}
      sectionLabels={DOCUMENTS_SECTION_LABELS}
      initialSection="categories"
      renderPreview={({ data, hosted, onEditSection }) => (
        <DocumentsPageLayout
          data={data}
          editable
          sections={hostedPanelItems(HOSTED_DEFS, hosted, onEditSection)}
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
