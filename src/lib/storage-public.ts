/**
 * The public origin uploaded assets are served from, resolved for BOTH the
 * server and the browser.
 *
 * This lives apart from `storage-config.ts` on purpose: it is imported by
 * client components (`src/components/admin/inputs.tsx`) and by modules that
 * end up in client bundles (`src/lib/utils.ts`), so it must not pull in
 * anything server-only.
 *
 * Both env names are written out literally because `NEXT_PUBLIC_*` values are
 * inlined by textual substitution at build time — Next replaces each
 * `process.env.NEXT_PUBLIC_X` expression it can see with that build's value.
 * A computed lookup (`process.env[name]`) would never be substituted and would
 * read as `undefined` in the browser. With both literals present the `||` runs
 * in the browser against two baked-in constants, which is what makes the
 * legacy `R2_*` name keep working after the canonical `STORAGE_*` one is
 * introduced.
 *
 * Empty string means "not configured" — callers fall back to the
 * `/api/public/images/<key>` proxy route, which streams from storage
 * server-side.
 */
export function publicAssetBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    "";
  // A trailing slash would produce "https://host//images/x.webp". Harmless on
  // most servers, but path-style S3 endpoints treat the empty segment as a
  // real key component and 404.
  return url.replace(/\/+$/, "");
}
