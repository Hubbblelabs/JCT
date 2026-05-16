import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recruiter } from "@/lib/models";

export const revalidate = 3600; // 1 hour

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

    return NextResponse.json({ source: "db", data: recruiters });
  } catch {
    return NextResponse.json({ source: "error", data: [] });
  }
}
