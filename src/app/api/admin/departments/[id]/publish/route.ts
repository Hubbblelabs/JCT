import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Department } from "@/lib/models";
import { requireRole, json, notFound, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidatePaths } from "@/lib/revalidate";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const current = await Department.findById(id);
    if (!current) return notFound("Department not found");

    const doc = await Department.findByIdAndUpdate(
      id,
      {
        status: "published",
        published_content: current.content,
        published_at: new Date(),
        $inc: { version: 1 },
        updated_by: session!.user?.email,
      },
      { new: true },
    );
    if (!doc) return notFound("Department not found");

    revalidatePaths(
      `/institutions/${doc.college}`,
      `/institutions/${doc.college}/departments`,
      `/institutions/${doc.college}/departments/${doc.slug}`,
    );

    await logAudit("department", "published", session!.user?.email ?? "", `Published department ${doc.slug}`);
    return json({ message: "Published", doc });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
