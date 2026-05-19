import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { revalidateTargets } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();

    const [{ ugCourses, pgCourses }, { ugPrograms }, { diplomaPrograms }] =
      await Promise.all([
        import("@/data/engineering"),
        import("@/data/arts-science"),
        import("@/data/polytechnic"),
      ]);

    const programs = [
      ...ugCourses.map((p, i) => ({
        name: p.name,
        abbr: p.abbr,
        slug: p.slug,
        institution: "engineering" as const,
        degree: "B.E. / B.Tech",
        duration: "4 Years",
        seats: (p as Record<string, unknown>).seats as number ?? 60,
        image: p.image,
        highlight: p.highlight,
        description: "",
        sort_order: i,
      })),
      ...(pgCourses ?? []).map((p: Record<string, unknown>, i: number) => ({
        name: p.name as string,
        abbr: (p.abbr as string) ?? "",
        slug: (p.slug as string) ?? (p.name as string).toLowerCase().replace(/\s+/g, "-"),
        institution: "engineering" as const,
        degree: "M.E. / M.Tech",
        duration: "2 Years",
        seats: 18,
        image: "",
        highlight: (p.highlight as string) ?? "",
        description: "",
        sort_order: 100 + i,
      })),
      ...ugPrograms.map((p, i) => ({
        name: p.name,
        abbr: p.abbr,
        slug: p.slug,
        institution: "arts-science" as const,
        degree: p.abbr.startsWith("B.Com") || p.abbr.startsWith("BBA") ? p.abbr : p.abbr,
        duration: p.duration,
        seats: 60,
        image: p.image,
        highlight: p.highlight,
        description: p.desc,
        sort_order: i,
      })),
      ...diplomaPrograms.map((p, i) => ({
        name: p.name,
        abbr: "Diploma",
        slug: p.slug,
        institution: "polytechnic" as const,
        degree: "Diploma",
        duration: p.duration,
        seats: 60,
        image: p.image,
        highlight: p.desc,
        description: "",
        sort_order: i,
      })),
    ];

    let seeded = 0;
    for (const prog of programs) {
      await Program.findOneAndUpdate(
        { slug: prog.slug },
        { $setOnInsert: prog },
        { upsert: true },
      );
      seeded++;
    }

    revalidateTargets("all-institutions");
    return json({ message: `Seeded ${seeded} programs` });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
