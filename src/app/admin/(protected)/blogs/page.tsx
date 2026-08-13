"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  FormGrid,
  TextInput,
  TextArea,
  ImageUploadInput,
} from "@/components/admin/inputs";
import { Plus, Pencil, Trash2, X, Loader2, Check } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { BLOG_CATEGORY_SUGGESTIONS } from "@/lib/validation";

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  image: string;
  institution: string;
  is_active: boolean;
  sort_order: number;
}

const EMPTY: Omit<BlogItem, "_id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Admissions",
  author: "",
  published_at: "",
  image: "",
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

function BlogsPageInner() {
  const { flush, discardAll } = useDeferredUploads();
  const toast = useToast();
  const confirm = useConfirm();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const [form, setForm] = useState<Omit<BlogItem, "_id">>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  // Read straight off the URL, not frozen into state: the sidebar links every
  // scope at this same path (`?scope=main` vs `?college=X`), so a mounted-once
  // snapshot left the page showing the previous college's list after a click.
  const filterInst = searchParams.get("college") ?? "";
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);
  // Main view (?scope=main, no college) is a read-only aggregate of every
  // college's posts. Authoring only happens inside a college scope.
  const isMain = !filterInst;

  const load = useCallback(async () => {
    setLoading(true);
    const url = filterInst
      ? `/api/admin/blogs?institution=${filterInst}`
      : "/api/admin/blogs";
    const r = await fetch(url);
    setBlogs(await r.json());
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
      published_at: new Date().toISOString().slice(0, 10),
    });
    setSlugTouched(false);
    setApiError(null);
  };
  const openEdit = (b: BlogItem) => {
    setEditing(b);
    setForm({
      ...b,
      published_at: b.published_at?.slice(0, 10) ?? "",
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

  const save = async () => {
    setSaving(true);
    setApiError(null);
    try {
      const flushed = (await flush(form)) as Omit<BlogItem, "_id">;
      setForm(flushed);
      const isNew = !editing?._id;
      const url = isNew
        ? "/api/admin/blogs"
        : `/api/admin/blogs/${editing!._id}`;
      const r = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flushed),
      });
      if (r.ok) {
        await load();
        close();
        toast.success(isNew ? "Blog created." : "Blog updated.");
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
      title: "Delete blog",
      message:
        "This blog post and its detail page will be permanently removed. Continue?",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    toast.success("Blog deleted.");
    await load();
  };

  const columns: Column<BlogItem>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      value: (b) => `${b.title} ${b.slug} ${b.author}`,
      render: (b) => (
        <span className="block">
          <span className="block font-medium">{b.title}</span>
          <span className="block text-xs text-gray-400">/blogs/{b.slug}</span>
        </span>
      ),
    },
    {
      key: "published_at",
      header: "Published",
      sortable: true,
      // Sort on the raw ISO string, not the display text — "02 Feb" ahead of
      // "10 Jan" is what alphabetical ordering of the formatted date gives.
      value: (b) => b.published_at ?? "",
      render: (b) => (
        <span className="text-sm text-gray-500">
          {formatDate(b.published_at)}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      value: (b) => b.category,
      render: (b) => (
        <span className="admin-badge admin-badge-blue">{b.category}</span>
      ),
    },
    {
      key: "institution",
      header: "College",
      sortable: true,
      hideOnMobile: true,
      value: (b) => INSTITUTION_LABELS[b.institution] ?? b.institution,
      render: (b) => (
        <span className="admin-badge admin-badge-gray">
          {INSTITUTION_LABELS[b.institution] ?? b.institution}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      sortable: true,
      value: (b) => (b.is_active ? "Active" : "Hidden"),
      render: (b) => (
        <span
          className={`admin-badge ${b.is_active ? "admin-badge-green" : "admin-badge-red"}`}
        >
          {b.is_active ? "Active" : "Hidden"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      // The main aggregate is read-only — it names the source college instead
      // of offering edits that belong on that college's page.
      render: (b) =>
        isMain ? null : (
          <div className="flex justify-end gap-1">
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                openEdit(b);
              }}
              aria-label={`Edit ${b.title}`}
              className="admin-btn admin-btn-outline admin-btn-sm"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                void del(b._id);
              }}
              aria-label={`Delete ${b.title}`}
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
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">
              Blogs
              {filterInst ? ` — ${INSTITUTION_LABELS[filterInst]}` : " — All"}
            </h1>
            <p className="admin-page-subtitle">
              {isMain ? (
                <>
                  Every post across all colleges (read-only). The College column
                  shows which college each entry belongs to — edit it from that
                  college&apos;s Blogs page. All of them list together on{" "}
                  <code>/blogs</code>.
                </>
              ) : (
                <>
                  {blogs.filter((b) => b.is_active).length} active posts — shown
                  on the site-wide /blogs page
                </>
              )}
            </p>
          </div>
          {!isMain && (
            <div className="flex gap-2">
              <button onClick={openNew} className="admin-btn admin-btn-primary">
                <Plus size={16} /> Add Blog
              </button>
            </div>
          )}
        </div>

        <DataTable
          rows={blogs}
          columns={columns}
          rowKey={(b) => b._id}
          loading={loading}
          searchPlaceholder="Search title, category or author…"
          onRowClick={isMain ? undefined : openEdit}
          initialSort={{ key: "published_at", dir: "desc" }}
          pageSize={20}
          empty={{
            title: "No blogs yet",
            body: "Course guides, career advice and campus stories.",
            action: isMain ? undefined : (
              <button onClick={openNew} className="admin-btn admin-btn-primary">
                <Plus size={16} /> Add Blog
              </button>
            ),
          }}
        />
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
          <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">
                {editing._id ? "Edit Blog" : "New Blog"}
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
              {/* Identity and publishing date first, then the cover, then the
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
                  label="Published on"
                  span={3}
                  type="date"
                  value={form.published_at}
                  onChange={(e) => set("published_at", e.target.value)}
                  required
                />
                <TextInput
                  label="Category"
                  span={4}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  list="blog-category-suggestions"
                  required
                />
                <datalist id="blog-category-suggestions">
                  {BLOG_CATEGORY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {/* No College field: authoring only happens inside a college
                    scope, so the college is fixed by the URL. */}
                <TextInput
                  label="Author"
                  span={8}
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="JCT Admissions Team"
                />
                <ImageUploadInput
                  label="Cover image"
                  span="full"
                  ratio="hero"
                  value={form.image}
                  onChange={(url) => set("image", url)}
                  hideUrlField
                />

                <TextArea
                  label="Excerpt (card summary)"
                  span={4}
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  rows={14}
                />
                <TextArea
                  label="Post content"
                  span={8}
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  rows={14}
                  hint="Shown on the blog detail page. Basic HTML is supported (<p>, <h2>, <ul>, <a>…) and is sanitized on render."
                />
                <div className="admin-col-full flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="b_active"
                    checked={form.is_active}
                    onChange={(e) => set("is_active", e.target.checked)}
                  />
                  <label htmlFor="b_active" className="text-sm text-gray-700">
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

export default function BlogsAdminPage() {
  return (
    <DeferredUploadsProvider>
      <Suspense fallback={null}>
        <BlogsPageInner />
      </Suspense>
    </DeferredUploadsProvider>
  );
}
