#!/usr/bin/env node
/**
 * Give "Mandatory Disclosures" and "HR Manual" a page each, off the engineering
 * Documents page.
 *
 * Targets (both ContentPageSchema, one `docs` block apiece):
 *   engineeringMandatoryDisclosures → /institutions/engineering/mandatory-disclosures
 *   engineeringHrManual             → /institutions/engineering/hr-manual
 *
 * Two source shapes are handled, so this works on a database that never had the
 * earlier combined page as well as on one that does:
 *   1. categories still sitting on `engineeringDocuments` (DocumentsPageSchema);
 *   2. doc groups sitting on the wrong target page — i.e. the "HR Manual" group
 *      left behind on the combined Mandatory Disclosures page.
 *
 * The navbar's "More" dropdown is fixed up too: the combined
 * "Mandatory Disclosures & HR Manual" entry is relabelled and an "HR Manual"
 * entry is inserted after it.
 *
 * Draft (`value`) and published copy (`published_value`) are rewritten together.
 * Re-running is a no-op. R2 objects are never touched — the same storage keys
 * are simply referenced from the new pages.
 *
 * Usage:
 *   node scripts/migrate-disclosure-pages.mjs [--dry-run]
 * Requires MONGODB_URI (env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

const DOCUMENTS_KEY = "engineeringDocuments";
const NAVBAR_KEY = "engineeringNavbar";
const ENG = "/institutions/engineering";

/**
 * One target page per document category. `match` lists the category / group
 * titles that belong to it, lowercased and trimmed.
 */
const TARGETS = [
  {
    configKey: "engineeringMandatoryDisclosures",
    path: `${ENG}/mandatory-disclosures`,
    label: "Mandatory Disclosures",
    match: ["mandatory disclosures", "mandatory disclosure"],
    subtitle: "Mandatory disclosure filings published by the college.",
  },
  {
    configKey: "engineeringHrManual",
    path: `${ENG}/hr-manual`,
    label: "HR Manual",
    match: ["hr manual", "human resources manual"],
    subtitle: "The human resources manual of the college.",
  },
];

/** Navbar entry that the earlier combined page left behind, if it is there. */
const COMBINED_NAV_LABEL = "mandatory disclosures & hr manual";

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

const norm = (v) =>
  String(v ?? "")
    .trim()
    .toLowerCase();

const targetFor = (title) =>
  TARGETS.find((t) => t.match.includes(norm(title))) ?? null;

const emptyContentPage = () => ({
  hero: { title: "", subtitle: "" },
  breadcrumb: [],
  intro: [],
  blocks: [],
});

/** A DocumentsPage document row → a ContentPage doc row. */
const toContentDoc = (doc) => ({
  label: String(doc?.title ?? doc?.label ?? ""),
  description: String(doc?.description ?? ""),
  file: String(doc?.file ?? ""),
});

/** The `docs` block of a content page value, created if the page has none. */
function docsBlockOf(value) {
  const existing = value.blocks.find((b) => b?.type === "docs");
  if (existing) {
    if (!Array.isArray(existing.groups)) existing.groups = [];
    return existing;
  }
  const block = {
    type: "docs",
    title: "",
    description: "",
    layout: "cards",
    linkLabel: "Download",
    groups: [],
  };
  value.blocks.push(block);
  return block;
}

function normalisePage(value) {
  value.hero ??= { title: "", subtitle: "" };
  if (!Array.isArray(value.breadcrumb)) value.breadcrumb = [];
  if (!Array.isArray(value.intro)) value.intro = [];
  if (!Array.isArray(value.blocks)) value.blocks = [];
  return value;
}

/**
 * Everything belonging to a target that is currently stored somewhere else:
 * categories on the Documents page, and doc groups on the other target's page.
 * The rows are removed from their source as they are collected.
 */
