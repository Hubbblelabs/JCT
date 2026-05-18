import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  try {
    await connectDB();

    if (key) {
      const doc = await SiteConfig.findOne({ config_key: key });
      if (!doc) return NextResponse.json({ source: "empty", data: null });
      const value =
        doc.status === "published" && doc.published_value
          ? doc.published_value
          : doc.value;
      return NextResponse.json({ source: "db", data: value });
    }

    const docs = await SiteConfig.find();
    if (docs.length === 0) {
      return NextResponse.json({ source: "empty", data: {} });
    }

    const data: Record<string, unknown> = {};
    for (const doc of docs) {
      data[doc.config_key] =
        doc.status === "published" && doc.published_value
          ? doc.published_value
          : doc.value;
    }

    return NextResponse.json({ source: "db", data });
  } catch {
    return NextResponse.json({ source: "error", data: {} });
  }
}
