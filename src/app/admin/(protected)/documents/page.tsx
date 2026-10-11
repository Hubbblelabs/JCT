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
      title="Engineering — Reports & Downloads"
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      sectionHelp={{
        hero: "The banner at the top of the page: title and subtitle.",
        intro: "The paragraph introducing the downloads.",
        categories:
          "The groups of downloadable files. Add a category, then add files to it.",
      }}
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
