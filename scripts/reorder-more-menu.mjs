#!/usr/bin/env node
/**
 * Fix the order of the public "More" dropdown for Engineering and Polytechnic,
 * and relabel the engineering "Documents" entry.
 *
 * The navbars are CMS data — the `<college>Navbar` SiteConfig keys, edited at
 * /admin/page-content?college=<college>&section=navbar — so the running order
 * lives in the database, not in src/data/all-navigations.ts (that file is only
 * the fallback used when a navbar has never been saved).
 *
 * Wanted order:
 *   engineering  Affiliation & Accreditation → NAAC (and its sub-entries) →
 *                Research → everything else, in its existing order
 *   polytechnic  Affiliation & Accreditation → Committees → Clubs & Cells →
 *                everything else, in its existing order
 *
 * The pinned entries are matched on their `href` first and their label second,
 * so an entry the admin renamed — "Accredations", "Documents " — is still
 * recognised rather than duplicated. An entry missing from the dropdown
 * altogether is inserted. A top-level link to the same page is left alone:
 * both colleges already carry Accreditations in the top bar *and* under More.
 *
 * Draft (`value`) and published copy (`published_value`) are rewritten
 * together. Re-running is a no-op.
 *
 * Usage:
 *   node scripts/reorder-more-menu.mjs [--dry-run] [--only=<configKey>]
 * Requires MONGODB_URI (env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

const ONLY = (() => {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  return arg ? arg.slice("--only=".length).trim() : null;
})();

/** The dropdown being reordered, matched on its label. */
const PARENT_LABEL = "More";

const ENG = "/institutions/engineering";
const POLY = "/institutions/polytechnic";

/**
 * One rule per pinned entry, in the order they should appear.
 *
 * `href`      the canonical target, used both to match and to insert
 * `labelRe`   fallback match for an entry whose href moved or differs
 * `relabel`   when set, the entry's label is rewritten to this
 * `withPrefix` pulls related entries up directly behind the pinned one — the
 *              NAAC sub-pages ("NAAC — AQAR Report", …) belong under NAAC
 * `insert`    the entry to add when nothing matched; omit to never insert
 */
