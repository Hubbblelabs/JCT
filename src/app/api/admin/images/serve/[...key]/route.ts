import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
import { requireRole, enforceAssetScope } from "@/lib/api-helpers";
import { getFromR2 } from "@/lib/r2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  // Every other route under /api/admin calls requireRole; this one relied
  // entirely on the proxy matcher, which already carries a hand-written
  // negative lookahead and is documented as needing more exclusions whenever a
  // route must accept a large body — exactly the kind of edit that silently
  // un-gates a neighbour. Authorize here too.
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const { key } = await params;
  const storageKey = key.join("/");

  // Only serve keys this app generates — images and documents. Without this
  // an authenticated user could probe arbitrary objects in the bucket.
  if (
    !storageKey.startsWith("images/") &&
    !storageKey.startsWith("documents/")
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    // Images carry an institution; honour the same scope the delete/patch
    // paths on this collection enforce, so one college's editor can't read
    // another's assets by guessing a key. Untracked keys and documents (which
    // have no institution) fall through to the prefix check above.
    if (storageKey.startsWith("images/")) {
      await connectDB();
      const asset = await ImageAsset.findOne({ storage_key: storageKey })
        .select("institution")
        .lean<{ institution?: string } | null>();
      if (asset) {
        const scope = enforceAssetScope(session, asset.institution);
        if (scope) return scope;
      }
    }

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
