import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Department } from "@/lib/models";
import { requireRole, json, notFound, serverError, validateBody } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { DepartmentUpdateSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await Department.findById(id);
    if (!doc) return notFound("Department not found");
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

  const parsed = await validateBody(req, DepartmentUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;

    const update: Record<string, unknown> = { updated_by: session!.user?.email };
    if (body.content !== undefined) update.content = body.content;
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.college !== undefined) update.college = body.college;

    const doc = await Department.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );
    if (!doc) return notFound("Department not found");

    await logAudit("department", "updated", session!.user?.email ?? "", `Updated department ${doc.slug}`);
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
    const doc = await Department.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true },
    );
    if (!doc) return notFound("Department not found");

    await logAudit("department", "archived", session!.user?.email ?? "", `Archived department ${doc.slug}`);
    return json({ message: "Archived" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
