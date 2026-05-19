import { NextRequest } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const ALLOWED_MIME = ["application/pdf"] as const;
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return badRequest("No file provided");
    if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
      return badRequest(`Invalid file type "${file.type}". Only PDF files are accepted.`);
    }
    if (file.size > MAX_SIZE) {
      return badRequest(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 20 MB.`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `documents/all/${Date.now()}-${safeName}`;

    const publicUrl = await uploadToR2(storageKey, buffer, "application/pdf");
    await logAudit("document", "uploaded", session!.user?.email ?? "", `Uploaded ${safeName}`);

    return json({ url: publicUrl, storage_key: storageKey, filename: safeName, size: file.size, mime_type: file.type }, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
