#!/usr/bin/env node
/**
 * Usage:
 *   MONGODB_URI="..." node scripts/seed-deptcontent-arts-science.mjs
 *   node scripts/seed-deptcontent-arts-science.mjs          # reads .env automatically
 *   node scripts/seed-deptcontent-arts-science.mjs --dry-run
 *
 * Upserts arts & science UG program department content sourced from the jct-backup.
 * Only the 5 programs that have backup pages are seeded; the other two are left untouched.
 * NEVER modifies the `image` field on existing documents.
 *
 * Target slugs (match existing DB records):
 *   bsc-computer-science, bsc-ai-ml, bca, bcom-logistics-supply-chain, bba-logistics
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

// ─── Shared UG programme outcomes (Programme Outcomes per NEP/NAAC pattern) ──

const UG_POS = [
  {
    code: "PO1",
    title: "Disciplinary Knowledge",
    description:
      "Capability of demonstrating comprehensive knowledge of the discipline and an understanding of one or more domains which form part of an interdisciplinary field of study.",
  },
  {
    code: "PO2",
    title: "Critical Thinking",
    description:
      "Capability to apply analytic thought to a body of knowledge; analyse and evaluate evidence, arguments, claims, beliefs on the basis of empirical evidence; identify relevant assumptions or implications; formulate coherent arguments; critically evaluate practices, policies and theories by following scientific approach to knowledge development.",
  },
  {
    code: "PO3",
    title: "Problem Solving",
    description:
      "Capacity to extrapolate from what one has learned and apply their competencies to solve different kinds of non-familiar problems, rather than replicate curriculum content knowledge.",
  },
  {
    code: "PO4",
    title: "Analytical Reasoning",
    description:
      "Ability to evaluate the reliability and relevance of evidence; identify logical flaws and holes in the arguments of others; analyze and synthesize data from a variety of sources; draw valid conclusions and support them with evidence and examples and addressing opposing viewpoints.",
  },
  {
    code: "PO5",
    title: "Research-related Skills",
    description:
      "A sense of inquiry and capability for asking relevant/appropriate questions, problematising, synthesising and articulating; ability to recognise cause-and-effect relationships, define problems, formulate hypotheses, test hypotheses, analyse, interpret and draw conclusions from data; predict cause-and-effect relationships; ability to plan, execute and report the results of an experiment or investigation.",
  },
  {
    code: "PO6",
    title: "Transdisciplinary",
    description:
      "Ability to identify, evaluate, and apply theories, methodologies and frameworks developed across disciplines.",
  },
  {
    code: "PO7",
    title: "Personal and Professional Competence",
    description:
      "Ability to lead and work in teams, to manage projects and to communicate effectively.",
  },
  {
    code: "PO8",
    title: "Communication Skills",
    description:
      "Ability to express thoughts and ideas effectively in writing and orally; communicate with others using appropriate media; confidently share one's views and express herself/himself.",
  },
  {
    code: "PO9",
    title: "Moral and Ethical Awareness/Reasoning",
    description:
      "Ability to embrace moral/ethical values in conducting one's life, formulate a position/argument about an ethical issue from multiple perspectives, and use ethical practices in all work.",
  },
  {
    code: "PO10",
    title: "Lifelong Learning",
    description:
      "Ability to acquire knowledge and skills, including 'learning how to learn', that are necessary for participating in learning activities throughout life, through self-paced and self-directed learning aimed at personal development, meeting economic, social and cultural objectives.",
  },
];

// ─── Program data ─────────────────────────────────────────────────────────────

const PROGRAMS = [
  // ── B.Sc. Computer Science ──────────────────────────────────────────────────
  {
    slug: "bsc-computer-science",
    name: "B.Sc. Computer Science",
    abbr: "BSc CS",
    institution: "arts-science",
    degree: "B.Sc.",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Foundation technology program building deep understanding of data structures, algorithms and software design for lifelong quality careers in a competitive global environment.",
    description:
      "Bachelor of Computer Science (B.Sc. CS) is the foundation technology for building a rich and fulfilling information society. Students are taught not just how to program in multiple languages but also acquire deeper understanding of data structures, control structures, basic algorithms and methods involved in software design and construction.",
    outcomes: [
      "Apply knowledge of data structures, algorithms and programming to solve real-world problems",
      "Design and develop software solutions using industry-standard methodologies",
      "Pursue higher studies or careers in software development, IT and related fields",
      "Demonstrate ethical values and lifelong learning attitude in professional practice",
    ],
    is_active: true,
    sort_order: 0,
    content: {
      name: "B.Sc. Computer Science",
      college: "arts-science",
      shortName: "BSc CS",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      heroImage: "/site_assests/cas.jpeg",
      degreePrefix: "B.Sc.",

      about1:
        "Bachelor of Computer Science (B.Sc. CS) is the foundation technology for building a rich and fulfilling information society. At the department, students are not simply taught how to program in multiple languages, but they are also given the practical training to acquire a deeper understanding, such as the basics of data structures and control structures, basic algorithms and methods involved in software design and constructions.",
      about2:
        "The department provides students with the propitious platform and standard education in Computer Science education and reinforce their potential for lifelong quality career in the highly competitive global environment.",
      about3: "",

      established: "2014",
      accreditation: "AICTE, Bharathiar University",
      intake: 60,
      affiliation: "Bharathiar University, Coimbatore",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Computer Science",
      hodMessage: [],

      vision:
        "To provide quality education in Computer Science that empowers students to succeed in the global information technology industry and contribute to society.",

      mission: [
        "Impart strong theoretical and practical knowledge in core Computer Science areas including data structures, algorithms, databases and software engineering.",
        "Foster critical thinking, analytical skills and problem-solving abilities for a smooth transition from academic to real-life work environment.",
        "Prepare students for productive careers in IT and allied industries and motivate them for higher studies and research.",
      ],

      programOutcomes: [
        ...UG_POS,
        {
          code: "PSO1",
          title: "Core CS Competency",
          description:
            "Graduates will demonstrate proficiency in programming, data structures, algorithms, databases and software development practices.",
        },
        {
          code: "PSO2",
          title: "Technology Adaptation",
          description:
            "Graduates will be able to apply current and emerging computing technologies to solve real-world problems.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "Programming Laboratory",
          description:
            "Facilities for programming in C, C++, Java, Python with modern IDEs.",
          equipment: [],
        },
        {
          name: "Database Laboratory",
          description:
            "Oracle, MySQL and PostgreSQL for relational database management and SQL practice.",
          equipment: [],
        },
        {
          name: "Web Technology Laboratory",
          description:
            "HTML, CSS, JavaScript, PHP and frameworks for full-stack web development.",
          equipment: [],
        },
        {
          name: "Network Laboratory",
          description:
            "Networking devices and simulation software for computer network experiments.",
          equipment: [],
        },
        {
          name: "Project Laboratory",
          description:
            "Dedicated computing resources for final year project development and testing.",
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
          "TCS",
          "Infosys",
          "Wipro",
          "Cognizant",
          "HCL Technologies",
          "Tech Mahindra",
        ],
        higherStudies: [
          "M.Sc. Computer Science",
          "MCA",
          "MBA",
          "M.Tech. (Lateral Entry)",
        ],
        averagePackage: "3 LPA",
        placementRate: "85%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Bharathiar University",
        },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── B.Sc. Artificial Intelligence & Machine Learning ────────────────────────
  {
    slug: "bsc-ai-ml",
    name: "B.Sc. Artificial Intelligence & Machine Learning",
    abbr: "BSc AI/ML",
    institution: "arts-science",
    degree: "B.Sc.",
    duration: "3 Years",
    seats: 60,
    highlight:
      "One of the fastest-growing fields in technology — equipping students with statistical reasoning, machine learning and data analytics skills for careers across health care, business, social networks and more.",
    description:
      "B.Sc. Artificial Intelligence & Machine Learning programme prepares students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications. The department provides core technologies such as artificial intelligence, data mining, machine learning and big data analytics.",
    outcomes: [
      "Apply machine learning algorithms and statistical reasoning to analyse real-world datasets",
      "Build intelligent data-driven applications in domains like healthcare, business and social networking",
      "Pursue higher studies or careers in data science, AI research and allied fields",
      "Demonstrate cross-disciplinary skills across statistics, computer science and logic",
    ],
    is_active: true,
    sort_order: 1,
    content: {
      name: "B.Sc. Artificial Intelligence & Machine Learning",
      college: "arts-science",
      shortName: "BSc AI/ML",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      heroImage: "/site_assests/cas.jpeg",
      degreePrefix: "B.Sc.",

      about1:
        "B.Sc. Artificial Intelligence & Machine learning programme prepare students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications. During the past ten years, data science has emerged as one of the most high-growth, dynamic and lucrative careers in technology.",
      about2:
        "The department aims to provide not only the core technologies such as artificial intelligence, data mining and data modelling but also gives intensive inputs in areas of machine learning and big data analytics.",
      about3:
        "The students will gain cross-disciplinary skills across fields such as statistics, computer science, machine learning, and logic. Data scientists may have career opportunities in health care, business, social networking companies, climatology, biotechnology, genetics and other important areas. The major focus of the department is to equip students with statistical, mathematical reasoning, machine learning, knowledge discovery and visualization skills.",

      established: "2021",
      accreditation: "AICTE, Bharathiar University",
      intake: 60,
      affiliation: "Bharathiar University, Coimbatore",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Artificial Intelligence & Machine Learning",
      hodMessage: [],

      vision:
        "To be a centre of excellence in Artificial Intelligence and Machine Learning education, producing graduates who drive innovation and solve complex real-world problems through data-driven approaches.",

      mission: [
        "Provide comprehensive education in core AI/ML technologies including deep learning, natural language processing, computer vision and big data analytics.",
        "Equip students with statistical, mathematical reasoning and visualization skills to tackle problems in diverse domains.",
        "Foster research aptitude and industry readiness through project-based learning and cross-disciplinary collaboration.",
      ],

      programOutcomes: [
        ...UG_POS,
        {
          code: "PSO1",
          title: "AI/ML Application",
          description:
            "Graduates will apply machine learning algorithms, statistical tools and AI frameworks to analyse data and build intelligent systems.",
        },
        {
          code: "PSO2",
          title: "Data-Driven Problem Solving",
          description:
            "Graduates will use data science methodologies to identify patterns, extract insights and deliver solutions across various industry domains.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "Machine Learning Laboratory",
          description:
            "Python, TensorFlow, PyTorch and scikit-learn for building and evaluating ML models.",
          equipment: ["Python", "TensorFlow", "PyTorch", "scikit-learn"],
        },
        {
          name: "Data Analytics Laboratory",
          description:
            "R, Pandas, NumPy and Jupyter notebooks for data analysis and visualization.",
          equipment: ["R", "Pandas", "NumPy", "Jupyter"],
        },
        {
          name: "Deep Learning Laboratory",
          description:
            "GPU-enabled workstations for training deep neural networks.",
          equipment: [],
        },
        {
          name: "Natural Language Processing Laboratory",
          description:
            "Tools and corpora for NLP, sentiment analysis and text classification.",
          equipment: [],
        },
        {
          name: "Big Data Laboratory",
          description:
            "Hadoop, Spark and cloud computing platforms for large-scale data processing.",
          equipment: ["Hadoop", "Spark"],
        },
      ],

      teachingLearning: {
        overview: "",
        methods: [],
        tools: ["Python", "TensorFlow", "R", "Jupyter"],
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
          "Amazon",
          "Google",
          "Microsoft",
          "Zoho",
          "Freshworks",
          "Analytics Companies",
          "Healthcare IT Firms",
        ],
        higherStudies: [
          "M.Sc. Data Science / AI",
          "M.Tech. Machine Learning",
          "MBA Analytics",
          "PhD in AI/ML",
        ],
        averagePackage: "4 LPA",
        placementRate: "88%",
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
          value: "Bharathiar University",
        },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "88%" },
      ],
    },
  },

  // ── BCA (Bachelor of Computer Applications) ─────────────────────────────────
  {
    slug: "bca",
    name: "Bachelor of Computer Applications",
    abbr: "BCA",
    institution: "arts-science",
    degree: "B.C.A.",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Industry-oriented three-year degree covering databases, networking, programming languages and communication skills for smooth transition from academia to professional IT careers.",
    description:
      "BCA is a three-year undergraduate degree program for candidates wishing to start a career in computers and its applications. The department provides graduates with the required skills from fundamentals to current technologies to create efficient solutions for industrial and real-life problems.",
    outcomes: [
      "Design and develop software solutions using core programming languages and modern frameworks",
      "Apply knowledge of databases, networking and data structures to real-world IT problems",
      "Demonstrate critical, analytical thinking and problem solving abilities for a professional IT career",
      "Communicate effectively and work as part of interdisciplinary teams",
    ],
    is_active: true,
    sort_order: 2,
    content: {
      name: "Bachelor of Computer Applications",
      college: "arts-science",
      shortName: "BCA",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      heroImage: "/site_assests/cas.jpeg",
      degreePrefix: "B.C.A.",

      about1:
        "BCA is a three-year undergraduate degree program for candidates wishing to start a career in computers and its applications. This department aims to provide the graduates the required skills from fundamentals to current technologies for them to create efficient solution for industrial and real-life problems.",
      about2:
        "The department provides the graduates with the knowledge and promotes innovative thoughts by addressing design and developmental trade-offs in the IT industry. It comprises of papers like database, networking, data structure, core programming languages like 'C' and 'Java'. This course develops critical, analytical thinking and problem solving abilities for a smooth transition from academic to real-life work environment. In addition, students are trained in communication skills and interdisciplinary topics to enhance their skills and employment opportunities.",
      about3: "",

      established: "2014",
      accreditation: "AICTE, Bharathiar University",
      intake: 60,
      affiliation: "Bharathiar University, Coimbatore",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Computer Applications",
      hodMessage: [],

      vision:
        "To nurture competent IT professionals with strong application development skills, innovative mindset and ethical values to thrive in the dynamic global technology landscape.",

      mission: [
        "Impart comprehensive knowledge in computer applications including programming, databases, networking and software development.",
        "Develop critical thinking, problem solving and communication skills essential for the IT industry.",
        "Create industry-ready graduates with hands-on training and exposure to current technologies and development practices.",
      ],

      programOutcomes: [
        ...UG_POS,
        {
          code: "PSO1",
          title: "Application Development",
          description:
            "Graduates will design, develop and test software applications using industry-standard programming languages, frameworks and tools.",
        },
        {
          code: "PSO2",
          title: "IT Problem Solving",
          description:
            "Graduates will apply knowledge of data structures, databases and networking to analyse and solve problems in real-world IT environments.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "C & C++ Programming Laboratory",
          description:
            "Facilities for structured programming and object-oriented programming practice.",
          equipment: [],
        },
        {
          name: "Java Laboratory",
          description:
            "Java SE/EE programming, applets and enterprise application development.",
          equipment: [],
        },
        {
          name: "Database Management Laboratory",
          description:
            "SQL, PL/SQL and database design experiments using Oracle/MySQL.",
          equipment: [],
        },
        {
          name: "Networking Laboratory",
          description:
            "LAN configuration, protocol analysis and network simulation tools.",
          equipment: [],
        },
        {
          name: "Web Development Laboratory",
          description:
            "HTML, CSS, JavaScript, PHP for front-end and back-end web development.",
          equipment: [],
        },
      ],

      teachingLearning: {
        overview: "",
        methods: [],
        tools: ["Java", "C/C++", "MySQL"],
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
          "TCS",
          "Infosys",
          "Wipro",
          "Cognizant",
          "HCL",
          "Capgemini",
          "NIIT Technologies",
        ],
        higherStudies: [
          "MCA",
          "M.Sc. Computer Science",
          "M.Tech. (Lateral Entry)",
          "MBA",
        ],
        averagePackage: "3 LPA",
        placementRate: "85%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Bharathiar University",
        },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },

  // ── B.Com. Logistics & Supply Chain Management ───────────────────────────────
  {
    slug: "bcom-logistics-supply-chain",
    name: "B.Com. Logistics & Supply Chain Management",
    abbr: "BCom SCM",
    institution: "arts-science",
    degree: "B.Com.",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Value-based commerce program integrating finance, taxation, business law, HR and logistics management — preparing graduates for modern business and supply chain careers.",
    description:
      "B.Com. Logistics & Supply Chain Management builds wide-ranging knowledge in accounting, finance, taxation and commercial law while providing specialized expertise in logistics and supply chain domain, equipping graduates to work effectively in modern business and non-business organizations.",
    outcomes: [
      "Apply accounting, finance and taxation principles to commercial and logistics contexts",
      "Manage supply chain operations using modern IT and analytical tools",
      "Demonstrate professional ethics, leadership and team skills in business environments",
      "Pursue higher studies in commerce, management or logistics specializations",
    ],
    is_active: true,
    sort_order: 3,
    content: {
      name: "B.Com. Logistics & Supply Chain Management",
      college: "arts-science",
      shortName: "BCom SCM",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      heroImage: "/site_assests/cas.jpeg",
      degreePrefix: "B.Com.",

      about1:
        "The focus of the department is to build the wide range of knowledge in the areas of accounting concepts and techniques to meet the current and future requirement of the industry.",
      about2:
        "The department aims to develop the strong knowledge in the areas such as finance, taxation, and laws relating to commerce. This helps to relate the conceptual and analytical skills in the field of auditing, finance etc.",
      about3:
        "This programme offers the students value-based education by acquiring adequate knowledge, skill and attitude to creatively and systematically apply the principles and practices of management, accountancy, finance, business law, statistics, HR, operations and IT to management problems and work effectively in modern day business and non-business organizations specifically in areas of Logistics and Supply Chain Management. Inculcate the students to nurture their skills in personal, interpersonal, intellectual and other skills to develop their professional career and growth.",

      established: "2014",
      accreditation: "AICTE, Bharathiar University",
      intake: 60,
      affiliation: "Bharathiar University, Coimbatore",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Commerce & Logistics",
      hodMessage: [],

      vision:
        "To be a premier department delivering value-based commerce education with a focus on logistics and supply chain management, producing graduates who contribute to global trade and commerce.",

      mission: [
        "Build comprehensive knowledge in accounting, finance, taxation and business law as foundations for professional commerce careers.",
        "Provide specialized expertise in logistics, supply chain management and IT applications relevant to modern business operations.",
        "Inculcate professional ethics, interpersonal skills and entrepreneurial mindset to support graduates' career and growth aspirations.",
      ],

      programOutcomes: [
        ...UG_POS,
        {
          code: "PSO1",
          title: "Commerce & Finance Competency",
          description:
            "Graduates will demonstrate knowledge of accounting, finance, auditing, taxation and business laws applicable in diverse commercial settings.",
        },
        {
          code: "PSO2",
          title: "Logistics & SCM Expertise",
          description:
            "Graduates will apply logistics and supply chain management principles supported by IT tools to optimise business operations.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "Tally Laboratory",
          description: "Tally ERP for accounting, inventory and GST practice.",
          equipment: ["Tally ERP"],
        },
        {
          name: "Commerce Computing Laboratory",
          description:
            "MS Office, Excel and business software tools for commerce applications.",
          equipment: ["MS Excel", "MS Word"],
        },
        {
          name: "Logistics Simulation Lab",
          description:
            "Supply chain simulation and logistics planning software.",
          equipment: [],
        },
      ],

      teachingLearning: {
        overview: "",
        methods: [],
        tools: ["Tally ERP", "MS Excel"],
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
          "DHL",
          "FedEx",
          "Maersk",
          "Container Corporation of India",
          "Flipkart",
          "Amazon Logistics",
          "Local Trading Firms",
        ],
        higherStudies: [
          "M.Com.",
          "MBA (Logistics / Finance)",
          "PGDM",
          "CA / CMA (Foundation)",
        ],
        averagePackage: "3 LPA",
        placementRate: "83%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Bharathiar University",
        },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "83%" },
      ],
    },
  },

  // ── BBA Logistics ────────────────────────────────────────────────────────────
  {
    slug: "bba-logistics",
    name: "BBA Logistics",
    abbr: "BBA",
    institution: "arts-science",
    degree: "B.B.A.",
    duration: "3 Years",
    seats: 60,
    highlight:
      "Three-year full-time business administration degree specializing in logistics — providing holistic business perspective with in-depth industry knowledge in the logistic domain.",
    description:
      "BBA Logistics is a three-year full-time degree program covering the concepts and processes involved in logistics. Logistic management includes the designing and administration to control the flow of materials to all business units. The curriculum equips students with required business expertise and industry-centric knowledge.",
    outcomes: [
      "Design and administer logistics operations including supply chain and material flow management",
      "Demonstrate critical thinking to formulate research problems and provide valid logistical conclusions",
      "Apply holistic business perspective with in-depth knowledge of the logistics domain",
      "Pursue management careers or higher studies in business administration and logistics",
    ],
    is_active: true,
    sort_order: 4,
    content: {
      name: "BBA Logistics",
      college: "arts-science",
      shortName: "BBA",
      bgColor: "#1E3A5F",
      accentColor: "#FFC917",
      heroImage: "/site_assests/cas.jpeg",
      degreePrefix: "B.B.A.",

      about1:
        "BBA Logistics, a three-year full time degree program essentially covering the concepts and process involved in logistics. Logistic management includes the designing and administration to control the flow of materials to all business units.",
      about2:
        "The curriculum is designed to give a holistic business perspective with in-depth industry knowledge in logistic domain. It equips students with required business expertise and industry-centric knowledge.",
      about3:
        "Demonstrate the critical thinking mindset and the ability to identify and formulate research problems, research literature, design tools, analyze and interpret data, and synthesize the information to provide valid conclusions and Logistical approaches across a variety of subject matter.",

      established: "2014",
      accreditation: "AICTE, Bharathiar University",
      intake: 60,
      affiliation: "Bharathiar University, Coimbatore",
      duration: "3 Years",

      hodName: "",
      hodDesignation: "Head of Department",
      hodQualification: "",
      hodExperience: "Business Administration & Logistics",
      hodMessage: [],

      vision:
        "To develop competent business management professionals with specialized logistics expertise who can lead and innovate in the evolving global supply chain ecosystem.",

      mission: [
        "Provide a strong foundation in business administration covering management, marketing, finance, HR and operations alongside specialized logistics knowledge.",
        "Develop critical thinking, research and analytical skills for effective decision-making in logistics and supply chain environments.",
        "Foster entrepreneurial mindset, industry interaction and ethical values to prepare graduates for leadership roles in business and logistics.",
      ],

      programOutcomes: [
        ...UG_POS,
        {
          code: "PSO1",
          title: "Logistics Management",
          description:
            "Graduates will plan, design and manage logistics operations including transportation, warehousing, inventory and supply chain coordination.",
        },
        {
          code: "PSO2",
          title: "Business Decision-Making",
          description:
            "Graduates will apply management principles, analytical tools and research methodologies to make effective decisions in business and logistics contexts.",
        },
      ],

      advisoryBoard: [],
      pac: [],
      bos: [],
      curriculum: [],
      faculty: [],

      labs: [
        {
          name: "Business Computing Laboratory",
          description:
            "MS Office, ERP and business intelligence tools for management applications.",
          equipment: ["MS Office", "ERP Software"],
        },
        {
          name: "Logistics Simulation Laboratory",
          description:
            "Supply chain and logistics planning simulation software and case study materials.",
          equipment: [],
        },
      ],

      teachingLearning: {
        overview: "",
        methods: [],
        tools: ["MS Office", "ERP Software"],
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
          "DHL",
          "Maersk",
          "Blue Dart",
          "Delhivery",
          "DTDC",
          "Amazon Logistics",
          "Flipkart",
          "Local Logistics Firms",
        ],
        higherStudies: [
          "MBA (Logistics / Operations)",
          "PGDM",
          "M.Com.",
          "MBA Marketing / HR",
        ],
        averagePackage: "3 LPA",
        placementRate: "82%",
      },
      feedback: {
        curriculumProcess: [],
        facilityProcess: [],
        recentImprovements: [],
      },
      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2014" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        {
          icon: "GraduationCap",
          label: "Affiliation",
          value: "Bharathiar University",
        },
        { icon: "Clock", label: "Duration", value: "3 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "82%" },
      ],
    },
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `\nArts & Science Dept Content Seed — ${DRY_RUN ? "DRY RUN" : "LIVE"}`,
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
