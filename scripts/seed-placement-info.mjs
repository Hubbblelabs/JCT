#!/usr/bin/env node
/**
 * Seed the static (year-independent) placement page content for a college —
 * the `<college>PlacementInfo` SiteConfig key that backs the Placement
 * Process / TPO Contacts / MoUs / Why Recruit sections and the placement
 * page's sidebar nav.
 *
 * Currently carries the Engineering copy supplied by the placement cell.
 * MoUs and "Why Recruit" have no source content yet, so they are seeded empty
 * and stay hidden on the public page until filled in via
 * /admin/page-content?college=engineering&section=placementInfo.
 *
 * Writes both `value` and `published_value` with status "published" (the same
 * thing the admin PUT does) so the content is live immediately.
 *
 * Merge behaviour: existing sections are only overwritten when this script has
 * content for them, so re-running never wipes MoUs/Why Recruit or a sidebar
 * nav order set in the admin.
 *
 * Usage:
 *   node scripts/seed-placement-info.mjs [--dry-run]
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

// Department coordinators, in the order the placement cell lists them.
const CORE_TEAM = [
  ["Dr. RM. Ganesh", "Placement Officer"],
  ["Mr. P. Prabu", "Computer Science and Engineering"],
  ["Mr. D. Alwin Johnnie", "Bio Tech & Bio Chemical"],
  ["Mrs. Greeshma CS", "Electrical and Electronics Engineering"],
  ["Dr. Allwyn Sundarraj A", "Food Technology"],
  ["Mr. J. Praveenkumar", "Petrochemical Technology"],
  ["Mr. P. Siva", "Mechanical Engineering"],
  ["Mr. K. Rajkumar", "Artificial Intelligence and Data Science"],
  ["Mr. D. Arul Ganapathy", "Civil Engineering"],
  ["Mrs. Thaseen Tahir", "Electronics and Communication Engineering"],
  ["Mr. J. Arun", "Computer Science and Business Systems"],
  ["Dr. Venkatesh Babu S", "Petroleum Engineering"],
];

const ENGINEERING = {
  process: {
    heading: "Placement Process",
    description:
      "For the campus placement, we are pleased to follow the basic steps.",
    steps: [
      {
        title: "Pre-Placement Talk",
        desc:
          "Companies will come down to campus to conduct pre-placement talks. " +
          "These talks will give students an idea about the recruiting " +
          "organizations and opportunities available within these. It also " +
          "gives students the chance to interact with employees of the company " +
          "and learn more about the work culture. Based on these talks, " +
          "students decide to apply for these organizations.",
      },
      {
        title: "Submission of Resumes",
        desc:
          "The willing students submit their resumes to the company after the " +
          "presentation, or to the Placement Committee in case the companies " +
          "wish to have them early prior to their arrival on campus.",
      },
      {
        title: "Short Listing of Candidates",
        desc:
          "Based on the resumes, their academic records etc. the companies " +
          "prepare a list of eligible students and inform them in advance to " +
          "the Placement Committee.",
      },
      {
        title: "Campus Recruitment",
        desc:
          "The companies inform the Placement Committee about the recruitment " +
          "procedure followed by them, like group discussions, case studies, " +
          "personal interviews, written tests etc. After the selection " +
          "process, the companies announce the list of selected candidates on " +
          "the campus itself, followed by appointment letters. Our Placement " +
          "and CRC team is glad to consider any other idea that helps " +
          "recruiters build stronger relations.",
      },
    ],
  },
  tpo: {
    heading: "TPO Contacts",
    description:
      "Reach the Training & Placement team to plan a campus drive or to know " +
      "more about our students.",
    office: { address: "", phone: "", email: "" },
    contacts: [
      {
        name: "Prof. V. Jethose",
        designation: "Director – Training & Placements",
        phone: "+91 93614 44407",
        email: "jethose.v@jct.ac.in",
        image: "",
      },
      ...CORE_TEAM.map(([name, designation]) => ({
        name,
        designation,
        phone: "",
        email: "",
        image: "",
      })),
    ],
  },
};

const SEEDS = { engineeringPlacementInfo: ENGINEERING };

async function main() {
  const uri = loadUri();
  if (!uri) {
    console.error(
      "[seed-placement-info] MONGODB_URI is required (env or .env).",
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const configs = mongoose.connection.db.collection("siteconfigs");
  const now = new Date();
  let written = 0;

  for (const [configKey, sections] of Object.entries(SEEDS)) {
    const existing = await configs.findOne({ config_key: configKey });
    // Keep whatever the admin already saved for sections this seed doesn't
    // carry (MoUs, Why Recruit, sidebar order).
    const value = { ...(existing?.value ?? {}), ...sections };
    const counts = Object.entries(sections)
      .map(([k, v]) => {
        const list = v.steps ?? v.contacts ?? v.items ?? v.points ?? [];
        return `${k}=${list.length}`;
      })
      .join(", ");
    console.log(
      `  ${DRY ? "[would upsert]" : "[upsert]"} ${configKey} (${counts})` +
        `${existing ? " — merging into existing config" : ""}`,
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

  console.log(
    `[seed-placement-info] Done. ${DRY ? "0 (dry-run)" : written} config(s) written.`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-placement-info] FAILED:", err);
  process.exit(2);
});
