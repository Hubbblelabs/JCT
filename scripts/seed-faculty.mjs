#!/usr/bin/env node
/**
 * Seed real department faculty rosters (extracted from the legacy jct.ac.in site
 * dump) into each Program's `content.faculty` and `published_content.faculty`.
 *
 * Only Engineering UG departments have a clean faculty roster in the source dump;
 * Arts & Science / Polytechnic / Engineering-PG programs are left untouched
 * (their placeholder faculty stays as-is) — see scripts/seed-faculty.data.json.
 *
 * Each faculty record shape matches the public renderer (ProgramPageLayout):
 *   { name, designation, qualification, experience, specialization, email? }
 *
 * Writes to BOTH draft (`content`) and live (`published_content`) so the real
 * names appear on the public site immediately, and bumps `version`.
 *
 * Usage:
 *   node scripts/seed-faculty.mjs [--dry-run]
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
    const m = fs.readFileSync(envPath, "utf8").match(/^\s*MONGODB_URI\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

function loadDataset() {
  const file = path.join(__dirname, "seed-faculty.data.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function main() {
  const uri = loadUri();
  if (!uri) {
    console.error("[seed-faculty] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }
  const dataset = loadDataset();
  const slugs = Object.keys(dataset);
  console.log(
    `[seed-faculty] ${DRY ? "DRY-RUN — " : ""}seeding ${slugs.length} departments, ` +
      `${Object.values(dataset).reduce((a, b) => a + b.length, 0)} faculty total.`,
  );

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const programs = mongoose.connection.db.collection("programs");
  const now = new Date();
  let updated = 0;
  const missing = [];

  for (const slug of slugs) {
    const faculty = dataset[slug];
    const doc = await programs.findOne(
      { slug },
      { projection: { slug: 1, institution: 1, name: 1, version: 1 } },
    );
    if (!doc) {
      missing.push(slug);
      continue;
    }
    console.log(
      `  ${DRY ? "[would set]" : "[set]"} ${doc.institution}/${slug} ` +
        `(${doc.name}) -> ${faculty.length} faculty`,
    );
    if (DRY) continue;
    await programs.updateOne(
      { _id: doc._id },
      {
        $set: {
          "content.faculty": faculty,
          "published_content.faculty": faculty,
          status: "published",
          published_at: now,
          updated_at: now,
        },
        $inc: { version: 1 },
      },
    );
    updated++;
  }

  if (missing.length) {
    console.warn(
      `[seed-faculty] WARNING: no Program found for slug(s): ${missing.join(", ")}`,
    );
  }
  console.log(
    `[seed-faculty] Done. ${DRY ? "0 (dry-run)" : updated} program(s) updated.`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-faculty] FAILED:", err);
  process.exit(2);
});
