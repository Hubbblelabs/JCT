import { NextRequest } from "next/server";
import sharp from "sharp";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
import { uploadToR2 } from "@/lib/r2";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const category = (formData.get("category") as string) || "other";
    const institution = (formData.get("institution") as string) || "all";

    if (!file) return badRequest("No file provided");
    if (!ALLOWED_TYPES.includes(file.type)) return badRequest("Invalid file type");
    if (file.size > MAX_SIZE) return badRequest("File too large (max 10MB)");

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert to WebP using sharp
    const sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    const webpBuffer = await sharpInstance
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const filename = `${Date.now()}-${file.name.replace(/\.[^.]+$/, "")}.webp`;
    const storageKey = `uploads/${institution}/${category}/${filename}`;

    await uploadToR2(storageKey, webpBuffer, "image/webp");

    await connectDB();
    const doc = await ImageAsset.create({
      filename,
      storage_key: storageKey,
      url: storageKey, // Store only the storage key, not the full URL
      alt_text: altText,
      category,
      institution,
      file_size: webpBuffer.length,
      mime_type: "image/webp",
      width: metadata.width,
      height: metadata.height,
      uploaded_by: session!.user?.email ?? "",
    });

    await logAudit("image", "uploaded", session!.user?.email ?? "", `Uploaded ${filename}`);
    return json({ ...doc.toObject(), url: storageKey }, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
