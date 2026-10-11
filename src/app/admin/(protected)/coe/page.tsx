"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  CoePageLayout,
  COE_SECTION_LABELS,
  COE_SECTION_ORDER,
  type CoeEditableSection,
} from "@/components/layout/CoePageLayout";
import { CoeSectionInspector } from "@/components/admin/CoeSectionInspector";
import { CoePageSchema } from "@/lib/validation";
import type { CoePageValue } from "@/lib/validation";

const SECTION_HELP: Record<CoeEditableSection, string> = {
  hero: "The banner at the top of the page: title and subtitle.",
  overview: "Introduction to the Office of the Controller of Examinations.",
  responsibilities: "The list of what the CoE office is responsible for.",
  obe: "How Outcome Based Education is practised, with its key points.",
  academicCalendar: "The academic calendar documents students can download.",
  downloads: "Circulars, forms and other files students can download.",
  sidebar: "The side panel: quick facts, the contact button and extra links.",
};

/** Inspector heading — custom sidebar pages are titled by their own label. */
function sectionTitle(section: string, data: CoePageValue): string {
  if (section.startsWith("custom:")) {
    const anchor = section.slice("custom:".length);
    const item = (data.sidebar.navItems ?? []).find(
      (it) => (it.id || "") === anchor,
    );
    return item?.label?.trim() || "Custom Section";
  }
  return COE_SECTION_LABELS[section as CoeEditableSection] ?? "Section";
}

export default function CoeEditorPage() {
  return (
    <LivePageEditor<CoePageValue>
      configKey="engineeringCoe"
      publicPath="/institutions/engineering/coe"
      title="Controller of Examination"
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      emptyValue={() => CoePageSchema.parse({}) as CoePageValue}
      sectionOrder={COE_SECTION_ORDER}
      sectionLabels={COE_SECTION_LABELS}
      sectionHelp={SECTION_HELP}
      sectionTitle={sectionTitle}
      renderPreview={({ data, onEditSection }) => (
        <CoePageLayout data={data} editable onEditSection={onEditSection} />
      )}
      renderInspector={({ section, data, onChange }) => (
        <CoeSectionInspector
          section={section}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}
