#!/usr/bin/env node
/**
 * Seed the Engineering "Clubs and Cells" page into SiteConfig.
 *
 * Content key written (see src/lib/validation/engineeringPages.ts):
 *   engineeringClubs  ->  /institutions/engineering/clubs-and-cells
 *
 * Each club is written with its published description/objectives. The
 * `image` field is left blank ("") for the admin to fill in via
 * /admin/clubs — this script does not invent or fetch image URLs.
 *
 * Re-running is idempotent — the SiteConfig doc is upserted, not duplicated —
 * but note it DOES overwrite: any club images/rosters entered through the
 * admin since the last run are replaced. Use --dry-run first.
 *
 * Usage:
 *   node scripts/seed-clubs.mjs [--dry-run]
 * Requires MONGODB_URI (read from env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { ensureSrvResolvable } from "./_mongo-dns.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  const out = { ...process.env };
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !out[m[1]]) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return out;
}

const CLUBS = "Clubs";

/** A club with a published description but no roster/coordinator yet. */
const club = (name, description, opts = {}) => ({
  name,
  slug: "",
  category: CLUBS,
  description,
  image: "",
  convenor: opts.convenor ?? "",
  convenorRole: opts.convenorRole ?? "",
  email: "",
  members: [],
  activities: opts.activities ?? [],
});

const FINE_ARTS = club(
  "Fine Arts Club",
  "Fine arts club provides an opportunity to the students to let their imagination run wild and provides them with the sight to see things in a different way. Students learn from one another and share their prowess in different aspects of art.",
  {
    activities: [
      "Encourage imagination, creative ability and artistic discrimination",
      "Develop the skills essential for professional competence",
      "Relate the various arts and help students find the means to enjoy them",
      "Incorporate studies in the College for social and cultural growth, inspiring students to make maximum contributions as creative artists and citizens",
    ],
  },
);

const MOVIE_CLUB = club(
  "Movie Club",
  "The movie club is designed to allow members the opportunity to explore different avenues in film. From viewing to production, this club is for students who are interested in the movie industry.",
);

const CULTURAL_CLUB = club(
  "Cultural Club",
  "Participation in cultural activities results in enhancement of the personal skills and experiences like confidence; self-presentation; teamwork and collaboration; time management and organizational skills; self-awareness; self-discipline; open mindedness to move beyond boundaries and experiment with different ideas; communication skills; the ability to cope with criticism and learn from them resulting in a whole new developed, changed and an improved person.",
);

const ARTS_CLUB = club(
  "Arts Club",
  "Our club exists to give the students an artistic outlet and to help enrich and foster an interest for art and personal expression through art. Though the club is for artists, it can be enjoyed by all who appreciate art. The vision of the club is one of inclusion and creativity–everyone is welcome! The art club engages with the college as a creative center for the arts. The art club recognizes the diversity of students, clubs, and programs with a goal of creative interaction.",
);

const PHOTOGRAPHY = club(
  "Photography",
  'The market for photographic services demonstrates the aphorism "one picture is worth a thousand words" which has an interesting basis in the history of photography. Magazines and newspapers, companies putting up web sites, advertising agencies and other groups pay for photography. So, keeping all these views and interests in mind, we have generated a "Photography Club". We hope that this endeavor shall not only broaden the horizons of our students but also nurture and build up their hidden talents in photography along with their academic skills.',
  {
    convenor: "Dr. S. Venkatesh Babu",
    convenorRole: "HOD / PE",
  },
);

export const VALUE = {
  hero: {
    title: "Clubs and Cells",
    subtitle:
      "Student clubs at JCT College of Engineering and Technology that nurture creativity, culture, and extracurricular skills alongside academics.",
  },
  intro: [],
  groups: [
    FINE_ARTS,
    MOVIE_CLUB,
    CULTURAL_CLUB,
    ARTS_CLUB,
    PHOTOGRAPHY,
  ],
};

async function main() {
  const env = loadEnv();
  if (!DRY && !env.MONGODB_URI) {
    console.error("[seed-clubs] MONGODB_URI is not set.");
    process.exit(2);
  }

  console.log(`[seed-clubs] engineeringClubs: ${VALUE.groups.length} clubs`);
  for (const g of VALUE.groups) {
    console.log(`   • [${g.category}] ${g.name}`);
  }

  // A dry run only prints the plan, so it never opens a connection — it stays
  // usable without DB access.
  if (DRY) {
    console.log("\n[seed-clubs] Done. (dry-run — nothing written)");
    return;
  }

  await ensureSrvResolvable(env.MONGODB_URI);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const siteconfigs = mongoose.connection.collection("siteconfigs");
  const now = new Date();

  await siteconfigs.updateOne(
    { config_key: "engineeringClubs" },
    {
      $set: {
        config_key: "engineeringClubs",
        value: VALUE,
        published_value: VALUE,
        status: "published",
        published_at: now,
        updated_by: "seed-clubs",
        updated_at: now,
      },
      $inc: { version: 1 },
      $setOnInsert: { created_at: now },
    },
    { upsert: true },
  );

  console.log(
    "\n[seed-clubs] Done. 1 SiteConfig doc published." +
      " Revalidate or wait for ISR (24h) to see it live.",
  );
  await mongoose.disconnect();
}

// Only seed when run directly, so the payload can be imported and validated
// against the Zod schema without opening a DB connection.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((err) => {
    console.error("[seed-clubs] FAILED:", err);
    process.exit(2);
  });
}
