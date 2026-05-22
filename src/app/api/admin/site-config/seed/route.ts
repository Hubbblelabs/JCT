import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { homeHeroContent } from "@/data/home";
import { revalidateForConfigKey } from "@/lib/revalidate";
import { ABOUT_CONFIG_KEY, ABOUT_DEFAULTS } from "@/data/about-content";
import { COE_CONFIG_KEY, COE_DEFAULT } from "@/data/coe-content";

type Seed = {
  config_key: string;
  value: Record<string, unknown>;
  /** When true, the seed is also published (value copied to published_value). */
  publish?: boolean;
};

const asValue = (v: unknown) => v as Record<string, unknown>;

const SEEDS: Seed[] = [
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
  // About + COE pages — published on seed so the public pages render the
  // baseline content immediately.
  {
    config_key: ABOUT_CONFIG_KEY.engineering,
    value: asValue(ABOUT_DEFAULTS.engineering),
    publish: true,
  },
  {
    config_key: ABOUT_CONFIG_KEY["arts-science"],
    value: asValue(ABOUT_DEFAULTS["arts-science"]),
    publish: true,
  },
  {
    config_key: ABOUT_CONFIG_KEY.polytechnic,
    value: asValue(ABOUT_DEFAULTS.polytechnic),
    publish: true,
  },
  {
    config_key: COE_CONFIG_KEY,
    value: asValue(COE_DEFAULT),
    publish: true,
  },
];

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();

    for (const seed of SEEDS) {
      const set: Record<string, unknown> = {
        value: seed.value,
        updated_by: session!.user?.email ?? "",
        status: seed.publish ? "published" : "draft",
      };
      if (seed.publish) set.published_value = seed.value;

      await SiteConfig.findOneAndUpdate(
        { config_key: seed.config_key },
        { $set: set, $inc: { version: 1 } },
        { upsert: true, new: true },
      );
      revalidateForConfigKey(seed.config_key);
    }

    await logAudit(
      "site-config",
      "seeded",
      session!.user?.email ?? "",
      "Seeded default content (home, homeStats, About pages, COE page)",
    );

    return json({ message: "Default content seeded successfully." });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
