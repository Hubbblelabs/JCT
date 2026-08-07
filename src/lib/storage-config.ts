/**
 * Where object storage lives, resolved once so the provider is an env-file
 * choice rather than a code change.
 *
 * The app talks plain S3 — PutObject, GetObject, HeadObject, DeleteObject,
 * ListObjectsV2, multipart uploads and presigned PUTs. Cloudflare R2 and a
 * self-hosted server (Garage) both answer that API, so the only things that
 * actually differ are the endpoint, the addressing style and the signing
 * region.
 *
 * Three-step resolution per field: canonical `STORAGE_*`, then the legacy
 * `R2_*` name, then a derived default. Keeping the old names as aliases is
 * what lets a deployment switch providers without a coordinated rename across
 * `.env`, the Docker build args and the CI secrets — and lets an existing
 * deployment keep booting untouched.
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
   * resolves to nothing; R2 handles either.
   */
  forcePathStyle: boolean;
}

const env = (name: string): string => (process.env[name] ?? "").trim();

/** First non-empty value among the given env var names. */
const pick = (...names: string[]): string => {
  for (const name of names) {
    const value = env(name);
    if (value) return value;
  }
  return "";
};

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
  const accountId = env("R2_ACCOUNT_ID");
  const explicitEndpoint = pick("STORAGE_ENDPOINT", "R2_ENDPOINT");

  // R2's endpoint is derived from the account id; every other provider states
  // it outright.
  const endpoint =
    explicitEndpoint ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");

  const bucket = pick("STORAGE_BUCKET", "R2_BUCKET_NAME");
  const accessKeyId = pick("STORAGE_ACCESS_KEY_ID", "R2_ACCESS_KEY_ID");
  const secretAccessKey = pick(
    "STORAGE_SECRET_ACCESS_KEY",
    "R2_SECRET_ACCESS_KEY",
  );

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;

  /**
   * The signing region is hashed into every SigV4 signature, so it must match
   * what the server expects exactly. R2 accepts "auto". A self-hosted server
   * declares its own (Garage's `s3_region` in garage.toml) and rejects
   * anything else with `SignatureDoesNotMatch` — an error that reads like bad
   * credentials and sends you looking in the wrong place. Set STORAGE_REGION
   * to the same string the server is configured with.
   */
  const region = pick("STORAGE_REGION") || "auto";

  // Default by provider shape rather than forcing every deployment to set it:
  // an explicit endpoint means a self-hosted server, which almost always needs
  // path style. `STORAGE_FORCE_PATH_STYLE=false` overrides for the exceptions.
  const pathStyleRaw = env("STORAGE_FORCE_PATH_STYLE").toLowerCase();
  const forcePathStyle = pathStyleRaw
    ? pathStyleRaw === "true" || pathStyleRaw === "1"
    : Boolean(explicitEndpoint);

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
 * Which storage env vars carry a value, canonical or legacy. Used by the boot
 * check to tell "nothing configured" (fine) apart from "half configured"
 * (always a mistake) without re-implementing the resolution order.
 */
export function storageEnvPresence(): {
  present: string[];
  missing: string[];
} {
  const groups = [
    {
      label: "endpoint (STORAGE_ENDPOINT or R2_ACCOUNT_ID)",
      names: ["STORAGE_ENDPOINT", "R2_ENDPOINT", "R2_ACCOUNT_ID"],
    },
    {
      label: "bucket (STORAGE_BUCKET or R2_BUCKET_NAME)",
      names: ["STORAGE_BUCKET", "R2_BUCKET_NAME"],
    },
    {
      label: "access key id (STORAGE_ACCESS_KEY_ID or R2_ACCESS_KEY_ID)",
      names: ["STORAGE_ACCESS_KEY_ID", "R2_ACCESS_KEY_ID"],
    },
    {
      label:
        "secret access key (STORAGE_SECRET_ACCESS_KEY or R2_SECRET_ACCESS_KEY)",
      names: ["STORAGE_SECRET_ACCESS_KEY", "R2_SECRET_ACCESS_KEY"],
    },
  ];

  const present: string[] = [];
  const missing: string[] = [];
  for (const group of groups) {
    if (group.names.some((name) => env(name))) present.push(group.label);
    else missing.push(group.label);
  }
  return { present, missing };
}
