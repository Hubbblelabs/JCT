"use client";

import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown as ChevronDownIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  Accordion,
  Field,
  FormGrid,
  ImageUploadInput,
  DocumentUploadInput,
  Select,
  TextArea,
  TextInput,
  type FieldSpan,
} from "@/components/admin/inputs";
import { SeoFields } from "@/components/admin/SeoFields";
import { useDeferredUploadsOptional } from "@/lib/deferred-uploads";
import {
  LIMITS_pamphlet,
  ENG_HERO_LIMITS,
  ARTS_HERO_LIMITS,
  POLY_HERO_LIMITS,
  LIMITS_lifeAtJct,
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
  FLOATING_ELEMENTS_LIMITS,
  NAVBAR_LIMITS,
  SEO_LIMITS,
  LIMITS_upcomingEvents,
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
  span = "full",
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  hint?: string;
  span?: FieldSpan;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = max !== undefined && safe.length >= max;
  return (
    <Field label={label} hint={hint} span={span}>
      {/* Carousel slides read as a strip, not a queue — six of them stacked one
          per row buried every field below the fold. */}
      <div className="admin-form-grid admin-form-grid--tight">
        {safe.map((src, i) => (
          <div key={i} className="admin-col-4 flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <ImageUploadInput
                label=""
                value={src}
                onChange={(url) =>
                  onChange(safe.map((s, j) => (j === i ? url : s)))
                }
                hideUrlField
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onChange(safe.filter((_, j) => j !== i));
              }}
              className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
              aria-label={`Remove image ${i + 1}`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <div className="admin-col-full flex items-center justify-between">
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
  span = "full",
}: {
  value: Cta[];
  onChange: (next: Cta[]) => void;
  max?: number;
  span?: FieldSpan;
}) {
  const safe = Array.isArray(value) ? value : [];
  const atMax = max !== undefined && safe.length >= max;
  return (
    <Field label="Call-to-Action Buttons" span={span}>
      <div className="admin-form-grid admin-form-grid--tight">
        {safe.map((cta, i) => (
          <div
            key={i}
            className="admin-col-6 rounded-lg border border-gray-200 p-3"
          >
            <FormGrid tight>
              <TextInput
                label="Label"
                span={5}
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
                span={7}
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
            </FormGrid>
            <div className="mt-2 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
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
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        ))}
        <div className="admin-col-full flex items-center justify-between">
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
  span,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  min: number;
  max: number;
  span?: FieldSpan;
}) {
  const [draft, setDraft] = useState(() => String(value ?? 6000));

  useEffect(() => {
    setDraft(String(value ?? 6000));
  }, [value]);

  return (
    <TextInput
      label="Carousel Speed (ms)"
      span={span}
      type="number"
      min={min}
      max={max}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const num = Number(draft);
        if (draft !== "" && !isNaN(num) && num >= min && num <= max) {
          onChange(num);
        } else {
          setDraft(String(value ?? 6000));
        }
      }}
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
    <div className="admin-form-grid admin-form-grid--tight">
      {safe.map((item, i) => (
        <div
          key={i}
          className="admin-col-6 rounded-lg border border-gray-200 p-3"
        >
          <FormGrid tight>
            <TextInput
              label="Name"
              span={5}
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
              span={7}
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
            <ImageUploadInput
              label="Logo"
              span="full"
              ratio="square"
              value={item.logo}
              onChange={(url) =>
                onChange(
                  safe.map((a, j) => (j === i ? { ...a, logo: url } : a)),
                )
              }
              hideUrlField
            />
          </FormGrid>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="admin-col-full flex items-center justify-between">
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
  // Field order follows the public hero top to bottom: headline, subtitle,
  // buttons, the badge/counselling strip, then the accreditation row. The
  // background carousel is the backdrop, so it sits last with its own speed.
  return (
    <FormGrid>
      <TextInput
        label="Hero Title"
        span={5}
        value={value.title ?? ""}
        maxLength={ENG_HERO_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        hint="Main headline displayed on the hero section"
      />
      <TextArea
        label="Subtitle"
        span={7}
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
      <TextInput
        label="Badge Text"
        span={4}
        value={value.badgeText ?? ""}
        maxLength={ENG_HERO_LIMITS.badgeTextMax}
        onChange={(e) => onChange({ ...value, badgeText: e.target.value })}
        hint='e.g. "An Autonomous Institution"'
      />
      <TextInput
        label="Counselling Label"
        span={4}
        value={value.counsellingLabel ?? ""}
        maxLength={ENG_HERO_LIMITS.counsellingLabelMax}
        onChange={(e) =>
          onChange({ ...value, counsellingLabel: e.target.value })
        }
        hint='e.g. "Counselling Code:"'
      />
      <TextInput
        label="Counselling Code"
        span={4}
        value={value.counsellingCode ?? ""}
        maxLength={ENG_HERO_LIMITS.counsellingCodeMax}
        onChange={(e) =>
          onChange({ ...value, counsellingCode: e.target.value })
        }
        hint="e.g. 2724"
      />
      <TextInput
        label="Accreditation Caption"
        span="full"
        value={value.accreditationsCaption ?? ""}
        maxLength={ENG_HERO_LIMITS.accreditationCaptionMax}
        onChange={(e) =>
          onChange({ ...value, accreditationsCaption: e.target.value })
        }
        hint='Text shown next to the logos, e.g. "Top accreditations & approvals"'
      />
      <Field
        label="Accreditation Logos"
        span="full"
        hint={`Logos shown in the hero accreditation strip (up to ${ENG_HERO_LIMITS.accreditationsMax}).`}
      >
        <AccreditationList
          value={value.accreditations ?? []}
          max={ENG_HERO_LIMITS.accreditationsMax}
          onChange={(next) => onChange({ ...value, accreditations: next })}
        />
      </Field>
      <ImageList
        label="Background Carousel Images"
        max={ENG_HERO_LIMITS.backgroundImages}
        hint="Images rotate behind the hero (up to 6). Upload, replace, or remove each one."
        value={value.backgroundImages ?? []}
        onChange={(next) => onChange({ ...value, backgroundImages: next })}
      />
      <IntervalInput
        span={4}
        value={value.intervalMs}
        min={ENG_HERO_LIMITS.minIntervalMs}
        max={ENG_HERO_LIMITS.maxIntervalMs}
        onChange={(intervalMs) => onChange({ ...value, intervalMs })}
      />
    </FormGrid>
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
    <div className="admin-form-grid admin-form-grid--tight">
      {safe.map((item, i) => (
        <div
          key={i}
          className="admin-col-4 rounded-lg border border-gray-200 p-3"
        >
          <FormGrid tight>
            <TextInput
              label="Icon"
              span={4}
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
              span={8}
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
            <TextArea
              label="Description"
              span="full"
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
          </FormGrid>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="admin-col-full flex items-center justify-between">
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
  // Ordered as the public hero renders: three-part headline, subtitle, CTAs,
  // stat row, then the feature blocks below it. Backdrop settings come last.
  return (
    <FormGrid>
      <TextInput
        label="Title Line 1"
        span={4}
        value={value.titleLine1 ?? ""}
        maxLength={ARTS_HERO_LIMITS.partMax}
        onChange={(e) => onChange({ ...value, titleLine1: e.target.value })}
        hint="e.g. Good Education"
      />
      <TextInput
        label="Accent Word"
        span={4}
        value={value.titleHighlight ?? ""}
        maxLength={ARTS_HERO_LIMITS.partMax}
        onChange={(e) => onChange({ ...value, titleHighlight: e.target.value })}
        hint='Rendered in orange (e.g. "for")'
      />
      <TextInput
        label="Title Line 2 Rest"
        span={4}
        value={value.titleLine2 ?? ""}
        maxLength={ARTS_HERO_LIMITS.partMax}
        onChange={(e) => onChange({ ...value, titleLine2: e.target.value })}
        hint="e.g. A Better Future"
      />
      <TextArea
        label="Subtitle"
        span="full"
        value={value.subtitle ?? ""}
        rows={2}
        maxLength={ARTS_HERO_LIMITS.subtitleMax}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
      />
      <CtaList
        value={value.ctas ?? []}
        max={ARTS_HERO_LIMITS.ctas}
        onChange={(next) => onChange({ ...value, ctas: next })}
      />
      <Field
        label="Hero Stat Cards"
        span={5}
        hint="The numbers shown in the hero stat row."
      >
        <HeroStatsForm
          value={value.stats ?? []}
          onChange={(next) => onChange({ ...value, stats: next })}
        />
      </Field>
      <Field
        label="Hero Subsections"
        span={7}
        hint={`Feature blocks below the hero — Quality, Leadership, Experience (up to ${ARTS_HERO_LIMITS.subsectionsMax}). Icon is a Lucide icon name.`}
      >
        <ArtsSubsectionList
          value={value.subsections ?? []}
          max={ARTS_HERO_LIMITS.subsectionsMax}
          onChange={(next) => onChange({ ...value, subsections: next })}
        />
      </Field>
      <ImageList
        label="Background Carousel Images"
        max={ARTS_HERO_LIMITS.backgroundImages}
        hint="Images rotate behind the hero. Upload, replace, or remove each one."
        value={value.backgroundImages ?? []}
        onChange={(next) => onChange({ ...value, backgroundImages: next })}
      />
      <IntervalInput
        span={4}
        value={value.intervalMs}
        min={ARTS_HERO_LIMITS.minIntervalMs}
        max={ARTS_HERO_LIMITS.maxIntervalMs}
        onChange={(intervalMs) => onChange({ ...value, intervalMs })}
      />
    </FormGrid>
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
    <div className="admin-form-grid admin-form-grid--tight">
      {safe.map((item, i) => (
        <div
          key={i}
          className="admin-col-6 rounded-lg border border-gray-200 p-3"
        >
          <FormGrid tight>
            <TextInput
              label="Value"
              span={5}
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
              span={7}
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
          </FormGrid>
          <div className="mt-2 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
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
              Accent color
            </label>
            <button
              type="button"
              onClick={() => onChange(safe.filter((_, j) => j !== i))}
              className="admin-btn admin-btn-danger admin-btn-sm"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      ))}
      <div className="admin-col-full flex items-center justify-between">
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
  // Eyebrow → two title lines → subtitle → CTAs, matching the public hero.
  return (
    <FormGrid>
      <TextInput
        label="Eyebrow"
        span={4}
        value={value.eyebrow ?? ""}
        maxLength={POLY_HERO_LIMITS.eyebrowMax}
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        hint="Small label above the title"
      />
      <TextInput
        label="Title Line 1"
        span={4}
        value={value.titleLine1 ?? ""}
        maxLength={POLY_HERO_LIMITS.titleLineMax}
        onChange={(e) => onChange({ ...value, titleLine1: e.target.value })}
      />
      <TextInput
        label="Title Line 2 (italic)"
        span={4}
        value={value.titleLine2 ?? ""}
        maxLength={POLY_HERO_LIMITS.titleLineMax}
        onChange={(e) => onChange({ ...value, titleLine2: e.target.value })}
      />
      <TextArea
        label="Subtitle"
        span="full"
        value={value.subtitle ?? ""}
        rows={2}
        maxLength={POLY_HERO_LIMITS.subtitleMax}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
      />
      <CtaList
        value={value.ctas ?? []}
        max={POLY_HERO_LIMITS.ctas}
        onChange={(next) => onChange({ ...value, ctas: next })}
      />
      <ImageList
        label="Background Carousel Images"
        max={POLY_HERO_LIMITS.backgroundImagesMax}
        hint="The carousel rotates through every image. 3 is the design default."
        value={value.backgroundImages ?? []}
        onChange={(next) => onChange({ ...value, backgroundImages: next })}
      />
      <IntervalInput
        span={4}
        value={value.intervalMs}
        min={POLY_HERO_LIMITS.minIntervalMs}
        max={POLY_HERO_LIMITS.maxIntervalMs}
        onChange={(intervalMs) => onChange({ ...value, intervalMs })}
      />
    </FormGrid>
  );
}

/* ─── Pamphlet ─── */

type PamphletSlotVal = {
  image?: string;
  heading?: string;
  subheading?: string;
  body?: string;
};

type PamphletVirtualTourVal = {
  enabled?: boolean;
  label?: string;
  url?: string;
};

type PamphletCallNowVal = {
  enabled?: boolean;
  label?: string;
  phone?: string;
};

type PamphletCountdownVal = {
  enabled?: boolean;
  label?: string;
  /** ISO-8601 with an explicit offset, e.g. `2026-07-30T10:30:00+05:30`. */
  startsAt?: string;
  endsAt?: string;
};

type PamphletLayoutVal =
  "image-image" | "image-text" | "text-image" | "text-text";

export type PamphletPopupVal = {
  id: string;
  /** Admin-facing name only — visitors never see it. */
  name?: string;
  layout?: PamphletLayoutVal;
  leftSlot?: PamphletSlotVal;
  rightSlot?: PamphletSlotVal;
  virtualTour?: PamphletVirtualTourVal;
  callNow?: PamphletCallNowVal;
  countdown?: PamphletCountdownVal;
  applyEnabled?: boolean;
  applyLabel?: string;
  applyHref?: string;
};

export type PamphletVal = {
  enabled?: boolean;
  delayMs?: number;
  popups?: PamphletPopupVal[];
  activePopupId?: string;
  // Single-popup fields, kept for values saved before multi-popup support.
  // Editing here migrates them into `popups[0]` and clears them.
  layout?: PamphletLayoutVal;
  leftSlot?: PamphletSlotVal;
  rightSlot?: PamphletSlotVal;
  virtualTour?: PamphletVirtualTourVal;
  callNow?: PamphletCallNowVal;
  countdown?: PamphletCountdownVal;
  applyEnabled?: boolean;
  applyLabel?: string;
  applyHref?: string;
  // Legacy — preserved when present so we don't drop data on save.
  images?: string[];
  videoUrl?: string;
};

const LAYOUT_OPTIONS: { value: PamphletLayoutVal; label: string }[] = [
  { value: "image-image", label: "Image (left) + Image (right)" },
  { value: "image-text", label: "Image (left) + Text (right)" },
  { value: "text-image", label: "Text (left) + Image (right)" },
  { value: "text-text", label: "Text (left) + Text (right)" },
];

function slotKind(
  layout: PamphletLayoutVal,
  side: "left" | "right",
): "image" | "text" {
  if (layout === "image-image") return "image";
  if (layout === "text-text") return "text";
  if (layout === "image-text") return side === "left" ? "image" : "text";
  return side === "left" ? "text" : "image";
}

function PamphletSlotEditor({
  side,
  kind,
  value,
  onChange,
}: {
  side: "Left" | "Right";
  kind: "image" | "text";
  value: PamphletSlotVal;
  onChange: (next: PamphletSlotVal) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <p className="admin-label mb-2">
        {side} Slot — {kind === "image" ? "Image" : "Text"}
      </p>
      {kind === "image" ? (
        <ImageUploadInput
          label=""
          value={value.image ?? ""}
          onChange={(url) => onChange({ ...value, image: url })}
          hideUrlField
        />
      ) : (
        <FormGrid tight>
          <TextInput
            label="Heading"
            value={value.heading ?? ""}
            maxLength={LIMITS_pamphlet.headingMax}
            placeholder="e.g. Admissions Open 2026"
            onChange={(e) => onChange({ ...value, heading: e.target.value })}
          />
          <TextInput
            label="Subheading"
            value={value.subheading ?? ""}
            maxLength={LIMITS_pamphlet.subheadingMax}
            placeholder="Short tagline"
            onChange={(e) => onChange({ ...value, subheading: e.target.value })}
          />
          <TextArea
            label="Description"
            span="full"
            rows={4}
            value={value.body ?? ""}
            maxLength={LIMITS_pamphlet.bodyMax}
            placeholder="Detail text shown inside the popup"
            onChange={(e) => onChange({ ...value, body: e.target.value })}
          />
        </FormGrid>
      )}
    </div>
  );
}

/** Id given to the popup a pre-multi-popup value is migrated into. */
const LEGACY_POPUP_ID = "popup-1";

function newPopupId(): string {
  return `popup-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

/**
 * The popups to edit. A value saved before multi-popup support has none, so
 * its single popup — including the even older `images[]` / `videoUrl` fields —
 * is surfaced as popup #1 rather than being lost.
 */
function derivePopups(value: PamphletVal): PamphletPopupVal[] {
  if (Array.isArray(value.popups) && value.popups.length > 0) {
    return value.popups;
  }
  const legacyImages = Array.isArray(value.images) ? value.images : [];
  const leftSlot = value.leftSlot ?? {};
  const rightSlot = value.rightSlot ?? {};
  const virtualTour = value.virtualTour ?? {};
  return [
    {
      id: LEGACY_POPUP_ID,
      name: "Popup 1",
      layout: value.layout ?? "image-image",
      leftSlot: { ...leftSlot, image: leftSlot.image || legacyImages[0] || "" },
      rightSlot: {
        ...rightSlot,
        image: rightSlot.image || legacyImages[1] || "",
      },
      virtualTour: {
        ...virtualTour,
        url: virtualTour.url || value.videoUrl || "",
      },
      callNow: value.callNow ?? {},
      countdown: value.countdown ?? {},
      applyEnabled: value.applyEnabled !== false,
      applyLabel: value.applyLabel ?? "Apply Now",
      applyHref: value.applyHref ?? "",
    },
  ];
}

/**
 * Writing the popup list clears the single-popup fields it superseded. Leaving
 * them behind would keep a replaced image referenced from two places, so the
 * old R2 object would never be cleaned up when the popup is re-pointed.
 */
function withPopups(
  value: PamphletVal,
  popups: PamphletPopupVal[],
  activePopupId: string,
): PamphletVal {
  return {
    ...value,
    popups,
    activePopupId,
    layout: undefined,
    leftSlot: undefined,
    rightSlot: undefined,
    virtualTour: undefined,
    callNow: undefined,
    countdown: undefined,
    applyEnabled: undefined,
    applyLabel: undefined,
    applyHref: undefined,
    images: [],
    videoUrl: "",
  };
}

/**
 * The college announces deadlines in IST, so a typed "10:30" must mean 10:30
 * IST no matter what timezone the admin's own machine is set to. Both helpers
 * pin the wall-clock the `datetime-local` input shows to +05:30; what gets
 * stored is the resulting absolute instant.
 */
const IST_OFFSET = "+05:30";
const IST_OFFSET_MS = 330 * 60_000;

function instantToIstInput(iso: string | undefined): string {
  if (!iso) return "";
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  // Shifting by the offset makes toISOString print the IST wall-clock.
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 16);
}

function istInputToInstant(local: string): string {
  if (!local) return "";
  const withSeconds = local.length === 16 ? `${local}:00` : local;
  const iso = `${withSeconds}${IST_OFFSET}`;
  return Number.isNaN(Date.parse(iso)) ? "" : iso;
}

function PamphletPopupEditor({
  popup,
  onChange,
}: {
  popup: PamphletPopupVal;
  onChange: (next: PamphletPopupVal) => void;
}) {
  const layout: PamphletLayoutVal = popup.layout ?? "image-image";
  const leftSlot = popup.leftSlot ?? {};
  const rightSlot = popup.rightSlot ?? {};
  const virtualTour = popup.virtualTour ?? {};
  const callNow = popup.callNow ?? {};
  const countdown = popup.countdown ?? {};

  // Layout first, then the two slots side by side as they appear in the popup,
  // then the countdown strip and the button row that sit beneath them.
  return (
    <FormGrid>
      <Select
        label="Popup Layout"
        span="full"
        value={layout}
        options={LAYOUT_OPTIONS}
        hint="Choose how the two sides of the popup are filled — images, text, or a mix."
        onChange={(e) =>
          onChange({ ...popup, layout: e.target.value as PamphletLayoutVal })
        }
      />

      <div className="admin-col-6">
        <PamphletSlotEditor
          side="Left"
          kind={slotKind(layout, "left")}
          value={leftSlot}
          onChange={(next) => onChange({ ...popup, leftSlot: next })}
        />
      </div>
      <div className="admin-col-6">
        <PamphletSlotEditor
          side="Right"
          kind={slotKind(layout, "right")}
          value={rightSlot}
          onChange={(next) => onChange({ ...popup, rightSlot: next })}
        />
      </div>

      <Field
        label="Countdown Timer"
        span="full"
        hint="Optional. Shows a live countdown strip just above the popup buttons. Times are entered and stored in IST. The timer stays hidden before the start time and disappears once the deadline passes — the popup itself keeps showing either way."
      >
        <div className="rounded-lg border border-gray-200 p-3">
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={countdown.enabled === true}
              onChange={(e) =>
                onChange({
                  ...popup,
                  countdown: { ...countdown, enabled: e.target.checked },
                })
              }
            />
            Show countdown timer
          </label>
          <FormGrid tight>
            <TextInput
              label="Label"
              span={4}
              value={countdown.label ?? ""}
              maxLength={LIMITS_pamphlet.countdownLabelMax}
              placeholder="Ends in"
              onChange={(e) =>
                onChange({
                  ...popup,
                  countdown: { ...countdown, label: e.target.value },
                })
              }
            />
            <TextInput
              label="Start (IST)"
              span={4}
              type="datetime-local"
              value={instantToIstInput(countdown.startsAt)}
              hint="Optional. Timer is hidden before this."
              onChange={(e) =>
                onChange({
                  ...popup,
                  countdown: {
                    ...countdown,
                    startsAt: istInputToInstant(e.target.value),
                  },
                })
              }
            />
            <TextInput
              label="Deadline (IST)"
              span={4}
              type="datetime-local"
              value={instantToIstInput(countdown.endsAt)}
              hint="Required for the timer to show."
              onChange={(e) =>
                onChange({
                  ...popup,
                  countdown: {
                    ...countdown,
                    endsAt: istInputToInstant(e.target.value),
                  },
                })
              }
            />
          </FormGrid>
        </div>
      </Field>

      {/* The three popup buttons are one row on the public popup, so they are
          one row here too rather than three stacked bordered blocks. */}
      <Field
        label="Apply Now Button"
        span={4}
        hint="The primary button inside the pamphlet popup."
      >
        <div className="rounded-lg border border-gray-200 p-3">
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={popup.applyEnabled !== false}
              onChange={(e) =>
                onChange({ ...popup, applyEnabled: e.target.checked })
              }
            />
            Show Apply Now button
          </label>
          <TextInput
            label="Button Label"
            value={popup.applyLabel ?? ""}
            maxLength={LIMITS_pamphlet.applyLabelMax}
            onChange={(e) => onChange({ ...popup, applyLabel: e.target.value })}
            placeholder="Apply Now"
          />
          <TextInput
            label="Button Link"
            value={popup.applyHref ?? ""}
            maxLength={LIMITS_pamphlet.applyHrefMax}
            onChange={(e) => onChange({ ...popup, applyHref: e.target.value })}
            placeholder="https://admissions.jct.ac.in"
          />
        </div>
      </Field>

      <Field
        label="Virtual Tour Button"
        span={4}
        hint="Optional. A YouTube/embed link opens an in-popup player; any other URL opens in a new tab."
      >
        <div className="rounded-lg border border-gray-200 p-3">
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={virtualTour.enabled === true}
              onChange={(e) =>
                onChange({
                  ...popup,
                  virtualTour: {
                    ...virtualTour,
                    enabled: e.target.checked,
                  },
                })
              }
            />
            Show Virtual Tour button
          </label>
          <TextInput
            label="Button Label"
            value={virtualTour.label ?? ""}
            maxLength={LIMITS_pamphlet.virtualTourLabelMax}
            placeholder="Virtual Tour"
            onChange={(e) =>
              onChange({
                ...popup,
                virtualTour: {
                  ...virtualTour,
                  label: e.target.value,
                },
              })
            }
          />
          <TextInput
            label="URL / Video Link"
            value={virtualTour.url ?? ""}
            onChange={(e) =>
              onChange({
                ...popup,
                virtualTour: {
                  ...virtualTour,
                  url: e.target.value,
                },
              })
            }
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
          />
        </div>
      </Field>

      <Field
        label="Call Now Button"
        span={4}
        hint="Optional. Dials the given phone number on tap."
      >
        <div className="rounded-lg border border-gray-200 p-3">
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={callNow.enabled === true}
              onChange={(e) =>
                onChange({
                  ...popup,
                  callNow: { ...callNow, enabled: e.target.checked },
                })
              }
            />
            Show Call Now button
          </label>
          <TextInput
            label="Button Label"
            value={callNow.label ?? ""}
            maxLength={LIMITS_pamphlet.callNowLabelMax}
            placeholder="Call Now"
            onChange={(e) =>
              onChange({
                ...popup,
                callNow: { ...callNow, label: e.target.value },
              })
            }
          />
          <TextInput
            label="Phone Number"
            value={callNow.phone ?? ""}
            maxLength={LIMITS_pamphlet.callNowPhoneMax}
            placeholder="+91 98765 43210"
            onChange={(e) =>
              onChange({
                ...popup,
                callNow: { ...callNow, phone: e.target.value },
              })
            }
          />
        </div>
      </Field>
    </FormGrid>
  );
}

export function PamphletForm({
  value,
  onChange,
}: {
  value: PamphletVal;
  onChange: (v: PamphletVal) => void;
}) {
  const [rawDelay, setRawDelay] = useState<string>(
    String(value.delayMs ?? 2000),
  );

  useEffect(() => {
    setRawDelay(String(value.delayMs ?? 2000));
  }, [value.delayMs]);

  const popups = derivePopups(value);
  // A stale `activePopupId` — one whose popup was deleted — must not blank the
  // popup out; the public renderer falls back to the first entry, so do the same.
  const activeId =
    value.activePopupId && popups.some((p) => p.id === value.activePopupId)
      ? value.activePopupId
      : (popups[0]?.id ?? "");
  const atMax = popups.length >= LIMITS_pamphlet.popups;

  const commit = (next: PamphletPopupVal[], nextActiveId = activeId) =>
    onChange(
      withPopups(
        value,
        next,
        next.some((p) => p.id === nextActiveId)
          ? nextActiveId
          : (next[0]?.id ?? ""),
      ),
    );

  const addPopup = () => {
    if (atMax) return;
    const id = newPopupId();
    commit([
      ...popups,
      {
        id,
        name: `Popup ${popups.length + 1}`,
        layout: "image-image",
        applyEnabled: true,
        applyLabel: "Apply Now",
        applyHref: "https://admissions.jct.ac.in",
      },
    ]);
  };

  return (
    <FormGrid>
      <Field label="Visibility" span={4}>
        <label className="flex items-center gap-2 pt-2 text-sm">
          <input
            type="checkbox"
            checked={value.enabled !== false}
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          />
          Show popup on page load
        </label>
      </Field>

      <TextInput
        label="Show after (ms)"
        span={4}
        type="number"
        min={LIMITS_pamphlet.minDelayMs}
        max={LIMITS_pamphlet.maxDelayMs}
        value={rawDelay}
        onChange={(e) => setRawDelay(e.target.value)}
        onBlur={() => {
          const parsed = parseInt(rawDelay, 10);
          const valid =
            Number.isFinite(parsed) &&
            parsed >= LIMITS_pamphlet.minDelayMs &&
            parsed <= LIMITS_pamphlet.maxDelayMs;
          const final = valid ? parsed : (value.delayMs ?? 2000);
          setRawDelay(String(final));
          onChange({ ...value, delayMs: final });
        }}
        hint={`Delay in milliseconds before the popup appears (max ${LIMITS_pamphlet.maxDelayMs})`}
      />

      <Field
        label="Popups"
        span="full"
        hint={`Keep up to ${LIMITS_pamphlet.popups} popups ready and switch between them. Only the one marked Active is shown to visitors.`}
      >
        <div className="space-y-3">
          {popups.map((popup, i) => {
            const isActive = popup.id === activeId;
            return (
              <div
                key={popup.id}
                className={`rounded-lg border p-3 ${
                  isActive
                    ? "border-gold bg-gold/5"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                    <input
                      type="radio"
                      name="pamphlet-active-popup"
                      checked={isActive}
                      onChange={() => commit(popups, popup.id)}
                    />
                    {isActive ? "Active" : "Set active"}
                  </label>
                  <div className="min-w-45 flex-1">
                    <TextInput
                      label=""
                      value={popup.name ?? ""}
                      maxLength={LIMITS_pamphlet.popupNameMax}
                      placeholder={`Popup ${i + 1}`}
                      onChange={(e) =>
                        commit(
                          popups.map((p) =>
                            p.id === popup.id
                              ? { ...p, name: e.target.value }
                              : p,
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      commit(popups.filter((p) => p.id !== popup.id))
                    }
                    disabled={popups.length <= 1}
                    title={
                      popups.length <= 1
                        ? "At least one popup is required"
                        : "Delete this popup"
                    }
                    className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="mt-3">
                  <Accordion
                    title={`Edit “${popup.name || `Popup ${i + 1}`}”`}
                    defaultOpen={isActive}
                  >
                    <PamphletPopupEditor
                      popup={popup}
                      onChange={(next) =>
                        commit(
                          popups.map((p) => (p.id === popup.id ? next : p)),
                        )
                      }
                    />
                  </Accordion>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addPopup}
            disabled={atMax}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={12} /> Add popup
          </button>
          {atMax && (
            <p className="text-xs text-gray-400">
              Maximum of {LIMITS_pamphlet.popups} popups reached.
            </p>
          )}
        </div>
      </Field>
    </FormGrid>
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
  // Category tabs sit above the gallery on the public page, and the tour
  // button below it — the editor follows the same top-to-bottom order.
  return (
    <FormGrid>
      <Field
        label="Filter Categories"
        span={5}
        hint={`The first category is the 'All' tab — photos marked 'Show in All' show up there. Max ${LIMITS_lifeAtJct.categories}.`}
      >
        <div className="admin-form-grid admin-form-grid--tight">
          {categories.map((cat, i) => (
            <div key={i} className="admin-col-6 flex gap-2">
              <input
                className="admin-input"
                value={cat}
                maxLength={LIMITS_lifeAtJct.categoryLabelMax}
                aria-label={`Category ${i + 1}`}
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
                aria-label={`Remove category ${i + 1}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="admin-col-full flex items-center justify-between">
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

      <TextInput
        label="Virtual Tour Video URL"
        span={7}
        value={value.videoUrl ?? ""}
        maxLength={500}
        onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
        placeholder="https://www.youtube.com/embed/..."
        hint="YouTube embed URL — used for the 'Take a Virtual Campus Tour' button."
      />

      <Field
        label="Photos"
        span="full"
        hint={`Max ${LIMITS_lifeAtJct.photos} photos.`}
      >
        <div className="admin-form-grid admin-form-grid--tight">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="admin-col-4 rounded-lg border border-gray-200 p-3"
            >
              <FormGrid tight>
                <TextInput
                  label="Caption"
                  span={7}
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
                  span={5}
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
                <ImageUploadInput
                  label="Image"
                  span="full"
                  ratio="card"
                  value={photo.src}
                  onChange={(url) =>
                    onChange({
                      ...value,
                      photos: photos.map((p, j) =>
                        j === i ? { ...p, src: url } : p,
                      ),
                    })
                  }
                  hideUrlField
                />
              </FormGrid>
              <div className="flex items-center justify-between gap-3">
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
                  Show in &quot;All&quot;
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...value,
                      photos: photos.filter((_, j) => j !== i),
                    })
                  }
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
          <div className="admin-col-full flex items-center justify-between">
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
    </FormGrid>
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
  // Reads left to right exactly as the bar renders: message, then its button.
  return (
    <FormGrid>
      <Field label="Visibility" span={2}>
        <label className="flex items-center gap-2 pt-2 text-sm">
          <input
            type="checkbox"
            checked={value.enabled !== false}
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          />
          Show bar
        </label>
      </Field>
      <TextInput
        label="Announcement Text"
        span={4}
        value={value.text ?? ""}
        maxLength={120}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        placeholder="e.g. Admissions open for 2025–26 batch"
      />
      <TextInput
        label="CTA Label (optional)"
        span={2}
        value={value.ctaLabel ?? ""}
        maxLength={24}
        onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })}
        placeholder="e.g. Apply Now"
      />
      <TextInput
        label="CTA Link (optional)"
        span={4}
        value={value.ctaHref ?? ""}
        maxLength={500}
        onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
        placeholder="https://..."
      />
    </FormGrid>
  );
}

/* ─── News & Events ─── */

export type UpcomingEventsVal = {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  description?: string;
  maxItems?: number;
  ctaLabel?: string;
  ctaHref?: string;
  emptyText?: string;
  fallbackToRecent?: boolean;
  upcomingBadge?: string;
};

export function UpcomingEventsForm({
  value,
  onChange,
  eventsHref,
}: {
  value: UpcomingEventsVal;
  onChange: (v: UpcomingEventsVal) => void;
  /** The college's own /events route — the default the button links to. */
  eventsHref: string;
}) {
  const maxItems = value.maxItems ?? 3;

  // Section heading first (eyebrow → heading → description), then the card row
  // settings, then the button under it, then the fallback behaviour.
  return (
    <FormGrid>
      <p className="admin-col-full rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
        The events themselves are managed under{" "}
        <span className="font-semibold">News &amp; Events</span>. This section
        shows the events still to come, soonest first, and tops the row up with
        the latest past events so it is never part empty — only its wording is
        set here.
      </p>

      <Field label="Visibility" span={3}>
        <label className="flex items-center gap-2 pt-2 text-sm">
          <input
            type="checkbox"
            checked={value.enabled !== false}
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          />
          Show on landing page
        </label>
      </Field>
      <TextInput
        label="Eyebrow"
        span={4}
        value={value.eyebrow ?? ""}
        maxLength={LIMITS_upcomingEvents.eyebrowMax}
        placeholder="Happenings"
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
      />
      <TextInput
        label="Heading"
        span={5}
        value={value.heading ?? ""}
        maxLength={LIMITS_upcomingEvents.headingMax}
        placeholder="News & Events"
        onChange={(e) => onChange({ ...value, heading: e.target.value })}
      />

      <TextArea
        label="Description (optional)"
        span="full"
        rows={2}
        value={value.description ?? ""}
        maxLength={LIMITS_upcomingEvents.descriptionMax}
        placeholder="One or two lines shown under the heading"
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />

      <TextInput
        label="Events Shown"
        span={3}
        type="number"
        min={LIMITS_upcomingEvents.minItems}
        max={LIMITS_upcomingEvents.maxItems}
        value={String(maxItems)}
        hint={`Between ${LIMITS_upcomingEvents.minItems} and ${LIMITS_upcomingEvents.maxItems} cards.`}
        onChange={(e) => {
          const parsed = parseInt(e.target.value, 10);
          onChange({
            ...value,
            maxItems: Number.isFinite(parsed)
              ? Math.min(
                  LIMITS_upcomingEvents.maxItems,
                  Math.max(LIMITS_upcomingEvents.minItems, parsed),
                )
              : maxItems,
          });
        }}
      />
      <TextInput
        label="Upcoming Badge"
        span={4}
        value={value.upcomingBadge ?? ""}
        maxLength={LIMITS_upcomingEvents.badgeMax}
        placeholder="Upcoming"
        hint="Marks the cards whose event has not happened yet. Leave blank to show no badge."
        onChange={(e) => onChange({ ...value, upcomingBadge: e.target.value })}
      />
      <TextInput
        label="Empty-state Text (optional)"
        span={5}
        value={value.emptyText ?? ""}
        maxLength={LIMITS_upcomingEvents.emptyTextMax}
        placeholder="e.g. New events are announced here each term."
        hint="Shown when there is nothing to list at all. Leave blank to hide the whole section instead."
        onChange={(e) => onChange({ ...value, emptyText: e.target.value })}
      />

      <TextInput
        label="Button Label"
        span={4}
        value={value.ctaLabel ?? ""}
        maxLength={LIMITS_upcomingEvents.ctaLabelMax}
        placeholder="News & Events"
        onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })}
      />
      <TextInput
        label="Button Link"
        span={4}
        value={value.ctaHref ?? ""}
        maxLength={500}
        placeholder={eventsHref}
        hint={`Leave blank to link to ${eventsHref}`}
        onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
      />
      <Field label="Spare Slots" span={4}>
        <label className="flex items-center gap-2 pt-2 text-sm">
          <input
            type="checkbox"
            checked={value.fallbackToRecent !== false}
            onChange={(e) =>
              onChange({ ...value, fallbackToRecent: e.target.checked })
            }
          />
          Fill with the latest past events
        </label>
      </Field>
    </FormGrid>
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
  // Heading → CTA → the criteria columns → the contact strip beneath them,
  // which is the order the public admissions section renders in.
  return (
    <FormGrid>
      <TextInput
        label="Eyebrow"
        span={3}
        value={value.eyebrow ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.eyebrowMax}
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
      />
      <TextInput
        label="Title"
        span={5}
        value={value.title ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <TextArea
        label="Description"
        span={4}
        rows={2}
        value={value.description ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <TextInput
        label="CTA Label"
        span={4}
        value={value.ctaLabel ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.ctaLabelMax}
        onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })}
      />
      <TextInput
        label="CTA Href"
        span={8}
        value={value.ctaHref ?? ""}
        maxLength={500}
        onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
      />

      <Field
        label="Admission Criteria Blocks"
        span="full"
        hint={`The frontend renders exactly ${LIMITS_polytechnicAdmissions.criteriaMax} columns. Extra blocks will be saved but never displayed.`}
      >
        {/* One editor column per rendered column, so the admin sees the same
            three-across layout the visitor does. */}
        <div className="admin-form-grid admin-form-grid--tight">
          {criteria.map((block, i) => (
            <div
              key={i}
              className="admin-col-4 rounded-lg border border-gray-200 p-3"
            >
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
                        aria-label={`Item ${k + 1}`}
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
                        aria-label={`Remove item ${k + 1}`}
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
          <div className="admin-col-full flex items-center justify-between">
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

      <TextInput
        label="Contact Phone"
        span={3}
        value={value.phone ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.phoneMax}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
        placeholder="+91 93614 88801"
        hint="Shown in the strip below the admission criteria."
      />
      <TextInput
        label="Contact Email"
        span={4}
        value={value.email ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.emailMax}
        onChange={(e) => onChange({ ...value, email: e.target.value })}
        placeholder="admissions@jct.ac.in"
      />
      <TextInput
        label="Contact Address"
        span={5}
        value={value.address ?? ""}
        maxLength={LIMITS_polytechnicAdmissions.addressMax}
        onChange={(e) => onChange({ ...value, address: e.target.value })}
        placeholder="Knowledge Park, Pichanur, Coimbatore - 641105"
      />
    </FormGrid>
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
  // Metric cards render as a row on the public page; they edit as one too.
  return (
    <div className="admin-form-grid admin-form-grid--tight">
      {safe.map((item, i) => (
        <div
          key={i}
          className="admin-col-4 rounded-lg border border-gray-200 p-3"
        >
          <FormGrid tight>
            <TextInput
              label="Value"
              span={4}
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
              span={8}
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
              span="full"
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
          </FormGrid>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm"
            aria-label={`Remove metric ${i + 1}`}
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="admin-col-full flex items-center justify-between">
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
    <div className="admin-form-grid admin-form-grid--tight">
      {safe.map((item, i) => (
        <div
          key={i}
          className="admin-col-4 rounded-lg border border-gray-200 p-3"
        >
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
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="admin-col-full flex items-center justify-between">
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
    <div className="admin-form-grid admin-form-grid--tight">
      {safe.map((item, i) => (
        <div key={i} className="admin-col-4 flex gap-2">
          <input
            className="admin-input"
            value={item}
            maxLength={RESEARCH_HIGHLIGHTS_LIMITS.itemMax}
            aria-label={`Item ${i + 1}`}
            onChange={(e) =>
              onChange(safe.map((v, j) => (j === i ? e.target.value : v)))
            }
          />
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
            aria-label={`Remove item ${i + 1}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <div className="admin-col-full flex items-center justify-between">
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
  // Heading → CTA → criteria columns → contact strip, as rendered publicly.
  return (
    <FormGrid>
      <TextInput
        label="Eyebrow"
        span={3}
        value={value.eyebrow ?? ""}
        maxLength={ADMISSIONS_LIMITS.eyebrowMax}
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        hint='Small label above the title (e.g. "Admissions")'
      />
      <TextInput
        label="Title"
        span={5}
        value={value.title ?? ""}
        maxLength={ADMISSIONS_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <TextArea
        label="Description"
        span={4}
        rows={2}
        value={value.description ?? ""}
        maxLength={ADMISSIONS_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <TextInput
        label="CTA Label"
        span={4}
        value={value.ctaLabel ?? ""}
        maxLength={ADMISSIONS_LIMITS.ctaLabelMax}
        onChange={(e) => onChange({ ...value, ctaLabel: e.target.value })}
        placeholder="Apply Now"
      />
      <TextInput
        label="CTA Href"
        span={8}
        value={value.ctaHref ?? ""}
        maxLength={500}
        onChange={(e) => onChange({ ...value, ctaHref: e.target.value })}
        placeholder="https://admissions.jct.ac.in"
      />

      <Field
        label="Admission Criteria Blocks"
        span="full"
        hint={`Renders as ${ADMISSIONS_LIMITS.criteriaMax} columns on the page. Up to ${ADMISSIONS_LIMITS.itemsPerBlockMax} items per block.`}
      >
        <div className="admin-form-grid admin-form-grid--tight">
          {criteria.map((block, i) => (
            <div
              key={i}
              className="admin-col-4 rounded-lg border border-gray-200 p-3"
            >
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
                        aria-label={`Item ${k + 1}`}
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
                      block.items.length >= ADMISSIONS_LIMITS.itemsPerBlockMax
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
          <div className="admin-col-full flex items-center justify-between">
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
              max={ADMISSIONS_LIMITS.criteriaMax}
            />
          </div>
        </div>
      </Field>

      {showContact && (
        <>
          <TextInput
            label="Contact Phone"
            span={3}
            value={value.phone ?? ""}
            maxLength={ADMISSIONS_LIMITS.phoneMax}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="+91 93614 88801"
            hint="Shown in the strip below the criteria."
          />
          <TextInput
            label="Contact Email"
            span={4}
            value={value.email ?? ""}
            maxLength={ADMISSIONS_LIMITS.emailMax}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="admissions@jct.ac.in"
          />
          <TextInput
            label="Contact Address"
            span={5}
            value={value.address ?? ""}
            maxLength={ADMISSIONS_LIMITS.addressMax}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="Knowledge Park, Pichanur, Coimbatore - 641105"
          />
        </>
      )}
    </FormGrid>
  );
}

/* ─── Why Choose JCT ─── */

export type WhyChooseJctFeature = {
  icon: string;
  title: string;
  description: string;
};
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
    <FormGrid>
      <TextInput
        label="Eyebrow"
        span={3}
        value={value.eyebrow ?? ""}
        maxLength={WHY_CHOOSE_JCT_LIMITS.eyebrowMax}
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
      />
      <TextInput
        label="Title"
        span={5}
        value={value.title ?? ""}
        maxLength={WHY_CHOOSE_JCT_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <TextInput
        label="Title Highlight"
        span={4}
        value={value.titleHighlight ?? ""}
        maxLength={WHY_CHOOSE_JCT_LIMITS.titleHighlightMax}
        onChange={(e) => onChange({ ...value, titleHighlight: e.target.value })}
        hint="Rendered in accent color within the title"
      />
      <TextArea
        label="Description"
        span="full"
        rows={2}
        value={value.description ?? ""}
        maxLength={WHY_CHOOSE_JCT_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <Field
        label="Feature Cards"
        span="full"
        hint={`Up to ${WHY_CHOOSE_JCT_LIMITS.featuresMax} cards. Icon is a Lucide icon name (e.g. BookOpen, Award).`}
      >
        <div className="admin-form-grid admin-form-grid--tight">
          {features.map((feat, i) => (
            <div
              key={i}
              className="admin-col-4 rounded-lg border border-gray-200 p-3"
            >
              <FormGrid tight>
                <TextInput
                  label="Icon"
                  span={5}
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
                  span={7}
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
                <TextArea
                  label="Description"
                  span="full"
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
              </FormGrid>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    features: features.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <div className="admin-col-full flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  features: [
                    ...features,
                    { icon: "", title: "", description: "" },
                  ],
                })
              }
              disabled={atMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Feature
            </button>
            <LimitHint
              count={features.length}
              max={WHY_CHOOSE_JCT_LIMITS.featuresMax}
            />
          </div>
        </div>
      </Field>
    </FormGrid>
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
  // Heading block, then the two buttons under it, then the pathway card row.
  return (
    <FormGrid>
      <TextInput
        label="Eyebrow"
        span={3}
        value={value.eyebrow ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.eyebrowMax}
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
      />
      <TextInput
        label="Title"
        span={5}
        value={value.title ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />
      <TextInput
        label="Title Highlight"
        span={4}
        value={value.titleHighlight ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.titleHighlightMax}
        onChange={(e) => onChange({ ...value, titleHighlight: e.target.value })}
        hint="Rendered in accent color"
      />
      <TextArea
        label="Description"
        span="full"
        rows={2}
        value={value.description ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <TextInput
        label="Apply Button Label"
        span={3}
        value={value.applyLabel ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.applyLabelMax}
        onChange={(e) => onChange({ ...value, applyLabel: e.target.value })}
        placeholder="Apply Now"
      />
      <TextInput
        label="Apply Button Href"
        span={5}
        value={value.applyHref ?? ""}
        maxLength={500}
        onChange={(e) => onChange({ ...value, applyHref: e.target.value })}
        placeholder="https://admissions.jct.ac.in"
      />
      <TextInput
        label="PDF Button Label"
        span={4}
        value={value.prospectusLabel ?? ""}
        maxLength={HOME_ADMISSIONS_LIMITS.prospectusLabelMax}
        onChange={(e) =>
          onChange({ ...value, prospectusLabel: e.target.value })
        }
        placeholder="Download Prospectus"
        hint="Label shown on the prospectus download button"
      />
      <DocumentUploadInput
        label="Prospectus PDF"
        span="full"
        value={value.prospectusUrl ?? ""}
        onChange={(url) => onChange({ ...value, prospectusUrl: url })}
      />

      <Field
        label="Pathway Cards"
        span="full"
        hint={`Up to ${HOME_ADMISSIONS_LIMITS.pathwaysMax} cards. Icon is a Lucide icon name.`}
      >
        <div className="admin-form-grid admin-form-grid--tight">
          {pathways.map((p, i) => (
            <div
              key={i}
              className="admin-col-4 rounded-lg border border-gray-200 p-3"
            >
              <FormGrid tight>
                <TextInput
                  label="Icon"
                  span={5}
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
                  span={7}
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
                <TextArea
                  label="Description"
                  span="full"
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
                <TextInput
                  label="CTA Label"
                  span={5}
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
                  span={7}
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
              </FormGrid>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    pathways: pathways.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <div className="admin-col-full flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  pathways: [
                    ...pathways,
                    {
                      icon: "",
                      title: "",
                      description: "",
                      ctaLabel: "",
                      ctaHref: "",
                    },
                  ],
                })
              }
              disabled={atMax}
              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} /> Add Pathway
            </button>
            <LimitHint
              count={pathways.length}
              max={HOME_ADMISSIONS_LIMITS.pathwaysMax}
            />
          </div>
        </div>
      </Field>
    </FormGrid>
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
  // The header is a single strip — phone on the left, login button on the
  // right — so its whole configuration fits one row.
  return (
    <FormGrid>
      <TextInput
        label="Phone Number"
        span={3}
        value={value.phone ?? ""}
        maxLength={HEADER_LIMITS.phoneMax}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
        placeholder="+91 93614 88801"
        hint="Shown in the public site header."
      />
      <Field label="Student Login" span={3}>
        <label className="flex items-center gap-2 pt-2 text-sm">
          <input
            type="checkbox"
            checked={value.showStudentLogin !== false}
            onChange={(e) =>
              onChange({ ...value, showStudentLogin: e.target.checked })
            }
          />
          Show the button
        </label>
      </Field>
      {value.showStudentLogin !== false && (
        <>
          <TextInput
            label="Student Login Label"
            span={2}
            value={value.studentLoginLabel ?? ""}
            maxLength={HEADER_LIMITS.ctaLabelMax}
            onChange={(e) =>
              onChange({ ...value, studentLoginLabel: e.target.value })
            }
            placeholder="Student Login"
          />
          <TextInput
            label="Student Login URL"
            span={4}
            value={value.studentLoginUrl ?? ""}
            maxLength={500}
            onChange={(e) =>
              onChange({ ...value, studentLoginUrl: e.target.value })
            }
            placeholder="https://..."
          />
        </>
      )}
    </FormGrid>
  );
}

/* ─── Navbar (per-institution) ─── */

export type NavbarChildVal = {
  id?: string;
  label?: string;
  href?: string;
  /** Storage key of an uploaded PDF. When set it overrides `href`. */
  file?: string;
  desc?: string;
  visible?: boolean;
};

export type NavbarItemVal = {
  id?: string;
  label?: string;
  href?: string;
  /** Storage key of an uploaded PDF. When set it overrides `href`. */
  file?: string;
  desc?: string;
  visible?: boolean;
  children?: NavbarChildVal[];
};

export type NavbarVal = {
  items?: NavbarItemVal[];
};

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [v] = next.splice(from, 1);
  next.splice(to, 0, v);
  return next;
}

function ChildEditor({
  child,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canUp,
  canDown,
}: {
  child: NavbarChildVal;
  onChange: (next: NavbarChildVal) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-500">Submenu Item</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canUp}
            onClick={onMoveUp}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            title="Move up"
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            disabled={!canDown}
            onClick={onMoveDown}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            title="Move down"
          >
            <ArrowDown size={12} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <FormGrid tight>
        <TextInput
          label="Label"
          span={3}
          value={child.label ?? ""}
          maxLength={NAVBAR_LIMITS.labelMax}
          onChange={(e) => onChange({ ...child, label: e.target.value })}
        />
        <TextInput
          label="URL / Href"
          span={4}
          value={child.href ?? ""}
          disabled={!!child.file}
          onChange={(e) => onChange({ ...child, href: e.target.value })}
          placeholder={
            child.file ? "Using uploaded PDF" : "/path or https://..."
          }
        />
        <TextInput
          label="Description (optional)"
          span={3}
          value={child.desc ?? ""}
          maxLength={NAVBAR_LIMITS.descMax}
          onChange={(e) => onChange({ ...child, desc: e.target.value })}
        />
        <Field label="Visibility" span={2}>
          <label className="flex items-center gap-2 pt-2 text-sm">
            <input
              type="checkbox"
              checked={child.visible !== false}
              onChange={(e) =>
                onChange({ ...child, visible: e.target.checked })
              }
            />
            Visible
          </label>
        </Field>
        <DocumentUploadInput
          label="PDF (optional)"
          span="full"
          hint="Upload a PDF to make this submenu item open the file in a new tab instead of following the URL."
          value={child.file ?? ""}
          onChange={(file) => onChange({ ...child, file })}
        />
      </FormGrid>
    </div>
  );
}

function NavbarItemEditor({
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canUp,
  canDown,
}: {
  item: NavbarItemVal;
  onChange: (next: NavbarItemVal) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const children = Array.isArray(item.children) ? item.children : [];
  const childAtMax = children.length >= NAVBAR_LIMITS.children;
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-gray-800"
        >
          <ChevronDownIcon size={14} className={expanded ? "" : "-rotate-90"} />
          <span>{item.label || "(unnamed item)"}</span>
          {item.visible === false && (
            <span className="rounded-full bg-gray-300 px-2 py-0.5 text-[10px] uppercase">
              Hidden
            </span>
          )}
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canUp}
            onClick={onMoveUp}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            title="Move up"
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            disabled={!canDown}
            onClick={onMoveDown}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            title="Move down"
          >
            <ArrowDown size={12} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-gray-200 pt-3">
          <FormGrid tight>
            <TextInput
              label="Label"
              span={3}
              value={item.label ?? ""}
              maxLength={NAVBAR_LIMITS.labelMax}
              onChange={(e) => onChange({ ...item, label: e.target.value })}
            />
            <TextInput
              label="URL / Href"
              span={4}
              value={item.href ?? ""}
              disabled={!!item.file}
              onChange={(e) => onChange({ ...item, href: e.target.value })}
              placeholder={
                item.file
                  ? "Using uploaded PDF"
                  : "/path or # for dropdown only"
              }
            />
            <TextInput
              label="Description (optional)"
              span={3}
              value={item.desc ?? ""}
              maxLength={NAVBAR_LIMITS.descMax}
              onChange={(e) => onChange({ ...item, desc: e.target.value })}
            />
            <Field label="Visibility" span={2}>
              <label className="flex items-center gap-2 pt-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(e) =>
                    onChange({ ...item, visible: e.target.checked })
                  }
                />
                Visible
              </label>
            </Field>
            <DocumentUploadInput
              label="PDF (optional)"
              span="full"
              hint="Upload a PDF to make this menu item open the file in a new tab instead of following the URL."
              value={item.file ?? ""}
              onChange={(file) => onChange({ ...item, file })}
            />
          </FormGrid>
          <Field
            label="Submenu Items"
            hint="Optional. If present, this item renders as a dropdown of these children."
          >
            <div className="space-y-2">
              {children.map((child, i) => (
                <ChildEditor
                  key={i}
                  child={child}
                  onChange={(next) =>
                    onChange({
                      ...item,
                      children: children.map((c, j) => (j === i ? next : c)),
                    })
                  }
                  onRemove={() =>
                    onChange({
                      ...item,
                      children: children.filter((_, j) => j !== i),
                    })
                  }
                  onMoveUp={() =>
                    onChange({
                      ...item,
                      children: moveItem(children, i, i - 1),
                    })
                  }
                  onMoveDown={() =>
                    onChange({
                      ...item,
                      children: moveItem(children, i, i + 1),
                    })
                  }
                  canUp={i > 0}
                  canDown={i < children.length - 1}
                />
              ))}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  disabled={childAtMax}
                  onClick={() =>
                    onChange({
                      ...item,
                      children: [
                        ...children,
                        { label: "", href: "", visible: true },
                      ],
                    })
                  }
                  className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={12} /> Add Submenu Item
                </button>
                <LimitHint
                  count={children.length}
                  max={NAVBAR_LIMITS.children}
                />
              </div>
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}

export function NavbarForm({
  value,
  onChange,
}: {
  value: NavbarVal;
  onChange: (v: NavbarVal) => void;
}) {
  const items = Array.isArray(value.items) ? value.items : [];
  const atMax = items.length >= NAVBAR_LIMITS.items;
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item, i) => (
          <NavbarItemEditor
            key={i}
            item={item}
            onChange={(next) =>
              onChange({
                ...value,
                items: items.map((it, j) => (j === i ? next : it)),
              })
            }
            onRemove={() =>
              onChange({
                ...value,
                items: items.filter((_, j) => j !== i),
              })
            }
            onMoveUp={() =>
              onChange({
                ...value,
                items: moveItem(items, i, i - 1),
              })
            }
            onMoveDown={() =>
              onChange({
                ...value,
                items: moveItem(items, i, i + 1),
              })
            }
            canUp={i > 0}
            canDown={i < items.length - 1}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={atMax}
          onClick={() =>
            onChange({
              ...value,
              items: [...items, { label: "", href: "", visible: true }],
            })
          }
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Navbar Item
        </button>
        <LimitHint count={items.length} max={NAVBAR_LIMITS.items} />
      </div>
    </div>
  );
}

/* ─── Navbar admin section (header bar + nav items in one panel) ─── */

const NAVBAR_HEADER_DEFAULT: HeaderVal = {
  phone: "",
  studentLoginLabel: "",
  studentLoginUrl: "",
  showStudentLogin: true,
};

export function NavbarAdminSection({
  headerConfigKey,
  navbarConfigKey,
  navDefault,
}: {
  headerConfigKey: string;
  navbarConfigKey: string;
  navDefault?: NavbarVal;
}) {
  const [headerVal, setHeaderVal] = useState<HeaderVal>(NAVBAR_HEADER_DEFAULT);
  const [navbarVal, setNavbarVal] = useState<NavbarVal>(navDefault ?? {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  // This section renders inside PageContentShell's DeferredUploadsProvider, so
  // PDF picks are held as `pending:` placeholders until flushed. Its own save
  // button bypasses the shell's save, so it has to flush them itself.
  const deferred = useDeferredUploadsOptional();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/site-config");
        const data: Array<{ config_key: string; value: unknown }> =
          await r.json();
        if (cancelled) return;
        const h = data.find((d) => d.config_key === headerConfigKey);
        const n = data.find((d) => d.config_key === navbarConfigKey);
        if (h?.value) setHeaderVal(h.value as HeaderVal);
        if (n?.value) setNavbarVal(n.value as NavbarVal);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [headerConfigKey, navbarConfigKey]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const flushedNav = deferred ? await deferred.flush(navbarVal) : navbarVal;
      if (deferred) setNavbarVal(flushedNav);
      const put = (config_key: string, value: unknown) =>
        fetch("/api/admin/site-config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config_key, value }),
        });
      const [hr, nr] = await Promise.all([
        put(headerConfigKey, headerVal),
        put(navbarConfigKey, flushedNav),
      ]);
      const ok = hr.ok && nr.ok;
      setMsg({ ok, text: ok ? "Saved!" : "Save failed." });
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* The save button shares the "Header Bar" row rather than owning a bare
          row of its own, which left a band of empty space above the form. */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-800">Header Bar</h3>
          <div className="flex items-center gap-3">
            {msg && (
              <span
                className={`text-sm font-medium ${msg.ok ? "text-green-600" : "text-red-500"}`}
              >
                {msg.text}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="admin-btn admin-btn-gold admin-btn-sm"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving…" : "Save Navbar"}
            </button>
          </div>
        </div>
        <HeaderForm value={headerVal} onChange={setHeaderVal} />
      </div>
      <hr className="border-gray-200" />
      <div>
        <h3 className="mb-3 font-semibold text-gray-800">Navigation Items</h3>
        <NavbarForm value={navbarVal} onChange={setNavbarVal} />
      </div>
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

  // The footer's own columns — helpline card, Contact Us, socials — become the
  // editor's columns, so the shape on screen matches the shape on the page.
  return (
    <FormGrid>
      <TextInput
        label="Helpline Label"
        span={4}
        value={value.helplineLabel ?? ""}
        maxLength={FOOTER_LIMITS.labelMax}
        onChange={(e) => onChange({ ...value, helplineLabel: e.target.value })}
        placeholder="Admissions Helpline"
        hint="The highlighted contact card shown in the footer."
      />
      <TextInput
        label="Helpline Phone"
        span={4}
        value={value.phone ?? ""}
        maxLength={FOOTER_LIMITS.phoneMax}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
        placeholder="+91 93614 88801"
        hint="Reused in the Contact Us column."
      />
      <TextInput
        label="Admissions Email"
        span={4}
        value={value.admissionsEmail ?? ""}
        maxLength={FOOTER_LIMITS.emailMax}
        onChange={(e) =>
          onChange({ ...value, admissionsEmail: e.target.value })
        }
        placeholder="admissions@jct.ac.in"
      />

      <TextInput
        label="General Email"
        span={4}
        value={value.email ?? ""}
        maxLength={FOOTER_LIMITS.emailMax}
        onChange={(e) => onChange({ ...value, email: e.target.value })}
        placeholder="info@jct.ac.in"
        hint="Shown in the footer's Contact Us column."
      />
      <Field
        label="Address Lines"
        span={8}
        hint={`Up to ${FOOTER_LIMITS.addressLinesMax} lines.`}
      >
        <div className="admin-form-grid admin-form-grid--tight">
          {addressLines.map((line, i) => (
            <div key={i} className="admin-col-6 flex gap-2">
              <input
                className="admin-input"
                value={line}
                maxLength={FOOTER_LIMITS.addressLineMax}
                aria-label={`Address line ${i + 1}`}
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
                aria-label={`Remove address line ${i + 1}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <div className="admin-col-full">
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
        </div>
      </Field>

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
          span={4}
          value={(value[key] as string) ?? ""}
          maxLength={500}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          placeholder="https://..."
        />
      ))}
    </FormGrid>
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
    <div className="admin-form-grid admin-form-grid--tight">
      <p className="admin-col-full text-xs text-gray-500">
        The row of badges shown directly beneath the home hero. Icon is one of:
        laurel, users, cap, badge, growth.
      </p>
      {safe.map((item, i) => (
        <div
          key={i}
          className="admin-col-4 rounded-lg border border-gray-200 p-3"
        >
          <FormGrid tight>
            <TextInput
              label="Icon"
              span={5}
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
              span={7}
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
          </FormGrid>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
      <div className="admin-col-full flex items-center justify-between">
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

/* ─── Floating site elements ─── */

export type FloatingElementsVal = {
  whatsapp?: {
    enabled?: boolean;
    phone?: string;
  };
  applyNow?: {
    enabled?: boolean;
    label?: string;
    href?: string;
  };
  meritto?: {
    enabled?: boolean;
  };
};

export function FloatingElementsForm({
  value,
  onChange,
}: {
  value: FloatingElementsVal;
  onChange: (v: FloatingElementsVal) => void;
}) {
  const wa = value.whatsapp ?? {};
  const ap = value.applyNow ?? {};
  const mt = value.meritto ?? {};
  // Three independent floating widgets — one column each.
  return (
    <FormGrid>
      <Field
        label="WhatsApp Button"
        span={4}
        hint="Floating WhatsApp icon shown on all public pages."
      >
        <div className="rounded-lg border border-gray-200 p-3">
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wa.enabled !== false}
              onChange={(e) =>
                onChange({
                  ...value,
                  whatsapp: { ...wa, enabled: e.target.checked },
                })
              }
            />
            Enable WhatsApp button
          </label>
          <TextInput
            label="Phone Number"
            value={wa.phone ?? ""}
            maxLength={FLOATING_ELEMENTS_LIMITS.phoneMax}
            onChange={(e) =>
              onChange({ ...value, whatsapp: { ...wa, phone: e.target.value } })
            }
            placeholder="+91 93614 88801"
            hint="Include country code. Used as the WhatsApp chat link."
          />
        </div>
      </Field>

      <Field
        label="Apply Now Button"
        span={4}
        hint="Floating Apply Now button shown on all public pages."
      >
        <div className="rounded-lg border border-gray-200 p-3">
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ap.enabled !== false}
              onChange={(e) =>
                onChange({
                  ...value,
                  applyNow: { ...ap, enabled: e.target.checked },
                })
              }
            />
            Enable Apply Now button
          </label>
          <TextInput
            label="Button Label"
            value={ap.label ?? ""}
            maxLength={FLOATING_ELEMENTS_LIMITS.labelMax}
            onChange={(e) =>
              onChange({ ...value, applyNow: { ...ap, label: e.target.value } })
            }
            placeholder="Apply Now"
          />
          <TextInput
            label="Button Link"
            value={ap.href ?? ""}
            maxLength={FLOATING_ELEMENTS_LIMITS.hrefMax}
            onChange={(e) =>
              onChange({ ...value, applyNow: { ...ap, href: e.target.value } })
            }
            placeholder="https://admissions.jct.ac.in"
          />
        </div>
      </Field>

      <Field
        label="Meritto Chat"
        span={4}
        hint="Show/hide the Meritto chatbot on public pages."
      >
        <div className="rounded-lg border border-gray-200 p-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={mt.enabled !== false}
              onChange={(e) =>
                onChange({
                  ...value,
                  meritto: { ...mt, enabled: e.target.checked },
                })
              }
            />
            Enable Meritto Chat
          </label>
        </div>
      </Field>
    </FormGrid>
  );
}

/* ─── Recruiters / Placement Highlights section ─── */

export type RecruitersSectionStat = {
  icon: string;
  value: string;
  label: string;
};
export type RecruitersSectionVal = {
  show_section?: boolean;
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
    <FormGrid>
      <Field label="Visibility" span={3}>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
          <input
            type="checkbox"
            checked={value.show_section !== false}
            onChange={(e) =>
              onChange({ ...value, show_section: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 accent-amber-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Show on public pages
          </span>
        </label>
      </Field>
      <TextInput
        label="Eyebrow"
        span={3}
        value={value.eyebrow ?? ""}
        maxLength={RECRUITERS_SECTION_LIMITS.eyebrowMax}
        onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        placeholder="Placement Highlights"
      />
      <TextInput
        label="Title"
        span={3}
        value={value.title ?? ""}
        maxLength={RECRUITERS_SECTION_LIMITS.titleMax}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        placeholder="Our Recruiters"
      />
      <TextInput
        label="Title Highlight"
        span={3}
        value={value.titleHighlight ?? ""}
        maxLength={RECRUITERS_SECTION_LIMITS.titleHighlightMax}
        onChange={(e) => onChange({ ...value, titleHighlight: e.target.value })}
        hint="Rendered in italic accent within the title"
      />
      <TextArea
        label="Description"
        span="full"
        rows={2}
        value={value.description ?? ""}
        maxLength={RECRUITERS_SECTION_LIMITS.descriptionMax}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <Field
        label="Stat Cards"
        span="full"
        hint={`Up to ${RECRUITERS_SECTION_LIMITS.statsMax} cards. Icon is one of: trend, award, building, users.`}
      >
        <div className="admin-form-grid admin-form-grid--tight">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="admin-col-3 rounded-lg border border-gray-200 p-3"
            >
              <FormGrid tight>
                <TextInput
                  label="Icon"
                  span={5}
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
                  span={7}
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
                  span="full"
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
              </FormGrid>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    stats: stats.filter((_, j) => j !== i),
                  })
                }
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <div className="admin-col-full flex items-center justify-between">
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
    </FormGrid>
  );
}

/* ─── SEO / Meta Tags ─── */

export type SeoPageEntry = {
  path: string;
  label?: string;
  title?: string;
  description?: string;
};
export type SeoPagesVal = { pages?: SeoPageEntry[] };

/**
 * Per-page meta title/description for one institution scope. Rows are keyed
 * by public route path — `getPageSeo` matches on that path, so a row whose
 * path doesn't match a real route is simply never used.
 */
export function SeoPagesForm({
  value,
  onChange,
}: {
  value: SeoPagesVal;
  onChange: (next: SeoPagesVal) => void;
}) {
  const pages = value.pages ?? [];
  const atMax = pages.length >= SEO_LIMITS.pagesMax;

  const setPage = (i: number, patch: Partial<SeoPageEntry>) =>
    onChange({
      ...value,
      pages: pages.map((p, j) => (j === i ? { ...p, ...patch } : p)),
    });

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        The title and description search engines show for each page. Leave a
        field blank to keep the page&apos;s built-in default. Program pages are
        edited on the program itself, under Programs → SEO.
      </p>

      {pages.length === 0 && (
        <p className="text-sm text-gray-400">No pages configured yet.</p>
      )}

      {pages.map((page, i) => (
        <Accordion
          key={i}
          title={
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">
                {page.label?.trim() || page.path || "Untitled page"}
              </span>
              {!page.title?.trim() && !page.description?.trim() && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-500">
                  not set
                </span>
              )}
            </span>
          }
        >
          <FormGrid>
            <TextInput
              label="Page Name"
              span={4}
              value={page.label ?? ""}
              maxLength={SEO_LIMITS.labelMax}
              placeholder="e.g. Landing page"
              onChange={(e) => setPage(i, { label: e.target.value })}
            />
            <TextInput
              label="Path"
              span={8}
              value={page.path ?? ""}
              maxLength={SEO_LIMITS.pathMax}
              placeholder="/institutions/engineering"
              onChange={(e) => setPage(i, { path: e.target.value })}
            />
            <SeoFields
              title={page.title ?? ""}
              description={page.description ?? ""}
              path={page.path}
              onChange={(patch) => setPage(i, patch)}
            />
          </FormGrid>
          <button
            type="button"
            onClick={() =>
              onChange({ ...value, pages: pages.filter((_, j) => j !== i) })
            }
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={13} /> Remove Page
          </button>
        </Accordion>
      ))}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              pages: [
                ...pages,
                { path: "", label: "", title: "", description: "" },
              ],
            })
          }
          disabled={atMax}
          className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} /> Add Page
        </button>
        <LimitHint count={pages.length} max={SEO_LIMITS.pagesMax} />
      </div>
    </div>
  );
}
