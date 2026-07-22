#!/usr/bin/env node
/**
 * Seed the CMS-managed meta title/description supplied by the SEO team
 * ("Meta title tags & Description - Engineering JCT" sheet).
 *
 * Two destinations:
 *   1. `<scope>Seo` SiteConfig keys — per-page meta tags for the landing and
 *      standalone pages. Every route in src/data/seo-pages.ts gets a row, so
 *      the admin form lists all pages even where the sheet had no copy.
 *   2. `Program.content.seo` — program detail pages. `published_content.seo`
 *      is updated too (only for programs that are already published), so the
 *      new tags go live without a manual re-publish.
 *
 * Merge behaviour: a page/program whose title AND description are both blank
 * here is left untouched, so re-running never wipes copy written in the admin.
 *
 * Usage:
 *   node scripts/seed-seo.mjs [--dry-run]
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
    const m = fs
      .readFileSync(envPath, "utf8")
      .match(/^\s*MONGODB_URI\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

// Mirrors src/data/seo-pages.ts — kept as plain data here because seed scripts
// run outside the Next/TS build.
const SCOPE_PAGES = {
  main: [
    ["/", "Home"],
    ["/about-us", "About Us"],
    ["/campus-life", "Campus Life"],
    ["/events", "News & Events"],
    ["/accreditations", "Accreditations"],
  ],
  engineering: [
    ["/institutions/engineering", "Landing page"],
    ["/institutions/engineering/courses", "Courses"],
    ["/institutions/engineering/about", "About"],
    ["/institutions/engineering/coe", "Centre of Excellence"],
    ["/institutions/engineering/placements", "Placements"],
    ["/institutions/engineering/events", "News & Events"],
    ["/institutions/engineering/accreditations", "Accreditations"],
  ],
  "arts-science": [
    ["/institutions/arts-science", "Landing page"],
    ["/institutions/arts-science/courses", "Courses"],
    ["/institutions/arts-science/about", "About"],
    ["/institutions/arts-science/placements", "Placements"],
    ["/institutions/arts-science/events", "News & Events"],
    ["/institutions/arts-science/accreditations", "Accreditations"],
  ],
  polytechnic: [
    ["/institutions/polytechnic", "Landing page"],
    ["/institutions/polytechnic/courses", "Courses"],
    ["/institutions/polytechnic/about", "About"],
    ["/institutions/polytechnic/placements", "Placements"],
    ["/institutions/polytechnic/events", "News & Events"],
    ["/institutions/polytechnic/accreditations", "Accreditations"],
  ],
};

const SCOPE_CONFIG_KEY = {
  main: "mainSeo",
  engineering: "engineeringSeo",
  "arts-science": "artsScienceSeo",
  polytechnic: "polytechnicSeo",
};

// Copy from the sheet, verbatim. Paths not listed here are seeded blank.
const PAGE_COPY = {
  "/institutions/engineering": {
    title: "Engineering college in coimbatore | JCT College",
    description:
      "JCT institute is the best biotechnology college and engineering college in coimbatore. 100% Placement support",
  },
  "/institutions/arts-science": {
    title: "Best Arts And Science Colleges In Coimbatore | JCT College",
    description:
      "JCT is best arts college in coimbatore. We are A tier college in coimbatore. We're best arts and science college Join our institution where innovation meets tradition. Explore UG courses in arts & science, and more.",
  },
  "/institutions/polytechnic": {
    title: "Best Polytechnic Colleges In Coimbatore | JCT",
    description:
      "Looking for Polytechnic colleges in coimbatore. JCT is best Diploma College in coimbatore. More course with advanced teaching methods.",
  },
};

// Program detail pages, keyed by institution → slug.
const PROGRAM_COPY = {
  engineering: {
    cse: {
      title: "Computer Science Engineering Colleges in Coimbatore",
      description:
        "Pursue Computer Science and Engineering at JCT College with advanced laboratories, industry exposure, and practical learning opportunities.",
    },
    mech: {
      title:
        "Mechanical Engineering Colleges in Coimbatore, Best Mechanical Engineering Colleges Coimbatore | JCT Engineering",
      description:
        "JCT offers the best mechanical engineering courses in Coimbatore. We facilitation to establish development centres of various reputed industries at our department. Apply For best mechanical engineering course today.",
    },
    eee: {
      title:
        "electrical and electronics engineering in Coimbatore | JCT College",
      description:
        "Join Electrical and Electronics Engineering at JCT College, Coimbatore and gain technical skills through practical learning and modern laboratory training.",
    },
    ece: {
      title: "Best Electrical and Communication Engineering College",
      description:
        "Build a future in Electrical and Communication Engineering with practical experience, expert faculty, and industry-relevant technical skills.",
    },
    ce: {
      title: "Civil Engineering Colleges in Coimbatore",
      description:
        "Pursue Civil Engineering with expert faculty, practical experience, and industry-oriented education for careers in construction and project management.",
    },
    aids: {
      title:
        "Artificial intelligence and data science engineering college | JCT",
      description:
        "Looking for the best artificial intelligence and data science engineering college. JCT is the best engineering college in Coimbatore and offers more courses. Join now",
    },
    csbs: {
      title: "Computer Science and Business Systems | JCT College",
      description:
        "Gain knowledge in computer science, business analytics, and emerging technologies through the Computer Science and Business Systems program at JCT College.",
    },
    bt: {
      title: "Biotechnology and Biochemical Engineering Course",
      description:
        "Study Biotechnology and Biochemical Engineering at JCT College with modern labs, practical learning, and strong career opportunities.",
    },
    ft: {
      title: "Food Technology Course at JCT College Of Engineering, Coimbatore",
      description:
        "Enroll B.Tech Food Technology Course at Jct Engineering Colleges, which includes various subjects from processing to marketing aspects of food and food products.",
    },
    pe: {
      title: "Petroleum Engineering Colleges in Coimbatore | JCT College",
      description:
        "Explore Petroleum Engineering at JCT College with industry-focused learning, modern facilities, practical training, and opportunities in the oil and gas industry.",
    },
    pct: {
      title: "Petrochemical Technology Engineering | JCT College",
      description:
        "Explore Petrochemical Technology at JCT College with hands-on training, advanced labs, and industry-oriented education for future careers",
    },
  },
  "arts-science": {
    "bsc-computer-science": {
      title: "Best B . SC Computer science colleges | JCT College",
      description:
        "B.Sc Computer science colleges in coimbatore. JCT Colleges offer best computer science courses. And offer advanced labs and B . SC Computer Science Subjects. For become future.",
    },
    "bsc-ai-ml": {
      title:
        "Best Artificial Intelligence and Machine Learning College | JCT college",
      description:
        "Artificial Intelligence and Machine Learning Course In Coimbatore. JCT Colleges offer AI & Machine learning courses. Join Our Advanced AI courses.",
    },
    bca: {
      title:
        "Top Bachelor Of Computer Application colleges in coimbatore | JCT college",
      description:
        "Top Bachelor Of Computer Application colleges in coimbatore. Join one of the top Bachelor of Computer Application colleges with future technology expert faculty, and strong placement support. Enroll today",
    },
    "bcom-logistics-supply-chain": {
      title: "Best Logistics & Supply Chain Management Course in coimbatore",
      description:
        "Looking for Logistics and Supply Chain Management Courses. JCT College offer advanced B.com courses in coimbatore. expert staffs and trainers. Join now",
    },
    "bba-logistics": {
      title: "Top BBA logistics college in coimbatore | JCT College",
      description:
        "Top BBA logistics college in coimbatore. JCT Offers india's best BBA Logistics courses & Advanced teaching methods. Enroll course today.",
    },
  },
  polytechnic: {
    "computer-technology": {
      title: "Best Diploma in Computer Technology college | JCT College",
      description:
        "Best Diploma in Computer Technology college in coimbatore. Advanced computer teaching methods and professionals.",
    },
    "agricultural-engineering": {
      title: "Top Diploma in agriculture engineering college in coimbatore",
      description:
        "Looking for diploma colleges in coimbatore. We are JCT college of institute offer multiple polytechnic courses and advanced teaching methods. Join Today Now.",
    },
    "petrochemical-engineering": {
      title: "Diploma in Petrochemical Engineering",
      description:
        "Diploma in Petrochemical Engineering prepares students for careers in petroleum refining, chemical manufacturing, energy production, and industrial operations.",
    },
    "mechanical-engineering": {
      title:
        "Best Diploma in Mechanical Engineering College in coimbatore | JCT College",
      description:
        "JCT Collge we offer Diploma In Mechanical Engineering after 10th. Best infrastructure and quality trainers. Join and step into your career.",
    },
    "electrical-electronics": {
      title:
        "Top Diploma in Electrical and Electronics Engineering college | JCT diploma college coimbatore.",
      description:
        "Looking for EEE Colleges? JCT Offer Diploma in Electrical and Electronics Engineering courses in coimbatore. Apply Now",
    },
    "civil-engineering": {
      title:
        "Best Diploma in civil engineering college in coimbatore | JCT College",
      description:
        "JCT is one of the leading diploma in civil engineering colleges in Coimbatore. Join our",
    },
  },
};

async function seedConfigs(db, now) {
  const configs = db.collection("siteconfigs");
  let written = 0;

  for (const [scope, pages] of Object.entries(SCOPE_PAGES)) {
    const configKey = SCOPE_CONFIG_KEY[scope];
    const existing = await configs.findOne({ config_key: configKey });
    const existingPages = Array.isArray(existing?.value?.pages)
      ? existing.value.pages
      : [];
    const byPath = new Map(existingPages.map((p) => [p.path, p]));

    let seeded = 0;
    for (const [pagePath, label] of pages) {
      const copy = PAGE_COPY[pagePath];
      const prev = byPath.get(pagePath);
      // Never overwrite copy already written in the admin.
      const keepExisting = prev && (prev.title || prev.description);
      byPath.set(pagePath, {
        path: pagePath,
        label,
        title: keepExisting ? prev.title : (copy?.title ?? ""),
        description: keepExisting ? prev.description : (copy?.description ?? ""),
      });
      if (copy && !keepExisting) seeded++;
    }

    const value = { pages: [...byPath.values()] };
    console.log(
      `  ${DRY ? "[would upsert]" : "[upsert]"} ${configKey} ` +
        `(${value.pages.length} pages, ${seeded} with sheet copy)`,
    );
    if (DRY) continue;

    await configs.updateOne(
      { config_key: configKey },
      {
        $set: {
          value,
          published_value: value,
          status: "published",
          published_at: now,
          updated_at: now,
          updated_by: "seed-script",
        },
        $setOnInsert: { created_at: now },
        $inc: { version: 1 },
      },
      { upsert: true },
    );
    written++;
  }
  return written;
}

async function seedPrograms(db, now) {
  const programs = db.collection("programs");
  let written = 0;

  for (const [institution, bySlug] of Object.entries(PROGRAM_COPY)) {
    for (const [slug, seo] of Object.entries(bySlug)) {
      const doc = await programs.findOne({ institution, slug });
      if (!doc) {
        console.warn(`  [skip] ${institution}/${slug} — no such program`);
        continue;
      }
      const prev = doc.content?.seo;
      if (prev && (prev.title || prev.description)) {
        console.log(`  [keep] ${institution}/${slug} — SEO already set`);
        continue;
      }

      const set = { "content.seo": seo, updated_at: now };
      // Push straight to the live snapshot as well, but only where one
      // already exists — otherwise the program isn't published and would be
      // given a half-empty published_content.
      const alsoPublished = doc.status === "published" && doc.published_content;
      if (alsoPublished) set["published_content.seo"] = seo;

      console.log(
        `  ${DRY ? "[would set]" : "[set]"} ${institution}/${slug}` +
          `${alsoPublished ? " (+ published)" : " (draft only)"}`,
      );
      if (DRY) continue;

      await programs.updateOne({ _id: doc._id }, { $set: set });
      written++;
    }
  }
  return written;
}

async function main() {
  const uri = loadUri();
  if (!uri) {
    console.error("[seed-seo] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const now = new Date();

  console.log("[seed-seo] Page meta tags:");
  const configCount = await seedConfigs(db, now);
  console.log("[seed-seo] Program meta tags:");
  const programCount = await seedPrograms(db, now);

  console.log(
    `[seed-seo] Done. ${DRY ? "0 (dry-run)" : configCount} config(s) and ` +
      `${DRY ? "0 (dry-run)" : programCount} program(s) written.`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-seo] FAILED:", err);
  process.exit(2);
});
