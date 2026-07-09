#!/usr/bin/env node
/**
 * Usage:
 *   MONGODB_URI="..." node scripts/seed-deptcontent-eee.mjs
 *   node scripts/seed-deptcontent-eee.mjs          # reads .env automatically
 *   node scripts/seed-deptcontent-eee.mjs --dry-run
 *
 * Seeds the Electrical and Electronics Engineering department page content
 * (slug: "eee", institution: "engineering") per the department's requested
 * page structure:
 *
 *   Overview        — About, Vision/Mission, PEO/PO/PSOs, Highlights/Scope,
 *                      Board of Studies, DAC/PAC
 *   Academic        — Programmes Offered, Curriculum & Syllabus (R2024/R2021/R2017)
 *   People          — HoD Desk, Faculty List with IRINS Link
 *   Facility        — Class Rooms, Laboratory, Centre of Excellence, Library
 *   Awards          — Faculty, Students
 *   Innovations in TLP
 *   Placement
 *   SDG Implementation
 *   Research        — Academic Research, Industrial Consultancy, IPR, MoU Signed
 *   Societies       — IEEE, IGEN, ISTE
 *   Events
 *   Newsletter / Magazine
 *
 * Mapping notes:
 *   - Fields that exist on the current ProgramData shape (src/types/program.ts)
 *     are populated directly (about, hod, visionMission, programOutcomes,
 *     advisoryBoard, pac, bos, curriculum, teachingLearning, faculty, labs,
 *     library, events, studentParticipation, achievements, careerProgression,
 *     magazine, heroMeta) so they render immediately through the existing
 *     ProgramPageLayout / normalizeProgramData pipeline.
 *   - Sections requested by the department that have no home yet in
 *     ProgramData (Highlights/Scope, Programmes Offered, Centre of
 *     Excellence, SDG Implementation, Research/IPR/MoU, Societies &
 *     Chapters) are staged under content.departmentPage.* — stored on the
 *     Mixed `content` field but NOT rendered by the public site until
 *     ProgramData / normalize-program-data.ts / ProgramPageLayout gain
 *     matching sections. Nesting them separately avoids colliding with any
 *     field the schema adds later.
 *   - Fields with no verified source data (Board of Studies members, PAC
 *     roster, IPR filings, MoUs, SDG activities, society chapter details,
 *     IRINS profile URLs, library counts, class-room inventory, newsletter
 *     issues) are left as empty placeholders for the department to fill in
 *     via the admin content builder — nothing here is fabricated.
 *   - Real historical content (about text, HoD info, vision/mission, PEO/PSO,
 *     DAC roster, faculty roster, labs, placement stats) is carried forward
 *     from the department's previously-published page content.
 *
 * NEVER modifies the `image` field on an existing document.
 * This script only touches the "eee" program document.
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve } from "path";

// ─── Load .env if MONGODB_URI not already in environment ─────────────────────

if (!process.env.MONGODB_URI) {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m) {
        const key = m[1].trim();
        const val = m[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch {
    // no .env file — rely on environment
  }
}

const uri = process.env.MONGODB_URI;
const DRY_RUN = process.argv.includes("--dry-run");

if (!uri) {
  console.error(
    "MONGODB_URI is required. Set it in the environment or in a .env file.",
  );
  process.exit(1);
}

// ─── Program data ─────────────────────────────────────────────────────────────

const PROGRAM = {
  slug: "eee",
  name: "Electrical and Electronics Engineering",
  abbr: "EEE",
  institution: "engineering",
  degree: "B.E.",
  duration: "4 Years",
  seats: 60,
  highlight:
    "Strong program in electrical machines, power electronics, drives and control systems with research focus on electric vehicles and renewable energy.",
  description:
    "The department of EEE was established in 2010. It offers an undergraduate programme in EEE with intake of 60 students and a postgraduate programme in Power Electronics and Drives.",
  outcomes: [
    "Possess a strong foundation in Electrical and Electronics Engineering to solve real-world problems",
    "Demonstrate technical proficiency, leadership and teamwork in multidisciplinary environments",
    "Exhibit ethical behavior, social responsibility and commitment to continuous learning",
    "Work in power sector, electronics industry, government organizations and research labs",
  ],
  is_active: true,
  sort_order: 5,
  content: {
    name: "Electrical and Electronics Engineering",
    college: "engineering",
    shortName: "EEE",
    bgColor: "#0F172A",
    accentColor: "#FFC917",
    heroImage: "/site_assests/engineering.jpeg",
    degreePrefix: "B.E.",

    // ── Overview: About the Department ────────────────────────────────────────
    about1:
      "The department of EEE was established in 2010. It offers Undergraduate programme in EEE with intake of 60 students. It also runs a prominent postgraduate programme ME (Power Electronics and Drives), which started from year 2012 with an intake of 18 students.",
    about2:
      "The faculty of this department elicit excellent commitment, and they possess high qualification credentials to provide technical education of utmost standards. The students are offered with innovative workshops, guest lectures, informative industrial visits, etc. on a regular basis, to keep them updated with the latest trends in electrical and electronics engineering.",
    about3:
      "There are many job sectors available for the Electrical Engineering graduates. Some of the organizations which are available for the EEE Graduates include ONGC, Steel Authority of India, Hydro Electric Power Plants, Thermal Power Plants, Atomic Power Plants, HCL, HPCL, DRDO, ISRO, Railways, BSNL, Siemens, BEL, BHEL, SAIL, GAIL and many more.",

    established: "2010",
    accreditation: "AICTE",
    intake: 60,
    affiliation: "Anna University, Chennai",
    duration: "4 Years",

    // ── People: HoD Desk ───────────────────────────────────────────────────────
    hodName: "Dr. B. Balraj",
    hodDesignation: "Professor, Dean-Academics and Head",
    hodQualification: "Ph.D",
    hodExperience: "Instrumentation Engineering",
    hodMessage: [
      "Welcome to the Department of Electrical and Electronics Engineering at JCT College of Engineering and Technology.",
      "Our department is committed to producing industry-ready engineers with technical expertise, innovation, and ethical values to meet global challenges in the power and electronics sectors.",
    ],

    // ── Overview: Vision / Mission ─────────────────────────────────────────────
    vision:
      "To emerge as a center of excellence in Electrical and Electronics Engineering by producing industry-ready engineers with technical expertise, innovation, and ethical values to meet global challenges.",

    mission: [
      "To impart strong theoretical knowledge and practical skills in Electrical and Electronics Engineering through outcome-based education and continuous improvement.",
      "To promote innovation, ethical practices, leadership and lifelong learning through curricular, co-curricular, industry-engaged activities.",
      "To foster collaborations with academia, industry and research organizations for skill development, entrepreneurship, addressing societal challenges and solving technological problems.",
    ],

    // ── Overview: PEO / PO / PSOs ──────────────────────────────────────────────
    // PEOs and PSOs are department-specific. PO1-PO12 are the standard NBA
    // Graduate Attributes used across all AICTE/Anna University accredited
    // UG engineering programmes — not EEE-specific, included for completeness.
    programOutcomes: [
      {
        code: "PEO1",
        title: "Technical Foundation",
        description:
          "Graduates will possess a strong foundation in Electrical and Electronics Engineering, enabling them to solve real-world problems, contribute to advanced research, and engage in innovative development.",
      },
      {
        code: "PEO2",
        title: "Professional Skills",
        description:
          "Graduates will demonstrate technical proficiency, leadership, and teamwork in multidisciplinary environments, fulfilling industry and societal needs.",
      },
      {
        code: "PEO3",
        title: "Ethics and Innovation",
        description:
          "Graduates will exhibit ethical behavior, social responsibility and a commitment to continuous learning and innovation throughout their career.",
      },
      {
        code: "PO1",
        title: "Engineering Knowledge",
        description:
          "Apply knowledge of mathematics, science, engineering fundamentals and an engineering specialization to the solution of complex engineering problems.",
      },
      {
        code: "PO2",
        title: "Problem Analysis",
        description:
          "Identify, formulate, review research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences.",
      },
      {
        code: "PO3",
        title: "Design/Development of Solutions",
        description:
          "Design solutions for complex engineering problems and design system components or processes that meet specified needs with appropriate consideration for public health, safety, and environmental and cultural considerations.",
      },
      {
        code: "PO4",
        title: "Conduct Investigations of Complex Problems",
        description:
          "Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data to provide valid conclusions.",
      },
      {
        code: "PO5",
        title: "Modern Tool Usage",
        description:
          "Create, select and apply appropriate techniques, resources and modern engineering and IT tools, including prediction and modelling, to complex engineering activities with an understanding of the limitations.",
      },
      {
        code: "PO6",
        title: "The Engineer and Society",
        description:
          "Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to professional engineering practice.",
      },
      {
        code: "PO7",
        title: "Environment and Sustainability",
        description:
          "Understand the impact of professional engineering solutions in societal and environmental contexts and demonstrate knowledge of, and need for, sustainable development.",
      },
      {
        code: "PO8",
        title: "Ethics",
        description:
          "Apply ethical principles and commit to professional ethics, responsibilities and norms of engineering practice.",
      },
      {
        code: "PO9",
        title: "Individual and Team Work",
        description:
          "Function effectively as an individual, and as a member or leader in diverse teams and in multidisciplinary settings.",
      },
      {
        code: "PO10",
        title: "Communication",
        description:
          "Communicate effectively on complex engineering activities with the engineering community and society, including writing effective reports, design documentation and giving clear presentations.",
      },
      {
        code: "PO11",
        title: "Project Management and Finance",
        description:
          "Demonstrate knowledge and understanding of engineering and management principles and apply these to one's own work as a member and leader in a team, to manage projects in multidisciplinary environments.",
      },
      {
        code: "PO12",
        title: "Life-long Learning",
        description:
          "Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.",
      },
      {
        code: "PSO1",
        title: "Electrical Systems Design",
        description:
          "Develop electrical and electronic systems by applying knowledge of machines, circuits, control systems, and embedded technologies to solve real-world engineering challenges.",
      },
      {
        code: "PSO2",
        title: "Innovation in Energy",
        description:
          "Engage in problem-solving and innovation in areas such as electric vehicles, renewable energy systems, and embedded technologies, aligning with current and future industry trends.",
      },
    ],

    // ── Overview: DAC/PAC — Department Advisory Board (real roster) ───────────
    advisoryBoard: [
      {
        name: "Dr. S. Manoharan",
        designation: "Principal",
        organization: "JCT College of Engineering and Technology, Coimbatore",
        role: "Member",
      },
      {
        name: "Mr. A. Chandrahassan",
        designation: "Administrative Officer",
        organization: "JCT Group of Institutions, Coimbatore",
        role: "Member",
      },
      {
        name: "Dr. B. Balraj",
        designation: "Dean/Academics, Professor and Head/EEE",
        organization: "JCT College of Engineering and Technology, Coimbatore",
        role: "HOD",
      },
      {
        name: "Dr. P. Maruthupandi",
        designation: "Associate Professor/EEE",
        organization: "Government College of Technology, Coimbatore",
        role: "Senior Academician",
      },
      {
        name: "Dr. Shriram K V",
        designation:
          "Lead – Technology Evangelist, Asia Pacific and Japan Region",
        organization: "Intel India Pvt. Limited, Bengaluru",
        role: "Industry Expert",
      },
      {
        name: "Ms. V. Anjana Sree",
        designation: "Alumni, Assistant Engineer",
        organization: "Kerala State Electricity Board Limited, Palakkad",
        role: "Alumni Representative",
      },
    ],
    // PAC (Program Assessment Committee) — TODO: department to supply roster.
    pac: [],
    // Board of Studies (BOS) — TODO: department to supply roster.
    bos: [],

    // ── Academic: Curriculum and Syllabus (R2024 / R2021 / R2017) ─────────────
    // Regulation containers created so the admin curriculum editor has a
    // place to add semesters/subjects; no syllabus data supplied yet.
    curriculum: [
      { regulationName: "R2024", semesters: [] },
      { regulationName: "R2021", semesters: [] },
      { regulationName: "R2017", semesters: [] },
    ],

    // ── People: Faculty List with IRINS Link ───────────────────────────────────
    // irinsUrl left blank — TODO: department to supply each faculty
    // member's IRINS profile URL. Extra field, stored but not yet rendered
    // by the faculty section UI.
    faculty: [
      {
        name: "Manoharan Subramanian",
        designation: "Professor",
        qualification: "Ph.D",
        experience: "18+ Years",
        specialization: "Electrical Machines",
        irinsUrl: "",
      },
      {
        name: "Balraj Baskaran",
        designation: "Professor",
        qualification: "Ph.D",
        experience: "16+ Years",
        specialization: "Instrumentation Engineering",
        irinsUrl: "",
      },
      {
        name: "S. Karthikumar",
        designation: "Professor",
        qualification: "Ph.D",
        experience: "15+ Years",
        specialization: "Applied Electronics",
        irinsUrl: "",
      },
      {
        name: "Vimalraj Shanmugam",
        designation: "Professor",
        qualification: "Ph.D",
        experience: "14+ Years",
        specialization: "Applied Electronics",
        irinsUrl: "",
      },
      {
        name: "Ganesh Ramanathan Meenashi",
        designation: "Associate Professor",
        qualification: "Ph.D",
        experience: "12+ Years",
        specialization: "Control and Instrumentation Engineering",
        irinsUrl: "",
      },
      {
        name: "Saravanan Masakkalipalayam",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "7+ Years",
        specialization: "Power Electronics and Drives",
        irinsUrl: "",
      },
      {
        name: "Nagarajan Duraisamy",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "7+ Years",
        specialization: "Power Electronics and Drives",
        irinsUrl: "",
      },
      {
        name: "Gowtham Srinivasan Balakrishnan",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "6+ Years",
        specialization: "Power Electronics and Drives",
        irinsUrl: "",
      },
      {
        name: "Satheesh Ramalingam",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "6+ Years",
        specialization: "Power Electronics and Drives",
        irinsUrl: "",
      },
      {
        name: "Shobana Selvaraj",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "6+ Years",
        specialization: "Power System Engineering",
        irinsUrl: "",
      },
      {
        name: "Dhamodharan Shanmugam",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "5+ Years",
        specialization: "Power Electronics and Drives",
        irinsUrl: "",
      },
      {
        name: "Shanthi Madasamy",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "5+ Years",
        specialization: "Control and Instrumentation Engineering",
        irinsUrl: "",
      },
      {
        name: "Ramya Peramiyagounder",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "5+ Years",
        specialization: "Power Electronics and Drives",
        irinsUrl: "",
      },
      {
        name: "Saravanan Vasudevan",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "5+ Years",
        specialization: "Power Electronics and Drives",
        irinsUrl: "",
      },
      {
        name: "Greeshma Chamakkad Sivanandan",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "4+ Years",
        specialization: "VLSI Design",
        irinsUrl: "",
      },
    ],

    // ── Facility: Laboratory ────────────────────────────────────────────────────
    labs: [
      {
        name: "Electric Circuits Lab",
        description:
          "Equipped for fundamental circuit analysis, AC/DC circuit experiments.",
        equipment: [],
      },
      {
        name: "Electronics Devices and Circuits Lab",
        description:
          "Facilities for semiconductor device characterization and amplifier circuits.",
        equipment: [],
      },
      {
        name: "Engineering Practice Lab",
        description:
          "Practical training in basic electrical engineering and safety.",
        equipment: [],
      },
      {
        name: "Power Electronics Lab",
        description:
          "Equipped with converters, inverters, and power semiconductor devices.",
        equipment: [],
      },
      {
        name: "Power System Simulation Lab",
        description:
          "Simulation software for power system analysis and load flow studies.",
        equipment: [],
      },
      {
        name: "Electrical Machines Lab",
        description:
          "Equipped with DC and AC motors, generators, and transformers for testing.",
        equipment: [],
      },
      {
        name: "Measurement and Instrumentation Lab",
        description:
          "Instruments for measuring electrical quantities and calibration.",
        equipment: [],
      },
      {
        name: "Control Systems Lab",
        description:
          "Facilities for closed-loop and open-loop control system experiments.",
        equipment: [],
      },
      {
        name: "Electronics Design Lab",
        description: "Advanced lab for circuit design and PCB prototyping.",
        equipment: [],
      },
      {
        name: "Electric Drives and Control Lab",
        description:
          "Equipped with motor drives and control systems for EV applications.",
        equipment: [],
      },
    ],

    // ── Facility: Department Library — TODO: department to supply counts ──────
    library: {
      books: 0,
      journals: 0,
      magazines: 0,
      digitalAccess: [],
      description: "",
    },

    // ── Innovations in TLP (Teaching Learning Process) — TODO ──────────────────
    teachingLearning: { overview: "", methods: [], tools: [], practices: [] },

    valueAddedCourses: [],

    // ── Events — TODO: department to supply event history ─────────────────────
    events: [],

    // ── Societies and Chapters (IEEE / IGEN / ISTE) — chapter names only;
    // per-chapter activity detail staged under departmentPage below.
    studentParticipation: {
      clubs: ["IEEE Student Chapter", "IGEN", "ISTE Student Chapter"],
      highlights: [],
    },

    // ── Awards and Achievement: Students / Faculty — TODO ──────────────────────
    studentAchievements: [],
    facultyAchievements: [],
    facultyParticipation: { conferences: [], workshops: [] },

    // ── Placement ───────────────────────────────────────────────────────────────
    careerProgression: {
      topRecruiters: [
        "ONGC",
        "BHEL",
        "SAIL",
        "GAIL",
        "Siemens",
        "BEL",
        "ISRO",
        "DRDO",
        "TNEB",
        "Steel Authority of India",
      ],
      higherStudies: [
        "M.E. / M.Tech in Power Electronics / Electrical Engineering",
        "MBA",
        "GATE Qualified – IITs and NITs",
        "Ph.D Research Programs",
        "MS Abroad",
      ],
      averagePackage: "3.5 LPA",
      placementRate: "88%",
    },

    feedback: {
      curriculumProcess: [],
      facilityProcess: [],
      recentImprovements: [],
    },

    // ── Newsletter / Magazine — TODO: department to supply issue details ──────
    magazine: {
      name: "",
      description: "",
      frequency: "",
      latestIssue: "",
      highlights: [],
    },

    heroMeta: [
      { icon: "Calendar", label: "Established", value: "2010" },
      { icon: "Users", label: "Intake", value: "60 Students" },
      { icon: "GraduationCap", label: "Affiliation", value: "Anna University" },
      { icon: "Clock", label: "Duration", value: "4 Years" },
      { icon: "Award", label: "Accreditation", value: "AICTE" },
      { icon: "Briefcase", label: "Placement Rate", value: "88%" },
    ],

    // ── Staged sections without a ProgramData home yet ─────────────────────────
    // Not rendered by the public site until ProgramData / normalize-program-
    // data.ts / ProgramPageLayout add matching sections. Kept nested here so
    // they don't collide with real field names added later.
    departmentPage: {
      // Overview: Highlights / Scope — paraphrased from about1-3 above, not
      // fabricated.
      highlightsScope: [
        "Established in 2010, offering a UG programme in Electrical and Electronics Engineering (intake 60) and a PG programme in Power Electronics and Drives (intake 18, running since 2012).",
        "Core strengths in electrical machines, power electronics, drives and control systems, with an emerging research focus on electric vehicles and renewable energy.",
        "Regular technical workshops, guest lectures and industrial visits keep students current with emerging trends in electrical and electronics engineering.",
        "Graduates recruited across the power and electronics sector, including ONGC, Steel Authority of India, thermal/hydro/atomic power plants, HCL, HPCL, DRDO, ISRO, Railways, BSNL, Siemens, BEL, BHEL, SAIL and GAIL.",
      ],
      // Academic: Programmes Offered — derived from the department's known
      // sibling program records (slugs: eee, power-electronics, eee-doctoral).
      programmesOffered: [
        {
          name: "B.E. Electrical and Electronics Engineering",
          level: "UG",
          degree: "B.E.",
          slug: "eee",
          intake: 60,
        },
      ],
      // Facility: Class Rooms / Centre of Excellence — TODO
      facility: {
        classRooms: [],
        centerOfExcellence: [],
      },
      // SDG Implementation — TODO
      sdgImplementation: [],
      // Research: Academic Research / Industrial Consultancy / IPR / MoU — TODO
      research: {
        academicResearch: [],
        industrialConsultancy: [],
        ipr: [],
        mouSigned: [],
      },
      // Societies and Chapters — chapter names already in
      // studentParticipation.clubs above; per-chapter detail TODO.
      societiesAndChapters: {
        ieee: { description: "", activities: [] },
        igen: { description: "", activities: [] },
        iste: { description: "", activities: [] },
      },
    },
  },
};

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nEEE Dept Content Seed — ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`Target slug: ${PROGRAM.slug}\n`);

  if (DRY_RUN) {
    console.log("Dry-run mode: no changes will be written to the database.");
    console.log("Re-run without --dry-run to apply.\n");
    console.log(
      `  • ${PROGRAM.name} (slug: ${PROGRAM.slug}, degree: ${PROGRAM.degree}, seats: ${PROGRAM.seats})`,
    );
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: undefined });
    const col = mongoose.connection.db.collection("programs");
    const now = new Date();

    // Destructure to keep image out of the update payload entirely
    const { slug, content, ...cardFields } = PROGRAM;

    const result = await col.updateOne(
      { slug },
      {
        $set: {
          name: cardFields.name,
          abbr: cardFields.abbr,
          institution: cardFields.institution,
          degree: cardFields.degree,
          duration: cardFields.duration,
          seats: cardFields.seats,
          highlight: cardFields.highlight,
          description: cardFields.description,
          outcomes: cardFields.outcomes,
          is_active: cardFields.is_active,
          sort_order: cardFields.sort_order,
          content,
          published_content: content,
          status: "published",
          published_at: now,
          updated_at: now,
        },
        $setOnInsert: {
          // Only written when creating a NEW document — never overwrites image
          image: "",
          version: 1,
          created_at: now,
          slug,
        },
      },
      { upsert: true },
    );

    if (result.upsertedCount > 0) {
      console.log(`✦ Created: ${PROGRAM.name} (slug: ${slug})`);
    } else if (result.modifiedCount > 0) {
      console.log(`✓ Updated: ${PROGRAM.name} (slug: ${slug})`);
    } else {
      console.log(`— No change: ${PROGRAM.name} (slug: ${slug})`);
    }

    console.log("\nDone.");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
