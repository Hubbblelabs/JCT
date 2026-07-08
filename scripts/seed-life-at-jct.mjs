#!/usr/bin/env node
/**
 * Seed the per-institution "Life at JCT" SiteConfig keys
 * (engineeringLifeAtJct, artsScienceLifeAtJct, polytechnicLifeAtJct) by
 * cloning the current "lifeAtJct" (main/home) content into each — so every
 * institution starts identical but is independently editable afterward from
 * its own admin page-content > Life at JCT section.
 *
 * Only writes keys that don't already have a published value, so re-running
 * never clobbers content an editor has already customized. Pass --force to
 * overwrite existing values with the current main content anyway.
 *
 * Usage:
 *   node scripts/seed-life-at-jct.mjs [--dry-run] [--force]
 * Requires MONGODB_URI (read from env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");
const FORCE = process.argv.includes("--force");

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

const DEFAULT_VALUE = {
  categories: ["All", "Labs", "Sports", "Events", "Clubs"],
  photos: [],
  videoUrl: "",
};

const TARGET_KEYS = [
  "engineeringLifeAtJct",
  "artsScienceLifeAtJct",
  "polytechnicLifeAtJct",
];

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error("[seed-life-at-jct] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const siteconfigs = db.collection("siteconfigs");
  const now = new Date();

  const main = await siteconfigs.findOne({ config_key: "lifeAtJct" });
  const sourceValue = main?.published_value ?? main?.value ?? DEFAULT_VALUE;

  console.log(
    `[seed-life-at-jct] ${DRY ? "DRY-RUN — " : ""}source "lifeAtJct": ` +
      `${(sourceValue.photos ?? []).length} photos, ` +
      `${(sourceValue.categories ?? []).length} categories` +
      (main ? "" : " (no existing doc — using schema default)"),
  );

  for (const key of TARGET_KEYS) {
    const existing = await siteconfigs.findOne({ config_key: key });
    if (existing?.published_value && !FORCE) {
      console.log(`  [skip] ${key} already has published content`);
      continue;
    }
    console.log(
      `  ${DRY ? "[would seed]" : "[seed]"} ${key}` +
        (existing ? " (overwriting)" : ""),
    );
    if (!DRY) {
      await siteconfigs.updateOne(
        { config_key: key },
        {
          $set: {
            config_key: key,
            value: sourceValue,
            published_value: sourceValue,
            status: "published",
            published_at: now,
            updated_by: "seed-life-at-jct",
            updated_at: now,
          },
          $inc: { version: 1 },
          $setOnInsert: { created_at: now },
        },
        { upsert: true },
      );
    }
  }

  console.log(
    `\n[seed-life-at-jct] Done. ${DRY ? "(dry-run — nothing written)" : ""}`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-life-at-jct] FAILED:", err);
  process.exit(2);
});
