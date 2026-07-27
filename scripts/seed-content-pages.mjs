#!/usr/bin/env node
/**
 * Seed the block-based content pages (Library, NIRF, Timeline, Professional
 * Bodies, NAAC sub-pages, Financial Statements, ICT Content, NSS, Placement
 * Gallery …) from the captured legacy content in
 * scripts/data/content-<slug>.source.json.
 *
 * Every `sourceUrl` in those files is downloaded from the legacy WordPress
 * host, uploaded to R2 (images under "images/legacy-…", everything else under
 * "documents/legacy-…", tracked as an ImageAsset/DocumentAsset row) and
 * replaced by its storage key — so the published pages serve their own assets
 * and never link back to the old server.
 *
 * Re-running is idempotent: an object already present in R2 (same
 * deterministic key) is not re-uploaded, and each SiteConfig doc is upserted,
 * not duplicated. Everything written here is editable afterwards at
 * /admin/content/<slug>.
 *
 * Usage:
 *   node scripts/seed-content-pages.mjs [--dry-run] [--only=<slug>[,<slug>]]
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
const DATA_DIR = path.join(__dirname, "data");
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");
const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  if (!arg) return null;
  return new Set(
    arg
      .slice("--only=".length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
})();

/** Number of legacy files fetched/uploaded at a time. */
const CONCURRENCY = 6;

// Mirrors CONTENT_PAGES in src/lib/content-pages.ts — the seeder must not
// import TypeScript, so the slug → config key mapping is repeated here and
// verified against the registry by `pnpm typecheck`-independent eyeballing.
const CONFIG_KEYS = {
  library: "engineeringLibrary",
  nirf: "engineeringNirf",
  timeline: "engineeringTimeline",
  "professional-bodies": "engineeringProfessionalBodies",
  "cyber-safety": "engineeringCyberSafety",
  "naac-best-practices": "engineeringNaacBestPractices",
  "naac-distinctiveness": "engineeringNaacDistinctiveness",
  "naac-aqar": "engineeringNaacAqar",
  "financial-statements": "engineeringFinancialStatements",
  "ict-content": "engineeringIctContent",
  "mandatory-disclosures": "engineeringMandatoryDisclosures",
  "hr-manual": "engineeringHrManual",
  nss: "engineeringNss",
  "feedback-system": "engineeringFeedbackSystem",
  "fine-arts-club": "polytechnicFineArtsClub",
  "placement-gallery": "engineeringPlacementGallery",
};

// ─── env ────────────────────────────────────────────────────────────────────

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

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"]);

const MIME = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
};

const mimeFor = (file) =>
  MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";

/**
 * Every `{ …, sourceUrl }` node in the value tree, paired with the field the
 * resolved storage key must be written to. The converter always emits that
 * field alongside `sourceUrl`, so the target is unambiguous.
 */
function collectSources(node, out = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectSources(item, out);
    return out;
  }
  if (node && typeof node === "object") {
    if (typeof node.sourceUrl === "string" && node.sourceUrl) {
      const field = ["file", "src", "href"].find((f) => f in node) ?? "file";
      out.push({ node, field, url: node.sourceUrl });
    }
    for (const v of Object.values(node)) collectSources(v, out);
  }
  return out;
}

