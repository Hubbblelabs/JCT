"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PageContentShell,
  type SectionDef,
} from "@/components/admin/PageContentShell";
import {
  EngineeringHeroForm,
  ArtsScienceHeroForm,
  PolytechnicHeroForm,
  CampusLifeCarouselForm,
  AnnouncementForm,
  PolytechnicAdmissionsForm,
  LifeAtJctForm,
  MetricsForm,
  FacilitiesForm,
  StringListForm,
  type EngHeroVal,
  type ArtsHeroVal,
  type PolyHeroVal,
  type CampusLifeCarouselVal,
  type AnnouncementVal,
  type AdmissionsVal,
  type LifeAtJctVal,
  type Metric,
  type Facility,
} from "@/components/admin/PageContentForms";

type College = "engineering" | "arts-science" | "polytechnic";

function sectionsFor(college: College): SectionDef[] {
  if (college === "engineering") {
    return [
      {
        id: "announcement",
        label: "Announcement Bar",
        kind: "form",
        configKey: "engineeringAnnouncement",
        defaultValue: { enabled: false, text: "" } as AnnouncementVal,
        render: (v, onChange) => (
          <AnnouncementForm
            value={(v as AnnouncementVal) ?? {}}
            onChange={onChange}
          />
        ),
      },
      {
        id: "hero",
        label: "Hero",
        kind: "form",
        configKey: "engineeringHero",
        defaultValue: {} as EngHeroVal,
        render: (v, onChange) => (
          <EngineeringHeroForm
            value={(v as EngHeroVal) ?? {}}
            onChange={onChange}
          />
        ),
      },
      {
        id: "metrics",
        label: "Performance That Speaks",
        kind: "form",
        configKey: "engineeringMetrics",
        defaultValue: [] as Metric[],
        render: (v, onChange) => (
          <MetricsForm value={(v as Metric[]) ?? []} onChange={onChange} />
        ),
      },
      {
        id: "facilities",
        label: "Research — Facilities",
        kind: "form",
        configKey: "engineeringFacilities",
        defaultValue: [] as Facility[],
        render: (v, onChange) => (
          <FacilitiesForm value={(v as Facility[]) ?? []} onChange={onChange} />
        ),
      },
      {
        id: "researchHighlights",
        label: "Research — Highlights",
        kind: "form",
        configKey: "engineeringResearchHighlights",
        defaultValue: [] as string[],
        render: (v, onChange) => (
          <StringListForm value={(v as string[]) ?? []} onChange={onChange} />
        ),
      },
      {
        id: "lifeAtJct",
        label: "Life at JCT",
        kind: "form",
        configKey: "lifeAtJct",
        defaultValue: {
          categories: ["All", "Labs", "Sports", "Events", "Clubs"],
          photos: [],
        } as LifeAtJctVal,
        render: (v, onChange) => (
          <LifeAtJctForm value={(v as LifeAtJctVal) ?? {}} onChange={onChange} />
        ),
      },
      {
        id: "testimonials",
        label: "Voices / Testimonials",
        kind: "link",
        href: "/admin/testimonials?college=engineering",
      },
    ];
  }

  if (college === "arts-science") {
    return [
      {
        id: "hero",
        label: "Hero",
        kind: "form",
        configKey: "artsScienceHero",
        defaultValue: {} as ArtsHeroVal,
        render: (v, onChange) => (
          <ArtsScienceHeroForm
            value={(v as ArtsHeroVal) ?? {}}
            onChange={onChange}
          />
        ),
      },
      {
        id: "campusLife",
        label: "Campus Life Carousel",
        kind: "form",
        configKey: "artsScienceCampusLife",
        defaultValue: {} as CampusLifeCarouselVal,
        render: (v, onChange) => (
          <CampusLifeCarouselForm
            value={(v as CampusLifeCarouselVal) ?? {}}
            onChange={onChange}
          />
        ),
      },
      {
        id: "testimonials",
        label: "Voices / Testimonials",
        kind: "link",
        href: "/admin/testimonials?college=arts-science",
      },
    ];
  }

  // polytechnic
  return [
    {
      id: "hero",
      label: "Hero",
      kind: "form",
      configKey: "polytechnicHero",
      defaultValue: {} as PolyHeroVal,
      render: (v, onChange) => (
        <PolytechnicHeroForm
          value={(v as PolyHeroVal) ?? {}}
          onChange={onChange}
        />
      ),
    },
    {
      id: "campusLife",
      label: "Campus Life Carousel",
      kind: "form",
      configKey: "polytechnicCampusLife",
      defaultValue: {} as CampusLifeCarouselVal,
      render: (v, onChange) => (
        <CampusLifeCarouselForm
          value={(v as CampusLifeCarouselVal) ?? {}}
          onChange={onChange}
        />
      ),
    },
    {
      id: "admissions",
      label: "Admissions",
      kind: "form",
      configKey: "polytechnicAdmissions",
      defaultValue: {} as AdmissionsVal,
      render: (v, onChange) => (
        <PolytechnicAdmissionsForm
          value={(v as AdmissionsVal) ?? {}}
          onChange={onChange}
        />
      ),
    },
    {
      id: "testimonials",
      label: "Voices / Testimonials",
      kind: "link",
      href: "/admin/testimonials?college=polytechnic",
    },
  ];
}

const PRETTY: Record<College, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

function Inner() {
  const params = useSearchParams();
  const raw = params.get("college") ?? "engineering";
  const college: College =
    raw === "arts-science" || raw === "polytechnic" ? raw : "engineering";

  return (
    <PageContentShell
      pageTitle={`${PRETTY[college]} Page Content`}
      pageSubtitle="Hero, sections, and other page-specific content for this institution."
      sections={sectionsFor(college)}
    />
  );
}

export default function PageContentPage() {
  return (
    <Suspense
      fallback={<div className="admin-content">Loading…</div>}
    >
      <Inner />
    </Suspense>
  );
}
