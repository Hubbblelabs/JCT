import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
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
    const current = await Program.findById(id);
    if (!current) return notFound("Program not found");

    const doc = await Program.findByIdAndUpdate(
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
    if (!doc) return notFound("Program not found");

    revalidatePaths(
      `/institutions/${doc.institution}`,
      `/institutions/${doc.institution}/programs`,
      `/institutions/${doc.institution}/programs/${doc.slug}`,
    );

    await logAudit(
      "program",
      "published",
      session!.user?.email ?? "",
      `Published program ${doc.slug}`,
    );
    return json({ message: "Published", doc });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
