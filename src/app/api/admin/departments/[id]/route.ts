import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Department } from "@/lib/models";
import { requireRole, json, notFound, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

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

  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const doc = await Department.findByIdAndUpdate(
      id,
      { $set: { content: body.content, updated_by: session!.user?.email } },
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
