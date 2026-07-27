"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  DocumentsPageLayout,
  DOCUMENTS_SECTION_LABELS,
  DOCUMENTS_SECTION_ORDER,
  type DocumentsEditableSection,
} from "@/components/layout/DocumentsPageLayout";
import { DocumentsSectionInspector } from "@/components/admin/DocumentsSectionInspector";
import { hostedContentEditorLinks } from "@/lib/content-pages";
import { DocumentsPageSchema } from "@/lib/validation";
import type { DocumentsPageValue } from "@/lib/validation";

const PUBLIC_PATH = "/institutions/engineering/documents";

// NIRF, financial statements and ICT content are panels of the public
// Documents page but keep their own editors, so the preview's sidebar links
// across to them.
const HOSTED_LINKS = hostedContentEditorLinks(PUBLIC_PATH).map(
  ({ icon: Icon, ...rest }) => ({ ...rest, icon: <Icon /> }),
);

export default function DocumentsEditorPage() {
  return (
    <LivePageEditor<DocumentsPageValue>
      configKey="engineeringDocuments"
      publicPath={PUBLIC_PATH}
      title="Documents Page Editor"
      subtitle="Engineering — downloads and the NIRF / financial / ICT tabs"
      emptyValue={() => DocumentsPageSchema.parse({})}
      sectionOrder={DOCUMENTS_SECTION_ORDER}
      sectionLabels={DOCUMENTS_SECTION_LABELS}
      initialSection="categories"
      renderPreview={({ data, onEditSection }) => (
        <DocumentsPageLayout
          data={data}
          editable
          sections={HOSTED_LINKS}
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
