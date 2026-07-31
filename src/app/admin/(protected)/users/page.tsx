"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Field,
  FormGrid,
  TextInput,
  Select,
} from "@/components/admin/inputs";
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { PageShell } from "@/components/admin/kit/PageShell";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import { Drawer } from "@/components/admin/kit/Drawer";
import { Banner, StatusBadge } from "@/components/admin/kit/primitives";

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

type Form = {
  email: string;
  full_name: string;
  password: string;
  role: string;
  institution: string;
  is_active: boolean;
};

const EMPTY: Form = {
  email: "",
  full_name: "",
  password: "",
  role: "editor",
  institution: "engineering",
  is_active: true,
};

const ROLES = [
  { value: "editor", label: "Editor — one college" },
  { value: "admin", label: "Admin — everything" },
];

const EDITOR_INSTITUTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "arts-science", label: "Arts & Science" },
  { value: "polytechnic", label: "Polytechnic" },
];

const instLabel = (v: string) =>
  v === "all"
    ? "All colleges"
    : (EDITOR_INSTITUTIONS.find((i) => i.value === v)?.label ?? v);

export default function UsersPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // One form for both create and edit. The two flows were separate components
  // with separate state, separate error channels and separate copies of the
  // role/institution coupling rule — so a fix to one silently skipped the other.
  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const r = await fetch("/api/admin/users");
      if (!r.ok) throw new Error(`Request failed (${r.status})`);
      const data = await r.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUsers([]);
      setLoadError(err instanceof Error ? err.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const set = (key: keyof Form, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  /** Admins are stored with institution "all"; editors must name one college. */
  const setRole = (role: string) =>
    setForm((f) => ({
      ...f,
      role,
      institution:
        role === "admin"
          ? "all"
          : f.institution === "all"
            ? "engineering"
            : f.institution,
    }));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setApiError(null);
    setOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({
      email: u.email,
      full_name: u.full_name,
      password: "",
      role: u.role,
      institution:
        u.role === "admin"
          ? "all"
          : u.institution === "all"
            ? "engineering"
            : u.institution,
      is_active: u.is_active,
    });
    setApiError(null);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    setApiError(null);
  };

  const save = async () => {
    setSaving(true);
    setApiError(null);
    try {
      const isNew = !editing;
      const body: Record<string, unknown> = isNew
        ? {
            email: form.email,
            full_name: form.full_name,
            password: form.password,
            role: form.role,
            institution: form.institution,
          }
        : {
            full_name: form.full_name,
            role: form.role,
            institution: form.institution,
            is_active: form.is_active,
          };
      // Only send a password on edit when one was actually typed — an empty
      // string would otherwise overwrite the stored hash.
      if (!isNew && form.password) body.password = form.password;

      const r = await fetch(
        isNew ? "/api/admin/users" : `/api/admin/users/${editing._id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (r.ok) {
        toast.success(isNew ? "User created." : "User updated.");
        await load();
        close();
      } else {
        setApiError(await parseApiError(r));
      }
    } catch (err) {
      setApiError({
        error: err instanceof Error ? err.message : "Request failed",
      } as ApiErrorPayload);
    }
    setSaving(false);
  };

  const remove = async (u: User) => {
    const ok = await confirm({
      title: "Delete this account",
      message: `${u.full_name || u.email} will be removed permanently and cannot sign in again. This cannot be undone — their past changes stay in the audit log.`,
      confirmLabel: "Delete permanently",
      destructive: true,
    });
    if (!ok) return;
    const r = await fetch(`/api/admin/users/${u._id}`, { method: "DELETE" });
    if (r.ok) {
      toast.success("Account deleted.");
      await load();
    } else {
      const payload = await parseApiError(r);
      toast.error(
        payload?.message ?? payload?.error ?? "Could not delete this account.",
      );
    }
  };

  const columns: Column<User>[] = [
    {
      key: "full_name",
      header: "Person",
      sortable: true,
      value: (u) => `${u.full_name} ${u.email}`,
      render: (u) => (
        <span className="block">
          <span className="block font-medium text-[var(--admin-text)]">
            {u.full_name || "—"}
          </span>
          <span className="admin-help block">{u.email}</span>
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      value: (u) => u.role,
      render: (u) => (
        <StatusBadge tone="info" label={u.role} icon={<Shield size={11} />} />
      ),
    },
    {
      key: "institution",
      header: "Can edit",
      sortable: true,
      hideOnMobile: true,
      value: (u) => instLabel(u.institution),
      render: (u) => (
        <span className="text-[var(--admin-text-secondary)]">
          {instLabel(u.institution)}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Access",
      sortable: true,
      value: (u) => (u.is_active ? 1 : 0),
      render: (u) => (
        <StatusBadge
          tone={u.is_active ? "active" : "inactive"}
          label={u.is_active ? "Active" : "Revoked"}
        />
      ),
    },
    {
      key: "last_login",
      header: "Last signed in",
      sortable: true,
      hideOnMobile: true,
      value: (u) => (u.last_login ? +new Date(u.last_login) : 0),
      render: (u) => (
        <span className="text-[length:var(--admin-text-sm)] text-[var(--admin-text-faint)]">
          {u.last_login
            ? new Date(u.last_login).toLocaleDateString("en-IN")
            : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "1%",
      render: (u) => (
        <span className="flex justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(u);
            }}
            className="admin-btn admin-btn-outline admin-btn-sm"
            aria-label={`Edit ${u.full_name || u.email}`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              void remove(u);
            }}
            className="admin-btn admin-btn-danger admin-btn-sm"
            aria-label={`Delete ${u.full_name || u.email}`}
          >
            <Trash2 size={13} />
          </button>
        </span>
      ),
    },
  ];

  return (
    <PageShell
      title="People"
      description="Who can sign in to this panel and what they are allowed to change. Editors are limited to one college; admins can edit everything."
      actions={
        <button onClick={openNew} className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add person
        </button>
      }
    >
      {loadError && (
        <div className="mb-4">
          <Banner
            tone="danger"
            title="Could not load users"
            action={
              <button
                onClick={() => void load()}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                Retry
              </button>
            }
          >
            {loadError}
          </Banner>
        </div>
      )}

      <DataTable
        rows={users}
        columns={columns}
        rowKey={(u) => u._id}
        loading={loading}
        searchPlaceholder="Search by name or email…"
        onRowClick={openEdit}
        initialSort={{ key: "full_name", dir: "asc" }}
        empty={{
          title: "No accounts yet",
          body: "Add the people who will maintain the site. Give each one the narrowest role that lets them do their job.",
          action: (
            <button onClick={openNew} className="admin-btn admin-btn-primary">
              <UserPlus size={15} /> Add the first person
            </button>
          ),
        }}
      />

      <Drawer
        open={open}
        onClose={close}
        icon={Users}
        eyebrow={editing ? "Edit" : "New"}
        title={editing ? editing.email : "Add a person"}
        description={
          editing
            ? "Changes take effect the next time they load a page."
            : "They will sign in at /admin/login with this email and password."
        }
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
              {saving ? "Saving…" : editing ? "Save changes" : "Create account"}
            </button>
          </div>
        }
      >
        {apiError && (
          <ValidationErrors
            error={apiError.message ?? apiError.error}
            details={apiError.details}
          />
        )}

        {/* Identity, then credentials, then what they are allowed to touch. */}
        <FormGrid>
          <TextInput
            label="Full name"
            span={editing ? 6 : 4}
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            required
          />

          {!editing && (
            <TextInput
              label="Email"
              span={4}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
              hint="This is also their sign-in name and cannot be changed later."
            />
          )}

          <TextInput
            label={editing ? "New password" : "Password"}
            span={editing ? 6 : 4}
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required={!editing}
            autoComplete="new-password"
            hint={
              editing
                ? "Leave blank to keep their current password."
                : "At least 8 characters."
            }
          />

          <Select
            label="Role"
            span={6}
            value={form.role}
            options={ROLES}
            onChange={(e) => setRole(e.target.value)}
            hint="Admins can also manage people, settings and the audit log."
          />

          {form.role === "editor" ? (
            <Select
              label="College they can edit"
              span={6}
              value={form.institution}
              options={EDITOR_INSTITUTIONS}
              onChange={(e) => set("institution", e.target.value)}
              hint="They will not be able to open or change any other college's content."
            />
          ) : (
            <Field label="Access" span={6}>
              <Banner tone="warning" title="Full access">
                Admins can edit every college, manage accounts, and restore or
                reset site configuration.
              </Banner>
            </Field>
          )}

          {editing && (
            <Field label="Sign-in" span="full">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                />
                <span className="text-[length:var(--admin-text-body)] text-[var(--admin-text-secondary)]">
                  Allow this person to sign in
                </span>
              </label>
            </Field>
          )}
        </FormGrid>
      </Drawer>
    </PageShell>
  );
}
