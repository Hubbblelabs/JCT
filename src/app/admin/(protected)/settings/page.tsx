"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Download,
  Upload,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  FileJson,
} from "lucide-react";

interface BackupFile {
  version: string;
  exported_at: string;
  exported_by: string;
  configs: Array<{ config_key: string; status: string }>;
}

type Status = { type: "success" | "error" | "warning"; message: string };

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as Record<string, unknown>)?.role as string;

  // Redirect non-super-admin users away
  if (status === "authenticated" && role !== "super_admin") {
    redirect("/admin/dashboard");
  }

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<BackupFile | null>(null);
  const [fileError, setFileError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");
  const [exportStatus, setExportStatus] = useState<Status | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<Status | null>(null);
  const [resetStatus, setResetStatus] = useState<Status | null>(null);

  if (status === "loading") {
    return (
      <div className="admin-content flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const handleExport = async () => {
    setExporting(true);
    setExportStatus(null);
    try {
      const res = await fetch("/api/admin/site-config/backup");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setExportStatus({
          type: "error",
          message: (err as Record<string, string>).error ?? "Export failed",
        });
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "jct-site-config.json";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus({ type: "success", message: "Backup downloaded." });
    } catch {
      setExportStatus({ type: "error", message: "Export failed. Try again." });
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreview(null);
    setFileError("");
    setRestoreStatus(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as BackupFile;
        if (!Array.isArray(parsed.configs)) throw new Error("Invalid format");
        setPreview(parsed);
      } catch {
        setFileError("Invalid backup file — expected JCT site config JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!preview) return;
    setRestoring(true);
    setRestoreStatus(null);
    try {
      const res = await fetch("/api/admin/site-config/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: preview.configs }),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        const details = (data.details as string[] | undefined)?.join("; ");
        setRestoreStatus({
          type: "error",
          message: `Restore failed: ${details ?? (data.error as string)}`,
        });
        return;
      }
      const msg =
        `Restored ${data.restored as number} entries.` +
        ((data.skipped as number) > 0
          ? ` ${data.skipped as number} entries skipped (unknown keys).`
          : "");
      setRestoreStatus({
        type: (data.skipped as number) > 0 ? "warning" : "success",
        message: msg,
      });
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setRestoreStatus({
        type: "error",
        message: "Restore failed. Try again.",
      });
    } finally {
      setRestoring(false);
    }
  };

  const handleReset = async () => {
    if (resetConfirm !== "RESET") return;
    setResetting(true);
    setResetStatus(null);
    try {
      const res = await fetch("/api/admin/site-config/reset", {
        method: "POST",
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        setResetStatus({
          type: "error",
          message: (data.error as string) ?? "Reset failed",
        });
        return;
      }
      setResetStatus({
        type: "success",
        message: `All site configs cleared (${data.deleted as number} entries deleted). Pages will serve defaults until reconfigured.`,
      });
      setResetConfirm("");
    } catch {
      setResetStatus({ type: "error", message: "Reset failed. Try again." });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Settings</h1>
          <p className="admin-page-subtitle">
            Backup, restore, or reset all site configuration data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Export ── */}
        <div className="admin-card">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Download size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Export Backup</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Download all site config entries as a JSON file. Includes draft
                and published values for every key.
              </p>
            </div>
          </div>
          <StatusBanner status={exportStatus} />
          <button
            onClick={handleExport}
            disabled={exporting}
            className="admin-btn admin-btn-primary"
          >
            {exporting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {exporting ? "Exporting…" : "Download Backup"}
          </button>
        </div>

        {/* ── Restore ── */}
        <div className="admin-card">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <Upload size={18} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                Restore from Backup
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Upload a previously exported JSON file. Existing configs are
                overwritten; unknown keys are skipped. All public pages are
                revalidated after restore.
              </p>
            </div>
          </div>

          <StatusBanner status={restoreStatus} />

          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                Backup file (.json)
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
              />
            </label>

            {fileError && <p className="text-sm text-red-600">{fileError}</p>}

            {preview && (
              <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <FileJson size={14} />
                  Backup preview
                </div>
                <p className="text-gray-500">
                  Exported:{" "}
                  {new Date(preview.exported_at).toLocaleString("en-IN")}
                </p>
                <p className="text-gray-500">By: {preview.exported_by}</p>
                <p className="text-gray-500">
                  {preview.configs.length} config entries
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {preview.configs.map((c) => (
                    <span
                      key={c.config_key}
                      className="admin-badge admin-badge-gray text-[11px]"
                    >
                      {c.config_key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleRestore}
              disabled={!preview || restoring}
              className="admin-btn admin-btn-gold"
            >
              {restoring ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Upload size={15} />
              )}
              {restoring ? "Restoring…" : "Restore Backup"}
            </button>
          </div>
        </div>

        {/* ── Reset ── */}
        <div className="admin-card border-red-200 bg-red-50/30 lg:col-span-2">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <ShieldAlert size={18} className="text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-red-800">Reset All Configs</h2>
              <p className="mt-0.5 text-sm text-red-700/80">
                Permanently deletes every site config entry from the database.
                Public pages will revert to hard-coded defaults until
                reconfigured. This cannot be undone — export a backup first.
              </p>
            </div>
          </div>

          <StatusBanner status={resetStatus} />

          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-red-700">
                Type <strong>RESET</strong> to confirm
              </span>
              <input
                type="text"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                placeholder="RESET"
                className="admin-input max-w-xs border-red-200 focus:ring-red-300"
              />
            </label>
            <button
              onClick={handleReset}
              disabled={resetConfirm !== "RESET" || resetting}
              className="admin-btn admin-btn-danger"
            >
              {resetting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              {resetting ? "Resetting…" : "Reset All Site Configs"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBanner({ status }: { status: Status | null }) {
  if (!status) return null;
  const styles = {
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  const Icon =
    status.type === "success"
      ? CheckCircle
      : status.type === "warning"
        ? AlertTriangle
        : AlertTriangle;
  return (
    <div
      className={`mb-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${styles[status.type]}`}
    >
      <Icon size={15} className="mt-0.5 shrink-0" />
      {status.message}
    </div>
  );
}
