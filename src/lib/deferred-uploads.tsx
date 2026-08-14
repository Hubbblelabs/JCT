"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { RatioType } from "@/lib/validation/imageAsset";

export interface PendingUpload {
  file: File;
  previewUrl: string;
  endpoint: "images" | "documents";
  /**
   * Ratio preset chosen at pick time. Carried through the deferred queue so a
   * deferred upload resizes identically to an immediate one — without this the
   * editor's choice would be dropped at flush and land as "auto".
   */
  ratioType?: RatioType;
}

export interface DeferredUploadsContextValue {
  register(key: string, info: PendingUpload): void;
  cancel(key: string): void;
  getPreview(key: string): string | null;
  flush<T>(value: T): Promise<T>;
  discardAll(): void;
}

const Ctx = createContext<DeferredUploadsContextValue | null>(null);

export function DeferredUploadsProvider({ children }: { children: ReactNode }) {
  const pending = useRef(new Map<string, PendingUpload>());

  useEffect(() => {
    const map = pending.current;
    return () => {
      for (const info of map.values()) URL.revokeObjectURL(info.previewUrl);
      map.clear();
    };
  }, []);

  const ctx: DeferredUploadsContextValue = {
    register(key, info) {
      pending.current.set(key, info);
    },
    cancel(key) {
      const info = pending.current.get(key);
      if (info) {
        URL.revokeObjectURL(info.previewUrl);
        pending.current.delete(key);
      }
    },
    getPreview(key) {
      if (!key.startsWith("pending:")) return null;
      return pending.current.get(key)?.previewUrl ?? null;
    },
    async flush<T>(value: T): Promise<T> {
      const map = pending.current;
      // An empty queue still has to be checked: a value carrying a placeholder
      // with nothing queued to satisfy it is exactly the stale-key case below.
      if (map.size === 0) {
        assertNoPlaceholders(value);
        return value;
      }
      const replacements = new Map<string, string>();
      const errors: string[] = [];
      await Promise.all(
        Array.from(map.entries()).map(async ([placeholderKey, info]) => {
          if (!valueContains(value, placeholderKey)) {
            URL.revokeObjectURL(info.previewUrl);
            map.delete(placeholderKey);
            return;
          }
          try {
            const realKey = await doUpload(
              info.file,
              info.endpoint,
              info.ratioType,
            );
            replacements.set(placeholderKey, realKey);
            URL.revokeObjectURL(info.previewUrl);
            map.delete(placeholderKey);
          } catch (err) {
            errors.push(err instanceof Error ? err.message : "Upload failed");
          }
        }),
      );
      if (errors.length > 0) throw new Error(errors.join("; "));
      const flushed = deepReplace(value, replacements) as T;
      assertNoPlaceholders(flushed);
      return flushed;
    },
    discardAll() {
      for (const info of pending.current.values())
        URL.revokeObjectURL(info.previewUrl);
      pending.current.clear();
    },
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useDeferredUploads(): DeferredUploadsContextValue {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useDeferredUploads must be used inside DeferredUploadsProvider",
    );
  return ctx;
}

export function useDeferredUploadsOptional(): DeferredUploadsContextValue | null {
  return useContext(Ctx);
}

async function doUpload(
  file: File,
  endpoint: "images" | "documents",
  ratioType?: RatioType,
): Promise<string> {
  if (endpoint === "documents") return doPresignedDocumentUpload(file);

  const fd = new FormData();
  fd.append("file", file);
  if (ratioType) fd.append("ratioType", ratioType);
  const r = await fetch("/api/admin/images/upload", {
    method: "POST",
    body: fd,
  });
  if (!r.ok) {
    // Vercel rejects a >~4.5 MB function body with a 413 whose body is not JSON
    // ("FUNCTION_PAYLOAD_TOO_LARGE"). Surface a clear message instead of the
    // generic "Upload failed" that the JSON-parse fallback would produce.
    if (r.status === 413) {
      throw new Error(
        "Image too large to upload (limit 4 MB). Please choose a smaller image.",
      );
    }
    const body = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    const detail = Array.isArray(body.details)
      ? (body.details as Array<{ message: string }>)[0]?.message
      : undefined;
    throw new Error(
      detail ??
        (body.message as string) ??
        (body.error as string) ??
        "Upload failed",
    );
  }
  const data = (await r.json()) as Record<string, string>;
  return data.storage_key ?? data.url;
}

async function doPresignedDocumentUpload(file: File): Promise<string> {
  // Step 1: get a presigned PUT URL from the server (tiny payload — no file bytes)
  const presignRes = await fetch("/api/admin/documents/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      size: file.size,
      mime_type: file.type,
    }),
  });
  if (!presignRes.ok) {
    const body = (await presignRes.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    throw new Error(
      (body.message as string) ??
        (body.error as string) ??
        "Failed to get upload URL",
    );
  }
  const { presigned_url, storage_key, safe_name } =
    (await presignRes.json()) as {
      presigned_url: string;
      storage_key: string;
      safe_name: string;
    };

  // Step 2: upload directly to storage — bypasses Vercel's 4.5 MB payload limit
  const uploadRes = await fetch(presigned_url, {
    method: "PUT",
    headers: { "Content-Type": "application/pdf" },
    body: file,
  });
  if (!uploadRes.ok) {
    throw new Error("Direct upload to storage failed");
  }

  // Step 3: record the upload in the DB
  const confirmRes = await fetch("/api/admin/documents/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storage_key,
      filename: safe_name,
      size: file.size,
      mime_type: file.type,
    }),
  });
  if (!confirmRes.ok) {
    const body = (await confirmRes.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    throw new Error(
      (body.message as string) ??
        (body.error as string) ??
        "Failed to confirm upload",
    );
  }

  return storage_key;
}

/**
 * Refuse to hand back a value that still carries a `pending:` placeholder.
 *
 * Every placeholder in the value should have just been uploaded and replaced.
 * One that survives is a placeholder the queue never knew about — almost always
 * a caller that saved once without adopting the flushed result, then saved
 * again with the now-forgotten key still in its state. Persisting that writes a
 * dead `pending:` string over a real storage key, and the image disappears from
 * the live site with nothing in the logs to say why. Failing the save is
 * recoverable; silently publishing a broken reference is not.
 */
function assertNoPlaceholders(value: unknown): void {
  const stale = collectPlaceholders(value);
  if (stale.length === 0) return;
  throw new Error(
    `Save aborted: ${stale.length} image ${
      stale.length === 1 ? "pick was" : "picks were"
    } lost before upload (${stale.join(", ")}). Re-pick the image and save again.`,
  );
}

function collectPlaceholders(value: unknown, found: string[] = []): string[] {
  if (typeof value === "string") {
    if (value.startsWith("pending:") && !found.includes(value))
      found.push(value);
  } else if (Array.isArray(value)) {
    for (const v of value) collectPlaceholders(v, found);
  } else if (value !== null && typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>))
      collectPlaceholders(v, found);
  }
  return found;
}

function valueContains(value: unknown, needle: string): boolean {
  if (typeof value === "string") return value === needle;
  if (Array.isArray(value)) return value.some((v) => valueContains(v, needle));
  if (value !== null && typeof value === "object")
    return Object.values(value as Record<string, unknown>).some((v) =>
      valueContains(v, needle),
    );
  return false;
}

function deepReplace<T>(value: T, map: Map<string, string>): T {
  if (typeof value === "string") return (map.get(value) ?? value) as T;
  if (Array.isArray(value))
    return value.map((v) => deepReplace(v, map)) as unknown as T;
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepReplace(v, map);
    }
    return out as T;
  }
  return value;
}
