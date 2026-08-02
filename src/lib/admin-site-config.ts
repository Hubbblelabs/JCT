/**
 * Client helpers the live-page editors share for the SiteConfig draft/publish
 * split.
 *
 * The editors used to load from `/api/public/site-config`, which only ever
 * returns published values — fine while every save published immediately, but
 * it would silently discard a saved-but-unpublished draft the moment the page
 * was reopened. They read the admin endpoint instead, which carries both.
 */

export type SaveMode = "draft" | "publish";

export type EditableConfig<T> = {
  /** The draft — what the editor edits. Null when the key is unseeded. */
  value: T | null;
  /** "draft" means there are edits that are not live yet. */
  status: "draft" | "published" | null;
};

type ConfigDoc = {
  config_key?: string;
  value?: unknown;
  published_value?: unknown;
  status?: string;
};

/** Load a config key's draft for editing. Throws with a readable message. */
export async function loadEditableConfig<T>(
  key: string,
): Promise<EditableConfig<T>> {
  const r = await fetch(
    `/api/admin/site-config?key=${encodeURIComponent(key)}`,
  );
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? body?.error ?? "Failed to load content");
  }
  const docs = (await r.json()) as ConfigDoc[] | ConfigDoc;
  const doc = Array.isArray(docs)
    ? docs.find((d) => d.config_key === key)
    : docs;
  if (!doc) return { value: null, status: null };

  // A key seeded straight into `published_value` (older seeds did) still has
  // to open with something to edit.
  const raw = doc.value ?? doc.published_value ?? null;
  return {
    value: raw && typeof raw === "object" ? (raw as T) : null,
    status:
      doc.status === "draft" || doc.status === "published" ? doc.status : null,
  };
}

/** Write a config key. `mode: "draft"` leaves the live page untouched. */
export async function saveEditableConfig(
  key: string,
  value: unknown,
  mode: SaveMode,
): Promise<void> {
  const r = await fetch("/api/admin/site-config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      config_key: key,
      value,
      publish: mode === "publish",
    }),
  });
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? body?.error ?? "Save failed");
  }
}
