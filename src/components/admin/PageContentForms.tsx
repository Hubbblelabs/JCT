"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  Field,
  ImageUploadInput,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/inputs";
import {
  LIMITS_pamphlet,
  ENG_HERO_LIMITS,
  ARTS_HERO_LIMITS,
  POLY_HERO_LIMITS,
  LIMITS_lifeAtJct,
  LIMITS_campusLifeCarousel,
  LIMITS_polytechnicAdmissions,
  METRICS_LIMITS,
  FACILITIES_LIMITS,
  RESEARCH_HIGHLIGHTS_LIMITS,
  HERO_STATS_LIMITS,
  ADMISSIONS_LIMITS,
  WHY_CHOOSE_JCT_LIMITS,
  HOME_ADMISSIONS_LIMITS,
  HOME_STATISTICS_LIMITS,
  ACCREDITATIONS_LIMITS,
  RECRUITERS_SECTION_LIMITS,
  HEADER_LIMITS,
  FOOTER_LIMITS,
} from "@/lib/validation";

/* ─── Shared types ─── */

export type Cta = { label: string; href: string; primary: boolean };
export type Photo = {
  src: string;
  caption: string;
  category: string;
  isAll?: boolean;
};

/* ─── Generic primitives ─── */

function LimitHint({ count, max }: { count: number; max?: number }) {
  if (!max) return null;
  const atLimit = count >= max;
  return (
    <p
      className={`text-xs ${atLimit ? "font-medium text-amber-600" : "text-gray-400"}`}
    >
      {count}/{max} {atLimit ? "— max reached" : ""}
    </p>
  );
}

function ImageList({
  label,
  value,
  onChange,
  max,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  hint?: string;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = max !== undefined && safe.length >= max;
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {safe.map((src, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <ImageUploadInput
                label=""
                value={src}
                onChange={(url) =>
                  onChange(safe.map((s, j) => (j === i ? url : s)))
                }
                uploadOnly
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(safe.filter((_, j) => j !== i))}
              className="admin-btn admin-btn-danger admin-btn-sm"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onChange([...safe, ""])}
            disabled={atMax}
            title={atMax ? `Max ${max} images reached` : undefined}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} /> Add Image
          </button>
          <LimitHint count={safe.length} max={max} />
        </div>
      </div>
    </Field>
  );
}

function CtaList({
  value,
  onChange,
  max,
}: {
  value: Cta[];
  onChange: (next: Cta[]) => void;
  max?: number;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = max !== undefined && safe.length >= max;
  return (
    <Field label="Call-to-Action Buttons">
      <div className="space-y-3">
        {safe.map((cta, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-3">
            <div className="grid grid-cols-2 gap-3 pr-12">
              <TextInput
                label="Label"
                value={cta.label}
                maxLength={40}
                onChange={(e) =>
                  onChange(
                    safe.map((c, j) =>
                      j === i ? { ...c, label: e.target.value } : c,
                    ),
                  )
                }
              />
              <TextInput
                label="Href"
                value={cta.href}
                maxLength={500}
                onChange={(e) =>
                  onChange(
                    safe.map((c, j) =>
                      j === i ? { ...c, href: e.target.value } : c,
                    ),
                  )
                }
              />
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cta.primary}
                onChange={(e) =>
                  onChange(
                    safe.map((c, j) =>
                      j === i ? { ...c, primary: e.target.checked } : c,
                    ),
                  )
                }
              />
              Primary style
            </label>
            <button
              type="button"
              onClick={() => onChange(safe.filter((_, j) => j !== i))}
              className="admin-btn admin-btn-danger admin-btn-sm mt-2"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              onChange([...safe, { label: "", href: "", primary: false }])
            }
            disabled={atMax}
            title={atMax ? `Max ${max} CTAs reached` : undefined}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} /> Add CTA
          </button>
          <LimitHint count={safe.length} max={max} />
        </div>
      </div>
    </Field>
  );
}

/* ─── Carousel speed ─── */

function IntervalInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <TextInput
      label="Carousel Speed (ms)"
      type="number"
      min={min}
      max={max}
      value={value ?? 6000}
      onChange={(e) => onChange(Number(e.target.value) || 6000)}
      hint={`How long each background image stays before the carousel rotates. Between ${min}ms and ${max}ms.`}
    />
  );
}

/* ─── Accreditations editor (logo + name + description) ─── */

export type AccreditationItem = {
  name: string;
  logo: string;
  description?: string;
};

function AccreditationList({
  value,
  onChange,
  max,
}: {
  value: AccreditationItem[];
  onChange: (next: AccreditationItem[]) => void;
  max: number;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = safe.length >= max;
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <ImageUploadInput
            label="Logo"
            value={item.logo}
            onChange={(url) =>
              onChange(safe.map((a, j) => (j === i ? { ...a, logo: url } : a)))
            }
            uploadOnly
          />
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Name"
              value={item.name}
              maxLength={ACCREDITATIONS_LIMITS.nameMax}
              placeholder="e.g. NAAC Accredited"
              onChange={(e) =>
                onChange(
                  safe.map((a, j) =>
                    j === i ? { ...a, name: e.target.value } : a,
                  ),
                )
              }
            />
            <TextInput
              label="Description"
              value={item.description ?? ""}
              maxLength={ACCREDITATIONS_LIMITS.descriptionMax}
              placeholder="Short note shown under the name"
              onChange={(e) =>
                onChange(
                  safe.map((a, j) =>
                    j === i ? { ...a, description: e.target.value } : a,
                  ),
                )
              }
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            onChange([...safe, { name: "", logo: "", description: "" }])
          }
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Accreditation
        </button>
        <LimitHint count={safe.length} max={max} />
      </div>
    </div>
  );
}

/* ─── Hero forms ─── */

export type EngHeroVal = {
  backgroundImages?: string[];
  title?: string;
  subtitle?: string;
  ctas?: Cta[];
  badgeText?: string;
  counsellingLabel?: string;
  counsellingCode?: string;
  accreditations?: AccreditationItem[];
  accreditationsCaption?: string;
  intervalMs?: number;
};

