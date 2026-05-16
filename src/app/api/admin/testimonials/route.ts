import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const institution = searchParams.get("institution");
    const filter: Record<string, unknown> = {};
    if (institution) filter.institution = institution;

    const docs = await Testimonial.find(filter).sort({ sort_order: 1, created_at: -1 });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.batch || !body.quote) {
      return badRequest("name, batch, and quote are required");
    }

    const doc = await Testimonial.create({ ...body, updated_by: session!.user?.email });
    await logAudit("testimonial", "created", session!.user?.email ?? "", `Created testimonial for ${body.name}`);
    return json(doc, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
