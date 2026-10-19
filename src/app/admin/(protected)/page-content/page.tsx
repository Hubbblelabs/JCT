"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  SiteSectionsEditor,
  type SiteSectionDef,
} from "@/components/admin/SiteSectionsEditor";
import {
  announcementSection,
  footerLinkSection,
  formSection,
  navbarSection,
  seoSection,
} from "@/components/admin/site-sections";
import { NewsEventsPreview } from "@/components/admin/previews/NewsEventsPreview";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import {
  EngineeringHeroForm,
  ArtsScienceHeroForm,
  PolytechnicHeroForm,
  PolytechnicAdmissionsForm,
  AdmissionsForm,
  LifeAtJctForm,
  MetricsForm,
  AddOnProgramsForm,
  CareerCentreForm,
  UpcomingEventsForm,
  RecruitersSectionForm,
  type EngHeroVal,
  type ArtsHeroVal,
  type PolyHeroVal,
  type AdmissionsVal,
  type GenericAdmissionsVal,
  type LifeAtJctVal,
  type Metric,
  type AddOnProgramsVal,
  type CareerCentreVal,
  type NavbarVal,
  type UpcomingEventsVal,
  type RecruitersSectionVal,
} from "@/components/admin/PageContentForms";
import {
  Field,
  FormGrid,
  ImageUploadInput,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/inputs";
import {
  engineeringNavigation,
  artsNavigation,
  polytechnicNavigation,
  type NavItem as StaticNavItem,
} from "@/data/all-navigations";
import {
  ARTS_SCIENCE_ADD_ON_PROGRAMS_DEFAULT,
  ARTS_SCIENCE_CAREER_CENTRE_DEFAULT,
} from "@/lib/arts-science-section-defaults";
// The public sections themselves, drawn in the live preview.
import { Placements } from "@/components/layout/Placements";
import { CampusLife } from "@/components/layout/CampusLife";
import { EngineeringHero } from "@/modules/engineering/EngineeringHero";
import { EngineeringDomains } from "@/modules/engineering/EngineeringDomains";
import { EngineeringMetrics } from "@/modules/engineering/EngineeringMetrics";
import { Admissions as EngineeringAdmissions } from "@/modules/engineering/Admissions";
import { Testimonials as EngineeringTestimonials } from "@/modules/engineering/Testimonials";
import { Hero as ArtsHero } from "@/modules/arts-science/Hero";
import { UgPrograms } from "@/modules/arts-science/UgPrograms";
import { AddOnPrograms } from "@/modules/arts-science/AddOnPrograms";
import { CareerDevelopmentCentre } from "@/modules/arts-science/CareerDevelopmentCentre";
import { AdmissionProcess } from "@/modules/arts-science/AdmissionProcess";
import { Testimonials as ArtsTestimonials } from "@/modules/arts-science/Testimonials";
import { Hero as PolyHero } from "@/modules/polytechnic/Hero";
import { DiplomaPrograms } from "@/modules/polytechnic/DiplomaPrograms";
import { Admissions as PolyAdmissions } from "@/modules/polytechnic/Admissions";
import { Testimonials as PolyTestimonials } from "@/modules/polytechnic/Testimonials";

type College = "engineering" | "arts-science" | "polytechnic";

/* ─── Inline Testimonials Manager ─── */

type TestimonialItem = {
  _id: string;
  name: string;
  batch: string;
  course: string;
  company: string;
  quote: string;
  avatar: string;
  category: "Alumni" | "Student" | "Industry";
  is_active: boolean;
};

type TestimonialDraft = Omit<TestimonialItem, "_id">;

const EMPTY_DRAFT: TestimonialDraft = {
  name: "",
  batch: "",
  course: "",
  company: "",
  quote: "",
  avatar: "",
  category: "Alumni",
  is_active: true,
};

const CATEGORY_OPTIONS = [
  { value: "Alumni", label: "Alumni" },
  { value: "Student", label: "Student" },
  { value: "Industry", label: "Industry" },
];

function TestimonialForm({
  draft,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  draft: TestimonialDraft;
  onChange: (d: TestimonialDraft) => void;
  onSave: (flushed: TestimonialDraft) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <DeferredUploadsProvider>
      <TestimonialFormInner
        draft={draft}
        onChange={onChange}
        onSave={onSave}
        onCancel={onCancel}
        saving={saving}
      />
    </DeferredUploadsProvider>
  );
}

function TestimonialFormInner({
  draft,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  draft: TestimonialDraft;
  onChange: (d: TestimonialDraft) => void;
  onSave: (flushed: TestimonialDraft) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { flush, discardAll } = useDeferredUploads();
  const [flushing, setFlushing] = useState(false);
  const [flushError, setFlushError] = useState<string | null>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const handleSave = async () => {
    setFlushing(true);
    setFlushError(null);
    try {
      const flushed = await flush(draftRef.current);
      onSave(flushed as TestimonialDraft);
    } catch (err) {
      setFlushError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setFlushing(false);
    }
  };

  const handleCancel = () => {
    discardAll();
    onCancel();
  };

  const busy = saving || flushing;

  return (
    <div className="rounded-lg border border-[var(--admin-info-border)] bg-blue-50/40 p-4">
      <FormGrid>
        <TextInput
          label="Name"
          span={4}
          required
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
        />
        <TextInput
          label="Batch"
          span={2}
          value={draft.batch}
          placeholder="e.g. 2024"
          onChange={(e) => onChange({ ...draft, batch: e.target.value })}
        />
        <TextInput
          label="Course"
          span={3}
          value={draft.course}
          placeholder="e.g. B.E. CSE"
          onChange={(e) => onChange({ ...draft, course: e.target.value })}
        />
        <TextInput
          label="Company"
          span={3}
          value={draft.company}
          placeholder="e.g. Infosys"
          onChange={(e) => onChange({ ...draft, company: e.target.value })}
        />
        <Select
          label="Category"
          span={4}
          options={CATEGORY_OPTIONS}
          value={draft.category}
          onChange={(e) =>
            onChange({
              ...draft,
              category: e.target.value as TestimonialDraft["category"],
            })
          }
        />
        <Field label="Visibility" span={4}>
          <label className="flex items-center gap-2 pt-2 text-sm">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(e) =>
                onChange({ ...draft, is_active: e.target.checked })
              }
            />
            Active (visible on site)
          </label>
        </Field>
        <TextArea
          label="Quote"
          span={7}
          required
          value={draft.quote}
          rows={4}
          onChange={(e) => onChange({ ...draft, quote: e.target.value })}
        />
        <ImageUploadInput
          label="Avatar"
          span={5}
          ratio="square"
          value={draft.avatar}
          onChange={(url) => onChange({ ...draft, avatar: url })}
          hideUrlField
        />
      </FormGrid>
      {flushError && (
        <p className="mb-2 text-xs text-[var(--admin-danger)]">{flushError}</p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="admin-btn admin-btn-primary admin-btn-sm"
        >
          {busy ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Check size={13} />
          )}
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}

function CollegeTestimonialsManager({ institution }: { institution: string }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [draft, setDraft] = useState<TestimonialDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<TestimonialDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(
        `/api/admin/testimonials?institution=${institution}`,
      );
      if (!r.ok) throw new Error("Failed to load");
      setItems(await r.json());
    } catch {
      setError("Could not load testimonials.");
    } finally {
      setLoading(false);
    }
  }, [institution]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (flushed: TestimonialDraft) => {
    if (!flushed.name.trim() || !flushed.quote.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...flushed, institution }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => null);
        throw new Error(body?.message ?? body?.error ?? "Save failed");
      }
      setAddingNew(false);
      setDraft(EMPTY_DRAFT);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string, flushed: TestimonialDraft) => {
    if (!flushed.name.trim() || !flushed.quote.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flushed),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => null);
        throw new Error(body?.message ?? body?.error ?? "Save failed");
      }
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete testimonial",
      message: "This testimonial will be permanently removed. Continue?",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setDeletingId(id);
    try {
      const r = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!r.ok) throw new Error();
      toast.success("Testimonial deleted.");
      await load();
    } catch {
      setError("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2
          size={20}
          className="animate-spin text-[var(--admin-text-faint)]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-[var(--admin-danger-bg)] px-3 py-2 text-sm text-[var(--admin-danger)]">
          {error}
        </p>
      )}

      {addingNew ? (
        <TestimonialForm
          draft={draft}
          onChange={setDraft}
          onSave={handleAdd}
          onCancel={() => {
            setAddingNew(false);
            setDraft(EMPTY_DRAFT);
          }}
          saving={saving}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={14} /> Add Testimonial
        </button>
      )}

      {items.length === 0 && !addingNew && (
        <p className="text-sm text-[var(--admin-text-faint)]">
          No testimonials yet for this college.
        </p>
      )}

      <div className="space-y-2">
        {items.map((item) =>
          editingId === item._id ? (
            <TestimonialForm
              key={item._id}
              draft={editDraft}
              onChange={setEditDraft}
              onSave={(flushed) => handleEdit(item._id, flushed)}
              onCancel={() => setEditingId(null)}
              saving={saving}
            />
          ) : (
            <div
              key={item._id}
              className="flex items-start gap-3 rounded-lg border border-[var(--admin-border-subtle)] bg-white p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--admin-text)]">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-[var(--admin-neutral-bg)] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[var(--admin-text-muted)] uppercase">
                    {item.category}
                  </span>
                  {!item.is_active && (
                    <span className="rounded-full bg-[var(--admin-danger-bg)] px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-400 uppercase">
                      Inactive
                    </span>
                  )}
                  <span className="text-xs text-[var(--admin-text-faint)]">
                    {[item.batch, item.course, item.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--admin-text-muted)] italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item._id);
                    setEditDraft({
                      name: item.name,
                      batch: item.batch,
                      course: item.course,
                      company: item.company,
                      quote: item.quote,
                      avatar: item.avatar,
                      category: item.category,
                      is_active: item.is_active,
                    });
                  }}
                  className="admin-btn admin-btn-outline admin-btn-sm"
                >
                  <Pencil size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  {deletingId === item._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/* ─── Landing page editor ─── */

const KEYS: Record<
  College,
  {
    announcement: string;
    header: string;
    navbar: string;
    hero: string;
    admissions: string;
    placements: string;
    lifeAtJct: string;
    upcomingEvents: string;
    seo: string;
  }
> = {
  engineering: {
    announcement: "engineeringAnnouncement",
    header: "engineeringHeader",
    navbar: "engineeringNavbar",
    hero: "engineeringHero",
    admissions: "engineeringAdmissions",
    placements: "engineeringPlacementHighlights",
    lifeAtJct: "engineeringLifeAtJct",
    upcomingEvents: "engineeringUpcomingEvents",
    seo: "engineeringSeo",
  },
  "arts-science": {
    announcement: "artsScienceAnnouncement",
    header: "artsScienceHeader",
    navbar: "artsScienceNavbar",
    hero: "artsScienceHero",
    admissions: "artsScienceAdmissions",
    placements: "artsSciencePlacementHighlights",
    lifeAtJct: "artsScienceLifeAtJct",
    upcomingEvents: "artsScienceUpcomingEvents",
    seo: "artsScienceSeo",
  },
  polytechnic: {
    announcement: "polytechnicAnnouncement",
    header: "polytechnicHeader",
    navbar: "polytechnicNavbar",
    hero: "polytechnicHero",
    admissions: "polytechnicAdmissions",
    placements: "polytechnicPlacementHighlights",
    lifeAtJct: "polytechnicLifeAtJct",
    upcomingEvents: "polytechnicUpcomingEvents",
    seo: "polytechnicSeo",
  },
};

const PRETTY: Record<College, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

/** The landing page's own `<main>` classes, so its theme styles apply. */
const FRAME_CLASS: Record<College, string> = {
  engineering: "bg-background text-foreground engineering-theme",
  "arts-science": "bg-background text-foreground arts-science-theme",
  polytechnic: "polytechnic-theme bg-[#F8F9FA] font-sans",
};

const LIFE_AT_JCT_DEFAULT = {
  categories: ["All", "Labs", "Sports", "Events", "Clubs"],
  photos: [],
} as LifeAtJctVal;

function navDefaultFor(college: College): NavbarVal {
  const src: StaticNavItem[] =
    college === "engineering"
      ? engineeringNavigation
      : college === "arts-science"
        ? artsNavigation
        : polytechnicNavigation;
  return {
    items: src.map((it) => ({
      label: it.name,
      href: it.href,
      visible: true,
      inMore: false,
      children: it.children?.map((c) => ({
        label: c.name,
        href: c.href,
        desc: c.desc,
        visible: true,
      })),
    })),
  };
}

function heroSection(college: College): SiteSectionDef {
  const common = {
    id: "hero",
    label: "Hero",
    help: "The large banner visitors see first: headline, buttons and the rotating background photos.",
    group: "Page sections",
    configKey: KEYS[college].hero,
  };
  if (college === "engineering")
    return formSection<EngHeroVal>({
      ...common,
      defaultValue: {},
      form: (value, onChange) => (
        <EngineeringHeroForm value={value} onChange={onChange} />
      ),
      preview: <EngineeringHero />,
    });
  if (college === "arts-science")
    return formSection<ArtsHeroVal>({
      ...common,
      defaultValue: {},
      form: (value, onChange) => (
        <ArtsScienceHeroForm value={value} onChange={onChange} />
      ),
      preview: <ArtsHero />,
    });
  return formSection<PolyHeroVal>({
    ...common,
    defaultValue: {},
    form: (value, onChange) => (
      <PolytechnicHeroForm value={value} onChange={onChange} />
    ),
    preview: <PolyHero />,
  });
}

function programsSection(college: College): SiteSectionDef {
  const preview =
    college === "engineering" ? (
      <EngineeringDomains />
    ) : college === "arts-science" ? (
      <UgPrograms />
    ) : (
      <DiplomaPrograms />
    );
  return {
    id: "programs",
    label: "Programs",
    help: "The program cards. Each card is a program — add, reorder or edit them (and their detail pages) in Programs.",
    group: "Page sections",
    links: [
      { href: `/admin/programs?college=${college}`, label: "Open Programs" },
    ],
    preview,
  };
}

function upcomingEventsSection(college: College): SiteSectionDef {
  const eventsHref = `/institutions/${college}/events`;
  return {
    ...formSection<UpcomingEventsVal>({
      id: "upcomingEvents",
      label: "News & Events",
      help: "The events strip: its heading and wording are edited here; the events themselves are added in News & Events.",
      group: "Page sections",
      configKey: KEYS[college].upcomingEvents,
      defaultValue: {
        enabled: true,
        eyebrow: "Happenings",
        heading: "News & Events",
        maxItems: 3,
        ctaLabel: "News & Events",
        ctaHref: eventsHref,
        fallbackToRecent: true,
        upcomingBadge: "Upcoming",
      },
      form: (value, onChange) => (
        <UpcomingEventsForm
          value={value}
          onChange={onChange}
          eventsHref={eventsHref}
        />
      ),
      preview: <NewsEventsPreview institution={college} />,
    }),
    links: [
      { href: `/admin/events?college=${college}`, label: "Open News & Events" },
    ],
  };
}

function admissionsSection(college: College): SiteSectionDef {
  const common = {
    id: "admissions",
    label: "Admissions",
    help: "The admissions block — the steps to apply, key dates and who to contact.",
    group: "Page sections",
    configKey: KEYS[college].admissions,
  };
  if (college === "polytechnic")
    return formSection<AdmissionsVal>({
      ...common,
      defaultValue: {},
      form: (value, onChange) => (
        <PolytechnicAdmissionsForm value={value} onChange={onChange} />
      ),
      preview: <PolyAdmissions />,
    });
  return formSection<GenericAdmissionsVal>({
    ...common,
    defaultValue: {},
    form: (value, onChange) => (
      <AdmissionsForm value={value} onChange={onChange} showContact />
    ),
    preview:
      college === "engineering" ? (
        <EngineeringAdmissions />
      ) : (
        <AdmissionProcess />
      ),
  });
}

function placementsSection(college: College): SiteSectionDef {
  return {
    ...formSection<RecruitersSectionVal>({
      id: "placements",
      label: "Placement Highlights",
      help: "The placement section: heading, description and stat cards. The company logos come from the year-wise placement records.",
      group: "Page sections",
      configKey: KEYS[college].placements,
      defaultValue: {},
      form: (value, onChange) => (
        <RecruitersSectionForm value={value} onChange={onChange} />
      ),
      preview: <Placements institution={college} />,
    }),
    links: [
      {
        href: `/admin/placements-page?college=${college}`,
        label: "Open placement records",
      },
    ],
  };
}

function lifeAtJctSection(college: College): SiteSectionDef {
  return formSection<LifeAtJctVal>({
    id: "lifeAtJct",
    label: "Life at JCT",
    help: "The photo gallery of campus life, with its category filters.",
    group: "Page sections",
    configKey: KEYS[college].lifeAtJct,
    defaultValue: LIFE_AT_JCT_DEFAULT,
    form: (value, onChange) => (
      <LifeAtJctForm value={value} onChange={onChange} />
    ),
    preview: (
      <CampusLife
        configKey={KEYS[college].lifeAtJct}
        eventsHref={`/institutions/${college}/events`}
      />
    ),
  });
}

function testimonialsSection(college: College): SiteSectionDef {
  return {
    id: "testimonials",
    label: "Testimonials",
    help: "Quotes from alumni, students and recruiters shown near the bottom of the page.",
    group: "Page sections",
    manager: () => <CollegeTestimonialsManager institution={college} />,
    preview:
      college === "engineering" ? (
        <EngineeringTestimonials />
      ) : college === "arts-science" ? (
        <ArtsTestimonials />
      ) : (
        <PolyTestimonials />
      ),
  };
}

/** Sections in the order the college's landing page renders them. */
function sectionsFor(college: College): SiteSectionDef[] {
  const top = [
    announcementSection(KEYS[college].announcement),
    navbarSection(
      { header: KEYS[college].header, navbar: KEYS[college].navbar },
      navDefaultFor(college),
    ),
    heroSection(college),
    programsSection(college),
  ];
  const bottom = [
    placementsSection(college),
    lifeAtJctSection(college),
    testimonialsSection(college),
    footerLinkSection(),
    seoSection(college, KEYS[college].seo),
  ];

  if (college === "engineering") {
    return [
      ...top,
      formSection<Metric[]>({
        id: "metrics",
        label: "Performance Metrics",
        help: "The strip of headline numbers below the programs.",
        group: "Page sections",
        configKey: "engineeringMetrics",
        defaultValue: [],
        form: (value, onChange) => (
          <MetricsForm value={value} onChange={onChange} />
        ),
        preview: <EngineeringMetrics />,
      }),
      upcomingEventsSection(college),
      admissionsSection(college),
      ...bottom,
    ];
  }

  if (college === "arts-science") {
    return [
      ...top,
      formSection<AddOnProgramsVal>({
        id: "addOnPrograms",
        label: "Add-on Programs",
        help: "Certificate tracks students can take alongside their degree, grouped by field.",
        group: "Page sections",
        configKey: "artsScienceAddOnPrograms",
        defaultValue: ARTS_SCIENCE_ADD_ON_PROGRAMS_DEFAULT,
        form: (value, onChange) => (
          <AddOnProgramsForm value={value} onChange={onChange} />
        ),
        preview: <AddOnPrograms />,
      }),
      formSection<CareerCentreVal>({
        id: "careerCentre",
        label: "Career Development Centre",
        help: "Support for higher education, competitive exams, placements and counselling.",
        group: "Page sections",
        configKey: "artsScienceCareerCentre",
        defaultValue: ARTS_SCIENCE_CAREER_CENTRE_DEFAULT,
        form: (value, onChange) => (
          <CareerCentreForm value={value} onChange={onChange} />
        ),
        preview: <CareerDevelopmentCentre />,
      }),
      upcomingEventsSection(college),
      admissionsSection(college),
      ...bottom,
    ];
  }

  return [
    ...top,
    upcomingEventsSection(college),
    admissionsSection(college),
    ...bottom,
  ];
}

function Inner() {
  const params = useSearchParams();
  const raw = params.get("college") ?? "engineering";
  const college: College =
    raw === "arts-science" || raw === "polytechnic" ? raw : "engineering";

  return (
    <SiteSectionsEditor
      // A college switch is a different page: remount so nothing carries over.
      key={college}
      title={`${PRETTY[college]} — Landing Page`}
      description="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      publicHref={`/institutions/${college}`}
      institution={college}
      sections={sectionsFor(college)}
      frameClassName={FRAME_CLASS[college]}
    />
  );
}

export default function PageContentPage() {
  return (
    <Suspense fallback={<div className="admin-content">Loading…</div>}>
      <Inner />
    </Suspense>
  );
}
