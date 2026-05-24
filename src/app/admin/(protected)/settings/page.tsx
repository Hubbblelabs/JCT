"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import JSZip from "jszip";
import {
  Download,
  Upload,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  FileArchive,
  Image,
  FileText,
} from "lucide-react";

interface BackupPreview {
  exportedAt: string;
  exportedBy: string;
  configCount: number;
  imageCount: number;
  docCount: number;
}

type Status = { type: "success" | "error" | "warning"; message: string };

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as Record<string, unknown>)?.role as string;

  if (status === "authenticated" && role !== "admin") {
    redirect("/admin/dashboard");
  }

  const fileRef = useRef<HTMLInputElement>(null);

  // Export state
  const [includeImages, setIncludeImages] = useState(false);
  const [includeDocs, setIncludeDocs] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<Status | null>(null);

  // Restore state
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<Status | null>(null);

  // Reset state
  const [resetting, setResetting] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");
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
      const params = new URLSearchParams();
      if (includeImages) params.set("includeImages", "1");
      if (includeDocs) params.set("includeDocs", "1");
      const qs = params.toString();
      const res = await fetch(
        `/api/admin/site-config/backup${qs ? `?${qs}` : ""}`,
      );
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
      const filename = match?.[1] ?? "jct-backup.zip";
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreview(null);
    setRestoreFile(null);
    setFileError("");
    setRestoreStatus(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setFileError("Invalid file — expected a .zip backup archive.");
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const configFile = zip.file("site-config.json");
      if (!configFile) {
        setFileError("Invalid backup — ZIP does not contain site-config.json.");
        return;
      }
      const configData = JSON.parse(await configFile.async("string")) as {
        exported_at?: string;
        exported_by?: string;
        configs?: unknown[];
      };
      const configCount = Array.isArray(configData.configs)
        ? configData.configs.length
        : 0;

      let imageCount = 0;
      const imageMetaFile = zip.file("images/_metadata.json");
      if (imageMetaFile) {
        const meta = JSON.parse(
          await imageMetaFile.async("string"),
        ) as unknown[];
        imageCount = Array.isArray(meta) ? meta.length : 0;
      }

      let docCount = 0;
      const docMetaFile = zip.file("documents/_metadata.json");
      if (docMetaFile) {
        const meta = JSON.parse(await docMetaFile.async("string")) as unknown[];
        docCount = Array.isArray(meta) ? meta.length : 0;
      }

      setPreview({
        exportedAt: configData.exported_at ?? "",
        exportedBy: configData.exported_by ?? "",
        configCount,
        imageCount,
        docCount,
      });
      setRestoreFile(file);
    } catch {
      setFileError("Could not read ZIP file — the archive may be corrupted.");
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) return;
    setRestoring(true);
    setRestoreStatus(null);
    try {
      const body = new FormData();
      body.append("file", restoreFile);
      const res = await fetch("/api/admin/site-config/restore", {
        method: "POST",
        body,
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
      const parts = [`${data.restored as number} config entries`];
      if ((data.images_restored as number) > 0)
        parts.push(`${data.images_restored as number} images`);
      if ((data.documents_restored as number) > 0)
        parts.push(`${data.documents_restored as number} documents`);
      const warnings = data.warnings as string[] | undefined;
      const msg = `Restored: ${parts.join(", ")}.${warnings?.length ? ` ${warnings.length} warning(s).` : ""}`;
      setRestoreStatus({
        type: warnings?.length ? "warning" : "success",
        message: msg,
      });
      setPreview(null);
      setRestoreFile(null);
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
      const parts: string[] = [`${data.deleted as number} config entries`];
      if ((data.images_deleted as number) > 0)
        parts.push(`${data.images_deleted as number} images`);
      if ((data.documents_deleted as number) > 0)
        parts.push(`${data.documents_deleted as number} documents`);
      const r2Warn =
        (data.r2_failures as number) > 0
          ? ` ${data.r2_failures as number} R2 file(s) could not be deleted — remove them manually.`
          : "";
      setResetStatus({
        type: (data.r2_failures as number) > 0 ? "warning" : "success",
        message: `Deleted: ${parts.join(", ")}.${r2Warn} Pages will serve defaults until reconfigured.`,
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
                Download a ZIP archive containing all site config entries plus
                any selected assets.
              </p>
            </div>
          </div>

          {/* Asset options */}
          <div className="mb-4 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Include in backup
            </p>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Image size={14} className="text-gray-400" />
              Uploaded images
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeDocs}
                onChange={(e) => setIncludeDocs(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <FileText size={14} className="text-gray-400" />
              Uploaded documents / files
            </label>
            {(includeImages || includeDocs) && (
              <p className="pt-1 text-xs text-amber-600">
                Including assets may take longer and produce a large ZIP file.
                Requires R2 storage to be configured.
              </p>
            )}
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
            {exporting ? "Creating backup…" : "Download Backup"}
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
                Upload a previously exported ZIP archive. Site configs, images,
                and documents are restored. Existing entries are overwritten.
              </p>
            </div>
          </div>

          <StatusBanner status={restoreStatus} />

          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                Backup archive (.zip)
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".zip,application/zip"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
              />
            </label>

            {fileError && <p className="text-sm text-red-600">{fileError}</p>}

            {preview && (
              <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <FileArchive size={14} />
                  Backup preview
                </div>
                {preview.exportedAt && (
                  <p className="text-gray-500">
                    Exported:{" "}
                    {new Date(preview.exportedAt).toLocaleString("en-IN")}
                  </p>
                )}
                {preview.exportedBy && (
                  <p className="text-gray-500">By: {preview.exportedBy}</p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="admin-badge admin-badge-gray text-[11px]">
                    {preview.configCount} config entries
                  </span>
                  {preview.imageCount > 0 && (
                    <span className="admin-badge admin-badge-blue text-[11px]">
                      {preview.imageCount} images
                    </span>
                  )}
                  {preview.docCount > 0 && (
                    <span className="admin-badge admin-badge-blue text-[11px]">
                      {preview.docCount} documents
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleRestore}
              disabled={!restoreFile || restoring}
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
              <h2 className="font-semibold text-red-800">Reset All Data</h2>
              <p className="mt-0.5 text-sm text-red-700/80">
                Permanently deletes all site config entries, uploaded images,
                and uploaded documents — from both the database and R2 storage.
                Public pages revert to hard-coded defaults. This cannot be
                undone — export a backup first.
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
              {resetting ? "Resetting…" : "Reset All Data"}
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
  const Icon = status.type === "success" ? CheckCircle : AlertTriangle;
  return (
    <div
      className={`mb-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${styles[status.type]}`}
    >
      <Icon size={15} className="mt-0.5 shrink-0" />
      {status.message}
    </div>
  );
}
