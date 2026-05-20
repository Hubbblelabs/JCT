import { NextResponse } from "next/server";
import { listPublicPrograms } from "@/lib/public-programs";

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution");
  const degree = searchParams.get("degree");
  const publishedOnly = searchParams.get("published") === "true";

  try {
    const programs = await listPublicPrograms({
      institution,
      degree,
      publishedOnly,
    });
    if (programs.length === 0) {
      return NextResponse.json({ source: "empty", data: [] });
    }

    return NextResponse.json({ source: "db", data: programs });
  } catch {
    return NextResponse.json({ source: "error", data: [] });
  }
}
