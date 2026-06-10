import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import {
  requireRole,
  json,
  badRequest,
  notFound,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { UserUpdateSchema } from "@/lib/validation";

function currentUserId(session: unknown): string | null {
  if (!session || typeof session !== "object") return null;
  const s = session as { user?: { id?: unknown; email?: unknown } };
  const id = s.user?.id;
  return typeof id === "string" ? id : null;
}

function currentUserEmail(session: unknown): string {
  if (!session || typeof session !== "object") return "";
  const s = session as { user?: { email?: unknown } };
  return typeof s.user?.email === "string" ? s.user.email : "";
}

async function isLastActiveAdminExcluding(targetId: string): Promise<boolean> {
  const remaining = await User.countDocuments({
    role: "admin",
    is_active: true,
    _id: { $ne: targetId },
  });
  return remaining === 0;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const parsed = await validateBody(req, UserUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const selfId = currentUserId(session);

    // Look up the target up-front to make multi-field guards possible.
    const target = await User.findById(id).lean<{
      _id: unknown;
      role: string;
      is_active: boolean;
      email: string;
    } | null>();
    if (!target) return notFound("User not found");

    // Self-modification guards: an admin cannot demote themselves or
    // deactivate themselves — those changes must come from another admin
    // to avoid accidental lockout.
    if (selfId && String(target._id) === selfId) {
      if (body.role && body.role !== target.role) {
        return badRequest("You cannot change your own role");
      }
      if (body.is_active === false) {
        return badRequest("You cannot deactivate your own account");
      }
    }

    // Last-admin guard: don't allow demoting or deactivating the final
    // active admin — the org would be locked out of the CMS.
    if (target.role === "admin" && target.is_active) {
      const willLoseAdmin =
        (body.role && body.role !== "admin") || body.is_active === false;
      if (willLoseAdmin && (await isLastActiveAdminExcluding(id))) {
        return badRequest("Cannot remove the last active admin");
      }
    }

    const update: Record<string, unknown> = {};
    if (body.role) {
      update.role = body.role;
      if (body.role === "admin") update.institution = "all";
    }
    if (body.institution && body.role !== "admin")
      update.institution = body.institution;
    if (body.programs) update.programs = body.programs;
    if (body.full_name) update.full_name = body.full_name;
    if (typeof body.is_active === "boolean") update.is_active = body.is_active;
    if (body.password)
      update.password_hash = await bcrypt.hash(body.password, 12);

    const user = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    ).select("-password_hash");
    if (!user) return notFound("User not found");

    // Compensating check for the race window between the last-admin guard
    // above and the update: if a concurrent change left the org with no
    // active admin, revert this update instead of locking everyone out.
    if (target.role === "admin" && target.is_active) {
      const remaining = await User.countDocuments({
        role: "admin",
        is_active: true,
      });
      if (remaining === 0) {
        await User.updateOne(
          { _id: id },
          { $set: { role: "admin", is_active: true, institution: "all" } },
        );
        return badRequest("Cannot remove the last active admin");
      }
    }

    await logAudit(
      "user",
      "updated",
      currentUserEmail(session),
      `Updated user ${user.email}`,
    );
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
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const selfId = currentUserId(session);

    const target = await User.findById(id).lean<{
      _id: unknown;
      role: string;
      is_active: boolean;
      email: string;
    } | null>();
    if (!target) return notFound("User not found");

    if (selfId && String(target._id) === selfId) {
      return badRequest("You cannot deactivate your own account");
    }

    if (
      target.role === "admin" &&
      target.is_active &&
      (await isLastActiveAdminExcluding(id))
    ) {
      return badRequest("Cannot deactivate the last active admin");
    }

    const user = await User.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true },
    ).select("-password_hash");
    if (!user) return notFound("User not found");

    // Compensating check — see PATCH above.
    if (target.role === "admin" && target.is_active) {
      const remaining = await User.countDocuments({
        role: "admin",
        is_active: true,
      });
      if (remaining === 0) {
        await User.updateOne({ _id: id }, { $set: { is_active: true } });
        return badRequest("Cannot deactivate the last active admin");
      }
    }

    await logAudit(
      "user",
      "deactivated",
      currentUserEmail(session),
      `Deactivated user ${user.email}`,
    );
    return json({ message: "Deactivated" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
