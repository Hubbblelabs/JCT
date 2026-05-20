import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recruiter } from "@/lib/models";

export const revalidate = 3600; // 1 hour

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

export async function GET() {
  try {
    await connectDB();
    const recruiters = await Recruiter.find({ is_active: true })
      .select("name logo website industry sort_order")
      .sort({ sort_order: 1, name: 1 });

    if (recruiters.length === 0) {
      // Return null to trigger static fallback on the client
      return NextResponse.json({ source: "empty", data: [] });
    }

    // Transform logos to full URLs
    const transformedRecruiters = recruiters.map((r) => ({
      ...r.toObject(),
      logo: getImageUrl(r.logo),
    }));

    return NextResponse.json({ source: "db", data: transformedRecruiters });
  } catch {
    return NextResponse.json({ source: "error", data: [] });
  }
}
