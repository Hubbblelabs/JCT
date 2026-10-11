"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  CampusLifePageLayout,
  CAMPUS_LIFE_SECTION_LABELS,
  CAMPUS_LIFE_SECTION_ORDER,
  type CampusLifeEditableSection,
} from "@/components/layout/CampusLifePageLayout";
import { CampusLifeSectionInspector } from "@/components/admin/CampusLifeSectionInspector";
import { CampusLifePageSchema } from "@/lib/validation";
import type { CampusLifePageValue } from "@/lib/validation";

const SECTION_HELP: Record<CampusLifeEditableSection, string> = {
  hero: "The banner at the top of the page: title, subtitle and background.",
  experience: "The introduction to life on campus, with its photos.",
  highlights: "The photo gallery of campus highlights.",
  services:
    "Support services students can rely on — hostel, transport, health and so on.",
  sports: "Sports facilities and athletics.",
  clubs: "Clubs, culture and student activities.",
  cta: "The closing call-to-action at the bottom of the page.",
};

export default function CampusLifeEditorPage() {
  return (
    <LivePageEditor<CampusLifePageValue>
      configKey="campusLifePage"
      publicPath="/campus-life"
      title="Campus Life"
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      emptyValue={() => CampusLifePageSchema.parse({})}
      sectionOrder={CAMPUS_LIFE_SECTION_ORDER}
      sectionLabels={CAMPUS_LIFE_SECTION_LABELS}
      sectionHelp={SECTION_HELP}
      renderPreview={({ data, onEditSection }) => (
        <CampusLifePageLayout
          data={data}
          editable
          onEditSection={onEditSection}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <CampusLifeSectionInspector
          section={section as CampusLifeEditableSection}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}
