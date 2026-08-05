import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import type { Readable } from "stream";

/**
 * One client per process, not one per call.
 *
 * An `S3Client` owns an HTTPS agent and its socket pool. Constructing a fresh
 * one for every operation threw that pool away each time, so no connection was
 * ever reused and every single object fetch paid a full TCP + TLS handshake to
 * Cloudflare — on the order of 100 ms each. A whole-bucket backup walks ~1,700
 * objects, which made handshakes alone the dominant cost of an export.
 *
 * The SDK's default Node handler already keeps its agent alive with 50 max
 * sockets, which is above the backup builder's fetch concurrency — so reusing
 * the client is the whole fix; no custom `requestHandler` is needed.
 *
 * Cached against the credential triple so a changed env var still rebuilds it,
 * even though these never change at runtime in practice.
 */
let cachedClient: { fingerprint: string; client: S3Client } | null = null;

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured");
  }

  const fingerprint = `${accountId}:${accessKeyId}:${secretAccessKey}`;
  if (cachedClient?.fingerprint === fingerprint) return cachedClient.client;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  cachedClient = { fingerprint, client };
  return client;
}

export async function getPresignedPutUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
  contentLength?: number,
): Promise<string> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");
  // When contentLength is provided it becomes a *signed* header, so the client
  // must upload exactly that many bytes — the presign route's size check is
  // otherwise advisory (a presigned PUT has no inherent size cap).
  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ...(typeof contentLength === "number" && contentLength > 0
        ? { ContentLength: contentLength }
        : {}),
    }),
    { expiresIn },
  );
}

/** The public URL an object is served from once it exists in the bucket. */
export function r2PublicUrl(key: string): string {
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  return publicUrl ? `${publicUrl}/${key}` : `/api/public/images/${key}`;
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return r2PublicUrl(key);
}

/** Multipart part size. Below R2's 5 MB floor, parts are rejected. */
const UPLOAD_PART_BYTES = 8 * 1024 * 1024;

/**
 * Upload from a stream without ever holding the object in memory.
 *
 * A plain `PutObjectCommand` cannot be used here: it needs the length up front,
 * and a retry would replay a stream that has already been consumed. `Upload`
 * splits the stream into parts and retries per part, which is what makes a
 * half-gigabyte PDF survivable — the restore path has several.
 */
export async function uploadStreamToR2(
  key: string,
  body: Readable,
  contentType: string,
): Promise<string> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  await new Upload({
    client,
    params: { Bucket: bucket, Key: key, Body: body, ContentType: contentType },
    partSize: UPLOAD_PART_BYTES,
    // One part in flight: the source is a single sequential read off the
    // spooled archive, so concurrency would only buffer parts in memory.
    queueSize: 1,
  }).done();

  return r2PublicUrl(key);
}

/**
 * HEAD an object to confirm it exists and read its true size/type without
 * downloading the body. Returns null when the object doesn't exist.
 */
export async function headR2Object(
  key: string,
): Promise<{ size: number; contentType: string } | null> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  try {
    const res = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key }),
    );
    return {
      size: res.ContentLength ?? 0,
      contentType: res.ContentType ?? "application/octet-stream",
    };
  } catch {
    return null;
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/**
 * Recursively walk any JSON-serialisable value and collect every string that
 * looks like a tracked R2 storage key. Only keys we generate ourselves are
 * matched: images are under "images/…" and documents under "documents/…".
 * External URLs (http/https) and local proxy paths are intentionally excluded.
 */
export function extractR2Keys(
  value: unknown,
  out = new Set<string>(),
  visited = new WeakSet<object>(),
): Set<string> {
  if (typeof value === "string") {
    if (
      (value.startsWith("images/") || value.startsWith("documents/")) &&
      !value.startsWith("http")
    ) {
      out.add(value);
    }
  } else if (value && typeof value === "object") {
    if (visited.has(value)) {
      return out;
    }
    visited.add(value);

    // If it has a toObject function (like Mongoose documents), convert to plain object/array
    if (
      "toObject" in value &&
      typeof (value as { toObject: unknown }).toObject === "function"
    ) {
      try {
        const plain = (value as { toObject: () => unknown }).toObject();
        extractR2Keys(plain, out, visited);
        return out;
      } catch {
        // Fall back to traversing directly if toObject fails
      }
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        extractR2Keys(item, out, visited);
      }
    } else {
      for (const v of Object.values(value as Record<string, unknown>)) {
        extractR2Keys(v, out, visited);
      }
    }
  }
  return out;
}

export async function getFromR2(
  key: string,
): Promise<{ body: ReadableStream; contentType: string }> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  return {
    body: res.Body as ReadableStream,
    contentType: res.ContentType ?? "image/webp",
  };
}

/**
 * An object's bytes as a Node stream, never materialised in memory. This is
 * what makes a whole-bucket backup possible: the archive pulls each object
 * through at whatever rate the client drains it, so RAM stays flat regardless
 * of how large the object — or the bucket — is.
 */
export async function getR2Stream(
  key: string,
  signal?: AbortSignal,
): Promise<Readable> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { abortSignal: signal },
  );
  if (!res.Body) throw new Error(`No body returned for R2 key: ${key}`);
  return res.Body as Readable;
}

/**
 * An object's bytes as a single Buffer.
 *
 * The streaming reader above is the right tool when the consumer drains at an
 * unknown rate, because it holds nothing. It is the wrong tool when many small
 * objects must be fetched *concurrently*: an open, unread response body is a
 * socket held idle, so concurrency there means idle sockets that can time out.
 * Reading small objects to completion frees the socket immediately, which is
 * what lets the backup builder run many fetches at once. Only call this for
 * objects known to be small — the caller owns the memory bound.
 */
export async function getR2Bytes(
  key: string,
  signal?: AbortSignal,
): Promise<Buffer> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { abortSignal: signal },
  );
  if (!res.Body) throw new Error(`No body returned for R2 key: ${key}`);
  return Buffer.from(await res.Body.transformToByteArray());
}

/**
 * Enumerate every object under a prefix, following pagination to the end.
 *
 * The bucket — not the `ImageAsset`/`DocumentAsset` collections — is the source
 * of truth for what actually exists in storage. Seeded and hand-uploaded files
 * live in R2 without a tracking row, so anything that walks only the DB (a
 * backup, an audit) silently misses them.
 */
export async function listR2Objects(
  prefix: string,
): Promise<Array<{ key: string; size: number }>> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not configured");

  const out: Array<{ key: string; size: number }> = [];
  let token: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    for (const obj of res.Contents ?? []) {
      // Directory placeholder objects carry a trailing slash and no bytes.
      if (!obj.Key || obj.Key.endsWith("/")) continue;
      out.push({ key: obj.Key, size: obj.Size ?? 0 });
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return out;
}

export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}
