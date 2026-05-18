import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { requireRole, json, badRequest, serverError, validateBody } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { UserCreateSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();
    const users = await User.find().select("-password_hash").sort({ created_at: -1 });
    return json(users);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "super_admin");
  if (error) return error;

  const parsed = await validateBody(req, UserCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) return badRequest("User already exists");

    const password_hash = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      email: body.email.toLowerCase(),
      password_hash,
      full_name: body.full_name,
      role: body.role,
      institution: body.institution,
      departments: body.departments,
    });

    await logAudit("user", "created", session!.user?.email ?? "", `Created user ${body.email}`);
    const { password_hash: _, ...userObj } = user.toObject();
    return json(userObj, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
