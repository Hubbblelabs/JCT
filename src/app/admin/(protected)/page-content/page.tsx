"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
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
  type EngHeroVal,
  type ArtsHeroVal,
  type PolyHeroVal,
  type CampusLifeCarouselVal,
  type AnnouncementVal,
  type AdmissionsVal,
  type LifeAtJctVal,
  type Metric,
} from "@/components/admin/PageContentForms";
import {
  ImageUploadInput,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/inputs";

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
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Name"
          required
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
        />
        <TextInput
          label="Batch"
          value={draft.batch}
          placeholder="e.g. 2024"
          onChange={(e) => onChange({ ...draft, batch: e.target.value })}
        />
        <TextInput
          label="Course"
          value={draft.course}
          placeholder="e.g. B.E. CSE"
          onChange={(e) => onChange({ ...draft, course: e.target.value })}
        />
        <TextInput
          label="Company"
          value={draft.company}
          placeholder="e.g. Infosys"
          onChange={(e) => onChange({ ...draft, company: e.target.value })}
        />
      </div>
      <TextArea
        label="Quote"
        required
        value={draft.quote}
        rows={3}
        onChange={(e) => onChange({ ...draft, quote: e.target.value })}
      />
      <Select
        label="Category"
        options={CATEGORY_OPTIONS}
        value={draft.category}
        onChange={(e) =>
          onChange({ ...draft, category: e.target.value as TestimonialDraft["category"] })
        }
      />
      <ImageUploadInput
        label="Avatar"
        value={draft.avatar}
        onChange={(url) => onChange({ ...draft, avatar: url })}
        uploadOnly
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.is_active}
          onChange={(e) => onChange({ ...draft, is_active: e.target.checked })}
        />
        Active (visible on site)
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="admin-btn admin-btn-gold admin-btn-sm"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="admin-btn admin-btn-outline admin-btn-sm">
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}

function CollegeTestimonialsManager({ institution }: { institution: string }) {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [draft, setDraft] = useState<TestimonialDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<TestimonialDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/testimonials?institution=${institution}`);
      if (!r.ok) throw new Error("Failed to load");
      setItems(await r.json());
    } catch {
      setError("Could not load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!draft.name.trim() || !draft.quote.trim()) return;
    setSaving(true);
    try {
      const r = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, institution }),
      });
      if (!r.ok) throw new Error();
      setAddingNew(false);
      setDraft(EMPTY_DRAFT);
      await load();
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editDraft.name.trim() || !editDraft.quote.trim()) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      if (!r.ok) throw new Error();
      setEditingId(null);
      await load();
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setDeletingId(id);
    try {
      const r = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
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
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {addingNew ? (
        <TestimonialForm
          draft={draft}
          onChange={setDraft}
          onSave={handleAdd}
          onCancel={() => { setAddingNew(false); setDraft(EMPTY_DRAFT); }}
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
        <p className="text-sm text-gray-400">No testimonials yet for this college.</p>
      )}

      <div className="space-y-2">
        {items.map((item) =>
          editingId === item._id ? (
            <TestimonialForm
              key={item._id}
              draft={editDraft}
              onChange={setEditDraft}
              onSave={() => handleEdit(item._id)}
              onCancel={() => setEditingId(null)}
              saving={saving}
            />
          ) : (
            <div
              key={item._id}
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-800">{item.name}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    {item.category}
                  </span>
                  {!item.is_active && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-400">
                      Inactive
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {[item.batch, item.course, item.company].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2 italic">
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
        id: "lifeAtJct",
        label: "Life at JCT",
        kind: "form",
        configKey: "lifeAtJct",
        defaultValue: {
          categories: ["All", "Labs", "Sports", "Events", "Clubs"],
          photos: [],
        } as LifeAtJctVal,
        render: (v, onChange) => (
          <>
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              Changes here also update the main landing page, and vice versa.
            </p>
            <LifeAtJctForm value={(v as LifeAtJctVal) ?? {}} onChange={onChange} />
          </>
        ),
      },
      {
        id: "testimonials",
        label: "Voices / Testimonials",
        kind: "custom",
        customRender: () => <CollegeTestimonialsManager institution="engineering" />,
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
