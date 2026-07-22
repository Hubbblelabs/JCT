#!/usr/bin/env node
/**
 * Seed the Engineering "Cells and Committees" page into SiteConfig.
 *
 * Content key written (see src/lib/validation/engineeringPages.ts):
 *   engineeringCommittees  ->  /institutions/engineering/committees
 *
 * Committee names are taken verbatim from the college's published list, split
 * into the two categories it uses (Statutory / Other). The `category` field is
 * what groups the cards under a heading on the public page.
 *
 * Only the SC/ST committee has a published roster, so only it is seeded with a
 * description and members; every other committee is written as an empty shell
 * for the admin to complete via /admin/committees. Nothing is invented.
 *
 * Re-running is idempotent — the SiteConfig doc is upserted, not duplicated —
 * but note it DOES overwrite: any committee rosters entered through the admin
 * since the last run are replaced. Use --dry-run first.
 *
 * Usage:
 *   node scripts/seed-committees.mjs [--dry-run]
 * Requires MONGODB_URI (read from env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

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

const STATUTORY = "Statutory Committees";
const OTHER = "Other Committees";

/** A committee with no published roster yet — shape must match GroupSchema. */
const shell = (name, category) => ({
  name,
  category,
  description: "",
  image: "",
  convenor: "",
  convenorRole: "",
  email: "",
  members: [],
  activities: [],
});

const SC_ST = {
  name: "SC / ST Committee",
  category: STATUTORY,
  description:
    "The SC/ST cell of JCT College of Engineering and Technology was started in the year (2012-2013) with the purpose to empower the SC/ST students in the college. At present for the academic year (2023-2024) the college takes special interest in facilitating financial support to the students from these communities.",
  image: "",
  convenor: "",
  convenorRole: "",
  email: "",
  members: [
    {
      name: "Dr. MANOHARAN S",
      role: "Principal / Member",
      dept: "",
      contact: "9443359438",
    },
    { name: "Dr. K. Geetha", role: "Member", dept: "", contact: "9789650151" },
    {
      name: "Dr. G. Gnanavel",
      role: "Member",
      dept: "",
      contact: "8015429613",
    },
    {
      name: "Mr. K. Rajkumar",
      role: "Member",
      dept: "",
      contact: "9087300166",
    },
    { name: "Mr. K. Babu", role: "Member", dept: "", contact: "9629230655" },
    {
      name: "Mrs. S. Revathi",
      role: "Member",
      dept: "",
      contact: "9600787030",
    },
  ],
  activities: [],
};

const STATUTORY_NAMES = [
  "Internal Complaint Committee",
  "Constitution of Internal Quality Assurance Cell",
  "Anti-Ragging Committee",
  "Student's Grievance Redressal Cell",
  "Discipline and Welfare Committee",
  "Finance and Purchase Committee",
  "Governing Council",
  "Planning and Monitoring",
  "Women Empowerment / Prevention of Sexual Harassment (POSH) Cell",
];

const OTHER_NAMES = [
  "ERP Committee Members",
  "Exam Cell Members",
  "Fine Arts and Literature Club",
  "Institute Industry Partnership Cell",
  "Institute Innovation and Incubation Center",
  "IQAC Committee",
  "NAAC Certification Committees",
  "NBA Members Committee",
  "Placement and Career Guidance Cell",
  "Research and Development Cell",
  "Science Club",
  "Transport Committee",
  "ECO Club",
];

export const VALUE = {
  hero: {
    title: "Cells and Committees",
    subtitle:
      "The statutory and institutional bodies that govern academic, welfare, and administrative functions at JCT College of Engineering and Technology.",
  },
  intro: [],
  groups: [
    SC_ST,
    ...STATUTORY_NAMES.map((n) => shell(n, STATUTORY)),
    ...OTHER_NAMES.map((n) => shell(n, OTHER)),
  ],
};

async function main() {
  const env = loadEnv();
  if (!DRY && !env.MONGODB_URI) {
    console.error("[seed-committees] MONGODB_URI is not set.");
    process.exit(2);
  }

  const withRoster = VALUE.groups.filter((g) => g.members.length > 0).length;
  console.log(
    `[seed-committees] engineeringCommittees: ${VALUE.groups.length} committees ` +
      `(${withRoster} with a roster, ${VALUE.groups.length - withRoster} empty)`,
  );
  for (const g of VALUE.groups) {
    console.log(
      `   • [${g.category}] ${g.name}` +
        (g.members.length ? ` — ${g.members.length} members` : ""),
    );
  }

  // A dry run only prints the plan, so it never opens a connection — it stays
  // usable without DB access.
  if (DRY) {
    console.log("\n[seed-committees] Done. (dry-run — nothing written)");
    return;
  }

  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const siteconfigs = mongoose.connection.collection("siteconfigs");
  const now = new Date();

  await siteconfigs.updateOne(
    { config_key: "engineeringCommittees" },
    {
      $set: {
        config_key: "engineeringCommittees",
        value: VALUE,
        published_value: VALUE,
        status: "published",
        published_at: now,
        updated_by: "seed-committees",
        updated_at: now,
      },
      $inc: { version: 1 },
      $setOnInsert: { created_at: now },
    },
    { upsert: true },
  );

  console.log(
    "\n[seed-committees] Done. 1 SiteConfig doc published." +
      " Revalidate or wait for ISR (24h) to see it live.",
  );
  await mongoose.disconnect();
}

// Only seed when run directly, so the payload can be imported and validated
// against the Zod schema without opening a DB connection.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((err) => {
    console.error("[seed-committees] FAILED:", err);
    process.exit(2);
  });
}
