"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import JSZip from "jszip";
import { BACKUP_COLLECTIONS } from "@/lib/backup-collections";
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
  /** Binaries actually present in the archive, incl. files with no DB row. */
  assetFileCount: number;
  /** Per-collection document counts found under `collections/`. */
  collectionCounts: Array<{ label: string; count: number }>;
}

type Status = { type: "success" | "error" | "warning"; message: string };

/**
 * Asset binaries go up in small batches: a full archive is tens of megabytes
 * and a single request would hit the reverse proxy's body limit. Batches are
 * capped by BOTH byte size and file count so a few large PDFs can't build an
 * oversized request on their own.
 */
const ASSET_BATCH_BYTES = 6 * 1024 * 1024;
const ASSET_BATCH_FILES = 25;

/** Same reasoning for content documents — programs alone run to ~750 KB. */
const DOC_BATCH_BYTES = 512 * 1024;

/**
 * Read `collections/<name>.json` out of the archive. Returns null when the
 * archive predates collection support, so an older backup still restores its
 * configs and assets instead of erroring.
 */
async function readCollection(
  zip: JSZip,
  name: string,
): Promise<Record<string, unknown>[] | null> {
  const file = zip.file(`collections/${name}.json`);
  if (!file) return null;
  try {
    const parsed = JSON.parse(await file.async("string")) as unknown;
    return Array.isArray(parsed)
      ? (parsed as Record<string, unknown>[])
      : null;
  } catch {
    return null;
  }
}

