import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import {
  requireRole,
  json,
  notFound,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { TestimonialUpdateSchema } from "@/lib/validation";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await Testimonial.findById(id);
    if (!doc) return notFound();
    return json(doc);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, TestimonialUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await Testimonial.findByIdAndUpdate(
      id,
      { $set: { ...body, updated_by: session!.user?.email } },
      { new: true },
    );
    if (!doc) return notFound();

    revalidateTargets(...targetsForInstitution(doc.institution));
    await logAudit(
      "testimonial",
      "updated",
      session!.user?.email ?? "",
      `Updated testimonial for ${doc.name}`,
    );
    return json(doc);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await Testimonial.findByIdAndDelete(id);
    if (!doc) return notFound();

    revalidateTargets(...targetsForInstitution(doc.institution));
    await logAudit(
      "testimonial",
      "deleted",
      session!.user?.email ?? "",
      `Deleted testimonial for ${doc.name}`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
