/**
 * Where object storage lives, resolved once so the provider is an env-file
 * choice rather than a code change.
 *
 * The app talks plain S3 — PutObject, GetObject, HeadObject, DeleteObject,
 * ListObjectsV2, multipart uploads and presigned PUTs — so any S3-compatible
 * server works. Only the endpoint, the addressing style and the signing region
 * differ between them.
 */

export interface StorageConfig {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Part of the SigV4 signature — see the note on `STORAGE_REGION` below. */
  region: string;
  /**
   * Path-style addressing (`https://host/bucket/key`) instead of virtual-host
   * style (`https://bucket.host/key`). Self-hosted servers are normally
   * reached by a single hostname with no wildcard DNS, so virtual-host style
   * resolves to nothing.
   */
  forcePathStyle: boolean;
}

const env = (name: string): string => (process.env[name] ?? "").trim();

/** The four variables that must be set together, in report order. */
const REQUIRED = [
  "STORAGE_ENDPOINT",
  "STORAGE_BUCKET",
  "STORAGE_ACCESS_KEY_ID",
  "STORAGE_SECRET_ACCESS_KEY",
] as const;

/**
 * The complete storage configuration, or null when storage is not configured
 * at all (a supported state — assets then fall back to local serving through
 * `/api/public/images/<key>`).
 *
 * A *partial* configuration also returns null rather than a half-built client,
 * so the failure surfaces at boot via `validateServerEnv` instead of as an SDK
 * error on the first upload.
 */
export function storageConfig(): StorageConfig | null {
  const endpoint = env("STORAGE_ENDPOINT");
  const bucket = env("STORAGE_BUCKET");
  const accessKeyId = env("STORAGE_ACCESS_KEY_ID");
  const secretAccessKey = env("STORAGE_SECRET_ACCESS_KEY");

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;

  /**
   * The signing region is hashed into every SigV4 signature, so it must match
   * what the server expects exactly. Garage declares its own (`s3_region` in
   * garage.toml) and rejects anything else with `SignatureDoesNotMatch` — an
   * error that reads like bad credentials and sends you looking in the wrong
   * place. Set STORAGE_REGION to the same string the server is configured with.
   */
  const region = env("STORAGE_REGION") || "auto";

  // Self-hosted servers rarely have the wildcard DNS virtual-host style needs,
  // so path style is the default. `STORAGE_FORCE_PATH_STYLE=false` overrides.
  const pathStyleRaw = env("STORAGE_FORCE_PATH_STYLE").toLowerCase();
  const forcePathStyle = pathStyleRaw
    ? pathStyleRaw === "true" || pathStyleRaw === "1"
    : true;

  return {
    endpoint,
    bucket,
    accessKeyId,
    secretAccessKey,
    region,
    forcePathStyle,
  };
}

export function isStorageConfigured(): boolean {
  return storageConfig() !== null;
}

/**
 * Which storage env vars carry a value. Used by the boot check to tell
 * "nothing configured" (fine) apart from "half configured" (always a mistake).
 */
export function storageEnvPresence(): {
  present: string[];
  missing: string[];
} {
  const present: string[] = [];
  const missing: string[] = [];
  for (const name of REQUIRED) {
    if (env(name)) present.push(name);
    else missing.push(name);
  }
  return { present, missing };
}
