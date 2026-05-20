import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import {
  requireRole,
  json,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { TestimonialCreateSchema } from "@/lib/validation";
import { revalidateTargets, type RevalidateTarget } from "@/lib/revalidate";

function targetsForInstitution(inst?: string): RevalidateTarget[] {
  const targets: RevalidateTarget[] = ["home"];
  if (
    inst === "engineering" ||
    inst === "arts-science" ||
    inst === "polytechnic"
  )
    targets.push(inst);
  return targets;
}

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const institution = searchParams.get("institution");
    const filter: Record<string, unknown> = {};
    if (institution) filter.institution = institution;

    const docs = await Testimonial.find(filter).sort({
      sort_order: 1,
      created_at: -1,
    });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, TestimonialCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const doc = await Testimonial.create({
      ...body,
      updated_by: session!.user?.email,
    });
    revalidateTargets(...targetsForInstitution(body.institution));
    await logAudit(
      "testimonial",
      "created",
      session!.user?.email ?? "",
      `Created testimonial for ${body.name}`,
    );
    return json(doc, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
