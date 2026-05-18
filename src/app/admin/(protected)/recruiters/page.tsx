"use client";

import { useEffect, useState } from "react";
import { TextInput, ImageUploadInput } from "@/components/admin/inputs";
import { Plus, Pencil, Trash2, X, Loader2, Check } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface Recruiter {
  _id: string;
  name: string;
  logo: string;
  website: string;
  industry: string;
  is_active: boolean;
}

const EMPTY: Omit<Recruiter, "_id"> = {
  name: "", logo: "", website: "", industry: "", is_active: true,
};

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Recruiter | null>(null);
  const [form, setForm] = useState<Omit<Recruiter, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/recruiters");
    setRecruiters(await r.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ _id: "", ...EMPTY }); setForm(EMPTY); };
  const openEdit = (r: Recruiter) => { setEditing(r); setForm({ ...r }); };
  const close = () => { setEditing(null); setForm(EMPTY); };
  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    const isNew = !editing?._id;
    const url = isNew ? "/api/admin/recruiters" : `/api/admin/recruiters/${editing!._id}`;
    const r = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) { await load(); close(); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this recruiter?")) return;
    await fetch(`/api/admin/recruiters/${id}`, { method: "DELETE" });
    await load();
  };

  const seed = async () => {
    setSeeding(true);
    await fetch("/api/admin/recruiters/seed", { method: "POST" });
    await load();
    setSeeding(false);
  };

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Recruiters & Company Partners</h1>
            <p className="admin-page-subtitle">{recruiters.filter((r) => r.is_active).length} active companies</p>
          </div>
          <div className="flex gap-2">
            <button onClick={seed} disabled={seeding} className="admin-btn admin-btn-outline admin-btn-sm">
              {seeding ? <Loader2 size={14} className="animate-spin" /> : null}
              Seed from data files
            </button>
            <button onClick={openNew} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add Recruiter
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
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Industry</th>
                  <th>Website</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recruiters.length === 0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400">No recruiters yet. Seed from data files or add manually.</td></tr>
                )}
                {recruiters.map((r) => (
                  <tr key={r._id}>
                    <td>
                      {r.logo ? (
                        <div className="h-8 w-20">
                          <img src={getImageUrl(r.logo) || ""} alt={r.name} className="h-full w-full object-contain" />
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">No logo</span>
                      )}
                    </td>
                    <td className="font-medium">{r.name}</td>
                    <td className="text-gray-500 text-sm">{r.industry || "—"}</td>
                    <td className="text-gray-500 text-sm">{r.website || "—"}</td>
                    <td>
                      <span className={`admin-badge ${r.is_active ? "admin-badge-green" : "admin-badge-red"}`}>
                        {r.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(r)} className="admin-btn admin-btn-outline admin-btn-sm"><Pencil size={13} /></button>
                        <button onClick={() => del(r._id)} className="admin-btn admin-btn-danger admin-btn-sm"><Trash2 size={13} /></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">{editing._id ? "Edit Recruiter" : "New Recruiter"}</h2>
              <button onClick={close} className="admin-btn admin-btn-outline admin-btn-sm"><X size={14} /></button>
            </div>
            <div className="p-6 space-y-1">
              <TextInput label="Company Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
              <ImageUploadInput label="Logo" value={form.logo} onChange={(url) => set("logo", url)} uploadOnly />
              <TextInput label="Website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://tcs.com" />
              <TextInput label="Industry" value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="IT Services" />
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active (shown on website)</label>
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