export function EngineeringHeroForm({
  value,
  onChange,
}: {
  value: EngHeroVal;
  onChange: (v: EngHeroVal) => void;
}) {
  return (
    <div className="space-y-4">
      <ImageList
        label="Background Carousel Images"
        max={ENG_HERO_LIMITS.backgroundImages}
        hint="Images rotate behind the hero (up to 6). Upload, replace, or remove each one."
        value={value.backgroundImages ?? []}
        onChange={(next) => onChange({ ...value, backgroundImages: next })}
      />
      <TextInput
        label="Hero Title"
        value={value.title ?? ""}
        maxLength={ENG_HERO_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        hint="Main headline displayed on the hero section"
      />
      <TextArea
        label="Subtitle"
        value={value.subtitle ?? ""}
        rows={3}
        maxLength={ENG_HERO_LIMITS.subtitleMax}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
      />
      <CtaList
        value={value.ctas ?? []}
        max={ENG_HERO_LIMITS.ctas}
        onChange={(next) => onChange({ ...value, ctas: next })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Badge Text"
          value={value.badgeText ?? ""}
          maxLength={ENG_HERO_LIMITS.badgeTextMax}
          onChange={(e) => onChange({ ...value, badgeText: e.target.value })}
          hint='e.g. "An Autonomous Institution"'
        />
        <TextInput
          label="Counselling Label"
          value={value.counsellingLabel ?? ""}
          maxLength={ENG_HERO_LIMITS.counsellingLabelMax}
          onChange={(e) => onChange({ ...value, counsellingLabel: e.target.value })}
          hint='e.g. "Counselling Code:"'
        />
      </div>
      <TextInput
        label="Counselling Code"
        value={value.counsellingCode ?? ""}
        maxLength={ENG_HERO_LIMITS.counsellingCodeMax}
        onChange={(e) => onChange({ ...value, counsellingCode: e.target.value })}
        hint="e.g. 2724"
      />
      <IntervalInput
        value={value.intervalMs}
        min={ENG_HERO_LIMITS.minIntervalMs}
        max={ENG_HERO_LIMITS.maxIntervalMs}
        onChange={(intervalMs) => onChange({ ...value, intervalMs })}
      />
      <Field
        label="Accreditation Logos"
        hint={`Logos shown in the hero accreditation strip (up to ${ENG_HERO_LIMITS.accreditationsMax}).`}
      >
        <AccreditationList
          value={value.accreditations ?? []}
          max={ENG_HERO_LIMITS.accreditationsMax}
          onChange={(next) => onChange({ ...value, accreditations: next })}
        />
      </Field>
      <TextInput
        label="Accreditation Caption"
        value={value.accreditationsCaption ?? ""}
        maxLength={ENG_HERO_LIMITS.accreditationCaptionMax}
        onChange={(e) =>
          onChange({ ...value, accreditationsCaption: e.target.value })
        }
        hint='Text shown next to the logos, e.g. "Top accreditations & approvals"'
      />
    </div>
  );
}

export type ArtsHeroSubsection = {
  icon: string;
  title: string;
  description: string;
};

export type ArtsHeroVal = {
  backgroundImages?: string[];
  titleLine1?: string;
  titleHighlight?: string;
  titleLine2?: string;
  subtitle?: string;
  ctas?: Cta[];
  subsections?: ArtsHeroSubsection[];
  stats?: HeroStat[];
  intervalMs?: number;
};

function ArtsSubsectionList({
  value,
  onChange,
  max,
}: {
  value: ArtsHeroSubsection[];
  onChange: (next: ArtsHeroSubsection[]) => void;
  max: number;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = safe.length >= max;
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Icon"
              value={item.icon}
              maxLength={ARTS_HERO_LIMITS.subsectionIconMax}
              placeholder="Award"
              onChange={(e) =>
                onChange(
                  safe.map((s, j) =>
                    j === i ? { ...s, icon: e.target.value } : s,
                  ),
                )
              }
            />
            <TextInput
              label="Title"
              value={item.title}
              maxLength={ARTS_HERO_LIMITS.subsectionTitleMax}
              placeholder="Quality"
              onChange={(e) =>
                onChange(
                  safe.map((s, j) =>
                    j === i ? { ...s, title: e.target.value } : s,
                  ),
                )
              }
            />
          </div>
          <TextArea
            label="Description"
            rows={2}
            value={item.description}
            maxLength={ARTS_HERO_LIMITS.subsectionDescMax}
            onChange={(e) =>
              onChange(
                safe.map((s, j) =>
                  j === i ? { ...s, description: e.target.value } : s,
                ),
              )
            }
          />
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            onChange([...safe, { icon: "", title: "", description: "" }])
          }
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Subsection
        </button>
        <LimitHint count={safe.length} max={max} />
      </div>
    </div>
  );
}

export function ArtsScienceHeroForm({
  value,
  onChange,
}: {
  value: ArtsHeroVal;
  onChange: (v: ArtsHeroVal) => void;
}) {
  return (
    <div className="space-y-4">
      <ImageList
        label="Background Carousel Images"
        max={ARTS_HERO_LIMITS.backgroundImages}
        hint="Images rotate behind the hero. Upload, replace, or remove each one."
        value={value.backgroundImages ?? []}
        onChange={(next) => onChange({ ...value, backgroundImages: next })}
      />
      <div className="grid grid-cols-3 gap-3">
        <TextInput
          label="Title Line 1"
          value={value.titleLine1 ?? ""}
          maxLength={ARTS_HERO_LIMITS.partMax}
          onChange={(e) => onChange({ ...value, titleLine1: e.target.value })}
          hint="e.g. Good Education"
        />
        <TextInput
          label="Accent Word"
          value={value.titleHighlight ?? ""}
          maxLength={ARTS_HERO_LIMITS.partMax}
          onChange={(e) =>
            onChange({ ...value, titleHighlight: e.target.value })
          }
          hint='Rendered in orange (e.g. "for")'
        />
        <TextInput
          label="Title Line 2 Rest"
          value={value.titleLine2 ?? ""}
          maxLength={ARTS_HERO_LIMITS.partMax}
          onChange={(e) => onChange({ ...value, titleLine2: e.target.value })}
          hint="e.g. A Better Future"
        />
      </div>
      <TextArea
        label="Subtitle"
        value={value.subtitle ?? ""}
        rows={3}
        maxLength={ARTS_HERO_LIMITS.subtitleMax}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
      />
      <CtaList
        value={value.ctas ?? []}
        max={ARTS_HERO_LIMITS.ctas}
        onChange={(next) => onChange({ ...value, ctas: next })}
      />
      <Field
        label="Hero Subsections"
        hint={`Feature blocks below the hero — Quality, Leadership, Experience (up to ${ARTS_HERO_LIMITS.subsectionsMax}). Icon is a Lucide icon name.`}
      >
        <ArtsSubsectionList
          value={value.subsections ?? []}
          max={ARTS_HERO_LIMITS.subsectionsMax}
          onChange={(next) => onChange({ ...value, subsections: next })}
        />
      </Field>
      <Field
        label="Hero Stat Cards"
        hint="The numbers shown in the hero stat row."
      >
        <HeroStatsForm
          value={value.stats ?? []}
          onChange={(next) => onChange({ ...value, stats: next })}
        />
      </Field>
      <IntervalInput
        value={value.intervalMs}
        min={ARTS_HERO_LIMITS.minIntervalMs}
        max={ARTS_HERO_LIMITS.maxIntervalMs}
        onChange={(intervalMs) => onChange({ ...value, intervalMs })}
      />
    </div>
  );
}

/* ─── Hero stat cards (Arts & Science) ─── */

export type HeroStat = { value: string; label: string; accent?: boolean };

export function HeroStatsForm({
  value,
  onChange,
}: {
  value: HeroStat[];
  onChange: (v: HeroStat[]) => void;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = safe.length >= HERO_STATS_LIMITS.itemsMax;
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Value"
              value={item.value}
              maxLength={HERO_STATS_LIMITS.valueMax}
              placeholder="e.g. 2,500+"
              onChange={(e) =>
                onChange(
                  safe.map((s, j) =>
                    j === i ? { ...s, value: e.target.value } : s,
                  ),
                )
              }
            />
            <TextInput
              label="Label"
              value={item.label}
              maxLength={HERO_STATS_LIMITS.labelMax}
              placeholder="e.g. Students"
              onChange={(e) =>
                onChange(
                  safe.map((s, j) =>
                    j === i ? { ...s, label: e.target.value } : s,
                  ),
                )
              }
            />
          </div>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(item.accent)}
              onChange={(e) =>
                onChange(
                  safe.map((s, j) =>
                    j === i ? { ...s, accent: e.target.checked } : s,
                  ),
                )
              }
            />
            Highlight in accent color
          </label>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            onChange([...safe, { value: "", label: "", accent: false }])
          }
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Stat Card
        </button>
        <LimitHint count={safe.length} max={HERO_STATS_LIMITS.itemsMax} />
      </div>
    </div>
  );
}

