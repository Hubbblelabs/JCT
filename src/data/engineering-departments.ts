import type { DepartmentData } from "@/types/department";

const ENGINEERING_PO = [
  {
    code: "PO1",
    title: "Engineering Knowledge",
    description:
      "Apply mathematics, science, engineering fundamentals, and specialization knowledge to solve complex engineering problems.",
  },
  {
    code: "PO2",
    title: "Problem Analysis",
    description:
      "Identify, formulate, review research literature, and analyze complex engineering problems using first principles.",
  },
  {
    code: "PO3",
    title: "Design / Development",
    description:
      "Design system components and processes that meet specified needs with consideration for health, safety, and sustainability.",
  },
  {
    code: "PO4",
    title: "Investigations",
    description:
      "Use research-based knowledge and methods, including design of experiments and data interpretation, to derive valid conclusions.",
  },
  {
    code: "PO5",
    title: "Modern Tool Usage",
    description:
      "Create, select, and apply appropriate techniques and modern engineering tools while understanding limitations.",
  },
  {
    code: "PO6",
    title: "Engineer and Society",
    description:
      "Apply reasoning informed by contextual knowledge to assess societal, health, legal, and cultural issues.",
  },
  {
    code: "PO7",
    title: "Environment and Sustainability",
    description:
      "Understand environmental impact and demonstrate the need for sustainable development in engineering solutions.",
  },
  {
    code: "PO8",
    title: "Ethics",
    description:
      "Apply ethical principles and commit to professional ethics and responsibilities in engineering practice.",
  },
  {
    code: "PO9",
    title: "Individual and Team Work",
    description:
      "Function effectively as an individual and as a member or leader in multidisciplinary teams.",
  },
  {
    code: "PO10",
    title: "Communication",
    description:
      "Communicate effectively on complex engineering activities through reports, presentations, and technical documentation.",
  },
  {
    code: "PO11",
    title: "Project Management and Finance",
    description:
      "Apply engineering and management principles to manage projects in multidisciplinary environments.",
  },
  {
    code: "PO12",
    title: "Life-Long Learning",
    description:
      "Recognize the need for and have the preparation to engage in independent and lifelong learning.",
  },
] as const;

const ENGINEERING_UG_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence and Data Science",
  "Computer Science and Business Systems",
  "Petroleum Engineering",
  "Petrochemical Technology",
  "Food Technology",
  "Bio-Technology and Bio-Chemical Engineering",
] as const;

const ENGINEERING_PG_COURSES = [
  "Structural Engineering",
  "Power Electronics and Drives",
  "CSE (Artificial Intelligence & Machine Learning)",
] as const;

const ENGINEERING_DOCTORAL_COURSES = [
  "Electrical and Electronics Engineering (Doctoral Programme)",
] as const;

const ENGINEERING_STAFF_BODIES = [
  "Management",
  "Administration",
  "Governing Council Members",
  "Planning & Monitoring Board",
  "Controller of Examination (COE)",
  "Training and Placement Office (TPO Contacts)",
  "Research Advisory Committee",
] as const;

const ENGINEERING_FACULTY_SUPPORT_UNITS = [
  "Communication Development Cell",
  "Entrepreneurship Development Cell",
  "Innovation and Incubation Centre",
  "Career Counseling",
  "Soft skill development",
  "Remedial coaching",
  "Language lab",
  "Bridge courses",
  "Yoga and meditation",
  "Personal Counseling",
] as const;

function buildEngineeringCurriculum(
  prefix: string,
): DepartmentData["curriculum"] {
  const buildSemesters = (regYear: string) =>
    Array.from({ length: 8 }, (_, index) => {
      const semester = index + 1;
      return {
        semester,
        subjects: [
          {
            code: `${prefix}${semester}01`,
            name:
              semester < 3
                ? "Engineering Mathematics"
                : `Core Engineering Subject`,
            credits: 4,
            type: "Core" as const,
          },
          {
            code: `${prefix}${semester}02`,
            name:
              semester < 3
                ? "Engineering Science"
                : `Department Elective (${regYear})`,
            credits: 3,
            type: semester < 3 ? ("Theory" as const) : ("Elective" as const),
          },
          {
            code: `${prefix}${semester}03`,
            name: "Laboratory / Practical",
            credits: 2,
            type: "Lab" as const,
          },
          {
            code: `${prefix}${semester}04`,
            name:
              semester === 8
                ? "Project Work"
                : "Professional Skill Development",
            credits: regYear === "R2021" ? 3 : 2,
            type: semester === 8 ? ("Project" as const) : ("Core" as const),
          },
        ],
      };
    });

  return [
    {
      regulationName: "Regulation 2021",
      semesters: buildSemesters("R2021"),
    },
    {
      regulationName: "Regulation 2017",
      semesters: buildSemesters("R2017"),
    },
  ];
}

