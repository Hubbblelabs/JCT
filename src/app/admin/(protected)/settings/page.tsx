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
  RefreshCw,
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

/** What `/api/admin/site-config/reset` reports back. Mirrors `@/lib/reset`. */
interface ResetReport {
  configs: number;
  content: Record<string, number> | null;
  assets: {
    storage_configured: boolean;
    storage_listed: boolean;
    objects_deleted: number;
    untracked_deleted: number;
    objects_failed: number;
    rows_deleted: number;
    assets_kept: number;
  };
}

/** One step of a running restore, as shown by `RestoreProgressBar`. */
interface RestoreProgressState {
  /** Fraction 0–1, or null when the step has no measurable total. */
  ratio: number | null;
  label: string;
  detail: string;
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

/** Coarse "time left" — a restore upload runs in tens of minutes, not seconds. */
function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  if (seconds < 90) return `${Math.round(seconds)}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
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

/**
 * Chunk size for the staged upload.
 *
 * Small enough that one lost chunk costs seconds rather than restarting an
 * hour-long transfer, large enough that a 7.5 GB archive is ~470 requests
 * instead of thousands. At a typical uplink this is on the order of ten
 * seconds in flight at a time.
 */
const RESTORE_CHUNK_BYTES = 16 * 1024 * 1024;

/** Attempts per chunk before the upload gives up. */
const CHUNK_ATTEMPTS = 5;

const UPLOAD_URL = "/api/admin/site-config/restore/upload";

/**
 * Where a half-finished upload is remembered, so closing the tab or losing the
 * link does not mean starting the archive again. Keyed by the file's identity
 * rather than its name alone — resuming into a *different* archive would
 * produce a ZIP that is two files spliced together.
 */
const resumeKey = (file: File) =>
  `jct.restore.upload.${file.name}.${file.size}.${file.lastModified}`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Pull the server's error message out of a response, falling back to status. */
async function errorFrom(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    /* Not JSON; the status is all there is. */
  }
  return `${fallback} (HTTP ${res.status})`;
}

/** Bytes the server currently holds for this session, or null if it's gone. */
async function stagedBytes(uploadId: string): Promise<number | null> {
  const res = await fetch(`${UPLOAD_URL}?uploadId=${uploadId}`);
  if (!res.ok) return null;
  return ((await res.json()) as { received: number }).received;
}

/**
 * Upload the archive to the server in chunks, resuming wherever it left off.
 *
 * The previous version sent the whole thing as one request body. That cannot
 * work at this size: the archive is ~7.5 GB, a typical uplink takes well over
 * an hour to push it, and nothing survives an hour on one connection reliably —
 * a Wi-Fi roam, a sleeping laptop, a NAT table eviction or an ISP re-dial all
 * end it. `XMLHttpRequest` has no resume, so every drop meant starting from
 * zero, and the server had already accepted 7 GB when the last attempt died.
 *
 * Chunking turns that into a transfer that makes progress: each request is a
 * few seconds long, a failed one is retried, and a mismatch is resynchronised
 * against what the server actually holds rather than assumed. The session id is
 * kept in `localStorage`, so a reload picks the same upload back up.
 */
async function stageArchive(
  file: File,
  onProgress: (state: RestoreProgressState) => void,
): Promise<string> {
  const key = resumeKey(file);
  let uploadId = localStorage.getItem(key);
  let offset = 0;

  if (uploadId) {
    // The server sweeps abandoned sessions, and this may be a different one
    // entirely. Trust its answer, not the browser's memory.
    const held = await stagedBytes(uploadId);
    if (held === null || held > file.size) uploadId = null;
    else offset = held;
  }

  if (!uploadId) {
    const res = await fetch(UPLOAD_URL, { method: "POST" });
    if (!res.ok)
      throw new Error(await errorFrom(res, "Could not start the upload"));
    uploadId = ((await res.json()) as { uploadId: string }).uploadId;
    offset = 0;
    try {
      localStorage.setItem(key, uploadId);
    } catch {
      // Private mode or a full quota. Resume is a convenience, not a
      // requirement — the upload still works, it just can't be picked up again.
    }
  }

  const resumedFrom = offset;
  const startedAt = performance.now();
  let bps = 0;

  const report = () => {
    const elapsed = (performance.now() - startedAt) / 1000;
    const sent = offset - resumedFrom;
    if (elapsed > 1 && sent > 0) {
      const instant = sent / elapsed;
      bps = bps === 0 ? instant : bps * 0.7 + instant * 0.3;
    }
    const left = bps > 0 ? (file.size - offset) / bps : NaN;
    const rate = bps > 0 ? ` · ${formatBytes(bps)}/s` : "";
    const eta = bps > 0 ? ` · ${formatDuration(left)} left` : "";
    onProgress({
      ratio: file.size > 0 ? offset / file.size : null,
      label: resumedFrom > 0 ? "Resuming upload" : "Uploading archive",
      detail: `${formatBytes(offset)} of ${formatBytes(file.size)}${rate}${eta}`,
    });
  };

  report();

  while (offset < file.size) {
    const end = Math.min(offset + RESTORE_CHUNK_BYTES, file.size);
    // A Blob slice is a lazy view: the bytes are read as the request is sent,
    // so an archive far larger than memory never lands in a JS buffer.
    const chunk = file.slice(offset, end);
    const at = offset;

    let attempt = 0;
    for (;;) {
      attempt += 1;
      try {
        const res = await fetch(
          `${UPLOAD_URL}?uploadId=${uploadId}&offset=${at}`,
          {
            method: "PATCH",
            body: chunk,
          },
        );

        // 409 means the server and this loop disagree about how much landed —
        // most often because a retried chunk had in fact been written. Take the
        // server's number and carry on from there instead of failing.
        if (res.status === 409) {
          offset = ((await res.json()) as { received: number }).received;
          break;
        }
        if (!res.ok)
          throw new Error(await errorFrom(res, "Chunk upload failed"));
        offset = ((await res.json()) as { received: number }).received;
        break;
      } catch (err) {
        if (attempt >= CHUNK_ATTEMPTS) {
          throw new Error(
            `${err instanceof Error ? err.message : "the connection dropped"} — ` +
              `${formatBytes(offset)} of ${formatBytes(file.size)} is staged on the ` +
              `server, so starting the restore again resumes from there`,
            { cause: err },
          );
        }
        // Back off, then re-read the truth: the chunk may have landed even
        // though the response never came back.
        await sleep(Math.min(30_000, 1000 * 2 ** (attempt - 1)));
        const held = await stagedBytes(uploadId).catch(() => null);
        if (held !== null) offset = held;
      }
    }
    report();
  }

  return uploadId;
}

/**
 * Run the restore against an archive already staged on the server, reading the
 * NDJSON progress feed as it arrives.
 *
 * `fetch` rather than `XMLHttpRequest` now that there is no body to send: the
 * only reason for XHR here was `xhr.upload.onprogress`, and a streaming reader
 * consumes the feed without accumulating the whole response in `responseText`.
 */
async function runRestore(
  uploadId: string,
  mode: RestoreMode,
  onProgress: (state: RestoreProgressState) => void,
): Promise<RestoreEvent | null> {
  const res = await fetch(
    `/api/admin/site-config/restore?mode=${mode}&uploadId=${uploadId}`,
    { method: "POST" },
  );
  if (!res.ok) throw new Error(await errorFrom(res, "Restore failed"));
  if (!res.body)
    throw new Error("Restore failed — the server sent no response");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let final: RestoreEvent | null = null;

  const handle = (event: RestoreEvent) => {
    if (event.done) {
      final = event;
      return;
    }
    if (event.stage === "upload") {
      onProgress({
        ratio: null,
        label: event.complete ? "Reading archive" : "Receiving archive",
        detail: `Server received ${formatBytes(event.bytes ?? 0)}`,
      });
    } else if (event.stage === "config") {
      onProgress({
        ratio: null,
        label: "Restored site config",
        detail: `${event.restored ?? 0} entries`,
      });
    } else if (event.stage === "collection") {
      onProgress({
        ratio: null,
        label: `Restored ${event.name ?? "collection"}`,
        detail: `${event.restored ?? 0} documents`,
      });
    } else if (event.stage === "assets") {
      onProgress({
        ratio: event.total ? (event.restored ?? 0) / event.total : null,
        label: "Restoring files",
        detail: `${event.restored ?? 0} of ${event.total ?? "?"}`,
      });
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (value) buffer += decoder.decode(value, { stream: true });
    for (;;) {
      const nl = buffer.indexOf("\n");
      if (nl === -1) break;
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      try {
        handle(JSON.parse(line) as RestoreEvent);
      } catch {
        continue; // Never throw on the feed.
      }
    }
    if (done) break;
  }

  return final;
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
  // which cascades into stored object removal.
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
  const [progress, setProgress] = useState<RestoreProgressState | null>(null);

  // Cache state
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<Status | null>(null);

  // Reset state. Both scope flags default OFF, so the button with nothing
  // ticked does what it has always done: clear site config and reclaim assets
  // nothing references.
  const [resetting, setResetting] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetContent, setResetContent] = useState(false);
  const [resetAssets, setResetAssets] = useState(false);
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
        ? `Archive built (${formatBytes(job.size ?? 0)}) and downloading — but WITHOUT images or documents, because object storage is not configured on this deployment. This archive cannot restore media on its own.`
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
   * Two phases. The archive is staged on the server in chunks — resumable, so a
   * dropped link costs one chunk rather than the whole transfer — and only then
   * is the restore run against it. The restore's response is NDJSON so a long
   * one keeps reporting instead of going silent behind a proxy timeout.
   */
  const handleRestore = async () => {
    if (!restoreFile) return;
    setRestoring(true);
    setRestoreStatus(null);
    setRestoreWarnings([]);
    const total = restoreFile.size;
    setProgress({
      ratio: 0,
      label: "Uploading archive",
      detail: `0 of ${formatBytes(total)}`,
    });
    try {
      const uploadId = await stageArchive(restoreFile, setProgress);
      // The server consumes the staged archive whether the restore succeeds or
      // not, so the resume pointer is spent the moment the restore starts.
      try {
        localStorage.removeItem(resumeKey(restoreFile));
      } catch {
        /* Nothing stored; nothing to clear. */
      }
      const final = await runRestore(uploadId, restoreMode, setProgress);

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
    } catch (err) {
      setRestoreStatus({
        type: "error",
        message:
          err instanceof Error && err.message
            ? `Restore failed: ${err.message}`
            : "Restore failed. Try again.",
      });
    } finally {
      setRestoring(false);
      setProgress(null);
    }
  };

  /**
   * Mark every public page stale. Not confirmed: nothing is deleted and the
   * worst case is that the next visitor to each page waits for a re-render.
   */
  const handleClearCache = async () => {
    setClearingCache(true);
    setCacheStatus(null);
    try {
      const res = await fetch("/api/admin/cache", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setCacheStatus({
          type: "error",
          message: data.error ?? "Could not clear the cache.",
        });
        return;
      }
      setCacheStatus({
        type: "success",
        message:
          "Cache cleared. Every public page rebuilds the next time it is opened — the first visit to each one is slower than usual.",
      });
    } catch {
      setCacheStatus({
        type: "error",
        message: "Could not clear the cache. Try again.",
      });
    } finally {
      setClearingCache(false);
    }
  };

  const handleReset = async () => {
    if (resetConfirm !== "RESET") return;
    // Typing RESET proves intent to fill the box; it does not prove intent to
    // press the button. This step names what is about to be destroyed, and it
    // is the last one — the request deletes from both Mongo and storage with
    // no undo. The message is built from the ticked scope so it always
    // describes the run about to happen, not a generic worst case.
    const lines = [
      "Every site config entry will be deleted.",
      resetContent
        ? "Every program, page, event, placement and testimonial will be deleted."
        : "Programs, pages, events, placements and testimonials are NOT deleted.",
      resetAssets
        ? "Every uploaded image and document will be deleted from storage and the media library — including files that surviving content still uses."
        : "Uploaded images and documents that no surviving content references will be deleted from storage and the media library; anything still in use is kept.",
    ];
    if (resetAssets && !resetContent) {
      lines.push(
        "WARNING: you are purging all files while keeping content, so surviving programs, events, placements and testimonials will be left with broken images.",
      );
    }
    lines.push("This cannot be undone.");
    const ok = await confirm({
      title: "Delete all site data",
      message: lines.join(" "),
      confirmLabel: "Delete everything",
      destructive: true,
    });
    if (!ok) return;
    setResetting(true);
    setResetStatus(null);
    try {
      const res = await fetch("/api/admin/site-config/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: resetContent, assets: resetAssets }),
      });
      const data = (await res.json()) as ResetReport & { error?: string };
      if (!res.ok) {
        setResetStatus({
          type: "error",
          message: data.error ?? "Reset failed",
        });
        return;
      }

      const parts: string[] = [`${data.configs} config entries`];
      for (const [name, n] of Object.entries(data.content ?? {})) {
        if (n > 0) parts.push(`${n} ${name}`);
      }
      const a = data.assets;
      if (a.objects_deleted > 0) {
        parts.push(
          `${a.objects_deleted} stored file(s)` +
            (a.untracked_deleted > 0
              ? ` (${a.untracked_deleted} untracked)`
              : ""),
        );
      }

      // Anything that stopped the sweep short is a warning, not a success:
      // silence here is what let orphans build up unnoticed in the first place.
      const warnings: string[] = [];
      if (!a.storage_configured) {
        warnings.push(
          "Object storage is not configured, so no files were deleted and no media-library rows were removed.",
        );
      } else if (!a.storage_listed) {
        warnings.push(
          "The bucket could not be listed, so only files the database tracks were considered — untracked files remain.",
        );
      }
      if (a.objects_failed > 0) {
        warnings.push(
          `${a.objects_failed} file(s) could not be deleted from storage; their media-library entries were kept so the next reset retries them.`,
        );
      }
      const kept =
        a.assets_kept > 0
          ? ` ${a.assets_kept} file(s) kept — still referenced by surviving content.`
          : "";

      setResetStatus({
        type: warnings.length > 0 ? "warning" : "success",
        message:
          `Deleted: ${parts.join(", ")}.${kept}` +
          (warnings.length > 0 ? ` ${warnings.join(" ")}` : "") +
          " Pages will serve defaults until reconfigured.",
      });
      setResetConfirm("");
      setResetContent(false);
      setResetAssets(false);
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
            Export an archive of everything on this site, restore one, clear the
            page cache, or reset the site back to its defaults.
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
                will not lose it. Requires object storage to be configured.
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

            {restoring && progress && <RestoreProgressBar state={progress} />}

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

        {/* ── Cache ── */}
        <div className="admin-card lg:col-span-2">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-indigo-50 p-2">
              <RefreshCw size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Clear Site Cache</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Public pages are cached for an hour, and every edit made here
                already refreshes the pages it affects. Use this when the live
                site is still showing old content anyway — after restoring a
                backup, or after data was changed outside the CMS. Nothing is
                deleted: each page simply rebuilds from the database the next
                time someone opens it.
              </p>
            </div>
          </div>

          <StatusBanner status={cacheStatus} />

          <button
            onClick={handleClearCache}
            disabled={clearingCache}
            className="admin-btn admin-btn-outline"
          >
            {clearingCache ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            {clearingCache ? "Clearing…" : "Clear Cache"}
          </button>
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
                Permanently deletes every site config entry, plus every uploaded
                file nothing references — from the database and from object
                storage, including files the media library never tracked. Widen
                the scope below to also clear content or every uploaded file.
                Every page driven by site config — including the footer&apos;s
                disclaimer, privacy, terms and FAQ pages — is left empty until
                it is written again or a backup is restored. This cannot be
                undone — export a backup first.
              </p>
            </div>
          </div>

          <StatusBanner status={resetStatus} />

          <div className="space-y-3">
            <div className="space-y-2 rounded-lg border border-red-200 bg-white/60 p-3">
              <p className="text-xs font-medium tracking-wide text-red-700/70 uppercase">
                Also delete
              </p>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-red-900">
                <input
                  type="checkbox"
                  checked={resetContent}
                  onChange={(e) => setResetContent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-red-300"
                />
                <span>
                  <span className="font-medium">Content</span> — every program,
                  page, event, placement and testimonial.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-red-900">
                <input
                  type="checkbox"
                  checked={resetAssets}
                  onChange={(e) => setResetAssets(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-red-300"
                />
                <span>
                  <span className="font-medium">Every uploaded file</span> — all
                  images and documents, whether or not something still uses
                  them.
                </span>
              </label>
              {resetAssets && !resetContent && (
                <p className="flex items-start gap-1.5 text-xs text-red-700">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  Purging every file while keeping content leaves surviving
                  programs, events, placements and testimonials with broken
                  images.
                </p>
              )}
              {/* Users and the audit trail are never touched: wiping users
                  would lock the admin out of the panel mid-reset. */}
              <p className="text-xs text-red-700/60">
                User accounts and the audit trail are never deleted.
              </p>
            </div>

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
/**
 * Live restore progress. Two shapes, because a restore alternates between steps
 * with a real denominator (bytes uploaded of the file size, files restored of
 * the archive's count) and steps without one (spooling, reading the central
 * directory of a multi-gigabyte ZIP, upserting a collection). A determinate bar
 * frozen at 0% for the minutes those take reads as a stall, so they get a
 * pulsing full-width bar instead — moving, but not claiming a position.
 */
function RestoreProgressBar({ state }: { state: RestoreProgressState }) {
  const pct =
    state.ratio === null
      ? null
      : Math.min(100, Math.max(0, Math.round(state.ratio * 100)));
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-green-800">
        <span className="truncate">
          {state.label}
          {pct !== null && ` — ${pct}%`}
        </span>
        <span className="shrink-0 tabular-nums">{state.detail}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-green-200">
        {pct === null ? (
          <div className="h-full w-full animate-pulse rounded-full bg-green-600" />
        ) : (
          <div
            className="h-full rounded-full bg-green-600 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}

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
