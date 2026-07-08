import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Placement } from "@/lib/models";
import { getImageUrl } from "@/lib/utils";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";

// The recruiter logos shown in the homepage / institution carousel come from
// each college's placement records (Placement.top_recruiters) — there is no
// separate recruiter collection, so the carousel and the placement page share
// a single source of truth per college.
//
// `?college=` scopes to one college; without it the home carousel gets the
// union of every college's recruiters (deduped by name). Served from the
// in-memory public cache (cleared on every placement write) rather than
// route-level ISR, since reading the query param makes this handler dynamic.
export const dynamic = "force-dynamic";

const COLLEGES = ["engineering", "arts-science", "polytechnic"] as const;

type Company = { name: string; logo: string | null };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collegeParam = searchParams.get("college");
  const college = (COLLEGES as readonly string[]).includes(collegeParam ?? "")
    ? collegeParam
    : null;

  const cacheKey = `recruiters:${college ?? "*"}`;
  const cached = publicCacheGet<{ source: string; data: unknown }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    await connectDB();

    const filter: Record<string, unknown> = { is_active: true };
    if (college) filter.institution = college;

    const placements = await Placement.find(filter)
      .select("top_recruiters is_current sort_order year")
      .sort({ is_current: -1, sort_order: 1, year: -1 })
      .lean<
        {
          top_recruiters?: { name?: string; logo?: string }[];
        }[]
      >();

    // Dedupe by company name (case-insensitive); backfill a logo from a later
    // record if the first occurrence had none.
    const seen = new Map<string, Company>();
    for (const p of placements) {
      for (const r of p.top_recruiters ?? []) {
        const name = (r.name ?? "").trim();
        if (!name) continue;
        const key = name.toLowerCase();
        const logo = getImageUrl(r.logo);
        const existing = seen.get(key);
        if (!existing) {
          seen.set(key, { name, logo });
        } else if (!existing.logo && logo) {
          existing.logo = logo;
        }
      }
    }

    const data = [...seen.values()];
    if (data.length === 0) {
      const payload = { source: "empty", data: [] };
      publicCacheSet(cacheKey, payload);
      return NextResponse.json(payload);
    }

    const payload = { source: "db", data };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/recruiters]", e);
    return NextResponse.json({ source: "error", data: [] });
  }
}
