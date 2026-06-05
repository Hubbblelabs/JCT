"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Layers,
  Phone,
  PanelLeft,
} from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";

type Template = "standard" | "hero-content" | "sidebar" | "gallery" | "contact";
type Institution = "main" | "engineering" | "arts-science" | "polytechnic";

const TEMPLATES: {
  id: Template;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  {
    id: "standard",
    label: "Standard Content Page",
    desc: "Single column of text/image/list/cards/CTA blocks.",
    icon: FileText,
  },
  {
    id: "hero-content",
    label: "Hero + Content",
    desc: "Top hero banner with title, subtitle, CTA, plus body blocks below.",
    icon: Layers,
  },
  {
    id: "sidebar",
    label: "Sidebar Layout",
    desc: "Two-column layout with sticky sidebar navigation and content body.",
    icon: PanelLeft,
  },
  {
    id: "gallery",
    label: "Gallery",
    desc: "Image grid with optional caption and intro description.",
    icon: ImageIcon,
  },
  {
    id: "contact",
    label: "Contact / Information",
    desc: "Phone, email, address, and embedded map.",
    icon: Phone,
  },
];

const INSTITUTIONS: { value: Institution; label: string }[] = [
  { value: "main", label: "Main site (/p/<slug>)" },
  {
    value: "engineering",
    label: "Engineering (/institutions/engineering/p/<slug>)",
  },
  {
    value: "arts-science",
    label: "Arts & Science (/institutions/arts-science/p/<slug>)",
  },
  {
    value: "polytechnic",
    label: "Polytechnic (/institutions/polytechnic/p/<slug>)",
  },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function NewPagePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [institution, setInstitution] = useState<Institution>("main");
  const [template, setTemplate] = useState<Template>("standard");
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleCreate = async () => {
    setApiError(null);
    setMsg(null);
    if (!title.trim()) {
      setMsg("Title is required.");
      return;
    }
    if (!slug.trim()) {
      setMsg("Slug is required.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          institution,
          template,
        }),
      });
      if (r.ok) {
        const data = await r.json();
        router.push(`/admin/pages/${data._id}`);
      } else {
        const parsed = await parseApiError(r);
        setApiError(parsed);
        setMsg(parsed?.message ?? parsed?.error ?? "Failed to create.");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed to create.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Create Page</h1>
          <p className="admin-page-subtitle">
            Pick a template, name the page, and you&apos;ll land in the editor.
          </p>
        </div>
      </div>

      {apiError && (
        <ValidationErrors
          error={apiError.message ?? apiError.error}
          details={apiError.details}
        />
      )}
      {msg && !apiError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {msg}
        </p>
      )}

      <div className="admin-card mb-4 space-y-4">
        <div>
          <label htmlFor="new-page-title" className="admin-label">
            Title
          </label>
          <input
            id="new-page-title"
            className="admin-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. NIRF Disclosure 2026"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="new-page-slug" className="admin-label">
              Slug (URL)
            </label>
            <input
              id="new-page-slug"
              className="admin-input"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="nirf-disclosure-2026"
            />
            <p className="mt-1 text-xs text-gray-400">
              Lowercase letters, numbers, and dashes only.
            </p>
          </div>
          <div>
            <label htmlFor="new-page-institution" className="admin-label">
              Institution
            </label>
            <select
              id="new-page-institution"
              className="admin-select"
              value={institution}
              onChange={(e) => setInstitution(e.target.value as Institution)}
            >
              {INSTITUTIONS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="admin-label mb-3">Template</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const active = template === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-amber-400 bg-amber-50/40 ring-2 ring-amber-200"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    active ? "bg-amber-200" : "bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{t.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.push("/admin/pages")}
          className="admin-btn admin-btn-outline"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={busy}
          className="admin-btn admin-btn-gold"
        >
          {busy ? "Creating…" : "Create & Edit"}
        </button>
      </div>
    </div>
  );
}