/** Strip the seeding-only markers so the stored value matches the Zod schema. */
function stripMarkers(node) {
  if (Array.isArray(node)) {
    node.forEach(stripMarkers);
    return node;
  }
  if (node && typeof node === "object") {
    delete node.sourceUrl;
    for (const v of Object.values(node)) stripMarkers(v);
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

/** Run `worker` over `items` with a fixed number of workers in flight. */
async function pool(items, limit, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, () =>
    (async () => {
      while (cursor < items.length) {
        const i = cursor;
        cursor += 1;
        await worker(items[i], i);
      }
    })(),
  );
  await Promise.all(runners);
}

// ─── validation ─────────────────────────────────────────────────────────────

// Mirrors the block union in src/lib/validation/contentPage.ts. Seeding writes
// straight to Mongo, bypassing the Zod schema the admin API enforces — this
// keeps a malformed source file from poisoning the CMS silently.
const BLOCK_FIELDS = {
  text: ["title", "paragraphs"],
  list: ["title", "intro", "ordered", "items"],
  docs: ["title", "description", "layout", "linkLabel", "groups"],
  table: ["title", "description", "columns", "rows"],
  gallery: ["title", "description", "columns", "groups"],
  timeline: ["title", "description", "entries"],
  accordion: ["title", "description", "openFirst", "items"],
  contact: ["title", "text", "email", "phone", "linkLabel", "linkHref"],
};

function validate(slug, value) {
  const errors = [];
  if (!value || typeof value !== "object") errors.push("value is not an object");
  if (!value?.hero || typeof value.hero.title !== "string")
    errors.push("hero.title missing");
  if (!Array.isArray(value?.breadcrumb)) errors.push("breadcrumb is not an array");
  if (!Array.isArray(value?.intro)) errors.push("intro is not an array");
  if (!Array.isArray(value?.blocks)) errors.push("blocks is not an array");

  (value?.blocks ?? []).forEach((block, i) => {
    const fields = BLOCK_FIELDS[block?.type];
    if (!fields) {
      errors.push(`blocks[${i}]: unknown type "${block?.type}"`);
      return;
    }
    for (const f of fields)
      if (!(f in block)) errors.push(`blocks[${i}] (${block.type}): missing "${f}"`);
  });

  if (errors.length) {
    console.error(`[seed-content-pages] ${slug} is invalid:`);
    for (const e of errors) console.error(`   • ${e}`);
    throw new Error(`${slug}: ${errors.length} schema problem(s)`);
  }
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!DRY && !uri) {
    console.error("[seed-content-pages] MONGODB_URI is required (env or .env).");
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
    console.error("[seed-content-pages] R2_* env vars are required to upload.");
    process.exit(1);
  }

  const slugs = Object.keys(CONFIG_KEYS).filter((s) => !ONLY || ONLY.has(s));
  if (!slugs.length) {
    console.error("[seed-content-pages] --only matched no known page.");
    process.exit(1);
  }

  // Load + validate everything before a single byte is transferred.
  const pages = slugs.map((slug) => {
    const file = path.join(DATA_DIR, `content-${slug}.source.json`);
    if (!fs.existsSync(file))
      throw new Error(`missing source file: ${path.relative(process.cwd(), file)}`);
    const value = JSON.parse(fs.readFileSync(file, "utf8"));
    delete value._comment;
    validate(slug, value);
    return { slug, configKey: CONFIG_KEYS[slug], value };
  });

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

  const allSources = pages.flatMap((p) =>
    collectSources(p.value).map((s) => ({ ...s, slug: p.slug })),
  );
  const uniqueUrls = [...new Set(allSources.map((s) => s.url))];
  console.log(
    `[seed-content-pages] ${DRY ? "DRY-RUN — " : ""}${pages.length} page(s), ` +
      `${allSources.length} asset references, ${uniqueUrls.length} unique files.`,
  );

  /** sourceUrl → storage key (or null when the download failed). */
  const resolved = new Map();
  const uploaded = [];
  const failures = [];
  let done = 0;

  await pool(uniqueUrls, CONCURRENCY, async (url) => {
    const name = decodeURIComponent(url.split("/").pop() ?? "asset");
    const ext = path.extname(name).toLowerCase() || ".pdf";
    const isImage = IMAGE_EXT.has(ext);
    const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
    const prefix = isImage ? "images" : "documents";
    const key = `${prefix}/legacy-${slugify(path.basename(name, ext))}-${hash}${ext}`;
    const mime = mimeFor(name);

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
          uploaded.push({ key, name, mime, size: buf.length, isImage });
        }
      }
      resolved.set(url, key);
    } catch (err) {
      failures.push({ url, error: err.message });
      console.warn(`  [FAILED] ${url} — ${err.message}`);
      // Leave the link blank rather than pointing the public page at the old
      // host; the admin can re-upload the file from the editor.
      resolved.set(url, "");
    }
    done += 1;
    if (done % 50 === 0) console.log(`  … ${done}/${uniqueUrls.length}`);
  });

  for (const { node, field, url } of allSources) node[field] = resolved.get(url) ?? "";
  for (const p of pages) stripMarkers(p.value);

  if (DRY) {
    console.log(
      "\n[seed-content-pages] dry-run complete — nothing downloaded, uploaded or written.",
    );
    for (const p of pages)
      console.log(`   • ${p.configKey}: ${p.value.blocks.length} block(s)`);
    return;
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const now = new Date();
  const urlFor = (key) =>
    R2_PUBLIC ? `${R2_PUBLIC}/${key}` : `/api/public/images/${key}`;

  // Track every uploaded object in the media library so it can be managed and
  // cleaned up like any admin upload.
  for (const a of uploaded) {
    if (a.isImage) {
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
            institution: "engineering",
            uploaded_by: "seed-content-pages",
          },
          $setOnInsert: { alt_text: "", created_at: now },
        },
        { upsert: true },
      );
    } else {
      await db.collection("documentassets").updateOne(
        { storage_key: a.key },
        {
          $set: {
            filename: a.name,
            storage_key: a.key,
            url: urlFor(a.key),
            mime_type: a.mime,
            file_size: a.size,
            uploaded_by: "seed-content-pages",
            updated_at: now,
          },
          $setOnInsert: { created_at: now },
        },
        { upsert: true },
      );
    }
  }

  for (const p of pages) {
    await db.collection("siteconfigs").updateOne(
      { config_key: p.configKey },
      {
        $set: {
          config_key: p.configKey,
          value: p.value,
          published_value: p.value,
          status: "published",
          published_at: now,
          updated_by: "seed-content-pages",
          updated_at: now,
        },
        $inc: { version: 1 },
        $setOnInsert: { created_at: now },
      },
      { upsert: true },
    );
    console.log(
      `  [published] ${p.configKey} — ${p.value.blocks.length} block(s)`,
    );
  }

  console.log(
    `\n[seed-content-pages] Done: ${pages.length} page(s), ` +
      `${resolved.size} assets resolved, ${uploaded.length} newly uploaded, ` +
      `${failures.length} failed.`,
  );
  if (failures.length) {
    console.log("[seed-content-pages] Failed sources (left blank in the CMS):");
    for (const f of failures) console.log(`   • ${f.url} — ${f.error}`);
  }
  console.log(
    "[seed-content-pages] NOTE: a running app serves /api/public/* from an " +
      "in-memory cache (1h TTL) that only an admin write clears, and the public " +
      "pages are on 1h ISR. Restart the app to publish these immediately.",
  );
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("[seed-content-pages] FAILED:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(2);
});