export type PolyHeroVal = {
  backgroundImages?: string[];
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctas?: Cta[];
  intervalMs?: number;
};

export function PolytechnicHeroForm({
  value,
  onChange,
}: {
  value: PolyHeroVal;
  onChange: (v: PolyHeroVal) => void;
}) {
  return (
    <div className="space-y-4">
      <ImageList
        label="Background Carousel Images"
        max={POLY_HERO_LIMITS.backgroundImagesMax}
        hint="The carousel rotates through every image. 3 is the design default."
        value={value.backgroundImages ?? []}
        onChange={(next) => onChange({ ...value, backgroundImages: next })}
      />
      <TextInput
        label="Eyebrow"
        value={value.eyebrow ?? ""}
        maxLength={POLY_HERO_LIMITS.eyebrowMax}
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        hint="Small label above the title"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Title Line 1"
          value={value.titleLine1 ?? ""}
          maxLength={POLY_HERO_LIMITS.titleLineMax}
          onChange={(e) => onChange({ ...value, titleLine1: e.target.value })}
        />
        <TextInput
          label="Title Line 2 (italic)"
          value={value.titleLine2 ?? ""}
          maxLength={POLY_HERO_LIMITS.titleLineMax}
          onChange={(e) => onChange({ ...value, titleLine2: e.target.value })}
        />
      </div>
      <TextArea
        label="Subtitle"
        value={value.subtitle ?? ""}
        rows={3}
        maxLength={POLY_HERO_LIMITS.subtitleMax}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
      />
      <CtaList
        value={value.ctas ?? []}
        max={POLY_HERO_LIMITS.ctas}
        onChange={(next) => onChange({ ...value, ctas: next })}
      />
      <TextInput
        label="Carousel Interval (ms)"
        type="number"
        min={POLY_HERO_LIMITS.minIntervalMs}
        max={POLY_HERO_LIMITS.maxIntervalMs}
        value={value.intervalMs ?? 6000}
        onChange={(e) =>
          onChange({ ...value, intervalMs: Number(e.target.value) || 6000 })
        }
        hint={`Between ${POLY_HERO_LIMITS.minIntervalMs}ms and ${POLY_HERO_LIMITS.maxIntervalMs}ms`}
      />
    </div>
  );
}

/* ─── Pamphlet ─── */

export type PamphletVal = {
  enabled?: boolean;
  images?: string[];
  delayMs?: number;
  videoUrl?: string;
};

export function PamphletForm({
  value,
  onChange,
}: {
  value: PamphletVal;
  onChange: (v: PamphletVal) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.enabled !== false}
          onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
        />
        Show popup on page load
      </label>
      <TextInput
        label="Show after (ms)"
        type="number"
        min={LIMITS_pamphlet.minDelayMs}
        max={LIMITS_pamphlet.maxDelayMs}
        value={value.delayMs ?? 2000}
        onChange={(e) =>
          onChange({ ...value, delayMs: Number(e.target.value) || 2000 })
        }
        hint={`Delay in milliseconds before the popup appears (max ${LIMITS_pamphlet.maxDelayMs})`}
      />
      <ImageList
        label={`Popup Images (up to ${LIMITS_pamphlet.images} — left and right halves)`}
        max={LIMITS_pamphlet.images}
        hint="The pamphlet popup renders exactly two image slots — left and right. Extra images are not displayed."
        value={value.images ?? []}
        onChange={(next) => onChange({ ...value, images: next })}
      />
      <TextInput
        label="Virtual Tour Video URL"
        value={value.videoUrl ?? ""}
        onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
        placeholder="https://www.youtube.com/embed/VIDEO_ID"
        hint="YouTube embed URL — used for the Virtual Tour button inside the popup."
      />
    </div>
  );
}

/* ─── Life at JCT ─── */

export type LifeAtJctVal = {
  categories?: string[];
  photos?: Photo[];
  videoUrl?: string;
};

