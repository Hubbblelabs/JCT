import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";

export const revalidate = 3600;

// Helper to convert storage key to full URL
function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;

  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a storage key, construct the full URL
  if (imageUrl.includes("/") || imageUrl.startsWith("uploads/")) {
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl}/${imageUrl}`;
    }
    // Fallback to API serve endpoint if no public URL is configured
    return `/api/admin/images/serve/${imageUrl}`;
  }

  return imageUrl;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution") ?? "all";

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
      .limit(12);

    if (testimonials.length === 0) {
      return NextResponse.json({ source: "empty", data: [] });
    }

    // Transform avatars to full URLs
    const transformedTestimonials = testimonials.map((t) => ({
      ...t.toObject(),
      avatar: getImageUrl(t.avatar),
    }));

    return NextResponse.json({ source: "db", data: transformedTestimonials });
  } catch {
    return NextResponse.json({ source: "error", data: [] });
  }
}
