import { NextResponse } from "next/server";
import {
  getPublishedProgramBySlug,
  type ProgramInstitution,
} from "@/lib/public-programs";
import { publicCacheGet, publicCacheSet } from "@/lib/public-cache";

// Reading query params makes this handler dynamic, so route-level ISR
// (`export const revalidate`) does not apply — responses are instead served
// from the in-memory public cache, invalidated on every admin write.

const INSTITUTIONS = new Set(["engineering", "arts-science", "polytechnic"]);

function isInstitution(value: string | null): value is ProgramInstitution {
  return !!value && INSTITUTIONS.has(value);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { searchParams } = new URL(req.url);
  const institution = searchParams.get("institution");

  if (!isInstitution(institution)) {
    return NextResponse.json({ error: "Invalid institution" }, { status: 400 });
  }

  try {
    const { slug } = await params;

    const cacheKey = `program:${institution}:${slug}`;
    const cached = publicCacheGet<{ source: string; data: unknown }>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const program = await getPublishedProgramBySlug({ institution, slug });
    if (!program) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const payload = { source: "db", data: program };
    publicCacheSet(cacheKey, payload);
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[public/programs/slug]", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
