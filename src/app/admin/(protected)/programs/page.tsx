"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Loader2, ChevronRight } from "lucide-react";

interface Program {
  _id: string;
  name: string;
  abbr: string;
  slug: string;
  institution: string;
  degree: string;
  duration: string;
  seats: number;
  image: string;
  highlight: string;
  description: string;
  outcomes: string[];
  is_active: boolean;
  sort_order: number;
}

function ProgramsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [filter, setFilter] = useState(() => searchParams.get("college") ?? "");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/programs");
    const data = await r.json();
    if (Array.isArray(data)) setPrograms(data); else setPrograms([]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    setFilter(searchParams.get("college") ?? "");
  }, [searchParams]);

  const seed = async () => {
    setSeeding(true);
    await fetch("/api/admin/programs/seed", { method: "POST" });
    await load();
    setSeeding(false);
  };

  const filtered = (programs || []).filter((p) => !filter || p.institution === filter);

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
          <button
            onClick={seed}
            disabled={seeding}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : null}
            Seed from data files
          </button>
          <button
            onClick={() =>
              router.push(
                `/admin/programs/new${filter ? `?college=${filter}` : ""}`,
              )
            }
            className="admin-btn admin-btn-primary"
          >
            <Plus size={16} /> New Program
          </button>
        </div>
      </div>

      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Abbr</th>
                <th>Degree</th>
                <th>Duration</th>
                <th>Seats</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No programs found. Seed from data files to populate.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() =>
                    router.push(
                      `/admin/programs/${p._id}?college=${p.institution}`,
                    )
                  }
                >
                  <td>
                    <div className="font-medium text-gray-900">{p.name}</div>
                    {p.highlight && (
                      <div className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                        {p.highlight}
                      </div>
                    )}
                  </td>
                  <td className="font-mono text-sm text-gray-600">{p.abbr}</td>
                  <td className="text-sm text-gray-600">{p.degree}</td>
                  <td className="text-sm text-gray-500">{p.duration}</td>
                  <td className="text-sm text-gray-500">{p.seats}</td>
                  <td>
                    <span
                      className={`admin-badge ${p.is_active ? "admin-badge-green" : "admin-badge-red"}`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <ChevronRight size={16} className="text-gray-400" />
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
