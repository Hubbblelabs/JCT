import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import {
  requireRole,
  enforceInstitutionScope,
  json,
  notFound,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { TestimonialUpdateSchema } from "@/lib/validation";
import { revalidateTargets, type RevalidateTarget } from "@/lib/revalidate";
import { deleteFromR2 } from "@/lib/r2";

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
  const { error } = await requireRole(req, "editor");
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

    // Load existing doc up-front to enforce institution scope and reuse the
    // avatar key for orphan cleanup in a single query.
    const existing = await Testimonial.findById(id)
      .select("institution avatar")
      .lean<{ institution?: string; avatar?: string } | null>();
    if (!existing) return notFound();

    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;
    if (body.institution !== undefined) {
      const scopeNext = enforceInstitutionScope(session, body.institution);
      if (scopeNext) return scopeNext;
    }

    const oldAvatar = body.avatar !== undefined ? (existing.avatar ?? "") : "";

    const updateFields = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    const doc = await Testimonial.findByIdAndUpdate(
      id,
      { $set: { ...updateFields, updated_by: session!.user?.email } },
      { new: true },
    );
    if (!doc) return notFound();

    if (
      oldAvatar &&
      oldAvatar !== body.avatar &&
      oldAvatar.startsWith("images/")
    ) {
      deleteFromR2(oldAvatar).catch((err) =>
        console.warn(
          `[testimonials/patch] R2 cleanup failed for "${oldAvatar}":`,
          err,
        ),
      );
    }

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

    if (doc.avatar?.startsWith("images/")) {
      deleteFromR2(doc.avatar).catch((err) =>
        console.warn(
          `[testimonials/delete] R2 cleanup failed for "${doc.avatar}":`,
          err,
        ),
      );
    }

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
