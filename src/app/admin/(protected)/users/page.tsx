"use client";

import { useEffect, useState } from "react";
import { TextInput, Select } from "@/components/admin/inputs";
import { Plus, Pencil, Trash2, X, Loader2, Check, Shield } from "lucide-react";

interface User {
  _id: string;
  email: string;
  full_name: string;
  role: string;
  institution: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

const EMPTY_NEW = { email: "", full_name: "", password: "", role: "editor", institution: "all" };
const EMPTY_EDIT = { full_name: "", role: "editor", institution: "all", is_active: true, password: "" };

const ROLES = [
  { value: "viewer", label: "Viewer (read-only)" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

const INSTITUTIONS = [
  { value: "all", label: "All Colleges" },
  { value: "engineering", label: "Engineering" },
  { value: "arts-science", label: "Arts & Science" },
  { value: "polytechnic", label: "Polytechnic" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newForm, setNewForm] = useState(EMPTY_NEW);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editMsg, setEditMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/users");
    if (r.ok) setUsers(await r.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setN = (key: string, val: unknown) => setNewForm((f) => ({ ...f, [key]: val }));
  const setE = (key: string, val: unknown) => setEditForm((f) => ({ ...f, [key]: val }));

  const openEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({ full_name: u.full_name, role: u.role, institution: u.institution, is_active: u.is_active, password: "" });
    setEditMsg("");
  };

  const createUser = async () => {
    setSaving(true);
    setMsg("");
    const r = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    const data = await r.json();
    if (r.ok) {
      setShowNew(false);
      setNewForm(EMPTY_NEW);
      await load();
    } else {
      setMsg(data.error ?? "Error creating user");
    }
    setSaving(false);
  };

  const updateUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    setEditMsg("");
    const body: Record<string, unknown> = {
      full_name: editForm.full_name,
      role: editForm.role,
      institution: editForm.institution,
      is_active: editForm.is_active,
    };
    if (editForm.password) body.password = editForm.password;
    const r = await fetch(`/api/admin/users/${editingUser._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (r.ok) {
      setEditingUser(null);
      await load();
    } else {
      setEditMsg(data.error ?? "Error updating user");
    }
    setSaving(false);
  };

  const deactivate = async (id: string) => {
    if (!confirm("Deactivate this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Admin Users</h1>
            <p className="admin-page-subtitle">{users.filter((u) => u.is_active).length} active users</p>
          </div>
          <button onClick={() => setShowNew(true)} className="admin-btn admin-btn-primary">
            <Plus size={16} /> New User
          </button>
        </div>

        {msg && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{msg}</p>}

        <div className="admin-card overflow-hidden p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>College</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-medium">{u.full_name}</td>
                    <td className="text-gray-600">{u.email}</td>
                    <td>
                      <span className="admin-badge admin-badge-blue capitalize flex items-center gap-1 w-fit">
                        <Shield size={10} />
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="capitalize text-gray-500 text-sm">{u.institution}</td>
                    <td>
                      <span className={`admin-badge ${u.is_active ? "admin-badge-green" : "admin-badge-red"}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString("en-IN") : "Never"}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="admin-btn admin-btn-outline admin-btn-sm">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deactivate(u._id)} className="admin-btn admin-btn-danger admin-btn-sm">
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

      {/* New user modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">New Admin User</h2>
              <button onClick={() => { setShowNew(false); setMsg(""); }} className="admin-btn admin-btn-outline admin-btn-sm"><X size={14} /></button>
            </div>
            <div className="p-6 space-y-1">
              <TextInput label="Full Name" value={newForm.full_name} onChange={(e) => setN("full_name", e.target.value)} required />
              <TextInput label="Email" type="email" value={newForm.email} onChange={(e) => setN("email", e.target.value)} required />
              <TextInput label="Password" type="password" value={newForm.password} onChange={(e) => setN("password", e.target.value)} required hint="Min 8 characters" />
              <Select label="Role" value={newForm.role} options={ROLES} onChange={(e) => setN("role", e.target.value)} />
              <Select label="College Access" value={newForm.institution} options={INSTITUTIONS} onChange={(e) => setN("institution", e.target.value)} />
              {msg && <p className="text-sm text-red-600">{msg}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button onClick={() => { setShowNew(false); setMsg(""); }} className="admin-btn admin-btn-outline">Cancel</button>
              <button onClick={createUser} disabled={saving} className="admin-btn admin-btn-gold">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                {saving ? "Creating…" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Edit User — {editingUser.email}</h2>
              <button onClick={() => setEditingUser(null)} className="admin-btn admin-btn-outline admin-btn-sm"><X size={14} /></button>
            </div>
            <div className="p-6 space-y-1">
              <TextInput label="Full Name" value={editForm.full_name} onChange={(e) => setE("full_name", e.target.value)} required />
              <Select label="Role" value={editForm.role} options={ROLES} onChange={(e) => setE("role", e.target.value)} />
              <Select label="College Access" value={editForm.institution} options={INSTITUTIONS} onChange={(e) => setE("institution", e.target.value)} />
              <TextInput label="New Password" type="password" value={editForm.password} onChange={(e) => setE("password", e.target.value)} hint="Leave blank to keep current password" />
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="edit_active" checked={editForm.is_active} onChange={(e) => setE("is_active", e.target.checked)} />
                <label htmlFor="edit_active" className="text-sm text-gray-700">Active</label>
              </div>
              {editMsg && <p className="text-sm text-red-600">{editMsg}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button onClick={() => setEditingUser(null)} className="admin-btn admin-btn-outline">Cancel</button>
              <button onClick={updateUser} disabled={saving} className="admin-btn admin-btn-gold">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
