"use client";

import {
  FormGrid,
  TextArea,
  TextInput,
  type FieldSpan,
} from "@/components/admin/inputs";
import { SEO_LIMITS, SEO_RECOMMENDED } from "@/lib/validation";

const SITE_ORIGIN = "jct.ac.in";

function Counter({
  count,
  recommended,
  max,
}: {
  count: number;
  recommended: number;
  max: number;
}) {
  // Over the recommended length is a warning (search results truncate), over
  // the hard cap is an error (the API rejects the save).
  const tone =
    count > max
      ? "text-red-600"
      : count > recommended
        ? "text-amber-600"
        : "text-gray-400";
  return (
    <p className={`-mt-3 mb-4 text-right text-xs ${tone}`}>
      {count} / {recommended} recommended
      {count > recommended && count <= max && " — may be truncated"}
      {count > max && ` — max ${max}`}
    </p>
  );
}

/** Google-style result preview so the admin sees how the tags will read. */
function SerpPreview({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path?: string;
}) {
  const shownTitle = title.trim() || "Untitled page";
  const shownDesc =
    description.trim() ||
    "No description set — search engines will pick their own snippet.";
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="mb-1 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
        Search preview
      </p>
      <p className="text-xs text-gray-500">
        {SITE_ORIGIN}
        {path ?? ""}
      </p>
      <p className="truncate text-base text-[#1a0dab]">{shownTitle}</p>
      <p className="line-clamp-2 text-xs text-gray-600">{shownDesc}</p>
    </div>
  );
}

/**
 * Meta title + description editor. Shared by the program builder's SEO
 * inspector and the per-page SEO lists in the page-content admin, so the
 * limits and guidance stay identical everywhere.
 */
export function SeoFields({
  title,
  description,
  onChange,
  path,
  titleLabel = "Meta Title",
  descriptionLabel = "Meta Description",
  showPreview = true,
  span = "full",
}: {
  title: string;
  description: string;
  onChange: (patch: { title?: string; description?: string }) => void;
  /** Route path shown in the preview, e.g. "/institutions/engineering". */
  path?: string;
  titleLabel?: string;
  descriptionLabel?: string;
  showPreview?: boolean;
  span?: FieldSpan;
}) {
  // Preview beside the fields, not above them: the two are read together, and
  // stacked they pushed the description box below the fold in a drawer.
  return (
    <FormGrid span={span}>
      {showPreview && (
        <div className="admin-col-5">
          <SerpPreview title={title} description={description} path={path} />
        </div>
      )}
      <div className={showPreview ? "admin-col-7" : "admin-col-full"}>
        <TextInput
          label={titleLabel}
          value={title}
          maxLength={SEO_LIMITS.titleMax}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Engineering college in coimbatore | JCT College"
        />
        <Counter
          count={title.length}
          recommended={SEO_RECOMMENDED.titleMax}
          max={SEO_LIMITS.titleMax}
        />
        <TextArea
          label={descriptionLabel}
          value={description}
          rows={3}
          maxLength={SEO_LIMITS.descriptionMax}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="One or two sentences describing this page for search results."
        />
        <Counter
          count={description.length}
          recommended={SEO_RECOMMENDED.descriptionMax}
          max={SEO_LIMITS.descriptionMax}
        />
      </div>
    </FormGrid>
  );
}
