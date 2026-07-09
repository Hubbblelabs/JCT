#!/usr/bin/env node
/**
 * Usage:
 *   MONGODB_URI="..." node scripts/seed-deptcontent-eee.mjs
 *   node scripts/seed-deptcontent-eee.mjs          # reads .env automatically
 *   node scripts/seed-deptcontent-eee.mjs --dry-run
 *
 * Seeds the Electrical and Electronics Engineering department page content
 * (slug: "eee", institution: "engineering") per the department's requested
 * page structure. The LEFT SIDEBAR (content.tabsConfig) carries exactly the
 * department's twelve top-level entries; every sub-item renders inside its
 * entry's content area:
 *
 *   Overview               — About, Vision/Mission, PEO/PO/PSOs,
 *                             Highlights/Scope, Board of Studies, DAC/PAC
 *   Academic               — Programmes Offered, Curriculum & Syllabus
 *                             (R2024/R2021/R2017)
 *   People                 — HoD Desk, Faculty List with IRINS Link
 *   Facility               — Class Rooms, Laboratory, Centre of Excellence,
 *                             Department Library
 *   Awards & Achievements  — Faculty, Students
 *   Innovations in TLP
 *   Placement
 *   SDG Implementation
 *   Research               — Academic Research, Industrial Consultancy, IPR,
 *                             MoU Signed
 *   Societies & Chapters   — IEEE, IGEN, ISTE
 *   Events
 *   Newsletter / Magazine
 *
 * How the sidebar is realised (all editable in the admin content builder):
 *   - content.tabsConfig lists the 12 sidebar entries in the department's
 *     order (LIMITS.sidebarTabsMax is 12 — exactly at the cap). Built-in
 *     tabs are relabelled (academics → "Academic", faculty → "People",
 *     facilities → "Facility", career → "Placement", life → "Events");
 *     the other six are custom content tabs whose `blocks`
 *     (PageBodySection[]) are the tab's page content.
 *   - content.labels hides/renames built-in sections so each sub-item sits
 *     under the sidebar entry the department asked for: HoD's Desk moves
 *     from Overview to People, DAC moves from People to Overview,
 *     Innovations in TLP leaves Academic for its own tab, and the Life tab
 *     is reduced to Events only.
 *   - content.sectionBlocks / content.sectionBlocksPosition attach extra
 *     blocks to built-in sections: Highlights & Scope + DAC after Programme
 *     Outcomes (Overview), Programmes Offered at the top of Academic,
 *     HoD's Desk at the top of People.
 *   - Custom tabs seeded with no blocks yet (Awards & Achievements, SDG
 *     Implementation, Newsletter / Magazine) are auto-hidden on the public
 *     site until the department adds blocks in the admin builder — same
 *     "nothing fabricated" rule as the empty structured fields.
 *
 * Source of truth:
 *   All real content below was fetched from the crawled site backup at
 *   D:\projects\jct-backup — specifically:
 *     text/engineering__courses__ug-courses__electrical-and-electronics-engineering.txt
 *       (about, vision/mission, PEO/PO/PSO, faculty roster, Department
 *       Advisory Committee, laboratory list, TLP innovations, value-added
 *       courses, full "Events Organized" history 2015–2025, and the
 *       placed-students table used to derive Top Recruiters)
 *     text/engineering__news-event__department-of-electrical-and-electronics-engineering-signed-memorandum-of-understanding-mou-with-pumo-technovation-india-private-limited-coimbatore-on-19th-april-2023.txt
 *     text/engineering__news-event__department-of-electrical-and-electronics-engineering-signed-memorandum-of-understanding-mou-with-srs-solar-systems-coimbatore-on-15th-march-2023.txt
 *     text/engineering__news-event__department-of-electrical-and-electronics-engineering-signed-mou-with-ipcs-global-solutions-pvt-ltd.txt
 *       (the three real MoUs rendered on the Research tab)
 *   Event dates/resource-person names are transcribed verbatim from the
 *   source tables, including the source's own inconsistencies (mixed date
 *   formats, an occasional duplicate row) — nothing here is fabricated.
 *
 * Mapping notes:
 *   - Fields that exist on the current ProgramData shape (src/types/program.ts)
 *     are populated directly (about, hod, visionMission, programOutcomes,
 *     advisoryBoard, pac, bos, curriculum, teachingLearning, faculty, labs,
 *     library, events, studentParticipation, achievements, careerProgression,
 *     magazine, heroMeta) so they render immediately through the existing
 *     ProgramPageLayout / normalizeProgramData pipeline.
 *   - Sections the older seed staged under content.departmentPage.* now have
 *     a real rendering home (custom tabs + sectionBlocks), so that staging
 *     area is gone: highlightsScope → Overview blocks, programmesOffered →
 *     Academic blocks, mouSigned → Research tab, societies → Societies &
 *     Chapters tab. Data duplicated from structured fields into blocks
 *     (DAC roster, HoD desk, TLP methods) keeps the structured field as the
 *     raw record; edit the BLOCKS to change what visitors see.
 *   - Fields with genuinely no source data anywhere in the backup (Board of
 *     Studies members, PAC roster, IPR filings / academic research /
 *     consultancy items, SDG activities, IEEE/IGEN/ISTE chapter details,
 *     IRINS profile URLs, library counts, class-room inventory, Centre of
 *     Excellence list, student/faculty achievements, newsletter issues,
 *     curriculum syllabi, and an overall placement rate / average package
 *     specific to EEE) are left as empty placeholders for the department to
 *     fill in via the admin content builder — nothing here is fabricated.
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
    // Raw record. Hidden on the Overview tab (labels.overview.hod) and shown
    // on the People tab instead via sectionBlocks.faculty below — edit those
    // blocks to change the public rendering.
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
    // Raw record. Hidden on the People tab (labels.faculty.advisoryBoard) and
    // rendered on the Overview tab instead via sectionBlocks.programOutcomes
    // below, per the department's requested structure.
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
      {
        name: "Mr. R. Pakkirisamy",
        designation: "Parent",
        organization: "F/O Mr. Dinesh Babu P (2014 Passed Out), AE, TNEB",
        role: "Parent Representative",
      },
      {
        name: "Mr. D. Nagarajan",
        designation: "Assistant Professor/EEE",
        organization: "JCT College of Engineering and Technology, Coimbatore",
        role: "Senior Faculty",
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

    // ── Innovations in TLP (Teaching Learning Process) — from the department's
    // "Innovations by the Faculty in Teaching and Learning" list.
    // Raw record. Hidden on the Academic tab (labels.academics.teachingLearning)
    // and rendered on the dedicated "Innovations in TLP" sidebar tab below.
    teachingLearning: {
      overview: "",
      methods: [
        "Blog Spot",
        "Chart Presentation",
        "ERP",
        "Expert Talk",
        "Flipped Classroom",
        "Google Classroom",
        "Peer Group Learning",
        "Project Based Learning Methodology",
        "Quiz by Google Form",
        "Quiz by Quizizz",
      ],
      tools: [],
      practices: [],
    },

    // Value Added Courses — names only; hours/provider/description not
    // published on the source page, left blank for the department to fill in.
    valueAddedCourses: [
      { name: "Auto CAD Electrical", hours: "", provider: "", description: "" },
      { name: "Embedded System", hours: "", provider: "", description: "" },
      { name: "P-SPICE", hours: "", provider: "", description: "" },
      {
        name: "Computer Hardware and Networking (CCNA)",
        hours: "",
        provider: "",
        description: "",
      },
      {
        name: "Low Power VLSI with Lifting Algorithm",
        hours: "",
        provider: "",
        description: "",
      },
    ],

    // ── Events — full "Department Events" history from the department's
    // published page (2015–2025), parsed from the crawled backup. Dates and
    // resource-person names are transcribed verbatim, including occasional
    // inconsistencies in the source (e.g. duplicate S.No., mixed date
    // formats) — nothing here is fabricated.
    events: [
      {
        title: "Springer International Conference on Artificial Intelligence and Smart Energy",
        date: "30.01.2025 to 31.01.2025",
        type: "International Conference",
        description: "",
        resourcePerson: "Dr. P. Santhosh University of Cagliari, Italy",
      },
      {
        title: "Microcontroller Based Sensor Integration for IoT",
        date: "10.02.2025",
        type: "Seminar",
        description: "",
        resourcePerson: "Dr. K. Bagyalakshmi, SKCT, Coimbatore",
      },
      {
        title: "Opportunities in Electrical Engineering",
        date: "24.04.2025",
        type: "Awareness Programme",
        description: "",
        resourcePerson: "Mr. E. Sivashankar, Jazal Engineering, UAE",
      },
      {
        title: "Wireless Charging Technology in Electric Vehicle",
        date: "31.05.2025",
        type: "Seminar",
        description: "",
        resourcePerson: "Mr. C. Karthik PumoTechnovations, Coimbatore",
      },
      {
        title: "AICTE Sponsored International Conference on Recent Advances in Electrical Science and Technology",
        date: "11.08.2025 to 13.08.2025",
        type: "International Conference",
        description: "",
        resourcePerson: "Dr. P. Santhosh University of Cagliari, Italy Dr. M.A. Asha Rani NIT, Silchar",
      },
      {
        title: "IEEE International Conference on Intelligent Cyber Physical Systems and Internet of Things",
        date: "17.09.2025 to 19.09.2025",
        type: "International Conference",
        description: "",
        resourcePerson: "Dr.ArnasMajumder University of Cagliari, Italy",
      },
      {
        title: "Unreach the Reach – Space Technology",
        date: "14.10.2025",
        type: "Seminar",
        description: "",
        resourcePerson: "Dr. D. Gokul, ISRO, Bangalore",
      },
      {
        title: "Future EV Skill and Placement Requirement",
        date: "15.10.2025",
        type: "Awareness Programme",
        description: "",
        resourcePerson: "Mr. K. Kathirvel, Valeo, Chennai",
      },
      {
        title: "Innovatex",
        date: "24.11.2025 to 25.11.2025",
        type: "Contest",
        description: "",
        resourcePerson: "Dr. B. Balraj, JCTCET, Coimbatore",
      },
      {
        title: "Campus Energy Audit Drive on National Energy Conservation Day",
        date: "19.12.2025",
        type: "Hands-On",
        description: "",
        resourcePerson: "Dr. S. Manoharan, JCTCET, Coimbatore",
      },
      {
        title: "Alumni meet",
        date: "20.01.2024",
        type: "Alumni meet",
        description: "",
        resourcePerson: "Dr.K.Geetha, Dean/Academics, HOD/EEE, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Tenth graduation day",
        date: "20.01.2024",
        type: "Tenth graduation day",
        description: "",
        resourcePerson: "Dr.N.V.SNarasimhasarma, Director IIIT Trichy",
      },
      {
        title: "Vazhikatti",
        date: "09.02.2024",
        type: "Motivational Program",
        description: "",
        resourcePerson: "Mr.Harikrishan N, Head, Social Initiatives, IIT Madras BS Degree",
      },
      {
        title: "Ariviyalai Kondaduvom",
        date: "29.02.2024",
        type: "National Science Day Celebration",
        description: "",
        resourcePerson: "Dr.K.Geetha, Dean/Academics, HOD/EEE, JCT College of Engineering and Technology, Coimbatore",
      },
      {
        title: "Voting Campaign",
        date: "06.03.2024",
        type: "Voting Campaign",
        description: "",
        resourcePerson: "Dr.P.Lakshmana Kumar, NSS Programme Officer",
      },
      {
        title: "INTERNATIONAL WOMEN’S DAY CELEBRATION",
        date: "08.03.2024",
        type: "Celebration",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Campus Cleaning Program",
        date: "16.03.2024",
        type: "Campus Cleaning Program",
        description: "",
        resourcePerson: "Dr.P.Lakshmana Kumar, NSS Programme Officer",
      },
      {
        title: "ARTIFICIAL INTELLIGENCE AND SMART ENERGY” (ICAIS – 2024)",
        date: "22nd/,23 .03.2024",
        type: "INTERNATIONAL CONFERENCE",
        description: "",
        resourcePerson: "Dr.AlexandruTutugi, AL.I.CUZA,Romania",
      },
      {
        title: "Awareness program on voting",
        date: "27.03.2024",
        type: "Awareness program",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Jfinagles",
        date: "03.04.2024",
        type: "Symposium",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Idea Generation to Business Launch",
        date: "23.04.2024",
        type: "Seminar",
        description: "",
        resourcePerson: "Dr.M.Reshma, Assistant Professor, Department of Management, GRG School of Management Studies, PSGR Krishnammal college for Women, Coimbatore",
      },
      {
        title: "Technological Advancements in Science, Engineering and Management (ICTASEM -24)",
        date: "26.04.2024 & 27.04.2024",
        type: "International Conference",
        description: "",
        resourcePerson: "Er.R.Rajadurai, President, COZCENA",
      },
      {
        title: "PROJECT EXPO 2K24",
        date: "08.05.2024 &09.05.2024",
        type: "PROJECT EXPO 2K24",
        description: "",
        resourcePerson: "Principal, Dean/ Academics, IQAC Director and all Head of the Department reviewed the Demo presentation",
      },
      {
        title: "Mega Passport Service Camp",
        date: "17.05.2024 & 18.05.2024",
        type: "Passport Camp",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Tools and Techniques to Enhance Effective Research in AI Era",
        date: "28.05.2024",
        type: "International Seminar",
        description: "",
        resourcePerson: "Dr.SanthoshParamasivam, University of Cagliari, Cagliari, Italy",
      },
      {
        title: "Innovative Curriculum Design and Implementation",
        date: "01.06.2024",
        type: "Workshop",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Drugs awareness",
        date: "24.06.2024",
        type: "Awareness programme",
        description: "",
        resourcePerson: "Mr.Kumerasen , Sub inspector of police, K G Chavady , Coimbatore",
      },
      {
        title: "கார்கில் வெற்றிதினவிழா",
        date: "26.7.2024",
        type: "Celebration",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "National Education Policy",
        date: "29.7.2024",
        type: "Anniversary",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Electric Vehicle Charging System",
        date: "01.08.24",
        type: "Alumni talk",
        description: "",
        resourcePerson: "Er.A.Arun, Batch (2021-2023), Maintenance Engineer (Electrical), M/S.Emirates National Oil Company LLC (ENOC), Dubai",
      },
      {
        title: "Intelligent Cyber Physical Systems and Internet Of Things (ICOICI 2024)",
        date: "30.08..2024",
        type: "International Conference",
        description: "",
        resourcePerson: "DrArnasMajumder, Professor, Environmental and Architectural Engineering, University of Cagliari, Sardinia, Italy",
      },
      {
        title: "Association Inauguration",
        date: "02.09.2024",
        type: "Inauguration",
        description: "",
        resourcePerson: "Dr. Jaya Jacob and Mr.Aby Sam John",
      },
      {
        title: "JCT IAS Academy",
        date: "18.09.2024",
        type: "Inauguration",
        description: "",
        resourcePerson: "Mr. V. Nandakumar, IRS, Commissioner of Income Tax",
      },
      {
        title: "JCT Aarunya 2024",
        date: "18.9.2024",
        type: "Inauguration",
        description: "",
        resourcePerson: "Mr.V.NANDHAKUMAR,IRSanCommisioner of Income Tax, Department of Revenue, Ministry of Finance, Government of India",
      },
      {
        title: "JCT IAS Academy",
        date: "September 18,2024",
        type: "Inauguration",
        description: "",
        resourcePerson: "Mr. V. Nandakumar, IRS, Commissioner of Income Tax",
      },
      {
        title: "Artificial Intelligence and Machine Learning",
        date: "20.09.2024",
        type: "Guest lecture",
        description: "",
        resourcePerson: "Dr. N. AmeenaBibi, Associate Professor and Head of Department (In Charge) at Government College of Engineering, Dharmapuri",
      },
      {
        title: "International Day of Peace",
        date: "21.09.2024",
        type: "Celebration",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Mega Job Fair 2024",
        date: "05.10.2024",
        type: "Mega Job Fair 2024",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Principal, JCT College of Engineering and Technology, Coimbatore.",
      },
      {
        title: "Challenges and Opportunities in Scaling Renewable Energy for Electric vehicles",
        date: "16.10.2024",
        type: "Seminar",
        description: "",
        resourcePerson: "Dr.D.Magdalin Mary, Assistant Professor at Sri Krishna College of Technology, Coimbatore",
      },
      {
        title: "Mastering Arduino simulation with tinker CAD",
        date: "17.10.2024",
        type: "Hands on training",
        description: "",
        resourcePerson: "Dr.M.Kavitha, Associate Professor, Department of Electrical and Electronics Engineering, Sathyabama Institute of Science and Technology, Chennai",
      },
      {
        title: "Opportunities in automotive’s embedded systems",
        date: "26.10.2024",
        type: "Career Guidance Program",
        description: "",
        resourcePerson: "Er.P.M.Prabakaran, Associate Technical Architect, Jaguar Land Rover, Gayon, U K",
      },
      {
        title: "Graduation day",
        date: "23.11.24",
        type: "Graduation day",
        description: "",
        resourcePerson: "Prof AmiyakumarRath Honourable vice chancellor, BijuPatnaik University",
      },
      {
        title: "Research Recognition Day",
        date: "23.11.24",
        type: "Research Recognition Day",
        description: "",
        resourcePerson: "Prof. Amiya Kumar Rath Honourable Vice Chancellor, BijuPatnaik University of Technology, Odisha",
      },
      {
        title: "Energy Efficient Electrical Machines",
        date: "14.12.2024",
        type: "Seminar",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Professor and Principal, JCT College of Engineering and Technology, Coimbatore",
      },
      {
        title: "Christmas day celebration",
        date: "23.12.2024",
        type: "Celebration",
        description: "",
        resourcePerson: "Dr.S.Manoharan, Proncipal, JCT College of Engineering & Technology, COimbatore",
      },
      {
        title: "Innovation & Entrepreneurship Outreach Program in Schools / Community",
        date: "17.07.2023",
        type: "Entrepreneurship",
        description: "",
        resourcePerson: "Dr.K.Geetha, Head of Department, Electrical and Electronics Engineering",
      },
      {
        title: "Recent trends and challenges in power generation and power quality improvement techniques",
        date: "17.07.2023-21.07.2023",
        type: "Five days online Faculty Development programme",
        description: "",
        resourcePerson: "1. Er.V.S.Sriraja Balaguru, Assistant Engineer, Electrical Control and instrumentation Division, MTPS -II 2. Mr.M.Vijaya Kumar, Assistant Engineer, Operation and Efficiency, MTPS-I",
      },
      {
        title: "Technical quiz for third Year Students",
        date: "12.08.2023",
        type: "Technical quiz program",
        description: "",
        resourcePerson: "Dr.K.Geetha, Head of Department, Electrical and E;lectronics Engineering",
      },
      {
        title: "Independence Day",
        date: "15.08.23",
        type: "Celebration",
        description: "",
        resourcePerson: "Dr.S.Manoharan",
      },
      {
        title: "“International Opportunities for Higher Education”",
        date: "21.08.2023",
        type: "Webinar",
        description: "",
        resourcePerson: "Mr.Srinivas Sambandam, Managing Director, Galaxy Educational Consultants, Coimbatore.",
      },
      {
        title: "I year Inaugural",
        date: "11.9.2023",
        type: "I year Inaugural",
        description: "",
        resourcePerson: "Solvendhar Sukisivam",
      },
      {
        title: "Introduction to Cyber Security- The Smart Power Metering Systems",
        date: "24.08.2023",
        type: "Webinar",
        description: "",
        resourcePerson: "Mr.K.Manoj Prabhakar, hardware Security Researcher, Thrissur, Kerala",
      },
      {
        title: "Design Thinking & Innovation",
        date: "15.09.2023",
        type: "Webinar",
        description: "",
        resourcePerson: "Dr.Marsaline Beno, Dean Research & Professor/EEE, St Xavier’s Catholic College of Engineering, Kanyakumari",
      },
      {
        title: "Talent Hunt",
        date: "26.9.2023 -27.9.2023",
        type: "Talent Hunt",
        description: "",
        resourcePerson: "Dr.S.Manoharan",
      },
      {
        title: "Budding Women Engineers",
        date: "14.10.2023",
        type: "Special program",
        description: "",
        resourcePerson: "Mrs. Anush Miria",
      },
      {
        title: "Ongrid PV Solar System by Alumni",
        date: "03.11.2023",
        type: "Webinar",
        description: "",
        resourcePerson: "Mr.A.Arun,MaintenanceEngineer (Electrical), Emirates National Oil Company LLC (ENOC), Dubai",
      },
      {
        title: "Promoting Safety for Women",
        date: "06.11.2023",
        type: "Webinar",
        description: "",
        resourcePerson: "Mrs.J.JAFLA",
      },
      {
        title: "An Awareness Program on Karate",
        date: "8.11.2023",
        type: "Women Empowerment Cell",
        description: "",
        resourcePerson: "Renshi Alex David",
      },
      {
        title: "National Education Day",
        date: "09.11.2023",
        type: "National educational day celebration",
        description: "",
        resourcePerson: "Dr.T.Lawrence, Deputy Tahsildar ,MadukkaraiTaluk, Coimbatore",
      },
      {
        title: "Internal Hackathon",
        date: "18.11.2023",
        type: "Hackathon",
        description: "",
        resourcePerson: "Dr. T. Justin Jose",
      },
      {
        title: "Dr.APJ Abdul Kalam Satellite Launch Vehicle Mission 2023",
        date: "19.11.2023",
        type: "Hands on training",
        description: "",
        resourcePerson: "Mr.Nalin, Trainee from Space Zone India",
      },
      {
        title: "Design Thinking & Innovation",
        date: "22.11.2023",
        type: "Seminar",
        description: "",
        resourcePerson: "Dr.M.Siva Ramkumar, IIC Innovation Ambassador,Assistant Professor- EEE,Karpagam college of Higher Education, Coimbatore",
      },
      {
        title: "Exposure and field visit for Problem Identification",
        date: "23.11.2023",
        type: "Field visit",
        description: "",
        resourcePerson: "Mr.M.Sadhasivam",
      },
      {
        title: "My Story – Motivational Session by Successful Innovators",
        date: "28.11.2023",
        type: "Seminar",
        description: "",
        resourcePerson: "Mr.Shanmuga Bhuvaneshwar",
      },
      {
        title: "Session on Problem Solving and Ideation Workshop",
        date: "28.11.2023",
        type: "Workshop",
        description: "",
        resourcePerson: "Dr.T.Justin Jose",
      },
      {
        title: "Interaction with an innovator for start-up",
        date: "30.11.2023",
        type: "Webinar",
        description: "",
        resourcePerson: "Dr.Refana shahul",
      },
      {
        title: "National Pollution Control Day",
        date: "2.12.2023",
        type: "Pledge",
        description: "",
        resourcePerson: "Dr.V.Murugesh",
      },
      {
        title: "IGEN ENSAVCON 713",
        date: "14/05/2022",
        type: "Conference",
        description: "",
        resourcePerson: "Dept. of EEE",
      },
      {
        title: "Opportunities of higher Education for Electrical engineers in Overseas",
        date: "23/05/2022",
        type: "Webinar",
        description: "",
        resourcePerson: "Mr.Shibily Rahiman Ulladasseri, Warsaw University of Technology,Poland",
      },
      {
        title: "Embedded System Application Development Program for Absolute Beginners",
        date: "3/7/2022",
        type: "Inaugural function of Association of ECE and EEE",
        description: "",
        resourcePerson: "Dept. of EEE",
      },
      {
        title: "Women Entrepreneurship -Problems with Solutions",
        date: "03.09.2022",
        type: "Webinar",
        description: "",
        resourcePerson: "Mrs.S.Barathi, M.E (CAD/CAM), Manager (Technical), Central Institute of Petrochemical Engineering and Technology (CIPET), Mysuru.",
      },
      {
        title: "Onam Aaramb",
        date: "05.09.2022",
        type: "Onam Celebration",
        description: "",
        resourcePerson: "Dr.S.Manoharan",
      },
      {
        title: "Teachers Day Celebration 2022",
        date: "15.09.2022",
        type: "Celebration",
        description: "",
        resourcePerson: "Dr.P.Surya Narayanan (PHD English), Coimbatore.",
      },
      {
        title: "Department of Electrical and Electronics Engineering signed MOU with IPCS Global Solutions Pvt Ltd",
        date: "08/03/2022",
        type: "MoU",
        description: "",
        resourcePerson: "Mr.Jomesh Jose IPCS Global Solutions regional manager",
      },
      {
        title: "Flex-E:Other dimension of Electronics",
        date: "10.06.2020",
        type: "Webinar",
        description: "",
        resourcePerson: "Ms.Sangeetha Veerachi, AP(Sr.G),SREC",
      },
      {
        title: "Embedded System Application Development Program for Absolute Beginners",
        date: "15.06.2020",
        type: "Webinar",
        description: "",
        resourcePerson: "Mr.Boobalan T, Master Trainer FSIPD, IoT and Embedded Specialist (Certified from Texas Instruments)",
      },
      {
        title: "World Environment Day Celebration",
        date: "05.06.2020",
        type: "Quiz",
        description: "",
        resourcePerson: "Department of EEE",
      },
      {
        title: "Sparks 2020",
        date: "19/02/2020",
        type: "Association Inaugral",
        description: "",
        resourcePerson: "Mr.R.Arun Prakash, COE Lead – EAS IPM EDM Practice, Cognizant.",
      },
      {
        title: "Electrical Machines",
        date: "25.05.2020",
        type: "Quiz",
        description: "",
        resourcePerson: "Department of EEE",
      },
      {
        title: "Power Systems",
        date: "26.05.2020",
        type: "Quiz",
        description: "",
        resourcePerson: "Department of EEE",
      },
      {
        title: "Electric Circuits and Field",
        date: "27.05.2020",
        type: "Quiz",
        description: "",
        resourcePerson: "Department of EEE",
      },
      {
        title: "Control System",
        date: "28.05.2020",
        type: "Quiz",
        description: "",
        resourcePerson: "Department of EEE",
      },
      {
        title: "Analog Electronics",
        date: "29.05.2020",
        type: "Quiz",
        description: "",
        resourcePerson: "Department of EEE",
      },
      {
        title: "Development of Renewable Energy Sources for Rural Electrification",
        date: "19.11.2018",
        type: "National Level Workshop",
        description: "",
        resourcePerson: "Dr.A.K.Natesan, Chairman-  ISTE Tamil Nadu &Pondichery Section, Excel Group Institutions, Namakkal",
      },
      {
        title: "“RTICET – 16” Emerging Trends in Electrical, Electronics and Computer Engineering",
        date: "04.04.2018",
        type: "National Conference",
        description: "",
        resourcePerson: "Mrs. K. Suganthi, Managing Director MASS Solar Systems Pvt Ltd",
      },
      {
        title: "Discrete Time Systems And Signal Processing",
        date: "26.03.2018",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Dr. M. Saravanan, Associate Professor, SNS College of Technology",
      },
      {
        title: "Advanced Technology in Solar System",
        date: "09.03.2018",
        type: "Seminar",
        description: "",
        resourcePerson: "Mr. C. Sivakumar & Mr. M. Nambidass Technical Executive",
      },
      {
        title: "Industrial Automation Tools and Techniques",
        date: "07.03.2018",
        type: "Workshop",
        description: "",
        resourcePerson: "Mr. Ajith Surendran Regional Manager",
      },
      {
        title: "Auto CAD Electrical",
        date: "02.03.2018",
        type: "Workshop",
        description: "",
        resourcePerson: "Mr. M. Surendar & Mr. T.R. Kiran, Autodesk Certified Instructor",
      },
      {
        title: "Solar Energy",
        date: "15.02.2018 to 16.02.2018",
        type: "Industrial Workshop",
        description: "",
        resourcePerson: "Mrs. K. Suganthi, Managing Director MASS Solar Systems Pvt Ltd",
      },
      {
        title: "Internet of Things",
        date: "21.09.2017 to 22.09.2017",
        type: "Workshop",
        description: "",
        resourcePerson: "Mr. K. Sasi Kumar, Sr. CRG Engineer & Mr. Dhanush, CRG Engineer",
      },
      {
        title: "LITEBRITZ – ‘Glow with Flow’",
        date: "12.09.2017",
        type: "Workshop",
        description: "",
        resourcePerson: "Mr. Samuel Dilton, Project Engineer & Mr. Kabilan, Manager Business Development IPCS Automation, Coimbatore",
      },
      {
        title: "Power System Analysis",
        date: "04.10.2016 03.10.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr.Karthik, ASP/SNS College of Technology, Coimbatore",
      },
      {
        title: "Microprocessor and Microcontroller",
        date: "04.10.2016 01.10.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr.Rajasekaran R, Beta Tecnologies, Coimbatore",
      },
      {
        title: "Glow with Flow",
        date: "27.08.2016",
        type: "LITEBRITZ",
        description: "",
        resourcePerson: "Mr.S.A.Kannan Scientist/Engineer ‘SG’ Indian Space Reasearch Organization, Bengaluru",
      },
      {
        title: "Hands on Training in Embedded Systems",
        date: "24.08.2016",
        type: "Workshop",
        description: "",
        resourcePerson: "Ms.Subha Sree, Technical Manager, BETA Technologies, Coimbatore",
      },
      {
        title: "Electrical Machines",
        date: "23.08.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Dr.Kaliya Moorthy, Professor/Dr. Mahalingam College of Engg and Tech, Pollachi",
      },
      {
        title: "Basics of Remote Sensing, Geographical Information System & Global Navigation Satellite System",
        date: "22.08.2016 to 18.11.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Online Course Coordinator : Mr. N.Abner Leo, Assistant Professor,   JCT College of Engineering and Technology, Coimbatore",
      },
      {
        title: "PLC Training",
        date: "19.08.2016",
        type: "Seminar",
        description: "",
        resourcePerson: "Mr. Ezhanchelian, Senior Technical Engineer, Prolific Systems, Coimbatore",
      },
      {
        title: "Linear Integrated Circuits",
        date: "01.10.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr. Kishore, ASP/Dr. Mahalingam College of Technology, Pollachi",
      },
      {
        title: "“RTICET – 16” Recent Trends in Information, Communication and Electrical Technologies",
        date: "02.04.2016",
        type: "National Conference",
        description: "",
        resourcePerson: "Mr. Mohan Kumar, Managing Director, Skypro Technologies, Bangalore",
      },
      {
        title: "“JFINAGLES “ Symposium of JCT Institutions",
        date: "24.02.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "G.S.Venkata Subramani, Managing Director, SG Structural Engineering, Coimbatore.",
      },
      {
        title: "Embedded Systems",
        date: "15.02.2016 to 18.02.2016",
        type: "Hands-on Training",
        description: "",
        resourcePerson: "Ms. Subha Sree, Technical Engineer, BETA Technologies, Coimbatore",
      },
      {
        title: "LITEBRITZ – ‘Glow with Flow’",
        date: "07.09.2015",
        type: "Association Inagrual",
        description: "",
        resourcePerson: "Prof.R.JAyachandran,Former Project Officer, NISTADS,Govt. of India",
      },
      {
        title: "Power System Analysis",
        date: "09.09.2015",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr.Karthik, ASP/SNS College of Technology, Coimbatore",
      },
      {
        title: "Special Electrical Machines & Brushless DC Motors",
        date: "09.09.2015",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr.Rajasekaran R, Senior Design Engineer, Beta Tecnologies, Coimbatore",
      },
      {
        title: "Digital Logic Circuits and Electro Magnetic Theory",
        date: "15.09.2015",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr. V. Karthikeyan, Team Leader (DLC & FPGA), SIGRO Technologies, Coimbatore",
      },
      {
        title: "Power System Operation and Control",
        date: "15.09.2015",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr. H. F. B. Anthony Manoj, R&D Engineer, Alpha Research and Development, Coimbatore",
      },
      {
        title: "Measurements & Instrumentation",
        date: "16.02.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mrs. Rajeswari, ASP/Adithya Institute of Technology, Coimbatore",
      },
      {
        title: "FACTS",
        date: "20.04.2016",
        type: "Guest Lecture",
        description: "",
        resourcePerson: "Mr.Rajasekaran R, AP/SNS College of Technology, Coimbatore",
      },
    ],

    // ── Societies and Chapters (IEEE / IGEN / ISTE) — chapter names only.
    // Raw record. Hidden on the Events (life) tab (labels.life.participation)
    // and rendered on the dedicated "Societies & Chapters" sidebar tab below.
    studentParticipation: {
      clubs: ["IEEE Student Chapter", "IGEN", "ISTE Student Chapter"],
      highlights: [],
    },

    // ── Awards and Achievement: Students / Faculty — TODO ──────────────────────
    studentAchievements: [],
    facultyAchievements: [],
    facultyParticipation: { conferences: [], workshops: [] },

    // ── Placement ───────────────────────────────────────────────────────────────
    // Top Recruiters — actual employers of placed EEE graduates (2021–2024
    // batches), from the department's published placement records.
    // NOTE: flat keys, not nested under careerProgression — both the admin
    // editor and normalize-program-data.ts read/write these at the top level.
    topRecruiters: [
      "Tvs Brakes India Limited",
      "Sundaram Auto Components Limited",
      "Triemp Technology Service Pvt Limited",
      "Puma Technovation India Pvt Limited",
      "Seros Energy Pvt Ltd",
      "Co Apps",
      "VEL Technologies",
      "H2O Innovation Tech",
      "Gateway Software Solutions",
      "GESCO",
    ],
    higherStudies: [
      "M.E. / M.Tech in Power Electronics / Electrical Engineering",
      "MBA",
      "GATE Qualified – IITs and NITs",
      "Ph.D Research Programs",
      "MS Abroad",
    ],
    // No published overall placement % or average package figure specific
    // to EEE was found in the source — TODO: department to supply.
    averagePackage: "",
    placementRate: "",

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

    // ═══════════════════════════════════════════════════════════════════════
    // LEFT SIDEBAR — the department's twelve requested entries, in order.
    // Built-in tab ids (overview/academics/faculty/facilities/life/career)
    // render their structured sections; custom ids render their `blocks`.
    // Custom tabs with zero blocks stay hidden publicly until the department
    // adds content in the admin builder (they always show in the builder).
    // ═══════════════════════════════════════════════════════════════════════
    tabsConfig: [
      { id: "overview", label: "Overview", icon: "bookOpen" },
      { id: "academics", label: "Academic", icon: "graduationCap" },
      { id: "faculty", label: "People", icon: "users" },
      { id: "facilities", label: "Facility", icon: "flaskConical" },
      {
        // Awards and Achievement: Faculty / Students — TODO: department to
        // supply; add heading/list/cards blocks via the admin builder.
        id: "awards",
        label: "Awards & Achievements",
        icon: "trophy",
        blocks: [],
      },
      {
        id: "innovations-tlp",
        label: "Innovations in TLP",
        icon: "zap",
        blocks: [
          {
            type: "heading",
            text: "Innovations by the Faculty in Teaching and Learning",
            level: 2,
          },
          {
            type: "list",
            items: [
              "Blog Spot",
              "Chart Presentation",
              "ERP",
              "Expert Talk",
              "Flipped Classroom",
              "Google Classroom",
              "Peer Group Learning",
              "Project Based Learning Methodology",
              "Quiz by Google Form",
              "Quiz by Quizizz",
            ],
          },
        ],
      },
      { id: "career", label: "Placement", icon: "trendingUp" },
      {
        // SDG Implementation — TODO: department to supply activities.
        id: "sdg",
        label: "SDG Implementation",
        icon: "target",
        blocks: [],
      },
      {
        // Research: Academic Research / Industrial Consultancy / IPR — TODO:
        // department to supply. MoU Signed — real MoUs from News & Events.
        id: "research",
        label: "Research",
        icon: "microscope",
        blocks: [
          { type: "heading", text: "MoUs Signed", level: 2 },
          {
            type: "cards",
            columns: 3,
            items: [
              {
                title: "PUMO Technovation India Private Limited, Coimbatore",
                desc: "19.04.2023 — MoU signed at PUMO Technovation India Private Limited, Coimbatore, in the presence of Mr. Manoi KRN (Director & CTO) and department faculty D. Nagarajan, J. Priyadharshini and Angel Joseph P.",
              },
              {
                title: "SRS Solar Systems, Coimbatore",
                desc: "15.03.2023 — MoU signed at SRS Solar Systems, Coimbatore, in the presence of Mr. R.S. Senthil Kumar (Proprietor) and department faculty R. Satheesh, M. Devika and A. Kavyalakshmi.",
              },
              {
                title: "IPCS Global Solutions Pvt Ltd, Coimbatore",
                desc: "08.03.2022 — MoU signed with IPCS Global Solutions Pvt Ltd, Coimbatore, represented by Regional Manager Mr. Jomesh Jose; signed by Principal Dr. S. Manoharan, HOD Dr. K. Geetha and Prof. D. Nagarajan.",
              },
            ],
          },
        ],
      },
      {
        // Per-chapter descriptions/activities — TODO: department to supply.
        id: "societies",
        label: "Societies & Chapters",
        icon: "layers",
        blocks: [
          { type: "heading", text: "Societies & Chapters", level: 2 },
          {
            type: "cards",
            columns: 3,
            items: [
              { title: "IEEE Student Chapter", desc: "" },
              { title: "IGEN", desc: "" },
              { title: "ISTE Student Chapter", desc: "" },
            ],
          },
        ],
      },
      { id: "life", label: "Events", icon: "calendar" },
      {
        // Newsletter / Magazine — TODO: department to supply issue details
        // (the structured `magazine` field above is the raw record).
        id: "newsletter",
        label: "Newsletter / Magazine",
        icon: "newspaper",
        blocks: [],
      },
    ],

    // ── Section visibility/relabels that move sub-items to the sidebar entry
    // the department asked for.
    labels: {
      overview: {
        // HoD Desk belongs to People per the department's structure.
        hod: { visible: false },
        programOutcomes: { title: "PEOs, POs & PSOs" },
      },
      academics: {
        // Innovations in TLP has its own sidebar entry.
        teachingLearning: { visible: false },
      },
      faculty: {
        coreFaculty: { title: "Faculty List" },
        // DAC renders under Overview per the department's structure; PAC and
        // BOS rosters are TODO and will be surfaced there once supplied.
        advisoryBoard: { visible: false },
        pac: { visible: false },
        bos: { visible: false },
      },
      life: {
        // The life tab is the "Events" sidebar entry — everything else in it
        // has its own sidebar entry (Awards, Newsletter, Societies).
        events: { title: "Events Organized" },
        studentAchievements: { visible: false },
        facultyAchievements: { visible: false },
        magazine: { visible: false },
        participation: { visible: false },
      },
    },

    // ── Extra content blocks attached to built-in sections ────────────────────
    // Rendered by EditableRegion inside ProgramPageLayout; a section's blocks
    // only render while that section itself renders.
    sectionBlocks: {
      // Overview, after "PEOs, POs & PSOs": Highlights/Scope then DAC —
      // matching the department's Overview ordering. Highlights are
      // paraphrased from the about paragraphs above, not fabricated.
      // Board of Studies / PAC rosters — TODO: add blocks here (or fill the
      // structured bos/pac fields and re-enable them under People).
      programOutcomes: [
        { type: "heading", text: "Highlights & Scope", level: 2 },
        {
          type: "list",
          items: [
            "Established in 2010, offering a UG programme in Electrical and Electronics Engineering (intake 60) and a PG programme in Power Electronics and Drives (intake 18, running since 2012).",
            "Core strengths in electrical machines, power electronics, drives and control systems, with an emerging research focus on electric vehicles and renewable energy.",
            "Regular technical workshops, guest lectures and industrial visits keep students current with emerging trends in electrical and electronics engineering.",
            "Graduates recruited across the power and electronics sector, including ONGC, Steel Authority of India, thermal/hydro/atomic power plants, HCL, HPCL, DRDO, ISRO, Railways, BSNL, Siemens, BEL, BHEL, SAIL and GAIL.",
          ],
        },
        {
          type: "heading",
          text: "Department Advisory Committee (DAC)",
          level: 2,
        },
        {
          type: "cards",
          columns: 2,
          items: [
            {
              title: "Dr. S. Manoharan",
              desc: "Principal, JCT College of Engineering and Technology, Coimbatore (Member)",
            },
            {
              title: "Mr. A. Chandrahassan",
              desc: "Administrative Officer, JCT Group of Institutions, Coimbatore (Member)",
            },
            {
              title: "Dr. B. Balraj",
              desc: "Dean/Academics, Professor and Head/EEE, JCT College of Engineering and Technology, Coimbatore (HOD)",
            },
            {
              title: "Dr. P. Maruthupandi",
              desc: "Associate Professor/EEE, Government College of Technology, Coimbatore (Senior Academician)",
            },
            {
              title: "Dr. Shriram K V",
              desc: "Lead – Technology Evangelist, Asia Pacific and Japan Region, Intel India Pvt. Limited, Bengaluru (Industry Expert)",
            },
            {
              title: "Ms. V. Anjana Sree",
              desc: "Alumni, Assistant Engineer, Kerala State Electricity Board Limited, Palakkad (Alumni Representative)",
            },
            {
              title: "Mr. R. Pakkirisamy",
              desc: "Parent, F/O Mr. Dinesh Babu P (2014 Passed Out), AE, TNEB (Parent Representative)",
            },
            {
              title: "Mr. D. Nagarajan",
              desc: "Assistant Professor/EEE, JCT College of Engineering and Technology, Coimbatore (Senior Faculty)",
            },
          ],
        },
      ],
      // Academic, before "Value Added Courses": Programmes Offered. Attached
      // here because the curriculum section hides itself while its semesters
      // are empty (blocks attached to a hidden section don't render). The
      // M.E. programme facts come from the about text above.
      valueAddedCourses: [
        { type: "heading", text: "Programmes Offered", level: 2 },
        {
          type: "cards",
          columns: 2,
          items: [
            {
              title: "B.E. Electrical and Electronics Engineering",
              desc: "Undergraduate • 4 Years • Annual intake: 60",
            },
            {
              title: "M.E. Power Electronics and Drives",
              desc: "Postgraduate • Annual intake: 18 • Offered since 2012",
            },
          ],
        },
      ],
      // People, before "Faculty List": HoD's Desk (structured hod fields are
      // hidden on Overview via labels above).
      faculty: [
        { type: "heading", text: "HoD's Desk", level: 2 },
        {
          type: "text",
          paragraphs: [
            "Dr. B. Balraj — Professor, Dean-Academics and Head (Ph.D)",
            "Welcome to the Department of Electrical and Electronics Engineering at JCT College of Engineering and Technology.",
            "Our department is committed to producing industry-ready engineers with technical expertise, innovation, and ethical values to meet global challenges in the power and electronics sectors.",
          ],
        },
      ],
    },
    sectionBlocksPosition: {
      programOutcomes: "after",
      valueAddedCourses: "before",
      faculty: "before",
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
    console.log("\n  Left sidebar (content.tabsConfig):");
    for (const tab of PROGRAM.content.tabsConfig) {
      const kind = tab.blocks
        ? tab.blocks.length > 0
          ? `custom, ${tab.blocks.length} block(s)`
          : "custom, empty — hidden until filled"
        : "built-in";
      console.log(`    ${tab.label}  [${tab.id}] (${kind})`);
    }
    const blockKeys = Object.keys(PROGRAM.content.sectionBlocks);
    console.log(
      `\n  Section blocks: ${blockKeys
        .map((k) => `${k} (${PROGRAM.content.sectionBlocksPosition[k]})`)
        .join(", ")}`,
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
