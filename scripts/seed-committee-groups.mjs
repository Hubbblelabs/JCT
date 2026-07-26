#!/usr/bin/env node
/**
 * Seed committee/cell entries onto the Clubs & Cells / Committees pages
 * (`GroupsPageSchema` SiteConfig keys) from
 * scripts/data/committee-groups.source.json.
 *
 * Any legacy WordPress upload URL anywhere in the file — a group's `image` or a
 * `gallery` entry — is downloaded, uploaded to R2 under "images/legacy-…",
 * tracked as an ImageAsset row, and replaced by its storage key, so the
 * published page serves its own photos and never links back to the old server.
 *
 * Groups are matched by name: an entry already on the page is left exactly as
 * the admin left it, so re-running only ever adds what is missing. A config key
 * that does not exist yet is created from the `hero`/`intro` in the file.
 * Everything written here is editable afterwards at
 * /admin/committees?college=<college>.
 *
 * Usage:
 *   node scripts/seed-committee-groups.mjs [--dry-run] [--only=<configKey>]
 * Requires MONGODB_URI + R2_* env (read from env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(__dirname, "data", "committee-groups.source.json");
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");
const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  return arg ? arg.slice("--only=".length).trim() : null;
})();

/** Any upload on the legacy host, on any of its per-college sub-sites. */
const LEGACY_UPLOAD =
  /^https?:\/\/182\.74\.29\.15\/[^/]+\/wp-content\/uploads\//i;

/** Which college each config key belongs to, for the ImageAsset rows. */
const KEY_INSTITUTION = {
  engineeringCommittees: "engineering",
  engineeringClubs: "engineering",
  polytechnicCommittees: "polytechnic",
};

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

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

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

/** Every legacy upload URL in the value tree. */
function collectUrls(node, out = new Set()) {
  if (typeof node === "string") {
    if (LEGACY_UPLOAD.test(node)) out.add(node);
    return out;
  }
  if (Array.isArray(node)) {
    for (const v of node) collectUrls(v, out);
    return out;
  }
  if (node && typeof node === "object") {
    for (const v of Object.values(node)) collectUrls(v, out);
  }
  return out;
}

/** Rewrite every legacy upload URL to its resolved storage key, in place. */
function rewrite(node, resolved) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => {
      if (typeof v === "string") {
        if (LEGACY_UPLOAD.test(v)) node[i] = resolved.get(v) ?? "";
      } else {
        rewrite(v, resolved);
      }
    });
    return node;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "string") {
        if (LEGACY_UPLOAD.test(v)) node[k] = resolved.get(v) ?? "";
      } else {
        rewrite(v, resolved);
      }
    }
  }
  return node;
}

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 800 * attempt));
    return download(url, attempt + 1);
  }
}

