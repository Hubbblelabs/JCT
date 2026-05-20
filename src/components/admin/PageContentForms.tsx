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

/* ─── Hero forms ─── */

export type EngHeroVal = {
  backgroundImages?: string[];
};

export function EngineeringHeroForm({
  value,
  onChange,
}: {
  value: EngHeroVal;
  onChange: (v: EngHeroVal) => void;
}) {
  const bg = value.backgroundImages ?? [];
  return (
    <div className="space-y-4">
      <Field
        label="Background Images"
        hint="3 fixed image slots. Upload or replace each one."
      >
        <div className="space-y-2">
          {Array.from({ length: ENG_HERO_LIMITS.backgroundImages }, (_, i) => (
            <ImageUploadInput
              key={i}
              label={`Image ${i + 1}`}
              value={bg[i] ?? ""}
              onChange={(url) => {
                const next = Array.from(
                  { length: ENG_HERO_LIMITS.backgroundImages },
                  (__, j) => bg[j] ?? "",
                );
                next[i] = url;
                onChange({ ...value, backgroundImages: next });
              }}
              uploadOnly
            />
          ))}
        </div>
      </Field>
    </div>
  );
}

export type ArtsHeroVal = {
  backgroundImages?: string[];
  titleLine1?: string;
  titleHighlight?: string;
  titleLine2?: string;
  subtitle?: string;
  ctas?: Cta[];
};

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
