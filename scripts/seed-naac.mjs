#!/usr/bin/env node
/**
 * Seed the Engineering NAAC page (`engineeringNaac` SiteConfig key) from the
 * captured legacy content in scripts/data/naac-appeal.source.json.
 *
 * Every `sourceUrl` in that file is downloaded from the legacy WordPress host,
 * uploaded to R2 under "documents/naac-…" (tracked as a DocumentAsset row) and
 * replaced by its storage key, so the published page serves its own documents
 * and never links back to the old server.
 *
 * Re-running is idempotent: an object already present in R2 (same deterministic
 * key) is not re-uploaded, and the SiteConfig doc is upserted, not duplicated.
 * Everything written here is editable afterwards at /admin/naac.
 *
 * Usage:
 *   node scripts/seed-naac.mjs [--dry-run]
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
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");
const SOURCE = path.join(__dirname, "data", "naac-appeal.source.json");
const CONFIG_KEY = "engineeringNaac";

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

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx")
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".xls") return "application/vnd.ms-excel";
  if (ext === ".xlsx")
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

/** Walk the value tree and hand every `{label, sourceUrl}` node to `fn`. */
async function mapDocs(node, fn) {
  if (Array.isArray(node)) {
    for (const item of node) await mapDocs(item, fn);
    return;
  }
  if (node && typeof node === "object") {
    if (typeof node.sourceUrl === "string") {
      await fn(node);
      return;
    }
    for (const v of Object.values(node)) await mapDocs(v, fn);
  }
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

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error("[seed-naac] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
  } = env;
  const R2_PUBLIC = env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
  if (
    !DRY &&
    (!R2_ACCOUNT_ID ||
      !R2_ACCESS_KEY_ID ||
      !R2_SECRET_ACCESS_KEY ||
      !R2_BUCKET_NAME)
  ) {
    console.error("[seed-naac] R2_* env vars are required to upload.");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  delete raw._comment;

  const s3 = DRY
    ? null
    : new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      });

  // Count first so the progress log is meaningful.
  const all = [];
  await mapDocs(raw, (d) => all.push(d));
  const unique = new Set(all.map((d) => d.sourceUrl));
  console.log(
    `[seed-naac] ${DRY ? "DRY-RUN — " : ""}${all.length} document links, ` +
      `${unique.size} unique files to import.`,
  );

  const uploaded = new Map(); // sourceUrl -> storage key
  const failures = [];
  let done = 0;

  await mapDocs(raw, async (doc) => {
    const url = doc.sourceUrl;
    if (uploaded.has(url)) {
      doc.file = uploaded.get(url);
      delete doc.sourceUrl;
      return;
    }

    const name = decodeURIComponent(url.split("/").pop() ?? "document.pdf");
    const ext = path.extname(name).toLowerCase() || ".pdf";
    const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
    const key = `documents/naac-${slugify(path.basename(name, ext))}-${hash}${ext}`;
    const mime = mimeFor(name);

    try {
      if (DRY) {
        console.log(`  [would import] ${key} ← ${url}`);
      } else {
        const exists = await s3
          .send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
          .then(() => true)
          .catch(() => false);

        if (exists) {
          console.log(`  [skip] ${key} (already in R2)`);
        } else {
          const buf = await download(url);
          await s3.send(
            new PutObjectCommand({
              Bucket: R2_BUCKET_NAME,
              Key: key,
              Body: buf,
              ContentType: mime,
            }),
          );
          console.log(
            `  [upload] ${key} (${(buf.length / 1024).toFixed(0)}KB)`,
          );
          pendingAssets.push({ key, name, mime, size: buf.length });
        }
      }
      uploaded.set(url, key);
      doc.file = key;
    } catch (err) {
      failures.push({ url, error: err.message });
      console.warn(`  [FAILED] ${url} — ${err.message}`);
      // Leave the link out rather than pointing the public page at the old host.
      doc.file = "";
    }
    delete doc.sourceUrl;
    done += 1;
    if (done % 25 === 0) console.log(`  … ${done}/${unique.size}`);
  });

  if (DRY) {
    console.log(
      `\n[seed-naac] dry-run complete — nothing downloaded, uploaded or written.`,
    );
    return;
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const now = new Date();
  const urlFor = (key) =>
    R2_PUBLIC ? `${R2_PUBLIC}/${key}` : `/api/public/images/${key}`;

  // Track every uploaded object in the media library.
  for (const a of pendingAssets) {
    await db.collection("documentassets").updateOne(
      { storage_key: a.key },
      {
        $set: {
          filename: a.name,
          storage_key: a.key,
          url: urlFor(a.key),
          mime_type: a.mime,
          file_size: a.size,
          uploaded_by: "seed-naac",
          updated_at: now,
        },
        $setOnInsert: { created_at: now },
      },
      { upsert: true },
    );
  }

  await db.collection("siteconfigs").updateOne(
    { config_key: CONFIG_KEY },
    {
      $set: {
        config_key: CONFIG_KEY,
        value: raw,
        published_value: raw,
        status: "published",
        published_at: now,
        updated_by: "seed-naac",
        updated_at: now,
      },
      $inc: { version: 1 },
      $setOnInsert: { created_at: now },
    },
    { upsert: true },
  );

  console.log(
    `\n[seed-naac] Published ${CONFIG_KEY}: ${uploaded.size} R2 documents, ` +
      `${pendingAssets.length} newly uploaded, ${failures.length} failed.`,
  );
  if (failures.length) {
    console.log("[seed-naac] Failed sources (left blank in the CMS):");
    for (const f of failures) console.log(`   • ${f.url} — ${f.error}`);
  }
  await mongoose.disconnect();
}

/** Assets uploaded in this run, recorded in Mongo once the DB is connected. */
const pendingAssets = [];

main().catch(async (err) => {
  console.error("[seed-naac] FAILED:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(2);
});
