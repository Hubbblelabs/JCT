import { NextRequest, NextResponse } from "next/server";
import { getObject } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const key = path.join("/");

  // Only serve keys this app generates — public images and public documents.
  // Without this the route could be used to probe arbitrary bucket objects.
  if (!key.startsWith("images/") && !key.startsWith("documents/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const { body, contentType } = await getObject(key);
    return new NextResponse(body as ReadableStream, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