function harvest(documentsValue, pageValues) {
  const rows = [];

  if (documentsValue && Array.isArray(documentsValue.categories)) {
    for (const category of documentsValue.categories) {
      const target = targetFor(category?.title);
      if (!target) continue;
      rows.push({
        target,
        title: String(category.title ?? ""),
        docs: (category.documents ?? []).map(toContentDoc),
        from: "the Documents page",
      });
    }
    documentsValue.categories = documentsValue.categories.filter(
      (c) => !targetFor(c?.title),
    );
  }

  for (const owner of TARGETS) {
    const value = pageValues[owner.configKey];
    const block = value?.blocks?.find((b) => b?.type === "docs");
    if (!block || !Array.isArray(block.groups)) continue;
    for (const group of block.groups) {
      const target = targetFor(group?.title);
      // A group whose title matches its own page, or matches nothing at all,
      // is already where it belongs.
      if (!target || target.configKey === owner.configKey) continue;
      rows.push({
        target,
        title: String(group.title ?? ""),
        docs: (group.docs ?? []).map(toContentDoc),
        from: `the ${owner.label} page`,
      });
    }
    block.groups = block.groups.filter((g) => {
      const target = targetFor(g?.title);
      return !target || target.configKey === owner.configKey;
    });
  }

  return rows;
}

/** Fold the harvested rows into their target pages. Returns rows applied. */
function applyRows(rows, pageValues) {
  let applied = 0;

  for (const row of rows) {
    const value = normalisePage(pageValues[row.target.configKey]);
    const block = docsBlockOf(value);
    const existing = block.groups.find((g) => norm(g?.title) === norm(row.title));

    if (existing) {
      const seen = new Set((existing.docs ?? []).map((d) => norm(d.file)));
      const fresh = row.docs.filter((d) => !seen.has(norm(d.file)));
      if (fresh.length === 0) continue;
      existing.docs = [...(existing.docs ?? []), ...fresh];
      console.log(
        `  [merge] ${row.target.label} ← ${fresh.length} new doc(s) from ${row.from}`,
      );
    } else {
      block.groups.push({ title: row.title, docs: row.docs });
      console.log(
        `  [move]  ${row.target.label} ← "${row.title}" (${row.docs.length} doc(s)) from ${row.from}`,
      );
    }
    applied += 1;
  }

  // Hero, breadcrumb and group heading only make sense once the page has
  // content, so they are set after the rows land.
  for (const target of TARGETS) {
    const value = pageValues[target.configKey];
    const block = value?.blocks?.find((b) => b?.type === "docs");
    if (!block || block.groups.length === 0) continue;

    normalisePage(value);
    if (norm(value.hero.title) !== norm(target.label)) {
      value.hero = { title: target.label, subtitle: target.subtitle };
    }
    value.breadcrumb = [
      { label: "Engineering", href: ENG },
      { label: target.label, href: "" },
    ];
    // A lone group would repeat the page's own title as a sub-heading.
    if (block.groups.length === 1) block.groups[0].title = "";
  }

  return applied;
}

/**
 * Point the "More" dropdown at the split pages: relabel the combined entry and
 * add the missing one. Returns the number of navbar entries changed.
 */
