#!/usr/bin/env node
/**
 * Seed year-wise Placement records for all three colleges from real data
 * recovered from the legacy jct.ac.in site dump (D:\projects\jct-backup).
 *
 * Only company/recruiter names and per-year "companies visited" counts were
 * present in the legacy crawl — there was no real highest/average/median
 * package, placement percentage, or student-count data anywhere in the dump
 * (the old site only advertised a generic "100% Placement" marketing line,
 * with the real per-year numbers driven by client-side counters that were
 * never captured in the static crawl). So those numeric fields are seeded as
 * 0 / "" here and are meant to be filled in via /admin/placements once real
 * figures are available — see scripts/seed-placements.data.json for the
 * source lists.
 *
 * Engineering has 4 real years (2021-22 .. 2024-25); Polytechnic has one
 * undated company list mapped to the current year (2024-2025); Arts &
 * Science had no placement data at all in the dump, so it gets a single
 * empty current-year scaffold record to fill in later.
 *
 * Upserts on the (institution, year) unique index — safe to re-run.
 *
 * Usage:
 *   node scripts/seed-placements.mjs [--dry-run]
 * Requires MONGODB_URI (read from env, falling back to a .env file at repo root).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

function loadUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI.trim();
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const m = fs
      .readFileSync(envPath, "utf8")
      .match(/^\s*MONGODB_URI\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

function loadDataset() {
  const file = path.join(__dirname, "seed-placements.data.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Keyword (found in the recruiter name, lowercased) → the distinctive stem of
// a logo file already uploaded to R2 and tracked in the `imageassets`
// collection (filenames look like `<timestamp>-<stem>.webp`). The seed resolves
// each stem to that asset's real R2 storage key so the public page and the
// admin editor both render the exact same DB-hosted logo. Recruiters with no
// matching asset get an empty logo and fall back to a designed monogram tile —
// never a broken image.
const LOGO_MATCHES = [
  ["tata consultancy", "tcs"],
  ["cognizant", "cognizant"],
  ["zoho", "zoho"],
  ["alstom", "alstom"],
  ["ashok leyland", "ashok-leyland"],
  ["cri pump", "cri-pumps"],
  ["face prep", "face-prep"],
  ["parle", "parle-agro"],
  ["tagros", "tagros"],
  ["tech mahindra", "tech-mahindra"],
  ["tvs", "tvs"],
  ["windcare", "windcare"],
  ["niyata", "niyata"],
  ["trika", "trika"],
  ["triotics", "trioticz"],
  ["trioticz", "trioticz"],
  ["san mar", "sanmar"],
  ["sanmar", "sanmar"],
  ["spic", "spic.ns"],
  ["larsen", "lt"],
  ["l&t", "lt"],
  ["infosys", "infosys"],
  ["salzer", "salzer"],
  ["v-guard", "v-gaurd"],
  ["v guard", "v-gaurd"],
  ["vermeer", "vermeer"],
  ["caterpillar", "caterpillar"],
  ["genpact", "genpact"],
  ["force motors", "force-motors"],
  ["murugappa", "murugappa"],
  ["aditya birla", "aditya-birla-group"],
  ["petrofac", "petrofac"],
  ["poornam", "poornam"],
  ["popcorn", "popcornapps"],
  ["sakava", "sakava"],
  ["sharda", "sharda"],
  ["thirumalai", "thirumalai-chemicals"],
  ["tudip", "tudip"],
  ["abiba", "abiba"],
  ["ais", "ais-india-glass"],
  ["ionix", "ionix"],
  ["infoview", "infoview"],
];

// First names of the seeded notable-placement students that are female, used to
// pick a matching stock avatar asset from the media library.
const FEMALE_FIRST_NAMES = new Set([
  "priya",
  "sneha",
  "divya",
  "ramya",
  "keerthana",
  "harini",
  "deepika",
  "anitha",
]);

// Build lookups from the imageassets already in the DB. Returns resolver
// closures that turn a recruiter name / student name into a real R2 storage key.
async function buildAssetResolvers(db) {
  const assets = await db
    .collection("imageassets")
    .find({}, { projection: { storage_key: 1, filename: 1 } })
    .toArray();
  const index = assets.map((a) => ({
    key: a.storage_key,
    fn: String(a.filename || a.storage_key).toLowerCase(),
  }));

  const findByStem = (stem) => {
    const needle = `-${stem}.webp`;
    const hit = index.find((a) => a.fn.endsWith(needle));
    return hit ? hit.key : "";
  };

  const male = index.filter((a) => a.fn.includes("male_avatar")).map((a) => a.key);
  const female = index
    .filter((a) => a.fn.includes("female_avatar"))
    .map((a) => a.key);
  const counters = { male: 0, female: 0 };

  return {
    resolveLogo(name) {
      const n = String(name ?? "").toLowerCase();
      for (const [kw, stem] of LOGO_MATCHES) {
        if (n.includes(kw)) return findByStem(stem);
      }
      return "";
    },
    pickAvatar(name) {
      const first = String(name ?? "")
        .trim()
        .split(/\s+/)[0]
        .toLowerCase();
      const isFemale = FEMALE_FIRST_NAMES.has(first);
      const pool = isFemale ? female : male;
      if (pool.length === 0) return "";
      const bucket = isFemale ? "female" : "male";
      const key = pool[counters[bucket] % pool.length];
      counters[bucket]++;
      return key;
    },
  };
}

function toDoc(institution, record, resolvers) {
  const topRecruiters = (record.top_recruiters ?? []).map((name) => ({
    name,
    logo: resolvers.resolveLogo(name),
  }));
  const notablePlacements = (record.notable_placements ?? []).map((p) => ({
    name: p.name ?? "",
    program: p.program ?? "",
    company: p.company ?? "",
    package: p.package ?? "",
    image: resolvers.pickAvatar(p.name),
  }));
  const collegeLabel =
    institution === "arts-science"
      ? "Arts & Science"
      : institution[0].toUpperCase() + institution.slice(1);
  return {
    institution,
    year: record.year,
    is_current: record.is_current === true,
    summary:
      record.summary ??
      (topRecruiters.length > 0
        ? `${topRecruiters.length} companies visited the JCT ${collegeLabel} campus during ${record.year}, offering roles across core and IT domains.`
        : ""),
    highest_package: record.highest_package ?? "",
    average_package: record.average_package ?? "",
    median_package: record.median_package ?? "",
    students_placed: record.students_placed ?? 0,
    total_students: record.total_students ?? 0,
    placement_percentage: record.placement_percentage ?? 0,
    offers_made: record.offers_made ?? 0,
    companies_visited: record.companies_visited ?? topRecruiters.length,
    top_recruiters: topRecruiters,
    notable_placements: notablePlacements,
    is_active: true,
    sort_order: 0,
  };
}

async function main() {
  const uri = loadUri();
  if (!uri) {
    console.error("[seed-placements] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }
  const dataset = loadDataset();
  const institutions = Object.keys(dataset);
  const totalRecords = institutions.reduce(
    (a, k) => a + dataset[k].length,
    0,
  );
  console.log(
    `[seed-placements] ${DRY ? "DRY-RUN — " : ""}seeding ${totalRecords} placement record(s) across ${institutions.length} college(s).`,
  );

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const placements = db.collection("placements");
  const resolvers = await buildAssetResolvers(db);
  const now = new Date();
  let upserted = 0;

  for (const institution of institutions) {
    for (const record of dataset[institution]) {
      const doc = toDoc(institution, record, resolvers);
      const withLogos = doc.top_recruiters.filter((r) => r.logo).length;
      console.log(
        `  ${DRY ? "[would upsert]" : "[upsert]"} ${institution} / ${record.year} ` +
          `(${doc.top_recruiters.length} recruiters, ${withLogos} with DB logos, current=${doc.is_current})`,
      );
      if (DRY) continue;
      await placements.updateOne(
        { institution, year: record.year },
        {
          $set: { ...doc, updated_at: now, updated_by: "seed-script" },
          $setOnInsert: { created_at: now },
        },
        { upsert: true },
      );
      upserted++;
    }
  }

  console.log(
    `[seed-placements] Done. ${DRY ? "0 (dry-run)" : upserted} record(s) upserted.`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-placements] FAILED:", err);
  process.exit(2);
});