export function LifeAtJctForm({
  value,
  onChange,
}: {
  value: LifeAtJctVal;
  onChange: (v: LifeAtJctVal) => void;
}) {
  const categories = value.categories ?? [
    "All",
    "Labs",
    "Sports",
    "Events",
    "Clubs",
  ];
  const photos = Array.isArray(value.photos) ? value.photos : [];
  const catsAtMax = categories.length >= LIMITS_lifeAtJct.categories;
  const photosAtMax = photos.length >= LIMITS_lifeAtJct.photos;
  return (
    <div className="space-y-5">
      <Field
        label="Filter Categories"
        hint={`The first category is the 'All' tab — photos marked 'Show in All' show up there. Max ${LIMITS_lifeAtJct.categories}.`}
      >
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="admin-input"
                value={cat}
                maxLength={LIMITS_lifeAtJct.categoryLabelMax}
                onChange={(e) =>
                  onChange({
                    ...value,
                    categories: categories.map((c, j) =>
                      j === i ? e.target.value : c,
                    ),
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    categories: categories.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({ ...value, categories: [...categories, ""] })
              }
              disabled={catsAtMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Category
            </button>
            <LimitHint
              count={categories.length}
              max={LIMITS_lifeAtJct.categories}
            />
          </div>
        </div>
      </Field>

      <Field label="Photos" hint={`Max ${LIMITS_lifeAtJct.photos} photos.`}>
        <div className="space-y-3">
          {photos.map((photo, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <ImageUploadInput
                label="Image"
                value={photo.src}
                onChange={(url) =>
                  onChange({
                    ...value,
                    photos: photos.map((p, j) =>
                      j === i ? { ...p, src: url } : p,
                    ),
                  })
                }
                uploadOnly
              />
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Caption"
                  value={photo.caption}
                  maxLength={LIMITS_lifeAtJct.captionMax}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      photos: photos.map((p, j) =>
                        j === i ? { ...p, caption: e.target.value } : p,
                      ),
                    })
                  }
                />
                <Select
                  label="Category"
                  value={photo.category}
                  options={categories
                    .filter((c) => c && c !== "All")
                    .map((c) => ({ value: c, label: c }))}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      photos: photos.map((p, j) =>
                        j === i ? { ...p, category: e.target.value } : p,
                      ),
                    })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(photo.isAll)}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      photos: photos.map((p, j) =>
                        j === i ? { ...p, isAll: e.target.checked } : p,
                      ),
                    })
                  }
                />
                Show in &quot;All&quot; tab
              </label>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    photos: photos.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  photos: [
                    ...photos,
                    {
                      src: "",
                      caption: "",
                      category:
                        categories.find((c) => c && c !== "All") ?? "Labs",
                      isAll: false,
                    },
                  ],
                })
              }
              disabled={photosAtMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Photo
            </button>
            <LimitHint count={photos.length} max={LIMITS_lifeAtJct.photos} />
          </div>
        </div>
      </Field>

      <TextInput
        label="Virtual Tour Video URL"
        value={value.videoUrl ?? ""}
        maxLength={500}
        onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
        placeholder="https://www.youtube.com/embed/..."
        hint="YouTube embed URL — used for the 'Take a Virtual Campus Tour' button."
      />
    </div>
  );
}

/* ─── Campus Life carousel (arts / polytechnic) ─── */

export type CampusLifeCarouselVal = {
  photos?: string[];
  cta?: { label: string; href: string };
};

export function CampusLifeCarouselForm({
  value,
  onChange,
}: {
  value: CampusLifeCarouselVal;
  onChange: (v: CampusLifeCarouselVal) => void;
}) {
  return (
    <div className="space-y-4">
      <ImageList
        label="Carousel Photos"
        max={LIMITS_campusLifeCarousel.photos}
        value={value.photos ?? []}
        onChange={(next) => onChange({ ...value, photos: next })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Button Label"
          value={value.cta?.label ?? ""}
          maxLength={LIMITS_campusLifeCarousel.ctaLabelMax}
          onChange={(e) =>
            onChange({
              ...value,
              cta: {
                ...(value.cta ?? { label: "", href: "" }),
                label: e.target.value,
              },
            })
          }
          placeholder="Explore Full Campus Life"
        />
        <TextInput
          label="Button Href"
          value={value.cta?.href ?? ""}
          maxLength={500}
          onChange={(e) =>
            onChange({
              ...value,
              cta: {
                ...(value.cta ?? { label: "", href: "" }),
                href: e.target.value,
              },
            })
          }
          placeholder="/campus-life"
        />
      </div>
    </div>
  );
}

/* ─── Announcement bar ─── */

export type AnnouncementVal = {
  enabled?: boolean;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function AnnouncementForm({
  value,
  onChange,
}: {
  value: AnnouncementVal;
  onChange: (v: AnnouncementVal) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.enabled !== false}
          onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
        />
        Show the announcement bar
      </label>
      <TextInput
        label="Announcement Text"
        value={value.text ?? ""}
        maxLength={120}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        placeholder="e.g. Admissions open for 2025–26 batch"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="CTA Label (optional)"
          value={value.ctaLabel ?? ""}
          maxLength={24}
          onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })}
          placeholder="e.g. Apply Now"
        />
        <TextInput
          label="CTA Link (optional)"
          value={value.ctaHref ?? ""}
          maxLength={500}
          onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}

/* ─── Polytechnic Admissions ─── */

export type AdmissionsCriterion = { title: string; items: string[] };
export type AdmissionsVal = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  criteria?: AdmissionsCriterion[];
  phone?: string;
  email?: string;
  address?: string;
};

export function PolytechnicAdmissionsForm({
  value,
  onChange,
}: {
  value: AdmissionsVal;
  onChange: (v: AdmissionsVal) => void;
}) {
  const criteria = Array.isArray(value.criteria) ? value.criteria : [];
  const criteriaAtMax =
    criteria.length >= LIMITS_polytechnicAdmissions.criteriaMax;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Eyebrow"
          value={value.eyebrow ?? ""}
          maxLength={LIMITS_polytechnicAdmissions.eyebrowMax}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
        <TextInput
          label="Title"
          value={value.title ?? ""}
          maxLength={LIMITS_polytechnicAdmissions.titleMax}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <TextArea
        label="Description"
        rows={2}
        value={value.description ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="CTA Label"
          value={value.ctaLabel ?? ""}
          maxLength={LIMITS_polytechnicAdmissions.ctaLabelMax}
          onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })}
        />
        <TextInput
          label="CTA Href"
          value={value.ctaHref ?? ""}
          maxLength={500}
          onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
        />
      </div>

      <Field
        label="Admission Criteria Blocks"
        hint={`The frontend renders exactly ${LIMITS_polytechnicAdmissions.criteriaMax} columns. Extra blocks will be saved but never displayed.`}
      >
        <div className="space-y-3">
          {criteria.map((block, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <TextInput
                label="Block Title"
                value={block.title}
                maxLength={LIMITS_polytechnicAdmissions.blockTitleMax}
                onChange={(e) =>
                  onChange({
                    ...value,
                    criteria: criteria.map((b, j) =>
                      j === i ? { ...b, title: e.target.value } : b,
                    ),
                  })
                }
              />
              <Field
                label="Items"
                hint={`Max ${LIMITS_polytechnicAdmissions.itemsPerBlockMax} items per block.`}
              >
                <div className="space-y-2">
                  {block.items.map((item, k) => (
                    <div key={k} className="flex gap-2">
                      <input
                        className="admin-input"
                        value={item}
                        maxLength={LIMITS_polytechnicAdmissions.itemMax}
                        onChange={(e) =>
                          onChange({
                            ...value,
                            criteria: criteria.map((b, j) =>
                              j === i
                                ? {
                                    ...b,
                                    items: b.items.map((it, m) =>
                                      m === k ? e.target.value : it,
                                    ),
                                  }
                                : b,
                            ),
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...value,
                            criteria: criteria.map((b, j) =>
                              j === i
                                ? {
                                    ...b,
                                    items: b.items.filter((_, m) => m !== k),
                                  }
                                : b,
                            ),
                          })
                        }
                        className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...value,
                        criteria: criteria.map((b, j) =>
                          j === i ? { ...b, items: [...b.items, ""] } : b,
                        ),
                      })
                    }
                    disabled={
                      block.items.length >=
                      LIMITS_polytechnicAdmissions.itemsPerBlockMax
                    }
                    className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
              </Field>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    criteria: criteria.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove Block
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  criteria: [...criteria, { title: "", items: [] }],
                })
              }
              disabled={criteriaAtMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Criterion Block
            </button>
            <LimitHint
              count={criteria.length}
              max={LIMITS_polytechnicAdmissions.criteriaMax}
            />
          </div>
        </div>
      </Field>

      <Field
        label="Contact Strip"
        hint="Phone, email, and address shown below the admission criteria."
      >
        <div className="space-y-3">
          <TextInput
            label="Phone"
            value={value.phone ?? ""}
            maxLength={LIMITS_polytechnicAdmissions.phoneMax}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="+91 93614 88801"
          />
          <TextInput
            label="Email"
            value={value.email ?? ""}
            maxLength={LIMITS_polytechnicAdmissions.emailMax}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="admissions@jct.ac.in"
          />
          <TextInput
            label="Address"
            value={value.address ?? ""}
            maxLength={LIMITS_polytechnicAdmissions.addressMax}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="Knowledge Park, Pichanur, Coimbatore - 641105"
          />
        </div>
      </Field>
    </div>
  );
}

