"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { parseApiError } from "@/lib/validation-helpers";

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="admin-label">
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

export function TextInput({ label, hint, ...props }: TextInputProps) {
  return (
    <Field label={label} required={props.required} hint={hint}>
      <input className="admin-input" {...props} />
    </Field>
  );
}

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function NumberInput({ label, hint, ...props }: NumberInputProps) {
  return (
    <Field label={label} required={props.required} hint={hint}>
      <input type="number" className="admin-input" {...props} />
    </Field>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextArea({ label, hint, ...props }: TextAreaProps) {
  return (
    <Field label={label} required={props.required} hint={hint}>
      <textarea className="admin-textarea" {...props} />
    </Field>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, hint, options, ...props }: SelectProps) {
  return (
    <Field label={label} required={props.required} hint={hint}>
      <select className="admin-select" {...props}>
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
  uploadOnly?: boolean;
}

export function ImageUploadInput({
  label,
  value,
  onChange,
  hint,
  uploadOnly,
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [value]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "other");
    fd.append("institution", "all");
    const r = await fetch("/api/admin/images/upload", {
      method: "POST",
      body: fd,
    });
    if (r.ok) {
      const data = await r.json();
      // Store only the storage key/relative path
      onChange(data.url || data.storage_key);
    } else {
      const err = await parseApiError(r);
      const detailMsg = err?.details?.[0]?.message;
      setUploadError(
        detailMsg ?? err?.message ?? err?.error ?? "Upload failed",
      );
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Helper to get full URL for preview
  const getPreviewUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl}/${url}`;
    }
    return `/api/admin/images/serve/${url}`;
  };

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {value && (
          <div className="relative h-28 w-48 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {imgError ? (
              <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                No preview
              </span>
            ) : (
              <img
                src={getPreviewUrl(value)}
                alt=""
                className="h-full w-full object-contain"
                onError={() => setImgError(true)}
              />
            )}
            {uploadOnly && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="admin-btn admin-btn-danger admin-btn-sm absolute top-1 right-1"
                style={{ padding: "0.2rem 0.4rem" }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        {uploadOnly ? (
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
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste URL or upload a file"
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
  onChange: (url: string) => void;
  hint?: string;
}

export function DocumentUploadInput({
  label,
  value,
  onChange,
  hint,
}: DocumentUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/documents/upload", {
      method: "POST",
      body: fd,
    });
    if (r.ok) {
      const data = await r.json();
      onChange(data.url);
      setFilename(data.filename ?? file.name);
    } else {
      const err = await parseApiError(r);
      setUploadError(err?.message ?? err?.error ?? "Upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const displayName = filename || (value ? value.split("/").pop() : "");

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {value && (
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <span className="flex-1 truncate text-sm text-gray-700">
              {displayName || value}
            </span>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setFilename("");
              }}
              className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
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
          onChange={handleUpload}
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
            {fields.map((f) => (
              <div key={f.key} className={f.span2 ? "col-span-2" : ""}>
                <label className="admin-label">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={String(item[f.key] ?? "")}
                    onChange={(e) => upd(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
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
            ))}
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
  newItem,
  renderItem,
}: RepeaterProps<T>) {
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
              onClick={() => onChange(items.filter((_, j) => j !== i))}
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
