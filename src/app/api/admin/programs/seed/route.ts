import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { revalidateTargets } from "@/lib/revalidate";
import type { ProgramData } from "@/types/program";

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();

    const [
      { ugCourses, pgCourses },
      { ugPrograms },
      { diplomaPrograms },
      { engineeringPrograms },
      { artsPrograms },
      { polytechnicPrograms },
    ] = await Promise.all([
      import("@/data/engineering"),
      import("@/data/arts-science"),
      import("@/data/polytechnic"),
      import("@/data/engineering-programs"),
      import("@/data/arts-programs"),
      import("@/data/polytechnic-programs"),
    ]);

    // ── 1. Card-level rows ──────────────────────────────────────────────────
    const cards = [
      ...ugCourses.map((p, i) => ({
        name: p.name,
        abbr: p.abbr,
        slug: p.slug,
        institution: "engineering" as const,
        degree: "B.E. / B.Tech",
        duration: "4 Years",
        seats: ((p as Record<string, unknown>).seats as number) ?? 60,
        image: p.image,
        highlight: p.highlight,
        description: "",
        sort_order: i,
      })),
      ...(pgCourses ?? []).map((p: Record<string, unknown>, i: number) => ({
        name: p.name as string,
        abbr: (p.abbr as string) ?? "",
        slug:
          (p.slug as string) ??
          (p.name as string).toLowerCase().replace(/\s+/g, "-"),
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
        degree: p.abbr,
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

    let cardCount = 0;
    for (const card of cards) {
      await Program.findOneAndUpdate(
        { slug: card.slug },
        { $setOnInsert: card },
        { upsert: true },
      );
      cardCount++;
    }

    // ── 2. Rich page content (merged onto matching rows by slug) ────────────
    const content: { institution: string; content: ProgramData }[] = [
      ...engineeringPrograms.map((d) => ({
        institution: "engineering",
        content: d,
      })),
      ...artsPrograms.map((d) => ({ institution: "arts-science", content: d })),
      ...polytechnicPrograms.map((d) => ({
        institution: "polytechnic",
        content: d,
      })),
    ];

    let contentCount = 0;
    for (const entry of content) {
      const c = entry.content;
      const update: Record<string, unknown> = {
        $set: { content: c },
        $setOnInsert: {
          slug: c.slug,
          institution: entry.institution,
          name: c.name,
          abbr: c.shortName || c.name.slice(0, 16),
          degree: c.degreePrefix?.trim() ?? "",
          duration: c.about?.duration ?? "",
          image: c.heroImage ?? "",
          status: entry.institution === "engineering" ? "published" : "draft",
          ...(entry.institution === "engineering"
            ? {
                published_content: c,
                published_at: new Date(),
              }
            : {}),
        },
      };

      const doc = await Program.findOneAndUpdate({ slug: c.slug }, update, {
        upsert: true,
        new: true,
      });

      if (entry.institution === "engineering" && !doc.published_content) {
        doc.published_content = c;
        doc.status = "published";
        doc.published_at = new Date();
        await doc.save();
      }
      contentCount++;
    }

    revalidateTargets("all-institutions");
    return json({
      message: `Seeded ${cardCount} program cards, merged content into ${contentCount} programs`,
    });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
