"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Field,
  FormGrid,
  TextInput,
  TextArea,
  ImageUploadInput,
} from "@/components/admin/inputs";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  PlayCircle,
  Star,
} from "lucide-react";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import { Drawer, PageShell, VisibilityBadge } from "@/components/admin/kit";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { plural } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EVENT_CATEGORY_SUGGESTIONS, LIMITS_event } from "@/lib/validation";

const GALLERY_MAX = LIMITS_event.galleryMax;
const VIDEOS_MAX = LIMITS_event.videosMax;

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
  videos: string[];
  featured: boolean;
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
  videos: [],
  featured: false,
  institution: "engineering",
  is_active: true,
  sort_order: 0,
};

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
      // Records created before these fields existed have no value for them.
      gallery: Array.isArray(e.gallery) ? e.gallery : [],
      videos: Array.isArray(e.videos) ? e.videos : [],
      featured: e.featured === true,
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
      // A slot the editor added but never filled would fail validation — drop
      // it.
      const flushedForm = {
        ...flushed,
        gallery: flushed.gallery.filter(Boolean),
        videos: flushed.videos.map((v) => v.trim()).filter(Boolean),
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

  const columns: Column<EventItem>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      value: (e) => `${e.title} ${e.slug} ${e.location}`,
      render: (e) => (
        <span className="block">
          <span className="flex flex-wrap items-center gap-1.5 font-medium">
            {e.title}
            {e.featured && (
              <span
                className="admin-badge admin-badge-yellow"
                title="Pinned to the carousel at the top of the News & Events page"
              >
                <Star size={11} /> Featured
              </span>
            )}
            {(e.videos?.length ?? 0) > 0 && (
              <span className="admin-badge admin-badge-gray" title="Has video">
                <PlayCircle size={11} /> Video
              </span>
            )}
          </span>
          <span className="block text-xs text-[var(--admin-text-faint)]">
            /events/{e.slug}
          </span>
        </span>
      ),
    },
    {
      key: "event_date",
      header: "Date",
      sortable: true,
      // Sort on the raw ISO string, not the display text — "02 Feb" ahead of
      // "10 Jan" is what alphabetical ordering of the formatted date gives.
      value: (e) => e.event_date ?? "",
      render: (e) => (
        <span className="text-sm text-[var(--admin-text-muted)]">
          {formatDate(e.event_date)}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      value: (e) => e.category,
      render: (e) => (
        <span className="admin-badge admin-badge-blue">{e.category}</span>
      ),
    },
    // Inside one college's list every row is that college — the column only
    // earns its width on the Main aggregate, where it says whose entry it is.
    ...(isMain
      ? ([
          {
            key: "institution",
            header: "College",
            sortable: true,
            hideOnMobile: true,
            value: (e) => INSTITUTION_LABELS[e.institution] ?? e.institution,
            render: (e) => (
              <span className="admin-badge admin-badge-gray">
                {INSTITUTION_LABELS[e.institution] ?? e.institution}
              </span>
            ),
          },
        ] satisfies Column<EventItem>[])
      : []),
    {
      key: "is_active",
      header: "On public site",
      sortable: true,
      value: (e) => (e.is_active ? "Visible" : "Hidden"),
      render: (e) => <VisibilityBadge isActive={e.is_active} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      // The main aggregate is read-only — it names the source college instead
      // of offering edits that belong on that college's page.
      render: (e) =>
        isMain ? null : (
          <div className="flex justify-end gap-1">
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                openEdit(e);
              }}
              aria-label={`Edit ${e.title}`}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                void del(e._id);
              }}
              aria-label={`Delete ${e.title}`}
              className="admin-btn admin-btn-danger admin-btn-sm"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ),
    },
  ];

  return (
    <>
      <PageShell
        title={`News & Events${
          filterInst ? ` — ${INSTITUTION_LABELS[filterInst]}` : " — Latest"
        }`}
        description={
          <>
            {isMain ? (
              <>
                Latest events across all colleges (read-only). The College
                column shows which college each entry belongs to — edit it from
                that college&apos;s News &amp; Events page.
              </>
            ) : (
              <>
                {plural(
                  events.filter((e) => e.is_active).length,
                  "visible event",
                )}{" "}
                — shown on the {INSTITUTION_LABELS[filterInst]} News &amp;
                Events page
              </>
            )}
          </>
        }
        actions={
          !isMain && (
            <button onClick={openNew} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add Event
            </button>
          )
        }
      >
        <DataTable
          rows={events}
          columns={columns}
          rowKey={(e) => e._id}
          loading={loading}
          searchPlaceholder="Search title, category or location…"
          onRowClick={isMain ? undefined : openEdit}
          initialSort={{ key: "event_date", dir: "desc" }}
          // Colleges accumulate events every term, so this list is the one that
          // outgrows a single screen — page it rather than rendering hundreds
          // of rows at once.
          pageSize={20}
          empty={{
            title: "No events yet",
            body: isMain
              ? "Nothing has been posted by any college yet. Events are added from each college's own News & Events page in the sidebar."
              : "Announcements, events and news entries for this college. Add the first one to start the News & Events page.",
            action: isMain ? undefined : (
              <button onClick={openNew} className="admin-btn admin-btn-primary">
                <Plus size={16} /> Add Event
              </button>
            ),
          }}
        />
      </PageShell>

      <Drawer
        open={!!editing}
        onClose={close}
        title={editing?._id ? "Edit Event" : "New Event"}
        icon={CalendarDays}
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
        {editing && (
          <div className="space-y-1">
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
              {/* No College or Sort order field: authoring only happens
                    inside a college scope, so the college is fixed by the URL,
                    and events are ordered by date. */}
              <TextInput
                label="Location"
                span={6}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Main Auditorium"
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
                    <p className="mt-0.5 text-xs text-[var(--admin-text-faint)]">
                      Shown as a grid on the event detail page, below the
                      content. Visitors click a photo to open it full size —
                      this order is the order they page through.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-medium text-[var(--admin-text-faint)]">
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
                  <p className="rounded-lg border border-dashed border-[var(--admin-border)] p-4 text-center text-sm text-[var(--admin-text-faint)]">
                    No gallery images. Add up to {GALLERY_MAX}.
                  </p>
                ) : (
                  <div className="admin-form-grid admin-form-grid--tight">
                    {form.gallery.map((url, i) => (
                      <div
                        key={i}
                        className="admin-col-4 relative rounded-lg border border-[var(--admin-border)] p-3"
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
                span="full"
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={3}
              />
              <TextArea
                label="Detail content"
                span="full"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={8}
                hint="Shown on the event detail page. Basic HTML is supported (<p>, <h2>, <ul>, <a>…) and is sanitized on render."
              />
              <Field
                label="Videos"
                span="full"
                hint="Paste the link to a YouTube, Vimeo or Facebook video and it plays on the event page. Links to other sites are shown as a button that opens them."
              >
                <div className="space-y-2">
                  {form.videos.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="admin-input"
                        value={v}
                        placeholder="https://www.youtube.com/watch?v=…"
                        aria-label={`Video link ${i + 1}`}
                        onChange={(e) =>
                          set(
                            "videos",
                            form.videos.map((x, j) =>
                              j === i ? e.target.value : x,
                            ),
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            "videos",
                            form.videos.filter((_, j) => j !== i),
                          )
                        }
                        className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
                        aria-label={`Remove video link ${i + 1}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={form.videos.length >= VIDEOS_MAX}
                    onClick={() => set("videos", [...form.videos, ""])}
                    className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-50"
                  >
                    <Plus size={14} /> Add video link
                  </button>
                </div>
              </Field>
              <div className="admin-col-full flex items-start gap-2">
                <input
                  type="checkbox"
                  id="e_featured"
                  className="mt-1"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                <label
                  htmlFor="e_featured"
                  className="text-sm text-[var(--admin-text-secondary)]"
                >
                  Feature in the carousel
                  <span className="block text-xs text-[var(--admin-text-muted)]">
                    Pinned to the slideshow at the top of the News &amp; Events
                    page. With nothing featured, the slideshow shows the latest
                    entries.
                  </span>
                </label>
              </div>
              <div className="admin-col-full flex items-center gap-2">
                <input
                  type="checkbox"
                  id="e_active"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                />
                <label
                  htmlFor="e_active"
                  className="text-sm text-[var(--admin-text-secondary)]"
                >
                  Visible on the website
                </label>
              </div>
            </FormGrid>
          </div>
        )}
      </Drawer>
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
