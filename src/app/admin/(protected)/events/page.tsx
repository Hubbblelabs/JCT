"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  TextInput,
  TextArea,
  Select,
  NumberInput,
  ImageUploadInput,
} from "@/components/admin/inputs";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EVENT_CATEGORY_SUGGESTIONS } from "@/lib/validation";

interface EventItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  category: string;
  event_date: string;
  location: string;
  image: string;
  institution: string;
  is_active: boolean;
  sort_order: number;
}

const EMPTY: Omit<EventItem, "_id"> = {
  title: "",
  slug: "",
  excerpt: "",
  description: "",
  category: "Campus Life",
  event_date: "",
  location: "",
  image: "",
  institution: "engineering",
  is_active: true,
  sort_order: 0,
};

const INSTITUTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "arts-science", label: "Arts & Science" },
  { value: "polytechnic", label: "Polytechnic" },
];

const INSTITUTION_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EventsPageInner() {
  const { flush, discardAll } = useDeferredUploads();
  const toast = useToast();
  const confirm = useConfirm();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState<Omit<EventItem, "_id">>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterInst] = useState(() => searchParams.get("college") ?? "");
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);
  // Main view (?scope=main, no college) is a read-only aggregate of every
  // college's events. Authoring only happens inside a college scope.
  const isMain = !filterInst;
  const editParam = searchParams.get("edit");
  const [editHandled, setEditHandled] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const url = filterInst
      ? `/api/admin/events?institution=${filterInst}`
      : "/api/admin/events";
    const r = await fetch(url);
    setEvents(await r.json());
    setLoading(false);
  }, [filterInst]);

  useEffect(() => {
    load();
  }, [filterInst, load]);

  // Click-through from the main aggregate lands here as ?college=X&edit=<id>;
  // auto-open that event's editor once its record has loaded.
  useEffect(() => {
    if (editHandled || isMain || !editParam || loading) return;
    const target = events.find((e) => e._id === editParam);
    if (target) {
      openEdit(target);
      setEditHandled(true);
    }
    // openEdit is a stable local closure; deps intentionally omit it.
     
  }, [editParam, events, loading, editHandled, isMain]);

  const openNew = () => {
    setEditing({ _id: "", ...EMPTY });
    setForm({
      ...EMPTY,
      institution: filterInst || "engineering",
      event_date: new Date().toISOString().slice(0, 10),
    });
    setSlugTouched(false);
    setApiError(null);
  };
  const openEdit = (e: EventItem) => {
    setEditing(e);
    setForm({ ...e, event_date: e.event_date?.slice(0, 10) ?? "" });
    setSlugTouched(true);
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

  const setTitle = (title: string) =>
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched ? f.slug : slugify(title),
    }));

  const save = async () => {
    setSaving(true);
    setApiError(null);
    try {
      const flushedForm = await flush(form);
      setForm(flushedForm as Omit<EventItem, "_id">);
      const isNew = !editing?._id;
      const url = isNew
        ? "/api/admin/events"
        : `/api/admin/events/${editing!._id}`;
      const r = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flushedForm),
      });
      if (r.ok) {
        await load();
        close();
        toast.success(isNew ? "Event created." : "Event updated.");
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

  const del = async (id: string) => {
    const ok = await confirm({
      title: "Delete event",
      message:
        "This event and its detail page will be permanently removed. Continue?",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    toast.success("Event deleted.");
    await load();
  };

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">
              News &amp; Events
              {filterInst ? ` — ${INSTITUTION_LABELS[filterInst]}` : " — Latest"}
            </h1>
            <p className="admin-page-subtitle">
              {isMain ? (
                <>
                  Latest events across all colleges (read-only). Click an event
                  to edit it in its college.
                </>
              ) : (
                <>
                  {events.filter((e) => e.is_active).length} active events —
                  shown on the {INSTITUTION_LABELS[filterInst]} News &amp; Events
                  page
                </>
              )}
            </p>
          </div>
          {!isMain && (
            <div className="flex gap-2">
              <button onClick={openNew} className="admin-btn admin-btn-primary">
                <Plus size={16} /> Add Event
              </button>
            </div>
          )}
        </div>

        <div className="admin-card overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>College</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      No events yet.
                    </td>
                  </tr>
                )}
                {events.map((e) => (
                  <tr key={e._id}>
                    <td className="font-medium">
                      {e.title}
                      <span className="block text-xs text-gray-400">
                        /events/{e.slug}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">
                      {formatDate(e.event_date)}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-blue">
                        {e.category}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500 capitalize">
                      {e.institution}
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${e.is_active ? "admin-badge-green" : "admin-badge-red"}`}
                      >
                        {e.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      {isMain ? (
                        <Link
                          href={`/admin/events?college=${e.institution}&edit=${e._id}`}
                          className="admin-btn admin-btn-outline admin-btn-sm"
                        >
                          <ExternalLink size={13} /> Edit in{" "}
                          {INSTITUTION_LABELS[e.institution] ?? e.institution}
                        </Link>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(e)}
                            className="admin-btn admin-btn-outline admin-btn-sm"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => del(e._id)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">
                {editing._id ? "Edit Event" : "New Event"}
              </h2>
              <button
                onClick={close}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-1 p-6">
              {apiError && (
                <ValidationErrors
                  error={apiError.message ?? apiError.error}
                  details={apiError.details}
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <TextInput
                    label="Title"
                    value={form.title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <TextInput
                  label="Slug (URL)"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  hint="Lowercase letters, numbers, and dashes"
                  required
                />
                <TextInput
                  label="Date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) => set("event_date", e.target.value)}
                  required
                />
                <TextInput
                  label="Category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  list="event-category-suggestions"
                  required
                />
                <datalist id="event-category-suggestions">
                  {EVENT_CATEGORY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <TextInput
                  label="Location"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Main Auditorium"
                />
                <Select
                  label="College"
                  value={form.institution}
                  options={INSTITUTIONS}
                  onChange={(e) => set("institution", e.target.value)}
                  disabled={!!filterInst}
                />
                <NumberInput
                  label="Sort order"
                  value={form.sort_order}
                  onChange={(e) => set("sort_order", Number(e.target.value))}
                  min={0}
                />
                <div className="col-span-2">
                  <ImageUploadInput
                    label="Cover image"
                    value={form.image}
                    onChange={(url) => set("image", url)}
                    hideUrlField
                  />
                </div>
              </div>
              <TextArea
                label="Excerpt (card summary)"
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={2}
              />
              <TextArea
                label="Detail content"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={8}
                hint="Shown on the event detail page. Basic HTML is supported (<p>, <h2>, <ul>, <a>…) and is sanitized on render."
              />
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="e_active"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                />
                <label htmlFor="e_active" className="text-sm text-gray-700">
                  Active (shown on website)
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button onClick={close} className="admin-btn admin-btn-outline">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="admin-btn admin-btn-gold"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function EventsAdminPage() {
  return (
    <DeferredUploadsProvider>
      <Suspense fallback={null}>
        <EventsPageInner />
      </Suspense>
    </DeferredUploadsProvider>
  );
}
