import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const logs = await AuditLog.find().sort({ created_at: -1 }).limit(200);
    return json(logs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
