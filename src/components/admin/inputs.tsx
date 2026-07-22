"use client";

import { useState, useRef, useEffect, useId, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDeferredUploadsOptional } from "@/lib/deferred-uploads";
import {
  ALLOWED_MIME_TYPES,
  MAX_DIRECT_UPLOAD_SIZE,
  IMAGE_RATIOS,
  RATIO_TYPES,
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

function validateDocumentFile(file: File): string | null {
  if (file.type !== "application/pdf")
    return `Invalid file type${file.type ? ` "${file.type}"` : ""}. Only PDF files are accepted.`;
  if (file.size > DOC_MAX_FILE_SIZE)
    return `File too large (${asMb(file.size)} MB). Max is ${DOC_MAX_FILE_SIZE / 1024 / 1024} MB.`;
  return null;
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  /** Associates the label with its control for a11y (screen readers + click-to-focus). */
  htmlFor?: string;
  children: ReactNode;
}

export function Field({
  label,
  required,
  hint,
  htmlFor,
  children,
}: FieldProps) {
  return (
    <div className="mb-4">
      <label className="admin-label" htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextInput({ label, hint, id, ...props }: TextInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
    >
      <input id={fieldId} className="admin-input" {...props} />
    </Field>
  );
}

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function NumberInput({ label, hint, id, ...props }: NumberInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
    >
      <input type="number" id={fieldId} className="admin-input" {...props} />
    </Field>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextArea({ label, hint, id, ...props }: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
    >
      <textarea id={fieldId} className="admin-textarea" {...props} />
    </Field>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, hint, options, id, ...props }: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field
      label={label}
      required={props.required}
      hint={hint}
      htmlFor={fieldId}
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
}

export function StringList({
  label,
  values,
  onChange,
  placeholder,
}: StringListProps) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="admin-input"
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
              className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
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
        className="flex w-full items-center justify-between text-left font-semibold text-gray-800"
      >
        {title}
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && (
        <div className="mt-4 border-t border-gray-100 pt-4">{children}</div>
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
   * Default ratio preset for this field, e.g. "hero" on a banner field. The
   * editor can still change it per upload. Omitted = "auto", which preserves
   * the pre-ratio behaviour (cap width, keep the source shape).
   */
  ratio?: RatioType;
}

/** Dimensions + ratio shown under the preview once they are known. */
type PreviewMeta = {
  width?: number;
  height?: number;
  aspectRatio: string;
  ratioType: RatioType;
  /** Absent while an upload is still pending — the processed size isn't known yet. */
  fileSize?: number;
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Natural dimensions of a picked file, for "auto" pending previews. */
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

export function ImageUploadInput({
  label,
  value,
  onChange,
  hint,
  hideUrlField,
  ratio = "auto",
}: ImageUploadInputProps) {
  const deferred = useDeferredUploadsOptional();
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [ratioType, setRatioType] = useState<RatioType>(ratio);
  const [meta, setMeta] = useState<PreviewMeta | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const selectId = useId();

  const rule = IMAGE_RATIOS[ratioType];

  useEffect(() => {
    setImgError(false);
  }, [value]);

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

      // A fixed ratio resizes to known dimensions, so they can be shown before
      // the upload happens. "auto" keeps the source shape — read it off the file.
      if (rule.height !== null) {
        setMeta({
          width: rule.width,
          height: rule.height,
          aspectRatio: rule.ratio,
          ratioType,
        });
      } else {
        const natural = await readNaturalSize(previewUrl);
        setMeta({
          width: natural?.width,
          height: natural?.height,
          aspectRatio: rule.ratio,
          ratioType,
        });
      }
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
        setMeta({
          width: data.width as number | undefined,
          height: data.height as number | undefined,
          aspectRatio: (data.aspect_ratio as string) ?? rule.ratio,
          ratioType: ((data.ratio_type as RatioType) ?? ratioType) as RatioType,
          fileSize: data.file_size as number | undefined,
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

  const handleRemove = () => {
    if (value.startsWith("pending:") && deferred) deferred.cancel(value);
    setMeta(null);
    onChange("");
  };

  const getPreviewUrl = (key: string): string => {
    if (!key) return "";
    if (deferred && key.startsWith("pending:"))
      return deferred.getPreview(key) ?? "";
    if (key.startsWith("http://") || key.startsWith("https://")) return key;
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (publicUrl) return `${publicUrl}/${key}`;
    return `/api/admin/images/serve/${key}`;
  };

  const isPending = deferred && value.startsWith("pending:");
  // The preview frame mirrors how the public site renders this ratio, so what
  // the editor sees here is what ships.
  const previewFrame = rule.aspectClass
    ? `w-48 ${rule.aspectClass}`
    : "h-28 w-48";
  const previewFit =
    rule.fit === "contain" || rule.height === null
      ? "object-contain"
      : "object-cover";
  const staleRatio = meta !== null && meta.ratioType !== ratioType;

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {value && (
          <div className="space-y-1">
            <div
              className={`relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${previewFrame}`}
            >
              {imgError ? (
                <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No preview
                </span>
              ) : (
                <img
                  src={getPreviewUrl(value)}
                  alt=""
                  className={`h-full w-full ${previewFit}`}
                  onError={() => setImgError(true)}
                />
              )}
              {isPending && (
                <span className="absolute bottom-1 left-1 rounded bg-amber-500 px-1 py-0.5 text-[10px] font-semibold text-white">
                  Pending
                </span>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="admin-btn admin-btn-danger admin-btn-sm absolute top-1 right-1"
                style={{ padding: "0.2rem 0.4rem" }}
                title="Remove image"
              >
                <Trash2 size={12} />
              </button>
            </div>
            {meta && (
              <p className="w-48 text-[11px] leading-tight text-gray-500">
                {meta.width && meta.height ? (
                  <span className="font-medium text-gray-700">
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

        <div>
          <label
            htmlFor={selectId}
            className="mb-1 block text-[11px] font-medium text-gray-600"
          >
            Image ratio
          </label>
          <select
            id={selectId}
            className="admin-select"
            value={ratioType}
            onChange={(e) => setRatioType(e.target.value as RatioType)}
          >
            {RATIO_TYPES.map((key) => {
              const r = IMAGE_RATIOS[key];
              return (
                <option key={key} value={key}>
                  {r.label}
                  {r.height === null
                    ? " — original shape"
                    : ` — ${r.ratio} (${r.width}×${r.height})`}
                </option>
              );
            })}
          </select>
          <p className="mt-1 text-[11px] leading-tight text-gray-500">
            <span className="font-medium text-gray-700">Selected:</span>{" "}
            {rule.label}
            {rule.height !== null && (
              <>
                {" · "}
                <span className="font-medium text-gray-700">
                  Required:
                </span>{" "}
                {rule.ratio} — at least {rule.width}×{rule.height}px
              </>
            )}
            <span className="block">{rule.hint}</span>
            {staleRatio && (
              <span className="block text-amber-700">
                Ratio changed — re-upload to apply it to this image.
              </span>
            )}
          </p>
        </div>

        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {hideUrlField ? (
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
                ? "Replace Image"
                : "Upload Image"}
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              className="admin-input min-w-0 flex-1"
              value={isPending ? "" : value}
              readOnly={!!isPending}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                isPending
                  ? "Pending upload — save to confirm"
                  : "Paste URL or upload a file"
              }
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              {uploading ? "…" : "Upload"}
            </button>
          </div>
        )}
        {uploadError && (
          <p className="mt-1 flex items-start gap-1 text-xs text-red-600">
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            <span>{uploadError}</span>
          </p>
        )}
      </div>
    </Field>
  );
}

interface TextAreaListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaList({
  label,
  values,
  onChange,
  placeholder,
  rows = 3,
}: TextAreaListProps) {
  return (
    <Field label={label}>
      <div className="space-y-2">
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
          <Plus size={14} /> Add paragraph
        </button>
      </div>
    </Field>
  );
}

interface DocumentUploadInputProps {
  label: string;
  value: string;
  onChange: (key: string) => void;
  hint?: string;
}

export function DocumentUploadInput({
  label,
  value,
  onChange,
  hint,
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
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {value && (
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <span className="flex-1 truncate text-sm text-gray-700">
              {displayName || value}
            </span>
            {isPending && (
              <span className="shrink-0 rounded bg-amber-500 px-1 py-0.5 text-[10px] font-semibold text-white">
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
          accept="application/pdf"
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
          {uploading ? "Uploading…" : value ? "Replace PDF" : "Upload PDF"}
        </button>
        {uploadError && (
          <p className="mt-1 flex items-start gap-1 text-xs text-red-600">
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
  type?: "text" | "textarea" | "number";
  span2?: boolean;
  placeholder?: string;
};

export function ItemsEditor({
  items,
  onChange,
  fields,
  emptyItem,
  addLabel = "Add item",
}: {
  items: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  fields: FieldDef[];
  emptyItem: Record<string, unknown>;
  addLabel?: string;
}) {
  const baseId = useId();
  const upd = (i: number, key: string, val: unknown) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const rem = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-gray-50/50 p-3"
        >
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => {
              const fieldId = `${baseId}-${i}-${f.key}`;
              return (
                <div key={f.key} className={f.span2 ? "col-span-2" : ""}>
                  <label className="admin-label" htmlFor={fieldId}>
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={fieldId}
                      className="admin-textarea"
                      rows={2}
                      value={String(item[f.key] ?? "")}
                      onChange={(e) => upd(i, f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      id={fieldId}
                      className="admin-input"
                      value={String(item[f.key] ?? "")}
                      onChange={(e) =>
                        upd(
                          i,
                          f.key,
                          f.type === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                        )
                      }
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => rem(i)}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...emptyItem }])}
        className="admin-btn admin-btn-outline admin-btn-sm mt-1 w-full justify-center"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}

// ── LabsEditor ───────────────────────────────────────────────────────────────

export type LabItem = {
  name: string;
  description: string;
  equipment: string[];
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
        <div
          key={i}
          className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Lab Name"
              value={lab.name}
              onChange={(e) => upd(i, "name", e.target.value)}
            />
            <TextArea
              label="Description"
              value={lab.description}
              onChange={(e) => upd(i, "description", e.target.value)}
              rows={2}
            />
          </div>
          <StringList
            label="Equipment"
            values={lab.equipment ?? []}
            onChange={(v) => upd(i, "equipment", v)}
            placeholder="Equipment / software…"
          />
          <button
            type="button"
            onClick={() => rem(i)}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={12} /> Remove Lab
          </button>
        </div>
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
}

export function Repeater<T>({
  label,
  items,
  onChange,
  onItemRemove,
  newItem,
  renderItem,
}: RepeaterProps<T>) {
  const handleRemove = (i: number) => {
    const removedItem = items[i];
    if (onItemRemove) onItemRemove(removedItem);
    onChange(items.filter((_, j) => j !== i));
  };

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="admin-label mb-0">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative rounded-lg border border-gray-200 p-3"
          >
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="admin-btn admin-btn-danger admin-btn-sm absolute top-2 right-2"
            >
              <Trash2 size={13} />
            </button>
            {renderItem(item, i, (updated) => {
              const next = [...items];
              next[i] = updated;
              onChange(next);
            })}
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
            No items yet. Click "Add" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
