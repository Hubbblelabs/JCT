import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import { requireRole, json, badRequest, serverError, validateBody } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { ProgramCreateSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const institution = searchParams.get("institution");
    const filter: Record<string, unknown> = {};
    if (institution) filter.institution = institution;

    const docs = await Program.find(filter).sort({ institution: 1, sort_order: 1, name: 1 });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, ProgramCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const existing = await Program.findOne({ slug: body.slug });
    if (existing) return badRequest("Program with this slug already exists");

    const doc = await Program.create({ ...body, updated_by: session!.user?.email });
    await logAudit("program", "created", session!.user?.email ?? "", `Created program ${body.name}`);
    return json(doc, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
