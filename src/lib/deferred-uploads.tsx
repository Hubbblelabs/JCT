"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

export interface PendingUpload {
  file: File;
  previewUrl: string;
  endpoint: "images" | "documents";
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
      if (map.size === 0) return value;
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
            const realKey = await doUpload(info.file, info.endpoint);
            replacements.set(placeholderKey, realKey);
            URL.revokeObjectURL(info.previewUrl);
            map.delete(placeholderKey);
          } catch (err) {
            errors.push(err instanceof Error ? err.message : "Upload failed");
          }
        }),
      );
      if (errors.length > 0) throw new Error(errors.join("; "));
      return deepReplace(value, replacements) as T;
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
): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const url =
    endpoint === "images"
      ? "/api/admin/images/upload"
      : "/api/admin/documents/upload";
  const r = await fetch(url, { method: "POST", body: fd });
  if (!r.ok) {
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
