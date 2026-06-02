import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";

export const revalidate = 3600;

function resolveProspectusUrl(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const v = value as Record<string, unknown>;

  // If there's a URL field, construct full URL if it's just a path
  if (typeof v.url === "string") {
    const url = v.url.trim();
    // If it's already a full URL or relative path, use as-is
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/")
    ) {
      return v;
    }
    // Otherwise, it's a path in R2 storage - construct full URL
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (baseUrl) {
      return {
        ...v,
        url: `${baseUrl}/${url}`,
      };
    }
  }
  return v;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  try {
    await connectDB();

    if (key) {
      const doc = await SiteConfig.findOne({ config_key: key });
      // Public endpoint must only ever return published values. Falling back
      // to `doc.value` leaks unpublished drafts to anonymous visitors.
      if (!doc || doc.status !== "published" || !doc.published_value) {
        return NextResponse.json({ source: "empty", data: null });
      }
      let value: unknown = doc.published_value;
      if (key === "homeProspectus") {
        value = resolveProspectusUrl(value);
      }
      return NextResponse.json({ source: "db", data: value });
    }

    const docs = await SiteConfig.find();
    if (docs.length === 0) {
      return NextResponse.json({ source: "empty", data: {} });
    }

    const data: Record<string, unknown> = {};
    for (const doc of docs) {
      if (doc.status !== "published" || !doc.published_value) continue;
      let value: unknown = doc.published_value;
      if (doc.config_key === "homeProspectus") {
        value = resolveProspectusUrl(value);
      }
      data[doc.config_key] = value;
    }

    return NextResponse.json({ source: "db", data });
  } catch (e) {
    console.error("[public/site-config]", e);
    return NextResponse.json({ source: "error", data: {} });
  }
}
