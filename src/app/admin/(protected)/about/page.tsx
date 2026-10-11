"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  AboutPageLayout,
  ABOUT_SECTION_LABELS,
  ABOUT_SECTION_ORDER,
  type AboutEditableSection,
  type AboutHostedItem,
} from "@/components/layout/AboutPageLayout";
import { AboutSectionInspector } from "@/components/admin/AboutSectionInspector";
import { hostedContentPages } from "@/lib/content-pages";
import {
  EngineeringAboutSchema,
  ArtsScienceAboutSchema,
  PolytechnicAboutSchema,
  MainAboutSchema,
} from "@/lib/validation";
import type { AboutPageValue } from "@/lib/validation";

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
    configKey: "mainAbout",
    publicPath: "/about-us",
    label: "JCT Institutions",
  },
  engineering: {
    institution: "engineering",
    configKey: "engineeringAbout",
    publicPath: "/institutions/engineering/about",
    label: "Engineering",
  },
  "arts-science": {
    institution: "arts-science",
    configKey: "artsScienceAbout",
    publicPath: "/institutions/arts-science/about",
    label: "Arts & Science",
  },
  polytechnic: {
    institution: "polytechnic",
    configKey: "polytechnicAbout",
    publicPath: "/institutions/polytechnic/about",
    label: "Polytechnic",
  },
};

function getDefaultDraft(institution: Institution): AboutPageValue {
  if (institution === "main")
    return MainAboutSchema.parse({}) as AboutPageValue;
  if (institution === "arts-science")
    return ArtsScienceAboutSchema.parse({}) as AboutPageValue;
  if (institution === "polytechnic")
    return PolytechnicAboutSchema.parse({}) as AboutPageValue;
  return EngineeringAboutSchema.parse({}) as AboutPageValue;
}

const SECTION_HELP: Record<AboutEditableSection, string> = {
  hero: "The banner at the top of the page: title, subtitle and background.",
  about: "The main introduction to the institution.",
  visionMission: "The vision and mission statements.",
  qualityPolicy: "The institution's quality policy.",
  planningBoard: "Members of the planning & monitoring board.",
  principal: "The principal's photo and message.",
  management: "The management team and their roles.",
  hod: "Heads of departments.",
  governingCouncil: "Members of the governing council.",
  coreValues: "The core values, each with an icon and short text.",
  accreditations: "Approval and accreditation logos.",
  campusHighlights: "Photos and facts that highlight the campus.",
  whyJct: "Reasons to choose JCT.",
  sidebar: "The side menu of this page, quick facts and the contact button.",
};

/** Inspector heading — custom sidebar pages are titled by their own label. */
function sectionTitle(section: string, data: AboutPageValue): string {
  if (section.startsWith("custom:")) {
    const anchor = section.slice("custom:".length);
    const item = (data.sidebar.navItems ?? []).find(
      (it) => (it.id || "") === anchor,
    );
    return item?.label?.trim() || "Custom Section";
  }
  return ABOUT_SECTION_LABELS[section as AboutEditableSection] ?? "Section";
}

function AboutEditor() {
  const searchParams = useSearchParams();
  const college = searchParams.get("college") ?? "engineering";
  const { institution, configKey, publicPath, label } =
    INSTITUTION_MAP[college] ?? INSTITUTION_MAP["engineering"];
  // Content pages published as tabs of this About page (e.g. Timeline).
  const hostedDefs = hostedContentPages(publicPath);

  return (
    <LivePageEditor<AboutPageValue>
      // A college switch is a different document: start fresh.
      key={configKey}
      configKey={configKey}
      publicPath={publicPath}
      title={`${label} — About Page`}
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      emptyValue={() => getDefaultDraft(institution)}
      sectionOrder={ABOUT_SECTION_ORDER}
      sectionLabels={ABOUT_SECTION_LABELS}
      sectionHelp={SECTION_HELP}
      sectionTitle={sectionTitle}
      renderPreview={({ data, hosted, onEditSection }) => {
        const items: AboutHostedItem[] = hostedDefs
          .filter((def) => hosted[def.slug])
          .map((def) => {
            const Icon = def.icon;
            return {
              anchor: def.host!.anchor,
              navLabel: def.host!.navLabel,
              icon: <Icon />,
              data: hosted[def.slug],
              slug: def.slug,
            };
          });
        return (
          <AboutPageLayout
            data={data}
            institution={institution}
            editable
            onEditSection={onEditSection}
            hosted={items}
          />
        );
      }}
      renderInspector={({ section, data, onChange }) => (
        <AboutSectionInspector
          section={section}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}

export default function AboutEditorPage() {
  return (
    <Suspense fallback={null}>
      <AboutEditor />
    </Suspense>
  );
}
