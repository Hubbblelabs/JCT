"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Check, KeyRound, Loader2 } from "lucide-react";
import { Drawer } from "@/components/admin/kit/Drawer";
import { FormGrid, TextInput } from "@/components/admin/inputs";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { useToast } from "@/components/ui/Toast";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";

const EMPTY = { current: "", next: "", confirm: "" };

/**
 * The signed-in user's own password. Mounted by AdminShell rather than inside
 * the sidebar: the sidebar is transformed on a phone, and a transformed
 * ancestor becomes the containing block for this drawer's fixed backdrop.
 *
 * A change ends every session signed in before it — this one included — so on
 * success the form signs straight back in with the new password. If that
 * fails the session would lapse within a minute anyway, so it goes to the
 * login page now rather than mid-edit later.
 */
export function ChangePasswordDrawer({
  open,
  onClose,
  email,
}: {
  open: boolean;
  onClose: () => void;
  email: string;
}) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  // Never keep typed passwords around between openings.
  useEffect(() => {
    if (!open) {
      setForm(EMPTY);
      setApiError(null);
    }
  }, [open]);

  const mismatch = form.confirm !== "" && form.confirm !== form.next;
  const canSave =
    !saving &&
    form.current !== "" &&
    form.next.length >= 8 &&
    form.next === form.confirm;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setApiError(null);
    try {
      const r = await fetch("/api/admin/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: form.current,
          new_password: form.next,
        }),
      });
      if (!r.ok) {
        setApiError(
          r.status === 429
            ? ({
                error:
                  "Too many attempts. Wait a few minutes before trying again.",
              } as ApiErrorPayload)
            : await parseApiError(r),
        );
        return;
      }

      const again = await signIn("credentials", {
        email,
        password: form.next,
        redirect: false,
      });
      if (again?.error) {
        window.location.assign("/admin/login");
        return;
      }
      toast.success(
        "Password changed. Any other device signed in to this account is signed out.",
      );
      onClose();
    } catch (err) {
      setApiError({
        error: err instanceof Error ? err.message : "Request failed",
      } as ApiErrorPayload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      icon={KeyRound}
      eyebrow="Your account"
      title="Change password"
      description={email}
      resizable={false}
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="admin-btn admin-btn-outline">
            Cancel
          </button>
          <button
            type="submit"
            form="change-password-form"
            disabled={!canSave}
            className="admin-btn admin-btn-primary"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            {saving ? "Saving…" : "Change password"}
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

      <form
        id="change-password-form"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        {/* Lets a password manager file the new password under this account. */}
        <input
          type="email"
          name="username"
          autoComplete="username"
          value={email}
          readOnly
          hidden
        />
        <FormGrid>
          <TextInput
            label="Current password"
            span="full"
            type="password"
            autoComplete="current-password"
            value={form.current}
            onChange={(e) =>
              setForm((f) => ({ ...f, current: e.target.value }))
            }
            required
            autoFocus
          />
          <TextInput
            label="New password"
            span={6}
            type="password"
            autoComplete="new-password"
            value={form.next}
            onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))}
            required
            minLength={8}
            hint="At least 8 characters."
          />
          <TextInput
            label="Confirm new password"
            span={6}
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirm: e.target.value }))
            }
            required
            aria-invalid={mismatch || undefined}
            hint={mismatch ? "Does not match the new password." : undefined}
          />
        </FormGrid>
      </form>
    </Drawer>
  );
}
