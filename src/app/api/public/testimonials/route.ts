import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { getImageUrl } from "@/lib/utils";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";

// Reading query params makes this handler dynamic, so route-level ISR
// (`export const revalidate`) does not apply — responses are instead served
// from the in-memory public cache, invalidated on every admin write.
//
// Avatar URLs resolve through the shared getImageUrl, which serves storage
// keys via the *public* image proxy — the previous local copy fell back to
// the admin-gated /api/admin/images/serve route that anonymous visitors
// cannot load.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution") ?? "all";

  const cacheKey = `testimonials:${institution}`;
  const cached = publicCacheGet<{ source: string; data: unknown }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    await connectDB();
    // "all" = main landing page testimonials only (institution field = "all").
    // Institution-specific pages receive only their own testimonials.
    const query = { is_active: true, institution };

    const testimonials = await Testimonial.find(query)
      .select(
        "name batch course company quote avatar category institution sort_order",
      )
      .sort({ sort_order: 1, created_at: -1 })
      .limit(12)
      .lean<
        {
          _id: unknown;
          name?: string;
          batch?: string;
          course?: string;
          company?: string;
          quote?: string;
          avatar?: string;
          category?: string;
          institution?: string;
          sort_order?: number;
        }[]
      >();

    if (testimonials.length === 0) {
      const payload = { source: "empty", data: [] };
      publicCacheSet(cacheKey, payload);
      return NextResponse.json(payload);
    }

    // Transform avatars to full URLs
    const transformedTestimonials = testimonials.map((t) => ({
      ...t,
      _id: String(t._id),
      avatar: getImageUrl(t.avatar),
    }));

    const payload = { source: "db", data: transformedTestimonials };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/testimonials]", e);
    return NextResponse.json({ source: "error", data: [] });
  }
}
