import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Placement, Recruiter } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateTargets } from "@/lib/revalidate";

// One-off backfill: some companies were only ever entered on a placement
// year's "Top Recruiters" list (with a logo uploaded directly there) and
// never added to the shared Recruiters registry. Since public-placements.ts
// now resolves logos from the registry by name, those companies fall back to
// whatever was on the placement record — this pulls any such
// name+logo pairs into the registry so they're tracked in one place and stay
// in sync everywhere (including the homepage carousel).
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();

    const [placements, existing] = await Promise.all([
      Placement.find()
        .select("top_recruiters")
        .lean<{ top_recruiters?: { name?: string; logo?: string }[] }[]>(),
      Recruiter.find().select("name").lean<{ name?: string }[]>(),
    ]);

    const existingNames = new Set(
      existing.map((r) => (r.name ?? "").trim().toLowerCase()).filter(Boolean),
    );

    const toCreate = new Map<string, { name: string; logo: string }>();
    for (const p of placements) {
      for (const r of p.top_recruiters ?? []) {
        const name = (r.name ?? "").trim();
        const logo = (r.logo ?? "").trim();
        if (!name || !logo) continue;
        const key = name.toLowerCase();
        if (existingNames.has(key) || toCreate.has(key)) continue;
        toCreate.set(key, { name, logo });
      }
    }

    const docs = [...toCreate.values()];
    if (docs.length > 0) {
      await Recruiter.insertMany(
        docs.map((d) => ({ ...d, is_active: true, updated_by: session!.user?.email })),
      );
      revalidateTargets("home");
      await logAudit(
        "recruiter",
        "created",
        session!.user?.email ?? "",
        `Imported ${docs.length} recruiter(s) from placement records: ${docs
          .map((d) => d.name)
          .join(", ")}`,
      );
    }

    return json({ imported: docs.length, names: docs.map((d) => d.name) });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
