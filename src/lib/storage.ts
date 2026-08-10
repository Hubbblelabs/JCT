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
import { storageConfig } from "@/lib/storage-config";
import { publicAssetBaseUrl } from "@/lib/storage-public";

/**
 * The S3 layer. Endpoint, addressing style and signing region all come from
 * `storage-config.ts`, so the same code drives any S3-compatible server.
 *
 * One client per process, not one per call: an `S3Client` owns an HTTPS agent
 * and its socket pool, so constructing one per operation makes every object
 * fetch pay a full TCP + TLS handshake. A whole-bucket backup walks ~1,700
 * objects, which made handshakes the dominant cost of an export.
 *
 * Cached against every value that shapes the client, so pointing the app at a
 * different provider rebuilds it instead of reusing one aimed at the old
 * endpoint.
 *
 * Two clients, not one, because two different consumers reach the store from
 * two different places. Everything this process does itself goes through
 * `STORAGE_INTERNAL_ENDPOINT` when it is set — on a single-box deployment the
 * store is a neighbouring container, and routing thousands of backup GETs out
 * to the public hostname and back is both slow and pointlessly dependent on the
 * site's internet link. Presigned URLs are handed to a browser, which can only
 * use the public one. See `storage-config.ts` for the full note.
 */
const clients = new Map<string, S3Client>();

function getS3Client(opts?: { forBrowser?: boolean }) {
  const cfg = storageConfig();
  if (!cfg) throw new Error("Object storage is not configured");

  const endpoint =
    opts?.forBrowser || !cfg.internalEndpoint
      ? cfg.endpoint
      : cfg.internalEndpoint;

  const fingerprint = [
    endpoint,
    cfg.region,
    String(cfg.forcePathStyle),
    cfg.accessKeyId,
    cfg.secretAccessKey,
  ].join("|");
  const cached = clients.get(fingerprint);
  if (cached) return cached;

  const client = new S3Client({
    region: cfg.region,
    endpoint,
    forcePathStyle: cfg.forcePathStyle,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
    /**
     * Flexible checksums off. Both default to `WHEN_SUPPORTED`, which makes the
     * SDK attach `x-amz-checksum-crc32` to uploads and *verify* it on every
     * download — against whatever the server chooses to echo back.
     *
     * That verification is only meaningful when the server implements the same
     * scheme AWS does, and Garage does not: a multipart upload (the restore
     * path's `uploadObjectStream`, and anything over the part size) stores a
     * checksum that is not the whole-object CRC32, and returns it without the
     * `-N` composite suffix that tells the SDK to skip the check. The SDK then
     * hashes the bytes it received, compares them to a number that never
     * described those bytes, and throws
     *   `Checksum mismatch: expected "…" but received "…" in response header
     *    "x-amz-checksum-crc32"`
     * on a GET of a perfectly intact object. In a backup that surfaces as files
     * silently listed as unreadable in `_report.json` — an archive quietly
     * missing documents, which is the worst possible way to learn about it.
     *
     * `WHEN_REQUIRED` leaves the header off requests and stops validating
     * responses. Integrity on the wire is still covered by TLS (or, on the
     * internal endpoint, by not leaving the host). This is also what keeps
     * presigned PUTs usable: with `WHEN_SUPPORTED` the presigner folds
     * checksum headers into the signature, and a plain browser PUT that cannot
     * produce them is rejected.
     */
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  // Bounded by construction: at most one entry per (endpoint, credentials)
  // pair, and both come from the environment — so this holds two clients at
  // the very most, not one per request.
  clients.set(fingerprint, client);
  return client;
}

function bucketName(): string {
  const bucket = storageConfig()?.bucket;
  if (!bucket) throw new Error("Object storage bucket is not configured");
  return bucket;
}

export async function getPresignedPutUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
  contentLength?: number,
): Promise<string> {
  // Signed for the browser, so it must carry the public endpoint even when the
  // server itself reaches storage by a shorter internal address.
  const client = getS3Client({ forBrowser: true });
  const bucket = bucketName();
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
export function publicAssetUrl(key: string): string {
  const publicUrl = publicAssetBaseUrl();
  return publicUrl ? `${publicUrl}/${key}` : `/api/public/images/${key}`;
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const client = getS3Client();
  const bucket = bucketName();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return publicAssetUrl(key);
}

/** Multipart part size. Below the S3 5 MB floor, parts are rejected. */
const UPLOAD_PART_BYTES = 8 * 1024 * 1024;

/**
 * Upload from a stream without ever holding the object in memory.
 *
 * A plain `PutObjectCommand` cannot be used here: it needs the length up front,
 * and a retry would replay a stream that has already been consumed. `Upload`
 * splits the stream into parts and retries per part, which is what makes a
 * half-gigabyte PDF survivable — the restore path has several.
 */
export async function uploadObjectStream(
  key: string,
  body: Readable,
  contentType: string,
): Promise<string> {
  const client = getS3Client();
  const bucket = bucketName();

  await new Upload({
    client,
    params: { Bucket: bucket, Key: key, Body: body, ContentType: contentType },
    partSize: UPLOAD_PART_BYTES,
    // One part in flight: the source is a single sequential read off the
    // spooled archive, so concurrency would only buffer parts in memory.
    queueSize: 1,
  }).done();

  return publicAssetUrl(key);
}

/**
 * HEAD an object to confirm it exists and read its true size/type without
 * downloading the body. Returns null when the object doesn't exist.
 */
export async function headObject(
  key: string,
): Promise<{ size: number; contentType: string } | null> {
  const client = getS3Client();
  const bucket = bucketName();

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

export async function deleteObject(key: string): Promise<void> {
  const client = getS3Client();
  const bucket = bucketName();

  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/**
 * Recursively walk any JSON-serialisable value and collect every string that
 * looks like a tracked storage key. Only keys we generate ourselves are
 * matched: images are under "images/…" and documents under "documents/…".
 * External URLs (http/https) and local proxy paths are intentionally excluded.
 */
export function extractStorageKeys(
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
        extractStorageKeys(plain, out, visited);
        return out;
      } catch {
        // Fall back to traversing directly if toObject fails
      }
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        extractStorageKeys(item, out, visited);
      }
    } else {
      for (const v of Object.values(value as Record<string, unknown>)) {
        extractStorageKeys(v, out, visited);
      }
    }
  }
  return out;
}