function createEngineeringDepartment(config: {
  slug: string;
  name: string;
  shortName: string;
  intake: number;
  focusAreas: string[];
  topRecruiters: string[];
}): DepartmentData {
  return {
    slug: config.slug,
    name: config.name,
    shortName: config.shortName,
    college: "engineering",
    bgColor: "#0F172A",
    accentColor: "#D4A024",
    heroImage:
      "https://images.unsplash.com/photo-1581092160607-ee22731d8f2f?q=80&w=1600&auto=format&fit=crop",
    about: {
      paragraphs: [
        `${config.name} is offered under JCT College of Engineering and Technology, established by Shri Jagannath Educational Health and Charitable Trust in Coimbatore to serve students from rural and underserved communities.`,
        `Institution-level programs include UG departments such as ${ENGINEERING_UG_DEPARTMENTS.join(", ")}; PG courses such as ${ENGINEERING_PG_COURSES.join(", ")}; and doctoral study in ${ENGINEERING_DOCTORAL_COURSES.join(", ")}.`,
        `Department students are supported through structured staff bodies including ${ENGINEERING_STAFF_BODIES.join(", ")} and faculty support units such as ${ENGINEERING_FACULTY_SUPPORT_UNITS.join(", ")}.`,
      ],
      established: "2009",
      accreditation: "AICTE / NAAC / NBA / ISO 9001:2015",
      intake: config.intake,
      affiliation: "Affiliated to Anna University",
    },
    hod: {
      name: "Head of Department",
      designation: "Professor & Head",
      qualification: "As per AICTE and Anna University norms",
      experience: "Experienced Department Faculty Team",
      message: [
        "Our department aligns academic delivery with institutional systems that include Management, Administration, Governing Council, and Planning and Monitoring Board oversight.",
        "Students are supported through COE processes, TPO-guided placement preparation, and faculty mentoring through communication, entrepreneurship, and innovation cells.",
        "We focus on strong fundamentals, practical exposure, and career readiness through structured value-added support such as language lab, bridge courses, soft skills, and counseling.",
      ],
    },
    visionMission: {
      vision: `To be a center of excellence in ${config.shortName} education, research, and innovation for sustainable societal impact.`,
      mission: [
        "Provide quality technical education with strong theoretical and practical foundations.",
        "Promote interdisciplinary research, innovation, and entrepreneurship.",
        "Build professional competence, ethical values, and leadership among students.",
      ],
    },
    programOutcomes: [...ENGINEERING_PO],
    advisoryBoard: [
      {
        name: "Governing Council Members",
        designation: "Institutional Governance Body",
        organization: "JCT Engineering",
        role: "Policy Oversight",
      },
      {
        name: "Planning & Monitoring Board",
        designation: "Academic Planning Body",
        organization: "JCT Engineering",
        role: "Academic Review",
      },
      {
        name: "Research Advisory Committee",
        designation: "Research Review Body",
        organization: "JCT Engineering",
        role: "Research Guidance",
      },
    ],
    pac: [
      {
        name: "Head of Department",
        designation: "PAC Chair",
        organization: "Department",
        role: "Chairperson",
      },
      {
        name: "Controller of Examination (COE)",
        designation: "Examination Coordination",
        organization: "Institution",
        role: "Academic Compliance",
      },
      {
        name: "Training and Placement Office",
        designation: "Career and Placement Coordination",
        organization: "Institution",
        role: "Member",
      },
    ],
    bos: [
      {
        name: "Department Faculty Team",
        designation: "Faculty Members",
        organization: "Anna University",
        role: "Curriculum Framing",
      },
      {
        name: "Planning & Monitoring Board Nominee",
        designation: "Academic Planning Representative",
        organization: "JCT Engineering",
        role: "BoS Member",
      },
      {
        name: "Research Advisory Committee Nominee",
        designation: "Research Representative",
        organization: "JCT Engineering",
        role: "BoS Member",
      },
    ],
    curriculum: buildEngineeringCurriculum(config.shortName),
    teachingLearning: {
      overview:
        "The department follows a structured teaching-learning model supported by communication development, entrepreneurship development, innovation and incubation, and career enhancement schemes listed on the engineering portal.",
      methods: [
        "Curriculum delivery with regular internal assessments and academic calendar monitoring",
        "Bridge courses, remedial coaching, and language lab support",
        "Career counseling, soft skill development, and mentoring-led learning",
      ],
      tools: [
        "ICT-enabled content delivery",
        "Innovation and Incubation Centre resources",
        "Library journals, important websites, and competitive exam resources",
      ],
      practices: [
        "Action taken reporting for curriculum feedback",
        "Department-level mentoring through staff and faculty committees",
        "Training and placement readiness through TPO-linked activities",
      ],
    },
    valueAddedCourses: [
      {
        name: "Soft Skill Development",
        hours: "30 Hours",
        provider: "Career Enhancement and Development Schemes",
        description:
          "Structured communication, aptitude, and professional readiness sessions for placements and higher studies.",
      },
      {
        name: "Language Lab and Bridge Courses",
        hours: "40 Hours",
        provider: "Communication Development Cell",
        description:
          "Language lab support, bridge modules, and remedial coaching to strengthen academic progression.",
      },
      {
        name: "Entrepreneurship and Innovation Orientation",
        hours: "30 Hours",
        provider: "Entrepreneurship Development Cell / Innovation and Incubation Centre",
        description:
          "Hands-on support for startup awareness, ideation, innovation pathways, and industry interaction.",
      },
    ],
    faculty: [
      {
        name: "Department Faculty Team",
        designation: "Professor / Associate Professor / Assistant Professor",
        qualification: "As per AICTE and Anna University norms",
        experience: "Experienced Teaching Team",
        specialization: config.focusAreas[0],
      },
      {
        name: "Communication Development Cell Faculty Mentors",
        designation: "Faculty Mentors",
        qualification: "Language and Communication Trainers",
        experience: "Department and Institutional Mentoring",
        specialization: "Language Lab, Soft Skills, Bridge Courses",
      },
      {
        name: "Entrepreneurship Development Cell Faculty",
        designation: "Startup and Innovation Mentors",
        qualification: "Entrepreneurship and Industry Orientation",
        experience: "Innovation Program Facilitation",
        specialization: "Entrepreneurship, Incubation, Career Orientation",
      },
      {
        name: "Career Enhancement Scheme Faculty",
        designation: "Student Support Faculty",
        qualification: "Academic and Counseling Support",
        experience: "Student Progression Support",
        specialization: "Career Counseling, Personal Counseling, Remedial Coaching",
      },
    ],
    labs: [
      {
        name: `${config.shortName} Department Laboratories`,
        description:
          "Department laboratories and practical workspaces supporting core course delivery and experimentation.",
        equipment: [
          "Hi-Tech Classrooms",
          "Department Lab Infrastructure",
          "ICT Content Support",
          "Course-specific Training Facilities",
        ],
      },
      {
        name: "Innovation and Incubation Centre",
        description:
          "Campus innovation support for interdisciplinary project development and startup orientation.",
        equipment: [
          "Prototype Development Support",
          "Entrepreneurship Development Resources",
          "Research Project Mentoring",
          "Industry Interaction Sessions",
        ],
      },
    ],
    library: {
      books: 0,
      journals: 0,
      magazines: 0,
      digitalAccess: [
        "Library Overview",
        "Journals",
        "Competitive Exams Resources",
        "Important Websites",
      ],
      description:
        "The engineering portal lists library sections including overview, journals, competitive exam resources, and important websites for academic support.",
    },
    events: [
      {
        title: "J-Finagles - National Level Technical Symposium",
        date: "2026-01-01",
        type: "Technical Symposium",
        description:
          "Institution-level technical symposium series conducted across engineering departments.",
      },
      {
        title: "International Conference on Recent Advances in Electrical Science and Technology",
        date: "2025-01-01",
        type: "Conference",
        description:
          "Conference and research presentation platform highlighted in the engineering news and events listing.",
      },
      {
        title: "International Conference on Intelligent Cyber Physical Systems and Internet of Things",
        date: "2024-01-01",
        type: "Conference",
        description:
          "Multi-disciplinary conference series listed under the engineering events and research activities.",
      },
    ],
    studentParticipation: {
      clubs: [
        "Fine Arts Club",
        "National Service Scheme (NSS)",
        "Sports & Activities",
        "Professional Body",
      ],
      highlights: [
        {
          title: "Campus Placements",
          year: "Since 2015",
          description:
            "1000+ campus placements reported in institutional highlights.",
        },
        {
          title: "Student Graduation Milestone",
          year: "Institutional Highlight",
          description:
            "10K+ students successfully graduated as listed in engineering highlights.",
        },
      ],
    },
    facultyParticipation: {
      conferences: [
        {
          title:
            "AICTE Sponsored International Conference on Recent Trends in Electrical Science and Technology",
          faculty: "Engineering Faculty Team",
          venue: "JCT Campus",
          year: "2025",
        },
        {
          title:
            "International Conference on Advanced Materials, Modern Manufacturing and Computerized Automation",
          faculty: "Interdepartmental Faculty Team",
          venue: "JCT Campus",
          year: "2025",
        },
      ],
      workshops: [
        "Research Workshop on AI Tools for Research Writing",
        "Training on Technology Commercialization, Licensing and Transfer Practices",
        "Faculty Development Programs listed under department news and events",
      ],
    },
    studentAchievements: [
      {
        name: "Engineering Student Community",
        title: "Placement and Career Progression",
        detail:
          "Students benefited from campus drives, skill development programs, and continuous placement support.",
        year: "Ongoing",
      },
      {
        name: "Engineering Student Teams",
        title: "Conference and Symposium Participation",
        detail:
          "Students are regularly involved in national-level symposiums, conferences, and technical events.",
        year: "Ongoing",
      },
    ],
    facultyAchievements: [
      {
        name: "Faculty and Research Cells",
        title: "Research and Development Activities",
        detail:
          "Research advisory and innovation systems support conference participation, funding proposals, and applied research work.",
        year: "Ongoing",
      },
      {
        name: "Institutional Faculty Teams",
        title: "Academic Quality and Accreditation Alignment",
        detail:
          "Faculty activities are aligned with AICTE, NAAC, NBA, ISO 9001:2015, UGC, and Anna University compliance expectations.",
        year: "Ongoing",
      },
    ],
    magazine: {
      name: "Engineering News and Events",
      description:
        "Department and institutional updates are published through the engineering news and events timeline.",
      frequency: "Regular Updates",
      latestIssue: "Latest News and Events",
      highlights: [
        "Conferences and symposium announcements",
        "Placement and training activities",
        "Faculty development and innovation events",
      ],
    },
    careerProgression: {
      topRecruiters: config.topRecruiters,
      higherStudies: [
        "M.E. / M.Tech.",
        "M.S. (Abroad)",
        "MBA",
        "Research Fellowships",
      ],
      averagePackage: "As per placement report",
      placementRate: "1000+ placements since 2015 (institution highlight)",
    },
    feedback: {
      curriculumProcess: [
        "Feedback System and curriculum feedback are collected through institutional processes",
        "Action taken report for feedback on curriculum is maintained",
        "Review is supported through academic bodies and departmental committees",
      ],
      facilityProcess: [
        "Department facilities are reviewed through institutional quality processes",
        "Library, labs, and student support cells are monitored periodically",
        "Student and faculty feedback inputs are included in improvement cycles",
      ],
      recentImprovements: [
        "Strengthened communication, entrepreneurship, and innovation support cells",
        "Expanded skill development and counseling-based student support",
        "Continued conference, workshop, and placement-linked engagement",
      ],
    },
  };
}

