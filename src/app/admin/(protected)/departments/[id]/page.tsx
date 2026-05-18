"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextInput, TextArea, Accordion, ImageUploadInput } from "@/components/admin/inputs";
import {
  DepartmentTabsEditor,
  type Tab,
} from "@/components/admin/DepartmentTabsEditor";
import { Save, Send, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";

export default function DepartmentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [msg, setMsg] = useState("");
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  const tabs: Tab[] = Array.isArray(content.tabs) ? (content.tabs as Tab[]) : [];

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/departments/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setDoc(data);
          setContent((data.content as Record<string, unknown>) ?? {});
          setLoading(false);
        });
    }
  }, [id, isNew]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    setApiError(null);
    try {
      if (isNew) {
        const r = await fetch("/api/admin/departments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: content.slug, college: content.college, content }),
        });
        if (r.ok) {
          const data = await r.json();
          router.push(`/admin/departments/${data._id}`);
        } else {
          const err = await parseApiError(r);
          setApiError(err);
          if (!err?.details?.length) setMsg(err?.message ?? err?.error ?? "Error creating department");
        }
      } else {
        const r = await fetch(`/api/admin/departments/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (r.ok) setMsg("Saved successfully");
        else {
          const err = await parseApiError(r);
          setApiError(err);
          if (!err?.details?.length) setMsg(err?.message ?? err?.error ?? "Error saving");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    setMsg("");
    setApiError(null);
    try {
      const r = await fetch(`/api/admin/departments/${id}/publish`, { method: "POST" });
      if (r.ok) setMsg("Published successfully");
      else {
        const err = await parseApiError(r);
        setApiError(err);
        if (!err?.details?.length) setMsg(err?.message ?? err?.error ?? "Error publishing");
      }
    } finally {
      setPublishing(false);
    }
  };

  const migrateToTabs = async () => {
    if (isNew) return;
    setMigrating(true);
    setMsg("");
    setApiError(null);
    try {
      const r = await fetch(`/api/admin/departments/${id}/migrate-tabs`, {
        method: "POST",
      });
      if (r.ok) {
        const data = await r.json();
        if (data?.content) {
          setContent(data.content);
          setMsg("Generated tabs from existing content. Click Save Draft to keep them.");
        }
      } else {
        const err = await parseApiError(r);
        setApiError(err);
        if (!err?.details?.length) setMsg(err?.message ?? err?.error ?? "Error migrating to tabs");
      }
    } finally {
      setMigrating(false);
    }
  };

  const set = (key: string, val: unknown) => setContent((c) => ({ ...c, [key]: val }));
  const setTabs = (next: Tab[]) => setContent((c) => ({ ...c, tabs: next }));

  if (loading) {
    return (
      <div className="admin-content flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="admin-btn admin-btn-outline admin-btn-sm">
              <ArrowLeft size={14} />
            </button>
            <h1 className="admin-page-title">{isNew ? "New Department" : String(doc?.slug ?? "")}</h1>
            {!isNew && (
              <span className={`admin-badge ${doc?.status === "published" ? "admin-badge-green" : "admin-badge-yellow"}`}>
                {String(doc?.status ?? "draft")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {msg && <span className="text-sm text-green-600">{msg}</span>}
            {!isNew && tabs.length === 0 && (
              <button
                onClick={migrateToTabs}
                disabled={migrating}
                className="admin-btn admin-btn-outline admin-btn-sm"
                title="Generate the default six tabs from existing fields"
              >
                {migrating ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <RefreshCw size={15} />
                )}
                {migrating ? "Migrating…" : "Migrate to tabs"}
              </button>
            )}
            <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving…" : "Save Draft"}
            </button>
            {!isNew && (
              <button onClick={publish} disabled={publishing} className="admin-btn admin-btn-gold">
                {publishing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {publishing ? "Publishing…" : "Publish"}
              </button>
            )}
          </div>
        </div>

        {apiError && (
          <ValidationErrors
            error={apiError.message ?? apiError.error}
            details={apiError.details}
          />
        )}

        <Accordion title="General Info" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Slug" value={String(content.slug ?? "")} onChange={(e) => set("slug", e.target.value)} placeholder="cse" required />
            <div>
              <label className="admin-label">College <span className="text-red-500">*</span></label>
              <select className="admin-select" value={String(content.college ?? "")} onChange={(e) => set("college", e.target.value)}>
                <option value="">Select college</option>
                <option value="engineering">Engineering</option>
                <option value="arts-science">Arts & Science</option>
                <option value="polytechnic">Polytechnic</option>
              </select>
            </div>
            <TextInput label="Department Name" value={String(content.name ?? "")} onChange={(e) => set("name", e.target.value)} placeholder="Computer Science & Engineering" />
            <TextInput label="Short Name" value={String(content.shortName ?? "")} onChange={(e) => set("shortName", e.target.value)} placeholder="CSE" />
            <ImageUploadInput label="Hero Image" value={String(content.heroImage ?? "")} onChange={(url) => set("heroImage", url)} uploadOnly />
            <TextInput label="Accent Color" value={String(content.accentColor ?? "")} onChange={(e) => set("accentColor", e.target.value)} placeholder="#0F4C81" />
          </div>
        </Accordion>

        <Accordion title="About">
          <TextArea label="About (paragraph 1)" value={String(content.about1 ?? "")} onChange={(e) => set("about1", e.target.value)} rows={4} />
          <TextArea label="About (paragraph 2)" value={String(content.about2 ?? "")} onChange={(e) => set("about2", e.target.value)} rows={4} />
          <div className="grid grid-cols-3 gap-4">
            <TextInput label="Established" value={String(content.established ?? "")} onChange={(e) => set("established", e.target.value)} placeholder="2009" />
            <TextInput label="Intake" value={String(content.intake ?? "")} onChange={(e) => set("intake", e.target.value)} placeholder="60" />
            <TextInput label="Accreditation" value={String(content.accreditation ?? "")} onChange={(e) => set("accreditation", e.target.value)} placeholder="NBA Accredited" />
          </div>
        </Accordion>

        <Accordion title="HOD">
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="HOD Name" value={String(content.hodName ?? "")} onChange={(e) => set("hodName", e.target.value)} />
            <TextInput label="Designation" value={String(content.hodDesignation ?? "")} onChange={(e) => set("hodDesignation", e.target.value)} />
            <TextInput label="Qualification" value={String(content.hodQualification ?? "")} onChange={(e) => set("hodQualification", e.target.value)} />
            <TextInput label="Experience" value={String(content.hodExperience ?? "")} onChange={(e) => set("hodExperience", e.target.value)} placeholder="20+ years" />
            <ImageUploadInput label="Photo" value={String(content.hodPhoto ?? "")} onChange={(url) => set("hodPhoto", url)} uploadOnly />
          </div>
          <TextArea label="HOD Message" value={String(content.hodMessage ?? "")} onChange={(e) => set("hodMessage", e.target.value)} rows={4} />
        </Accordion>

        <Accordion title="Vision & Mission">
          <TextArea label="Vision" value={String(content.vision ?? "")} onChange={(e) => set("vision", e.target.value)} rows={3} />
          <TextArea label="Mission" value={String(content.mission ?? "")} onChange={(e) => set("mission", e.target.value)} rows={4} />
        </Accordion>

        <Accordion title="Career & Placements">
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Placement Rate" value={String(content.placementRate ?? "")} onChange={(e) => set("placementRate", e.target.value)} placeholder="98%" />
            <TextInput label="Average Package" value={String(content.averagePackage ?? "")} onChange={(e) => set("averagePackage", e.target.value)} placeholder="9 LPA" />
            <TextInput label="Highest Package" value={String(content.highestPackage ?? "")} onChange={(e) => set("highestPackage", e.target.value)} placeholder="70 LPA" />
          </div>
        </Accordion>

        <Accordion title="Page Tabs (Sidebar Content)" defaultOpen={tabs.length > 0}>
          <p className="mb-3 text-xs text-gray-500">
            When tabs are defined, the public department page renders them in
            order from the sidebar. Tabs override the legacy layout above.
          </p>
          <DepartmentTabsEditor tabs={tabs} onChange={setTabs} />
        </Accordion>

        <Accordion title="Advanced (Raw JSON)">
          <p className="mb-2 text-xs text-gray-400">Full department content as JSON. This overwrites all fields above on save.</p>
          <textarea
            className="admin-textarea font-mono text-xs"
            rows={20}
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                setContent(JSON.parse(e.target.value));
              } catch {}
            }}
          />
        </Accordion>
      </div>
    </>
  );
}
