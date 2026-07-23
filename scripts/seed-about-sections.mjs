#!/usr/bin/env node
/**
 * Seed the two About-page sections added after the About configs were first
 * written:
 *
 *   • Quality Policy            → engineering, arts-science, polytechnic
 *   • Planning & Monitoring Board → engineering only
 *
 * This is a STRICTLY ADDITIVE update. It writes only the `qualityPolicy` /
 * `planningBoard` sub-documents (in both `value` and `published_value`, and
 * only where those already exist as objects) via dotted `$set` paths — every
 * other About field is left exactly as stored. Configs that do not exist yet
 * are skipped rather than created, so a partial About document can never be
 * conjured up here.
 *
 * Re-running is idempotent: the same content is written over itself. If an
 * admin has since edited a section in the CMS, re-running WILL overwrite that
 * section (and only that section) — check with --dry-run first.
 *
 * Usage:
 *   node scripts/seed-about-sections.mjs [--dry-run]
 * Requires MONGODB_URI (from env, falling back to the repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

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

// ── Content ──────────────────────────────────────────────────────────────────

/** Shared by all three colleges. */
const QUALITY_POLICY = {
  intro: "",
  points: [
    "To create quality professionals to meet the emerging Industrial, Social and Economical needs.",
    "To create a good ambiance to the Students for their Academic Excellence and Innovation.",
    "Enhancing the skills and Knowledge of the Faculty and Staff through career development programmes.",
    "Encouraging and fostering a spirit of teamwork.",
    "Aiming at continual Improvement in all our activities.",
    "The management supports the team of educators to improve their professional knowledge through career development programmes, which enhance them to bring out graduates with social values.",
    "Students are motivated to take up decisions and they are continuously updated with technical knowledge that is essential for a developing nation.",
    "Helps the students for career development by improving their communication skills and technical knowledge.",
  ],
};

/** Engineering only. */
const PLANNING_BOARD = {
  paragraphs: [
    "The objectives of this committee is to make a planning of academic/co-curricular/extra-curricular activities for the forthcoming semester/academic year. As well, this committee will review the activities of the previous semester/year and make recommendations to the Principal/Management for further improvement.",
    "This committee will overview the financial viability of the college in each financial year and based on the report of the auditor it will make suggestions/recommendations to the Principal/Management about further facilities/amenities/laboratories to be included in the forthcoming semester/year.",
    "The committee will also overview the Research and Development activities of the college in each year and make suggestions for further improvements in this aspect. The composition of the committee is given below.",
  ],
  members: [
    {
      name: "Dr. MANOHARAN S",
      position: "Chairman",
      category: "Principal, JCT College of Engineering and Technology",
      qualification: "Ph.D. — Electrical Machines",
    },
    {
      name: "Dr. JETHOSE V",
      position: "Member",
      category: "Senior faculty member of the College",
      qualification: "Ph.D. — Electrical Engineering",
    },
    {
      name: "Dr. GANDHINATHAN M",
      position: "Member",
      category: "Senior faculty member from University / other college",
      qualification: "Ph.D. — Mechanical Engineering",
    },
    {
      name: "Mr. RAJU G",
      position: "Member",
      category: "Industrial expert in the field of engineering and technology",
      qualification: "M.E. — CAD/CAM",
    },
    {
      name: "Mr. BALAMURUGAN S",
      position: "Member",
      category: "Industrial expert in the field of engineering and technology",
      qualification: "B.E. — Mechanical Engineering",
    },
    {
      name: "Mr. THEODORE SOLOMAN E.C",
      position: "Member",
      category: "Architect / Civil Engineer",
      qualification: "B.Arch. — Architecture",
    },
    {
      name: "Mr. ARUN KUMAR C",
      position: "Member",
      category: "Architect / Civil Engineer",
      qualification: "B.Arch. — Architecture",
    },
  ],
};

const TARGETS = [
  {
    config_key: "engineeringAbout",
    label: "Engineering",
    sections: { qualityPolicy: QUALITY_POLICY, planningBoard: PLANNING_BOARD },
  },
  {
    config_key: "artsScienceAbout",
    label: "Arts & Science",
    sections: { qualityPolicy: QUALITY_POLICY },
  },
  {
    config_key: "polytechnicAbout",
    label: "Polytechnic",
    sections: { qualityPolicy: QUALITY_POLICY },
  },
];

// The sidebar nav is stored only when an admin has reordered/renamed it. When
// present it needs an entry for each new section, otherwise the sidebar link
// is back-filled at the end of the list instead of next to its neighbours.
const NAV_ENTRIES = {
  qualityPolicy: {
    key: "quality-policy",
    label: "Quality Policy",
    after: "vision",
  },
  planningBoard: {
    key: "planning-board",
    label: "Planning & Monitoring Board",
    after: "governing-council",
  },
};

/** Insert a nav item after `after`, or append. No-op if the key is present. */
function withNavItem(navItems, entry) {
  if (!Array.isArray(navItems)) return null; // nothing stored — defaults apply
  if (navItems.some((n) => n?.key === entry.key)) return null;
  const item = {
    id: `b-${entry.key}`,
    key: entry.key,
    label: entry.label,
    visible: true,
  };
  const at = navItems.findIndex((n) => n?.key === entry.after);
  const next = [...navItems];
  next.splice(at === -1 ? next.length : at + 1, 0, item);
  return next;
}

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error(
      "[seed-about-sections] MONGODB_URI is required (env or .env).",
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const siteconfigs = mongoose.connection.db.collection("siteconfigs");
  const now = new Date();

  console.log(
    `[seed-about-sections] ${DRY ? "DRY-RUN — nothing will be written" : "writing…"}`,
  );

  let written = 0;
  for (const { config_key, label, sections } of TARGETS) {
    const doc = await siteconfigs.findOne({ config_key });
    if (!doc) {
      console.warn(
        `\n  ! ${label} (${config_key}) — no SiteConfig document; skipped.` +
          " Save the About page once in the admin, then re-run.",
      );
      continue;
    }

    const set = {};
    const roots = ["value", "published_value"].filter(
      (r) => doc[r] && typeof doc[r] === "object" && !Array.isArray(doc[r]),
    );

    for (const [field, content] of Object.entries(sections)) {
      for (const root of roots) {
        set[`${root}.${field}`] = content;
        const nav = withNavItem(
          doc[root]?.sidebar?.navItems,
          NAV_ENTRIES[field],
        );
        if (nav) set[`${root}.sidebar.navItems`] = nav;
      }
    }

    console.log(
      `\n  • ${label} (${config_key}) → ${Object.keys(sections).join(", ")}` +
        ` in ${roots.join(" + ") || "(no value/published_value object!)"}`,
    );
    for (const p of Object.keys(set)) console.log(`      $set ${p}`);

    if (!roots.length) continue;
    if (!DRY) {
      await siteconfigs.updateOne(
        { config_key },
        {
          $set: { ...set, updated_by: "seed-about-sections", updated_at: now },
          $inc: { version: 1 },
        },
      );
      written++;
    }
  }

  console.log(
    `\n[seed-about-sections] Done. ${
      DRY
        ? "(dry-run — nothing written)"
        : `${written} SiteConfig doc(s) updated.`
    }`,
  );
  console.log(
    "  About pages are ISR-cached for 24h — redeploy, or save the page once in" +
      " the admin, to see the change immediately.",
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-about-sections] FAILED:", err);
  process.exit(2);
});
