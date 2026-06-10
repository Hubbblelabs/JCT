import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recruiter } from "@/lib/models";
import { getImageUrl } from "@/lib/utils";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";

// Served from the in-memory public cache (invalidated on every admin write)
// rather than route-level ISR — revalidatePath never targeted this API path,
// so ISR kept logos stale for an hour after recruiter edits.
//
// Logo URLs resolve through the shared getImageUrl, which serves storage
// keys via the *public* image proxy — the previous local copy fell back to
// the admin-gated /api/admin/images/serve route that anonymous visitors
// cannot load.
export const dynamic = "force-dynamic";

export async function GET() {
  const cacheKey = "recruiters:*";
  const cached = publicCacheGet<{ source: string; data: unknown }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    await connectDB();
    const recruiters = await Recruiter.find({ is_active: true })
      .select("name logo website industry sort_order")
      .sort({ sort_order: 1, name: 1 })
      .lean<
        {
          _id: unknown;
          name?: string;
          logo?: string;
          website?: string;
          industry?: string;
          sort_order?: number;
        }[]
      >();

    if (recruiters.length === 0) {
      // Return empty to trigger static fallback on the client
      const payload = { source: "empty", data: [] };
      publicCacheSet(cacheKey, payload);
      return NextResponse.json(payload);
    }

    // Transform logos to full URLs
    const transformedRecruiters = recruiters.map((r) => ({
      ...r,
      _id: String(r._id),
      logo: getImageUrl(r.logo),
    }));

    const payload = { source: "db", data: transformedRecruiters };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/recruiters]", e);
    return NextResponse.json({ source: "error", data: [] });
  }
}
