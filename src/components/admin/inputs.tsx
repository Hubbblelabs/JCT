"use client";

import { useState, useRef, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Upload, Loader2 } from "lucide-react";

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

export function StringList({ label, values, onChange, placeholder }: StringListProps) {
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
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
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
      {open && <div className="mt-4 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageUploadInput({ label, value, onChange, hint }: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "other");
    fd.append("institution", "all");
    const r = await fetch("/api/admin/images/upload", { method: "POST", body: fd });
    if (r.ok) {
      const data = await r.json();
      onChange(data.url);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {value && (
          <div className="h-16 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-1">
            <img src={value} alt="" className="h-full w-full object-contain" />
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="admin-input flex-1 min-w-0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter URL or upload file"
          />
          <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="admin-btn admin-btn-outline admin-btn-sm shrink-0"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "…" : "Upload"}
          </button>
        </div>
      </div>
    </Field>
  );
}

interface RepeaterProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, index: number, onChange: (item: T) => void) => ReactNode;
}

export function Repeater<T>({ label, items, onChange, newItem, renderItem }: RepeaterProps<T>) {
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
          <div key={i} className="relative rounded-lg border border-gray-200 p-3">
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
