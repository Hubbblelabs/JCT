import { NextResponse } from "next/server";
import {
  getPublishedProgramBySlug,
  type ProgramInstitution,
} from "@/lib/public-programs";

export const revalidate = 3600;

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
    const program = await getPublishedProgramBySlug({ institution, slug });
    if (!program) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ source: "db", data: program });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
