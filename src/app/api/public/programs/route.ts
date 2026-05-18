import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";

export const revalidate = 3600;

function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  if (imageUrl.includes("/") || imageUrl.startsWith("uploads/")) {
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl}/${imageUrl}`;
    }
    return `/api/admin/images/serve/${imageUrl}`;
  }
  return imageUrl;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution");
  const degree = searchParams.get("degree");

  try {
    await connectDB();

    const query: Record<string, unknown> = { is_active: true };
    if (institution) query.institution = institution;
    if (degree) query.degree = degree;

    const programs = await Program.find(query)
      .select(
        "name abbr slug institution degree duration seats image highlight description outcomes sort_order",
      )
      .sort({ sort_order: 1, name: 1 });

    if (programs.length === 0) {
      return NextResponse.json({ source: "empty", data: [] });
    }

    const transformed = programs.map((p) => ({
      ...p.toObject(),
      image: getImageUrl(p.image),
    }));

    return NextResponse.json({ source: "db", data: transformed });
  } catch {
    return NextResponse.json({ source: "error", data: [] });
  }
}
