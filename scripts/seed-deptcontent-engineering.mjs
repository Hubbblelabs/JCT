#!/usr/bin/env node
/**
 * Usage:
 *   MONGODB_URI="..." node scripts/seed-deptcontent-engineering.mjs
 *   node scripts/seed-deptcontent-engineering.mjs          # reads .env automatically
 *   node scripts/seed-deptcontent-engineering.mjs --dry-run
 *
 * Upserts engineering program department content sourced from the jct-backup.
 * NEVER modifies the `image` field on existing documents.
 *
 * Target slugs (match DB records — all 15 engineering programs):
 *   aids, bt, ce, csbs, cse, eee, ece, ft,
 *   structural-engineering, power-electronics, cse-aiml, eee-doctoral,
 *   mech, pct, pe
 *
 * Run --dry-run first to see which slugs would be created vs updated.
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

const PROGRAMS = [
  // ── Artificial Intelligence and Data Science ────────────────────────────────
  {
    slug: "aids",
    name: "Artificial Intelligence and Data Science",
    abbr: "AI&DS",
    institution: "engineering",
    degree: "B.Tech",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Cutting-edge program in AI, machine learning, data mining and big data analytics preparing students for high-growth data science careers.",
    description:
      "Artificial Intelligence and Data Science Programme prepares students with the skills to perform intelligent data analysis, a key component in numerous real-world applications. The program covers AI, data mining, modelling, machine learning and big data analytics.",
    outcomes: [
      "Apply AI and data science techniques to real-world problems in healthcare, business and eCommerce",
      "Gain cross-disciplinary skills across statistics, computer science and machine learning",
      "Work as Business Analyst, Data Analyst, Intelligence Analyst or Data Manager",
      "Apply statistical, mathematical reasoning, knowledge discovery and visualization skills",
    ],
    is_active: true,
    sort_order: 0,
    content: {
      name: "Artificial Intelligence and Data Science",
      college: "engineering",
      shortName: "AI&DS",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.Tech",

      about1:
        "Artificial Intelligence and Data Science Programme prepare students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications. During the past ten years, data science has emerged as one of the most high-growth, dynamic, and lucrative careers in technology. This course aims at providing not only the core technologies such as artificial intelligence, data mining and data modelling but also gives intensive inputs in areas of machine learning and big data analytics.",
      about2:
        "By this course, the students will gain cross-disciplinary skills across fields such as statistics, computer science, machine learning, and logic. Data scientists may have career opportunities in healthcare, business, eCommerce, social networking companies, climatology, biotechnology, genetics, and other important areas. The major focus of this programme is to equip students with statistical, mathematical reasoning, machine learning, knowledge discovery, and visualization skills.",
      about3: "",

      established: "2021",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. Jethose V",
      hodDesignation: "Associate Professor and Head",
      hodQualification: "M.E., Ph.D",
      hodExperience: "Machine Learning",
      hodMessage: [
        "Welcome to the Department of Artificial Intelligence and Data Science at JCT College of Engineering and Technology. Our department is committed to nurturing the next generation of AI and data science professionals.",
        "We provide a rigorous curriculum that combines theoretical foundations with practical applications, preparing students for the rapidly evolving data-driven world.",
      ],

      vision: "",
      mission: [],

      programOutcomes: [
        {
          code: "PSO1",
          title: "Business Analyst",
          description:
            "Ability to analyze business data and provide actionable insights.",
        },
        {
          code: "PSO2",
          title: "Data Analyst",
          description:
            "Proficiency in data collection, processing and statistical analysis.",
        },
        {
          code: "PSO3",
          title: "Intelligence Analyst",
          description:
            "Skills to extract intelligence from large datasets using AI techniques.",
        },
        {
          code: "PSO4",
          title: "Data Manager",
          description:
            "Competency in managing and organizing large-scale data repositories.",
        },
        {
          code: "PSO5",
          title: "Information Security Analyst",
          description:
            "Understanding of data security principles and their applications.",
        },
        {
          code: "PSO6",
          title: "Risk Analyst",
          description:
            "Ability to identify and quantify risks using data-driven approaches.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. Jethose V",
          designation: "Associate Professor",
          qualification: "M.E., Ph.D",
          experience: "10+ Years",
          specialization: "Machine Learning",
        },
        {
          name: "Mr. Rajkumar K",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Deep Learning",
        },
        {
          name: "Ms. Greeshma K",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Cloud Computing",
        },
        {
          name: "Mrs. Anju P",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Operating Systems",
        },
        {
          name: "Mrs. Misha Mathew",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Fundamentals of Data Science",
        },
        {
          name: "Mrs. Pavithra M S",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Ethics and AI",
        },
        {
          name: "Mrs. Reshma M C",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Networks",
        },
        {
          name: "Mrs. Shahanaz S H",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Data Science and Analytics",
        },
        {
          name: "Mr. Sivanesan A",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Design and Analysis of Algorithms",
        },
        {
          name: "Ms. Radhika A",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Artificial Intelligence",
        },
        {
          name: "Mr. Ramkumar K",
          designation: "Assistant Professor (POP)",
          qualification: "B.E.",
          experience: "3+ Years",
          specialization: "Network Security",
        },
        {
          name: "Mr. Manikandan K",
          designation: "Assistant Professor (POP)",
          qualification: "B.E.",
          experience: "3+ Years",
          specialization: "Computer Networks",
        },
        {
          name: "Mrs. Sasirekha C",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Data Exploration and Visualization",
        },
        {
          name: "Mrs. Aiswariya P S",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Design and Analysis of Algorithms",
        },
        {
          name: "Mrs. Deepika A",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Knowledge Engineering",
        },
      ],

      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "Google",
          "Microsoft",
          "Amazon",
          "Flipkart",
          "Infosys",
          "TCS",
          "Wipro",
          "HCL Technologies",
        ],
        higherStudies: [
          "M.Tech / M.E. in AI & Data Science",
          "MBA (Data Analytics)",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "4 LPA",
        placementRate: "90%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2021" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "90%" },
      ],
    },
  },

  // ── Bio-Technology and Bio-Chemical Engineering ─────────────────────────────
  {
    slug: "bt",
    name: "Bio-Technology and Bio-Chemical Engineering",
    abbr: "BTBE",
    institution: "engineering",
    degree: "B.Tech",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Multidisciplinary program combining living organisms and engineering principles for applications in pharmaceuticals, food, agriculture and energy.",
    description:
      "B.Tech Biotechnology and Biochemical Engineering is science, technology and engineering driven. This specialization is based on living organisms with applications extending to industrial processing, agriculture, medicine, environment and energy.",
    outcomes: [
      "Work in food and beverage companies, agriculture, pharmaceutical, petroleum and biomedical firms",
      "Design pharmaceuticals, artificial organs, biomedical devices and drug delivery systems",
      "Apply biochemical engineering in metabolic, enzyme, and tissue engineering",
      "Conduct research and development in biotechnology and chemical engineering",
    ],
    is_active: true,
    sort_order: 1,
    content: {
      name: "Bio-Technology and Bio-Chemical Engineering",
      college: "engineering",
      shortName: "BTBE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.Tech",

      about1:
        "B.Tech. Biotechnology and Biochemical Engineering is an undergraduate course that is science, technology and engineering driven. This exciting specialization is based on living organisms with its application extending to all phases like industrial processing, agriculture, medicine, environment and energy. The course introduces concepts of Biochemistry, Microbiology, Industrial Microbiology, Enzyme Technology, Cell & Molecular Biology, Genetics, Bioinformatics, Thermodynamics and Biochemical Reaction Engineering.",
      about2:
        "One of the primary focuses of Biotechnology and Biochemical engineering is in the medical field, where engineers work to design pharmaceuticals, artificial organs, biomedical devices, chemical sensors, and drug delivery systems. Biotechnology and Biochemical engineers use their knowledge of chemical processes in biological systems to create tangible products that improve people's health. Specific areas of studies include metabolic, enzyme, and tissue engineering.",
      about3:
        "Biochemical Engineering and Biotechnology is an emerging field with many promising career aspects. Biotechnology and Biomedical engineers may work in food and beverage companies, agriculture and chemical industries, waste management firms, petroleum oil and gas fields, biomedical firms, engineering design companies, and pharmaceutical companies.",

      established: "2011",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. Selvakumar K V",
      hodDesignation: "Professor and Head",
      hodQualification: "M.E., Ph.D",
      hodExperience: "Chemical Engineering, Biotechnology",
      hodMessage: [
        "Welcome to the Department of Bio-Technology and Bio-Chemical Engineering at JCT College of Engineering and Technology.",
        "Our department is committed to producing graduates who are equipped with the skills to address challenges in biotechnology, pharmaceutical, food processing and chemical industries.",
      ],

      vision: "",
      mission: [],

      programOutcomes: [],
      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. Selvakumar K V",
          designation: "Professor and Head",
          qualification: "M.E., Ph.D",
          experience: "15+ Years",
          specialization: "Chemical Engineering, Biotechnology",
        },
        {
          name: "Dr. Gnanavel G",
          designation: "Professor",
          qualification: "M.Tech, Ph.D",
          experience: "12+ Years",
          specialization: "Chemical Engineering, Biotechnology",
        },
        {
          name: "Dr. Chandra Mohan A",
          designation: "Assistant Professor",
          qualification: "M.Tech, Ph.D",
          experience: "8+ Years",
          specialization: "Biochemistry, Biotechnology",
        },
        {
          name: "Dr. David Annaraj P",
          designation: "Assistant Professor",
          qualification: "M.Tech, Ph.D",
          experience: "8+ Years",
          specialization: "Biotechnology, Biopharmaceutical Technology",
        },
        {
          name: "Dr. Alwin Johnnie D",
          designation: "Assistant Professor",
          qualification: "M.Tech, Ph.D",
          experience: "8+ Years",
          specialization: "Biotechnology, Bioprocess Engineering",
        },
        {
          name: "Ms. Swetha E",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Biotechnology",
        },
        {
          name: "Mrs. Athira P Anand",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Biotechnology",
        },
        {
          name: "Mrs. Saranya T",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Biotechnology",
        },
        {
          name: "Mr. Rohan J",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "3+ Years",
          specialization: "Biotechnology",
        },
        {
          name: "Ms. Preethi S",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "3+ Years",
          specialization: "Biotechnology",
        },
      ],

      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "Biocon",
          "Dr. Reddy's Laboratories",
          "Sun Pharmaceutical",
          "Cipla",
          "Piramal Enterprises",
          "ITC Foods",
          "Nestlé",
          "Britannia",
        ],
        higherStudies: [
          "M.Tech / M.E. in Biotechnology / Chemical Engineering",
          "MBA",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "3.5 LPA",
        placementRate: "85%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2011" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── Civil Engineering ────────────────────────────────────────────────────────
  {
    slug: "ce",
    name: "Civil Engineering",
    abbr: "CIVIL",
    institution: "engineering",
    degree: "B.E.",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Comprehensive civil engineering program with strong focus on structural, environmental and infrastructure engineering. Includes PG program in Structural Engineering.",
    description:
      "The Department of Civil Engineering started in 2009-2010 with the objective to create outstanding engineers with advanced teaching and learning aids. The undergraduate program imparts mastery over civil engineering alongside knowledge of recent trends and developments.",
    outcomes: [
      "Excel as successful civil engineers, academicians and researchers",
      "Exhibit professionalism, ethical attitude, communication and managerial skills",
      "Work in design, construction and maintenance of infrastructure projects",
      "Adapt to current trends by engaging in lifelong learning",
    ],
    is_active: true,
    sort_order: 2,
    content: {
      name: "Civil Engineering",
      college: "engineering",
      shortName: "CIVIL",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.E.",

      about1:
        "The Department of Civil Engineering is started in the year 2009-2010. It has been started with the objective to create outstanding engineers, with advanced teaching and learning aids for the students. The department has well qualified faculty members and excellent laboratory facilities. The undergraduate program imparts students to master over the field of Civil Engineering besides knowledge of recent trends and development to shine as a successful civil engineer.",
      about2:
        "Students gain practical experience from field visits to the construction sites, dams and irrigation structures, etc. The department ranges a postgraduate program in order to provide wide knowledge on the core of Structural Engineering. Students gain training in their field of study through internships.",
      about3:
        "There is huge demand for civil engineers in India and it is expected to get a boost as the country gets ready to upgrade its infrastructure. Civil engineers are employed in the public and private sectors in large numbers in all branches of design, construction, and maintenance of roads, highways, bridges, dams, canals, docks, airports, and housing complexes.",

      established: "2009",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. V. Murugesh",
      hodDesignation: "Associate Professor and Head",
      hodQualification: "Ph.D, PDF",
      hodExperience: "Structural Engineering",
      hodMessage: [
        "Welcome to the Department of Civil Engineering at JCT College of Engineering and Technology.",
        "Our department strives to create outstanding civil engineers with strong foundations in structural, environmental and infrastructure engineering, ready to meet the challenges of a rapidly developing world.",
      ],

      vision:
        "To become leaders in Civil Engineering Education, to meet the most onerous challenges in construction, sanitation and environment at the global level.",

      mission: [
        "To produce outstanding Civil Engineering graduates with highest ethical values.",
        "To provide state-of-the-art learning and laboratory environments.",
        "To interact with Industries and address issues related to infrastructure and environment for sustainable living.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Professional Excellence",
          description:
            "Graduates will excel as successful civil engineers, academicians and researchers.",
        },
        {
          code: "PEO2",
          title: "Professionalism",
          description:
            "Graduates will exhibit professionalism, ethical attitude, communication and managerial skills, team work and social responsibility.",
        },
        {
          code: "PEO3",
          title: "Lifelong Learning",
          description:
            "Graduates shall adapt to current trends by engaging in lifelong learning.",
        },
      ],

      advisoryBoard: [
        {
          name: "Thiru. R. Durga Shankar",
          designation: "Secretary",
          organization: "JCT Group of Institutions, Coimbatore",
          role: "Chairman",
        },
        {
          name: "Dr. V. J. Arulkarthick",
          designation: "Principal",
          organization: "JCT College of Engineering and Technology, Coimbatore",
          role: "Member",
        },
        {
          name: "Mr. A. Chandrahasan",
          designation: "Administrative Officer",
          organization: "JCT Group of Institutions, Coimbatore",
          role: "Member",
        },
      ],
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. V. Murugesh",
          designation: "Associate Professor and Head",
          qualification: "Ph.D, PDF",
          experience: "15+ Years",
          specialization: "Structural Engineering",
        },
        {
          name: "Dr. Murugan A",
          designation: "Professor",
          qualification: "Ph.D",
          experience: "15+ Years",
          specialization: "Structural Engineering",
        },
        {
          name: "Mr. Hari G S",
          designation: "Assistant Professor",
          qualification: "M.E. (Ph.D)",
          experience: "8+ Years",
          specialization: "Structural Engineering",
        },
        {
          name: "Mr. M. Sadhasivam",
          designation: "Assistant Professor",
          qualification: "M.E. (Ph.D)",
          experience: "7+ Years",
          specialization: "Geotechnical Engineering",
        },
        {
          name: "Mr. Arul Ganapathy D",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Environmental Engineering",
        },
        {
          name: "Ms. Reshma P D",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Structural Engineering",
        },
        {
          name: "Ms. R. Jagedeswari",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Structural Engineering",
        },
        {
          name: "Ms. Vidhya B",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Construction Engineering and Management",
        },
        {
          name: "Ms. Nandhini S",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Structural Engineering",
        },
        {
          name: "Ms. Maloothin Margrat Nisha",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Construction Management",
        },
      ],

      labs: [
        {
          name: "Hydraulics Engineering Laboratory",
          description:
            "Equipped with instruments for fluid flow, open channel, pipe flow experiments.",
          equipment: [],
        },
        {
          name: "Structural Engineering Laboratory",
          description:
            "Facilities for testing concrete, steel and masonry structural members.",
          equipment: [],
        },
        {
          name: "Environmental Engineering Laboratory",
          description:
            "Equipped for water quality testing, waste water treatment analysis.",
          equipment: [],
        },
        {
          name: "Soil Mechanics Laboratory",
          description:
            "Facilities for soil classification, compaction, permeability and shear strength tests.",
          equipment: [],
        },
        {
          name: "Concrete Technology Laboratory",
          description:
            "Equipped for concrete mix design, compressive strength and durability testing.",
          equipment: [],
        },
        {
          name: "Transportation Engineering Laboratory",
          description:
            "Facilities for bitumen, aggregate and pavement material testing.",
          equipment: [],
        },
        {
          name: "Surveying Laboratory",
          description:
            "Equipped with total stations, levels, theodolites and GPS instruments.",
          equipment: [],
        },
      ],

      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "L&T Constructions",
          "DLF Building India",
          "HCC Infrastructure",
          "Afcons India Pvt. Ltd.",
          "NCC Ltd",
          "Indian Railways",
          "TNPSC Government Departments",
          "URC Constructions",
        ],
        higherStudies: [
          "M.E. / M.Tech in Structural / Environmental / Geotechnical Engineering",
          "MBA (Construction Management)",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "3.5 LPA",
        placementRate: "90%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2009" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "90%" },
      ],
    },
  },

  // ── Computer Science and Business Systems ───────────────────────────────────
  {
    slug: "csbs",
    name: "Computer Science and Business Systems",
    abbr: "CSBS",
    institution: "engineering",
    degree: "B.E.",
    duration: "4 Years",
    seats: 60,
    highlight:
      "TCS-designed curriculum combining core CS with business systems, analytics, ML, cloud computing and IoT for industry-ready graduates.",
    description:
      "Computer Science and Business Systems (CSBS) program enhances the relevance of computer science to meet future demands of IT industry evolving in the era of Business 4.0. Combines core computer science with management sciences, analytics and emerging technologies.",
    outcomes: [
      "Strong foundation in core computer science and business principles",
      "Proficiency in emerging technologies like Analytics, ML, Cloud Computing and IoT",
      "Industry-ready skills with exposure to real-world business systems",
      "Ethical values, innovation ability and leadership qualities",
    ],
    is_active: true,
    sort_order: 3,
    content: {
      name: "Computer Science and Business Systems",
      college: "engineering",
      shortName: "CSBS",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.E.",

      about1:
        "Computer Science and Business Systems (CSBS) program aims to enhance the relevance of the Computer Science program in India to meet the future demands of the IT industry whose landscape is rapidly changing in the era of Business 4.0. To address the growing need of engineering talent with skills in digital technology, leading academicians across India have designed a curriculum for this 4-year undergraduate program.",
      about2:
        "This curriculum aims to ensure that students graduating from the program not only know the core topics of Computer Science but also develop an equal appreciation of humanities, management sciences and human values. The students are also exposed to emerging topics such as Analytics, Machine Learning, Cloud Computing, Internet of Things etc. to make them industry ready at the end of four years of study.",
      about3:
        "The CSBS Department works closely with several related industries of repute. These relationships facilitate joint research, funded projects, and the opportunity to learn the latest technologies. Experts from industries and leading institutions are invited regularly for technical lectures under the association activities.",

      established: "2020",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Mrs. Malarvizhi K",
      hodDesignation: "Associate Professor and Head",
      hodQualification: "M.E. (Ph.D)",
      hodExperience: "Software Engineering",
      hodMessage: [
        "Welcome to the Department of Computer Science and Business Systems at JCT College of Engineering and Technology.",
        "Our department uniquely combines computer science fundamentals with business system knowledge to produce graduates who are truly industry-ready in the modern digital economy.",
      ],

      vision: "",
      mission: [],
      programOutcomes: [],
      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Mrs. Malarvizhi K",
          designation: "Associate Professor and Head",
          qualification: "M.E. (Ph.D)",
          experience: "10+ Years",
          specialization: "Software Engineering",
        },
        {
          name: "Mrs. Bhuvaneshwari R",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. K. Karthikumar",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. Agnes Princy",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Communication Systems",
        },
        {
          name: "Mr. Dhakshina Murthy R",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. Kanaga Priya P",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. Sowmya R",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. Siva Ranjani R",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mrs. M. S. Vinu",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. K. Baheerathan",
          designation: "Assistant Professor (POP)",
          qualification: "B.E.",
          experience: "3+ Years",
          specialization: "Computer Science and Engineering",
        },
      ],

      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "TCS",
          "Infosys",
          "Wipro",
          "Accenture",
          "Cognizant",
          "HCL Technologies",
          "Capgemini",
          "Amazon",
        ],
        higherStudies: [
          "M.Tech / M.E. in Computer Science / Business Systems",
          "MBA",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "4 LPA",
        placementRate: "92%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2020" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "92%" },
      ],
    },
  },

  // ── Computer Science and Engineering ────────────────────────────────────────
  {
    slug: "cse",
    name: "Computer Science and Engineering",
    abbr: "CSE",
    institution: "engineering",
    degree: "B.E.",
    duration: "4 Years",
    seats: 180,
    highlight:
      "NBA-accredited flagship CS program with 180 seats, strong research culture and industry-aligned curriculum covering AI, cloud computing, cybersecurity and IoT.",
    description:
      "The Department of Computer Science and Engineering was started in 2009 to develop competent professionals with innovative research capabilities. Equipped with state-of-the-art laboratories with internet and Wi-Fi facility.",
    outcomes: [
      "Apply foundational CS knowledge and modern tools to develop innovative solutions",
      "Demonstrate ethical behavior, leadership and social responsibility",
      "Pursue higher studies, certifications and collaborate in multidisciplinary teams",
      "Explore emerging technologies like AI, ML, Cloud Computing and Cybersecurity",
    ],
    is_active: true,
    sort_order: 4,
    content: {
      name: "Computer Science and Engineering",
      college: "engineering",
      shortName: "CSE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.E.",

      about1:
        "The Department of Computer Science and Engineering was started in the year 2009 to render services to the student community to meet as the global industrial experts. The department is well equipped with state of the art laboratories with internet and Wi-Fi facility.",
      about2:
        "The objective of the department is to develop competent professionals with innovative research capabilities. The students must do a project on or off-campus in the final year with an option to choose their platform and thus they are exposed to the real time computer problems which will mold them to conquer the challenging IT world.",
      about3:
        "Computer Engineers have plenty of options to work in IT companies in departments such as Design, Development, Assembly, Manufacture and Maintenance, etc. The Indian IT sector has lots of scope in terms of growth in employment opportunities. Top recruiters include Google, Yahoo, Microsoft, Intel, Apple, Sony, Accenture, IBM, Oracle, Facebook, HP, Amazon, Dell and government organizations like DRDO, ISRO, ECIL and BEL.",

      established: "2009",
      accreditation: "AICTE, NBA",
      intake: 180,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. G. Rajiv SureshKumar",
      hodDesignation: "Professor and Head",
      hodQualification: "Ph.D",
      hodExperience: "Computer Science and Engineering",
      hodMessage: [
        "Welcome to the Department of Computer Science and Engineering at JCT College of Engineering and Technology.",
        "Our department is committed to nurturing technically competent, innovative, and ethically responsible professionals who are prepared to meet global industry challenges and contribute to societal progress.",
      ],

      vision:
        "To become a center of excellence in Computer Science and Engineering by nurturing technically competent, innovative, and ethically responsible professionals who are prepared to meet global industry challenges and contribute to societal progress.",

      mission: [
        "To impart comprehensive education in Computer Science and Engineering with strong theoretical foundations and practical exposure.",
        "To cultivate innovation, research aptitude, and a spirit of entrepreneurship through cutting-edge technologies and project-based learning.",
        "To enhance industry readiness through internships, certifications, collaborative projects, and active engagement with academia and industry.",
        "To instill ethical values, social responsibility, and leadership qualities in students to contribute meaningfully to global and local communities.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Technical Innovation",
          description:
            "Graduates will apply foundational knowledge and modern tools of Computer Science and Engineering to develop innovative solutions, pursue higher studies, and adapt to evolving technologies in professional environments.",
        },
        {
          code: "PEO2",
          title: "Ethics and Leadership",
          description:
            "Graduates will demonstrate ethical behavior, leadership, and social responsibility while addressing technological and societal challenges, and will leverage their technical knowledge and creativity to drive innovation, initiate start-ups, or make meaningful contributions in industry or academia.",
        },
        {
          code: "PEO3",
          title: "Lifelong Learning",
          description:
            "Graduates will demonstrate a commitment to continuous learning, acquire relevant certifications, and collaborate effectively with multidisciplinary teams in diverse professional settings.",
        },
        {
          code: "PSO1",
          title: "Core Computing Proficiency",
          description:
            "Graduates will be able to apply the fundamentals of computer science, including data structures, algorithms, database systems, computer networks and computer architecture, to develop efficient computing solutions.",
        },
        {
          code: "PSO2",
          title: "Emerging Technologies and Research",
          description:
            "Graduates will be able to explore and apply emerging technologies such as Artificial Intelligence, Machine Learning, Cloud Computing, IoT, and Cyber security to solve real-world problems and pursue research.",
        },
      ],

      advisoryBoard: [
        {
          name: "Thiru. R. Durga Shankar",
          designation: "Secretary",
          organization: "JCT Group of Institutions, Coimbatore",
          role: "Chairman",
        },
        {
          name: "Dr. V. J. Arulkarthick",
          designation: "Principal",
          organization: "JCT College of Engineering and Technology, Coimbatore",
          role: "Member",
        },
        {
          name: "Mr. A. Chandrahasan",
          designation: "Administrative Officer",
          organization: "JCT Group of Institutions, Coimbatore",
          role: "Member",
        },
        {
          name: "Dr. S. Balamurugan",
          designation: "Director – Research and Development",
          organization: "Mindnotix Technologies, Coimbatore",
          role: "Industry Expert",
        },
        {
          name: "Dr. M. Rajalakshmi",
          designation: "Associate Professor, Dept of CSE & IT",
          organization: "Coimbatore Institute of Technology, Coimbatore",
          role: "Senior Academician",
        },
        {
          name: "Dr. G. Rajiv SureshKumar",
          designation: "Head of the Department",
          organization: "JCT College of Engineering and Technology, Coimbatore",
          role: "HOD",
        },
        {
          name: "Prof. K. Malarvizhi",
          designation: "Associate Professor",
          organization: "JCT College of Engineering and Technology, Coimbatore",
          role: "Senior Faculty",
        },
      ],
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. R. Venkatesh",
          designation: "Professor",
          qualification: "Ph.D",
          experience: "18+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Dr. P. D. R. Vijayakumar",
          designation: "Professor",
          qualification: "Ph.D",
          experience: "16+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Dr. S. Sakthi Vinayagam",
          designation: "Associate Professor",
          qualification: "Ph.D",
          experience: "14+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Dr. T. Rajendran",
          designation: "Associate Professor",
          qualification: "Ph.D",
          experience: "12+ Years",
          specialization: "Information and Communication Engineering",
        },
        {
          name: "Dr. D. Kalaiselvi",
          designation: "Associate Professor",
          qualification: "Ph.D",
          experience: "12+ Years",
          specialization: "Information and Communication Engineering",
        },
        {
          name: "Mr. G. Elavarasan",
          designation: "Assistant Professor",
          qualification: "Ph.D",
          experience: "8+ Years",
          specialization: "Information and Communication Engineering",
        },
        {
          name: "Ms. R. Yesodha",
          designation: "Assistant Professor",
          qualification: "Ph.D",
          experience: "8+ Years",
          specialization: "Computer Applications",
        },
        {
          name: "Ms. K. Lalithambigai",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "7+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. J. Arun",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. A. Asha",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. V. P. Leena",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. S. Sandhya",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. K. Haritha",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. Rincy M. Rafi",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. K. Rincy",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. T. Revathi",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. S. Rajeswari",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. P. Prabu",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Software Engineering",
        },
        {
          name: "Mr. V. Ashok Kumar",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. H. Vinothkumar",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. A. Sindhuja",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. K. Sudhir",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. K. Elangovan",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. S. Sathya",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Information Technology",
        },
        {
          name: "Mr. G. Saravanan",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. A. Divya",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. B. Raj Kumar",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Ms. E. Annal Sheeba Rani",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
        {
          name: "Mr. A. Ajith Kumar",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "Computer Science and Engineering",
        },
      ],

      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "Google",
          "Microsoft",
          "Amazon",
          "Infosys",
          "TCS",
          "Wipro",
          "Accenture",
          "IBM",
          "Oracle",
          "HCL Technologies",
          "Cognizant",
          "Capgemini",
        ],
        higherStudies: [
          "M.E. / M.Tech in Computer Science",
          "MBA",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad (USA, UK, Germany)",
        ],
        averagePackage: "4.5 LPA",
        placementRate: "95%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2009" },
        { icon: "Users", label: "Intake", value: "180 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, NBA" },
        { icon: "Briefcase", label: "Placement Rate", value: "95%" },
      ],
    },
  },

  // ── Electrical and Electronics Engineering ───────────────────────────────────
  {
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

      hodName: "Dr. B. Balraj",
      hodDesignation: "Professor, Dean-Academics and Head",
      hodQualification: "Ph.D",
      hodExperience: "Instrumentation Engineering",
      hodMessage: [
        "Welcome to the Department of Electrical and Electronics Engineering at JCT College of Engineering and Technology.",
        "Our department is committed to producing industry-ready engineers with technical expertise, innovation, and ethical values to meet global challenges in the power and electronics sectors.",
      ],

      vision:
        "To emerge as a center of excellence in Electrical and Electronics Engineering by producing industry-ready engineers with technical expertise, innovation, and ethical values to meet global challenges.",

      mission: [
        "To impart strong theoretical knowledge and practical skills in Electrical and Electronics Engineering through outcome-based education and continuous improvement.",
        "To promote innovation, ethical practices, leadership and lifelong learning through curricular, co-curricular, industry-engaged activities.",
        "To foster collaborations with academia, industry and research organizations for skill development, entrepreneurship, addressing societal challenges and solving technological problems.",
      ],

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
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Manoharan Subramanian",
          designation: "Professor",
          qualification: "Ph.D",
          experience: "18+ Years",
          specialization: "Electrical Machines",
        },
        {
          name: "Balraj Baskaran",
          designation: "Professor",
          qualification: "Ph.D",
          experience: "16+ Years",
          specialization: "Instrumentation Engineering",
        },
        {
          name: "S. Karthikumar",
          designation: "Professor",
          qualification: "Ph.D",
          experience: "15+ Years",
          specialization: "Applied Electronics",
        },
        {
          name: "Vimalraj Shanmugam",
          designation: "Professor",
          qualification: "Ph.D",
          experience: "14+ Years",
          specialization: "Applied Electronics",
        },
        {
          name: "Ganesh Ramanathan Meenashi",
          designation: "Associate Professor",
          qualification: "Ph.D",
          experience: "12+ Years",
          specialization: "Control and Instrumentation Engineering",
        },
        {
          name: "Saravanan Masakkalipalayam",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "7+ Years",
          specialization: "Power Electronics and Drives",
        },
        {
          name: "Nagarajan Duraisamy",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "7+ Years",
          specialization: "Power Electronics and Drives",
        },
        {
          name: "Gowtham Srinivasan Balakrishnan",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Power Electronics and Drives",
        },
        {
          name: "Satheesh Ramalingam",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Power Electronics and Drives",
        },
        {
          name: "Shobana Selvaraj",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Power System Engineering",
        },
        {
          name: "Dhamodharan Shanmugam",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Power Electronics and Drives",
        },
        {
          name: "Shanthi Madasamy",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Control and Instrumentation Engineering",
        },
        {
          name: "Ramya Peramiyagounder",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Power Electronics and Drives",
        },
        {
          name: "Saravanan Vasudevan",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Power Electronics and Drives",
        },
        {
          name: "Greeshma Chamakkad Sivanandan",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "4+ Years",
          specialization: "VLSI Design",
        },
      ],

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

      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
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
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2010" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "88%" },
      ],
    },
  },

  // ── Electronics and Communication Engineering ────────────────────────────────
  {
    slug: "ece",
    name: "Electronics and Communication Engineering",
    abbr: "ECE",
    institution: "engineering",
    degree: "B.E.",
    duration: "4 Years",
    seats: 120,
    highlight:
      "Comprehensive ECE program covering VLSI, embedded systems, communication and signal processing with strong industry linkages and placement record.",
    description:
      "The Department of Electronics and Communication Engineering came into existence at the faculty of Engineering in 2009 at JCT. The department imparts maximum knowledge to students and nourishes them to become capable engineers with high level of talent, professional ethics and creativity.",
    outcomes: [
      "Work in electronics and software companies in design, development, and research",
      "Excel in government services like IES, Railways, Defence and ISRO/DRDO",
      "Contribute to communication systems, VLSI design and embedded systems",
      "Engage in research and teaching in engineering colleges in India and abroad",
    ],
    is_active: true,
    sort_order: 6,
    content: {
      name: "Electronics and Communication Engineering",
      college: "engineering",
      shortName: "ECE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.E.",

      about1:
        "The Department Of Electronics and Communication Engineering came into existence at the faculty of Engineering in 2009 at JCT. Rapidly changing needs of telecommunication industry coupled with indispensible need for Electronics has fabricated this specific branch. Apart from the prescribed curriculum, students at JCT are kept in close contact with the industry to make them capable of tackling their professional challenges.",
      about2:
        "The Department Of Electronics and Communication Engineering imparts maximum knowledge to students and nourishes them to capable engineer with high level of talent, professional ethics and creativity. The major goal is to produce highly knowledgeable, competent and resourceful young engineers who can perform well in a wide variety of job profiles. The curriculum provides a strong foundation in both the analytic and technological aspects of E&C Engineering.",
      about3:
        "Electronics and Communication engineers cover a whole spectrum of fields including civilian and military industries concerned with generation and transmission of signals, designing electronics and communications equipment, satellite communications systems, electromagnetic radiation, and instrumentation used in radar and sonar systems. They also work in entertainment, research establishments and defence, with opportunities in teaching and research.",

      established: "2009",
      accreditation: "AICTE",
      intake: 120,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. G. Emayavaramban",
      hodDesignation: "Associate Professor and Head",
      hodQualification: "M.E./M.Tech, Ph.D",
      hodExperience: "Applied Electronics",
      hodMessage: [
        "Welcome to the Department of Electronics and Communication Engineering at JCT College of Engineering and Technology.",
        "Our department is dedicated to empowering students with deep technical knowledge in electronics, communication systems and embedded technologies to excel in a rapidly evolving industry.",
      ],

      vision:
        "Electronics and Communication engineering department aims to empower the budding engineers to meet current and imminent challenges in creative research and employment with technological excellence.",

      mission: [
        "To provide all necessary inputs to excel in domain knowledge both in theory and practical.",
        "To provide creativity, development activities, integration, sharing and applying knowledge about electronics and communication technologies.",
        "To provide the opportunities for innovation and collaborative research with industry and academia.",
      ],

      programOutcomes: [],

      advisoryBoard: [
        {
          name: "Thiru. R. Durga Shankar",
          designation: "Secretary",
          organization: "JCT Institutions, Coimbatore",
          role: "Chairman",
        },
        {
          name: "Dr. V. J. Arulkarthick",
          designation: "Principal",
          organization: "JCTCET, Coimbatore",
          role: "Member",
        },
        {
          name: "Mr. A. Chandrahasan",
          designation: "Administrative Officer",
          organization: "JCT Institutions, Coimbatore",
          role: "Member",
        },
        {
          name: "Dr. S. Uma Maheswari",
          designation: "Professor, Department of ECE",
          organization: "Coimbatore Institute of Technology, Coimbatore",
          role: "Senior Academician",
        },
        {
          name: "Dr. Pushpavalli",
          designation: "Associate Professor, Department of ECE",
          organization: "Bannari Amman College of Technology, Sathyamangalam",
          role: "Senior Academician",
        },
        {
          name: "Mr. L. Jegadheesan",
          designation: "Chief Executive Officer",
          organization: "Aristats e-Solutions, Trichy",
          role: "Industry Expert",
        },
        {
          name: "Mrs. Deepika Ramalingam",
          designation: "Verification Engineer",
          organization: "Maxvy Technologies, Bengaluru",
          role: "Alumni Representative",
        },
      ],
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. G. Emayavaramban",
          designation: "Associate Professor and Head",
          qualification: "M.E./M.Tech, Ph.D",
          experience: "14+ Years",
          specialization: "Applied Electronics",
        },
        {
          name: "D. Vedha Vinodha",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "7+ Years",
          specialization: "Communication Systems",
        },
        {
          name: "Thahseen Thahir",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "6+ Years",
          specialization: "VLSI Design",
        },
        {
          name: "A. Sindhu",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "6+ Years",
          specialization: "VLSI Design",
        },
        {
          name: "E. Pavithra",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "5+ Years",
          specialization: "VLSI Design",
        },
        {
          name: "S. Silpa",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "5+ Years",
          specialization: "VLSI Design",
        },
        {
          name: "M. Sownthara",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "5+ Years",
          specialization: "VLSI Design",
        },
        {
          name: "K. Kumar",
          designation: "Assistant Professor",
          qualification: "M.S.",
          experience: "5+ Years",
          specialization: "Micro Electronics",
        },
        {
          name: "B. Manikandan",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "5+ Years",
          specialization: "VLSI Design",
        },
        {
          name: "M. Chandrasekaran",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "5+ Years",
          specialization: "Applied Electronics",
        },
        {
          name: "K. Babu",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "4+ Years",
          specialization: "Communication Systems",
        },
        {
          name: "S. Mohanapriya",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "4+ Years",
          specialization: "Communication Systems",
        },
      ],

      labs: [
        {
          name: "Basic Electronics Laboratory",
          description:
            "Fundamentals of electronic components and basic circuit experiments.",
          equipment: [],
        },
        {
          name: "Analog and Digital Electronics Laboratory",
          description: "Experiments in analog and digital circuit design.",
          equipment: [],
        },
        {
          name: "Circuit Simulation and Linear Integrated Circuits Laboratory",
          description: "Simulation tools and LIC experiments.",
          equipment: [],
        },
        {
          name: "Communication Systems Laboratory",
          description:
            "Experiments in AM/FM modulation, demodulation and communication.",
          equipment: [],
        },
        {
          name: "Digital Signal Processing Laboratory",
          description: "DSP processor kits and MATLAB-based signal processing.",
          equipment: [],
        },
        {
          name: "Microprocessor and Microcontroller Laboratory",
          description:
            "8085/8086 kits and ARM-based microcontroller experiments.",
          equipment: [],
        },
        {
          name: "VLSI Laboratory",
          description: "FPGA boards and VHDL/Verilog simulation tools.",
          equipment: [],
        },
        {
          name: "Optical and Microwave Laboratory",
          description:
            "Optical fiber experiments and microwave transmission setups.",
          equipment: [],
        },
        {
          name: "Embedded Laboratory",
          description:
            "Embedded systems kits for IoT and real-time application development.",
          equipment: [],
        },
      ],

      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "DMRC",
          "Siemens",
          "Motorola",
          "Intel",
          "Texas Instruments",
          "BEL",
          "ISRO",
          "DRDO",
          "Accenture",
          "Wipro",
          "HCL Technologies",
          "Nvidia",
          "Samsung",
          "Tech Mahindra",
          "TCS",
        ],
        higherStudies: [
          "M.E. / M.Tech in ECE / VLSI / Embedded Systems",
          "MBA",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "4 LPA",
        placementRate: "92%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2009" },
        { icon: "Users", label: "Intake", value: "120 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "92%" },
      ],
    },
  },

  // ── Food Technology ──────────────────────────────────────────────────────────
  {
    slug: "ft",
    name: "Food Technology",
    abbr: "FT",
    institution: "engineering",
    degree: "B.Tech",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Multidisciplinary program in food processing, preservation, quality control and safety with MoUs with major food industry partners.",
    description:
      "The Food Technology department creates trained and skilled human resources for the rapidly growing food processing sector. It is a multidisciplinary course covering processing, preservation, chemistry, quality, safety and marketing aspects of food and food products.",
    outcomes: [
      "Successful career in food and allied industries at various levels of management",
      "Core technical skills to pursue lifelong learning and research",
      "Deliver innovative solutions to address industrial and societal challenges",
      "Work in food processing industries, research laboratories, hotels and quality control",
    ],
    is_active: true,
    sort_order: 7,
    content: {
      name: "Food Technology",
      college: "engineering",
      shortName: "FT",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.Tech",

      about1:
        "The main objective of the food technology department is to create trained and skilled human resources to cater to the needs of the rapidly growing food processing sector. The department is also intended to provide technical support to farmers and entrepreneurs to establish small scale industries. Food Science and Technology is a multidisciplinary course which includes subjects on processing, preservation, chemistry, quality, safety and marketing aspects of food and food products.",
      about2:
        "The curriculum has been framed in such a manner that by the time the student completes this degree program, the entrepreneur skill is already developed and they are fit to work in research, teaching and industry. The department is well equipped with new laboratories with internet and Wi-Fi connectivity.",
      about3:
        "Graduates in Food Technology have vast scope in food processing industries, research laboratories, hotels, soft drink factories, quality control, rice mills, manufacturing industries, and distilleries. Public sector undertakings like Food Corporation of India require people to handle purchase, storage, transportation, and distribution of food grains and other processed food items.",

      established: "2011",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. P. Balamurugan",
      hodDesignation: "Professor and Head",
      hodQualification: "Ph.D",
      hodExperience: "Chemical Engineering",
      hodMessage: [
        "Welcome to the Department of Food Technology at JCT College of Engineering and Technology.",
        "Our department is committed to developing food technology professionals who are equipped to address the challenges of the rapidly growing food processing industry with innovation and ethical responsibility.",
      ],

      vision:
        "To provide a platform for overall development of the students, to be more creative, innovative, ethical and globally competent food technocrats.",

      mission: [
        "To inculcate in-depth knowledge of Food Technology with an ability to analyze, evaluate, design and integrate existing and new knowledge.",
        "Imparting knowledge and technical skills for better processing and value addition of food and agro-products.",
        "Creating a multi-disciplinary platform capable of conducting research, technology development, solving industrial and social challenges on top of classroom teaching.",
        "To educate our students by teaching them leadership, entrepreneurship, teamwork, values, quality and ethics.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Industry Career",
          description:
            "Graduates will have successful career in food and allied industries at various levels of management.",
        },
        {
          code: "PEO2",
          title: "Technical Excellence",
          description:
            "Graduates will have the core technical skills and knowledge that will empower them to pursue lifelong learning and research.",
        },
        {
          code: "PEO3",
          title: "Innovation and Ethics",
          description:
            "Graduates will deliver innovative solutions and services to address industrial and societal challenges, upholding ethical principles and social responsibility.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. P. Balamurugan",
          designation: "Professor and Head",
          qualification: "Ph.D",
          experience: "15+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Dr. A. Allwyn Sundarraj",
          designation: "Associate Professor",
          qualification: "Ph.D",
          experience: "10+ Years",
          specialization: "Food Technology",
        },
        {
          name: "Ms. Priyanga J",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Food Technology",
        },
        {
          name: "Ms. Jamuna Sri N",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Biotechnology",
        },
        {
          name: "Ms. Sneha Mahesh",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "3+ Years",
          specialization: "Food Technology",
        },
        {
          name: "Ms. Anvy S Isaac",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "3+ Years",
          specialization: "Food Technology",
        },
        {
          name: "Ms. Subasree T V",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "3+ Years",
          specialization: "Food Technology",
        },
        {
          name: "Ms. Pavithra S",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "3+ Years",
          specialization: "Food Technology",
        },
        {
          name: "Mr. Sridhar A",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "3+ Years",
          specialization: "Biotechnology",
        },
      ],

      labs: [
        {
          name: "Food Microbiology Laboratory",
          description: "Facilities for microbial analysis of food products.",
          equipment: [],
        },
        {
          name: "Food Chemistry Laboratory",
          description: "Equipped for chemical analysis of food components.",
          equipment: [],
        },
        {
          name: "Food Analysis Laboratory",
          description:
            "Instruments for quality analysis and testing of food products.",
          equipment: [],
        },
        {
          name: "Chemical Engineering Laboratory",
          description: "Unit operations equipment for food processing.",
          equipment: [],
        },
        {
          name: "Bioprocess Laboratory",
          description: "Facilities for fermentation and bioprocess studies.",
          equipment: [],
        },
        {
          name: "Food Production Analysis Laboratory",
          description: "Equipment for production quality control and analysis.",
          equipment: [],
        },
        {
          name: "Bakery and Confectionery Laboratory",
          description:
            "Equipped for practical training in baked goods and confectionery production.",
          equipment: [],
        },
        {
          name: "Food Production and Preservation Laboratory",
          description:
            "Facilities for food preservation and production techniques.",
          equipment: [],
        },
        {
          name: "Skills for New Product Development Laboratory",
          description:
            "Innovation lab for developing and testing new food products.",
          equipment: [],
        },
        {
          name: "Dairy Process Laboratory",
          description:
            "Equipped for dairy processing and analysis experiments.",
          equipment: [],
        },
      ],

      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "Food Corporation of India",
          "ITC Foods",
          "Nestlé",
          "Britannia",
          "Amul",
          "Haldiram's",
          "PepsiCo",
          "Hindustan Unilever",
          "Benchmark Tea Factory",
          "Meenalakshmi Farm Products",
        ],
        higherStudies: [
          "M.Tech / M.E. in Food Technology",
          "MBA (Food Business Management)",
          "GATE Qualified",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "3.5 LPA",
        placementRate: "85%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2011" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── PG: M.E. Structural Engineering ─────────────────────────────────────────
  {
    slug: "structural-engineering",
    name: "M.E. Structural Engineering",
    abbr: "ME-SE",
    institution: "engineering",
    degree: "M.E.",
    duration: "2 Years",
    seats: 18,
    highlight:
      "Postgraduate program in advanced structural engineering analysis, design and construction management under the Civil Engineering department.",
    description:
      "The M.E. Structural Engineering program provides wide knowledge on the core of Structural Engineering. Students gain training in their field of study through internships and research projects.",
    outcomes: [
      "Excel in advanced structural analysis and design",
      "Contribute to research and development in structural engineering",
      "Apply modern computational tools for structural simulation",
      "Work in consultancy, government agencies and research organizations",
    ],
    is_active: true,
    sort_order: 8,
    content: {
      name: "M.E. Structural Engineering",
      college: "engineering",
      shortName: "ME-SE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "M.E.",

      about1:
        "The Department of Civil Engineering offers a postgraduate program — M.E. Structural Engineering — to provide wide knowledge on the core of Structural Engineering. The program started as an extension of the Civil Engineering department established in 2009-2010.",
      about2:
        "Students gain training in their field of study through internships, advanced projects and industry collaborations. The program focuses on advanced structural analysis, design of complex structures, and the application of modern computational tools.",
      about3: "",

      established: "2009",
      accreditation: "AICTE",
      intake: 18,
      affiliation: "Anna University, Chennai",
      duration: "2 Years",

      hodName: "Dr. V. Murugesh",
      hodDesignation: "Associate Professor and Head",
      hodQualification: "Ph.D, PDF",
      hodExperience: "Structural Engineering",
      hodMessage: [],

      vision:
        "To become leaders in Civil Engineering Education, to meet the most onerous challenges in construction, sanitation and environment at the global level.",

      mission: [
        "To produce outstanding Civil Engineering graduates with highest ethical values.",
        "To provide state-of-the-art learning and laboratory environments.",
        "To interact with Industries and address issues related to infrastructure and environment for sustainable living.",
      ],

      programOutcomes: [],
      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],
      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "L&T Constructions",
          "DRDO",
          "Research Organizations",
          "Government PWD",
          "Consulting Firms",
        ],
        higherStudies: ["Ph.D Research Programs"],
        averagePackage: "5 LPA",
        placementRate: "90%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2009" },
        { icon: "Users", label: "Intake", value: "18 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "2 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "90%" },
      ],
    },
  },

  // ── PG: M.E. Power Electronics and Drives ───────────────────────────────────
  {
    slug: "power-electronics",
    name: "M.E. Power Electronics and Drives",
    abbr: "ME-PED",
    institution: "engineering",
    degree: "M.E.",
    duration: "2 Years",
    seats: 18,
    highlight:
      "Postgraduate program in advanced power electronics, drives, renewable energy and embedded control systems.",
    description:
      "M.E. Power Electronics and Drives started in 2012 under the EEE department with an intake of 18 students. The program focuses on advanced power electronics, motor drives, renewable energy systems and modern control techniques.",
    outcomes: [
      "Apply advanced knowledge in power electronics and drives for industrial applications",
      "Design and develop renewable energy systems and electric drives",
      "Contribute to research in power electronics, control systems and embedded technologies",
      "Work in power industry, research organizations and as faculty",
    ],
    is_active: true,
    sort_order: 9,
    content: {
      name: "M.E. Power Electronics and Drives",
      college: "engineering",
      shortName: "ME-PED",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "M.E.",

      about1:
        "The M.E. Power Electronics and Drives programme started in 2012 under the Electrical and Electronics Engineering department with an intake of 18 students. The programme focuses on advanced power conversion, motor drives, renewable energy systems and modern control techniques.",
      about2:
        "The faculty of this department elicit excellent commitment, and they possess high qualification credentials to provide technical education of utmost standards. Students are offered innovative workshops, guest lectures, and informative industrial visits on a regular basis.",
      about3: "",

      established: "2012",
      accreditation: "AICTE",
      intake: 18,
      affiliation: "Anna University, Chennai",
      duration: "2 Years",

      hodName: "Dr. B. Balraj",
      hodDesignation: "Professor, Dean-Academics and Head",
      hodQualification: "Ph.D",
      hodExperience: "Instrumentation Engineering",
      hodMessage: [],

      vision:
        "Emerging as a Center of Excellence in Electrical and Electronics Engineering education for studies and research.",

      mission: [
        "To create state-of-art facilities for teaching, learning, laboratory practices and research.",
        "To develop competent engineers through value addition programs and industry interaction.",
        "To produce research-oriented graduates who can contribute to power and energy sectors.",
      ],

      programOutcomes: [],
      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],
      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "BHEL",
          "ONGC",
          "Siemens",
          "ABB",
          "ISRO",
          "DRDO",
          "Renewable Energy Companies",
        ],
        higherStudies: ["Ph.D Research Programs"],
        averagePackage: "5 LPA",
        placementRate: "90%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2012" },
        { icon: "Users", label: "Intake", value: "18 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "2 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "90%" },
      ],
    },
  },

  // ── PG: M.E. CSE (Artificial Intelligence and Machine Learning) ───────────
  {
    slug: "cse-aiml",
    name: "M.E. Computer Science Engineering (AI & ML)",
    abbr: "ME-CSE",
    institution: "engineering",
    degree: "M.E.",
    duration: "2 Years",
    seats: 18,
    highlight:
      "Advanced postgraduate program in AI, machine learning and data science under the Computer Science and Engineering department.",
    description:
      "M.E. CSE (Artificial Intelligence and Machine Learning) prepares graduates with advanced skills in intelligent data analysis, machine learning, deep learning and big data analytics.",
    outcomes: [
      "Apply advanced AI and ML techniques to solve complex real-world problems",
      "Conduct research and publish findings in AI and machine learning domains",
      "Develop intelligent systems for healthcare, business, eCommerce and social platforms",
      "Lead technology teams and contribute to innovation in AI-driven industries",
    ],
    is_active: true,
    sort_order: 10,
    content: {
      name: "M.E. Computer Science Engineering (AI & ML)",
      college: "engineering",
      shortName: "ME-CSE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "M.E.",

      about1:
        "M.E. CSE (Artificial Intelligence and Machine Learning) prepares students with advanced skills to perform intelligent data analysis. The program covers core technologies such as artificial intelligence, data mining, data modelling, machine learning and big data analytics at a postgraduate level.",
      about2:
        "Students will gain cross-disciplinary skills across fields such as statistics, computer science, machine learning and logic. The major focus is to equip graduates with statistical, mathematical reasoning, machine learning, knowledge discovery and visualization skills for industry and research.",
      about3: "",

      established: "2021",
      accreditation: "AICTE",
      intake: 18,
      affiliation: "Anna University, Chennai",
      duration: "2 Years",

      hodName: "Dr. G. Rajiv SureshKumar",
      hodDesignation: "Professor and Head",
      hodQualification: "Ph.D",
      hodExperience: "Computer Science and Engineering",
      hodMessage: [],

      vision: "",
      mission: [],
      programOutcomes: [],
      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],
      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "Google",
          "Microsoft",
          "Amazon",
          "IBM Research",
          "Adobe",
          "Nvidia",
          "Intel",
          "Data Science Companies",
        ],
        higherStudies: ["Ph.D Research Programs"],
        averagePackage: "6 LPA",
        placementRate: "90%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2021" },
        { icon: "Users", label: "Intake", value: "18 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "2 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "90%" },
      ],
    },
  },

  // ── PG: Ph.D. EEE (Doctoral Programme) ──────────────────────────────────────
  {
    slug: "eee-doctoral",
    name: "Ph.D. Electrical and Electronics Engineering",
    abbr: "PhD-EEE",
    institution: "engineering",
    degree: "Ph.D.",
    duration: "3-5 Years",
    seats: 10,
    highlight:
      "Doctoral research program in Electrical and Electronics Engineering with focus on power electronics, renewable energy and intelligent control systems.",
    description:
      "The Ph.D. programme in Electrical and Electronics Engineering provides opportunities for advanced research in power systems, power electronics, drives, instrumentation and control engineering.",
    outcomes: [
      "Conduct original research contributing to global knowledge in EEE domains",
      "Publish research findings in reputed national and international journals",
      "Develop innovative solutions for challenges in power, energy and electronics sectors",
      "Pursue careers in academia, research organizations and industry R&D",
    ],
    is_active: true,
    sort_order: 11,
    content: {
      name: "Ph.D. Electrical and Electronics Engineering",
      college: "engineering",
      shortName: "PhD-EEE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "Ph.D.",

      about1:
        "The Ph.D. programme in Electrical and Electronics Engineering is offered under the EEE department established in 2010. The programme provides opportunities for advanced research in power systems, power electronics, drives, instrumentation and control engineering.",
      about2:
        "Research scholars are guided by highly qualified faculty members who are actively engaged in research activities. The department provides excellent infrastructure and laboratory facilities to support doctoral research.",
      about3: "",

      established: "2010",
      accreditation: "AICTE",
      intake: 10,
      affiliation: "Anna University, Chennai",
      duration: "3-5 Years",

      hodName: "Dr. B. Balraj",
      hodDesignation: "Professor, Dean-Academics and Head",
      hodQualification: "Ph.D",
      hodExperience: "Instrumentation Engineering",
      hodMessage: [],

      vision:
        "Emerging as a Center of Excellence in Electrical and Electronics Engineering education for studies and research.",
      mission: [
        "To create state-of-art facilities for teaching, learning, laboratory practices and research.",
        "To develop competent engineers through value addition programs and research mentorship.",
      ],

      programOutcomes: [],
      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],
      labs: [],
      teachingLearning: { overview: "", methods: [], tools: [], practices: [] },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "IITs and NITs as Faculty",
          "DRDO",
          "ISRO",
          "TNEB Research Wing",
          "Industry R&D Centers",
        ],
        higherStudies: ["Post-Doctoral Research", "Academic Positions"],
        averagePackage: "8 LPA",
        placementRate: "95%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2010" },
        { icon: "Users", label: "Intake", value: "10 Scholars" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "3-5 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "95%" },
      ],
    },
  },
  // ── Mechanical Engineering ───────────────────────────────────────────────────
  {
    slug: "mech",
    name: "Mechanical Engineering",
    abbr: "MECH",
    institution: "engineering",
    degree: "B.E.",
    duration: "4 Years",
    seats: 120,
    highlight:
      "Flagship mechanical engineering department established in 2009 with focus on design, manufacturing, thermal and materials engineering backed by experienced research-active faculty.",
    description:
      "The Mechanical Engineering Department at JCT College of Engineering started functioning from 2009 with an intake of 60 and expanded to 120 students from 2010. The department offers quality education in Design, Manufacturing, Thermal and Materials engineering with research-active faculty.",
    outcomes: [
      "Work in automobiles, aerospace, energy, manufacturing and government sector organizations",
      "Apply knowledge in design, manufacturing, thermal and materials engineering",
      "Engage in research and innovation in emerging fields of mechanical engineering",
      "Demonstrate leadership, ethical values and social responsibility as professional engineers",
    ],
    is_active: true,
    sort_order: 12,
    content: {
      name: "Mechanical Engineering",
      college: "engineering",
      shortName: "MECH",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.E.",

      about1:
        "Mechanical Engineering Department of JCT College of Engineering started functioning from the year 2009 with a sanctioned intake of 60 students per annum and from the year 2010 with a sanctioned intake of 120 students per annum. The focus of the department is to offer quality education in the specialized fields of Design, Manufacturing, Thermal and Materials engineering.",
      about2:
        "The might of the Department, apart from its Students, is its Qualified and Experienced Faculty/Staff. Faculties are actively engaged in Teaching and mentoring students apart from pursuing their research activities in the emerging fields of engineering. The department has a resourceful team of faculty that mostly consists of PG holders. Faculty members regularly attend technical workshops and seminars organized by various technical institutes, and many of them have presented papers at national level seminars.",
      about3:
        "Major Industries that employ Mechanical Engineers include Automobiles, Space research, Aeronautical, Energy and utilities, Air conditioning, Bio-Mechanical industry. Other major employers include giant manufacturing plants, Air conditioning and refrigeration industry, Turbine manufacturing plants, oil and Gas exploration and refining industries and the Agricultural sector. In the Government sector, Mechanical Engineers can provide their knowledge to various government run projects in the role of technical experts and consultants — in Defence, PWD, CPWD, Technical Wings of Armed Forces, Space Research Organization.",

      established: "2009",
      accreditation: "AICTE",
      intake: 120,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "",
      hodDesignation: "Professor and Head",
      hodQualification: "Ph.D",
      hodExperience: "Mechanical Engineering",
      hodMessage: [],

      vision:
        "To be a foremost department in the field of Mechanical engineering, producing competent and socially responsible professional engineers as well as contributing to research.",

      mission: [
        "To cultivate a competitive atmosphere that encourages creative and novel concepts through hands on training.",
        "To create a perpetual learning environment that encourages ethics, leadership and research endeavour.",
        "To establish and maintain a strong bridge between the department and the industries to promote placement, internship and collaborative research.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Professional Excellence",
          description:
            "Graduates will work as competent Mechanical Engineers in industry, government organizations and research institutions.",
        },
        {
          code: "PEO2",
          title: "Higher Studies",
          description:
            "Graduates will pursue higher education in India and abroad, demonstrating research aptitude and lifelong learning.",
        },
        {
          code: "PEO3",
          title: "Ethics and Leadership",
          description:
            "Graduates will exhibit professionalism, ethical attitude, communication and managerial skills with social responsibility.",
        },
        {
          code: "PSO1",
          title: "Core Mechanical Design",
          description:
            "Graduates will apply principles of design, manufacturing, thermal and fluid engineering to solve industrial problems.",
        },
        {
          code: "PSO2",
          title: "Modern Tools",
          description:
            "Graduates will use modern CAD/CAM software, simulation tools and manufacturing technologies to develop engineering solutions.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "Engineering Practices Laboratory",
          description:
            "Basic machining, fitting, welding and carpentry practices.",
          equipment: [],
        },
        {
          name: "Fluid Mechanics and Machinery Laboratory",
          description:
            "Experiments on pumps, turbines, pipe flow and fluid properties.",
          equipment: [],
        },
        {
          name: "Thermal Engineering Laboratory",
          description:
            "IC engines, refrigeration and heat transfer experiments.",
          equipment: [],
        },
        {
          name: "Strength of Materials Laboratory",
          description:
            "Testing of tensile, compression, torsion and hardness of materials.",
          equipment: [],
        },
        {
          name: "Manufacturing Technology Laboratory",
          description: "Lathe, milling, grinding and CNC machining operations.",
          equipment: [],
        },
        {
          name: "Metrology and Measurements Laboratory",
          description:
            "Precision measuring instruments and surface finish measurement.",
          equipment: [],
        },
        {
          name: "CAD/CAM Laboratory",
          description:
            "AutoCAD, CATIA, SolidWorks and CNC programming software.",
          equipment: ["AutoCAD", "CATIA", "SolidWorks"],
        },
        {
          name: "Dynamics Laboratory",
          description:
            "Experiments in vibrations, balancing and dynamics of machinery.",
          equipment: [],
        },
        {
          name: "Heat Transfer Laboratory",
          description:
            "Conduction, convection and radiation heat transfer experiments.",
          equipment: [],
        },
        {
          name: "Mechatronics and Control Systems Laboratory",
          description:
            "PLC, pneumatics and hydraulics for automation experiments.",
          equipment: ["PLC"],
        },
      ],

      teachingLearning: {
        overview: "",
        methods: [],
        tools: ["AutoCAD", "CATIA", "SolidWorks", "ANSYS"],
        practices: [],
      },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "Mercedes Benz",
          "Tata Motors",
          "Volkswagen Group",
          "BMW",
          "Maruti Suzuki",
          "Mahindra",
          "L&T",
          "BHEL",
          "Thermax",
          "Suzlon",
          "DRDO",
          "ISRO",
        ],
        higherStudies: [
          "M.E. / M.Tech in Mechanical / Manufacturing / Thermal Engineering",
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
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2009" },
        { icon: "Users", label: "Intake", value: "120 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "88%" },
      ],
    },
  },

  // ── Petrochemical Technology ─────────────────────────────────────────────────
  {
    slug: "pct",
    name: "Petrochemical Technology",
    abbr: "PCT",
    institution: "engineering",
    degree: "B.Tech",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Specialized program combining chemical engineering fundamentals with petroleum refining, polymer science and downstream petrochemical industry training.",
    description:
      "B.Tech Petrochemical Technology is a specialized branch combining chemical engineering with downstream petroleum operations. Students gain expertise in refining, polymer science, petrochemical plant operations, and process engineering for careers in refineries, petrochemical complexes and allied industries.",
    outcomes: [
      "Work in refineries, petrochemical plants and downstream petroleum industries",
      "Apply process engineering principles to design and optimize petrochemical operations",
      "Conduct research and development in petrochemical processes and materials",
      "Pursue higher studies in chemical / petrochemical engineering",
    ],
    is_active: true,
    sort_order: 13,
    content: {
      name: "Petrochemical Technology",
      college: "engineering",
      shortName: "PCT",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.Tech",

      about1:
        "B.Tech Petrochemical Technology is a specialized undergraduate program that combines the fundamentals of chemical engineering with downstream petroleum operations. The department equips students with expertise in crude oil refining, polymer science, petrochemical plant operations, and process engineering.",
      about2:
        "The curriculum covers core chemical engineering subjects along with specialized courses in petroleum refining, polymer technology, industrial catalysis, process simulation and petrochemical plant design. Students gain hands-on experience in well-equipped laboratories and through industrial visits to refineries and petrochemical complexes.",
      about3:
        "Graduates in Petrochemical Technology have wide career opportunities in refineries (IOCL, BPCL, HPCL, Reliance), petrochemical plants (ONGC, Chemplast Sanmar, SPIC), polymer industries, paint and coating companies, and R&D organizations. The program also prepares students for GATE and higher studies in chemical engineering.",

      established: "2011",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "",
      hodDesignation: "Professor and Head",
      hodQualification: "Ph.D",
      hodExperience: "Chemical Engineering",
      hodMessage: [],

      vision:
        "To produce competent petrochemical engineers with strong technical knowledge, innovation and ethics to meet the challenges of the global petrochemical industry.",

      mission: [
        "Impart comprehensive knowledge in petrochemical technology, refinery operations, polymer science and process engineering.",
        "Provide state-of-art laboratory facilities and industry interactions to develop practical skills for the petrochemical sector.",
        "Foster research aptitude, entrepreneurship and lifelong learning among students.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Industry Career",
          description:
            "Graduates will have successful careers in refineries, petrochemical plants and allied industries.",
        },
        {
          code: "PEO2",
          title: "Research & Higher Studies",
          description:
            "Graduates will pursue higher education and research in chemical and petrochemical engineering.",
        },
        {
          code: "PEO3",
          title: "Professional Ethics",
          description:
            "Graduates will demonstrate ethical behavior, teamwork and social responsibility in professional practice.",
        },
        {
          code: "PSO1",
          title: "Process Design",
          description:
            "Graduates will apply chemical engineering and petrochemical process knowledge to design and optimize industrial operations.",
        },
        {
          code: "PSO2",
          title: "Simulation and Safety",
          description:
            "Graduates will use process simulation tools and apply HSE (Health, Safety, Environment) standards in petrochemical operations.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "Chemical Engineering Laboratory",
          description:
            "Unit operations experiments including distillation, absorption and extraction.",
          equipment: [],
        },
        {
          name: "Petroleum Refining Laboratory",
          description:
            "Distillation of crude fractions, characterization of petroleum products.",
          equipment: [],
        },
        {
          name: "Polymer Technology Laboratory",
          description:
            "Experiments in polymer synthesis, characterization and processing.",
          equipment: [],
        },
        {
          name: "Process Simulation Laboratory",
          description: "HYSYS, Aspen Plus for chemical process simulation.",
          equipment: ["HYSYS", "Aspen Plus"],
        },
        {
          name: "Instrumental Analysis Laboratory",
          description:
            "GC, HPLC, spectroscopy for analysis of petrochemical samples.",
          equipment: ["GC", "HPLC"],
        },
        {
          name: "Reaction Engineering Laboratory",
          description:
            "Fixed bed, fluidized bed reactor experiments and kinetics studies.",
          equipment: [],
        },
        {
          name: "Quality Control Laboratory",
          description:
            "Physical and chemical testing of petroleum and polymer products.",
          equipment: [],
        },
      ],

      teachingLearning: {
        overview: "",
        methods: [],
        tools: ["HYSYS", "Aspen Plus"],
        practices: [],
      },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "Indian Oil Corporation (IOCL)",
          "Bharat Petroleum (BPCL)",
          "Hindustan Petroleum (HPCL)",
          "Reliance Industries",
          "ONGC",
          "Chemplast Sanmar",
          "SPIC",
          "IG Petrochemicals",
        ],
        higherStudies: [
          "M.Tech / M.E. in Chemical / Petrochemical Engineering",
          "MBA (Oil & Gas Management)",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "3.5 LPA",
        placementRate: "85%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2011" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── Petroleum Engineering ────────────────────────────────────────────────────
  {
    slug: "pe",
    name: "Petroleum Engineering",
    abbr: "PE",
    institution: "engineering",
    degree: "B.Tech",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Unique program covering upstream petroleum operations — exploration, drilling, reservoir engineering and production — for careers in oil and gas exploration companies.",
    description:
      "B.Tech Petroleum Engineering prepares students for upstream oil and gas operations including exploration, drilling, reservoir characterization, well logging and production engineering. Graduates pursue careers in ONGC, Oil India, international E&P companies and oilfield service providers.",
    outcomes: [
      "Work in oil exploration, drilling, reservoir engineering and production companies",
      "Apply geological, geophysical and engineering principles to upstream petroleum operations",
      "Pursue higher studies or research in petroleum / reservoir engineering",
      "Demonstrate professional ethics and environmental responsibility in petroleum operations",
    ],
    is_active: true,
    sort_order: 14,
    content: {
      name: "Petroleum Engineering",
      college: "engineering",
      shortName: "PE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.Tech",

      about1:
        "B.Tech Petroleum Engineering is a unique program that prepares students for careers in upstream oil and gas operations. The program covers the full lifecycle of petroleum operations — from exploration and drilling to reservoir management and production engineering.",
      about2:
        "The curriculum integrates geological and geophysical concepts with engineering principles, covering drilling technology, well logging, reservoir simulation, production optimization and petroleum economics. Students develop competency in modern oilfield software tools and gain exposure to industry practices through industrial visits and internships.",
      about3:
        "Petroleum engineers are in high demand globally in exploration and production (E&P) companies, oilfield services firms (Schlumberger, Halliburton, Baker Hughes), national oil companies (ONGC, Oil India), and government regulatory bodies. The program also prepares students for GATE and postgraduate studies in petroleum / reservoir engineering.",

      established: "2011",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "",
      hodDesignation: "Professor and Head",
      hodQualification: "Ph.D",
      hodExperience: "Petroleum Engineering",
      hodMessage: [],

      vision:
        "To be a premier centre for petroleum engineering education, producing technically competent and globally employable engineers for the oil and gas industry.",

      mission: [
        "Provide rigorous education in petroleum engineering fundamentals including drilling, reservoir and production engineering.",
        "Develop industry-ready graduates through modern simulation tools, field visits and industry interaction.",
        "Foster research aptitude and entrepreneurial mindset for innovation in petroleum and allied energy sectors.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Industry Career",
          description:
            "Graduates will have successful careers in oil exploration, drilling, production and oilfield services companies.",
        },
        {
          code: "PEO2",
          title: "Research & Higher Studies",
          description:
            "Graduates will pursue advanced studies and research in petroleum, reservoir or chemical engineering.",
        },
        {
          code: "PEO3",
          title: "Professional Ethics",
          description:
            "Graduates will exhibit ethical behavior, environmental responsibility and professionalism in petroleum operations.",
        },
        {
          code: "PSO1",
          title: "Upstream Operations",
          description:
            "Graduates will apply drilling, reservoir and production engineering principles to upstream petroleum field operations.",
        },
        {
          code: "PSO2",
          title: "Simulation and Analysis",
          description:
            "Graduates will use reservoir simulation, well logging analysis and petroleum economics tools for decision-making.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "Drilling Engineering Laboratory",
          description:
            "Equipment for drilling fluid preparation, filter press tests and viscosity measurements.",
          equipment: [],
        },
        {
          name: "Reservoir Engineering Laboratory",
          description:
            "Core flooding apparatus, permeability measurement and fluid saturation experiments.",
          equipment: [],
        },
        {
          name: "Well Logging and Petrophysics Laboratory",
          description:
            "Log interpretation software and petrophysical analysis tools.",
          equipment: [],
        },
        {
          name: "Petroleum Production Laboratory",
          description:
            "Experiments in well testing, artificial lift and production optimization.",
          equipment: [],
        },
        {
          name: "Reservoir Simulation Laboratory",
          description:
            "Eclipse, CMG or Petrel simulation software for reservoir modelling.",
          equipment: ["Eclipse"],
        },
        {
          name: "Mud Engineering Laboratory",
          description:
            "Drilling mud formulation, testing and contamination studies.",
          equipment: [],
        },
        {
          name: "Petroleum Geology Laboratory",
          description:
            "Rock and fluid sample analysis, thin section microscopy and basin analysis.",
          equipment: [],
        },
      ],

      teachingLearning: {
        overview: "",
        methods: [],
        tools: ["Eclipse", "Petrel"],
        practices: [],
      },
      valueAddedCourses: [],
      events: [],
      studentParticipation: { clubs: [], highlights: [] },
      studentAchievements: [],
      facultyAchievements: [],
      facultyParticipation: { conferences: [], workshops: [] },
      careerProgression: {
        topRecruiters: [
          "ONGC",
          "Oil India Limited",
          "Schlumberger",
          "Halliburton",
          "Baker Hughes",
          "Reliance Industries",
          "Cairn India",
          "GAIL",
        ],
        higherStudies: [
          "M.Tech in Petroleum / Reservoir Engineering",
          "MBA (Oil & Gas Management)",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad (USA, UK, Norway)",
        ],
        averagePackage: "4 LPA",
        placementRate: "85%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2011" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Anna University",
        },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `\nEngineering Dept Content Seed — ${DRY_RUN ? "DRY RUN" : "LIVE"}`,
  );
  console.log(`Target slugs: ${PROGRAMS.map((p) => p.slug).join(", ")}\n`);

  if (DRY_RUN) {
    console.log("Dry-run mode: no changes will be written to the database.");
    console.log("Re-run without --dry-run to apply.\n");
    for (const p of PROGRAMS) {
      console.log(
        `  • ${p.name} (slug: ${p.slug}, degree: ${p.degree}, seats: ${p.seats})`,
      );
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
      // Destructure to keep image out of the update payload entirely
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
