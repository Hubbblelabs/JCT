"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TextInput, TextArea, Select, ImageUploadInput } from "@/components/admin/inputs";
import { Plus, Pencil, Trash2, X, Loader2, Check } from "lucide-react";

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
  name: "", batch: "", course: "", company: "", quote: "",
  avatar: "", category: "Alumni", institution: "all",
  is_active: true, sort_order: 0,
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

function TestimonialsPageInner() {
  const searchParams = useSearchParams();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filterInst, setFilterInst] = useState(() => searchParams.get("college") ?? "");

  const load = async () => {
    setLoading(true);
    const url = filterInst ? `/api/admin/testimonials?institution=${filterInst}` : "/api/admin/testimonials";
    const r = await fetch(url);
    setTestimonials(await r.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterInst]);

  const openNew = () => { setEditing({ _id: "", ...EMPTY }); setForm(EMPTY); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ ...t }); };
  const close = () => { setEditing(null); setForm(EMPTY); };
  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    const isNew = !editing?._id;
    const url = isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${editing!._id}`;
    const r = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) { await load(); close(); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    await load();
  };

  const seed = async () => {
    setSeeding(true);
    await fetch("/api/admin/testimonials/seed", { method: "POST" });
    await load();
    setSeeding(false);
  };

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Testimonials & Stories</h1>
            <p className="admin-page-subtitle">{testimonials.filter((t) => t.is_active).length} active testimonials</p>
          </div>
          <div className="flex gap-2">
            <button onClick={seed} disabled={seeding} className="admin-btn admin-btn-outline admin-btn-sm">
              {seeding ? <Loader2 size={14} className="animate-spin" /> : null}
              Seed from data files
            </button>
            <button onClick={openNew} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add Testimonial
            </button>
          </div>
        </div>

        <div className="admin-card overflow-hidden p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Batch / Course</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>College</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {testimonials.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">No testimonials yet.</td></tr>
                )}
                {testimonials.map((t) => (
                  <tr key={t._id}>
                    <td className="font-medium">{t.name}</td>
                    <td className="text-sm text-gray-500">{t.batch}{t.course ? ` · ${t.course}` : ""}</td>
                    <td className="text-sm">{t.company || "—"}</td>
                    <td><span className="admin-badge admin-badge-blue">{t.category}</span></td>
                    <td className="text-sm capitalize text-gray-500">{t.institution}</td>
                    <td>
                      <span className={`admin-badge ${t.is_active ? "admin-badge-green" : "admin-badge-red"}`}>
                        {t.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(t)} className="admin-btn admin-btn-outline admin-btn-sm"><Pencil size={13} /></button>
                        <button onClick={() => del(t._id)} className="admin-btn admin-btn-danger admin-btn-sm"><Trash2 size={13} /></button>
                      </div>
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
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">{editing._id ? "Edit Testimonial" : "New Testimonial"}</h2>
              <button onClick={close} className="admin-btn admin-btn-outline admin-btn-sm"><X size={14} /></button>
            </div>
            <div className="p-6 space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
                <TextInput label="Batch (year)" value={form.batch} onChange={(e) => set("batch", e.target.value)} placeholder="2024" required />
                <TextInput label="Course" value={form.course} onChange={(e) => set("course", e.target.value)} placeholder="B.E. CSE" />
                <TextInput label="Company" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Infosys" />
                <Select label="Category" value={form.category} options={CATEGORIES} onChange={(e) => set("category", e.target.value)} />
                <ImageUploadInput label="Avatar" value={form.avatar} onChange={(url) => set("avatar", url)} uploadOnly />
              </div>
              <TextArea label="Quote" value={form.quote} onChange={(e) => set("quote", e.target.value)} required rows={4} />
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="t_active" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
                <label htmlFor="t_active" className="text-sm text-gray-700">Active (shown on website)</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button onClick={close} className="admin-btn admin-btn-outline">Cancel</button>
              <button onClick={save} disabled={saving} className="admin-btn admin-btn-gold">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TestimonialsPage() {
  return (
    <Suspense fallback={null}>
      <TestimonialsPageInner />
    </Suspense>
  );
}
