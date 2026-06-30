"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { Plus, Trash2, Loader2, Pencil, X, Check } from "lucide-react";
import {
  PageContentShell,
  type SectionDef,
} from "@/components/admin/PageContentShell";
import {
  PamphletForm,
  LifeAtJctForm,
  WhyChooseJctForm,
  HomeAdmissionsForm,
  AccreditationsForm,
  StatisticsForm,
  NavbarAdminSection,
  type PamphletVal,
  type LifeAtJctVal,
  type WhyChooseJctVal,
  type HomeAdmissionsVal,
  type AccreditationItem,
  type HomeStatisticItem,
  type NavbarVal,
} from "@/components/admin/PageContentForms";
import { mainNavigation } from "@/data/all-navigations";
import {
  TextArea,
  TextInput,
  Select,
  ImageUploadInput,
} from "@/components/admin/inputs";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";

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
  intervalMs?: number;
};

type HomeStatsVal = {
  yearsOfExcellence?: string;
  yearsOfExcellenceLabel?: string;
  alumni?: string;
  alumniLabel?: string;
  studentsPlaced?: string;
  studentsPlacedLabel?: string;
  industryAwards?: string;
  industryAwardsLabel?: string;
};

// ─── Carousel Speed Input ────────────────────────────────────────────────────

function CarouselSpeedInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const [draft, setDraft] = useState(() => String(value ?? 6000));
  useEffect(() => {
    setDraft(String(value ?? 6000));
  }, [value]);
  return (
    <TextInput
      label="Carousel Speed (ms)"
      type="number"
      min={1500}
      max={60000}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const num = Number(draft);
        if (draft !== "" && !isNaN(num) && num >= 1500 && num <= 60000) {
          onChange(num);
        } else {
          setDraft(String(value ?? 6000));
        }
      }}
      hint="How long each background image stays before rotating. Between 1500ms and 60000ms."
    />
  );
}

// ─── Hero Form ────────────────────────────────────────────────────────────────

const BG_LIMIT = 6;
const TITLE_COUNT = 3;

const CARD_DEFAULTS: HeroCard[] = [
  {
    title: "",
    description: "",
    href: "/institutions/engineering",
    icon: "engineering",
    ctaLabel: "Explore",
    highlights: "",
  },
  {
    title: "",
    description: "",
    href: "/institutions/arts-science",
    icon: "arts",
    ctaLabel: "Explore",
    highlights: "",
  },
  {
    title: "",
    description: "",
    href: "/institutions/polytechnic",
    icon: "polytechnic",
    ctaLabel: "Explore",
    highlights: "",
  },
];

const CARD_HREF_PLACEHOLDERS = [
  "/institutions/engineering",
  "/institutions/arts-science",
  "/institutions/polytechnic",
];

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
    (_, i) => rawCards[i] ?? { ...CARD_DEFAULTS[i] },
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

      {/* Background Images — up to 6, add / replace / remove */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">
          Background Images{" "}
          <span className="font-normal text-gray-400">(up to {BG_LIMIT})</span>
        </h3>
        <p className="mb-3 text-xs text-gray-400">
          Images rotate behind the hero. Upload, replace, or remove each one.
        </p>
        <div className="space-y-2">
          {bg.map((src, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <ImageUploadInput
                  label={`Slide ${i + 1}`}
                  value={src}
                  onChange={(url) =>
                    onChange({
                      ...value,
                      backgroundImages: bg.map((s, j) => (j === i ? url : s)),
                    })
                  }
                  hideUrlField
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    backgroundImages: bg.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ ...value, backgroundImages: [...bg, ""] })
            }
            disabled={bg.length >= BG_LIMIT}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} /> Add Background Image
          </button>
        </div>
      </div>

      {/* Carousel speed */}
      <CarouselSpeedInput
        value={value.intervalMs}
        onChange={(intervalMs) => onChange({ ...value, intervalMs })}
      />

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
              <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
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
              <TextInput
                label="Link URL"
                value={card.href}
                onChange={(e) => {
                  const next = [...cards];
                  next[i] = { ...card, href: e.target.value };
                  setCards(next);
                }}
                placeholder={CARD_HREF_PLACEHOLDERS[i]}
                hint="Root-relative path to the institution page"
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

type StatCardField = {
  valueKey: keyof HomeStatsVal;
  labelKey: keyof HomeStatsVal;
  defaultLabel: string;
};

