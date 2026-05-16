import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recruiter } from "@/lib/models";
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
    const doc = await Recruiter.findById(id);
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

  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const doc = await Recruiter.findByIdAndUpdate(
      id,
      { $set: { ...body, updated_by: session!.user?.email } },
      { new: true },
    );
    if (!doc) return notFound();

    await logAudit("recruiter", "updated", session!.user?.email ?? "", `Updated recruiter ${doc.name}`);
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
    const doc = await Recruiter.findByIdAndDelete(id);
    if (!doc) return notFound();

    await logAudit("recruiter", "deleted", session!.user?.email ?? "", `Deleted recruiter ${doc.name}`);
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
