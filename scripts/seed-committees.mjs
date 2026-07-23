#!/usr/bin/env node
/**
 * Seed the Engineering "Cells and Committees" page into SiteConfig.
 *
 * Content key written (see src/lib/validation/engineeringPages.ts):
 *   engineeringCommittees  ->  /institutions/engineering/committees
 *
 * Committee names are taken verbatim from the college's published list, split
 * into the two categories it uses (Statutory / Other). The `category` field is
 * what groups the cards under a heading on the public page.
 *
 * Rosters are seeded only where the college has published one — currently the
 * SC/ST Committee, the Internal Complaints Committee, and the IQAC. Every other
 * committee is written as an empty shell for the admin to complete via
 * /admin/committees. No names, contacts, or prose are invented; the only edits
 * to source text are whitespace/spelling normalisation of names and addresses
 * that arrived run together from the source tables.
 *
 * Re-running is idempotent — the SiteConfig doc is upserted, not duplicated —
 * but note it DOES overwrite: any committee rosters entered through the admin
 * since the last run are replaced. Use --dry-run first.
 *
 * Usage:
 *   node scripts/seed-committees.mjs [--dry-run]
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

const STATUTORY = "Statutory Committees";
const OTHER = "Other Committees";

/** A committee with no published roster yet — shape must match GroupSchema. */
const shell = (name, category) => ({
  name,
  slug: "",
  category,
  description: "",
  image: "",
  convenor: "",
  convenorRole: "",
  email: "",
  members: [],
  activities: [],
});

const SC_ST = {
  name: "SC / ST Committee",
  slug: "",
  category: STATUTORY,
  description:
    "The SC/ST cell of JCT College of Engineering and Technology was started in the year (2012-2013) with the purpose to empower the SC/ST students in the college. At present for the academic year (2023-2024) the college takes special interest in facilitating financial support to the students from these communities.",
  image: "",
  convenor: "",
  convenorRole: "",
  email: "",
  members: [
    // Source lists this as "Dr. MANOHARAN S"; spelled here as in the IQAC
    // table so the same person reads consistently across the page.
    {
      name: "Dr. S. Manoharan",
      role: "Principal / Member",
      dept: "",
      contact: "9443359438",
    },
    { name: "Dr. K. Geetha", role: "Member", dept: "", contact: "9789650151" },
    {
      name: "Dr. G. Gnanavel",
      role: "Member",
      dept: "",
      contact: "8015429613",
    },
    {
      name: "Mr. K. Rajkumar",
      role: "Member",
      dept: "",
      contact: "9087300166",
    },
    { name: "Mr. K. Babu", role: "Member", dept: "", contact: "9629230655" },
    {
      name: "Mrs. S. Revathi",
      role: "Member",
      dept: "",
      contact: "9600787030",
    },
  ],
  activities: [],
};

const INTERNAL_COMPLAINTS = {
  name: "Internal Complaints Committee",
  slug: "",
  category: STATUTORY,
  description:
    "The Internal Complaints Committee has been constituted and the main aim of the committee is to provide a healthy and congenial atmosphere to all the staff members and students. This committee shall address sexual harassment issues faced by girl students/women staff inside the college premises.",
  image: "",
  convenor: "",
  convenorRole: "",
  email: "",
  // role = "Committee Designation" column, dept = "Official Designation & Department".
  members: [
    {
      name: "Mrs. Vedha Vinodha D",
      role: "Chairperson / Presiding Officer",
      dept: "Assistant Professor - ECE",
      contact: "8760993236",
    },
    {
      name: "Mrs. Roopasree A",
      role: "External Member",
      dept: "Advocate, Bar Council of Tamil Nadu & Puducherry",
      contact: "9500809874",
    },
    {
      name: "Dr. S. Kanchana Devi",
      role: "Member",
      dept: "Associate Professor - S&H",
      contact: "9942722220",
    },
    {
      name: "Dr. V. Murugesh",
      role: "Member",
      dept: "Professor & HoD - Civil",
      contact: "8300652289",
    },
    {
      name: "Mrs. Johncy Deepa A",
      role: "Member",
      dept: "Admin Staff - Office",
      contact: "9843008705",
    },
    {
      name: "Mr. Vineeth Chandran",
      role: "Member",
      dept: "System Administrator",
      contact: "8848873448",
    },
    {
      name: "Ms. Gunashri M",
      role: "Member",
      dept: "Student",
      contact: "9566927313",
    },
    {
      name: "Mr. M. Shyam",
      role: "Member",
      dept: "Student",
      contact: "9895343032",
    },
    {
      name: "Ms. Varsha K. C",
      role: "Member",
      dept: "Student",
      contact: "9842815277",
    },
  ],
  activities: [],
};

