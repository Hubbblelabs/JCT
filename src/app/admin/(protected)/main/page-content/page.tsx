"use client";

import { useEffect, useState, Suspense } from "react";
import { Plus, Trash2, Loader2, Pencil, X, Check } from "lucide-react";
import {
  PageContentShell,
  type SectionDef,
} from "@/components/admin/PageContentShell";
import {
  PamphletForm,
  LifeAtJctForm,
  type PamphletVal,
  type LifeAtJctVal,
} from "@/components/admin/PageContentForms";
import {
  TextArea,
  TextInput,
  Select,
  ImageUploadInput,
  DocumentUploadInput,
} from "@/components/admin/inputs";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroCard = {
  title: string;
  description: string;
  href: string;
  icon: string;
  ctaLabel: string;
  highlights: string;
};

type HomeVal = {
  backgroundImages?: string[];
  titleLines?: string[];
  cards?: HeroCard[];
  tourVideoUrl?: string;
};

type HomeStatsVal = {
  yearsOfExcellence?: string;
  alumni?: string;
  studentsPlaced?: string;
  industryAwards?: string;
};

type HomeProspectusVal = {
  url?: string;
};

// ─── Hero Form ────────────────────────────────────────────────────────────────

const BG_LIMIT = 3;
const TITLE_COUNT = 3;

const DEFAULT_CARD: HeroCard = {
  title: "",
  description: "",
  href: "",
  icon: "engineering",
  ctaLabel: "Explore",
  highlights: "",
};