const nameKey = (s) => String(s ?? "").trim().toLowerCase();

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!DRY && !uri) {
    console.error("[seed-committee-groups] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
  } = env;
  const R2_PUBLIC = env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

  const raw = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  delete raw._comment;

  const entries = Object.entries(raw).filter(([key]) => !ONLY || key === ONLY);
  if (!entries.length) {
    console.error("[seed-committee-groups] --only matched no config key.");
    process.exit(1);
  }

  const urls = [...collectUrls(entries.map(([, v]) => v))];
  console.log(
    `[seed-committee-groups] ${DRY ? "DRY-RUN — " : ""}${entries.length} page(s), ` +
      `${urls.length} legacy image(s) to import.`,
  );

  if (!DRY && urls.length && (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME)) {
    console.error("[seed-committee-groups] R2_* env vars are required to upload.");
    process.exit(1);
  }

  const s3 =
    DRY || !urls.length
      ? null
      : new S3Client({
          region: "auto",
          endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
          },
        });

  const resolved = new Map();
  const uploaded = [];
  const failures = [];

  for (const url of urls) {
    const name = decodeURIComponent(url.split("/").pop() ?? "image.png");
    const ext = path.extname(name).toLowerCase() || ".png";
    const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
    const key = `images/legacy-${slugify(path.basename(name, ext))}-${hash}${ext}`;
    const mime = MIME[ext] ?? "image/png";

    try {
      if (DRY) {
        console.log(`  [would import] ${key} ← ${url}`);
      } else {
        const exists = await s3
          .send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
          .then(() => true)
          .catch(() => false);
        if (!exists) {
          const buf = await download(url);
          await s3.send(
            new PutObjectCommand({
              Bucket: R2_BUCKET_NAME,
              Key: key,
              Body: buf,
              ContentType: mime,
            }),
          );
          uploaded.push({ key, name, mime, size: buf.length });
          console.log(`  [upload] ${key} (${(buf.length / 1024).toFixed(0)}KB)`);
        } else {
          console.log(`  [skip] ${key} (already in R2)`);
        }
      }
      resolved.set(url, key);
    } catch (err) {
      failures.push({ url, error: err.message });
      console.warn(`  [FAILED] ${url} — ${err.message}`);
      // Drop the photo rather than pointing the public page at the old host.
      resolved.set(url, "");
    }
  }

  for (const [, value] of entries) rewrite(value, resolved);

  if (DRY) {
    for (const [key, value] of entries)
      console.log(
        `   • ${key}: ${(value.groups ?? []).length} group(s) in the source file`,
      );
    console.log(
      "\n[seed-committee-groups] dry-run complete — nothing downloaded, uploaded or written.",
    );
    return;
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const now = new Date();
  const urlFor = (key) =>
    R2_PUBLIC ? `${R2_PUBLIC}/${key}` : `/api/public/images/${key}`;

  for (const a of uploaded) {
    await db.collection("imageassets").updateOne(
      { storage_key: a.key },
      {
        $set: {
          filename: a.name,
          storage_key: a.key,
          url: urlFor(a.key),
          mime_type: a.mime,
          file_size: a.size,
          category: "campus",
          uploaded_by: "seed-committee-groups",
        },
        $setOnInsert: {
          alt_text: "",
          institution: "all",
          created_at: now,
        },
      },
      { upsert: true },
    );
  }

  for (const [configKey, incoming] of entries) {
    const existing = await db
      .collection("siteconfigs")
      .findOne({ config_key: configKey });

    // Edit the published copy so the change is live, and keep the draft in
    // step — an admin opening the editor must not see the entry disappear.
    const base =
      existing?.published_value ??
      existing?.value ??
      { hero: incoming.hero ?? { title: "", subtitle: "" }, intro: incoming.intro ?? [], groups: [] };

    const value = {
      hero: base.hero ?? { title: "", subtitle: "" },
      intro: Array.isArray(base.intro) ? base.intro : [],
      groups: Array.isArray(base.groups) ? [...base.groups] : [],
    };

    const present = new Set(value.groups.map((g) => nameKey(g?.name)));
    let added = 0;
    for (const group of incoming.groups ?? []) {
      if (present.has(nameKey(group.name))) {
        console.log(`  [have] ${configKey} — "${group.name}"`);
        continue;
      }
      value.groups.push(group);
      present.add(nameKey(group.name));
      added += 1;
      console.log(`  [add]  ${configKey} — "${group.name}"`);
    }

    if (!existing) {
      value.hero = incoming.hero ?? value.hero;
      value.intro = incoming.intro ?? value.intro;
    }

    if (existing && added === 0) {
      console.log(`  [skip] ${configKey} — already up to date.`);
      continue;
    }

    await db.collection("siteconfigs").updateOne(
      { config_key: configKey },
      {
        $set: {
          config_key: configKey,
          value,
          published_value: value,
          status: "published",
          published_at: now,
          updated_by: "seed-committee-groups",
          updated_at: now,
        },
        $inc: { version: 1 },
        $setOnInsert: { created_at: now },
      },
      { upsert: true },
    );
    console.log(
      `  [published] ${configKey} — ${value.groups.length} group(s) total, ${added} added.`,
    );
  }

  const institutions = [
    ...new Set(entries.map(([k]) => KEY_INSTITUTION[k] ?? "engineering")),
  ];
  console.log(
    `\n[seed-committee-groups] Done: ${uploaded.length} image(s) uploaded, ${failures.length} failed.`,
  );
  if (failures.length)
    for (const f of failures) console.log(`   • ${f.url} — ${f.error}`);
  console.log(
    `[seed-committee-groups] Edit at /admin/committees?college=${institutions.join(" | ?college=")}. ` +
      "NOTE: a running app serves /api/public/* from an in-memory cache (1h TTL) " +
      "and these pages are on ISR — restart the app to publish immediately.",
  );
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("[seed-committee-groups] FAILED:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(2);
});
