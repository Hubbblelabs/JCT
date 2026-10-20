"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDeferredUploadsOptional } from "@/lib/deferred-uploads";
import { useImageError } from "@/lib/use-image-error";
import { publicAssetBaseUrl } from "@/lib/storage-public";
import {
  ALLOWED_MIME_TYPES,
  MAX_DIRECT_UPLOAD_SIZE,
  IMAGE_RATIOS,
  ratioOutputSize,
  belowRatioTarget,
  type RatioType,
} from "@/lib/validation/imageAsset";

// Mirrors /api/admin/documents/upload + /presign (kept in sync by hand —
// there is no shared client-safe constant for the document limit).
const DOC_MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

// Shown when the platform rejects the request body before our route runs
// (Vercel 413 / FUNCTION_PAYLOAD_TOO_LARGE) — that response is not JSON, so no
// message can be parsed out of it.
const PAYLOAD_TOO_LARGE_MSG = `File too large to upload (limit ${MAX_DIRECT_UPLOAD_SIZE / 1024 / 1024} MB). Please choose a smaller file.`;

const asMb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

// Pre-flight validation so size/type errors surface the instant a file is
// picked — including the deferred-upload path, where the server only rejects
// the file later, at save time. Rules mirror the upload routes.
function validateImageFile(file: File): string | null {
  if (file.type === "image/svg+xml" || /\.svgz?$/i.test(file.name))
    return "SVG uploads are not supported.";
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number],
    )
  )
    return `Invalid file type${file.type ? ` "${file.type}"` : ""}. Allowed: JPEG, PNG, WebP, GIF.`;
  if (file.size > MAX_DIRECT_UPLOAD_SIZE)
    return `File too large (${asMb(file.size)} MB). Max is ${MAX_DIRECT_UPLOAD_SIZE / 1024 / 1024} MB.`;
  return null;
}

// Mirrors ALLOWED_MIME in /api/admin/documents/upload.
const DOC_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const DOC_ACCEPT = `${DOC_MIME_TYPES.join(",")},.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx`;

function validateDocumentFile(file: File): string | null {
  if (!DOC_MIME_TYPES.includes(file.type))
    return `Invalid file type${file.type ? ` "${file.type}"` : ""}. Accepted: PDF, Word, Excel and PowerPoint.`;
  if (file.size > DOC_MAX_FILE_SIZE)
    return `File too large (${asMb(file.size)} MB). Max is ${DOC_MAX_FILE_SIZE / 1024 / 1024} MB.`;
  return null;
}

/* ── Grid layout ────────────────────────────────────────────────────────────
   Every control below renders inside a `Field` wrapper. When that wrapper is a
   direct child of a `FormGrid`, its `span` decides how much of the 12-column
   row it takes; outside a grid the class is inert and the field stacks as
   before. Single-line controls (text, number, select) are also marked
   `inline`: in a narrow container they keep sharing a line with their
   neighbours instead of each taking a full row. See the `.admin-form-grid`
   block in admin.css. */

export type FieldSpan = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "full";

export function colClass(span?: FieldSpan): string {
  if (span === undefined) return "";
  return span === "full" ? "admin-col-full" : `admin-col-${span}`;
}

/**
 * Row container for form fields. Children declare their own width via `span`;
 * anything that does not declare one takes half a row.
 */
export function FormGrid({
  children,
  tight,
  span = "full",
  className = "",
}: {
  children: ReactNode;
  /** Tighter gap, for repeater rows inside an already-bordered card. */
  tight?: boolean;
  /** Width of the grid itself when it is nested inside another grid. */
  span?: FieldSpan;
  className?: string;
}) {
  return (
    <div
      className={`admin-form-grid ${tight ? "admin-form-grid--tight" : ""} ${colClass(span)} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  /** Associates the label with its control for a11y (screen readers + click-to-focus). */
  htmlFor?: string;
  /** Columns of a parent `FormGrid` this field occupies. */
  span?: FieldSpan;
  /**
   * A single-line control (a short input, a select, a checkbox): in a narrow
   * container it may share a line with its neighbours rather than take a full
   * row. Leave unset for anything tall or wide — text areas, lists, uploads.
   */
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  required,
  hint,
  htmlFor,
  span,
  inline,
  className = "",
  children,
}: FieldProps) {
  return (
    <div
      className={`admin-field mb-4 ${colClass(span)} ${inline ? "admin-field-inline" : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
    >
      {label && (
        <label className="admin-label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="ml-1 text-[var(--admin-danger)]">*</span>
          )}
        </label>
      )}
      {children}
      {hint && <p className="admin-help">{hint}</p>}
    </div>
  );
}

// A date-and-time picker needs ~13rem to show its value at all, more than a
// narrow line's minimum, so it keeps a row of its own there.
const WIDE_INPUT_TYPES = new Set(["datetime-local"]);

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  span?: FieldSpan;
  /** Defaults to true — see `Field`. Pass false for a value that needs room. */
  inline?: boolean;
}

