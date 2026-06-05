import { NextRequest, NextResponse } from "next/server";
import { getFromR2 } from "@/lib/r2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const storageKey = key.join("/");

  // Only serve keys this app generates — images and documents. Without this
  // an authenticated user could probe arbitrary objects in the bucket.
  if (!storageKey.startsWith("images/") && !storageKey.startsWith("documents/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const { body, contentType } = await getFromR2(storageKey);
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Image not found", { status: 404 });
  }
}
