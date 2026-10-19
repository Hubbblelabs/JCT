"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Loader2, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  DataTable,
  PageShell,
  PublishBadge,
  StatusBadge,
  type Column,
} from "@/components/admin/kit";

type PageRow = {
  _id: string;
  slug: string;
  institution: "main" | "engineering" | "arts-science" | "polytechnic";
  title: string;
  template: string;
  status: "draft" | "published" | "archived";
  updated_at?: string;
  version: number;
  /** False when no navbar links to this page. Absent if navbars were unreadable. */
  in_navigation?: boolean;
};

const INSTITUTION_LABELS: Record<PageRow["institution"], string> = {
  main: "Main site",
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

const INSTITUTION_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All sites" },
  { value: "main", label: "Main site" },
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
  const toast = useToast();
  const confirm = useConfirm();
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
    const ok = await confirm({
      title: "Delete page",
      message: `Permanently delete "${title}"? This cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setDeletingId(id);
    try {
      const r = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (r.ok) {
        setRows((prev) => prev.filter((p) => p._id !== id));
        toast.success(`Deleted "${title}".`);
      } else toast.error("Failed to delete page.");
    } catch {
      toast.error("Failed to delete page.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: Column<PageRow>[] = [
    {
      key: "title",
      header: "Page",
      sortable: true,
      value: (r) => `${r.title} ${r.slug}`,
      render: (r) => (
        <div className="min-w-0">
          <p className="font-semibold text-[var(--admin-text)]">
            {r.title || "(untitled)"}
          </p>
          <p className="text-xs text-[var(--admin-text-muted)]">
            {publicPathFor(r.institution, r.slug)}
          </p>
        </div>
      ),
    },
    {
      key: "institution",
      header: "Site",
      sortable: true,
      hideOnMobile: true,
      value: (r) => INSTITUTION_LABELS[r.institution],
      render: (r) => INSTITUTION_LABELS[r.institution],
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      value: (r) => r.status,
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <PublishBadge status={r.status} />
          {/* A published page nothing links to is reachable only by direct
              URL — invisible to visitors, still indexed by search engines. */}
          {r.status === "published" && r.in_navigation === false && (
            <span title="No navbar links to this page — visitors can only reach it by typing the address.">
              <StatusBadge tone="info" label="Not in any menu" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: "template",
      header: "Layout",
      hideOnMobile: true,
      value: (r) => r.template,
      render: (r) => <span className="capitalize">{r.template}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div
          className="flex justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {r.status === "published" && (
            <a
              href={publicPathFor(r.institution, r.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-outline admin-btn-sm"
              title="View the live page"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={() => handleDelete(r._id, r.title)}
            disabled={deletingId === r._id}
            className="admin-btn admin-btn-danger admin-btn-sm"
            title="Delete page"
          >
            {deletingId === r._id ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Dynamic Pages"
      description="Stand-alone pages you create yourself, such as notices or one-off information pages. Click a page to edit it."
      actions={
        <button
          onClick={() => router.push("/admin/pages/new")}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={15} /> New Page
        </button>
      }
    >
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r._id}
        loading={loading}
        searchPlaceholder="Search by title or address…"
        onRowClick={(r) => router.push(`/admin/pages/${r._id}`)}
        initialSort={{ key: "title", dir: "asc" }}
        filters={
          <select
            aria-label="Filter by site"
            className="admin-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {INSTITUTION_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        }
        empty={{
          title: "No pages yet",
          body: "A dynamic page is a stand-alone page with its own address.",
          action: (
            <button
              onClick={() => router.push("/admin/pages/new")}
              className="admin-btn admin-btn-primary"
            >
              <Plus size={15} /> New Page
            </button>
          ),
        }}
      />
    </PageShell>
  );
}

export default function PagesListPage() {
  return (
    <Suspense fallback={<div className="admin-content">Loading…</div>}>
      <PagesInner />
    </Suspense>
  );
}