/* ─── Engineering metrics / facilities / research highlights ─── */

export type Metric = { value: string; label: string; sub?: string };

export function MetricsForm({
  value,
  onChange,
}: {
  value: Metric[];
  onChange: (v: Metric[]) => void;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = safe.length >= METRICS_LIMITS.itemsMax;
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-3 gap-3 pr-12">
            <TextInput
              label="Value"
              value={item.value}
              maxLength={METRICS_LIMITS.valueMax}
              onChange={(e) =>
                onChange(
                  safe.map((m, j) =>
                    j === i ? { ...m, value: e.target.value } : m,
                  ),
                )
              }
            />
            <TextInput
              label="Label"
              value={item.label}
              maxLength={METRICS_LIMITS.labelMax}
              onChange={(e) =>
                onChange(
                  safe.map((m, j) =>
                    j === i ? { ...m, label: e.target.value } : m,
                  ),
                )
              }
            />
            <TextInput
              label="Sub"
              value={item.sub ?? ""}
              maxLength={METRICS_LIMITS.subMax}
              onChange={(e) =>
                onChange(
                  safe.map((m, j) =>
                    j === i ? { ...m, sub: e.target.value } : m,
                  ),
                )
              }
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange([...safe, { value: "", label: "", sub: "" }])}
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Metric
        </button>
        <LimitHint count={safe.length} max={METRICS_LIMITS.itemsMax} />
      </div>
    </div>
  );
}

export type Facility = { title: string; desc?: string };

export function FacilitiesForm({
  value,
  onChange,
}: {
  value: Facility[];
  onChange: (v: Facility[]) => void;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = safe.length >= FACILITIES_LIMITS.itemsMax;
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <TextInput
            label="Title"
            value={item.title}
            maxLength={FACILITIES_LIMITS.titleMax}
            onChange={(e) =>
              onChange(
                safe.map((m, j) =>
                  j === i ? { ...m, title: e.target.value } : m,
                ),
              )
            }
          />
          <TextArea
            label="Description"
            rows={2}
            value={item.desc ?? ""}
            maxLength={FACILITIES_LIMITS.descMax}
            onChange={(e) =>
              onChange(
                safe.map((m, j) =>
                  j === i ? { ...m, desc: e.target.value } : m,
                ),
              )
            }
          />
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange([...safe, { title: "", desc: "" }])}
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Facility
        </button>
        <LimitHint count={safe.length} max={FACILITIES_LIMITS.itemsMax} />
      </div>
    </div>
  );
}

export function StringListForm({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = safe.length >= RESEARCH_HIGHLIGHTS_LIMITS.itemsMax;
  return (
    <div className="space-y-2">
      {safe.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="admin-input"
            value={item}
            maxLength={RESEARCH_HIGHLIGHTS_LIMITS.itemMax}
            onChange={(e) =>
              onChange(safe.map((v, j) => (j === i ? e.target.value : v)))
            }
          />
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange([...safe, ""])}
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Item
        </button>
        <LimitHint
          count={safe.length}
          max={RESEARCH_HIGHLIGHTS_LIMITS.itemsMax}
        />
      </div>
    </div>
  );
}

/* ─── Generic Admissions (Engineering + Arts & Science) ─── */

export type GenericAdmissionsCriterion = { title: string; items: string[] };
export type GenericAdmissionsVal = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  criteria?: GenericAdmissionsCriterion[];
  phone?: string;
  email?: string;
  address?: string;
};

