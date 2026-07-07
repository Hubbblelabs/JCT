#!/usr/bin/env node
/**
 * Seed the four Accreditation pages (main + engineering + arts-science +
 * polytechnic) into SiteConfig from the crawled jct.ac.in backup.
 *
 * Content keys written (see src/lib/validation/accreditationsPage.ts):
 *   mainAccreditations, engineeringAccreditations,
 *   artsScienceAccreditations, polytechnicAccreditations
 *
 * Certificate PDFs / scans found in the backup are uploaded to R2 under
 * "documents/…" (tracked as DocumentAsset), and a couple of body logos under
 * "images/…" (tracked as ImageAsset). Each unique source file is uploaded only
 * once and reused across entries. Missing brand logos are back-filled from the
 * existing home-carousel `accreditations` SiteConfig (matched by name) so the
 * page badges match the carousel.
 *
 * All facts (NAAC "A" Grade, Anna University / Bharathiar affiliation, AICTE +
 * DOTE approvals) are taken verbatim from the backup — nothing is invented.
 * Re-running is idempotent: files already in R2 (same deterministic key) and
 * the SiteConfig docs are upserted, not duplicated.
 *
 * Usage:
 *   node scripts/seed-accreditations.mjs [--dry-run]
 * Requires MONGODB_URI + R2_* env (read from env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

const BACKUP_DIR = "D:/projects/jct-backup";

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
    .slice(0, 60);
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

// ── Every accreditation entry has all schema fields; this fills the blanks. ──
function item(partial) {
  return {
    name: "",
    fullName: "",
    logo: "",
    grade: "",
    description: "",
    accreditedBy: "",
    validFrom: "",
    validTo: "",
    certificate: "",
    certificateLabel: "",
    ...partial,
  };
}

// Source files are relative to BACKUP_DIR. `logoSrc` → images/ (badge),
// `certSrc` → documents/ (downloadable certificate).
const A = BACKUP_DIR;
const ENG = "assets/engineering/wp-content/uploads";
const POLY = "assets/polytechnic/wp-content/uploads";

// ── Per-institution accreditation entries ───────────────────────────────────
const ENGINEERING = [
  item({
    name: "NAAC",
    fullName: "National Assessment and Accreditation Council",
    grade: "A Grade",
    accreditedBy: "National Assessment and Accreditation Council (NAAC)",
    description:
      "JCT College of Engineering & Technology is accredited by NAAC with 'A' Grade, affirming its overall institutional quality.",
    certSrc: `${ENG}/2021/11/NAAC-Certificate.pdf`,
    certificateLabel: "View NAAC Certificate",
  }),
  item({
    name: "NBA",
    fullName: "National Board of Accreditation",
    accreditedBy: "National Board of Accreditation (NBA)",
    description:
      "Eligible engineering programmes are accredited by the National Board of Accreditation, New Delhi.",
    certSrc: `${ENG}/2022/08/nba_certificate_2025.pdf`,
    certificateLabel: "View NBA Certificate",
  }),
  item({
    name: "AICTE",
    fullName: "All India Council for Technical Education",
    accreditedBy: "All India Council for Technical Education (AICTE)",
    description:
      "Approved by AICTE, New Delhi, with the Extension of Approval (EOA) granted for the current academic year.",
    validFrom: "2025",
    validTo: "2026",
    certSrc: `${ENG}/2025/07/JCT-Engg-AICTE-EOA-Report-2025-2026.pdf`,
    certificateLabel: "View AICTE EOA Report",
  }),
  item({
    name: "Anna University",
    fullName: "Anna University, Chennai",
    accreditedBy: "Anna University, Chennai",
    description: "Affiliated to Anna University, Chennai.",
  }),
  item({
    name: "ISO 9001:2015",
    fullName: "Quality Management System",
    accreditedBy: "TÜV — ISO 9001:2015 Certified",
    description:
      "Certified under the ISO 9001:2015 Quality Management System standard.",
  }),
  item({
    name: "UGC",
    fullName: "University Grants Commission",
    accreditedBy: "University Grants Commission (UGC)",
    description: "Recognised by the University Grants Commission.",
  }),
];

const ARTS_SCIENCE = [
  item({
    name: "Bharathiar University",
    fullName: "Bharathiar University, Coimbatore",
    accreditedBy: "Bharathiar University, Coimbatore",
    description:
      "JCT College of Arts & Science is affiliated to Bharathiar University, Coimbatore, offering programmes across Arts, Science and Commerce.",
  }),
];

const POLYTECHNIC = [
  item({
    name: "AICTE",
    fullName: "All India Council for Technical Education",
    accreditedBy: "All India Council for Technical Education (AICTE)",
    description:
      "JCT Polytechnic College is approved by the All India Council for Technical Education, New Delhi.",
    certSrc: `${POLY}/2021/01/JCT-POLYTECHNIC-COLLEGE-AICTE-APPROVAL.pdf`,
    certificateLabel: "View AICTE Approval",
  }),
  item({
    name: "DOTE",
    fullName: "Directorate of Technical Education, Tamil Nadu",
    accreditedBy: "Directorate of Technical Education (DOTE), Tamil Nadu",
    description:
      "Affiliated to the Directorate of Technical Education (DOTE), Government of Tamil Nadu.",
    certSrc: `${POLY}/2021/01/JCT-POLYTECHNIC-COLLEGE-DOTE-APPROVAL.pdf`,
    certificateLabel: "View DOTE Approval",
  }),
];

// The overall page reuses the marquee recognitions across the group. Entries
// are cloned from the college data (same uploaded R2 keys, no re-upload).
function mainFrom(engineering, polytechnic, artsScience) {
  const byName = (list, n) => list.find((e) => e.name === n);
  return [
    byName(engineering, "NAAC"),
    byName(engineering, "NBA"),
    byName(engineering, "AICTE"),
    byName(engineering, "UGC"),
    byName(engineering, "ISO 9001:2015"),
    byName(engineering, "Anna University"),
    byName(artsScience, "Bharathiar University"),
    byName(polytechnic, "DOTE"),
  ].filter(Boolean);
}

const HERO = {
  mainAccreditations: {
    title: "Approvals & Accreditations",
    subtitle:
      "Statutory approvals, university affiliations and quality accreditations that span the JCT group of institutions.",
  },
  engineeringAccreditations: {
    title: "Approvals & Accreditations",
    subtitle:
      "Recognitions and affiliations that affirm the academic quality of JCT College of Engineering & Technology.",
  },
  artsScienceAccreditations: {
    title: "Approvals & Accreditations",
    subtitle:
      "University affiliation and recognitions of JCT College of Arts & Science.",
  },
  polytechnicAccreditations: {
    title: "Approvals & Accreditations",
    subtitle:
      "Statutory approvals and affiliations of JCT Polytechnic College.",
  },
};

const INTRO = {
  mainAccreditations: [
    "JCT Institutions are approved, affiliated and accredited by the country's premier statutory and quality-assurance bodies. The recognitions below reflect a shared commitment to academic excellence across all three colleges.",
  ],
  engineeringAccreditations: [
    "JCT College of Engineering & Technology is approved, affiliated and accredited by the country's premier statutory and quality-assurance bodies. The recognitions below reflect our commitment to academic excellence and continuous improvement.",
  ],
  artsScienceAccreditations: [
    "JCT College of Arts & Science is affiliated to Bharathiar University and committed to quality education across the Arts, Science and Commerce streams.",
  ],
  polytechnicAccreditations: [
    "JCT Polytechnic College is approved and affiliated by the statutory bodies that govern technical diploma education in India and Tamil Nadu.",
  ],
};

const INSTITUTION_OF = {
  engineeringAccreditations: "engineering",
  artsScienceAccreditations: "arts-science",
  polytechnicAccreditations: "polytechnic",
  mainAccreditations: "all",
};

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error("[seed-accred] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } =
    env;
  const R2_PUBLIC = env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
  if (
    !DRY &&
    (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME)
  ) {
    console.error("[seed-accred] R2_* env vars are required to upload.");
    process.exit(1);
  }

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

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const siteconfigs = db.collection("siteconfigs");
  const imageassets = db.collection("imageassets");
  const documentassets = db.collection("documentassets");
  const now = new Date();

  const urlFor = (key) => (R2_PUBLIC ? `${R2_PUBLIC}/${key}` : `/api/public/images/${key}`);
  const uploadCache = new Map(); // src rel path -> storage key

  // Upload one backup file (once) and record its asset row. `kind` is
  // "images" (ImageAsset) or "documents" (DocumentAsset).
  async function upload(relPath, kind, altName, institution) {
    if (uploadCache.has(relPath)) return uploadCache.get(relPath);
    const abs = path.join(A, relPath);
    if (!fs.existsSync(abs)) {
      console.warn(`  [missing] ${relPath} — skipping asset`);
      uploadCache.set(relPath, "");
      return "";
    }
    const buf = fs.readFileSync(abs);
    const ext = path.extname(relPath).toLowerCase();
    const hash = crypto.createHash("md5").update(relPath).digest("hex").slice(0, 8);
    const key = `${kind}/accred-${slugify(altName)}-${hash}${ext}`;
    const mime = mimeFor(relPath);

    console.log(
      `  ${DRY ? "[would upload]" : "[upload]"} ${kind}/ ${altName} ← ${relPath} (${(buf.length / 1024).toFixed(0)}KB)`,
    );

    if (!DRY) {
      const exists = await s3
        .send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        await s3.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buf,
            ContentType: mime,
          }),
        );
      }
      if (kind === "images") {
        await imageassets.updateOne(
          { storage_key: key },
          {
            $set: {
              filename: path.basename(relPath),
              storage_key: key,
              url: urlFor(key),
              alt_text: altName,
              category: "accreditation",
              institution,
              file_size: buf.length,
              mime_type: mime,
              uploaded_by: "seed-accreditations",
              updated_at: now,
            },
            $setOnInsert: { created_at: now },
          },
          { upsert: true },
        );
      } else {
        await documentassets.updateOne(
          { storage_key: key },
          {
            $set: {
              filename: path.basename(relPath),
              storage_key: key,
              url: urlFor(key),
              mime_type: mime,
              file_size: buf.length,
              uploaded_by: "seed-accreditations",
              updated_at: now,
            },
            $setOnInsert: { created_at: now },
          },
          { upsert: true },
        );
      }
    }
    uploadCache.set(relPath, key);
    return key;
  }

  // Existing home-carousel logos, keyed by lowercased name, to back-fill badges.
  const carousel = await siteconfigs.findOne({ config_key: "accreditations" });
  const carouselVal = carousel?.published_value ?? carousel?.value ?? [];
  const logoByName = new Map();
  if (Array.isArray(carouselVal)) {
    for (const c of carouselVal) {
      if (c?.name && c?.logo)
        logoByName.set(String(c.name).toLowerCase().trim(), c.logo);
    }
  }
  const findLogo = (name) => {
    const n = String(name).toLowerCase().trim();
    for (const [k, v] of logoByName) if (n.includes(k) || k.includes(n)) return v;
    return "";
  };

  // Resolve a list of entries: upload cert/logo files, back-fill logos, and
  // strip the transient *Src fields so the stored shape matches the schema.
  async function resolve(entries, institution) {
    const out = [];
    for (const e of entries) {
      const { logoSrc, certSrc, ...rest } = e;
      const clean = { ...rest };
      if (logoSrc) clean.logo = await upload(logoSrc, "images", e.name, institution);
      if (!clean.logo) clean.logo = findLogo(e.name);
      if (certSrc)
        clean.certificate = await upload(certSrc, "documents", e.name, institution);
      out.push(clean);
    }
    return out;
  }

  console.log(`[seed-accred] ${DRY ? "DRY-RUN — " : ""}resolving assets…`);
  const engineering = await resolve(ENGINEERING, "engineering");
  const artsScience = await resolve(ARTS_SCIENCE, "arts-science");
  const polytechnic = await resolve(POLYTECHNIC, "polytechnic");
  const mainEntries = mainFrom(engineering, polytechnic, artsScience);

  const CONFIGS = {
    engineeringAccreditations: engineering,
    artsScienceAccreditations: artsScience,
    polytechnicAccreditations: polytechnic,
    mainAccreditations: mainEntries,
  };

  for (const [key, items] of Object.entries(CONFIGS)) {
    const value = { hero: HERO[key], intro: INTRO[key], items };
    console.log(
      `\n[seed-accred] ${key}: ${items.length} entries` +
        ` (${items.filter((i) => i.certificate).length} with certificate, ${items.filter((i) => i.logo).length} with logo)`,
    );
    for (const it of items)
      console.log(
        `   • ${it.name}${it.grade ? ` — ${it.grade}` : ""}${it.certificate ? " [cert]" : ""}${it.logo ? " [logo]" : ""}`,
      );
    if (!DRY) {
      await siteconfigs.updateOne(
        { config_key: key },
        {
          $set: {
            config_key: key,
            value,
            published_value: value,
            status: "published",
            published_at: now,
            updated_by: "seed-accreditations",
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
    `\n[seed-accred] Done. ${DRY ? "(dry-run — nothing written)" : "4 SiteConfig docs published."}`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-accred] FAILED:", err);
  process.exit(2);
});
