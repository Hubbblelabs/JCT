import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Placement } from "@/lib/models";
import {
  requireRole,
  enforceInstitutionScope,
  institutionReadFilter,
  badRequest,
  json,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { PlacementCreateSchema } from "@/lib/validation";
import { revalidateTargets, type RevalidateTarget } from "@/lib/revalidate";

function isDuplicateKeyError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    (e as { code?: number }).code === 11000
  );
}

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const institution = searchParams.get("institution");
    const filter: Record<string, unknown> = {};
    if (institution) filter.institution = institution;

    const docs = await Placement.find({
      ...filter,
      // Editors only see their own college's records.
      ...institutionReadFilter(session),
    }).sort({ institution: 1, is_current: -1, sort_order: 1, year: -1 });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, PlacementCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const scope = enforceInstitutionScope(session, body.institution);
  if (scope) return scope;

  try {
    await connectDB();
    const doc = await Placement.create({
      ...body,
      updated_by: session!.user?.email,
    });
    revalidateTargets(body.institution as RevalidateTarget);
    await logAudit(
      "placement",
      "created",
      session!.user?.email ?? "",
      `Created ${body.institution} placement record for ${body.year}`,
    );
    return json(doc, 201);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      return badRequest(
        "A placement record for this college and year already exists",
      );
    }
    console.error(e);
    return serverError();
  }
}