function HomeHeroForm({
  value,
  onChange,
}: {
  value: HomeVal;
  onChange: (v: HomeVal) => void;
}) {
  const bg = value.backgroundImages ?? [];
  // Pad title lines to always show exactly TITLE_COUNT inputs
  const rawTitles = value.titleLines ?? [];
  const titles = Array.from(
    { length: TITLE_COUNT },
    (_, i) => rawTitles[i] ?? "",
  );
  // Pad cards to always show 3
  const rawCards = value.cards ?? [];
  const cards = Array.from(
    { length: 3 },
    (_, i) => rawCards[i] ?? { ...DEFAULT_CARD },
  );

  const setTitles = (next: string[]) =>
    onChange({ ...value, titleLines: next });
  const setCards = (next: HeroCard[]) => onChange({ ...value, cards: next });

  return (
    <div className="space-y-6">
      {/* Tour Video URL */}
      <div>
        <TextInput
          label="Tour Video URL"
          hint="YouTube embed URL — e.g. https://www.youtube.com/embed/VIDEO_ID"
          value={value.tourVideoUrl ?? ""}
          onChange={(e) => onChange({ ...value, tourVideoUrl: e.target.value })}
          placeholder="https://www.youtube.com/embed/..."
        />
      </div>

      {/* Background Images (3 fixed slots — replace or remove only) */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">
          Background Images{" "}
          <span className="font-normal text-gray-400">(3 fixed slots)</span>
        </h3>
        <p className="mb-3 text-xs text-gray-400">
          Upload or replace each slide image. Use the ✕ on the preview to
          clear a slot.
        </p>
        <div className="space-y-2">
          {Array.from({ length: BG_LIMIT }, (_, i) => (
            <ImageUploadInput
              key={i}
              label={`Slide ${i + 1}`}
              value={bg[i] ?? ""}
              onChange={(url) => {
                const next = Array.from(
                  { length: BG_LIMIT },
                  (__, j) => bg[j] ?? "",
                );
                next[i] = url;
                onChange({ ...value, backgroundImages: next });
              }}
              uploadOnly
            />
          ))}
        </div>
      </div>

      {/* Title Lines (exactly 3, fixed count) */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Title Lines{" "}
          <span className="font-normal text-gray-400">(fixed — 3 lines)</span>
        </h3>
        <div className="space-y-2">
          {titles.map((line, i) => (
            <TextInput
              key={i}
              label={`Line ${i + 1}`}
              value={line}
              onChange={(e) => {
                const next = [...titles];
                next[i] = e.target.value;
                setTitles(next);
              }}
            />
          ))}
        </div>
      </div>

      {/* Institution Cards (3 fixed) */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">
          Institution Cards{" "}
          <span className="font-normal text-gray-400">(fixed — 3 cards)</span>
        </h3>
        <p className="mb-3 text-xs text-gray-400">
          Edit the title, description, and highlights for each institution card.
        </p>
        <div className="space-y-3">
          {cards.map((card, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Card {i + 1}
              </p>
              <TextInput
                label="Title"
                value={card.title}
                onChange={(e) => {
                  const next = [...cards];
                  next[i] = { ...card, title: e.target.value };
                  setCards(next);
                }}
              />
              <TextArea
                label="Description"
                value={card.description}
                rows={2}
                onChange={(e) => {
                  const next = [...cards];
                  next[i] = { ...card, description: e.target.value };
                  setCards(next);
                }}
              />
              <TextInput
                label="Highlights"
                value={card.highlights}
                onChange={(e) => {
                  const next = [...cards];
                  next[i] = { ...card, highlights: e.target.value };
                  setCards(next);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card / Stats Form ────────────────────────────────────────────────────────

const STAT_FIELDS: { key: keyof HomeStatsVal; label: string }[] = [
  { key: "yearsOfExcellence", label: "Years of Excellence" },
  { key: "alumni", label: "Alumni" },
  { key: "studentsPlaced", label: "Students Placed" },
  { key: "industryAwards", label: "Industry Awards" },
];

function HomeStatsForm({
  value,
  onChange,
}: {
  value: HomeStatsVal;
  onChange: (v: HomeStatsVal) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">
        Enter the value displayed for each stat card (e.g. &ldquo;60+&rdquo;,
        &ldquo;15,000+&rdquo;).
      </p>
      {STAT_FIELDS.map(({ key, label }) => (
        <TextInput
          key={key}
          label={label}
          value={(value[key] as string) ?? ""}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          placeholder="e.g. 60+"
        />
      ))}
    </div>
  );
}

// ─── Prospectus Form ──────────────────────────────────────────────────────────

function HomeProspectusForm({
  value,
  onChange,
}: {
  value: HomeProspectusVal;
  onChange: (v: HomeProspectusVal) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">
        Upload the prospectus PDF. The Download Prospectus button on the homepage
        will link to this file.
      </p>
      <DocumentUploadInput
        label="Prospectus PDF"
        value={value.url ?? ""}
        onChange={(url) => onChange({ ...value, url })}
      />
    </div>
  );
}

// ─── Inline Voices / Testimonials Manager ────────────────────────────────────

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
          onChange({
            ...draft,
            category: e.target.value as TestimonialDraft["category"],
          })
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
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Check size={13} />
          )}
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}

function VoicesInlineManager() {
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
      const r = await fetch("/api/admin/testimonials?institution=all");
      if (!r.ok) throw new Error("Failed to load");
      const data: TestimonialItem[] = await r.json();
      setItems(data);
    } catch {
      setError("Could not load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!draft.name.trim() || !draft.quote.trim()) return;
    setSaving(true);
    try {
      const r = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, institution: "all" }),
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
      const r = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!r.ok) throw new Error();
      await load();
    } catch {
      setError("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (item: TestimonialItem) => {
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
        <p className="text-sm text-gray-400">No testimonials yet.</p>
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
                  <span className="font-semibold text-sm text-gray-800">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    {item.category}
                  </span>
                  {!item.is_active && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-400">
                      Inactive
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {[item.batch, item.course, item.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
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

// ─── Seed Banner ──────────────────────────────────────────────────────────────

function SeedBanner() {
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  const handleSeed = async () => {
    setSeeding(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/site-config/seed", { method: "POST" });
      if (r.ok) {
        setMsg({
          kind: "ok",
          text: "Default content seeded. Reload the page to see it in the forms.",
        });
      } else {
        setMsg({ kind: "err", text: "Seed failed. Check your permissions." });
      }
    } catch {
      setMsg({ kind: "err", text: "Seed failed." });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-amber-800">
          Seed default content
        </p>
        <p className="text-xs text-amber-600">
          Write the built-in default data for Hero and Card sections to the
          database. Reload the page after seeding to see the data in the forms.
        </p>
        {msg && (
          <p
            className={`mt-1 text-xs font-medium ${msg.kind === "ok" ? "text-green-700" : "text-red-600"}`}
          >
            {msg.text}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleSeed}
        disabled={seeding}
        className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
      >
        {seeding ? (
          <Loader2 size={13} className="animate-spin" />
        ) : null}
        {seeding ? "Seeding…" : "Seed Defaults"}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Inner() {
  const sections: SectionDef[] = [
    {
      id: "hero",
      label: "Hero",
      kind: "form",
      configKey: "home",
      defaultValue: {} as HomeVal,
      render: (v, onChange) => (
        <HomeHeroForm
          value={(v as HomeVal) ?? {}}
          onChange={(next) => onChange(next)}
        />
      ),
    },
    {
      id: "card",
      label: "Card",
      kind: "form",
      configKey: "homeStats",
      defaultValue: {} as HomeStatsVal,
      render: (v, onChange) => (
        <HomeStatsForm
          value={(v as HomeStatsVal) ?? {}}
          onChange={(next) => onChange(next)}
        />
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
            Changes here also update the Engineering college page, and vice versa.
          </p>
          <LifeAtJctForm
            value={(v as LifeAtJctVal) ?? {}}
            onChange={(next) => onChange(next)}
          />
        </>
      ),
    },
    {
      id: "testimonials",
      label: "Testimonials",
      kind: "custom",
      customRender: () => <VoicesInlineManager />,
    },
    {
      id: "prospectus",
      label: "Prospectus",
      kind: "form",
      configKey: "homeProspectus",
      defaultValue: { url: "" } as HomeProspectusVal,
      render: (v, onChange) => (
        <HomeProspectusForm
          value={(v as HomeProspectusVal) ?? {}}
          onChange={(next) => onChange(next)}
        />
      ),
    },
    {
      id: "pamphlet",
      label: "Pamphlet Popup",
      kind: "form",
      configKey: "homePamphlet",
      defaultValue: { enabled: true, images: [], delayMs: 2000 } as PamphletVal,
      render: (v, onChange) => (
        <PamphletForm
          value={(v as PamphletVal) ?? {}}
          onChange={(next) => onChange(next)}
        />
      ),
    },
  ];

  return (
    <div>
      <SeedBanner />
      <PageContentShell
        pageTitle="Main Landing Page"
        pageSubtitle="Hero, stat cards, Life at JCT gallery, testimonials, and prospectus."
        sections={sections}
      />
    </div>
  );
}

export default function MainPageContentPage() {
  return (
    <Suspense fallback={<div className="admin-content">Loading…</div>}>
      <Inner />
    </Suspense>
  );
}
