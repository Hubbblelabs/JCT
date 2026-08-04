import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";
import { isKnownSiteConfigKey } from "@/lib/validation/siteConfig";

// Reading query params makes this handler dynamic, so route-level ISR
// (`export const revalidate`) does not apply — responses are instead served
// from the in-memory public cache, invalidated on every admin write.

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

type Envelope = { source: "db" | "empty"; data: unknown };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  // Unknown keys are answered without a database read and without a cache
  // entry: the key is arbitrary caller text, so caching it would let anyone
  // grow the in-memory store one permanent entry per request.
  if (key !== null && !isKnownSiteConfigKey(key)) {
    return NextResponse.json({
      source: "empty",
      data: null,
    } satisfies Envelope);
  }

  // JSON-encoded so a key literally named "*" can't collide with the
  // whole-config-map response served when no key is supplied.
  const cacheKey = JSON.stringify(["site-config", key]);
  const cached = publicCacheGet<Envelope>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    await connectDB();

    if (key) {
      const doc = await SiteConfig.findOne({ config_key: key });
      // Public endpoint must only ever return published values. Falling back
      // to `doc.value` leaks unpublished drafts to anonymous visitors.
      //
      // `published_value` alone is the gate, not `status`: it is written only
      // by a publish, so it is never draft content — while `status` flips to
      // "draft" the moment an editor saves without publishing, which would
      // otherwise blank a live section that is perfectly published.
      let payload: Envelope;
      if (!doc || !doc.published_value) {
        payload = { source: "empty", data: null };
      } else {
        let value: unknown = doc.published_value;
        if (key === "homeProspectus") {
          value = resolveProspectusUrl(value);
        }
        payload = { source: "db", data: value };
      }
      publicCacheSet(cacheKey, payload);
      return NextResponse.json(payload);
    }

    const docs = await SiteConfig.find();
    if (docs.length === 0) {
      const payload: Envelope = { source: "empty", data: {} };
      publicCacheSet(cacheKey, payload);
      return NextResponse.json(payload);
    }

    const data: Record<string, unknown> = {};
    for (const doc of docs) {
      if (!doc.published_value) continue;
      let value: unknown = doc.published_value;
      if (doc.config_key === "homeProspectus") {
        value = resolveProspectusUrl(value);
      }
      data[doc.config_key] = value;
    }

    const payload: Envelope = { source: "db", data };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/site-config]", e);
    return NextResponse.json({ source: "error", data: {} });
  }
}
