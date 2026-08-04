import { NextResponse } from "next/server";
import { listPublicPrograms } from "@/lib/public-programs";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";

// Reading query params makes this handler dynamic, so route-level ISR
// (`export const revalidate`) does not apply — responses are instead served
// from the in-memory public cache, invalidated on every admin write.

const COLLEGES = ["engineering", "arts-science", "polytechnic"] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawInstitution = searchParams.get("institution");
  const rawDegree = searchParams.get("degree");

  // Reject anything outside the college list rather than passing it into the
  // Mongo filter. An unvalidated value both queries for nothing and mints a
  // permanent cache entry keyed on attacker-supplied text.
  if (
    rawInstitution &&
    !(COLLEGES as readonly string[]).includes(rawInstitution)
  )
    return NextResponse.json({ source: "empty", data: [] });

  const institution = rawInstitution;
  // `degree` is free-form CMS data, so it can't be allowlisted — bound its
  // length instead so it can't be used to inflate the cache key.
  const degree = rawDegree && rawDegree.length <= 40 ? rawDegree : null;
  if (rawDegree && !degree)
    return NextResponse.json({ source: "empty", data: [] });

  // There is deliberately no caller-controlled `published` flag: this endpoint
  // is unauthenticated, so an opt-out would let anyone enumerate every draft
  // and archived program (embargoed course names, seat counts, hero images).
  // Unpublished listings are served from the requireRole-gated admin API.

  // JSON-encoded so an absent param can never collide with a typeable literal
  // — `?degree=*` used to produce the same key as "no degree supplied".
  const cacheKey = JSON.stringify(["programs", institution, degree]);
  const cached = publicCacheGet<{ source: string; data: unknown }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const programs = await listPublicPrograms({
      institution,
      degree,
    });
    const payload =
      programs.length === 0
        ? { source: "empty", data: [] }
        : { source: "db", data: programs };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/programs]", e);
    return NextResponse.json({ source: "error", data: [] });
  }
}
