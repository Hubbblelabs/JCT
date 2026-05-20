import { NextRequest } from "next/server";
import sharp from "sharp";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import {
  requireRole,
  json,
  badRequest,
  serverError,
  validateFields,
  validationError,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import {
  ImageUploadFieldsSchema,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  CATEGORY_RULES,
} from "@/lib/validation";

function checkDimensions(
  category: keyof typeof CATEGORY_RULES,
  width: number,
  height: number,
): string | null {
  const rule = CATEGORY_RULES[category];
  if (rule.minWidth && width < rule.minWidth) {
    return `Image is too small (${width}px wide). Category "${category}" requires at least ${rule.minWidth}px wide.`;
  }
  if (rule.minHeight && height < rule.minHeight) {
    return `Image is too short (${height}px tall). Category "${category}" requires at least ${rule.minHeight}px tall.`;
  }
  if (rule.maxWidth && width > rule.maxWidth) {
    return `Image is too wide (${width}px). Category "${category}" allows at most ${rule.maxWidth}px wide.`;
  }
  if (rule.maxHeight && height > rule.maxHeight) {
    return `Image is too tall (${height}px). Category "${category}" allows at most ${rule.maxHeight}px tall.`;
  }
  if (rule.aspect) {
    const ratio = width / height;
    if (Math.abs(ratio - rule.aspect.value) > rule.aspect.tolerance) {
      return `Image aspect ratio ${ratio.toFixed(2)} doesn't match the ${rule.aspect.label} required for category "${category}".`;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return badRequest("No file provided");
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

    // Validate non-file fields against the schema so unknown categories
    // and over-long alt text are rejected at the boundary too.
    const parsed = validateFields(
      {
        altText: (formData.get("altText") as string) ?? "",
        category: (formData.get("category") as string) ?? "other",
        institution: (formData.get("institution") as string) ?? "all",
      },
      ImageUploadFieldsSchema,
    );
    if (!parsed.ok) return parsed.response;
    const { altText, category, institution } = parsed.data;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Inspect dimensions before resize so per-category rules apply to the
    // user-supplied image, not the post-resize artifact.
    const sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    const origWidth = metadata.width ?? 0;
    const origHeight = metadata.height ?? 0;
    if (origWidth === 0 || origHeight === 0) {
      return badRequest(
        "Could not read image dimensions. Try a different file.",
      );
    }

    const dimError = checkDimensions(category, origWidth, origHeight);
    if (dimError) {
      return validationError([
        {
          path: ["file"],
          message: dimError,
          code: "custom",
        } as never,
      ]);
    }

    const rule = CATEGORY_RULES[category];
    const webpBuffer = await sharpInstance
      .resize({ width: rule.targetWidth, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const filename = `${Date.now()}-${file.name.replace(/\.[^.]+$/, "")}.webp`;
    const storageKey = `uploads/${institution}/${category}/${filename}`;

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
        width: metadata.width,
        height: metadata.height,
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
