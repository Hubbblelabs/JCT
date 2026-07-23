#!/usr/bin/env node
/**
 * Seed the Engineering "Research" page into SiteConfig.
 *
 * Content key written (see src/lib/validation/engineeringPages.ts):
 *   engineeringResearch  ->  /institutions/engineering/research
 *
 * Writes the `tabs` array, which switches the public page to the sidebar-tabs
 * layout (the same pattern as a program page). The flat hero/intro/stats/areas/
 * centres/publications fields are left untouched and stay hidden while tabs
 * exist, so this is reversible: clear `tabs` in /admin/research and the old
 * single-column layout comes back.
 *
 * Content is transcribed verbatim from the college's published Research pages.
 * Nothing is invented. The only edits to source text are whitespace
 * normalisation ("Dr. K. V.  Selvakumar", "Electronics and  Information
 * Technology") and re-numbering the Advisory Committee table: the source runs
 * 1,2,3,4,4,5,6,7,8,11,12,13,14,15 over 14 rows, so the Sl. No. column is
 * renumbered 1-14 to match the roster it actually lists.
 *
 * The "Academic Research" tab is written as an empty shell. The source page
 * links to it but publishes no body text, and inventing prose for a college's
 * research page is not something a seed script should do — an admin fills it in
 * via /admin/research.
 *
 * Re-running is idempotent — the SiteConfig doc is upserted, not duplicated —
 * but note it DOES overwrite: any Research tabs edited through the admin since
 * the last run are replaced. Use --dry-run first.
 *
 * Usage:
 *   node scripts/seed-research.mjs [--dry-run]
 * Requires MONGODB_URI (read from env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { ensureSrvResolvable } from "./_mongo-dns.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

/** Escape text interpolated into the richText HTML blocks below. */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ─── Research Overview ───────────────────────────────────────────────────────

const OVERVIEW_PARAGRAPHS = [
  "Research is the backbone of academics. Research and Development (R&D) flourishes where young minds and experienced faculty work synergistically. The staff and students are expected to develop innovative thinking and intellectual curiosity in the incubation centres. We are closely working with core industries to train the students in this direction.",
  "We are committed to long term research in emerging areas of engineering and technology. The key goal of the Institute is to provide a creative atmosphere in which higher studies and research thrive amongst the faculty and students. It also promotes and manages Institute-Industry interaction. We are having 5+ Centre of Excellences in various departments of our institution.",
  "This objective will be very close to the heart of the industry in the direction of producing ready to be employed engineers.",
];

const SCOPE_ITEMS = [
  "To create awareness and opportunities in Research and Development among the students & faculty and to create Research and Development atmosphere in every department",
  "To enhance interaction and cooperation between researchers for interdisciplinary and Multi-disciplinary work.",
  "Allocates funds for in-house R & D projects of the faculty, research scholars and students.",
  "To develop new tools and techniques to expedite problem solving with special emphasis on rural and socially relevant issues.",
  "Signing of MOU with industries and institutes for projects and training.",
  "Promoting Institute – Industry Interaction",
  "Motivating faculties and students to publish their papers in referred journals.",
];

// ─── Purpose of R&D ──────────────────────────────────────────────────────────

const PURPOSE_TEXT =
  "The objective of R & D Cell is to promote research activities among students and faculty as well as to provide a robust platform for sharing and implementing innovative and creative ideas to facilitate exchange of information and interaction among the various research institutes and industries to develop skilled manpower in various engineering fields. The cell administers all the research Programs of the College by monitoring and coordinating the research Programs. It conducts the research review meeting to examine the quality of research being conducted by various teams. The Research & Development Cell of every department takes immense efforts to expose the students to recent developments in the technology through innovative project works and paper presentations.";

// ─── Research Advisory Committee ─────────────────────────────────────────────
// [name, position, designation & department]