const IQAC = {
  name: "Constitution of Internal Quality Assurance Cell",
  slug: "",
  category: STATUTORY,
  // The source table's "Composition Criteria Specified by NAAC" column is
  // summarised here; each member row carries its designation and affiliation.
  description:
    "Constituted in accordance with the composition criteria specified by NAAC, with representation from the management, senior administration, teaching staff at all levels, students, alumni, local society, employers, industrialists, and parents.",
  image: "",
  convenor: "Dr. V. J. Arulkarthick",
  convenorRole: "Director - IQAC",
  email: "",
  // role = "Designation" column; dept = the affiliation detail given with it.
  members: [
    {
      name: "Shri. R. Durgashankar",
      role: "Secretary",
      dept: "Management",
      contact: "",
    },
    {
      name: "Dr. S. Manoharan",
      role: "Principal",
      dept: "Chairperson - Head of the Institution",
      contact: "",
    },
    {
      name: "Mr. A. Chandrahasan",
      role: "Administrative Officer",
      dept: "",
      contact: "",
    },
    {
      name: "Dr. V. J. Arulkarthick",
      role: "Director - IQAC",
      dept: "Coordinator",
      contact: "",
    },
    {
      name: "Dr. G. Mahesh",
      role: "Professor",
      dept: "Mechanical",
      contact: "",
    },
    {
      name: "Dr. I. J. Isaac Premkumar",
      role: "Associate Professor",
      dept: "Mechanical",
      contact: "",
    },
    {
      name: "Mr. S. Renswick",
      role: "Assistant Professor",
      dept: "ECE",
      contact: "",
    },
    {
      name: "Mr. S. Navaneeth",
      role: "Alumni",
      dept: "Vinayaka Nagar, Nembara (PO), Palakkad, Kerala 678508",
      contact: "",
    },
    {
      name: "Mr. R. Thangam",
      role: "Local Society",
      dept: "Ex-President, Pichanur Village",
      contact: "",
    },
    {
      name: "Mr. Chandan Kumar",
      role: "Student",
      dept: "IV Year, Mechanical",
      contact: "",
    },
    {
      name: "Mr. K. Kathirvel",
      role: "Employer",
      dept: "Founder, Sai Sri Automation, Podanur, Coimbatore",
      contact: "",
    },
    {
      name: "Mr. P. Sakthivel",
      role: "Industrialist",
      dept: "Automation Engineer, LMW Ltd, Kaniyur, Coimbatore",
      contact: "",
    },
    {
      name: "Mr. M. Gowtham",
      role: "Parent",
      dept: "S/O Kalpana M, Erukkalampara, Parissikal (PO), Palakkad 678556",
      contact: "",
    },
  ],
  activities: [],
};

const STATUTORY_NAMES = [
  "Anti-Ragging Committee",
  "Student's Grievance Redressal Cell",
  "Discipline and Welfare Committee",
  "Finance and Purchase Committee",
  "Governing Council",
  "Planning and Monitoring",
  "Women Empowerment / Prevention of Sexual Harassment (POSH) Cell",
];

const OTHER_NAMES = [
  "ERP Committee Members",
  "Exam Cell Members",
  "Fine Arts and Literature Club",
  "Institute Industry Partnership Cell",
  "Institute Innovation and Incubation Center",
  "IQAC Committee",
  "NAAC Certification Committees",
  "NBA Members Committee",
  "Placement and Career Guidance Cell",
  "Research and Development Cell",
  "Science Club",
  "Transport Committee",
  "ECO Club",
];

export const VALUE = {
  hero: {
    title: "Cells and Committees",
    subtitle:
      "The statutory and institutional bodies that govern academic, welfare, and administrative functions at JCT College of Engineering and Technology.",
  },
  intro: [],
  groups: [
    SC_ST,
    INTERNAL_COMPLAINTS,
    IQAC,
    ...STATUTORY_NAMES.map((n) => shell(n, STATUTORY)),
    ...OTHER_NAMES.map((n) => shell(n, OTHER)),
  ],
};

async function main() {
  const env = loadEnv();
  if (!DRY && !env.MONGODB_URI) {
    console.error("[seed-committees] MONGODB_URI is not set.");
    process.exit(2);
  }

  const withRoster = VALUE.groups.filter((g) => g.members.length > 0).length;
  console.log(
    `[seed-committees] engineeringCommittees: ${VALUE.groups.length} committees ` +
      `(${withRoster} with a roster, ${VALUE.groups.length - withRoster} empty)`,
  );
  for (const g of VALUE.groups) {
    console.log(
      `   • [${g.category}] ${g.name}` +
        (g.members.length ? ` — ${g.members.length} members` : ""),
    );
  }

  // A dry run only prints the plan, so it never opens a connection — it stays
  // usable without DB access.
  if (DRY) {
    console.log("\n[seed-committees] Done. (dry-run — nothing written)");
    return;
  }

  await ensureSrvResolvable(env.MONGODB_URI);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const siteconfigs = mongoose.connection.collection("siteconfigs");
  const now = new Date();

  await siteconfigs.updateOne(
    { config_key: "engineeringCommittees" },
    {
      $set: {
        config_key: "engineeringCommittees",
        value: VALUE,
        published_value: VALUE,
        status: "published",
        published_at: now,
        updated_by: "seed-committees",
        updated_at: now,
      },
      $inc: { version: 1 },
      $setOnInsert: { created_at: now },
    },
    { upsert: true },
  );

  console.log(
    "\n[seed-committees] Done. 1 SiteConfig doc published." +
      " Revalidate or wait for ISR (24h) to see it live.",
  );
  await mongoose.disconnect();
}

// Only seed when run directly, so the payload can be imported and validated
// against the Zod schema without opening a DB connection.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((err) => {
    console.error("[seed-committees] FAILED:", err);
    process.exit(2);
  });
}
