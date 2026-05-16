import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Department } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();

    const [{ engineeringDepartments }, { artsDepartments }, { polytechnicDepartments }] =
      await Promise.all([
        import("@/data/engineering-departments"),
        import("@/data/arts-departments"),
        import("@/data/polytechnic-departments"),
      ]);

    const allDepts = [
      ...engineeringDepartments.map((d) => ({ college: "engineering", content: d, slug: d.slug })),
      ...artsDepartments.map((d) => ({ college: "arts-science", content: d, slug: d.slug })),
      ...polytechnicDepartments.map((d) => ({ college: "polytechnic", content: d, slug: d.slug })),
    ];

    let seeded = 0;
    for (const dept of allDepts) {
      await Department.findOneAndUpdate(
        { slug: dept.slug },
        { $setOnInsert: { ...dept, status: "draft" } },
        { upsert: true },
      );
      seeded++;
    }

    return json({ message: `Seeded ${seeded} departments` });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