export function AdmissionsForm({
  value,
  onChange,
  showContact = true,
}: {
  value: GenericAdmissionsVal;
  onChange: (v: GenericAdmissionsVal) => void;
  showContact?: boolean;
}) {
  const criteria = Array.isArray(value.criteria) ? value.criteria : [];
  const criteriaAtMax = criteria.length >= ADMISSIONS_LIMITS.criteriaMax;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Eyebrow"
          value={value.eyebrow ?? ""}
          maxLength={ADMISSIONS_LIMITS.eyebrowMax}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
          hint='Small label above the title (e.g. "Admissions")'
        />
        <TextInput
          label="Title"
          value={value.title ?? ""}
          maxLength={ADMISSIONS_LIMITS.titleMax}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <TextArea
        label="Description"
        rows={2}
        value={value.description ?? ""}
        maxLength={ADMISSIONS_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="CTA Label"
          value={value.ctaLabel ?? ""}
          maxLength={ADMISSIONS_LIMITS.ctaLabelMax}
          onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })}
          placeholder="Apply Now"
        />
        <TextInput
          label="CTA Href"
          value={value.ctaHref ?? ""}
          maxLength={500}
          onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
          placeholder="https://admissions.jct.ac.in"
        />
      </div>

      <Field
        label="Admission Criteria Blocks"
        hint={`Renders as ${ADMISSIONS_LIMITS.criteriaMax} columns on the page. Up to ${ADMISSIONS_LIMITS.itemsPerBlockMax} items per block.`}
      >
        <div className="space-y-3">
          {criteria.map((block, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <TextInput
                label="Block Title"
                value={block.title}
                maxLength={ADMISSIONS_LIMITS.blockTitleMax}
                onChange={(e) =>
                  onChange({
                    ...value,
                    criteria: criteria.map((b, j) =>
                      j === i ? { ...b, title: e.target.value } : b,
                    ),
                  })
                }
              />
              <Field label="Items">
                <div className="space-y-2">
                  {block.items.map((item, k) => (
                    <div key={k} className="flex gap-2">
                      <input
                        className="admin-input"
                        value={item}
                        maxLength={ADMISSIONS_LIMITS.itemMax}
                        onChange={(e) =>
                          onChange({
                            ...value,
                            criteria: criteria.map((b, j) =>
                              j === i
                                ? {
                                    ...b,
                                    items: b.items.map((it, m) =>
                                      m === k ? e.target.value : it,
                                    ),
                                  }
                                : b,
                            ),
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...value,
                            criteria: criteria.map((b, j) =>
                              j === i
                                ? { ...b, items: b.items.filter((_, m) => m !== k) }
                                : b,
                            ),
                          })
                        }
                        className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...value,
                        criteria: criteria.map((b, j) =>
                          j === i ? { ...b, items: [...b.items, ""] } : b,
                        ),
                      })
                    }
                    disabled={block.items.length >= ADMISSIONS_LIMITS.itemsPerBlockMax}
                    className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
              </Field>
              <button
                type="button"
                onClick={() =>
                  onChange({ ...value, criteria: criteria.filter((_, j) => j !== i) })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove Block
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({ ...value, criteria: [...criteria, { title: "", items: [] }] })
              }
              disabled={criteriaAtMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Criterion Block
            </button>
            <LimitHint count={criteria.length} max={ADMISSIONS_LIMITS.criteriaMax} />
          </div>
        </div>
      </Field>

      {showContact && (
        <Field label="Contact Strip" hint="Phone, email, and address displayed below the criteria.">
          <div className="space-y-3">
            <TextInput
              label="Phone"
              value={value.phone ?? ""}
              maxLength={ADMISSIONS_LIMITS.phoneMax}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
              placeholder="+91 93614 88801"
            />
            <TextInput
              label="Email"
              value={value.email ?? ""}
              maxLength={ADMISSIONS_LIMITS.emailMax}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              placeholder="admissions@jct.ac.in"
            />
            <TextInput
              label="Address"
              value={value.address ?? ""}
              maxLength={ADMISSIONS_LIMITS.addressMax}
              onChange={(e) => onChange({ ...value, address: e.target.value })}
              placeholder="Knowledge Park, Pichanur, Coimbatore - 641105"
            />
          </div>
        </Field>
      )}
    </div>
  );
}

/* ─── Why Choose JCT ─── */

export type WhyChooseJctFeature = { icon: string; title: string; description: string };
export type WhyChooseJctVal = {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  features?: WhyChooseJctFeature[];
};

export function WhyChooseJctForm({
  value,
  onChange,
}: {
  value: WhyChooseJctVal;
  onChange: (v: WhyChooseJctVal) => void;
}) {
  const features = Array.isArray(value.features) ? value.features : [];
  const atMax = features.length >= WHY_CHOOSE_JCT_LIMITS.featuresMax;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Eyebrow"
          value={value.eyebrow ?? ""}
          maxLength={WHY_CHOOSE_JCT_LIMITS.eyebrowMax}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
        <TextInput
          label="Title Highlight"
          value={value.titleHighlight ?? ""}
          maxLength={WHY_CHOOSE_JCT_LIMITS.titleHighlightMax}
          onChange={(e) => onChange({ ...value, titleHighlight: e.target.value })}
          hint="Rendered in accent color within the title"
        />
      </div>
      <TextInput
        label="Title"
        value={value.title ?? ""}
        maxLength={WHY_CHOOSE_JCT_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <TextArea
        label="Description"
        rows={2}
        value={value.description ?? ""}
        maxLength={WHY_CHOOSE_JCT_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <Field
        label="Feature Cards"
        hint={`Up to ${WHY_CHOOSE_JCT_LIMITS.featuresMax} cards. Icon is a Lucide icon name (e.g. BookOpen, Award).`}
      >
        <div className="space-y-3">
          {features.map((feat, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Icon"
                  value={feat.icon}
                  maxLength={WHY_CHOOSE_JCT_LIMITS.featureIconMax}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      features: features.map((f, j) =>
                        j === i ? { ...f, icon: e.target.value } : f,
                      ),
                    })
                  }
                  placeholder="BookOpen"
                />
                <TextInput
                  label="Title"
                  value={feat.title}
                  maxLength={WHY_CHOOSE_JCT_LIMITS.featureTitleMax}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      features: features.map((f, j) =>
                        j === i ? { ...f, title: e.target.value } : f,
                      ),
                    })
                  }
                />
              </div>
              <TextArea
                label="Description"
                rows={2}
                value={feat.description}
                maxLength={WHY_CHOOSE_JCT_LIMITS.featureDescMax}
                onChange={(e) =>
                  onChange({
                    ...value,
                    features: features.map((f, j) =>
                      j === i ? { ...f, description: e.target.value } : f,
                    ),
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  onChange({ ...value, features: features.filter((_, j) => j !== i) })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  features: [...features, { icon: "", title: "", description: "" }],
                })
              }
              disabled={atMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Feature
            </button>
            <LimitHint count={features.length} max={WHY_CHOOSE_JCT_LIMITS.featuresMax} />
          </div>
        </div>
      </Field>
    </div>
  );
}

/* ─── Home Admissions CTA ─── */

export type HomeAdmissionsPathway = {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};
export type HomeAdmissionsVal = {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  pathways?: HomeAdmissionsPathway[];
  applyLabel?: string;
  applyHref?: string;
  prospectusLabel?: string;
  prospectusUrl?: string;
};

export function HomeAdmissionsForm({
  value,
  onChange,
}: {
  value: HomeAdmissionsVal;
  onChange: (v: HomeAdmissionsVal) => void;
}) {
  const pathways = Array.isArray(value.pathways) ? value.pathways : [];
  const atMax = pathways.length >= HOME_ADMISSIONS_LIMITS.pathwaysMax;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Eyebrow"
          value={value.eyebrow ?? ""}
          maxLength={HOME_ADMISSIONS_LIMITS.eyebrowMax}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
        <TextInput
          label="Title Highlight"
          value={value.titleHighlight ?? ""}
          maxLength={HOME_ADMISSIONS_LIMITS.titleHighlightMax}
          onChange={(e) => onChange({ ...value, titleHighlight: e.target.value })}
          hint="Rendered in accent color"
        />
      </div>
      <TextInput
        label="Title"
        value={value.title ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <TextArea
        label="Description"
        rows={2}
        value={value.description ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Apply Button Label"
          value={value.applyLabel ?? ""}
          maxLength={HOME_ADMISSIONS_LIMITS.applyLabelMax}
          onChange={(e) => onChange({ ...value, applyLabel: e.target.value })}
          placeholder="Apply Now"
        />
        <TextInput
          label="Apply Button Href"
          value={value.applyHref ?? ""}
          maxLength={500}
          onChange={(e) => onChange({ ...value, applyHref: e.target.value })}
          placeholder="https://admissions.jct.ac.in"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Prospectus Button Label"
          value={value.prospectusLabel ?? ""}
          maxLength={HOME_ADMISSIONS_LIMITS.prospectusLabelMax}
          onChange={(e) => onChange({ ...value, prospectusLabel: e.target.value })}
          placeholder="Download Prospectus"
        />
        <TextInput
          label="Prospectus URL"
          value={value.prospectusUrl ?? ""}
          maxLength={500}
          onChange={(e) => onChange({ ...value, prospectusUrl: e.target.value })}
          placeholder="https://... or storage key"
        />
      </div>

      <Field
        label="Pathway Cards"
        hint={`Up to ${HOME_ADMISSIONS_LIMITS.pathwaysMax} cards. Icon is a Lucide icon name.`}
      >
        <div className="space-y-3">
          {pathways.map((p, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Icon"
                  value={p.icon}
                  maxLength={HOME_ADMISSIONS_LIMITS.pathwayIconMax}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      pathways: pathways.map((pw, j) =>
                        j === i ? { ...pw, icon: e.target.value } : pw,
                      ),
                    })
                  }
                  placeholder="GraduationCap"
                />
                <TextInput
                  label="Title"
                  value={p.title}
                  maxLength={HOME_ADMISSIONS_LIMITS.pathwayTitleMax}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      pathways: pathways.map((pw, j) =>
                        j === i ? { ...pw, title: e.target.value } : pw,
                      ),
                    })
                  }
                />
              </div>
              <TextArea
                label="Description"
                rows={2}
                value={p.description}
                maxLength={HOME_ADMISSIONS_LIMITS.pathwayDescMax}
                onChange={(e) =>
                  onChange({
                    ...value,
                    pathways: pathways.map((pw, j) =>
                      j === i ? { ...pw, description: e.target.value } : pw,
                    ),
                  })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="CTA Label"
                  value={p.ctaLabel}
                  maxLength={HOME_ADMISSIONS_LIMITS.pathwayCtaLabelMax}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      pathways: pathways.map((pw, j) =>
                        j === i ? { ...pw, ctaLabel: e.target.value } : pw,
                      ),
                    })
                  }
                />
                <TextInput
                  label="CTA Href"
                  value={p.ctaHref}
                  maxLength={500}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      pathways: pathways.map((pw, j) =>
                        j === i ? { ...pw, ctaHref: e.target.value } : pw,
                      ),
                    })
                  }
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange({ ...value, pathways: pathways.filter((_, j) => j !== i) })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  pathways: [
                    ...pathways,
                    { icon: "", title: "", description: "", ctaLabel: "", ctaHref: "" },
                  ],
                })
              }
              disabled={atMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Pathway
            </button>
            <LimitHint count={pathways.length} max={HOME_ADMISSIONS_LIMITS.pathwaysMax} />
          </div>
        </div>
      </Field>
    </div>
  );
}

