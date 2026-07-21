import { NextRequest, NextResponse } from "next/server";
import { listPublicPlacements } from "@/lib/public-placements";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";

// Year-wise placement records for one college, in the same normalized shape the
// public page renders (logos/photos already resolved to URLs). Used by the
// admin placements-page editor so its live preview shows the real year data
// alongside the CMS sections it edits.
//
// Reading the query param makes this handler dynamic, so it is served from the
// in-memory public cache (cleared on every placement write) rather than
// route-level ISR.
export const dynamic = "force-dynamic";

const COLLEGES = ["engineering", "arts-science", "polytechnic"] as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution") ?? "";
  if (!(COLLEGES as readonly string[]).includes(institution)) {
    return NextResponse.json({ source: "empty", data: [] });
  }

  const cacheKey = `placements:${institution}`;
  const cached = publicCacheGet<{ source: string; data: unknown }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const data = await listPublicPlacements(institution);
    const payload = { source: data.length ? "db" : "empty", data };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/placements]", e);
    return NextResponse.json({ source: "error", data: [] });
  }
}
