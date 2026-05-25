import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { DocumentAsset } from "@/lib/models";
import { deleteFromR2 } from "@/lib/r2";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    const body = (await req.json()) as {
      storage_key?: string;
      filename?: string;
      size?: number;
      mime_type?: string;
    };
    const { storage_key, filename, size, mime_type } = body;

    if (!storage_key || !filename)
      return badRequest("storage_key and filename required");

    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${storage_key}`
      : `/api/public/images/${storage_key}`;

    try {
      await connectDB();
      await DocumentAsset.create({
        filename,
        storage_key,
        url: publicUrl,
        mime_type: mime_type ?? "application/pdf",
        file_size: size ?? 0,
        uploaded_by: session!.user?.email ?? "",
      });
    } catch (dbErr) {
      console.error(
        "[documents/confirm] DB write failed — rolling back R2",
        dbErr,
      );
      try {
        await deleteFromR2(storage_key);
      } catch {
        /* non-fatal */
      }
      return serverError();
    }

    await logAudit(
      "document",
      "uploaded",
      session!.user?.email ?? "",
      `Uploaded ${filename}`,
    );

    return json(
      { url: publicUrl, storage_key, filename, size, mime_type },
      201,
    );
  } catch (e) {
    console.error("[documents/confirm]", e);
    return serverError();
  }
}
