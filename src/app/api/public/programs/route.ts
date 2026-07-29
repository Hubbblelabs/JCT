import { NextResponse } from "next/server";
import { listPublicPrograms } from "@/lib/public-programs";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";

// Reading query params makes this handler dynamic, so route-level ISR
// (`export const revalidate`) does not apply — responses are instead served
// from the in-memory public cache, invalidated on every admin write.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution");
  const degree = searchParams.get("degree");
  // Published-only is the default; drafts are opt-out, not opt-in. An opt-in
  // default made every unpublished program publicly enumerable on this
  // endpoint (embargoed courses, seat counts) with no auth.
  const publishedOnly = searchParams.get("published") !== "false";

  const cacheKey = `programs:${institution ?? "*"}:${degree ?? "*"}:${publishedOnly}`;
  const cached = publicCacheGet<{ source: string; data: unknown }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const programs = await listPublicPrograms({
      institution,
      degree,
      publishedOnly,
    });
    const payload =
      programs.length === 0
        ? { source: "empty", data: [] }
        : { source: "db", data: programs };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/programs]", e);
    return NextResponse.json({ source: "error", data: [] });
  }
}