export async function getObject(
  key: string,
): Promise<{ body: ReadableStream; contentType: string }> {
  const client = getS3Client();
  const bucket = bucketName();

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
export async function getObjectStream(
  key: string,
  signal?: AbortSignal,
): Promise<Readable> {
  const client = getS3Client();
  const bucket = bucketName();

  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { abortSignal: signal },
  );
  if (!res.Body) throw new Error(`No body returned for storage key: ${key}`);
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
export async function getObjectBytes(
  key: string,
  signal?: AbortSignal,
): Promise<Buffer> {
  const client = getS3Client();
  const bucket = bucketName();

  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { abortSignal: signal },
  );
  if (!res.Body) throw new Error(`No body returned for storage key: ${key}`);
  return Buffer.from(await res.Body.transformToByteArray());
}

/**
 * Enumerate every object under a prefix, following pagination to the end.
 *
 * The bucket — not the `ImageAsset`/`DocumentAsset` collections — is the source
 * of truth for what actually exists in storage. Seeded and hand-uploaded files
 * live in the bucket without a tracking row, so anything that walks only the DB
 * (a backup, an audit) silently misses them.
 */
export async function listObjects(
  prefix: string,
): Promise<Array<{ key: string; size: number }>> {
  const client = getS3Client();
  const bucket = bucketName();

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

export { isStorageConfigured } from "@/lib/storage-config";
