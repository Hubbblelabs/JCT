"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TextInput, NumberInput, TextArea, Select, StringList, Accordion, ImageUploadInput } from "@/components/admin/inputs";
import { Plus, Pencil, Trash2, X, Loader2, Check } from "lucide-react";

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

const EMPTY: Omit<Program, "_id"> = {
  name: "", abbr: "", slug: "", institution: "engineering",
  degree: "", duration: "", seats: 60, image: "", highlight: "",
  description: "", outcomes: [], is_active: true, sort_order: 0,
};

const INSTITUTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "arts-science", label: "Arts & Science" },
  { value: "polytechnic", label: "Polytechnic" },
];

function ProgramsPageInner() {
  const searchParams = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState<Omit<Program, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filter, setFilter] = useState(() => searchParams.get("college") ?? "");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/programs");
    const data = await r.json();
    setPrograms(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ _id: "", ...EMPTY }); setForm(EMPTY); };
  const openEdit = (p: Program) => { setEditing(p); setForm({ ...p }); };
  const close = () => { setEditing(null); setForm(EMPTY); };
  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    const isNew = !editing?._id;
    const url = isNew ? "/api/admin/programs" : `/api/admin/programs/${editing!._id}`;
    const method = isNew ? "POST" : "PATCH";
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) { await load(); close(); }
    setSaving(false);
  };

  const deactivate = async (id: string) => {
    if (!confirm("Deactivate this program?")) return;
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
    await load();
  };

  const seed = async () => {
    setSeeding(true);
    await fetch("/api/admin/programs/seed", { method: "POST" });
    await load();
    setSeeding(false);
  };

  const filtered = programs.filter(
    (p) => !filter || p.institution === filter,
  );

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Programs & Courses</h1>
            <p className="admin-page-subtitle">{programs.filter((p) => p.is_active).length} active programs</p>
          </div>
          <div className="flex gap-2">
            <button onClick={seed} disabled={seeding} className="admin-btn admin-btn-outline admin-btn-sm">
              {seeding ? <Loader2 size={14} className="animate-spin" /> : null}
              Seed from data files
            </button>
            <button onClick={openNew} className="admin-btn admin-btn-primary">
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
                  <th>Name</th>
                  <th>Abbr</th>
                  <th>College</th>
                  <th>Degree</th>
                  <th>Duration</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center text-gray-400">No programs found.</td></tr>
                )}
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td className="font-medium">{p.name}</td>
                    <td className="font-mono text-sm">{p.abbr}</td>
                    <td className="capitalize">{p.institution}</td>
                    <td className="text-gray-500 text-sm">{p.degree}</td>
                    <td className="text-gray-500 text-sm">{p.duration}</td>
                    <td>{p.seats}</td>
                    <td>
                      <span className={`admin-badge ${p.is_active ? "admin-badge-green" : "admin-badge-red"}`}>
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="admin-btn admin-btn-outline admin-btn-sm">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deactivate(p._id)} className="admin-btn admin-btn-danger admin-btn-sm">
                          <Trash2 size={13} />
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

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">{editing._id ? "Edit Program" : "New Program"}</h2>
              <button onClick={close} className="admin-btn admin-btn-outline admin-btn-sm"><X size={14} /></button>
            </div>
            <div className="p-6">
              <Accordion title="Basic Info" defaultOpen>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput label="Program Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
                  <TextInput label="Abbreviation" value={form.abbr} onChange={(e) => set("abbr", e.target.value)} placeholder="CSE" required />
                  <TextInput label="Slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="cse" required />
                  <Select label="College" value={form.institution} options={INSTITUTIONS} onChange={(e) => set("institution", e.target.value)} required />
                  <TextInput label="Degree" value={form.degree} onChange={(e) => set("degree", e.target.value)} placeholder="B.E." />
                  <TextInput label="Duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="4 Years" />
                  <NumberInput label="Seats" value={form.seats} onChange={(e) => set("seats", parseInt(e.target.value))} />
                  <ImageUploadInput label="Program Image" value={form.image} onChange={(url) => set("image", url)} />
                </div>
                <TextInput label="Highlight" value={form.highlight} onChange={(e) => set("highlight", e.target.value)} hint="Short tagline shown on card" />
                <TextArea label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
              </Accordion>
              <Accordion title="Program Outcomes">
                <StringList label="Outcomes" values={form.outcomes} onChange={(v) => set("outcomes", v)} placeholder="Students will be able to..." />
              </Accordion>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button onClick={close} className="admin-btn admin-btn-outline">Cancel</button>
              <button onClick={save} disabled={saving} className="admin-btn admin-btn-gold">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                {saving ? "Saving…" : "Save Program"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={null}>
      <ProgramsPageInner />
    </Suspense>
  );
}