export function TextInput({
  label,
  hint,
  span,
  inline,
  id,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
      span={span}
      inline={inline ?? !WIDE_INPUT_TYPES.has(props.type ?? "")}
    >
      <input id={fieldId} className="admin-input" {...props} />
    </Field>
  );
}

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  span?: FieldSpan;
}

export function NumberInput({
  label,
  hint,
  span,
  id,
  ...props
}: NumberInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
      span={span}
      inline
    >
      <input type="number" id={fieldId} className="admin-input" {...props} />
    </Field>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  span?: FieldSpan;
}

export function TextArea({ label, hint, span, id, ...props }: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
      span={span}
    >
      <textarea id={fieldId} className="admin-textarea" {...props} />
    </Field>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  span?: FieldSpan;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  hint,
  span,
  options,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
      span={span}
      inline
    >
      <select id={fieldId} className="admin-select" {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

interface StringListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
  span?: FieldSpan;
  /** Lay the entries out in columns instead of one per row. */
  columns?: boolean;
}

export function StringList({
  label,
  values,
  onChange,
  placeholder,
  hint,
  span,
  columns,
}: StringListProps) {
  if (columns) {
    return (
      <Field label={label} hint={hint} span={span}>
        {/* Short entries (tags, equipment) flow several to a line at any width. */}
        <div className="admin-form-grid admin-form-grid--tight">
          {values.map((v, i) => (
            <div key={i} className="admin-field-inline admin-col-4 flex gap-2">
              <input
                className="admin-input"
                value={v}
                aria-label={`${label} ${i + 1}`}
                placeholder={placeholder}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = e.target.value;
                  onChange(next);
                }}
              />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="admin-col-full">
            <button
              type="button"
              onClick={() => onChange([...values, ""])}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Plus size={14} /> Add item
            </button>
          </div>
        </div>
      </Field>
    );
  }
  return (
    <Field label={label} hint={hint} span={span}>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="admin-input"
              value={v}
              aria-label={`${label} ${i + 1}`}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={14} /> Add item
        </button>
      </div>
    </Field>
  );
}

interface AccordionProps {
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Accordion({
  title,
  defaultOpen = false,
  children,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="admin-card mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left font-semibold text-[var(--admin-text)]"
      >
        {title}
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && (
        <div className="mt-4 border-t border-[var(--admin-border-subtle)] pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  /** Hide the URL text field — show only the upload button + preview */
  hideUrlField?: boolean;
  /**
   * Ratio preset for this field, matching the frame it renders into on the
   * public page, e.g. "hero" on a banner field. Fixed per field — editors do
   * not pick it. Omitted = "auto" (cap width, keep the source shape).
   */
  ratio?: RatioType;
  span?: FieldSpan;
}

/** Dimensions + ratio shown under the preview once they are known. */
type PreviewMeta = {
  width?: number;
  height?: number;
  aspectRatio: string;
  ratioType: RatioType;
  /** Absent while an upload is still pending — the processed size isn't known yet. */
  fileSize?: number;
  /** The source was smaller than the ratio's target, so it is stored smaller. */
  belowTarget?: boolean;
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Natural dimensions of a picked file, for pending previews. */
function readNaturalSize(
  objectUrl: string,
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = objectUrl;
  });
}

/**
 * Upload, replace and remove for one image value, shared by the image field
 * and the gallery tile so both follow the same deferred-upload contract.
 * `fileInput` must be rendered; `pick()` opens it.
 */
function useImageUpload(
  value: string,
  onChange: (url: string) => void,
  ratioType: RatioType,
) {
  const deferred = useDeferredUploadsOptional();
  const [uploading, setUploading] = useState(false);
  const [imgError, onImgError] = useImageError(value);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PreviewMeta | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const rule = IMAGE_RATIOS[ratioType];

  // A value arriving from outside (loaded record, or cleared) has no metadata
  // we can trust, so drop any badge from a previous upload in this session.
  useEffect(() => {
    if (!value) setMeta(null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationMsg = validateImageFile(file);
    if (validationMsg) {
      setUploadError(validationMsg);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploadError(null);

    if (deferred) {
      const id = Math.random().toString(36).slice(2);
      const placeholder = `pending:img:${id}`;
      const previewUrl = URL.createObjectURL(file);
      if (value.startsWith("pending:")) deferred.cancel(value);
      deferred.register(placeholder, {
        file,
        previewUrl,
        endpoint: "images",
        ratioType,
      });
      onChange(placeholder);

      // The output size follows from the file's own size, so it can be shown
      // — and a too-small file flagged — before the upload happens.
      const natural = await readNaturalSize(previewUrl);
      const out = natural
        ? ratioOutputSize(rule, natural.width, natural.height)
        : rule.height !== null
          ? { width: rule.width, height: rule.height }
          : undefined;
      setMeta({
        width: out?.width,
        height: out?.height,
        aspectRatio: rule.ratio,
        ratioType,
        belowTarget:
          !!natural && belowRatioTarget(rule, natural.width, natural.height),
      });
    } else {
      setUploading(true);
      setUploadError(null);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("ratioType", ratioType);
      const r = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: fd,
      });
      if (r.ok) {
        const data = (await r.json()) as Record<string, unknown>;
        onChange((data.url as string) || (data.storage_key as string));
        const width = data.width as number | undefined;
        const height = data.height as number | undefined;
        setMeta({
          width,
          height,
          aspectRatio: (data.aspect_ratio as string) ?? rule.ratio,
          ratioType: ((data.ratio_type as RatioType) ?? ratioType) as RatioType,
          fileSize: data.file_size as number | undefined,
          // A "cover" output only falls short of the target when its source did.
          belowTarget:
            width !== undefined &&
            height !== undefined &&
            belowRatioTarget(rule, width, height),
        });
      } else if (r.status === 413) {
        setUploadError(PAYLOAD_TOO_LARGE_MSG);
      } else {
        const body = (await r.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        const detail = Array.isArray(body.details)
          ? (body.details as Array<{ message: string }>)[0]?.message
          : undefined;
        setUploadError(
          detail ??
            (body.message as string) ??
            (body.error as string) ??
            "Upload failed",
        );
      }
      setUploading(false);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  /** Forget a picked-but-unsaved file, so its object URL is released. */
  const cancelPending = () => {
    if (value.startsWith("pending:") && deferred) deferred.cancel(value);
    setMeta(null);
  };

  const getPreviewUrl = (key: string): string => {
    if (!key) return "";
    if (deferred && key.startsWith("pending:"))
      return deferred.getPreview(key) ?? "";
    if (key.startsWith("http://") || key.startsWith("https://")) return key;
    const publicUrl = publicAssetBaseUrl();
    if (publicUrl) return `${publicUrl}/${key}`;
    return `/api/admin/images/serve/${key}`;
  };

  return {
    rule,
    meta,
    uploading,
    uploadError,
    imgError,
    onImgError,
    isPending: !!deferred && value.startsWith("pending:"),
    // A pending key whose object URL is already gone (flushed, or cancelled
    // from elsewhere) resolves to "". Passing that to `src` makes the browser
    // re-request the current page, so it counts as "no preview".
    previewUrl: getPreviewUrl(value),
    fit:
      rule.fit === "contain" || rule.height === null
        ? "object-contain"
        : "object-cover",
    cancelPending,
    remove: () => {
      cancelPending();
      onChange("");
    },
    pick: () => fileRef.current?.click(),
    fileInput: (
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    ),
  };
}

/**
 * Preview frame per ratio, sized by height: by width, a portrait headshot ran
 * to 256px tall and a banner left no room beside it for the controls. The
 * aspect still mirrors how the public site renders the ratio.
 */
const PREVIEW_FRAME: Record<RatioType, string> = {
  auto: "h-28 w-44",
  hero: "h-24 aspect-video",
  card: "h-28 aspect-[4/3]",
  square: "h-28 aspect-square",
  portrait: "h-32 aspect-[3/4]",
};

function UploadError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="flex items-start gap-1 text-xs text-[var(--admin-danger)]">
      <AlertCircle size={12} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function ImageUploadInput({
  label,
  value,
  onChange,
  hint,
  hideUrlField,
  ratio = "auto",
  span,
}: ImageUploadInputProps) {
  const up = useImageUpload(value, onChange, ratio);
  const { rule, meta } = up;

  const uploadButton = (
    <button
      type="button"
      onClick={up.pick}
      disabled={up.uploading}
      className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
    >
      {up.uploading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Upload size={14} />
      )}
      {up.uploading
        ? "Uploading…"
        : hideUrlField
          ? value
            ? "Replace Image"
            : "Upload Image"
          : "Upload"}
    </button>
  );

  return (
    <Field label={label} hint={hint} span={span}>
      {up.fileInput}
      {/* Preview beside the controls rather than above them — stacked, a single
          image field ran to ~320px of vertical space on its own. */}
      <div className="flex flex-wrap items-start gap-3">
        {value && (
          <div className="max-w-[11rem] shrink-0 space-y-1">
            <div
              className={`relative overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-sunken)] ${PREVIEW_FRAME[ratio]}`}
            >
              {up.imgError || !up.previewUrl ? (
                <span className="flex h-full w-full items-center justify-center text-xs text-[var(--admin-text-faint)]">
                  No preview
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- a deferred upload's preview is a local blob: URL, which /_next/image cannot fetch or optimize.
                <img
                  src={up.previewUrl}
                  alt=""
                  className={`h-full w-full ${up.fit}`}
                  onError={up.onImgError}
                />
              )}
              {up.isPending && (
                <span className="absolute bottom-1 left-1 rounded bg-[var(--admin-draft)] px-1 py-0.5 text-[10px] font-semibold text-[var(--admin-text-inverse)]">
                  Pending
                </span>
              )}
              <button
                type="button"
                onClick={up.remove}
                className="admin-btn admin-btn-danger admin-btn-sm absolute top-1 right-1"
                style={{ padding: "0.2rem 0.4rem" }}
                title="Remove image"
                aria-label="Remove image"
              >
                <Trash2 size={12} />
              </button>
            </div>
            {meta && (
              <p className="text-[11px] leading-tight text-[var(--admin-text-muted)]">
                {meta.width && meta.height ? (
                  <span className="font-medium text-[var(--admin-text-secondary)]">
                    {meta.width} × {meta.height}
                  </span>
                ) : null}
                <span className="block">
                  {meta.aspectRatio} · {IMAGE_RATIOS[meta.ratioType].label}
                </span>
                {meta.fileSize !== undefined && (
                  <span className="block">{formatBytes(meta.fileSize)}</span>
                )}
              </p>
            )}
          </div>
        )}

        <div className="min-w-[12rem] flex-1 space-y-2">
          {!hideUrlField && (
            <div className="flex gap-2">
              <input
                className="admin-input min-w-0 flex-1"
                value={up.isPending ? "" : value}
                readOnly={up.isPending}
                onChange={(e) => onChange(e.target.value)}
                aria-label={label ? `${label} URL` : "Image URL"}
                placeholder={
                  up.isPending
                    ? "Pending upload — save to confirm"
                    : "Paste URL or upload a file"
                }
              />
              {uploadButton}
            </div>
          )}

          {hideUrlField && uploadButton}

          <p className="text-[11px] leading-tight text-[var(--admin-text-muted)]">
            {rule.hint}
            {meta?.belowTarget && (
              <span className="block text-[var(--admin-warning)]">
                Smaller than {rule.width}×{rule.height}px — it may look soft on
                the page.
              </span>
            )}
          </p>

          <UploadError message={up.uploadError} />
        </div>
      </div>
    </Field>
  );
}

/**
 * One photo of a gallery: a thumbnail with Replace under it and a remove
 * control on it. Every photo shares the gallery's crop, so a tile carries no
 * hint text of its own — that is what made a twelve-photo gallery a
 * twelve-screen form. With an empty `value` and no `onRemove` it is the
 * gallery's "add a photo" tile.
 */
export function ImageTile({
  label,
  value,
  onChange,
  onRemove,
  onMoveEarlier,
  onMoveLater,
  ratio = "auto",
}: {
  /** Accessible name, e.g. "Photo 3". */
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Drops the photo's slot. Omit for the add tile. */
  onRemove?: () => void;
  /** Reorder arrows, drawn on the thumbnail's bottom corners when given. */
  onMoveEarlier?: () => void;
  onMoveLater?: () => void;
  ratio?: RatioType;
}) {
  const up = useImageUpload(value, onChange, ratio);
  return (
    <div className="space-y-1">
      {up.fileInput}
      {value ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-sunken)]">
          {up.imgError || !up.previewUrl ? (
            <span className="flex h-full w-full items-center justify-center text-xs text-[var(--admin-text-faint)]">
              No preview
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- a deferred upload's preview is a local blob: URL, which /_next/image cannot fetch or optimize.
            <img
              src={up.previewUrl}
              alt=""
              className={`h-full w-full ${up.fit}`}
              onError={up.onImgError}
            />
          )}
          {up.isPending && (
            <span className="absolute top-1 left-1 rounded bg-[var(--admin-draft)] px-1 py-0.5 text-[10px] font-semibold text-[var(--admin-text-inverse)]">
              Pending
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={() => {
                up.cancelPending();
                onRemove();
              }}
              className="admin-btn admin-btn-danger admin-btn-sm absolute top-1 right-1"
              style={{ padding: "0.2rem 0.4rem" }}
              aria-label={`Remove ${label}`}
              title="Remove"
            >
              <Trash2 size={12} />
            </button>
          )}
          {/* Order matters where a lightbox pages through the photos. */}
          {onMoveEarlier && (
            <button
              type="button"
              onClick={onMoveEarlier}
              className="admin-btn admin-btn-outline admin-btn-sm absolute bottom-1 left-1"
              style={{ padding: "0.2rem 0.3rem" }}
              aria-label={`Move ${label} earlier`}
              title="Move earlier"
            >
              <ChevronLeft size={13} />
            </button>
          )}
          {onMoveLater && (
            <button
              type="button"
              onClick={onMoveLater}
              className="admin-btn admin-btn-outline admin-btn-sm absolute right-1 bottom-1"
              style={{ padding: "0.2rem 0.3rem" }}
              aria-label={`Move ${label} later`}
              title="Move later"
            >
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={up.pick}
          disabled={up.uploading}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--admin-border-control)] bg-[var(--admin-raised)] text-xs font-medium text-[var(--admin-text-secondary)] hover:bg-[var(--admin-hover)]"
          aria-label={`Upload ${label}`}
        >
          {up.uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : onRemove ? (
            <Upload size={16} />
          ) : (
            <Plus size={16} />
          )}
          {up.uploading ? "Uploading…" : onRemove ? "Upload" : "Add photo"}
        </button>
      )}
      {value && (
        <button
          type="button"
          onClick={up.pick}
          disabled={up.uploading}
          className="admin-btn admin-btn-ghost admin-btn-sm w-full justify-center"
          aria-label={`Replace ${label}`}
        >
          {up.uploading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Upload size={13} />
          )}
          {up.uploading ? "Uploading…" : "Replace"}
        </button>
      )}
      <UploadError message={up.uploadError} />
    </div>
  );
}

/**
 * A list of photos as a grid of thumbnails, ending in an "Add photo" tile.
 * Several to a line at any width; every photo is cropped to `ratio`.
 */
export function ImageGallery({
  label,
  hint,
  value,
  onChange,
  max = 12,
  ratio = "auto",
  span,
  reorderable,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  /** Crop for every photo, matching the frame they render into. */
  ratio?: RatioType;
  span?: FieldSpan;
  /** Earlier/later arrows on each photo, for a gallery whose order shows. */
  reorderable?: boolean;
}) {
  const list = Array.isArray(value) ? value : [];
  const move = (from: number, to: number) => {
    const next = [...list];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };
  return (
    <div className={`mb-4 ${colClass(span)}`.trim()}>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        {label && <span className="admin-label mb-0">{label}</span>}
        <span className="text-xs text-[var(--admin-text-faint)] tabular-nums">
          {list.length} / {max}
        </span>
      </div>
      {hint && <p className="admin-help mb-2">{hint}</p>}
      <div className="admin-tile-grid">
        {list.map((src, j) => (
          <ImageTile
            key={j}
            label={`photo ${j + 1}`}
            value={src}
            ratio={ratio}
            // Clearing a photo drops its slot rather than leaving a gap.
            onChange={(v) =>
              onChange(
                v
                  ? list.map((x, k) => (k === j ? v : x))
                  : list.filter((_, k) => k !== j),
              )
            }
            onRemove={() => onChange(list.filter((_, k) => k !== j))}
            onMoveEarlier={
              reorderable && j > 0 ? () => move(j, j - 1) : undefined
            }
            onMoveLater={
              reorderable && j < list.length - 1
                ? () => move(j, j + 1)
                : undefined
            }
          />
        ))}
        {list.length < max && (
          <ImageTile
            label="a new photo"
            value=""
            ratio={ratio}
            onChange={(v) => v && onChange([...list, v])}
          />
        )}
      </div>
    </div>
  );
}

interface TextAreaListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
  span?: FieldSpan;
}

export function TextAreaList({
  label,
  values,
  onChange,
  placeholder,
  rows = 3,
  hint,
  span,
}: TextAreaListProps) {
  return (
    <Field label={label} hint={hint} span={span}>
      {/* Paragraphs sit two-up: they are short enough that one per row wasted
          the right half of the form and pushed the "Add" button off-screen. */}
      <div className="admin-form-grid admin-form-grid--tight">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              className="admin-textarea flex-1"
              rows={rows}
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="admin-btn admin-btn-danger admin-btn-sm mt-1 shrink-0"
              aria-label="Remove paragraph"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div className="admin-col-full">
          <button
            type="button"
            onClick={() => onChange([...values, ""])}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={14} /> Add paragraph
          </button>
        </div>
      </div>
    </Field>
  );
}

interface DocumentUploadInputProps {
  label: string;
  value: string;
  onChange: (key: string) => void;
  hint?: string;
  span?: FieldSpan;
}

export function DocumentUploadInput({
  label,
  value,
  onChange,
  hint,
  span,
}: DocumentUploadInputProps) {
  const deferred = useDeferredUploadsOptional();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingFilename, setPendingFilename] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationMsg = validateDocumentFile(file);
    if (validationMsg) {
      setUploadError(validationMsg);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploadError(null);

    if (deferred) {
      const id = Math.random().toString(36).slice(2);
      const placeholder = `pending:doc:${id}`;
      const previewUrl = URL.createObjectURL(file);
      if (value.startsWith("pending:")) deferred.cancel(value);
      deferred.register(placeholder, {
        file,
        previewUrl,
        endpoint: "documents",
      });
      setPendingFilename(file.name);
      onChange(placeholder);
    } else {
      setUploading(true);
      setUploadError(null);
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/documents/upload", {
        method: "POST",
        body: fd,
      });
      if (r.ok) {
        const data = (await r.json()) as Record<string, string>;
        onChange(data.storage_key ?? data.url ?? "");
      } else if (r.status === 413) {
        setUploadError(PAYLOAD_TOO_LARGE_MSG);
      } else {
        const body = (await r.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        setUploadError(
          (body.message as string) ?? (body.error as string) ?? "Upload failed",
        );
      }
      setUploading(false);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = () => {
    if (value.startsWith("pending:") && deferred) {
      deferred.cancel(value);
      setPendingFilename("");
    }
    onChange("");
  };

  const isPending = deferred && value.startsWith("pending:");
  const displayName = isPending
    ? pendingFilename
    : value
      ? (value.split("/").pop() ?? value)
      : "";

  return (
    <Field label={label} hint={hint} span={span}>
      <div className="flex flex-wrap items-center gap-2">
        {value && (
          <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-sunken)] px-3 py-2">
            <span className="flex-1 truncate text-sm text-[var(--admin-text-secondary)]">
              {displayName || value}
            </span>
            {isPending && (
              <span className="shrink-0 rounded bg-[var(--admin-draft)] px-1 py-0.5 text-[10px] font-semibold text-[var(--admin-text-inverse)]">
                Pending
              </span>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
              title="Remove document"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileRef}
          accept={DOC_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading
            ? "Uploading…"
            : value
              ? "Replace document"
              : "Upload document"}
        </button>
        {uploadError && (
          <p className="mt-1 flex w-full items-start gap-1 text-xs text-[var(--admin-danger)]">
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            <span>{uploadError}</span>
          </p>
        )}
      </div>
    </Field>
  );
}

// ── ItemsEditor — generic array-of-objects editor ───────────────────────────

export type FieldDef = {
  key: string;
  label: string;
  /**
   * "image" swaps the plain input for an ImageUploadInput (storage-backed);
   * "images" is a list of them (the value is a string array).
   */
  type?: "text" | "textarea" | "number" | "image" | "images";
  /** @deprecated use `span` — kept so existing call sites keep compiling. */
  span2?: boolean;
  /** Columns of the 12-column row this field takes. Defaults to half a row. */
  span?: FieldSpan;
  placeholder?: string;
  /** Upload preset for `type: "image"` fields. Defaults to "auto". */
  ratio?: RatioType;
  /** Rows for `type: "textarea"`. Defaults to 2. */
  rows?: number;
  /** Most photos for `type: "images"`. Defaults to 12. */
  max?: number;
};

/**
 * One entry of a repeated list: a bordered card with its remove control in the
 * top-right corner, level with the first row of labels. The button comes after
 * the fields in the DOM so Tab reaches the fields first.
 */
export function ItemCard({
  onRemove,
  removeLabel = "Remove",
  span,
  className = "",
  children,
}: {
  onRemove?: () => void;
  /** Accessible name of the remove button, e.g. "Remove stat 2". */
  removeLabel?: string;
  /** Width of the card on a parent FormGrid row. */
  span?: FieldSpan;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`admin-item-card ${colClass(span)} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="admin-item-remove"
          aria-label={removeLabel}
          title={removeLabel}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export type RowColumn = {
  key: string;
  label: string;
  /** Share of the line relative to the other columns. Defaults to 1. */
  weight?: number;
  type?: "text" | "number" | "checkbox";
  placeholder?: string;
  maxLength?: number;
};

/**
 * A list whose entries are a few short values, edited as a small table: the
 * column labels once on top, then one line per entry with its delete button
 * at the end. A stat, a quick fact or a phone number is one line here rather
 * than a card of stacked fields; on a container too narrow for the columns
 * each line falls back to a card with its own labels (admin.css).
 */
export function RowsEditor({
  items,
  onChange,
  columns,
  newItem,
  addLabel = "Add row",
  max,
}: {
  items: Record<string, unknown>[];
  onChange: (next: Record<string, unknown>[]) => void;
  columns: RowColumn[];
  newItem: () => Record<string, unknown>;
  addLabel?: string;
  /** Most entries allowed: Add disables there and the count is shown. */
  max?: number;
}) {
  const baseId = useId();
  const atMax = max !== undefined && items.length >= max;
  const set = (i: number, key: string, val: unknown) =>
    onChange(items.map((it, j) => (j === i ? { ...it, [key]: val } : it)));
  // Checkboxes take only the width of their label; the text columns share
  // the rest by weight. `data-cols` counts the text columns, which decide
  // when the line is too narrow to stay a line.
  const template = columns
    .map((c) =>
      c.type === "checkbox" ? "max-content" : `minmax(0, ${c.weight ?? 1}fr)`,
    )
    .join(" ");
  const textColumns = columns.filter((c) => c.type !== "checkbox").length;

  return (
    <div
      className="admin-rows"
      data-cols={textColumns}
      style={{ "--admin-rows-cols": template } as CSSProperties}
    >
      {items.length > 0 && (
        <div className="admin-rows-head" aria-hidden="true">
          {columns.map((c) => (
            <span key={c.key} className="truncate">
              {c.label}
            </span>
          ))}
          <span />
        </div>
      )}
      <div className="admin-rows-body">
        {items.map((item, i) => (
          <div key={i} className="admin-rows-row">
            {columns.map((c) => {
              const fieldId = `${baseId}-${i}-${c.key}`;
              if (c.type === "checkbox") {
                return (
                  <label
                    key={c.key}
                    htmlFor={fieldId}
                    className="admin-rows-cell admin-rows-check"
                  >
                    <input
                      type="checkbox"
                      id={fieldId}
                      checked={Boolean(item[c.key])}
                      onChange={(e) => set(i, c.key, e.target.checked)}
                      aria-label={`${c.label} ${i + 1}`}
                    />
                    <span className="admin-rows-label">{c.label}</span>
                  </label>
                );
              }
              return (
                <div key={c.key} className="admin-rows-cell">
                  <label htmlFor={fieldId} className="admin-rows-label">
                    {c.label}
                  </label>
                  <input
                    type={c.type === "number" ? "number" : "text"}
                    id={fieldId}
                    className="admin-input"
                    aria-label={`${c.label} ${i + 1}`}
                    value={String(item[c.key] ?? "")}
                    maxLength={c.maxLength}
                    placeholder={c.placeholder}
                    onChange={(e) =>
                      set(
                        i,
                        c.key,
                        c.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                      )
                    }
                  />
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="admin-item-remove"
              aria-label={`Remove row ${i + 1}`}
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="admin-rows-empty">Nothing added yet.</p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange([...items, newItem()])}
            disabled={atMax}
            title={atMax ? `At most ${max}` : undefined}
            className="admin-btn admin-btn-outline admin-btn-sm flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={13} /> {addLabel}
          </button>
          {max !== undefined && (
            <span
              className={`shrink-0 text-xs tabular-nums ${
                atMax
                  ? "font-medium text-[var(--admin-warning)]"
                  : "text-[var(--admin-text-faint)]"
              }`}
            >
              {items.length}/{max}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Field weight in a compact row, from its declared span. */
const rowWeight = (f: FieldDef) =>
  f.span === "full" ? 12 : (f.span ?? (f.span2 ? 12 : 6));

const isPlainField = (f: FieldDef) =>
  f.type === undefined || f.type === "text" || f.type === "number";

export function ItemsEditor({
  items,
  onChange,
  fields,
  emptyItem,
  addLabel = "Add item",
  /** Cards per row. Repeated short items (stats, links) read better in a grid. */
  cardSpan = "full",
  layout = "auto",
}: {
  items: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  fields: FieldDef[];
  emptyItem: Record<string, unknown>;
  addLabel?: string;
  cardSpan?: FieldSpan;
  /**
   * "rows" edits each entry as one line of a small table — the column labels
   * once on top, the fields side by side, delete at the end. "auto" picks it
   * for two or three plain text/number fields (a label and its value, a stat)
   * and uses one card per entry otherwise.
   */
  layout?: "auto" | "rows" | "cards";
}) {
  const baseId = useId();
  const upd = (i: number, key: string, val: unknown) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const rem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const read = (item: Record<string, unknown>, f: FieldDef) =>
    String(item[f.key] ?? "");
  const write = (i: number, f: FieldDef, raw: string) =>
    upd(i, f.key, f.type === "number" ? Number(raw) : raw);

  const addButton = (
    <button
      type="button"
      onClick={() => onChange([...items, { ...emptyItem }])}
      className="admin-btn admin-btn-outline admin-btn-sm w-full justify-center"
    >
      <Plus size={13} /> {addLabel}
    </button>
  );

  // A text area or an upload cannot sit in a one-line row, whatever is asked.
  const rows =
    fields.every(isPlainField) &&
    (layout === "rows" ||
      (layout === "auto" && fields.length >= 2 && fields.length <= 3));

  if (rows) {
    return (
      <RowsEditor
        items={items}
        onChange={onChange}
        newItem={() => ({ ...emptyItem })}
        addLabel={addLabel}
        columns={fields.map((f) => ({
          key: f.key,
          label: f.label,
          placeholder: f.placeholder,
          type: f.type === "number" ? "number" : "text",
          weight: rowWeight(f),
        }))}
      />
    );
  }

  return (
    <div className="admin-form-grid admin-form-grid--tight">
      {items.map((item, i) => (
        <ItemCard
          key={i}
          span={cardSpan}
          onRemove={() => rem(i)}
          removeLabel={`Remove item ${i + 1}`}
        >
          <div className="admin-form-grid admin-form-grid--tight">
            {fields.map((f) => {
              const fieldId = `${baseId}-${i}-${f.key}`;
              const span = f.span ?? (f.span2 ? "full" : undefined);
              // A photo list brings its own label, count and tiles.
              if (f.type === "images") {
                const list = Array.isArray(item[f.key])
                  ? (item[f.key] as string[])
                  : [];
                return (
                  <ImageGallery
                    key={f.key}
                    span={span}
                    label={f.label}
                    hint={f.placeholder}
                    value={list}
                    max={f.max ?? 12}
                    ratio={f.ratio}
                    onChange={(v) => upd(i, f.key, v)}
                  />
                );
              }
              // ImageUploadInput brings its own label + preview, so it replaces
              // the row entirely rather than sitting under a bare <label>.
              if (f.type === "image") {
                return (
                  <ImageUploadInput
                    key={f.key}
                    span={span}
                    label={f.label}
                    value={read(item, f)}
                    onChange={(v) => upd(i, f.key, v)}
                    hint={f.placeholder}
                    ratio={f.ratio}
                    hideUrlField
                  />
                );
              }
              return (
                <div
                  key={f.key}
                  className={`${colClass(span)} ${
                    f.type === "textarea" ? "" : "admin-field-inline"
                  }`.trim()}
                >
                  <label className="admin-label" htmlFor={fieldId}>
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={fieldId}
                      className="admin-textarea"
                      rows={f.rows ?? 2}
                      value={read(item, f)}
                      onChange={(e) => upd(i, f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      id={fieldId}
                      className="admin-input"
                      value={read(item, f)}
                      onChange={(e) => write(i, f, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ItemCard>
      ))}
      <div className="admin-col-full">{addButton}</div>
    </div>
  );
}

// ── LabsEditor ───────────────────────────────────────────────────────────────

export type LabItem = {
  name: string;
  description: string;
  equipment: string[];
  /** Optional — see CARD_EXTRA_FIELDS in ProgramContentEditor. */
  images?: string[];
  details?: string;
};

export function LabsEditor({
  labs,
  onChange,
}: {
  labs: LabItem[];
  onChange: (v: LabItem[]) => void;
}) {
  const upd = (i: number, key: string, val: unknown) =>
    onChange(labs.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));
  const rem = (i: number) => onChange(labs.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([...labs, { name: "", description: "", equipment: [] }]);

  return (
    <div className="space-y-3">
      {labs.map((lab, i) => (
        <ItemCard
          key={i}
          onRemove={() => rem(i)}
          removeLabel={`Remove lab ${i + 1}`}
        >
          <FormGrid tight>
            <TextInput
              label="Lab Name"
              span={4}
              value={lab.name}
              onChange={(e) => upd(i, "name", e.target.value)}
            />
            <TextArea
              label="Description"
              span={8}
              value={lab.description}
              onChange={(e) => upd(i, "description", e.target.value)}
              rows={2}
            />
            <StringList
              label="Equipment"
              span="full"
              columns
              values={lab.equipment ?? []}
              onChange={(v) => upd(i, "equipment", v)}
              placeholder="Equipment / software…"
            />
            <ImageGallery
              label="Photos (optional)"
              span="full"
              hint="The first photo shows on the card; visitors click the card to see them all."
              value={lab.images ?? []}
              max={12}
              onChange={(v) => upd(i, "images", v)}
            />
            <TextArea
              label="More details (optional)"
              span="full"
              value={lab.details ?? ""}
              onChange={(e) => upd(i, "details", e.target.value)}
              rows={4}
              hint="Longer text shown in the popup when a visitor clicks the card."
            />
          </FormGrid>
        </ItemCard>
      ))}
      <button
        type="button"
        onClick={add}
        className="admin-btn admin-btn-outline admin-btn-sm mt-1 w-full justify-center"
      >
        <Plus size={13} /> Add Lab
      </button>
    </div>
  );
}

interface RepeaterProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  onItemRemove?: (item: T) => void;
  newItem: () => T;
  renderItem: (
    item: T,
    index: number,
    onChange: (item: T) => void,
  ) => ReactNode;
  hint?: string;
  /** Width of the repeater itself inside a parent `FormGrid`. */
  span?: FieldSpan;
  /** Width of each item card on the repeater's own row. Defaults to full. */
  itemSpan?: FieldSpan;
}

export function Repeater<T>({
  label,
  items,
  onChange,
  onItemRemove,
  newItem,
  renderItem,
  hint,
  span,
  itemSpan = "full",
}: RepeaterProps<T>) {
  const handleRemove = (i: number) => {
    const removedItem = items[i];
    if (onItemRemove) onItemRemove(removedItem);
    onChange(items.filter((_, j) => j !== i));
  };

  return (
    <div className={`mb-4 ${colClass(span)}`.trim()}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="admin-label mb-0">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {hint && <p className="admin-help mb-2">{hint}</p>}
      <div className="admin-form-grid admin-form-grid--tight">
        {items.map((item, i) => (
          <ItemCard
            key={i}
            span={itemSpan}
            onRemove={() => handleRemove(i)}
            removeLabel={`Remove item ${i + 1}`}
          >
            {renderItem(item, i, (updated) => {
              const next = [...items];
              next[i] = updated;
              onChange(next);
            })}
          </ItemCard>
        ))}
        {items.length === 0 && (
          <p className="admin-col-full rounded-lg border border-dashed border-[var(--admin-border)] p-4 text-center text-sm text-[var(--admin-text-faint)]">
            No items yet. Click "Add" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
