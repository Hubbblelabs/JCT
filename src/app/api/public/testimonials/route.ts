import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution") ?? "all";

  try {
    await connectDB();
    const query = institution === "all"
      ? { is_active: true }
      : { is_active: true, $or: [{ institution }, { institution: "all" }] };

    const testimonials = await Testimonial.find(query)
      .select("name batch course company quote avatar category institution sort_order")
      .sort({ sort_order: 1, created_at: -1 })
      .limit(12);

    if (testimonials.length === 0) {
      return NextResponse.json({ source: "empty", data: [] });
    }

    return NextResponse.json({ source: "db", data: testimonials });
  } catch {
    return NextResponse.json({ source: "error", data: [] });
  }
}
