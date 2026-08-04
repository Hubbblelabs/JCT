import { z } from "zod";
import { zClampedString } from "./_primitives";

/**
 * Bodies for the two-step document upload (presign → direct PUT → confirm).
 *
 * Both routes used to parse with `(await req.json()) as {...}` — an `as` that
 * lies about untrusted input. A non-string `filename` reached `.replace()` and
 * came back as a 500 "Internal server error" instead of a 400, and an
 * unbounded one produced an arbitrarily long R2 storage key and
 * `DocumentAsset.filename`.
 */

export const DOCUMENT_UPLOAD_LIMITS = {
  filenameMax: 200,
  storageKeyMax: 300,
  /** 25 MB, matching the presign route's own cap. */
  sizeMax: 25 * 1024 * 1024,
} as const;

export const DOCUMENT_UPLOAD_MIME = ["application/pdf"] as const;

export const DocumentPresignSchema = z.object({
  filename: zClampedString(1, DOCUMENT_UPLOAD_LIMITS.filenameMax, "Filename"),
  size: z
    .number()
    .int("File size must be a whole number of bytes")
    .positive("File size must be greater than zero")
    .max(DOCUMENT_UPLOAD_LIMITS.sizeMax, "File too large. Max is 25 MB."),
  mime_type: z.enum(DOCUMENT_UPLOAD_MIME, {
    error: () => "Invalid file type. Only PDF files are accepted.",
  }),
});

export const DocumentConfirmSchema = z.object({
  storage_key: zClampedString(
    1,
    DOCUMENT_UPLOAD_LIMITS.storageKeyMax,
    "Storage key",
  ).refine(
    (v) => v.startsWith("documents/"),
    "Invalid storage_key — only keys minted by the presign route are accepted",
  ),
  filename: zClampedString(1, DOCUMENT_UPLOAD_LIMITS.filenameMax, "Filename"),
  // Advisory only: the route confirms both against the object actually in R2.
  size: z.number().int().positive().optional(),
  mime_type: z.enum(DOCUMENT_UPLOAD_MIME).optional(),
});

export type DocumentPresignValue = z.infer<typeof DocumentPresignSchema>;
export type DocumentConfirmValue = z.infer<typeof DocumentConfirmSchema>;
