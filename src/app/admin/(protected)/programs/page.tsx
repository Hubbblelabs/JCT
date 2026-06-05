"use client";

import { useEffect, useState, Suspense, type MouseEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, ChevronRight, Trash2, Loader2, Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface Program {
  _id: string;
  name: string;
  abbr: string;
  slug: string;
  institution: string;
  image: string;
  outcomes: string[];
  is_active: boolean;
  sort_order: number;
  status: "draft" | "published" | "archived";
}

function ProgramsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [filter, setFilter] = useState(() => searchParams.get("college") ?? "");
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/programs");
    const data = await r.json();
    if (Array.isArray(data)) setPrograms(data);
    else setPrograms([]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    setFilter(searchParams.get("college") ?? "");
  }, [searchParams]);

  const handleDelete = async (e: MouseEvent, program: Program) => {
    e.stopPropagation();
    const ok = await confirm({
      title: "Delete program",
      message: `Permanently delete "${program.name}"? This removes it completely and cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setDeletingId(program._id);
    try {
      const r = await fetch(`/api/admin/programs/${program._id}`, {
        method: "DELETE",
      });
      if (r.ok) {
        setPrograms((prev) => prev.filter((p) => p._id !== program._id));
        toast.success(`Deleted "${program.name}".`);
      } else {
        toast.error("Failed to delete program.");
      }
    } catch {
      toast.error("Failed to delete program.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNew = async () => {
    setCreatingNew(true);
    try {
      const college = filter || "engineering";
      // Generate unique slug from timestamp
      const timestamp = Date.now();
      const r = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Untitled Program",
          abbr: "UP",
          slug: `untitled-program-${timestamp}`,
          institution: college,
          image: "",
          outcomes: [],
          is_active: true,
          sort_order: 0,
          content: {},
        }),
      });
      if (r.ok) {
        const data = await r.json();
        router.push(`/admin/programs/${data._id}?college=${college}`);
      } else {
        toast.error("Failed to create program.");
        setCreatingNew(false);
      }
    } catch {
      toast.error("Failed to create program.");
      setCreatingNew(false);
    }
  };

  const q = query.trim().toLowerCase();
  const filtered = (programs || []).filter(
    (p) =>
      (!filter || p.institution === filter) &&
      (!q ||
        p.name.toLowerCase().includes(q) ||
        p.abbr.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)),
  );

  const collegeLabel =
    filter === "engineering"
      ? "Engineering"
      : filter === "arts-science"
        ? "Arts & Science"
        : filter === "polytechnic"
          ? "Polytechnic"
          : "All";

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Programs</h1>
          <p className="admin-page-subtitle">
            {filtered.filter((p) => p.is_active).length} active · {collegeLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs…"
              aria-label="Search programs by name, abbreviation, or slug"
              className="admin-input w-56 pl-9"
            />
          </div>
          <button
            onClick={handleCreateNew}
            disabled={creatingNew}
            className="admin-btn admin-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creatingNew ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Plus size={16} /> New Program
              </>
            )}
          </button>
        </div>
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
                <th>Program</th>
                <th>Institution</th>
                <th>Draft / Published</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    No programs found.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p._id} className="transition-colors hover:bg-gray-50">
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/programs/${p._id}?college=${p.institution}`,
                        )
                      }
                      className="text-left hover:underline"
                    >
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="mt-0.5 font-mono text-xs text-gray-400">
                        {p.abbr}
                      </div>
                    </button>
                  </td>
                  <td className="text-sm text-gray-600 capitalize">
                    {p.institution === "arts-science"
                      ? "Arts & Science"
                      : p.institution}
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        p.status === "published"
                          ? "admin-badge-green"
                          : p.status === "archived"
                            ? "admin-badge-red"
                            : "admin-badge-yellow"
                      }`}
                    >
                      {p.status ?? "draft"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${p.is_active ? "admin-badge-green" : "admin-badge-red"}`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, p)}
                        disabled={deletingId === p._id}
                        title="Delete program"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                      >
                        {deletingId === p._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/admin/programs/${p._id}?college=${p.institution}`,
                          )
                        }
                        title="Open CMS editor"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={null}>
      <ProgramsPageInner />
    </Suspense>
  );
}