const ADVISORY_MEMBERS = [
  ["Dr. S. Manoharan", "Convenor", "Principal"],
  [
    "Dr. T. Rajendran",
    "Member",
    "Research Coordinator & Associate Professor, Computer Science and Engineering",
  ],
  [
    "Dr. B. Balraj",
    "Member",
    "Dean – Academics & HOD, Electrical and Electronics Engineering",
  ],
  [
    "Dr. S. Karthikumar",
    "Member",
    "Director – IQAC & HOD, Electronics and Communication Engineering",
  ],
  ["Dr. V. Jethose", "Member", "HOD, Artificial Intelligence and Data Science"],
  ["Dr. V. Murugesh", "Member", "HOD, Civil Engineering"],
  [
    "Dr. K. V. Selvakumar",
    "Member",
    "HOD, Bio-Technology and Bio-Chemical Engineering",
  ],
  ["Dr. A. Murugesan", "Member", "HOD, Petrochemical Technology"],
  ["Dr. K. Ramachandran", "Member", "HOD, Petroleum Engineering"],
  ["Dr. S. Sakthi Vinayagam", "Member", "HOD, Computer Science and Engineering"],
  ["Dr. P. Balamurugan", "Member", "HOD, Food Technology"],
  ["Dr. M. Bhuvaneshwaran", "Member", "HOD, Mechanical Engineering"],
  [
    "Prof. K. Malarvizhi",
    "Member",
    "HOD, Computer Science and Business Systems",
  ],
  ["Dr. K. Mohanapandian", "Member", "HOD, Science & Humanities"],
];

const ADVISORY_TABLE_HTML =
  "<table><thead><tr>" +
  "<th>Sl. No.</th><th>Member Name</th><th>Position</th>" +
  "<th>Designation &amp; Department</th>" +
  "</tr></thead><tbody>" +
  ADVISORY_MEMBERS.map(
    ([name, position, designation], i) =>
      `<tr><td>${i + 1}</td><td>${esc(name)}</td>` +
      `<td>${esc(position)}</td><td>${esc(designation)}</td></tr>`,
  ).join("") +
  "</tbody></table>";

// ─── Funding Agencies ────────────────────────────────────────────────────────
// [label, url] — external agency sites, transcribed as published.

const FUNDING_AGENCIES = [
  ["Atomic Energy Regulatory Board (AERB)", "http://www.aerb.gov.in/"],
  [
    "Aeronautics Research and Development Board (ARDB)",
    "http://drdo.gov.in/drdo/boards/ardb/rules&grants_intro.htm",
  ],
  [
    "Board of Research in Nuclear Sciences (BRNS)",
    "http://www.barc.gov.in/brns/index.html",
  ],
  [
    "Council of Scientific & Industrial Research (CSIR)",
    "http://www.csir.res.in/",
  ],
  [
    "Defence Research & Development Organisation (DRDO)",
    "http://drdo.gov.in/",
  ],
  ["Department of Atomic Energy", "http://dae.nic.in/"],
  ["Department of Biotechnology (DBT)", "http://dbtindia.nic.in/"],
  [
    "Department of Chemicals & Petrochemicals, Ministry of Chemicals & Fertilizers",
    "http://chemicals.nic.in/",
  ],
  [
    "Department of Electronics and Information Technology",
    "http://deity.gov.in/",
  ],
  ["European Union", "http://www.iitgn.ac.in/european_union.htm"],
  [
    "Indian Council of Agricultural Research (ICAR)",
    "http://www.icar.org.in/",
  ],
  ["Indian Council of Medical Research (ICMR)", "http://www.icmr.nic.in/"],
  [
    "Indian Council of Social Science Research (ICSSR)",
    "http://www.icssr.org/",
  ],
  ["Indian National Science Academy (INSA)", "http://insaindia.org/"],
  ["Indian Space Research Organisation (ISRO)", "http://www.isro.org/"],
  ["Ministry of Defence", "https://www.mod.nic.in/"],
  ["Ministry of Earth Science", "http://dod.nic.in/"],
  ["Ministry of Environment & Forests (MoEF)", "http://envfor.nic.in/"],
  ["Ministry of Health & Family Welfare", "http://mohfw.nic.in/"],
  ["Ministry of Petroleum & Natural Gas", "http://petroleum.nic.in/"],
  ["Ministry of Power", "http://powermin.nic.in/index.htm"],
  ["Ministry of Rural Development", "http://www.rural.nic.in/"],
  ["Ministry of Railways", "http://www.indianrailways.gov.in/"],
  ["Ministry of Small Scale Industries", "http://msme.gov.in/"],
  ["Ministry of Textiles", "http://texmin.nic.in/"],
  ["Ministry of Urban Development", "http://moud.gov.in/"],
  ["Ministry of Water Resources", "http://wrmin.nic.in/"],
  [
    "National Board for Higher Mathematics (NBHM)",
    "http://www.nbhm.dae.gov.in/",
  ],
  ["Naval Research Board (NRB)", "http://www.nrbdrdo.res.in/"],
  [
    "Petroleum Conservation Research Association (PCRA)",
    "http://www.pcra.org/",
  ],
  [
    "Science and Engineering Research Board (SERB)",
    "http://www.serb.gov.in/",
  ],
  ["Tata Institute of Fundamental Research", "http://www.tifr.res.in/"],
];

