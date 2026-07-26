#!/usr/bin/env node
/**
 * Link the block-based content pages (see src/lib/content-pages.ts) into the
 * public Engineering navbar, under the "More" dropdown.
 *
 * The navbar is CMS data — the `engineeringNavbar` SiteConfig key, edited at
 * /admin/page-content?college=engineering&section=navbar. This script only
 * appends the entries that are missing, matched by `href`, so it is safe to
 * re-run and never touches links the admin has added, renamed or reordered.
 *
 * Usage:
 *   node scripts/seed-content-page-nav.mjs [--dry-run]
 * Requires MONGODB_URI (env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

const CONFIG_KEY = "engineeringNavbar";
/** The dropdown the entries are appended to, matched on its label. */
const PARENT_LABEL = "More";
/** Mirrors NAVBAR_LIMITS.children in src/lib/validation/navbar.ts. */
const MAX_CHILDREN = 28;

const ENG = "/institutions/engineering";

// Mirrors CONTENT_PAGES in src/lib/content-pages.ts. `label`/`desc` are the
// public-facing wording, which is deliberately allowed to differ from the
// admin-facing labels in the registry.
const NAV_ENTRIES = [
  {
    label: "Library",
    href: `${ENG}/library`,
    desc: "Collections, e-journals and services",
  },
  {
    label: "NIRF",
    href: `${ENG}/nirf`,
    desc: "Ranking framework reports",
  },
  {
    label: "NAAC — AQAR Report",
    href: `${ENG}/accreditations/naac/aqar-report`,
    desc: "Annual Quality Assurance Reports",
  },
  {
    label: "NAAC — Best Practices",
    href: `${ENG}/accreditations/naac/best-practices`,
    desc: "Documented institutional best practices",
  },
  {
    label: "NAAC — Institutional Distinctiveness",
    href: `${ENG}/accreditations/naac/institutional-distinctiveness`,
    desc: "What sets the institution apart",
  },
  {
    label: "Timeline",
    href: `${ENG}/timeline`,
    desc: "Milestones year by year",
  },
  {
    label: "Professional Bodies",
    href: `${ENG}/professional-bodies`,
    desc: "Chapters and memberships",
  },
  {
    label: "Cyber Safety & Security",
    href: `${ENG}/national-cyber-safety-and-security-standards`,
    desc: "NCSSS chapter and handbooks",
  },
  {
    label: "ICT Content",
    href: `${ENG}/ict-content`,
    desc: "Faculty e-learning material",
  },
  {
    label: "National Service Scheme (NSS)",
    href: `${ENG}/nss`,
    desc: "NSS, Red Ribbon Club and YRC",
  },
  {
    label: "Financial Statements",
    href: `${ENG}/financial-statements`,
    desc: "Year-wise balance sheets",
  },
  {
    label: "Placement Gallery",
    href: `${ENG}/placements/gallery`,
    desc: "Photographs from recruitment drives",
  },
];

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

const normHref = (h) => String(h ?? "").trim().replace(/\/+$/, "").toLowerCase();

/**
 * Append the missing entries to the "More" item of one navbar value.
 * Returns the number of links added.
 */
function linkInto(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.items))
    return 0;

  const parent = value.items.find(
    (i) => String(i?.label ?? "").trim().toLowerCase() === PARENT_LABEL.toLowerCase(),
  );
  if (!parent) throw new Error(`no "${PARENT_LABEL}" item in the navbar`);
  if (!Array.isArray(parent.children)) parent.children = [];

  // A page already linked anywhere in the navbar — top level or in any other
  // dropdown — is left alone rather than duplicated under "More".
  const existing = new Set();
  for (const item of value.items) {
    existing.add(normHref(item?.href));
    for (const child of item?.children ?? []) existing.add(normHref(child?.href));
  }

  let added = 0;
  for (const entry of NAV_ENTRIES) {
    if (existing.has(normHref(entry.href))) continue;
    if (parent.children.length >= MAX_CHILDREN) {
      console.warn(
        `  [skip] "${entry.label}" — "${PARENT_LABEL}" is at the ${MAX_CHILDREN}-child limit.`,
      );
      continue;
    }
    parent.children.push({ ...entry, visible: true });
    existing.add(normHref(entry.href));
    added += 1;
    console.log(`  [add] ${entry.label} → ${entry.href}`);
  }
  return added;
}

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error("[seed-content-page-nav] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const doc = await db
    .collection("siteconfigs")
    .findOne({ config_key: CONFIG_KEY });

  if (!doc) {
    console.error(
      `[seed-content-page-nav] no "${CONFIG_KEY}" config — set the navbar up in the admin first.`,
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`[seed-content-page-nav] ${DRY ? "DRY-RUN — " : ""}draft:`);
  const draftAdded = linkInto(doc.value);
  console.log(`[seed-content-page-nav] ${DRY ? "DRY-RUN — " : ""}published:`);
  const publishedAdded = linkInto(doc.published_value);

  if (DRY) {
    console.log(
      `\n[seed-content-page-nav] dry-run — would add ${draftAdded} draft / ${publishedAdded} published link(s).`,
    );
    await mongoose.disconnect();
    return;
  }

  if (draftAdded === 0 && publishedAdded === 0) {
    console.log("\n[seed-content-page-nav] Already linked — nothing to do.");
    await mongoose.disconnect();
    return;
  }

  await db.collection("siteconfigs").updateOne(
    { config_key: CONFIG_KEY },
    {
      $set: {
        value: doc.value,
        published_value: doc.published_value,
        status: "published",
        published_at: new Date(),
        updated_by: "seed-content-page-nav",
        updated_at: new Date(),
      },
      $inc: { version: 1 },
    },
  );

  console.log(
    `\n[seed-content-page-nav] Linked ${draftAdded} page(s) under "${PARENT_LABEL}". ` +
      "Reorder or reword them at /admin/page-content?college=engineering&section=navbar.",
  );
  console.log(
    "[seed-content-page-nav] NOTE: a running app serves /api/public/* from an " +
      "in-memory cache (1h TTL) that only an admin write clears. Restart the " +
      "app — or save any page in the admin — to see this immediately.",
  );
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("[seed-content-page-nav] FAILED:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(2);
});
