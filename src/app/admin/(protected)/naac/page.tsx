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
import { hostedContentEditorLinks } from "@/lib/content-pages";
import { NaacPageSchema } from "@/lib/validation";
import type { NaacPageValue } from "@/lib/validation";

const PUBLIC_PATH = "/institutions/engineering/naac";

// AQAR, best practices and distinctiveness are panels of the public NAAC page
// but keep their own editors, so the preview's sidebar links across to them.
const HOSTED_LINKS = hostedContentEditorLinks(PUBLIC_PATH).map(
  ({ icon: Icon, ...rest }) => ({ ...rest, icon: <Icon /> }),
);

export default function NaacEditorPage() {
  return (
    <LivePageEditor<NaacPageValue>
      configKey="engineeringNaac"
      publicPath={PUBLIC_PATH}
      title="NAAC Page Editor"
      subtitle="Engineering — NAAC appeal tables, supporting documents and sub-page tabs"
      emptyValue={() => NaacPageSchema.parse({})}
      sectionOrder={NAAC_SECTION_ORDER}
      sectionLabels={NAAC_SECTION_LABELS}
      sectionTitle={naacSectionTitle}
      initialSection="primaryDocs"
      renderPreview={({ data, onEditSection }) => (
        <NaacPageLayout
          data={data}
          editable
          sections={HOSTED_LINKS}
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
