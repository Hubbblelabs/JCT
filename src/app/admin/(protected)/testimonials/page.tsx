"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  TextInput,
  TextArea,
  Select,
  ImageUploadInput,
} from "@/components/admin/inputs";
import { Check, Eye, EyeOff, Loader2, MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { PageShell } from "@/components/admin/kit/PageShell";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import { Drawer } from "@/components/admin/kit/Drawer";
import {
  Banner,
  StatusBadge,
  VisibilityBadge,
} from "@/components/admin/kit/primitives";

interface Testimonial {
  _id: string;
  name: string;
  batch: string;
  course: string;
  company: string;
  quote: string;
  avatar: string;
  category: string;
  institution: string;
  is_active: boolean;
  sort_order: number;
}

const EMPTY: Omit<Testimonial, "_id"> = {
  name: "",
  batch: "",
  course: "",
  company: "",
  quote: "",
  avatar: "",
  category: "Alumni",
  institution: "all",
  is_active: true,
  sort_order: 0,
};

const CATEGORIES = [
  { value: "Alumni", label: "Alumni" },
  { value: "Student", label: "Student" },
  { value: "Industry", label: "Industry" },
];

const INSTITUTIONS = [
  { value: "all", label: "All / Home page" },
  { value: "engineering", label: "Engineering" },
  { value: "arts-science", label: "Arts & Science" },
  { value: "polytechnic", label: "Polytechnic" },
];

const instLabel = (v: string) =>
  INSTITUTIONS.find((i) => i.value === v)?.label ?? v;

function TestimonialsPageInner() {
  const { flush, discardAll } = useDeferredUploads();
  const toast = useToast();
  const confirm = useConfirm();
  const searchParams = useSearchParams();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  // The institution filter existed but its setter was never wired up, so the
  // dropdown could not actually be changed. It is a real control now.
  const [filterInst, setFilterInst] = useState(
    () => searchParams.get("college") ?? "",
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const url = filterInst
        ? `/api/admin/testimonials?institution=${filterInst}`
        : "/api/admin/testimonials";
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Request failed (${r.status})`);
      const data = await r.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      setTestimonials([]);
      setLoadError(
        err instanceof Error ? err.message : "Could not load testimonials.",
      );
    } finally {
      setLoading(false);
    }
  }, [filterInst]);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => {
    setEditing({ _id: "", ...EMPTY });
    setForm(EMPTY);
    setApiError(null);
  };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ ...t });
    setApiError(null);
  };
  const close = () => {
    discardAll();
    setEditing(null);
    setForm(EMPTY);
    setApiError(null);
  };
  const set = (key: string, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    setApiError(null);
    try {
      const flushedForm = await flush(form);
      setForm(flushedForm as Omit<Testimonial, "_id">);
      const isNew = !editing?._id;
      const url = isNew
        ? "/api/admin/testimonials"
        : `/api/admin/testimonials/${editing!._id}`;
      const r = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flushedForm),
      });
      if (r.ok) {
        toast.success(isNew ? "Testimonial added." : "Testimonial updated.");
        await load();
        close();
      } else {
        setApiError(await parseApiError(r));
      }
    } catch (err) {
      setApiError({
        error: err instanceof Error ? err.message : "Upload failed",
      } as ApiErrorPayload);
    }
    setSaving(false);
  };

  const runBulk = async (
    label: string,
    rows: Testimonial[],
    run: (t: Testimonial) => Promise<Response>,
  ) => {
    const results = await Promise.all(rows.map((t) => run(t).catch(() => null)));
    const failed = results.filter((r) => !r || !r.ok).length;
    if (failed === 0) toast.success(`${label} ${rows.length} testimonial(s).`);
    else
      toast.error(
        `${label} ${rows.length - failed} of ${rows.length}. ${failed} failed — those were left unchanged.`,
      );
    await load();
  };

  const setActive = (rows: Testimonial[], is_active: boolean) =>
    runBulk(is_active ? "Showing" : "Hidden", rows, (t) =>
      fetch(`/api/admin/testimonials/${t._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active }),
      }),
    );

  const remove = async (rows: Testimonial[]) => {
    const ok = await confirm({
      title:
        rows.length === 1
          ? "Delete testimonial"
          : `Delete ${rows.length} testimonials`,
      message:
        rows.length === 1
          ? `Permanently delete the testimonial from “${rows[0].name}”? This cannot be undone.`
          : `Permanently delete ${rows.length} testimonials? This cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await runBulk("Deleted", rows, (t) =>
      fetch(`/api/admin/testimonials/${t._id}`, { method: "DELETE" }),
    );
  };

  const columns: Column<Testimonial>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      value: (t) => `${t.name} ${t.batch} ${t.course} ${t.company} ${t.quote}`,
      render: (t) => (
        <span className="block">
          <span className="block font-medium text-[var(--admin-text)]">
            {t.name}
          </span>
          <span className="admin-help block">
            {[t.batch, t.course].filter(Boolean).join(" · ") || "—"}
          </span>
        </span>
      ),
    },
    {
      key: "company",
      header: "Company",
      sortable: true,
      hideOnMobile: true,
      value: (t) => t.company ?? "",
      render: (t) => t.company || "—",
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      value: (t) => t.category,
      render: (t) => <StatusBadge tone="info" label={t.category} />,
    },
    {
      key: "institution",
      header: "Shown on",
      sortable: true,
      hideOnMobile: true,
      value: (t) => instLabel(t.institution),
      render: (t) => (
        <span className="text-[var(--admin-text-secondary)]">
          {instLabel(t.institution)}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      sortable: true,
      value: (t) => (t.is_active ? 1 : 0),
      render: (t) => <VisibilityBadge isActive={t.is_active} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "1%",
      render: (t) => (
        <span className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(t);
            }}
            className="admin-btn admin-btn-outline admin-btn-sm"
            aria-label={`Edit testimonial from ${t.name}`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              void remove([t]);
            }}
            className="admin-btn admin-btn-danger admin-btn-sm"
            aria-label={`Delete testimonial from ${t.name}`}
          >
            <Trash2 size={13} />
          </button>
        </span>
      ),
    },
  ];

  return (
    <PageShell
      title="Testimonials"
      description="Alumni, student and industry quotes. Each one can be shown on the home page or scoped to a single college."
      actions={
        <button onClick={openNew} className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add testimonial
        </button>
      }
    >
      {loadError && (
        <div className="mb-4">
          <Banner
            tone="danger"
            title="Could not load testimonials"
            action={
              <button
                onClick={() => void load()}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                Retry
              </button>
            }
          >
            {loadError}
          </Banner>
        </div>
      )}

      <DataTable
        rows={testimonials}
        columns={columns}
        rowKey={(t) => t._id}
        loading={loading}
        searchPlaceholder="Search name, company or quote…"
        onRowClick={openEdit}
        initialSort={{ key: "name", dir: "asc" }}
        filters={
          <select
            value={filterInst}
            onChange={(e) => setFilterInst(e.target.value)}
            aria-label="Filter by college"
            className="admin-select w-auto"
          >
            <option value="">Every college</option>
            {INSTITUTIONS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        }
        empty={{
          title: "No testimonials yet",
          body: "Quotes from alumni, current students and recruiters. They appear on the home page and on each college's landing page.",
          action: (
            <button onClick={openNew} className="admin-btn admin-btn-primary">
              <Plus size={15} /> Add the first one
            </button>
          ),
        }}
        bulkActions={[
          { label: "Show", icon: Eye, onRun: (s) => setActive(s, true) },
          { label: "Hide", icon: EyeOff, onRun: (s) => setActive(s, false) },
          {
            label: "Delete",
            icon: Trash2,
            destructive: true,
            onRun: (s) => remove(s),
          },
        ]}
      />

      <Drawer
        open={!!editing}
        onClose={close}
        eyebrow={editing?._id ? "Edit" : "New"}
        title={editing?._id ? editing.name || "Testimonial" : "New testimonial"}
        description="Shown as a quote card on the public site."
        icon={MessageSquare}
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={close} className="admin-btn admin-btn-outline">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="admin-btn admin-btn-primary"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        {apiError && (
          <ValidationErrors
            error={apiError.message ?? apiError.error}
            details={apiError.details}
          />
        )}

        <div className="grid grid-cols-2 gap-x-4">
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
          <TextInput
            label="Batch (year)"
            value={form.batch}
            onChange={(e) => set("batch", e.target.value)}
            placeholder="2024"
            required
          />
          <TextInput
            label="Course"
            value={form.course}
            onChange={(e) => set("course", e.target.value)}
            placeholder="B.E. CSE"
          />
          <TextInput
            label="Company"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Infosys"
          />
          <Select
            label="Category"
            value={form.category}
            options={CATEGORIES}
            onChange={(e) => set("category", e.target.value)}
          />
          <Select
            label="Shown on"
            value={form.institution}
            options={INSTITUTIONS}
            onChange={(e) => set("institution", e.target.value)}
            hint="Pick a college to limit where this quote appears."
          />
        </div>

        <ImageUploadInput
          label="Photo"
          ratio="square"
          value={form.avatar}
          onChange={(url) => set("avatar", url)}
          hideUrlField
          hint="Optional. A square headshot works best."
        />

        <TextArea
          label="Quote"
          value={form.quote}
          onChange={(e) => set("quote", e.target.value)}
          required
          rows={5}
          hint="Written in the person's own voice. Quotation marks are added automatically."
        />

        <label className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
          />
          <span className="text-[length:var(--admin-text-body)] text-[var(--admin-text-secondary)]">
            Show this testimonial on the public site
          </span>
        </label>
      </Drawer>
    </PageShell>
  );
}

export default function TestimonialsPage() {
  return (
    <DeferredUploadsProvider>
      <Suspense fallback={null}>
        <TestimonialsPageInner />
      </Suspense>
    </DeferredUploadsProvider>
  );
}
