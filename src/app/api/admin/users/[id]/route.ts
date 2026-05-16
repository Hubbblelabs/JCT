import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { requireRole, json, notFound, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.role) update.role = body.role;
    if (body.institution) update.institution = body.institution;
    if (body.departments) update.departments = body.departments;
    if (body.full_name) update.full_name = body.full_name;
    if (typeof body.is_active === "boolean") update.is_active = body.is_active;
    if (body.password) update.password_hash = await bcrypt.hash(body.password, 12);

    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select("-password_hash");
    if (!user) return notFound("User not found");

    await logAudit("user", "updated", session!.user?.email ?? "", `Updated user ${user.email}`);
    return json(user);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findByIdAndUpdate(id, { is_active: false }, { new: true }).select("-password_hash");
    if (!user) return notFound("User not found");

    await logAudit("user", "deactivated", session!.user?.email ?? "", `Deactivated user ${user.email}`);
    return json({ message: "Deactivated" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
