import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { homeHeroContent } from "@/data/home";
import { revalidateForConfigKey } from "@/lib/revalidate";

const SEEDS: { config_key: string; value: Record<string, unknown> }[] = [
  {
    config_key: "home",
    value: {
      backgroundImages: [...homeHeroContent.backgroundImages],
      titleLines: [...homeHeroContent.titleLines],
      ctas: homeHeroContent.ctas.map((c) => ({
        ...c,
        // Replace fragment-only hrefs — the frontend matches CTAs by label,
        // so the href value only matters for non-special-cased buttons.
        href: c.href.startsWith("#") ? "/" : c.href,
      })),
      cards: homeHeroContent.cards.map((c) => ({ ...c })),
      tourVideoUrl: "",
    },
  },
  {
    config_key: "homeStats",
    value: {
      yearsOfExcellence: "60+",
      alumni: "15,000+",
      studentsPlaced: "98%",
      industryAwards: "50+",
    },
  },
];

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();

    for (const seed of SEEDS) {
      await SiteConfig.findOneAndUpdate(
        { config_key: seed.config_key },
        {
          $set: {
            value: seed.value,
            updated_by: session!.user?.email ?? "",
            status: "draft",
          },
          $inc: { version: 1 },
        },
        { upsert: true, new: true },
      );
      revalidateForConfigKey(seed.config_key);
    }

    await logAudit(
      "site-config",
      "seeded",
      session!.user?.email ?? "",
      "Seeded default content for main landing page (home, homeStats)",
    );

    return json({ message: "Default content seeded successfully." });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
