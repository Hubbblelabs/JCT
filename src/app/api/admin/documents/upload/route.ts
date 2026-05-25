import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { DocumentAsset } from "@/lib/models";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const ALLOWED_MIME = ["application/pdf"] as const;
const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return badRequest("No file provided");
    if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
      return badRequest(
        `Invalid file type "${file.type}". Only PDF files are accepted.`,
      );
    }
    if (file.size > MAX_SIZE) {
      return badRequest(
        `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 25 MB.`,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `documents/${Date.now()}-${safeName}`;

    const publicUrl = await uploadToR2(storageKey, buffer, "application/pdf");

    // Track the document in MongoDB so it can be deleted later (and R2 cleaned up).
    // If the DB write fails, roll back the R2 upload.
    try {
      await connectDB();
      await DocumentAsset.create({
        filename: safeName,
        storage_key: storageKey,
        url: publicUrl,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: session!.user?.email ?? "",
      });
    } catch (dbErr) {
      console.error(
        "[documents/upload] DB write failed — rolling back R2",
        dbErr,
      );
      try {
        await deleteFromR2(storageKey);
      } catch {
        /* non-fatal */
      }
      return serverError();
    }

    await logAudit(
      "document",
      "uploaded",
      session!.user?.email ?? "",
      `Uploaded ${safeName}`,
    );

    return json(
      {
        url: publicUrl,
        storage_key: storageKey,
        filename: safeName,
        size: file.size,
        mime_type: file.type,
      },
      201,
    );
  } catch (e) {
    console.error("[documents/upload]", e);
    return serverError();
  }
}