const STAT_CARD_FIELDS: StatCardField[] = [
  {
    valueKey: "yearsOfExcellence",
    labelKey: "yearsOfExcellenceLabel",
    defaultLabel: "Years of Excellence",
  },
  { valueKey: "alumni", labelKey: "alumniLabel", defaultLabel: "Alumni" },
  {
    valueKey: "studentsPlaced",
    labelKey: "studentsPlacedLabel",
    defaultLabel: "Students Placed",
  },
  {
    valueKey: "industryAwards",
    labelKey: "industryAwardsLabel",
    defaultLabel: "Industry Awards",
  },
];

function HomeStatsForm({
  value,
  onChange,
}: {
  value: HomeStatsVal;
  onChange: (v: HomeStatsVal) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">
        Each card shows a value (e.g. &ldquo;60+&rdquo;) and a label (e.g.
        &ldquo;Years of Excellence&rdquo;). Both are fully customizable.
      </p>
      {STAT_CARD_FIELDS.map(({ valueKey, labelKey, defaultLabel }, i) => (
        <div key={valueKey} className="rounded-lg border border-gray-200 p-3">
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Card {i + 1}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Value"
              value={(value[valueKey] as string) ?? ""}
              onChange={(e) =>
                onChange({ ...value, [valueKey]: e.target.value })
              }
              placeholder="e.g. 60+"
            />
            <TextInput
              label="Label"
              value={(value[labelKey] as string) ?? ""}
              onChange={(e) =>
                onChange({ ...value, [labelKey]: e.target.value })
              }
              placeholder={defaultLabel}
            />
          </div>
        </div>
      ))}
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
    <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
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
        hideUrlField
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.is_active}
          onChange={(e) => onChange({ ...draft, is_active: e.target.checked })}
        />
        Active (visible on site)
      </label>
      {flushError && <p className="text-xs text-red-600">{flushError}</p>}
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

function VoicesInlineManager() {
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

  const handleAdd = async (flushed: TestimonialDraft) => {
    if (!flushed.name.trim() || !flushed.quote.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...flushed, institution: "all" }),
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const MAIN_NAVBAR_DEFAULT: NavbarVal = {
  items: mainNavigation.map((it) => ({
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

function Inner() {
  const sections: SectionDef[] = [
    {
      id: "navbar",
      label: "Navbar",
      kind: "custom",
      customRender: () => (
        <NavbarAdminSection
          headerConfigKey="mainHeader"
          navbarConfigKey="mainNavbar"
          navDefault={MAIN_NAVBAR_DEFAULT}
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
      id: "accreditations",
      label: "Accreditations",
      kind: "form",
      configKey: "accreditations",
      defaultValue: [] as AccreditationItem[],
      render: (v, onChange) => (
        <AccreditationsForm
          value={(v as AccreditationItem[]) ?? []}
          onChange={(next) => onChange(next)}
        />
      ),
    },
    {
      id: "statistics",
      label: "Statistics",
      kind: "form",
      configKey: "homeStatistics",
      defaultValue: [] as HomeStatisticItem[],
      render: (v, onChange) => (
        <StatisticsForm
          value={(v as HomeStatisticItem[]) ?? []}
          onChange={(next) => onChange(next)}
        />
      ),
    },
    {
      id: "whyChooseJct",
      label: "Why Choose JCT",
      kind: "form",
      configKey: "whyChooseJct",
      defaultValue: {} as WhyChooseJctVal,
      render: (v, onChange) => (
        <WhyChooseJctForm
          value={(v as WhyChooseJctVal) ?? {}}
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
            Changes here also update the Engineering college page, and vice
            versa.
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
      id: "homeAdmissions",
      label: "Admissions",
      kind: "form",
      configKey: "homeAdmissions",
      defaultValue: {} as HomeAdmissionsVal,
      render: (v, onChange) => (
        <HomeAdmissionsForm
          value={(v as HomeAdmissionsVal) ?? {}}
          onChange={(next) => onChange(next)}
        />
      ),
    },
  ];

  return (
    <PageContentShell
      pageTitle="Main Landing Page"
      pageSubtitle="Hero, stat cards, Life at JCT gallery, testimonials, and admissions."
      sections={sections}
    />
  );
}

export default function MainPageContentPage() {
  return (
    <Suspense fallback={<div className="admin-content">Loading…</div>}>
      <Inner />
    </Suspense>
  );
}