// No target="_blank": sanitizeHtml() strips `target` and `rel` from CMS HTML
// (DOMPurify drops them by default as tabnabbing protection), so writing them
// here would store markup that never survives to the page. These open in the
// same tab, like every other CMS-authored link on the site.
const FUNDING_HTML =
  "<ul>" +
  FUNDING_AGENCIES.map(
    ([label, href]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`,
  ).join("") +
  "</ul>";

// ─── Payload ─────────────────────────────────────────────────────────────────
// Shape must match ResearchPageSchema. Tab `icon` values must be names from
// SIDEBAR_ICON_OPTIONS in src/lib/sidebar-nav.ts, or the tab falls back to a
// default icon.

export const VALUE = {
  hero: {
    title: "Research & Development",
    subtitle: "",
  },
  tabs: [
    {
      id: "overview",
      label: "Research Overview",
      icon: "Info",
      sections: [
        {
          kind: "richText",
          html:
            "<h2>Research and Development Cell</h2>" +
            OVERVIEW_PARAGRAPHS.map((p) => `<p>${esc(p)}</p>`).join(""),
        },
        {
          kind: "list",
          title: "Scope of Research and Development Cell",
          items: SCOPE_ITEMS,
        },
      ],
    },
    {
      id: "purpose",
      label: "Purpose of R&D",
      icon: "Target",
      sections: [
        { kind: "richText", html: `<p>${esc(PURPOSE_TEXT)}</p>` },
      ],
    },
    {
      id: "advisory-committee",
      label: "Research Advisory Committee",
      icon: "Users",
      sections: [{ kind: "richText", html: ADVISORY_TABLE_HTML }],
    },
    {
      // No body text is published for this section upstream — left empty for an
      // admin to complete rather than inventing research claims.
      id: "academic-research",
      label: "Academic Research",
      icon: "GraduationCap",
      sections: [],
    },
    {
      id: "funding-agencies",
      label: "Funding Agencies",
      icon: "Landmark",
      sections: [{ kind: "richText", html: FUNDING_HTML }],
    },
  ],
  // Untouched by this seed; the tabs above take over the page.
  intro: [],
  stats: [],
  areas: [],
  centres: [],
  publications: [],
};

async function main() {
  const env = loadEnv();
  if (!DRY && !env.MONGODB_URI) {
    console.error("[seed-research] MONGODB_URI is not set.");
    process.exit(2);
  }

  const filled = VALUE.tabs.filter((t) => t.sections.length > 0).length;
  console.log(
    `[seed-research] engineeringResearch: ${VALUE.tabs.length} tabs ` +
      `(${filled} with content, ${VALUE.tabs.length - filled} empty)`,
  );
  for (const t of VALUE.tabs) {
    const kinds = t.sections.map((s) => s.kind).join(", ");
    console.log(`   • ${t.label}${kinds ? ` — ${kinds}` : " — (empty shell)"}`);
  }
  console.log(
    `   Advisory committee rows: ${ADVISORY_MEMBERS.length} | ` +
      `funding agency links: ${FUNDING_AGENCIES.length}`,
  );

  // A dry run only prints the plan, so it never opens a connection — it stays
  // usable without DB access.
  if (DRY) {
    console.log("\n[seed-research] Done. (dry-run — nothing written)");
    return;
  }

  await ensureSrvResolvable(env.MONGODB_URI);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const siteconfigs = mongoose.connection.collection("siteconfigs");
  const now = new Date();

  await siteconfigs.updateOne(
    { config_key: "engineeringResearch" },
    {
      $set: {
        config_key: "engineeringResearch",
        value: VALUE,
        published_value: VALUE,
        status: "published",
        published_at: now,
        updated_by: "seed-research",
        updated_at: now,
      },
      $inc: { version: 1 },
      $setOnInsert: { created_at: now },
    },
    { upsert: true },
  );

  console.log(
    "\n[seed-research] Done. 1 SiteConfig doc published." +
      " Revalidate or wait for ISR (24h) to see it live.",
  );
  await mongoose.disconnect();
}

// Only seed when run directly, so the payload can be imported and validated
// against the Zod schema without opening a DB connection.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((err) => {
    console.error("[seed-research] FAILED:", err);
    process.exit(2);
  });
}