const PLANS = [
  {
    configKey: "engineeringNavbar",
    relabel: [
      // "Documents" undersells a page that now also carries NIRF, financial
      // statements and ICT content.
      {
        href: `${ENG}/documents`,
        labelRe: /^documents$/i,
        to: "Reports & Downloads",
      },
    ],
    pins: [
      {
        href: `${ENG}/accreditations`,
        labelRe: /affiliation|accreditation/i,
        relabel: "Affiliation & Accreditation",
        insert: {
          label: "Affiliation & Accreditation",
          href: `${ENG}/accreditations`,
          desc: "Affiliation, approvals and accreditation status",
        },
      },
      {
        href: `${ENG}/naac`,
        labelRe: /^naac$/i,
        withPrefix: /^naac\b/i,
        insert: {
          label: "NAAC",
          href: `${ENG}/naac`,
          desc: "Appeal tables and supporting documents",
        },
      },
      {
        href: `${ENG}/research`,
        labelRe: /^research$/i,
        insert: {
          label: "Research",
          href: `${ENG}/research`,
          desc: "Research centres, focus areas and publications",
        },
      },
    ],
  },
  {
    configKey: "polytechnicNavbar",
    relabel: [],
    pins: [
      {
        href: `${POLY}/accreditations`,
        labelRe: /affiliation|accreditation/i,
        relabel: "Affiliation & Accreditation",
        insert: {
          label: "Affiliation & Accreditation",
          href: `${POLY}/accreditations`,
          desc: "Affiliation, approvals and accreditation status",
        },
      },
      {
        href: `${POLY}/committees`,
        labelRe: /committee/i,
        insert: {
          label: "Committees & Cells",
          href: `${POLY}/committees`,
          desc: "Committees and cells across the college",
        },
      },
      {
        // No dedicated clubs route for Polytechnic — match whatever the admin
        // added (Fine Arts Club, a clubs page, …) and never insert one.
        labelRe: /club|cell/i,
      },
    ],
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

const normHref = (h) =>
  String(h ?? "")
    .trim()
    .replace(/\/+$/, "")
    .toLowerCase();

const label = (node) => String(node?.label ?? "").trim();

/** Relabel entries whose page outgrew its name. Returns entries changed. */
function relabelIn(value, rules) {
  let changed = 0;
  const visit = (node) => {
    if (!node) return;
    const rule = rules.find(
      (r) =>
        normHref(node.href) === normHref(r.href) || r.labelRe.test(label(node)),
    );
    if (!rule || label(node) === rule.to) return;
    console.log(`  [relabel] "${label(node)}" → "${rule.to}"`);
    node.label = rule.to;
    changed += 1;
  };
  for (const item of value.items ?? []) {
    visit(item);
    for (const child of item?.children ?? []) visit(child);
  }
  return changed;
}

/**
 * Move the pinned entries to the head of the dropdown, in plan order, leaving
 * everything else in its existing order behind them. Returns entries moved or
 * inserted.
 */
function reorderIn(value, pins) {
  const parent = (value.items ?? []).find(
    (i) => label(i).toLowerCase() === PARENT_LABEL.toLowerCase(),
  );
  if (!parent) throw new Error(`no "${PARENT_LABEL}" item in the navbar`);
  if (!Array.isArray(parent.children)) parent.children = [];

  const before = parent.children.map((c) => normHref(c?.href)).join("|");
  const rest = [...parent.children];
  const head = [];
  let inserted = 0;

  const take = (predicate) => {
    const at = rest.findIndex(predicate);
    return at >= 0 ? rest.splice(at, 1)[0] : null;
  };

  for (const pin of pins) {
    let entry = pin.href
      ? take((c) => normHref(c?.href) === normHref(pin.href))
      : null;
    if (!entry) entry = take((c) => pin.labelRe.test(label(c)));

    if (!entry) {
      // Nothing in the dropdown matched, by href or by label.
      if (!pin.insert) {
        console.warn(
          `  [skip] no entry matching ${pin.labelRe} — nothing to insert.`,
        );
        continue;
      }
      entry = { ...pin.insert, visible: true };
      inserted += 1;
      console.log(`  [add] ${entry.label} → ${entry.href}`);
    } else if (pin.relabel && label(entry) !== pin.relabel) {
      console.log(`  [relabel] "${label(entry)}" → "${pin.relabel}"`);
      entry.label = pin.relabel;
    }

    head.push(entry);

    // Sub-pages of the pinned entry follow it immediately.
    if (pin.withPrefix) {
      for (;;) {
        const sub = take((c) => pin.withPrefix.test(label(c)));
        if (!sub) break;
        head.push(sub);
      }
    }
  }

  parent.children = [...head, ...rest];
  const after = parent.children.map((c) => normHref(c?.href)).join("|");
  const moved = before === after ? 0 : 1;
  if (moved) {
    console.log(
      `  [order] ${parent.children.map((c) => label(c)).join(" → ")}`,
    );
  }
  return moved + inserted;
}

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error("[reorder-more-menu] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }

  const plans = PLANS.filter((p) => !ONLY || p.configKey === ONLY);
  if (!plans.length) {
    console.error("[reorder-more-menu] --only matched no navbar.");
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const configs = mongoose.connection.db.collection("siteconfigs");
  let total = 0;

  for (const plan of plans) {
    const doc = await configs.findOne({ config_key: plan.configKey });
    if (!doc) {
      console.warn(
        `[reorder-more-menu] no "${plan.configKey}" config — set that navbar ` +
          "up in the admin first. Skipping.",
      );
      continue;
    }

    console.log(`\n[reorder-more-menu] ${DRY ? "DRY-RUN — " : ""}${plan.configKey}:`);

    let changed = 0;
    for (const stage of ["value", "published_value"]) {
      const value = doc[stage];
      if (!value || typeof value !== "object" || !Array.isArray(value.items)) {
        continue;
      }
      const n =
        relabelIn(value, plan.relabel) + reorderIn(value, plan.pins);
      changed = Math.max(changed, n);
    }

    if (changed === 0) {
      console.log("  [skip] already in order.");
      continue;
    }
    total += changed;
    if (DRY) continue;

    const now = new Date();
    await configs.updateOne(
      { config_key: plan.configKey },
      {
        $set: {
          value: doc.value,
          published_value: doc.published_value,
          status: "published",
          published_at: now,
          updated_by: "reorder-more-menu",
          updated_at: now,
        },
        $inc: { version: 1 },
      },
    );
    console.log("  [published]");
  }

  if (DRY) {
    console.log(`\n[reorder-more-menu] dry-run — would change ${total} navbar(s).`);
  } else {
    console.log(`\n[reorder-more-menu] done — ${total} change(s).`);
    console.log(
      "[reorder-more-menu] NOTE: a running app serves /api/public/* from an " +
        "in-memory cache (1h TTL) that only an admin write clears. Restart the " +
        "app — or save any page in the admin — to see this immediately.",
    );
  }
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("[reorder-more-menu] FAILED:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(2);
});
