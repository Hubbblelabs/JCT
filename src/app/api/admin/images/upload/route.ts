import { NextRequest } from "next/server";
import sharp from "sharp";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import {
  requireRole,
  enforceAssetScope,
  json,
  badRequest,
  serverError,
  validateFields,
  validationError,
  enforceUploadRateLimit,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import {
  ImageUploadFieldsSchema,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  IMAGE_RATIOS,
  ratioSourceTooSmall,
} from "@/lib/validation";

// sharp decode + resize is CPU-bound and can outrun the default limit on a
// large source image.
export const maxDuration = 60;

/**
 * Simplify actual pixel dimensions to a display ratio ("1920x1080" -> "16:9").
 * Only used for "auto" uploads, where there is no preset ratio to record.
 * Falls back to "W:H" when the reduced terms are still unwieldy.
 */
function aspectRatioOf(width?: number, height?: number): string {
  if (!width || !height) return "original";
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  return w <= 40 && h <= 40 ? `${w}:${h}` : `${width}:${height}`;
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const limited = enforceUploadRateLimit(req, session!.user?.email ?? "");
  if (limited) return limited;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return badRequest("No file provided");
    // Reject SVG explicitly even if it never appears in the allowlist —
    // sharp + libvips can parse SVG and the format historically carries
    // XXE / external-fetch risk. Defense in depth.
    if (file.type === "image/svg+xml" || /\.svgz?$/i.test(file.name)) {
      return badRequest("SVG uploads are not supported");
    }
    if (
      !ALLOWED_MIME_TYPES.includes(
        file.type as (typeof ALLOWED_MIME_TYPES)[number],
      )
    ) {
      return badRequest(
        `Invalid file type "${file.type}". Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return badRequest(
        `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
      );
    }

    // When the caller doesn't tag an institution (e.g. deferred uploads from
    // the inspector editors), default editors' uploads to their own college
    // instead of the shared pool so asset scoping stays meaningful.
    const sessionUser = session!.user as Record<string, unknown>;
    const defaultInstitution =
      (sessionUser.role as string) === "admin"
        ? "all"
        : (sessionUser.institution as string) || "all";

    // Validate non-file fields against the schema so unknown categories
    // and over-long alt text are rejected at the boundary too.
    const parsed = validateFields(
      {
        altText: (formData.get("altText") as string) ?? "",
        category: (formData.get("category") as string) ?? "other",
        institution:
          (formData.get("institution") as string) ?? defaultInstitution,
        ratioType: (formData.get("ratioType") as string) ?? "auto",
      },
      ImageUploadFieldsSchema,
    );
    if (!parsed.ok) return parsed.response;
    const { altText, category, institution, ratioType } = parsed.data;
    const rule = IMAGE_RATIOS[ratioType];

    // Editors may only tag uploads with their own college or the shared
    // ("all") pool — not another college's institution.
    const scope = enforceAssetScope(session, institution);
    if (scope) return scope;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Inspect the source dimensions before resizing so the too-small guard
    // judges what the editor actually supplied, not the resized artifact.
    //
    // failOn:"error" makes sharp abort on broken/malicious inputs instead
    // of silently producing partial output. limitInputPixels caps the
    // decoded surface to ~268 megapixels (the libvips default), so a
    // ~10MB PNG with absurd dimensions can't OOM the worker.
    let sharpInstance: ReturnType<typeof sharp>;
    let metadata: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
    try {
      sharpInstance = sharp(buffer, {
        failOn: "error",
        limitInputPixels: 268_402_689,
      });
      metadata = await sharpInstance.metadata();
    } catch {
      return badRequest("Could not decode image. Try a different file.");
    }
    if (metadata.format === "svg") {
      return badRequest("SVG uploads are not supported");
    }
    const origWidth = metadata.width ?? 0;
    const origHeight = metadata.height ?? 0;
    if (origWidth === 0 || origHeight === 0) {
      return badRequest(
        "Could not read image dimensions. Try a different file.",
      );
    }

    const dimError = ratioSourceTooSmall(rule, origWidth, origHeight);
    if (dimError) {
      return validationError([
        {
          path: ["file"],
          message: dimError,
          code: "custom",
        } as never,
      ]);
    }

    // Resize to the selected ratio. "auto" keeps the source shape and only
    // caps the width; the fixed ratios produce exactly rule.width x rule.height
    // so the admin preview and the public frame can never disagree.
    const resized =
      rule.height === null
        ? sharpInstance.resize({
            width: rule.width,
            withoutEnlargement: true,
          })
        : rule.fit === "contain"
          ? sharpInstance.resize({
              width: rule.width,
              height: rule.height,
              fit: "contain",
              // Pad with transparency rather than a colour so a logo drops onto
              // any background. withoutEnlargement keeps a small logo crisp at
              // native size, centered on the canvas, instead of upscaling it.
              background: { r: 255, g: 255, b: 255, alpha: 0 },
              withoutEnlargement: true,
            })
          : sharpInstance.resize({
              width: rule.width,
              height: rule.height,
              fit: "cover",
              position: "center",
            });

    let webpBuffer: Buffer;
    let processedMetadata: Awaited<
      ReturnType<ReturnType<typeof sharp>["metadata"]>
    >;
    try {
      webpBuffer = await resized.webp({ quality: 85 }).toBuffer();
      // Read dimensions back off the *processed* buffer. Using the source
      // metadata here would record a size the stored object doesn't have.
      processedMetadata = await sharp(webpBuffer).metadata();
    } catch (procErr) {
      console.error("[images/upload] processing failed", procErr);
      return validationError([
        {
          path: ["file"],
          message:
            "Could not process this image at the selected ratio. Try a different file.",
          code: "custom",
        } as never,
      ]);
    }

    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80);
    // Random suffix so concurrent uploads of the same filename don't
    // collide on the R2 key (Date.now() is not unique under load).
    const suffix = crypto.randomUUID().slice(0, 8);
    const filename = `${Date.now()}-${suffix}-${baseName}.webp`;
    const storageKey = `images/${filename}`;

    await uploadToR2(storageKey, webpBuffer, "image/webp");

    try {
      await connectDB();
      const doc = await ImageAsset.create({
        filename,
        storage_key: storageKey,
        url: storageKey,
        alt_text: altText,
        category,
        institution,
        file_size: webpBuffer.length,
        mime_type: "image/webp",
        width: processedMetadata.width,
        height: processedMetadata.height,
        ratio_type: ratioType,
        aspect_ratio:
          ratioType === "auto"
            ? aspectRatioOf(processedMetadata.width, processedMetadata.height)
            : rule.ratio,
        uploaded_by: session!.user?.email ?? "",
      });

      await logAudit(
        "image",
        "uploaded",
        session!.user?.email ?? "",
        `Uploaded ${filename}`,
      );
      return json({ ...doc.toObject(), url: storageKey }, 201);
    } catch (dbErr) {
      // R2 succeeded but DB failed — clean up the orphaned blob so we
      // don't accumulate untracked uploads.
      console.error(dbErr);
      try {
        await deleteFromR2(storageKey);
      } catch {
        /* non-fatal */
      }
      return serverError();
    }
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
