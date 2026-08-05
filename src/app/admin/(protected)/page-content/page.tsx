"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  PageContentShell,
  type SectionDef,
} from "@/components/admin/PageContentShell";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import {
  EngineeringHeroForm,
  ArtsScienceHeroForm,
  PolytechnicHeroForm,
  AnnouncementForm,
  PolytechnicAdmissionsForm,
  AdmissionsForm,
  LifeAtJctForm,
  MetricsForm,
  NavbarAdminSection,
  UpcomingEventsForm,
  SeoPagesForm,
  type SeoPagesVal,
  type EngHeroVal,
  type ArtsHeroVal,
  type PolyHeroVal,
  type AnnouncementVal,
  type AdmissionsVal,
  type GenericAdmissionsVal,
  type LifeAtJctVal,
  type Metric,
  type NavbarVal,
  type UpcomingEventsVal,
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
import { reconcileSeoPages, seoPagesDefaultValue } from "@/lib/seo-pages";

type College = "engineering" | "arts-science" | "polytechnic";

const SEO_CONFIG_KEY: Record<College, string> = {
  engineering: "engineeringSeo",
  "arts-science": "artsScienceSeo",
  polytechnic: "polytechnicSeo",
};

/** Meta title/description for every public page of one college. */
function seoSection(college: College): SectionDef {
  return {
    id: "seo",
    label: "SEO / Meta Tags",
    kind: "form",
    configKey: SEO_CONFIG_KEY[college],
    defaultValue: seoPagesDefaultValue(college) as SeoPagesVal,
    reconcile: (v) => reconcileSeoPages(college, v),
    render: (v, onChange) => (
      <SeoPagesForm value={(v as SeoPagesVal) ?? {}} onChange={onChange} />
    ),
  };
}

const UPCOMING_EVENTS_CONFIG_KEY: Record<College, string> = {
  engineering: "engineeringUpcomingEvents",
  "arts-science": "artsScienceUpcomingEvents",
  polytechnic: "polytechnicUpcomingEvents",
};

/**
 * Wording for the landing-page "News & Events" strip. The entries it lists are
 * Event records edited under /admin/events — only the copy lives here.
 */
function upcomingEventsSection(college: College): SectionDef {
  const eventsHref = `/institutions/${college}/events`;
  return {
    id: "upcomingEvents",
    label: "News & Events",
    kind: "form",
    configKey: UPCOMING_EVENTS_CONFIG_KEY[college],
    defaultValue: {
      enabled: true,
      eyebrow: "Happenings",
      heading: "News & Events",
      maxItems: 3,
      ctaLabel: "News & Events",
      ctaHref: eventsHref,
      fallbackToRecent: true,
      upcomingBadge: "Upcoming",
    } as UpcomingEventsVal,
    render: (v, onChange) => (
      <UpcomingEventsForm
        value={(v as UpcomingEventsVal) ?? {}}
        onChange={onChange}
        eventsHref={eventsHref}
      />
    ),
  };
}

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

function navbarSection(
  headerConfigKey: string,
  navbarConfigKey: string,
  navDefault: NavbarVal,
): SectionDef {
  return {
    id: "navbar",
    label: "Navbar",
    kind: "custom",
    customRender: () => (
      <NavbarAdminSection
        headerConfigKey={headerConfigKey}
        navbarConfigKey={navbarConfigKey}
        navDefault={navDefault}
      />
    ),
  };
}

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
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
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
      {flushError && <p className="mb-2 text-xs text-red-600">{flushError}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="admin-btn admin-btn-gold admin-btn-sm"
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
        <Loader2 size={20} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
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
        <p className="text-sm text-gray-400">
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
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                    {item.category}
                  </span>
                  {!item.is_active && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-400 uppercase">
                      Inactive
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {[item.batch, item.course, item.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500 italic">
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

function sectionsFor(college: College): SectionDef[] {
  if (college === "engineering") {
    return [
      navbarSection(
        "engineeringHeader",
        "engineeringNavbar",
        navDefaultFor("engineering"),
      ),
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
        id: "admissions",
        label: "Admissions",
        kind: "form",
        configKey: "engineeringAdmissions",
        defaultValue: {} as GenericAdmissionsVal,
        render: (v, onChange) => (
          <AdmissionsForm
            value={(v as GenericAdmissionsVal) ?? {}}
            onChange={onChange}
            showContact={true}
          />
        ),
      },
      {
        id: "lifeAtJct",
        label: "Life at JCT",
        kind: "form",
        configKey: "engineeringLifeAtJct",
        defaultValue: {
          categories: ["All", "Labs", "Sports", "Events", "Clubs"],
          photos: [],
        } as LifeAtJctVal,
        render: (v, onChange) => (
          <LifeAtJctForm
            value={(v as LifeAtJctVal) ?? {}}
            onChange={onChange}
          />
        ),
      },
      upcomingEventsSection("engineering"),
      {
        id: "testimonials",
        label: "Voices / Testimonials",
        kind: "custom",
        customRender: () => (
          <CollegeTestimonialsManager institution="engineering" />
        ),
      },
      seoSection("engineering"),
    ];
  }

  if (college === "arts-science") {
    return [
      navbarSection(
        "artsScienceHeader",
        "artsScienceNavbar",
        navDefaultFor("arts-science"),
      ),
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
        id: "admissions",
        label: "Admissions",
        kind: "form",
        configKey: "artsScienceAdmissions",
        defaultValue: {} as GenericAdmissionsVal,
        render: (v, onChange) => (
          <AdmissionsForm
            value={(v as GenericAdmissionsVal) ?? {}}
            onChange={onChange}
            showContact={true}
          />
        ),
      },
      {
        id: "lifeAtJct",
        label: "Life at JCT",
        kind: "form",
        configKey: "artsScienceLifeAtJct",
        defaultValue: {
          categories: ["All", "Labs", "Sports", "Events", "Clubs"],
          photos: [],
        } as LifeAtJctVal,
        render: (v, onChange) => (
          <LifeAtJctForm
            value={(v as LifeAtJctVal) ?? {}}
            onChange={onChange}
          />
        ),
      },
      upcomingEventsSection("arts-science"),
      {
        id: "testimonials",
        label: "Testimonials",
        kind: "custom",
        customRender: () => (
          <CollegeTestimonialsManager institution="arts-science" />
        ),
      },
      seoSection("arts-science"),
    ];
  }

  // polytechnic
  return [
    navbarSection(
      "polytechnicHeader",
      "polytechnicNavbar",
      navDefaultFor("polytechnic"),
    ),
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
      id: "lifeAtJct",
      label: "Life at JCT",
      kind: "form",
      configKey: "polytechnicLifeAtJct",
      defaultValue: {
        categories: ["All", "Labs", "Sports", "Events", "Clubs"],
        photos: [],
      } as LifeAtJctVal,
      render: (v, onChange) => (
        <LifeAtJctForm value={(v as LifeAtJctVal) ?? {}} onChange={onChange} />
      ),
    },
    upcomingEventsSection("polytechnic"),
    {
      id: "testimonials",
      label: "Testimonials",
      kind: "custom",
      customRender: () => (
        <CollegeTestimonialsManager institution="polytechnic" />
      ),
    },
    seoSection("polytechnic"),
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
    <Suspense fallback={<div className="admin-content">Loading…</div>}>
      <Inner />
    </Suspense>
  );
}
