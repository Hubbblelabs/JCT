import { z } from "zod";
import { storageEnvPresence } from "./storage-config";

/**
 * Boot-time validation of server environment configuration.
 *
 * The motivating failure: `trustHost` was never configured, so every
 * production build returned 500 from `/api/auth/*` and nobody could log into
 * the admin panel — a misconfiguration that only surfaced as a runtime error,
 * on the one request path nobody exercises until they need it. Config problems
 * should be a startup error with a clear message, not a 500 later.
 *
 * Validation is skipped during `next build`, which only collects page data and
 * would otherwise fail on a machine with an incomplete local `.env`. The
 * running server (`next start` / `next dev`) still refuses to boot.
 */

/**
 * Values that must never be accepted as a real secret.
 *
 * A single constant drifted out of sync with `.env.example` once already: the
 * guard checked a string the repo never shipped, and the shipped placeholder
 * was caught only by accident (it is 31 characters, one short of the `.min(32)`
 * check). A set survives edits to either file — add to it, never replace it.
 */
const SECRET_PLACEHOLDERS = new Set([
  "your-random-32-char-secret-here",
  "replace-with-32-byte-random-string",
  "changeme",
  "secret",
]);

const EnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .refine(
      (v) => v.startsWith("mongodb://") || v.startsWith("mongodb+srv://"),
      "MONGODB_URI must be a mongodb:// or mongodb+srv:// connection string",
    ),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters")
    .refine(
      (v) => !SECRET_PLACEHOLDERS.has(v.trim()),
      "NEXTAUTH_SECRET is still the placeholder value — generate one with: openssl rand -base64 32",
    ),
  NEXTAUTH_URL: z.url("NEXTAUTH_URL must be an absolute URL").optional(),
  MONGODB_MAX_POOL_SIZE: z
    .string()
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) > 0,
      "MONGODB_MAX_POOL_SIZE must be a positive integer",
    )
    .optional(),
});

/**
 * Object storage is optional as a whole — images fall back to local serving
 * through `/api/public/images/<key>`. But a *partial* set is always a mistake:
 * uploads fail at request time with an SDK error rather than falling back
 * cleanly.
 */
function checkStorage(): string | null {
  const { present, missing } = storageEnvPresence();
  if (present.length === 0 || missing.length === 0) return null;
  return `Object storage is partially configured — missing: ${missing.join(", ")}. Set all four or none. See .env.example.`;
}

/**
 * `NEXT_PUBLIC_STORAGE_PUBLIC_URL` is the origin a *browser* reads assets from.
 * It is not the S3 API endpoint with the bucket appended: Garage's S3 port
 * refuses every unsigned request ("Garage does not support anonymous access
 * yet"), so a public URL carrying the bucket segment serves 403 to every image
 * on the site.
 *
 * That misconfiguration is worth failing the boot over because of how it
 * presents. Uploads succeed, the object really is in the bucket, and the admin
 * shows the picked file correctly — the preview at that point is a local blob:
 * URL. Only once the value is saved does the field switch to the public URL and
 * go blank. The visible symptom is "saving breaks the image", which sends you
 * looking at the upload and save paths rather than at one env var.
 */
function checkPublicAssetUrl(): string | null {
  const raw = (process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL || "").trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return `NEXT_PUBLIC_STORAGE_PUBLIC_URL must be an absolute URL (got "${raw}").`;
  }

  const bucket = process.env.STORAGE_BUCKET?.trim();
  const segments = url.pathname.split("/").filter(Boolean);
  if (bucket && segments[segments.length - 1] === bucket) {
    return (
      `NEXT_PUBLIC_STORAGE_PUBLIC_URL must not end with the bucket name ("${bucket}") — ` +
      `that is the path-style S3 URL, which answers 403 to the unsigned requests a browser makes. ` +
      `Point it at the public read origin instead (probably "${url.origin}"), so a stored key ` +
      `appends directly to give ${url.origin}/images/example.webp. See .env.example.`
    );
  }
  return null;
}

/**
 * `next.config.ts` allowlists the asset host for `/_next/image` with
 * `protocol: "https"`, so a plain-HTTP origin fails every optimized image with
 * '"url" parameter is not allowed'. Loopback is exempt — a local store over
 * HTTP is a normal dev setup.
 */
function warnPublicAssetScheme(): string | null {
  const raw = (process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL || "").trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null; // already reported by checkPublicAssetUrl
  }
  const loopback = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(
    url.hostname,
  );
  if (url.protocol === "https:" || loopback) return null;
  return `NEXT_PUBLIC_STORAGE_PUBLIC_URL is not HTTPS ("${url.origin}"). next/image only allowlists the asset host over TLS, so optimized images will fail with '"url" parameter is not allowed'.`;
}

export function validateServerEnv(): void {
  const problems: string[] = [];

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      problems.push(`${issue.path.join(".") || "(env)"}: ${issue.message}`);
    }
  }

  const storage = checkStorage();
  if (storage) problems.push(storage);

  const assetUrl = checkPublicAssetUrl();
  if (assetUrl) problems.push(assetUrl);

  const scheme = warnPublicAssetScheme();
  if (scheme) console.warn(`[env] WARNING: ${scheme}`);

  if (problems.length === 0) return;

  const msg =
    "Invalid server environment configuration:\n" +
    problems.map((p) => `  - ${p}`).join("\n") +
    "\nSee .env.example.";

  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.warn(`[env] WARNING (build): ${msg}`);
    return;
  }
  throw new Error(msg);
}