export const engineeringDepartments: DepartmentData[] = [
  createEngineeringDepartment({
    slug: "cse",
    name: "Computer Science & Engineering",
    shortName: "CSE",
    intake: 120,
    focusAreas: ["AI & Machine Learning", "Cloud Computing", "Cyber Security"],
    topRecruiters: ["TCS", "Infosys", "Cognizant", "Zoho", "Wipro"],
  }),
  createEngineeringDepartment({
    slug: "mech",
    name: "Mechanical Engineering",
    shortName: "MECH",
    intake: 60,
    focusAreas: ["CAD / CAM", "Thermal Engineering", "Robotics"],
    topRecruiters: ["L&T", "Ashok Leyland", "Bosch", "Caterpillar", "TVS"],
  }),
  createEngineeringDepartment({
    slug: "eee",
    name: "Electrical & Electronics Engineering",
    shortName: "EEE",
    intake: 60,
    focusAreas: ["Power Systems", "Control Engineering", "Electric Vehicles"],
    topRecruiters: ["Schneider Electric", "Siemens", "ABB", "TCS", "L&T"],
  }),
  createEngineeringDepartment({
    slug: "ece",
    name: "Electronics & Communication Engineering",
    shortName: "ECE",
    intake: 60,
    focusAreas: ["VLSI", "Embedded Systems", "Signal Processing"],
    topRecruiters: ["Qualcomm", "HCL", "Tech Mahindra", "Foxconn", "Infosys"],
  }),
  createEngineeringDepartment({
    slug: "ce",
    name: "Civil Engineering",
    shortName: "CE",
    intake: 60,
    focusAreas: [
      "Structural Engineering",
      "Construction Management",
      "Environmental Engineering",
    ],
    topRecruiters: [
      "L&T Construction",
      "Ramco",
      "URC",
      "Sobha",
      "Shapoorji Pallonji",
    ],
  }),
  createEngineeringDepartment({
    slug: "aids",
    name: "Artificial Intelligence & Data Science",
    shortName: "AI&DS",
    intake: 60,
    focusAreas: ["Machine Learning", "Deep Learning", "Data Analytics"],
    topRecruiters: ["TCS", "Infosys", "Cognizant", "Zoho", "Wipro"],
  }),
  createEngineeringDepartment({
    slug: "csbs",
    name: "Computer Science & Business Systems",
    shortName: "CSBS",
    intake: 60,
    focusAreas: ["Business Analytics", "ERP Systems", "Data-Driven Decisions"],
    topRecruiters: ["TCS", "Infosys", "Cognizant", "Zoho", "Wipro"],
  }),
  createEngineeringDepartment({
    slug: "bt",
    name: "Bio-Technology and Bio-Chemical Engineering",
    shortName: "BT",
    intake: 60,
    focusAreas: ["Genetic Engineering", "Bioprocessing", "Pharma"],
    topRecruiters: ["Biocon", "Dr. Reddy's", "Sun Pharma", "Cipla", "Novartis"],
  }),
  createEngineeringDepartment({
    slug: "ft",
    name: "Food Technology",
    shortName: "FT",
    intake: 60,
    focusAreas: ["Food Processing", "Quality Control", "Nutrition Science"],
    topRecruiters: ["Britannia", "Nestle", "ITC", "HUL", "Parle"],
  }),
  createEngineeringDepartment({
    slug: "pe",
    name: "Petroleum Engineering",
    shortName: "PE",
    intake: 60,
    focusAreas: [
      "Reservoir Engineering",
      "Drilling Technology",
      "Refinery Operations",
    ],
    topRecruiters: ["ONGC", "Reliance", "Indian Oil", "BPCL", "Schlumberger"],
  }),
  createEngineeringDepartment({
    slug: "pct",
    name: "Petrochemical Technology",
    shortName: "PCT",
    intake: 60,
    focusAreas: [
      "Polymer Technology",
      "Chemical Processes",
      "Industrial Chemistry",
    ],
    topRecruiters: [
      "Reliance",
      "Haldia Petrochemicals",
      "GAIL",
      "Indian Oil",
      "BASF",
    ],
  }),
];