/* ─── Global CMS — Header ─── */

export type HeaderVal = {
  phone?: string;
  studentLoginLabel?: string;
  studentLoginUrl?: string;
  showStudentLogin?: boolean;
};

export function HeaderForm({
  value,
  onChange,
}: {
  value: HeaderVal;
  onChange: (v: HeaderVal) => void;
}) {
  return (
    <div className="space-y-4">
      <TextInput
        label="Phone Number"
        value={value.phone ?? ""}
        maxLength={HEADER_LIMITS.phoneMax}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
        placeholder="+91 93614 88801"
        hint="Shown in the public site header."
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.showStudentLogin !== false}
          onChange={(e) =>
            onChange({ ...value, showStudentLogin: e.target.checked })
          }
        />
        Show Student Login button
      </label>
      {value.showStudentLogin !== false && (
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Student Login Label"
            value={value.studentLoginLabel ?? ""}
            maxLength={HEADER_LIMITS.ctaLabelMax}
            onChange={(e) =>
              onChange({ ...value, studentLoginLabel: e.target.value })
            }
            placeholder="Student Login"
          />
          <TextInput
            label="Student Login URL"
            value={value.studentLoginUrl ?? ""}
            maxLength={500}
            onChange={(e) =>
              onChange({ ...value, studentLoginUrl: e.target.value })
            }
            placeholder="https://..."
          />
        </div>
      )}
    </div>
  );
}

/* ─── Global CMS — Footer ─── */

export type FooterVal = {
  helplineLabel?: string;
  phone?: string;
  admissionsEmail?: string;
  email?: string;
  addressLines?: string[];
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
};