function fixNavbar(value) {
  if (!value || !Array.isArray(value.items)) return 0;
  const parent = value.items.find((i) => norm(i?.label) === "more");
  if (!parent || !Array.isArray(parent.children)) return 0;

  let changed = 0;
  const [disclosures, hrManual] = TARGETS;

  const combined = parent.children.find(
    (c) => norm(c?.label) === COMBINED_NAV_LABEL,
  );
  if (combined) {
    combined.label = disclosures.label;
    combined.href = disclosures.path;
    combined.desc = "Mandatory disclosure filings";
    console.log(`  [relabel] "Mandatory Disclosures & HR Manual" → "${combined.label}"`);
    changed += 1;
  }

  const hrefs = new Set(
    value.items.flatMap((i) => [
      norm(i?.href),
      ...(i?.children ?? []).map((c) => norm(c?.href)),
    ]),
  );
  for (const target of [disclosures, hrManual]) {
    if (hrefs.has(norm(target.path))) continue;
    const entry = {
      label: target.label,
      href: target.path,
      desc: target.subtitle,
      visible: true,
    };
    // Keep the pair adjacent in the dropdown.
    const at = parent.children.findIndex(
      (c) => norm(c?.href) === norm(disclosures.path),
    );
    if (at >= 0) parent.children.splice(at + 1, 0, entry);
    else parent.children.push(entry);
    hrefs.add(norm(target.path));
    console.log(`  [add] ${target.label} → ${target.path}`);
    changed += 1;
  }

  return changed;
}

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error(
      "[migrate-disclosure-pages] MONGODB_URI is required (env or .env).",
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const configs = mongoose.connection.db.collection("siteconfigs");

  const load = async (key) =>
    (await configs.findOne({ config_key: key })) ?? {
      value: emptyContentPage(),
      published_value: emptyContentPage(),
    };

  const documents = await configs.findOne({ config_key: DOCUMENTS_KEY });
  const pages = Object.fromEntries(
    await Promise.all(
      TARGETS.map(async (t) => [t.configKey, await load(t.configKey)]),
    ),
  );
  for (const doc of Object.values(pages)) {
    doc.value = normalisePage(doc.value ?? emptyContentPage());
    doc.published_value = normalisePage(
      doc.published_value ?? emptyContentPage(),
    );
  }

  let applied = 0;
  for (const stage of ["value", "published_value"]) {
    console.log(
      `\n[migrate-disclosure-pages] ${DRY ? "DRY-RUN — " : ""}${
        stage === "value" ? "draft" : "published"
      }:`,
    );
    const pageValues = Object.fromEntries(
      TARGETS.map((t) => [t.configKey, pages[t.configKey][stage]]),
    );
    const rows = harvest(documents?.[stage], pageValues);
    const n = applyRows(rows, pageValues);
    if (n === 0) console.log("  [skip] nothing to move.");
    applied = Math.max(applied, n);
  }

  const navbar = await configs.findOne({ config_key: NAVBAR_KEY });
  let navChanged = 0;
  if (navbar) {
    console.log(`\n[migrate-disclosure-pages] ${DRY ? "DRY-RUN — " : ""}navbar:`);
    navChanged = Math.max(
      fixNavbar(navbar.value),
      fixNavbar(navbar.published_value),
    );
    if (navChanged === 0) console.log("  [skip] already linked.");
  } else {
    console.warn(
      `\n[migrate-disclosure-pages] no "${NAVBAR_KEY}" config — skipping the navbar.`,
    );
  }

  if (applied === 0 && navChanged === 0) {
    console.log("\n[migrate-disclosure-pages] already migrated — nothing to do.");
    await mongoose.disconnect();
    return;
  }

  if (DRY) {
    console.log(
      `\n[migrate-disclosure-pages] dry-run — would move ${applied} group(s) and change ${navChanged} navbar entry(ies).`,
    );
    await mongoose.disconnect();
    return;
  }

  const now = new Date();
  const publish = (extra) => ({
    $set: {
      status: "published",
      published_at: now,
      updated_by: "migrate-disclosure-pages",
      updated_at: now,
      ...extra,
    },
    $inc: { version: 1 },
  });

  for (const target of TARGETS) {
    const doc = pages[target.configKey];
    await configs.updateOne(
      { config_key: target.configKey },
      {
        ...publish({
          value: doc.value,
          published_value: doc.published_value,
        }),
        $setOnInsert: { config_key: target.configKey, created_at: now },
      },
      { upsert: true },
    );
  }

  if (documents) {
    await configs.updateOne(
      { config_key: DOCUMENTS_KEY },
      publish({
        value: documents.value,
        published_value: documents.published_value,
      }),
    );
  }

  if (navbar && navChanged > 0) {
    await configs.updateOne(
      { config_key: NAVBAR_KEY },
      publish({
        value: navbar.value,
        published_value: navbar.published_value,
      }),
    );
  }

  console.log(
    `\n[migrate-disclosure-pages] done — ${TARGETS.map((t) => t.path).join(" and ")}.`,
  );
  console.log(
    "[migrate-disclosure-pages] NOTE: a running app serves /api/public/* from " +
      "an in-memory cache (1h TTL) that only an admin write clears. Restart " +
      "the app — or save any page in the admin — to see this immediately.",
  );
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("[migrate-disclosure-pages] FAILED:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(2);
});
