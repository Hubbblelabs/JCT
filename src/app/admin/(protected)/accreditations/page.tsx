"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  AccreditationsPageLayout,
  ACCREDITATIONS_SECTION_LABELS,
  ACCREDITATIONS_SECTION_ORDER,
  type AccreditationsEditableSection,
} from "@/components/layout/AccreditationsPageLayout";
import { AccreditationsSectionInspector } from "@/components/admin/AccreditationsSectionInspector";
import { AccreditationsPageSchema } from "@/lib/validation";
import type { AccreditationsPageValue } from "@/lib/validation";

type Institution = "main" | "engineering" | "arts-science" | "polytechnic";

const INSTITUTION_MAP: Record<
  string,
  {
    institution: Institution;
    configKey: string;
    publicPath: string;
    label: string;
  }
> = {
  main: {
    institution: "main",
    configKey: "mainAccreditations",
    publicPath: "/accreditations",
    label: "JCT Institutions",
  },
  engineering: {
    institution: "engineering",
    configKey: "engineeringAccreditations",
    publicPath: "/institutions/engineering/accreditations",
    label: "Engineering",
  },
  "arts-science": {
    institution: "arts-science",
    configKey: "artsScienceAccreditations",
    publicPath: "/institutions/arts-science/accreditations",
    label: "Arts & Science",
  },
  polytechnic: {
    institution: "polytechnic",
    configKey: "polytechnicAccreditations",
    publicPath: "/institutions/polytechnic/accreditations",
    label: "Polytechnic",
  },
};

const SECTION_HELP: Record<AccreditationsEditableSection, string> = {
  hero: "The banner at the top of the page: title and subtitle.",
  intro: "The paragraph introducing the college's approvals and affiliations.",
  items:
    "Each accreditation or affiliation: its logo, name, description and certificate.",
};

function AccreditationsEditor() {
  const searchParams = useSearchParams();
  const college = searchParams.get("college") ?? "engineering";
  const { institution, configKey, publicPath, label } =
    INSTITUTION_MAP[college] ?? INSTITUTION_MAP["engineering"];

  return (
    <LivePageEditor<AccreditationsPageValue>
      // A college switch is a different document: start fresh.
      key={configKey}
      configKey={configKey}
      publicPath={publicPath}
      title={`${label} — Affiliation & Accreditation`}
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      emptyValue={() => AccreditationsPageSchema.parse({})}
      sectionOrder={ACCREDITATIONS_SECTION_ORDER}
      sectionLabels={ACCREDITATIONS_SECTION_LABELS}
      sectionHelp={SECTION_HELP}
      renderPreview={({ data, onEditSection }) => (
        <AccreditationsPageLayout
          data={data}
          institution={institution}
          editable
          onEditSection={onEditSection}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <AccreditationsSectionInspector
          section={section as AccreditationsEditableSection}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}

export default function AccreditationsEditorPage() {
  return (
    <Suspense fallback={null}>
      <AccreditationsEditor />
    </Suspense>
  );
}
