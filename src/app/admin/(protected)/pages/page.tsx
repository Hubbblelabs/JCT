"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Loader2,
  Trash2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

type PageRow = {
  _id: string;
  slug: string;
  institution: "main" | "engineering" | "arts-science" | "polytechnic";
  title: string;
  template: string;
  status: "draft" | "published" | "archived";
  updated_at?: string;
  version: number;
};

const INSTITUTION_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "main", label: "Main" },
  { value: "engineering", label: "Engineering" },
  { value: "arts-science", label: "Arts & Science" },
  { value: "polytechnic", label: "Polytechnic" },
];

function publicPathFor(institution: string, slug: string): string {
  if (institution === "main") return `/p/${slug}`;
  return `/institutions/${institution}/p/${slug}`;
}

function PagesInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(
    () => searchParams.get("institution") ?? "",
  );

  const load = async () => {
    setLoading(true);
    const qs = filter ? `?institution=${filter}` : "";
    const r = await fetch(`/api/admin/pages${qs}`);
    const data = await r.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`))
      return;
    setDeletingId(id);
    try {
      const r = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (r.ok) setRows((prev) => prev.filter((p) => p._id !== id));
      else alert("Failed to delete page.");
    } catch {
      alert("Failed to delete page.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dynamic Pages</h1>
          <p className="admin-page-subtitle">
            Create and manage custom pages reachable via /p/&lt;slug&gt; (main)
            or /institutions/&lt;inst&gt;/p/&lt;slug&gt; (per-institution).
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/pages/new")}
          className="admin-btn admin-btn-gold"
        >
          <Plus size={15} /> New Page
        </button>
      </div>

      <div className="admin-card mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Institution</label>
        <select
          className="admin-select max-w-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {INSTITUTION_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No pages yet. Click &quot;New Page&quot; to create one.
          </p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row._id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
              >
                <Link
                  href={`/admin/pages/${row._id}`}
                  className="flex flex-1 items-center gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {row.title || "(untitled)"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                          row.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.status}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-600 uppercase">
                        {row.template}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {row.institution} · /{row.slug} · v{row.version}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-gray-400"
                  />
                </Link>
                {row.status === "published" && (
                  <a
                    href={publicPathFor(row.institution, row.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-outline admin-btn-sm"
                    title="View public page"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(row._id, row.title)}
                  disabled={deletingId === row._id}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  {deletingId === row._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PagesListPage() {
  return (
    <Suspense fallback={<div className="admin-content">Loading…</div>}>
      <PagesInner />
    </Suspense>
  );
}
