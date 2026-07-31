"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  FormGrid,
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EVENT_CATEGORY_SUGGESTIONS, LIMITS_event } from "@/lib/validation";

const GALLERY_MAX = LIMITS_event.galleryMax;

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
  gallery: string[];
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
  gallery: [],
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
  // Read straight off the URL, not frozen into state: the sidebar links every
  // scope at this same path (`?scope=main` vs `?college=X`), so a mounted-once
  // snapshot left the page showing the previous college's list after a click.
  const filterInst = searchParams.get("college") ?? "";
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);
  // Main view (?scope=main, no college) is a read-only aggregate of every
  // college's events. Authoring only happens inside a college scope.
  const isMain = !filterInst;

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
    setForm({
      ...e,
      event_date: e.event_date?.slice(0, 10) ?? "",
      // Records created before the gallery field existed have no array.
      gallery: Array.isArray(e.gallery) ? e.gallery : [],
    });
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

  const addGallerySlot = () =>
    setForm((f) =>
      f.gallery.length >= GALLERY_MAX
        ? f
        : { ...f, gallery: [...f.gallery, ""] },
    );

  // Clearing a slot from inside the uploader drops the slot entirely, so the
  // grid never leaves a gap the editor has to tidy up by hand.
  const setGalleryAt = (i: number, url: string) =>
    setForm((f) => {
      const next = [...f.gallery];
      if (url) next[i] = url;
      else next.splice(i, 1);
      return { ...f, gallery: next };
    });

  const removeGalleryAt = (i: number) =>
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, j) => j !== i) }));

  // Gallery order is the order the public lightbox steps through, so the
  // editor needs a way to change it without re-uploading.
  const moveGallery = (i: number, delta: number) =>
    setForm((f) => {
      const to = i + delta;
      if (to < 0 || to >= f.gallery.length) return f;
      const next = [...f.gallery];
      [next[i], next[to]] = [next[to], next[i]];
      return { ...f, gallery: next };
    });

  const save = async () => {
    setSaving(true);
    setApiError(null);
    try {
      const flushed = (await flush(form)) as Omit<EventItem, "_id">;
      // A slot the editor added but never filled would fail zUrl — drop it.
      const flushedForm = {
        ...flushed,
        gallery: flushed.gallery.filter(Boolean),
      };
      setForm(flushedForm);
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
              {filterInst
                ? ` — ${INSTITUTION_LABELS[filterInst]}`
                : " — Latest"}
            </h1>
            <p className="admin-page-subtitle">
              {isMain ? (
                <>
                  Latest events across all colleges (read-only). The College
                  column shows which college each entry belongs to — edit it
                  from that college&apos;s News &amp; Events page.
                </>
              ) : (
                <>
                  {events.filter((e) => e.is_active).length} active events —
                  shown on the {INSTITUTION_LABELS[filterInst]} News &amp;
                  Events page
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
                    <td className="text-sm text-gray-500">
                      <span className="admin-badge admin-badge-gray">
                        {INSTITUTION_LABELS[e.institution] ?? e.institution}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${e.is_active ? "admin-badge-green" : "admin-badge-red"}`}
                      >
                        {e.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      {/* The main aggregate is read-only — it names the source
                          college instead of linking away to it. */}
                      {!isMain && (
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
          <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl">
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
              {/* Identity and scheduling first, then the imagery, then the
                  copy that fills the detail page. */}
              <FormGrid>
                <TextInput
                  label="Title"
                  span={5}
                  value={form.title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <TextInput
                  label="Slug (URL)"
                  span={4}
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
                  span={3}
                  type="date"
                  value={form.event_date}
                  onChange={(e) => set("event_date", e.target.value)}
                  required
                />
                <TextInput
                  label="Category"
                  span={3}
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
                  span={4}
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Main Auditorium"
                />
                <Select
                  label="College"
                  span={3}
                  value={form.institution}
                  options={INSTITUTIONS}
                  onChange={(e) => set("institution", e.target.value)}
                  disabled={!!filterInst}
                />
                <NumberInput
                  label="Sort order"
                  span={2}
                  value={form.sort_order}
                  onChange={(e) => set("sort_order", Number(e.target.value))}
                  min={0}
                />
                <ImageUploadInput
                  label="Cover image"
                  span="full"
                  ratio="hero"
                  value={form.image}
                  onChange={(url) => set("image", url)}
                  hideUrlField
                />

                <div className="admin-col-full">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <span className="admin-label mb-0">Gallery images</span>
                      <p className="mt-0.5 text-xs text-gray-400">
                        Shown as a grid on the event detail page, below the
                        content. Visitors click a photo to open it full size —
                        this order is the order they page through.
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs font-medium text-gray-400">
                        {form.gallery.length} / {GALLERY_MAX}
                      </span>
                      <button
                        type="button"
                        onClick={addGallerySlot}
                        disabled={form.gallery.length >= GALLERY_MAX}
                        className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus size={14} /> Add image
                      </button>
                    </div>
                  </div>

                  {form.gallery.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
                      No gallery images. Add up to {GALLERY_MAX}.
                    </p>
                  ) : (
                    <div className="admin-form-grid admin-form-grid--tight">
                      {form.gallery.map((url, i) => (
                        <div
                          key={i}
                          className="admin-col-4 relative rounded-lg border border-gray-200 p-3"
                        >
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveGallery(i, -1)}
                              disabled={i === 0}
                              aria-label={`Move image ${i + 1} earlier`}
                              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ChevronLeft size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGallery(i, 1)}
                              disabled={i === form.gallery.length - 1}
                              aria-label={`Move image ${i + 1} later`}
                              className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ChevronRight size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGalleryAt(i)}
                              aria-label={`Remove image ${i + 1}`}
                              className="admin-btn admin-btn-danger admin-btn-sm"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <ImageUploadInput
                            label={`Image ${i + 1}`}
                            ratio="card"
                            value={url}
                            onChange={(next) => setGalleryAt(i, next)}
                            hideUrlField
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <TextArea
                  label="Excerpt (card summary)"
                  span={4}
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  rows={8}
                />
                <TextArea
                  label="Detail content"
                  span={8}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={8}
                  hint="Shown on the event detail page. Basic HTML is supported (<p>, <h2>, <ul>, <a>…) and is sanitized on render."
                />
                <div className="admin-col-full flex items-center gap-2">
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
              </FormGrid>
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
