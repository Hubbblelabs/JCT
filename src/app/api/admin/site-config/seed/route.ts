import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateForConfigKey } from "@/lib/revalidate";

type Seed = {
  config_key: string;
  value: Record<string, unknown>;
  /** When true, the seed is also published (value copied to published_value). */
  publish?: boolean;
};

const SEEDS: Seed[] = [
  {
    config_key: "homeStats",
    value: {
      yearsOfExcellence: "60+",
      alumni: "15,000+",
      studentsPlaced: "98%",
      industryAwards: "50+",
    },
  },
  // About pages — empty placeholders, to be filled in via the admin CMS
  {
    config_key: "engineeringAbout",
    value: {},
    publish: false,
  },
  {
    config_key: "artsScienceAbout",
    value: {},
    publish: false,
  },
  {
    config_key: "polytechnicAbout",
    value: {},
    publish: false,
  },
  // COE page — empty placeholder
  {
    config_key: "engineeringCoe",
    value: {},
    publish: false,
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
      "Seeded site config keys (homeStats, About pages, COE page)",
    );

    return json({ message: "Default content seeded successfully." });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