export function FooterForm({
  value,
  onChange,
}: {
  value: FooterVal;
  onChange: (v: FooterVal) => void;
}) {
  const addressLines = Array.isArray(value.addressLines)
    ? value.addressLines
    : [];
  const addressAtMax = addressLines.length >= FOOTER_LIMITS.addressLinesMax;

  return (
    <div className="space-y-5">
      <Field
        label="Admissions Helpline Box"
        hint="The highlighted contact card shown in the footer."
      >
        <div className="space-y-3">
          <TextInput
            label="Helpline Label"
            value={value.helplineLabel ?? ""}
            maxLength={FOOTER_LIMITS.labelMax}
            onChange={(e) =>
              onChange({ ...value, helplineLabel: e.target.value })
            }
            placeholder="Admissions Helpline"
          />
          <TextInput
            label="Phone"
            value={value.phone ?? ""}
            maxLength={FOOTER_LIMITS.phoneMax}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="+91 93614 88801"
          />
          <TextInput
            label="Admissions Email"
            value={value.admissionsEmail ?? ""}
            maxLength={FOOTER_LIMITS.emailMax}
            onChange={(e) =>
              onChange({ ...value, admissionsEmail: e.target.value })
            }
            placeholder="admissions@jct.ac.in"
          />
        </div>
      </Field>

      <Field
        label="Contact Us Column"
        hint="Email and address shown in the footer's Contact Us column. The helpline phone above is reused here."
      >
        <div className="space-y-3">
          <TextInput
            label="General Email"
            value={value.email ?? ""}
            maxLength={FOOTER_LIMITS.emailMax}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="info@jct.ac.in"
          />
          <Field
            label="Address Lines"
            hint={`Up to ${FOOTER_LIMITS.addressLinesMax} lines.`}
          >
            <div className="space-y-2">
              {addressLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="admin-input"
                    value={line}
                    maxLength={FOOTER_LIMITS.addressLineMax}
                    onChange={(e) =>
                      onChange({
                        ...value,
                        addressLines: addressLines.map((l, j) =>
                          j === i ? e.target.value : l,
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...value,
                        addressLines: addressLines.filter((_, j) => j !== i),
                      })
                    }
                    className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    addressLines: [...addressLines, ""],
                  })
                }
                disabled={addressAtMax}
                className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={14} /> Add Line
              </button>
            </div>
          </Field>
        </div>
      </Field>

      <Field label="Social Links">
        <div className="space-y-2">
          {(
            [
              { key: "facebook", label: "Facebook" },
              { key: "instagram", label: "Instagram" },
              { key: "twitter", label: "X / Twitter" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "youtube", label: "YouTube" },
            ] as { key: keyof FooterVal; label: string }[]
          ).map(({ key, label }) => (
            <TextInput
              key={key}
              label={label}
              value={(value[key] as string) ?? ""}
              maxLength={500}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
              placeholder="https://..."
            />
          ))}
        </div>
      </Field>
    </div>
  );
}

/* ─── Accreditations (home landing page) ─── */

export function AccreditationsForm({
  value,
  onChange,
}: {
  value: AccreditationItem[];
  onChange: (v: AccreditationItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">
        Accreditation logos and titles shown in the hero of the main landing
        page.
      </p>
      <AccreditationList
        value={Array.isArray(value) ? value : []}
        max={ACCREDITATIONS_LIMITS.itemsMax}
        onChange={onChange}
      />
    </div>
  );
}

/* ─── Home Statistics (hero stat row) ─── */

export type HomeStatisticItem = { icon: string; label: string };

export function StatisticsForm({
  value,
  onChange,
}: {
  value: HomeStatisticItem[];
  onChange: (v: HomeStatisticItem[]) => void;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = safe.length >= HOME_STATISTICS_LIMITS.itemsMax;
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">
        The row of badges shown directly beneath the home hero. Icon is one of:
        laurel, users, cap, badge, growth.
      </p>
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Icon"
              value={item.icon}
              maxLength={HOME_STATISTICS_LIMITS.iconMax}
              placeholder="laurel"
              onChange={(e) =>
                onChange(
                  safe.map((s, j) =>
                    j === i ? { ...s, icon: e.target.value } : s,
                  ),
                )
              }
            />
            <TextInput
              label="Label"
              value={item.label}
              maxLength={HOME_STATISTICS_LIMITS.labelMax}
              placeholder="NAAC Accredited"
              onChange={(e) =>
                onChange(
                  safe.map((s, j) =>
                    j === i ? { ...s, label: e.target.value } : s,
                  ),
                )
              }
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange([...safe, { icon: "laurel", label: "" }])}
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Statistic
        </button>
        <LimitHint count={safe.length} max={HOME_STATISTICS_LIMITS.itemsMax} />
      </div>
    </div>
  );
}

/* ─── Recruiters / Placement Highlights section ─── */

export type RecruitersSectionStat = {
  icon: string;
  value: string;
  label: string;
};
export type RecruitersSectionVal = {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  stats?: RecruitersSectionStat[];
};

export function RecruitersSectionForm({
  value,
  onChange,
}: {
  value: RecruitersSectionVal;
  onChange: (v: RecruitersSectionVal) => void;
}) {
  const stats = Array.isArray(value.stats) ? value.stats : [];
  const atMax = stats.length >= RECRUITERS_SECTION_LIMITS.statsMax;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Eyebrow"
          value={value.eyebrow ?? ""}
          maxLength={RECRUITERS_SECTION_LIMITS.eyebrowMax}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
          placeholder="Placement Highlights"
        />
        <TextInput
          label="Title Highlight"
          value={value.titleHighlight ?? ""}
          maxLength={RECRUITERS_SECTION_LIMITS.titleHighlightMax}
          onChange={(e) =>
            onChange({ ...value, titleHighlight: e.target.value })
          }
          hint="Rendered in italic accent within the title"
        />
      </div>
      <TextInput
        label="Title"
        value={value.title ?? ""}
        maxLength={RECRUITERS_SECTION_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        placeholder="Our Recruiters"
      />
      <TextArea
        label="Description"
        rows={2}
        value={value.description ?? ""}
        maxLength={RECRUITERS_SECTION_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <Field
        label="Stat Cards"
        hint={`Up to ${RECRUITERS_SECTION_LIMITS.statsMax} cards. Icon is one of: trend, award, building, users.`}
      >
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="grid grid-cols-3 gap-3">
                <TextInput
                  label="Icon"
                  value={stat.icon}
                  maxLength={RECRUITERS_SECTION_LIMITS.statIconMax}
                  placeholder="trend"
                  onChange={(e) =>
                    onChange({
                      ...value,
                      stats: stats.map((s, j) =>
                        j === i ? { ...s, icon: e.target.value } : s,
                      ),
                    })
                  }
                />
                <TextInput
                  label="Value"
                  value={stat.value}
                  maxLength={RECRUITERS_SECTION_LIMITS.statValueMax}
                  placeholder="98%"
                  onChange={(e) =>
                    onChange({
                      ...value,
                      stats: stats.map((s, j) =>
                        j === i ? { ...s, value: e.target.value } : s,
                      ),
                    })
                  }
                />
                <TextInput
                  label="Label"
                  value={stat.label}
                  maxLength={RECRUITERS_SECTION_LIMITS.statLabelMax}
                  placeholder="Placement Rate"
                  onChange={(e) =>
                    onChange({
                      ...value,
                      stats: stats.map((s, j) =>
                        j === i ? { ...s, label: e.target.value } : s,
                      ),
                    })
                  }
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    stats: stats.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  stats: [...stats, { icon: "", value: "", label: "" }],
                })
              }
              disabled={atMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Stat
            </button>
            <LimitHint
              count={stats.length}
              max={RECRUITERS_SECTION_LIMITS.statsMax}
            />
          </div>
        </div>
      </Field>
    </div>
  );
}
