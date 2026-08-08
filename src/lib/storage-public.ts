/**
 * The public origin uploaded assets are served from, resolved for BOTH the
 * server and the browser.
 *
 * This lives apart from `storage-config.ts` on purpose: it is imported by
 * client components (`src/components/admin/inputs.tsx`) and by modules that
 * end up in client bundles (`src/lib/utils.ts`), so it must not pull in
 * anything server-only.
 *
 * The env name is written out literally because `NEXT_PUBLIC_*` values are
 * inlined by textual substitution at build time — a computed lookup
 * (`process.env[name]`) is never substituted and reads as `undefined` in the
 * browser.
 *
 * Empty string means "not configured" — callers fall back to the
 * `/api/public/images/<key>` proxy route, which streams from storage
 * server-side.
 */
export function publicAssetBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL || "";
  // A trailing slash would produce "https://host//images/x.webp". Harmless on
  // most servers, but path-style S3 endpoints treat the empty segment as a
  // real key component and 404.
  return url.replace(/\/+$/, "");
}
