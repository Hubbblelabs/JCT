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

function toDoc(institution, record) {
  const topRecruiters = (record.top_recruiters ?? []).map((name) => ({
    name,
    logo: "",
  }));
  return {
    institution,
    year: record.year,
    is_current: record.is_current === true,
    summary:
      topRecruiters.length > 0
        ? `Companies that visited the JCT ${
            institution === "arts-science"
              ? "Arts & Science"
              : institution[0].toUpperCase() + institution.slice(1)
          } campus during ${record.year}.`
        : "",
    highest_package: "",
    average_package: "",
    median_package: "",
    students_placed: 0,
    total_students: 0,
    placement_percentage: 0,
    offers_made: 0,
    companies_visited: record.companies_visited ?? topRecruiters.length,
    top_recruiters: topRecruiters,
    notable_placements: [],
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
  const placements = mongoose.connection.db.collection("placements");
  const now = new Date();
  let upserted = 0;

  for (const institution of institutions) {
    for (const record of dataset[institution]) {
      const doc = toDoc(institution, record);
      console.log(
        `  ${DRY ? "[would upsert]" : "[upsert]"} ${institution} / ${record.year} ` +
          `(${doc.top_recruiters.length} recruiters, current=${doc.is_current})`,
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
