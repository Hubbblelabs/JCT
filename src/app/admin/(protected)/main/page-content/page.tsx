"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { Plus, Trash2, Loader2, Pencil, X, Check } from "lucide-react";
import {
  SiteSectionsEditor,
  type SectionIO,
  type SiteSectionDef,
} from "@/components/admin/SiteSectionsEditor";
import {
  footerLinkSection,
  formSection,
  navbarSection,
  seoSection,
} from "@/components/admin/site-sections";
import { Fieldset } from "@/components/admin/kit";
import { Pamphlet } from "@/components/layout/Pamphlet";
import { HomeHero } from "@/components/layout/HomeHero";
import { TrustHighlightsRow } from "@/components/layout/TrustHighlightsRow";
import { WhyJCT } from "@/components/layout/WhyJCT";
import { Placements } from "@/components/layout/Placements";
import { CampusLife } from "@/components/layout/CampusLife";
import { Testimonials } from "@/components/layout/Testimonials";
import { AdmissionsCTA } from "@/components/layout/AdmissionsCTA";
import {
  PamphletForm,
  LifeAtJctForm,
  WhyChooseJctForm,
  HomeAdmissionsForm,
  AccreditationsForm,
  StatisticsForm,
  HeroOverlayInput,
  RecruitersSectionForm,
  type RecruitersSectionVal,
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
  Field,
  FormGrid,
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
  overlayOpacity?: number;
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
    // Every group lays out on the 12-column form grid — the panel is wide, and
    // one field per row pushed the institution cards several screens down.
    <div className="space-y-6">
      <FormGrid>
        <TextInput
          label="Tour Video URL"
          span={8}
          hint="YouTube embed URL — e.g. https://www.youtube.com/embed/VIDEO_ID"
          value={value.tourVideoUrl ?? ""}
          onChange={(e) => onChange({ ...value, tourVideoUrl: e.target.value })}
          placeholder="https://www.youtube.com/embed/..."
        />
        <div className="admin-col-4">
          <CarouselSpeedInput
            value={value.intervalMs}
            onChange={(intervalMs) => onChange({ ...value, intervalMs })}
          />
        </div>
        <HeroOverlayInput
          value={value.overlayOpacity}
          onChange={(overlayOpacity) => onChange({ ...value, overlayOpacity })}
        />
      </FormGrid>

      {/* Background Images — up to 6, add / replace / remove */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">
          Background Images{" "}
          <span className="font-normal text-gray-400">(up to {BG_LIMIT})</span>
        </h3>
        <p className="mb-3 text-xs text-gray-400">
          Images rotate behind the hero. Upload, replace, or remove each one.
        </p>
        <div className="admin-form-grid admin-form-grid--tight">
          {bg.map((src, i) => (
            <div key={i} className="admin-col-4 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <ImageUploadInput
                  label={`Slide ${i + 1}`}
                  ratio="hero"
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
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...value, backgroundImages: [...bg, ""] })}
          disabled={bg.length >= BG_LIMIT}
          className="admin-btn admin-btn-outline admin-btn-sm mt-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Background Image
        </button>
      </div>

      {/* Title Lines (exactly 3, fixed count) — one row, as they render */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Title Lines{" "}
          <span className="font-normal text-gray-400">(fixed — 3 lines)</span>
        </h3>
        <FormGrid tight>
          {titles.map((line, i) => (
            <TextInput
              key={i}
              label={`Line ${i + 1}`}
              span={4}
              value={line}
              onChange={(e) => {
                const next = [...titles];
                next[i] = e.target.value;
                setTitles(next);
              }}
            />
          ))}
        </FormGrid>
      </div>

      {/* Institution Cards (3 fixed) — side by side, as the home page shows them */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">
          Institution Cards{" "}
          <span className="font-normal text-gray-400">(fixed — 3 cards)</span>
        </h3>
        <p className="mb-3 text-xs text-gray-400">
          Edit the title, description, and highlights for each institution card.
        </p>
        <div className="admin-form-grid admin-form-grid--tight">
          {cards.map((card, i) => (
            <div
              key={i}
              className="admin-col-4 rounded-lg border border-gray-200 p-3"
            >
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
                rows={3}
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
    // The stat cards render as a row on the home page; they edit as one too.
    <div className="admin-form-grid admin-form-grid--tight">
      <p className="admin-col-full text-xs text-gray-500">
        Each card shows a value (e.g. &ldquo;60+&rdquo;) and a label (e.g.
        &ldquo;Years of Excellence&rdquo;). Both are fully customizable.
      </p>
      {STAT_CARD_FIELDS.map(({ valueKey, labelKey, defaultLabel }, i) => (
        <div
          key={valueKey}
          className="admin-col-3 rounded-lg border border-gray-200 p-3"
        >
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Card {i + 1}
          </p>
          <TextInput
            label="Value"
            value={(value[valueKey] as string) ?? ""}
            onChange={(e) => onChange({ ...value, [valueKey]: e.target.value })}
            placeholder="e.g. 60+"
          />
          <TextInput
            label="Label"
            value={(value[labelKey] as string) ?? ""}
            onChange={(e) => onChange({ ...value, [labelKey]: e.target.value })}
            placeholder={defaultLabel}
          />
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

const LIFE_AT_JCT_DEFAULT: LifeAtJctVal = {
  categories: ["All", "Labs", "Sports", "Events", "Clubs"],
  photos: [],
};

const LIFE_AT_JCT_INSTITUTIONS = [
  { key: "engineeringLifeAtJct", label: "Engineering" },
  { key: "artsScienceLifeAtJct", label: "Arts & Science" },
  { key: "polytechnicLifeAtJct", label: "Polytechnic" },
] as const;

/**
 * Copies the home gallery into a college's own Life at JCT draft. The copies
 * are saved by the page's Save draft / Publish like any other edit, and each
 * college stays independently editable afterwards.
 */
function LifeAtJctCopyControl({ io }: { io: SectionIO }) {
  const [copied, setCopied] = useState<string[]>([]);
  return (
    <Fieldset
      legend="Use this gallery on the college pages too"
      hint="Replaces that college's own Life at JCT photos with the ones above. It is saved when you save or publish this page."
    >
      <div className="flex flex-wrap gap-2">
        {LIFE_AT_JCT_INSTITUTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className="admin-btn admin-btn-outline admin-btn-sm"
            onClick={() => {
              io.set(key, structuredClone(io.get("lifeAtJct")));
              setCopied((prev) => [...new Set([...prev, label])]);
            }}
          >
            Copy to {label}
          </button>
        ))}
      </div>
      {copied.length > 0 && (
        <p className="admin-help mt-2">
          Copied to {copied.join(", ")} — save or publish to apply.
        </p>
      )}
    </Fieldset>
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
  // In the order the home page renders.
  const sections: SiteSectionDef[] = [
    formSection<PamphletVal>({
      id: "pamphlet",
      label: "Entry Popup",
      help: "The popup that greets visitors a moment after the home page opens — a poster, or two images or text panels side by side.",
      group: "Top of the page",
      configKey: "homePamphlet",
      defaultValue: { enabled: true, images: [], delayMs: 2000 },
      form: (value, onChange) => (
        <PamphletForm value={value} onChange={onChange} />
      ),
      preview: <Pamphlet preview />,
    }),
    navbarSection(
      { header: "mainHeader", navbar: "mainNavbar" },
      MAIN_NAVBAR_DEFAULT,
    ),
    formSection<HomeVal>({
      id: "hero",
      label: "Hero",
      help: "The large banner at the top: headline, buttons, the three college cards and the rotating background photos.",
      group: "Page sections",
      configKey: "home",
      defaultValue: {},
      form: (value, onChange) => (
        <HomeHeroForm value={value} onChange={onChange} />
      ),
      preview: <HomeHero />,
    }),
    formSection<AccreditationItem[]>({
      id: "accreditations",
      label: "Accreditation Logos",
      help: "The rotating strip of accreditation logos inside the hero.",
      group: "Page sections",
      configKey: "accreditations",
      defaultValue: [],
      form: (value, onChange) => (
        <AccreditationsForm value={value} onChange={onChange} />
      ),
      // Drawn inside the hero, which marks the strip as this section.
    }),
    formSection<HomeStatisticItem[]>({
      id: "statistics",
      label: "Statistics",
      help: "The row of headline numbers just below the hero.",
      group: "Page sections",
      configKey: "homeStatistics",
      defaultValue: [],
      form: (value, onChange) => (
        <StatisticsForm value={value} onChange={onChange} />
      ),
      preview: <TrustHighlightsRow />,
    }),
    formSection<WhyChooseJctVal>({
      id: "whyChooseJct",
      label: "Why Choose JCT",
      help: "The value-proposition block: heading, description and feature cards.",
      group: "Page sections",
      configKey: "whyChooseJct",
      defaultValue: {},
      form: (value, onChange) => (
        <WhyChooseJctForm value={value} onChange={onChange} />
      ),
      preview: <WhyJCT />,
    }),
    formSection<HomeStatsVal>({
      id: "card",
      label: "Stat Counters",
      help: "The dark strip of counters (years of excellence, alumni…) at the bottom of Why Choose JCT.",
      group: "Page sections",
      configKey: "homeStats",
      defaultValue: {},
      form: (value, onChange) => (
        <HomeStatsForm value={value} onChange={onChange} />
      ),
      // Drawn inside Why Choose JCT, which marks the strip as this section.
    }),
    formSection<RecruitersSectionVal>({
      id: "placements",
      label: "Placement Highlights",
      help: "The placement section: heading, description and stat cards. The company logos come from every college's placement records.",
      group: "Page sections",
      configKey: "mainPlacementHighlights",
      defaultValue: {},
      form: (value, onChange) => (
        <RecruitersSectionForm value={value} onChange={onChange} />
      ),
      preview: <Placements />,
    }),
    {
      id: "lifeAtJct",
      label: "Life at JCT",
      help: "The photo gallery of campus life, with its category filters.",
      group: "Page sections",
      keys: [
        { key: "lifeAtJct", defaultValue: LIFE_AT_JCT_DEFAULT },
        // Loaded so "Copy to …" can write them; saved with the page.
        ...LIFE_AT_JCT_INSTITUTIONS.map(({ key }) => ({
          key,
          defaultValue: LIFE_AT_JCT_DEFAULT,
        })),
      ],
      render: (io) => (
        <div className="space-y-6">
          <LifeAtJctForm
            value={(io.get("lifeAtJct") as LifeAtJctVal) ?? LIFE_AT_JCT_DEFAULT}
            onChange={(next) => io.set("lifeAtJct", next)}
          />
          <LifeAtJctCopyControl io={io} />
        </div>
      ),
      preview: (
        <CampusLife
          configKey="lifeAtJct"
          campusLifeHref="/campus-life"
          eventsHref="/events"
        />
      ),
    },
    {
      id: "testimonials",
      label: "Testimonials",
      help: "Quotes from alumni, students and recruiters across all three colleges.",
      group: "Page sections",
      manager: () => <VoicesInlineManager />,
      preview: <Testimonials />,
    },
    formSection<HomeAdmissionsVal>({
      id: "homeAdmissions",
      label: "Admissions",
      help: "The admissions call-to-action near the bottom of the page.",
      group: "Page sections",
      configKey: "homeAdmissions",
      defaultValue: {},
      form: (value, onChange) => (
        <HomeAdmissionsForm value={value} onChange={onChange} />
      ),
      preview: <AdmissionsCTA />,
    }),
    footerLinkSection(),
    seoSection("main", "mainSeo"),
  ];

  return (
    <SiteSectionsEditor
      title="Home — Landing Page"
      description="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      publicHref="/"
      institution="main"
      sections={sections}
      frameClassName="bg-surface text-foreground"
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
