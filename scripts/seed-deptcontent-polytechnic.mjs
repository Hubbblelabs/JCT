#!/usr/bin/env node
/**
 * Usage:
 *   MONGODB_URI="..." node scripts/seed-deptcontent-polytechnic.mjs
 *   node scripts/seed-deptcontent-polytechnic.mjs          # reads .env automatically
 *   node scripts/seed-deptcontent-polytechnic.mjs --dry-run
 *
 * Upserts polytechnic diploma program department content sourced from the jct-backup.
 * NEVER modifies the `image` field on existing documents.
 *
 * Target slugs (match the legacy redirect map in polytechnic/[course]/page.tsx):
 *   computer-technology, agricultural-engineering, petrochemical-engineering,
 *   mechanical-engineering, electrical-electronics, civil-engineering
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

// ─── Shared diploma-level program outcomes (all 6 depts use same POs) ────────

const DIPLOMA_POS = [
  { code: "PO1", title: "Basic and Discipline Specific Knowledge", description: "Apply knowledge of basic mathematics, science and engineering fundamentals and engineering specialization to solve the engineering problems." },
  { code: "PO2", title: "Problem Analysis", description: "Identify and analyze well-defined engineering problems using codified standard methods." },
  { code: "PO3", title: "Design / Development of Solutions", description: "Design solutions for well-defined technical problems and assist with the design of systems components or processes to meet specified needs." },
  { code: "PO4", title: "Engineering Tools, Experimentation and Testing", description: "Apply modern engineering tools and appropriate technique to conduct standard tests and measurements." },
  { code: "PO5", title: "Engineering Practices for Society, Sustainability and Environment", description: "Apply appropriate technology in context of society, sustainability, environment and ethical practices." },
  { code: "PO6", title: "Project Management", description: "Use engineering management principles individually, as a team member or a leader to manage projects and effectively communicate about well-defined engineering activities." },
  { code: "PO7", title: "Life-long Learning", description: "Ability to analyze individual needs and engage in updating in the context of technological changes." },
];

// ─── Program data ─────────────────────────────────────────────────────────────

const PROGRAMS = [
  // ── Diploma in Computer Technology ─────────────────────────────────────────
  {
    slug: "computer-technology",
    name: "Diploma in Computer Technology",
    abbr: "CT",
    institution: "polytechnic",
    degree: "Diploma",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Industry-ready diploma program equipping students with practical computer skills, modern tools and technologies for employment and higher studies.",
    description:
      "The department of Computer Technology has well equipped laboratories and experienced faculty members to provide excellent knowledge and skills. It enables students to meet future challenges in employment in high technology workforce and pursue higher studies.",
    outcomes: [
      "Qualify in the field of Computer Technology through high quality technical education",
      "Create innovative technologies for building the nation with modern tools and technologies",
      "Develop competent skills through sustainable industry-institute interaction",
      "Pursue higher studies or become an entrepreneur in computer technology",
    ],
    is_active: true,
    sort_order: 0,
    content: {
      name: "Diploma in Computer Technology",
      college: "polytechnic",
      shortName: "CT",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      ////heroImage: "/site_assests/polytechnic.jpeg",
      degreePrefix: "Diploma",

      about1:
        "The department of Computer Technology has well equipped laboratories and experienced faculty members to provide an excellent knowledge and skill to the students. It enables the students to meet the future challenges in terms of employment in high technology workforce and the ability to pursue higher studies.",
      about2: "",
      about3: "",

      established: "2014",
      accreditation: "AICTE, DOTE",
      intake: 60,
      affiliation: "Directorate of Technical Education (DOTE), Tamil Nadu",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Computer Technology",
      hodMessage: [],

      vision:
        "To qualify in the field of Computer Technology through high quality technical education and empower the professionals to serve better the society.",

      mission: [
        "To create innovative technologies in the field of Computer Technology for building the nation with modern tools and technologies.",
        "Upgrade the facilities to develop competent faculty and staff to produce quality Diploma Engineers.",
        "Establish sustainable industry-institute interaction to enhance specific domain knowledge and entrepreneurship skills.",
      ],

      programOutcomes: [
        ...DIPLOMA_POS,
        { code: "PEO1", title: "Productive Careers", description: "Shall have productive careers in private and government organizations at the national and international level or become successful entrepreneurs." },
        { code: "PEO2", title: "Social Contribution", description: "Shall contribute towards the development of society by providing solutions through research and higher studies." },
        { code: "PEO3", title: "Communication and Teamwork", description: "Shall have good communication skills, team work and lifelong learning attitude." },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        { name: "Computer Hardware Laboratory", description: "Hands-on training in computer assembly, troubleshooting and maintenance.", equipment: [] },
        { name: "Programming Laboratory", description: "Facilities for practicing programming in C, C++, Java and Python.", equipment: [] },
        { name: "Networking Laboratory", description: "Equipped with networking devices for LAN/WAN configuration and troubleshooting.", equipment: [] },
        { name: "Web Technology Laboratory", description: "Training in HTML, CSS, JavaScript and web development frameworks.", equipment: [] },
        { name: "Database Management Laboratory", description: "Practical sessions on RDBMS, SQL and database design.", equipment: [] },
      ],

      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: ["TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "Local IT Companies"],
        higherStudies: ["B.E. / B.Tech in Computer Science", "BCA / B.Sc Computer Science", "Lateral Entry to Degree Programs"],
        averagePackage: "2.5 LPA",
        placementRate: "85%",
      },
      feedback: { curriculumProcess: [], facilityProcess: [], recentImprovements: [] },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "DOTE, Tamil Nadu" },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, DOTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── Diploma in Agricultural Engineering ────────────────────────────────────
  {
    slug: "agricultural-engineering",
    name: "Diploma in Agricultural Engineering",
    abbr: "AGE",
    institution: "polytechnic",
    degree: "Diploma",
    duration: "3 Years",
    seats: 60,
    highlight:
      "One of the foundational engineering fields — preparing diploma engineers for agro industries, farm technology transfer and rural development.",
    description:
      "Diploma in Agricultural Technology is an ancient engineering field which laid the foundations for the development of other engineering fields. Agricultural engineers play a vital role in the development of agriculture and land development.",
    outcomes: [
      "Apply farm technology and modern machinery to support rural agricultural development",
      "Work in agro industries and technical industries in rural areas",
      "Support farmers through farm technology transfer and technical education",
      "Pursue higher studies in agricultural engineering or related fields",
    ],
    is_active: true,
    sort_order: 1,
    content: {
      name: "Diploma in Agricultural Engineering",
      college: "polytechnic",
      shortName: "AGE",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      ////heroImage: "/site_assests/polytechnic.jpeg",
      degreePrefix: "Diploma",

      about1:
        "Diploma in Agricultural Technology is an ancient engineering field which laid the foundations for the development of other engineering fields. Agricultural engineers play a vital role in the development of agriculture and land development for so many other fields. The department aims at producing quality engineers with sound technical knowledge and awareness of the latest advancements in existing and emerging technologies.",
      about2:
        "This Diploma course on Agricultural Engineering emphasis of agro Industries and Technical Industries in rural area, and this course Agricultural Engineering is serving Rural farmers in a big way on Farm technology Transfer and imparting Technical Education. With pride we state that our institution is offering diploma in Agricultural Engineering with full-fledged support of farm machinery and testing fields.",
      about3: "",

      established: "2014",
      accreditation: "AICTE, DOTE",
      intake: 60,
      affiliation: "Directorate of Technical Education (DOTE), Tamil Nadu",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Agricultural Engineering",
      hodMessage: [],

      vision: "",
      mission: [],

      programOutcomes: [
        ...DIPLOMA_POS,
        { code: "PEO1", title: "Productive Careers", description: "Shall have productive careers in private and government organizations at the national and international level or become successful entrepreneurs." },
        { code: "PEO2", title: "Social Contribution", description: "Shall contribute towards the development of society by providing solutions through research and higher studies." },
        { code: "PEO3", title: "Communication and Teamwork", description: "Shall have good communication skills, team work and lifelong learning attitude." },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        { name: "Farm Machinery Laboratory", description: "Equipped with tractors, tillers, ploughs and modern farm machinery for hands-on training.", equipment: [] },
        { name: "Soil and Water Engineering Laboratory", description: "Facilities for soil testing, irrigation and drainage experiments.", equipment: [] },
        { name: "Agricultural Structures Laboratory", description: "Training in design and construction of farm buildings and storage structures.", equipment: [] },
        { name: "Post-Harvest Technology Laboratory", description: "Equipped for food processing, grain storage and post-harvest management.", equipment: [] },
        { name: "Testing Fields", description: "Full-fledged support of farm machinery and testing fields for practical agricultural training.", equipment: [] },
      ],

      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: ["Food Corporation of India", "State Agriculture Departments", "Agro Industries", "Farm Equipment Companies", "Rural Development Organizations"],
        higherStudies: ["B.E. / B.Tech in Agricultural Engineering", "B.Sc Agriculture", "Lateral Entry to Degree Programs"],
        averagePackage: "2.5 LPA",
        placementRate: "80%",
      },
      feedback: { curriculumProcess: [], facilityProcess: [], recentImprovements: [] },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "DOTE, Tamil Nadu" },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, DOTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "80%" },
      ],
    },
  },

  // ── Diploma in Petrochemical Engineering ────────────────────────────────────
  {
    slug: "petrochemical-engineering",
    name: "Diploma in Petrochemical Engineering",
    abbr: "PCE",
    institution: "polytechnic",
    degree: "Diploma",
    duration: "3 Years",
    seats: 60,
    highlight:
      "First centre for Petrochemical Engineering in Coimbatore. Specialized diploma in oil refining, petrochemicals, and downstream petroleum industries.",
    description:
      "The Department of Petrochemical Engineering, established in 2014, is regarded as one of the first centres for Petrochemical Engineering in Coimbatore. Committed to impart knowledge for creating complete petrochemical engineers with high sense of social responsibilities.",
    outcomes: [
      "Succeed in careers across the diversified sectors of Petrochemical Engineering",
      "Become a successful entrepreneur, manager or occupy higher positions",
      "Pursue higher studies in India or abroad in Chemical / Petrochemical Engineering",
      "Apply modern engineering skills and software tools to analyze petrochemical technology problems",
    ],
    is_active: true,
    sort_order: 2,
    content: {
      name: "Diploma in Petrochemical Engineering",
      college: "polytechnic",
      shortName: "PCE",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      ////heroImage: "/site_assests/polytechnic.jpeg",
      degreePrefix: "Diploma",

      about1:
        "The Department of Petrochemical Engineering, Established in 2014, is regarded as one of the first centre for Petrochemical Engineering in Coimbatore Tamil Nadu (India). Department of petrochemical engineering is committed to impart knowledge to students at all levels through a vibrant, dynamic and state of art intellectual delivers to ensure the creation of a complete Petrochemical engineer with high sense of social responsibilities.",
      about2:
        "Petrochemical engineering is a specialized branch of Chemical Engineering which deals with the operations of refining and petrochemical technology. The term petrochemical refers to the organic chemicals which are obtained directly or indirectly from crude petroleum. It is the task of the petrochemical engineers to discover natural sources of oil, extract them from the earth, refine them and make it usable. Petroleum engineering can be divided into two parts: upstream sector (exploration, production and exploitation) and downstream sector (refining, marketing and distributing).",
      about3:
        "Today, petrochemical products permeate the entire spectrum of daily use items and cover almost every sphere of life like clothing, housing, construction, furniture, automobiles, household items, agriculture, horticulture, irrigation, packaging, medical appliances, electronics and electrical etc. Petrochemical engineers mainly have needs in refineries, petrochemical plants as well as downstream petroleum industries and R&D Organizations.",

      established: "2014",
      accreditation: "AICTE, DOTE",
      intake: 60,
      affiliation: "Directorate of Technical Education (DOTE), Tamil Nadu",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Petrochemical Engineering",
      hodMessage: [],

      vision:
        "To produce competent Diploma graduates in Petrochemical Engineering and to achieve Excellence in Education.",

      mission: [
        "State of the art infrastructures for conducive, quality learning.",
        "Skills embedded education for productive careers and higher studies.",
        "Value and Ethics Integrated Technical Education.",
      ],

      programOutcomes: [
        ...DIPLOMA_POS,
        { code: "PEO1", title: "Petrochemical Careers", description: "Successful in their careers in the diversified sectors of the Petrochemical Engineering." },
        { code: "PEO2", title: "Entrepreneurship", description: "A successful entrepreneur, manager or occupy higher positions." },
        { code: "PEO3", title: "Higher Studies", description: "Pursuing higher studies in India or Abroad." },
        { code: "PSO1", title: "Technology Application", description: "Students will be able to apply and use the modern engineering skills and software tools to analyze petrochemical technology problems." },
        { code: "PSO2", title: "Industry Management", description: "Students will be able to apply principles of management and economics for the effective functioning in Petrochemical and allied Industries." },
        { code: "PSO3", title: "Lifelong Learning", description: "Students will engage in lifelong learning towards continuous skills development." },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        { name: "Distillate Testing Practical – I", description: "Laboratory for testing and characterization of petroleum distillate products.", equipment: [] },
        { name: "Mechanical Engineering Practical", description: "Practical training in mechanical operations relevant to petrochemical plants.", equipment: [] },
        { name: "Electrical and Electronics Engineering Practical", description: "Hands-on training in electrical systems used in petrochemical industry.", equipment: [] },
        { name: "Computer Applications Practical", description: "AutoCAD and software applications for petrochemical engineering.", equipment: ["AUTOCAD"] },
        { name: "Mechanical Operations Practical", description: "Experiments in unit operations like mixing, filtration and size reduction.", equipment: [] },
        { name: "Momentum Transfer Practical", description: "Fluid mechanics and momentum transfer experiments.", equipment: [] },
        { name: "Technical Analysis Practical", description: "Chemical analysis and quality testing of petrochemical samples.", equipment: [] },
        { name: "Chemical Process Measurement and Control Practical", description: "Instrumentation and process control experiments.", equipment: [] },
        { name: "Heat Transfer Practical", description: "Heat exchanger and thermal process experiments.", equipment: [] },
      ],

      teachingLearning: { overview: "", methods: [], tools: ["AUTOCAD"], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: ["Indian Oil Corporation (IOCL)", "ONGC", "Reliance Industries", "Bharat Petroleum", "Chemplast Sanmar", "Cochin Refineries", "IG Petrochemicals"],
        higherStudies: ["B.E. / B.Tech in Petrochemical / Chemical Engineering", "Lateral Entry to Degree Programs"],
        averagePackage: "2.5 LPA",
        placementRate: "85%",
      },
      feedback: { curriculumProcess: [], facilityProcess: [], recentImprovements: [] },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "DOTE, Tamil Nadu" },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, DOTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── Diploma in Mechanical Engineering ───────────────────────────────────────
  {
    slug: "mechanical-engineering",
    name: "Diploma in Mechanical Engineering",
    abbr: "MECH",
    institution: "polytechnic",
    degree: "Diploma",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Hands-on diploma program in design, manufacturing, thermal engineering and mechatronics with strong practical exposure and industry-ready skills.",
    description:
      "The department of mechanical engineering started in 2014-2015 with the objective to create outstanding diploma engineers with advanced teaching and learning aids. The program imparts students to master mechanical engineering alongside knowledge of recent trends.",
    outcomes: [
      "Strong knowledge in core and allied engineering of mechanical engineering",
      "Successful careers, pursue higher education or become entrepreneurs",
      "Exhibit managerial skills with ethical values, team spirit and leadership skills",
      "Domain knowledge in manufacturing, thermal and fluid sciences",
    ],
    is_active: true,
    sort_order: 3,
    content: {
      name: "Diploma in Mechanical Engineering",
      college: "polytechnic",
      shortName: "MECH",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      //////heroImage: "/site_assests/polytechnic.jpeg",
      degreePrefix: "Diploma",

      about1:
        "The department of mechanical engineering is started in the year 2014-2015. It has been started with the objective to create outstanding diploma engineers, with advanced teaching and learning aids for the students. The department has well qualified faculty members and excellent laboratory facilities. The diploma program imparts students to master over the field of mechanical engineering besides knowledge of recent trends and development to shine as a successful engineer.",
      about2:
        "Student gain practical experience from the mechanical engineering field which requires an understanding of core areas including mechanics, dynamics, thermodynamics, materials science, structural analysis, and electricity. In addition to these core principles, mechanical engineers use tools such as computer-aided design (CAD), computer-aided manufacturing (CAM), and product life cycle management to design and analyse manufacturing plants, industrial equipment and machinery, heating and cooling systems, transport systems, aircraft, watercraft, robotics, medical devices and others.",
      about3: "",

      established: "2014",
      accreditation: "AICTE, DOTE",
      intake: 60,
      affiliation: "Directorate of Technical Education (DOTE), Tamil Nadu",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Mechanical Engineering",
      hodMessage: [],

      vision:
        "To impart value based quality technical education with multi disciplinary skills in mechanical engineering enabling young generation to face challenges in the modern world.",

      mission: [
        "To provide value based technical education and mould the character of younger generation.",
        "Discharging hands-on training to students for continuous improvement in knowledge and skills with good sound practical exposure and hence satisfying stake holders in terms of quality man power for industries.",
        "Providing professional ethics, leadership qualities, self confidence, decision making capabilities, good communication skills and empowerment to students to face challenges in the industries and the world.",
      ],

      programOutcomes: [
        ...DIPLOMA_POS,
        { code: "PEO1", title: "Core Knowledge", description: "Have strong knowledge in core and allied engineering of mechanical engineering." },
        { code: "PEO2", title: "Career and Higher Studies", description: "Have successful careers or pursue higher education or become entrepreneurs." },
        { code: "PEO3", title: "Professional Skills", description: "Exhibit managerial skills with ethical values, team spirit and leadership skills." },
        { code: "PSO1", title: "Domain Knowledge", description: "Students shall have domain knowledge manufacturing, thermal, fluid sciences to solve engineering and societal problems." },
        { code: "PSO2", title: "Modern Tools", description: "Students shall use the modern tools and latest software to design and develop solutions to solve societal problems." },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        { name: "Lathe and Drilling Lab", description: "Equipped with lathes, drilling machines and turning operations for machining practice.", equipment: [] },
        { name: "Thermal and Automobile Lab", description: "Equipped with engines, refrigeration units and automobile systems for thermal experiments.", equipment: [] },
        { name: "Computer Application and CAD Lab", description: "AutoCAD, CNC simulation software and PLC software for design and manufacturing.", equipment: ["AUTOCAD", "CNC Simulation Software", "PLC Software"] },
        { name: "Foundry and Welding Lab", description: "Facilities for casting, pattern making, and various welding techniques.", equipment: [] },
        { name: "Special Machine Lab", description: "Special purpose machines for advanced machining operations.", equipment: [] },
        { name: "Process Automation Lab", description: "PLC-based automation and pneumatic/hydraulic systems training.", equipment: [] },
        { name: "Metrology and Metallography Lab", description: "Precision measurement instruments and metallographic testing equipment.", equipment: [] },
        { name: "Refrigeration and Air-Conditioning Lab", description: "Refrigeration cycles, compressors and air-conditioning systems experiments.", equipment: [] },
        { name: "Machine Tool Testing and Maintenance Lab", description: "Tools and equipment for machine tool calibration and maintenance.", equipment: [] },
        { name: "CAD/CAM Practical", description: "Integrated computer aided design and manufacturing practical sessions.", equipment: [] },
      ],

      teachingLearning: { overview: "", methods: [], tools: ["AUTOCAD", "CNC Simulation Software", "PLC Software"], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: ["TVS Group", "RANE Group", "Wipro Infrastructure Engineering", "Sundaram Auto Components", "ROOTS Industries", "LMW", "Precot Mills", "Local Manufacturing Industries"],
        higherStudies: ["B.E. / B.Tech in Mechanical Engineering", "Lateral Entry to Degree Programs"],
        averagePackage: "2.5 LPA",
        placementRate: "88%",
      },
      feedback: { curriculumProcess: [], facilityProcess: [], recentImprovements: [] },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "DOTE, Tamil Nadu" },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, DOTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "88%" },
      ],
    },
  },

  // ── Diploma in Electrical and Electronics Engineering ────────────────────────
  {
    slug: "electrical-electronics",
    name: "Diploma in Electrical and Electronics Engineering",
    abbr: "EEE",
    institution: "polytechnic",
    degree: "Diploma",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Value-based technical diploma in EEE with MATLAB, PLC and SCADA training for wide-ranging careers in electrical, electronics and allied industries.",
    description:
      "The Department of Electrical and Electronics Engineering was established in 2014-2015 with firm commitment to develop and produce quality Electrical and Electronic Engineers with high-technical knowledge, good practical basis, combined with leadership skills and decision-making capabilities.",
    outcomes: [
      "Productive careers in private and government organizations nationally and internationally",
      "Contribute towards development of society through research and higher studies",
      "Use MATLAB/PLC/SCADA for electrical and electronic systems design",
      "Design and develop electrical/electronic systems as per society/industry requirements",
    ],
    is_active: true,
    sort_order: 4,
    content: {
      name: "Diploma in Electrical and Electronics Engineering",
      college: "polytechnic",
      shortName: "EEE",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      //////heroImage: "/site_assests/polytechnic.jpeg",
      degreePrefix: "Diploma",

      about1:
        "The Department of Electrical And Electronics Engineering was established in the year 2014-2015 with an intake of 60 students. The EEE department has been established with the firm commitment of developing and producing quality Electrical and Electronic Engineers with high-technical knowledge and good practical basis, combined with leadership skills and decision making capabilities.",
      about2:
        "The curriculum of the department of electrical and electronics engineering is designed to impart the students consummate knowledge and skills for careers in wide range of industries. The department has signed MOU with SHREE TECHNOLOGY, Coimbatore for industry-institute collaboration.",
      about3: "",

      established: "2014",
      accreditation: "AICTE, DOTE",
      intake: 60,
      affiliation: "Directorate of Technical Education (DOTE), Tamil Nadu",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Electrical and Electronics Engineering",
      hodMessage: [],

      vision:
        "To impart value based, quality technical education with multidisciplinary skills in Electrical and Electronics Engineering.",

      mission: [
        "Quality technical education in Electrical, Electronics and allied Engineering.",
        "Training programs imparting employable skills and knowledge towards employability or to pursue higher studies.",
        "Programs on Human values and ethics to serve the society.",
      ],

      programOutcomes: [
        ...DIPLOMA_POS,
        { code: "PEO1", title: "Productive Careers", description: "Shall have productive careers in private and government organizations at the national and International level or become successful entrepreneurs." },
        { code: "PEO2", title: "Social Contribution", description: "Shall contribute towards the development of society by providing solutions through research and higher studies." },
        { code: "PEO3", title: "Communication and Teamwork", description: "Shall have good communication skills, team work and lifelong learning attitude." },
        { code: "PSO1", title: "Simulation and Automation", description: "Students shall be able to use MATLAB/PLC/SCADA." },
        { code: "PSO2", title: "System Design", description: "Students shall be able to design and develop electrical/electronic systems and appliances as per society/industry requirements." },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        { name: "Electrical Circuits and Machines Laboratory", description: "Experiments in AC/DC circuits, motors and generators.", equipment: [] },
        { name: "Electronic Devices and Circuits Lab", description: "Semiconductor device characterization and amplifier circuit experiments.", equipment: [] },
        { name: "Electrical Machines and Instrumentation Lab", description: "Transformer, motor and instrumentation testing experiments.", equipment: [] },
        { name: "Integrated Circuits Lab", description: "Analog and digital IC experiments using IC kits.", equipment: [] },
        { name: "Microcontroller Lab", description: "8051/ARM microcontroller programming and interfacing.", equipment: [] },
        { name: "Control of Electrical Machines Laboratory", description: "Speed control of DC and AC motors using drives.", equipment: [] },
        { name: "Electrical Circuits Simulation Laboratory", description: "MATLAB-based circuit simulation and analysis.", equipment: ["MATLAB"] },
        { name: "Power Electronics Laboratory", description: "Converters, inverters and power semiconductor device experiments.", equipment: [] },
        { name: "Computer Aided Electrical Drawing Laboratory", description: "AutoCAD-based electrical drawing and schematic design.", equipment: ["AUTOCAD"] },
      ],

      teachingLearning: { overview: "", methods: [], tools: ["MATLAB", "PLC", "AUTOCAD"], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: ["TNEB", "BSNL", "BEL", "Siemens", "ABB", "Private Electrical Companies", "SHREE TECHNOLOGY (MOU Partner)"],
        higherStudies: ["B.E. / B.Tech in Electrical and Electronics Engineering", "Lateral Entry to Degree Programs"],
        averagePackage: "2.5 LPA",
        placementRate: "85%",
      },
      feedback: { curriculumProcess: [], facilityProcess: [], recentImprovements: [] },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "DOTE, Tamil Nadu" },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, DOTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── Diploma in Civil Engineering ─────────────────────────────────────────────
  {
    slug: "civil-engineering",
    name: "Diploma in Civil Engineering",
    abbr: "CIVIL",
    institution: "polytechnic",
    degree: "Diploma",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Quality civil engineering diploma program with strong emphasis on construction, structural design, CAD and sustainable infrastructure development.",
    description:
      "The department of civil engineering started in 2014-2015 with the objective to create outstanding diploma engineers with advanced teaching and learning aids. Students gain practical experience from field visits to construction sites, dams and irrigation structures.",
    outcomes: [
      "Productive careers in private and government infrastructure organizations",
      "Plan, analyze, design and execute Civil Engineering Projects",
      "Apply modern construction techniques, equipment and management tools",
      "Contribute to society through research and higher studies",
    ],
    is_active: true,
    sort_order: 5,
    content: {
      name: "Diploma in Civil Engineering",
      college: "polytechnic",
      shortName: "CIVIL",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      //////heroImage: "/site_assests/polytechnic.jpeg",
      degreePrefix: "Diploma",

      about1:
        "The department of civil engineering is started in the year 2014-2015. It has been started with the objective to create outstanding diploma engineers, with advanced teaching and learning aids for the students. The department has well qualified faculty members and excellent laboratory facilities. The diploma program imparts students to master over the field of civil engineering besides knowledge of recent trends and development to shine as a successful engineer.",
      about2:
        "Student gain practical experience from field visit to construction sites, dams and irrigation structures, etc. The curriculum is designed to integrate core civil engineering subjects with modern tools and construction management practices.",
      about3: "",

      established: "2014",
      accreditation: "AICTE, DOTE",
      intake: 60,
      affiliation: "Directorate of Technical Education (DOTE), Tamil Nadu",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Civil Engineering",
      hodMessage: [],

      vision:
        "To be an outstanding department devoted to quality and skill based Technical education.",

      mission: [
        "Integrated curriculum with add-on and value addition programs to meet industries requirements in terms of skills.",
        "Enhance Problem solving and project based learning related to civil engineering and society, at large.",
        "Mentor students to pursue higher Studies, entrepreneurship and emerge as a global professional.",
      ],

      programOutcomes: [
        ...DIPLOMA_POS,
        { code: "PEO1", title: "Productive Careers", description: "Shall have productive careers in private and government organizations at the national and international level or become successful entrepreneurs." },
        { code: "PEO2", title: "Social Contribution", description: "Shall contribute towards the development of society by providing solutions through research and higher studies." },
        { code: "PEO3", title: "Communication and Teamwork", description: "Shall have good communication skills, team work and lifelong learning attitude." },
        { code: "PSO1", title: "Civil Project Execution", description: "Students will have ability to Plan, analyze, design, prepare cost estimates and execute all kinds of Civil Engineering Projects." },
        { code: "PSO2", title: "Modern Construction", description: "Students will have an ability to apply modern construction techniques, equipment and management tools." },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        { name: "Material Testing Laboratory", description: "Testing of construction materials like cement, concrete, steel and bricks.", equipment: [] },
        { name: "Surveying Practice", description: "Hands-on training with total stations, levels, theodolites and GPS instruments.", equipment: [] },
        { name: "CAD in Civil Engineering Drawing", description: "AutoCAD-based civil engineering drawing and planning.", equipment: ["AUTOCAD"] },
        { name: "Construction Practice Laboratory", description: "Practical training in masonry, plastering, carpentry and finishing works.", equipment: [] },
        { name: "Hydraulics and Plumbing Laboratory", description: "Fluid mechanics experiments and plumbing installation practice.", equipment: [] },
        { name: "Computer Application in Civil Engineering Laboratory", description: "Software applications for structural analysis and design.", equipment: [] },
      ],

      teachingLearning: { overview: "", methods: [], tools: ["AUTOCAD"], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: ["L&T Constructions", "Government PWD", "TNHB", "Local Construction Firms", "Infrastructure Companies"],
        higherStudies: ["B.E. / B.Tech in Civil Engineering", "Lateral Entry to Degree Programs"],
        averagePackage: "2.5 LPA",
        placementRate: "85%",
      },
      feedback: { curriculumProcess: [], facilityProcess: [], recentImprovements: [] },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "DOTE, Tamil Nadu" },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, DOTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nPolytechnic Dept Content Seed — ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`Target slugs: ${PROGRAMS.map((p) => p.slug).join(", ")}\n`);

  if (DRY_RUN) {
    console.log("Dry-run mode: no changes will be written to the database.");
    console.log("Re-run without --dry-run to apply.\n");
    for (const p of PROGRAMS) {
      console.log(`  • ${p.name} (slug: ${p.slug}, degree: ${p.degree}, seats: ${p.seats})`);
    }
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: undefined });
    const col = mongoose.connection.db.collection("programs");
    const now = new Date();

    let created = 0;
    let updated = 0;

    for (const p of PROGRAMS) {
      const { slug, content, ...cardFields } = p;

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
        console.log(`✦ Created: ${p.name} (slug: ${slug})`);
        created++;
      } else if (result.modifiedCount > 0) {
        console.log(`✓ Updated: ${p.name} (slug: ${slug})`);
        updated++;
      } else {
        console.log(`— No change: ${p.name} (slug: ${slug})`);
      }
    }

    console.log(`\nDone. Created: ${created}, Updated: ${updated}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