/** Split documents so each request stays under the body limit. */
function chunkBySize(
  docs: Record<string, unknown>[],
  maxBytes: number,
): Record<string, unknown>[][] {
  const chunks: Record<string, unknown>[][] = [];
  let current: Record<string, unknown>[] = [];
  let bytes = 0;
  for (const doc of docs) {
    const size = JSON.stringify(doc).length;
    if (current.length > 0 && bytes + size > maxBytes) {
      chunks.push(current);
      current = [];
      bytes = 0;
    }
    current.push(doc);
    bytes += size;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

/** How a restore treats documents that exist now but aren't in the archive. */
export type RestoreMode = "merge" | "replace";

/**
 * Push every content collection back, chunk by chunk. Failures are collected
 * rather than thrown so one bad collection can't strand the rest of a restore.
 *
 * In `replace` mode each collection gets one extra request after its chunks,
 * carrying every `_id` the server reported writing; the server deletes
 * everything else. The ids have to come from the server rather than from the
 * archive because a duplicate-key collision can land a document on a different
 * `_id` than the one it was backed up under.
 */
async function restoreCollections(
  zip: JSZip,
  mode: RestoreMode,
  onProgress: (label: string) => void,
): Promise<{ restored: number; rejected: number; pruned: number; errors: string[] }> {
  let restored = 0;
  let rejected = 0;
  let pruned = 0;
  const errors: string[] = [];

  const post = async (body: Record<string, unknown>, label: string) => {
    const res = await fetch("/api/admin/site-config/restore-collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      errors.push(`${label}: ${(data.error as string) ?? `HTTP ${res.status}`}`);
      return null;
    }
    restored += (data.restored as number) ?? 0;
    rejected += (data.rejected as number) ?? 0;
    pruned += (data.pruned as number) ?? 0;
    const chunkErrors = data.errors as string[] | undefined;
    if (chunkErrors?.length) errors.push(...chunkErrors);
    return data;
  };

  for (const col of BACKUP_COLLECTIONS) {
    const docs = await readCollection(zip, col.name);
    // `null` means the archive has no file for this collection at all (it
    // predates collection support) — there is nothing to say about it, so it
    // is left alone even in replace mode. An empty *array* is different: the
    // archive asserts this collection was empty, and replace mode must honour
    // that, otherwise restoring a known-good backup can't undo a bad import
    // into a collection that used to have nothing in it.
    if (docs === null) continue;
    if (docs.length === 0 && mode !== "replace") continue;
    onProgress(col.label);

    const writtenIds: string[] = [];
    const errorsBefore = errors.length;
    for (const chunk of chunkBySize(docs, DOC_BATCH_BYTES)) {
      try {
        const data = await post(
          { collection: col.name, docs: chunk },
          col.label,
        );
        const ids = data?.writtenIds as string[] | undefined;
        if (ids?.length) writtenIds.push(...ids);
      } catch (err) {
        errors.push(`${col.label}: ${String(err)}`);
      }
    }
    const cleanRun = errors.length === errorsBefore;

    if (mode === "replace") {
      // Never prune off a partial run. A failed or rejected chunk means
      // `writtenIds` is missing rows that belong in the collection, and
      // pruning against it would delete live data the archive does contain.
      if (!cleanRun) {
        errors.push(
          `${col.label}: kept existing documents — replace mode skipped because part of this collection failed to restore.`,
        );
      } else {
        try {
          await post(
            { collection: col.name, docs: [], pruneToIds: writtenIds },
            `${col.label} (replace)`,
          );
        } catch (err) {
          errors.push(`${col.label} (replace): ${String(err)}`);
        }
      }
    }
  }
  return { restored, rejected, pruned, errors };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Every binary in the archive, i.e. everything except the JSON manifests. */
function collectAssetEntries(zip: JSZip): JSZip.JSZipObject[] {
  const out: JSZip.JSZipObject[] = [];
  zip.forEach((relPath, entry) => {
    if (entry.dir) return;
    if (!relPath.startsWith("images/") && !relPath.startsWith("documents/")) {
      return;
    }
    if (relPath.endsWith("/_metadata.json")) return;
    out.push(entry);
  });
  return out;
}

function indexMetaByKey(
  meta: unknown[] | undefined,
): Record<string, Record<string, unknown>> {
  const map: Record<string, Record<string, unknown>> = {};
  for (const raw of meta ?? []) {
    const m = raw as Record<string, unknown>;
    if (typeof m?.storage_key === "string") map[m.storage_key] = m;
  }
  return map;
}

/**
 * Send the archive's binaries to the restore-assets route in size-bounded
 * batches. Batch failures are collected rather than thrown so one bad file
 * can't abandon the rest of the restore midway.
 */
async function uploadAssetBatches(
  entries: JSZip.JSZipObject[],
  meta: {
    images: Record<string, Record<string, unknown>>;
    docs: Record<string, Record<string, unknown>>;
  },
  onProgress: (done: number) => void,
): Promise<{ uploaded: number; errors: string[] }> {
  let uploaded = 0;
  let done = 0;
  const errors: string[] = [];

  let batch: Array<{ key: string; blob: Blob }> = [];
  let batchBytes = 0;

  const flush = async () => {
    if (batch.length === 0) return;
    const form = new FormData();
    const imageMeta: Record<string, unknown> = {};
    const docMeta: Record<string, unknown> = {};
    for (const item of batch) {
      form.append("keys", item.key);
      form.append("files", item.blob, item.key.split("/").pop() ?? "asset");
      const m = item.key.startsWith("images/")
        ? meta.images[item.key]
        : meta.docs[item.key];
      if (m) {
        if (item.key.startsWith("images/")) imageMeta[item.key] = m;
        else docMeta[item.key] = m;
      }
    }
    form.append("imageMeta", JSON.stringify(imageMeta));
    form.append("docMeta", JSON.stringify(docMeta));

    try {
      const res = await fetch("/api/admin/site-config/restore-assets", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        errors.push(
          `Asset batch failed: ${(data.error as string) ?? res.status}`,
        );
      } else {
        uploaded += (data.uploaded as number) ?? 0;
        const batchErrors = data.errors as string[] | undefined;
        if (batchErrors?.length) errors.push(...batchErrors);
      }
    } catch (err) {
      errors.push(`Asset batch failed: ${String(err)}`);
    }
    done += batch.length;
    onProgress(done);
    batch = [];
    batchBytes = 0;
  };

  for (const entry of entries) {
    const blob = await entry.async("blob");
    if (
      batch.length >= ASSET_BATCH_FILES ||
      (batchBytes > 0 && batchBytes + blob.size > ASSET_BATCH_BYTES)
    ) {
      await flush();
    }
    batch.push({ key: entry.name, blob });
    batchBytes += blob.size;
  }
  await flush();

  return { uploaded, errors };
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as Record<string, unknown>)?.role as string;

  if (status === "authenticated" && role !== "admin") {
    redirect("/admin/dashboard");
  }

  const fileRef = useRef<HTMLInputElement>(null);

  // Export state. Assets default ON: a DB-only archive restores into a bucket
  // with no image bytes and no images/_metadata.json, so every image reference
  // dangles with nothing in the archive to even enumerate what's missing —
  // and "restore the backup" is exactly the recovery path after a bad delete,
  // which cascades into R2 object removal.
  const [includeImages, setIncludeImages] = useState(true);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<Status | null>(null);

  // Restore state. Merge is the default because it is the non-destructive
  // option; replace is what actually undoes a bad import, so it is offered
  // explicitly rather than left implicit.
  const [restoreMode, setRestoreMode] = useState<RestoreMode>("merge");
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<Status | null>(null);
  const [restoreWarnings, setRestoreWarnings] = useState<string[]>([]);
  const [assetProgress, setAssetProgress] = useState<{
    done: number;
    total: number;
    label?: string;
  } | null>(null);

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
      // The anchor must be in the document and the object URL must outlive the
      // click: revoking synchronously after click() races the browser's own
      // fetch of the blob and lands a 0-byte file in Downloads.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setExportStatus({
        type: "success",
        message: `Backup downloaded (${formatBytes(blob.size)}).`,
      });
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

      const collectionCounts: Array<{ label: string; count: number }> = [];
      for (const col of BACKUP_COLLECTIONS) {
        const docs = await readCollection(zip, col.name);
        if (docs && docs.length > 0) {
          collectionCounts.push({ label: col.label, count: docs.length });
        }
      }

      setPreview({
        exportedAt: configData.exported_at ?? "",
        exportedBy: configData.exported_by ?? "",
        configCount,
        imageCount,
        docCount,
        assetFileCount: collectAssetEntries(zip).length,
        collectionCounts,
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
    setRestoreWarnings([]);
    setAssetProgress(null);
    try {
      // Parse the ZIP client-side — send only structured JSON to avoid
      // nginx body size limits that break large multipart/binary uploads.
      const buffer = await restoreFile.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const configFile = zip.file("site-config.json");
      if (!configFile) {
        setRestoreStatus({
          type: "error",
          message: "Invalid backup — missing site-config.json",
        });
        return;
      }
      const configData = JSON.parse(await configFile.async("string")) as {
        configs?: unknown[];
      };

      let imageMeta: unknown[] | undefined;
      const imageMetaFile = zip.file("images/_metadata.json");
      if (imageMetaFile) {
        try {
          imageMeta = JSON.parse(
            await imageMetaFile.async("string"),
          ) as unknown[];
        } catch {
          // non-fatal: image metadata missing or malformed
        }
      }

      let docMeta: unknown[] | undefined;
      const docMetaFile = zip.file("documents/_metadata.json");
      if (docMetaFile) {
        try {
          docMeta = JSON.parse(await docMetaFile.async("string")) as unknown[];
        } catch {
          // non-fatal: document metadata missing or malformed
        }
      }

      const res = await fetch("/api/admin/site-config/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configs: configData.configs ?? [],
          imageMeta,
          docMeta,
        }),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        const details = data.details as string[] | undefined;
        setRestoreWarnings(details ?? []);
        setRestoreStatus({
          type: "error",
          message: `Restore failed: ${(data.error as string) ?? "Unknown error"}`,
        });
        return;
      }
      const parts = [`${data.restored as number} config entries`];
      const warnings = [...((data.warnings as string[] | undefined) ?? [])];
      const skipped = (data.skipped as number) ?? 0;

      // Content collections (programs, placements, testimonials, …). Without
      // this a "full" restore rebuilt the settings but left the site empty.
      const content = await restoreCollections(zip, restoreMode, (label) =>
        setAssetProgress({ label, done: 0, total: 0 }),
      );
      if (content.restored > 0) {
        parts.push(`${content.restored} content documents`);
      }
      // Rejections are the loud half of the fix for silently-corrupting
      // restores — they must never be buried in the warnings list alone.
      if (content.rejected > 0) {
        parts.push(`${content.rejected} document(s) REJECTED (not written)`);
      }
      if (content.pruned > 0) {
        parts.push(`${content.pruned} document(s) removed by replace mode`);
      }
      warnings.push(...content.errors);

      // Push the binaries back into R2. Restoring only the metadata rows leaves
      // the media library pointing at objects that don't exist.
      const assets = collectAssetEntries(zip);
      if (assets.length > 0) {
        const metaByKey = {
          images: indexMetaByKey(imageMeta),
          docs: indexMetaByKey(docMeta),
        };
        const result = await uploadAssetBatches(assets, metaByKey, (done) =>
          setAssetProgress({ done, total: assets.length }),
        );
        if (result.uploaded > 0) parts.push(`${result.uploaded} asset files`);
        warnings.push(...result.errors);
      }

      const msg = `Restored: ${parts.join(", ")}.${skipped > 0 ? ` ${skipped} entry(s) skipped.` : ""}`;
      setRestoreWarnings(warnings);
      setRestoreStatus({
        type: warnings.length ? "warning" : "success",
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
            {includeImages || includeDocs ? (
              <p className="pt-1 text-xs text-amber-600">
                Including assets may take longer and produce a large ZIP file.
                Requires R2 storage to be configured.
              </p>
            ) : (
              <p className="pt-1 text-xs text-red-600">
                Without assets this archive is <strong>not restorable</strong> on
                its own — it carries no image or document files, and no list of
                which ones are missing. Only uncheck these if the storage bucket
                is being backed up separately.
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
                  {preview.collectionCounts.map((c) => (
                    <span
                      key={c.label}
                      className="admin-badge admin-badge-yellow text-[11px]"
                    >
                      {c.count} {c.label.toLowerCase()}
                    </span>
                  ))}
                  {preview.assetFileCount > 0 && (
                    <span className="admin-badge admin-badge-green text-[11px]">
                      {preview.assetFileCount} asset files
                    </span>
                  )}
                </div>
                {preview.collectionCounts.length === 0 && (
                  <p className="pt-1 text-xs text-amber-600">
                    This archive predates content backups — programs,
                    placements and testimonials will not be restored.
                  </p>
                )}
                {preview.assetFileCount === 0 && (
                  <p className="pt-1 text-xs text-amber-600">
                    This archive has no asset files — images and documents will
                    not be restored to storage.
                  </p>
                )}
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
              {restoring
                ? assetProgress
                  ? assetProgress.total > 0
                    ? `Uploading assets ${assetProgress.done}/${assetProgress.total}…`
                    : `Restoring ${assetProgress.label}…`
                  : "Restoring…"
                : "Restore Backup"}
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
