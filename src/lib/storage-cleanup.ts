/**
 * Client-side utility for cleaning up R2 storage when files are removed or
 * replaced in the admin UI.
 *
 * Always fire-and-forget — errors are logged but never propagate to callers
 * so UI flows are never blocked by cleanup failures.
 */
export function deleteUploadedAsset(key: string): void {
  if (!key) return;

  // Only act on storage keys we generate ourselves.
  // Images: "images/<filename>"
  // Documents: "documents/<filename>"
  // External URLs, proxy paths, and empty strings are silently ignored.
  if (!key.startsWith("images/") && !key.startsWith("documents/")) return;

  const endpoint = key.startsWith("images/")
    ? `/api/admin/images?storage_key=${encodeURIComponent(key)}`
    : `/api/admin/documents?storage_key=${encodeURIComponent(key)}`;

  fetch(endpoint, { method: "DELETE" }).catch((err) =>
    console.warn("[storage-cleanup] Failed to delete asset:", key, err),
  );
}
