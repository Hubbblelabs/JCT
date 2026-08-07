"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useConfirm } from "@/components/ui/ConfirmDialog";
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

/** A backup build, as reported by `/api/admin/site-config/backup`. */
interface BackupJob {
  id: string;
  state: "building" | "ready" | "failed";
  filename: string;
  bytes: number;
  size?: number;
  expected_bytes: number;
  entries_done: number;
  entries_total: number;
  config_entries: number;
  asset_files: number;
  assets_unavailable?: boolean;
  error?: string;
  report?: {
    assets_expected: number;
    assets_archived: number;
    unreadable: string[];
  };
}

/** One NDJSON line from the restore stream. */
interface RestoreEvent {
  stage?: "upload" | "config" | "collection" | "assets";
  name?: string;
  restored?: number;
  total?: number;
  bytes?: number;
  complete?: boolean;
  done?: boolean;
  error?: string;
  configs?: number;
  skipped?: number;
  collections?: number;
  rejected?: number;
  pruned?: number;
  assets?: number;
  /** What a failed restore had already written before it gave up. */
  partial?: { configs: number; collections: number; assets: number };
  warnings?: string[];
}

type Status = { type: "success" | "error" | "warning"; message: string };

/** How a restore treats documents that exist now but aren't in the archive. */
type RestoreMode = "merge" | "replace";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Hand the URL to the browser's own download manager rather than fetching it.
 * `fetch` + `response.blob()` would buffer the entire archive in the tab's
 * heap. A plain navigation writes straight to disk, so a multi-gigabyte backup
 * costs the page almost no memory — and because the server serves a finished
 * file with a known length, the browser can show real progress and resume a
 * failed transfer instead of starting over.
 */
function startDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as Record<string, unknown>)?.role as string;

  if (status === "authenticated" && role !== "admin") {
    redirect("/admin/dashboard");
  }

  const fileRef = useRef<HTMLInputElement>(null);
  const confirm = useConfirm();

  // Export state. Assets default ON: a DB-only archive restores into a bucket
  // with no image bytes and no images/_metadata.json, so every image reference
  // dangles with nothing in the archive to even enumerate what's missing —
  // and "restore the backup" is exactly the recovery path after a bad delete,
  // which cascades into R2 object removal.
  const [includeImages, setIncludeImages] = useState(true);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [exportStatus, setExportStatus] = useState<Status | null>(null);
  const [job, setJob] = useState<BackupJob | null>(null);
  /** Guards the auto-download so a poll that re-reports "ready" can't fire it
   * a second time. */
  const downloaded = useRef<string | null>(null);

  // Restore state. Merge is the default because it is the non-destructive
  // option; replace is what actually undoes a bad import, so it is offered
  // explicitly rather than left implicit.
  const [restoreMode, setRestoreMode] = useState<RestoreMode>("merge");
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<Status | null>(null);
  const [restoreWarnings, setRestoreWarnings] = useState<string[]>([]);
  const [progress, setProgress] = useState("");

  // Reset state
  const [resetting, setResetting] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetStatus, setResetStatus] = useState<Status | null>(null);

  // Poll a running build. Keyed on id+state rather than the whole job so the
  // interval isn't torn down and rebuilt on every progress tick.
  const jobId = job?.id;
  const jobState = job?.state;
  useEffect(() => {
    if (!jobId || jobState !== "building") return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/admin/site-config/backup?jobId=${jobId}`);
        if (!res.ok) return;
        const next = (await res.json()) as BackupJob;
        if (!cancelled) setJob(next);
      } catch {
        // Transient — the next tick retries. A build outlives a blip.
      }
    };
    const timer = setInterval(tick, 1500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [jobId, jobState]);

  // Hand a finished archive to the browser exactly once.
  useEffect(() => {
    if (!job) return;
    if (job.state === "failed") {
      setExportStatus({
        type: "error",
        message: `Backup failed: ${job.error ?? "unknown error"}`,
      });
      return;
    }
    if (job.state !== "ready" || downloaded.current === job.id) return;
    downloaded.current = job.id;
    startDownload(`/api/admin/site-config/backup/file?jobId=${job.id}`);
    const missing = job.report?.unreadable.length ?? 0;
    setExportStatus({
      type: missing > 0 || job.assets_unavailable ? "warning" : "success",
      message: job.assets_unavailable
        ? `Archive built (${formatBytes(job.size ?? 0)}) and downloading — but WITHOUT images or documents, because R2 storage is not configured on this deployment. This archive cannot restore media on its own.`
        : missing > 0
          ? `Archive built (${formatBytes(job.size ?? 0)}) and downloading — but ${missing} asset file(s) could not be read from storage. See _report.json inside the ZIP for the list.`
          : `Archive built (${formatBytes(job.size ?? 0)}) and downloading — ${job.config_entries} config entries and ${job.report?.assets_archived ?? 0} asset files. The download resumes on its own if it is interrupted.`,
    });
  }, [job]);

  if (status === "loading") {
    return (
      <div className="admin-content flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const backupUrl = (extra?: Record<string, string>) => {
    const params = new URLSearchParams(extra);
    if (includeImages) params.set("includeImages", "1");
    if (includeDocs) params.set("includeDocs", "1");
    return `/api/admin/site-config/backup?${params}`;
  };

  /**
   * Start a build and let the polling effect take it from there. The response
   * is a job, not an archive — the bytes are fetched separately once the file
   * exists on the server.
   */
  const handleExport = async () => {
    setExporting(true);
    setExportStatus(null);
    downloaded.current = null;
    try {
      const res = await fetch(backupUrl(), { method: "POST" });
      const data = (await res.json()) as Record<string, unknown>;
      if (res.status === 409 && data.job) {
        // Another tab (or an earlier click) already has one running — adopt it
        // rather than reporting a conflict the operator can do nothing about.
        setJob(data.job as unknown as BackupJob);
        return;
      }
      if (!res.ok) {
        setExportStatus({
          type: "error",
          message: (data.error as string) ?? "Export failed",
        });
        return;
      }
      setJob(data as unknown as BackupJob);
    } catch {
      setExportStatus({ type: "error", message: "Export failed. Try again." });
    } finally {
      setExporting(false);
    }
  };

  /**
   * Drop a finished archive from the server's disk.
   *
   * Deliberately exempt from the 3-hour retention grace: that window exists to
   * stop *automatic* deletion racing a download, and an operator saying "I
   * have it, take it back" is not a race. Confirmed first because the bytes
   * are gone for good — rebuilding a 7.5 GB export is not a quick undo.
   */
  const handleDiscardArchive = async () => {
    if (!job || job.state !== "ready") return;
    const ok = await confirm({
      title: "Delete this backup archive?",
      message: `${job.filename} (${formatBytes(job.size ?? 0)}) will be removed from the server. Make sure your download finished — this cannot be undone, and rebuilding takes another full export.`,
      confirmLabel: "Delete archive",
      destructive: true,
    });
    if (!ok) return;

    setDiscarding(true);
    try {
      const res = await fetch(`/api/admin/site-config/backup?jobId=${job.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setExportStatus({
          type: "error",
          message: data.error ?? "Could not delete the archive.",
        });
        return;
      }
      setJob(null);
      downloaded.current = null;
      setExportStatus({
        type: "success",
        message: "Archive deleted — the disk space is free again.",
      });
    } catch {
      setExportStatus({
        type: "error",
        message: "Could not delete the archive. Try again.",
      });
    } finally {
      setDiscarding(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setRestoreFile(null);
    setFileError("");
    setRestoreStatus(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setFileError("Invalid file — expected a .zip backup archive.");
      return;
    }
    setRestoreFile(file);
  };

  /**
   * The archive is uploaded as a raw body, not parsed here: the server spools
   * it to disk and reads its central directory. The response is NDJSON so a
   * long restore keeps reporting instead of going silent behind a proxy
   * timeout.
   */
  const handleRestore = async () => {
    if (!restoreFile) return;
    setRestoring(true);
    setRestoreStatus(null);
    setRestoreWarnings([]);
    setProgress("Uploading archive…");
    try {
      const res = await fetch(
        `/api/admin/site-config/restore?mode=${restoreMode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/zip" },
          body: restoreFile,
        },
      );
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => ({}))) as Record<
          string,
          string
        >;
        setRestoreStatus({
          type: "error",
          message: `Restore failed: ${err.error ?? `HTTP ${res.status}`}`,
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffered = "";
      let final: RestoreEvent | null = null;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
        const lines = buffered.split("\n");
        buffered = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as RestoreEvent;
          if (event.done) {
            final = event;
            continue;
          }
          if (event.stage === "upload") {
            setProgress(
              event.complete
                ? `Uploaded ${formatBytes(event.bytes ?? 0)} — reading archive…`
                : `Uploading… ${formatBytes(event.bytes ?? 0)} of ${formatBytes(restoreFile.size)}`,
            );
          } else if (event.stage === "config") {
            setProgress("Restored site config");
          } else if (event.stage === "collection") {
            setProgress(`Restored ${event.restored} ${event.name}`);
          } else if (event.stage === "assets") {
            setProgress(
              `Restored ${event.restored}/${event.total ?? "?"} asset files…`,
            );
          }
        }
      }

      if (!final) {
        setRestoreStatus({
          type: "error",
          message: "Restore ended unexpectedly — the connection was cut.",
        });
        return;
      }
      if (final.error) {
        setRestoreWarnings(final.warnings ?? []);
        // A failed restore is not a no-op — whatever was written stays written.
        const p = final.partial;
        const applied =
          p && (p.configs > 0 || p.collections > 0 || p.assets > 0)
            ? ` ${p.configs} config entries, ${p.collections} content documents and ${p.assets} asset files had already been applied and remain in place.`
            : "";
        setRestoreStatus({
          type: "error",
          message: `${final.error}.${applied}`,
        });
        return;
      }

      const parts = [`${final.configs} config entries`];
      if ((final.collections ?? 0) > 0) {
        parts.push(`${final.collections} content documents`);
      }
      // Rejections are the loud half of the fix for silently-corrupting
      // restores — they must never be buried in the warnings list alone.
      if ((final.rejected ?? 0) > 0) {
        parts.push(`${final.rejected} document(s) REJECTED (not written)`);
      }
      if ((final.pruned ?? 0) > 0) {
        parts.push(`${final.pruned} document(s) removed by replace mode`);
      }
      if ((final.assets ?? 0) > 0) parts.push(`${final.assets} asset files`);
      const warnings = final.warnings ?? [];
      setRestoreWarnings(warnings);
      setRestoreStatus({
        type: warnings.length ? "warning" : "success",
        message: `Restored: ${parts.join(", ")}.${
          (final.skipped ?? 0) > 0 ? ` ${final.skipped} entry(s) skipped.` : ""
        }`,
      });
      setRestoreFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setRestoreStatus({
        type: "error",
        message: "Restore failed. Try again.",
      });
    } finally {
      setRestoring(false);
      setProgress("");
    }
  };

  const handleReset = async () => {
    if (resetConfirm !== "RESET") return;
    // Typing RESET proves intent to fill the box; it does not prove intent to
    // press the button. This step names what is about to be destroyed, and it
    // is the last one — the request deletes config, images and documents from
    // both Mongo and R2 with no undo.
    const ok = await confirm({
      title: "Delete all site data",
      message:
        "Every site config entry will be deleted, along with every uploaded image and document that no site content still references — from the database and from storage. Programs, pages, events, placements and testimonials are NOT deleted, and any asset they still use is kept. Public pages driven by site config will fall back to hard-coded defaults. This cannot be undone.",
      confirmLabel: "Delete everything",
      destructive: true,
    });
    if (!ok) return;
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
      const kept =
        (data.assets_kept as number) > 0
          ? ` ${data.assets_kept as number} asset(s) kept — still referenced by programs, pages, events, placements or testimonials.`
          : "";
      setResetStatus({
        type: (data.r2_failures as number) > 0 ? "warning" : "success",
        message: `Deleted: ${parts.join(", ")}.${kept}${r2Warn} Pages will serve defaults until reconfigured.`,
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
          <h1 className="admin-page-title">Backup &amp; restore</h1>
          <p className="admin-page-subtitle">
            Export an archive of everything on this site, restore one, or reset
            the site back to its defaults.
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
                Builds one ZIP containing all site config, content, and — if
                selected — every uploaded file, then downloads it. The archive
                is assembled on the server first, so the download runs at full
                speed and resumes if it is interrupted.
              </p>
            </div>
          </div>

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
            {includeImages || includeDocs ? (
              <p className="pt-1 text-xs text-amber-600">
                Keep this tab open while the archive builds. Once it is ready
                the download is a normal file transfer — closing the tab then
                will not lose it. Requires R2 storage to be configured.
              </p>
            ) : (
              <p className="pt-1 text-xs text-red-600">
                Without assets this archive is <strong>not restorable</strong>{" "}
                on its own — it carries no image or document files, and no list
                of which ones are missing. Only uncheck these if the storage
                bucket is being backed up separately.
              </p>
            )}
          </div>

          <StatusBanner status={exportStatus} />

          {job?.state === "building" && <BuildProgress job={job} />}

          {job?.state === "ready" && (
            <div className="mb-3 space-y-1.5">
              <p className="text-xs text-gray-500">
                Download didn&apos;t start?{" "}
                <a
                  className="font-medium text-blue-600 underline"
                  href={`/api/admin/site-config/backup/file?jobId=${job.id}`}
                >
                  Get {job.filename} ({formatBytes(job.size ?? 0)})
                </a>
              </p>
              {/* The server keeps an archive for 3 hours before it will delete
                  it automatically, in case it is still being downloaded. That
                  also means it occupies the volume for 3 hours and can block
                  the next export on a tight disk — so once the download is
                  safely finished there has to be a way to give the space back
                  sooner. This is it. */}
              <p className="text-xs text-gray-500">
                Saved it already?{" "}
                <button
                  type="button"
                  onClick={handleDiscardArchive}
                  disabled={discarding}
                  className="font-medium text-blue-600 underline disabled:opacity-50"
                >
                  {discarding
                    ? "Deleting…"
                    : "Delete this archive from the server"}
                </button>{" "}
                to free {formatBytes(job.size ?? 0)} now.
              </p>
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={exporting || job?.state === "building"}
            className="admin-btn admin-btn-primary"
          >
            {exporting || job?.state === "building" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {job?.state === "building"
              ? "Building archive…"
              : exporting
                ? "Starting…"
                : "Download Backup"}
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
                Select a backup archive. Site configs, content, images, and
                documents in the archive overwrite what is stored now. Anything
                created since the backup is left untouched, not deleted — this
                merges the archive in, it does not roll the site back.
              </p>
            </div>
          </div>

          <StatusBanner status={restoreStatus} />

          {restoreWarnings.length > 0 && (
            <details className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-amber-800">
                {restoreWarnings.length} entry(s) not restored — details
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-800">
                {restoreWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </details>
          )}

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

            {/* Restore mode. Upserts alone never delete, so a plain restore is
                additive: rows created after the backup survive it. That is the
                wrong default for undoing a bad import, so state it explicitly
                rather than leaving the operator to discover it. */}
            <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Content restore mode
              </p>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-700">
                <input
                  type="radio"
                  name="restoreMode"
                  checked={restoreMode === "merge"}
                  onChange={() => setRestoreMode("merge")}
                  className="mt-0.5 h-4 w-4 border-gray-300"
                />
                <span>
                  <span className="font-medium">Merge</span> — restore the
                  archive&apos;s documents over the current ones.
                  <span className="block text-xs text-gray-500">
                    Anything created after the backup is kept.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-700">
                <input
                  type="radio"
                  name="restoreMode"
                  checked={restoreMode === "replace"}
                  onChange={() => setRestoreMode("replace")}
                  className="mt-0.5 h-4 w-4 border-gray-300"
                />
                <span>
                  <span className="font-medium">Replace</span> — make content
                  match the archive exactly.
                  <span className="block text-xs text-gray-500">
                    Programs, pages, placements, testimonials and events created
                    after the backup are <strong>deleted</strong>.
                  </span>
                </span>
              </label>
              {restoreMode === "replace" && (
                <p className="pt-1 text-xs text-red-600">
                  Replace deletes content permanently. It is skipped for any
                  collection that does not restore cleanly, so a partial failure
                  cannot wipe live data.
                </p>
              )}
            </div>

            {restoreFile && (
              <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                <FileArchive size={14} />
                {restoreFile.name}
                <span className="text-gray-500">
                  ({formatBytes(restoreFile.size)})
                </span>
              </div>
            )}

            {restoring && progress && (
              <p className="text-xs text-gray-500">{progress}</p>
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

/**
 * Live build progress. The denominator is the planned asset total, which is
 * close to the finished size but not exact — assets are stored uncompressed,
 * while the JSON entries are deflated and not counted at all. Clamped so a
 * slightly-off estimate can never show a bar past 100%.
 */
function BuildProgress({ job }: { job: BackupJob }) {
  const pct = job.expected_bytes
    ? Math.min(100, Math.round((job.bytes / job.expected_bytes) * 100))
    : 0;
  return (
    <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <div className="mb-1.5 flex items-center justify-between text-xs text-blue-800">
        <span>
          Building archive — {job.entries_done}/{job.entries_total} files
        </span>
        <span>
          {formatBytes(job.bytes)}
          {job.expected_bytes > 0 && ` of ~${formatBytes(job.expected_bytes)}`}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-blue-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-blue-700/80">
        The download starts on its own when this finishes.
      </p>
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
