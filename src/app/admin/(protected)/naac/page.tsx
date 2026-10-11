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
      title="Engineering — NAAC"
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      sectionHelp={{
        hero: "The banner at the top of the page: title and subtitle.",
        intro: "The paragraph introducing the NAAC accreditation.",
        primaryDocs:
          "The main NAAC documents, such as the SSR and certificate.",
        appeal: "The heading above the appeal tables.",
        qualitative: "The qualitative parameters table.",
        quantitative: "The quantitative parameters table.",
        docSections: "Further groups of supporting documents.",
        sidebar: "The tabs down the side of the page.",
      }}
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
