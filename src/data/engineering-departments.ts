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

function buildEngineeringCurriculum(
  prefix: string,
): DepartmentData["curriculum"] {
  return Array.from({ length: 8 }, (_, index) => {
    const semester = index + 1;
    return {
      semester,
      subjects: [
        {
          code: `${prefix}${semester}01`,
          name:
            semester < 3
              ? "Engineering Mathematics"
              : "Core Engineering Subject",
          credits: 4,
          type: "Core",
        },
        {
          code: `${prefix}${semester}02`,
          name: semester < 3 ? "Engineering Science" : "Department Elective",
          credits: 3,
          type: semester < 3 ? "Theory" : "Elective",
        },
        {
          code: `${prefix}${semester}03`,
          name: "Laboratory / Practical",
          credits: 2,
          type: "Lab",
        },
        {
          code: `${prefix}${semester}04`,
          name:
            semester === 8 ? "Project Work" : "Professional Skill Development",
          credits: 3,
          type: semester === 8 ? "Project" : "Core",
        },
      ],
    };
  });
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
        `${config.name} at JCT offers a rigorous outcome-based curriculum aligned with Anna University regulations and current industry requirements.`,
        `The department emphasizes experiential learning through design studios, advanced laboratories, mini projects, and internships in collaboration with industry partners.`,
        `Students are mentored for higher studies, entrepreneurship, and placements through continuous technical and professional skill development programs.`,
      ],
      established: "2009",
      accreditation: "NBA / NAAC Aligned",
      intake: config.intake,
      affiliation: "Affiliated to Anna University",
    },
    hod: {
      name: "Dr. K. Natarajan",
      designation: "Professor & Head",
      qualification: "Ph.D.",
      experience: "18+ Years",
      message: [
        "Our department is committed to academic excellence, innovation, and ethical engineering practice.",
        "We focus on strengthening fundamentals while enabling students to build practical solutions for real-world problems.",
        "Through industry interaction, research culture, and student-centric mentoring, we prepare graduates to thrive in dynamic technology ecosystems.",
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
        name: "Mr. R. Prabhu",
        designation: "Vice President - Engineering",
        organization: "L&T Technology Services",
        role: "Industry Expert",
      },
      {
        name: "Dr. S. Jayalakshmi",
        designation: "Professor",
        organization: "Anna University",
        role: "Academic Expert",
      },
      {
        name: "Mr. A. Senthil",
        designation: "Alumni Entrepreneur",
        organization: "TechGrid Solutions",
        role: "Alumni Member",
      },
    ],
    pac: [
      {
        name: "Dr. K. Natarajan",
        designation: "Professor & Head",
        organization: "JCT",
        role: "Chairperson",
      },
      {
        name: "Dr. M. Priya",
        designation: "Associate Professor",
        organization: "JCT",
        role: "Coordinator",
      },
      {
        name: "Ms. S. Harini",
        designation: "Student Representative",
        organization: "Final Year",
        role: "Member",
      },
    ],
    bos: [
      {
        name: "Dr. S. Jayalakshmi",
        designation: "Professor",
        organization: "Anna University",
        role: "University Nominee",
      },
      {
        name: "Dr. R. Karthik",
        designation: "Professor",
        organization: "JCT",
        role: "BoS Chair",
      },
      {
        name: "Mr. M. Aravind",
        designation: "Senior Architect",
        organization: "Cognizant",
        role: "Industry Representative",
      },
    ],
    curriculum: buildEngineeringCurriculum(config.shortName),
    teachingLearning: {
      overview:
        "The department follows an outcome-based teaching model integrating theory, simulation, laboratory work, and project-based learning.",
      methods: [
        "Flipped classrooms with pre-class learning resources",
        "Case study and problem-solving tutorials",
        "Design thinking based mini projects every semester",
      ],
      tools: [
        "Learning Management System (LMS)",
        "Virtual lab platforms and simulation suites",
        "Coding / CAD / EDA toolchains relevant to discipline",
      ],
      practices: [
        "Continuous internal assessment with rubrics",
        "Peer learning and technical clubs",
        "Structured mentoring and remedial coaching",
      ],
    },
    valueAddedCourses: [
      {
        name: "Industry 4.0 Foundations",
        hours: "30 Hours",
        provider: "JCT - Industry Collaborative Center",
        description:
          "Covers smart manufacturing, IoT integration, and data-driven engineering practices.",
      },
      {
        name: "Professional Certification Track",
        hours: "45 Hours",
        provider: "External Certification Partners",
        description: `Hands-on training in ${config.focusAreas[0]} with certification-oriented assessment.`,
      },
    ],
    faculty: [
      {
        name: "Dr. K. Natarajan",
        designation: "Professor",
        qualification: "Ph.D.",
        experience: "18 Years",
        specialization: config.focusAreas[0],
      },
      {
        name: "Dr. M. Priya",
        designation: "Associate Professor",
        qualification: "Ph.D.",
        experience: "12 Years",
        specialization: config.focusAreas[1] ?? config.focusAreas[0],
      },
      {
        name: "Mr. S. Dinesh",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "8 Years",
        specialization: config.focusAreas[2] ?? config.focusAreas[0],
      },
      {
        name: "Ms. L. Shruthi",
        designation: "Assistant Professor",
        qualification: "M.E.",
        experience: "5 Years",
        specialization: "Outcome Based Education",
      },
    ],
    labs: [
      {
        name: `${config.shortName} Core Laboratory`,
        description:
          "Well-equipped lab supporting core experiments, design validation, and model implementation.",
        equipment: [
          "Workstations",
          "Measurement Kits",
          "Simulation Licenses",
          "Prototype Tools",
        ],
      },
      {
        name: "Research & Innovation Lab",
        description:
          "Supports student innovation, interdisciplinary projects, and product prototype development.",
        equipment: [
          "GPU Systems",
          "Rapid Prototyping Kit",
          "Domain-specific Toolchain",
          "IoT Devices",
        ],
      },
    ],
    library: {
      books: 2650,
      journals: 38,
      magazines: 12,
      digitalAccess: [
        "IEEE Xplore",
        "Springer Nature",
        "NPTEL",
        "National Digital Library",
      ],
      description:
        "The department library provides curated technical references, project reports, journals, and access to digital repositories.",
    },
    events: [
      {
        title: `${config.shortName} Tech Symposium`,
        date: "2025-01-20",
        type: "Technical Fest",
        description:
          "Inter-college technical competitions, coding contests, design challenges, and invited talks.",
      },
      {
        title: "Industry Conclave",
        date: "2024-11-14",
        type: "Seminar",
        description:
          "Experts from industry shared trends, expectations, and career pathways in core and emerging sectors.",
        resourcePerson: "Senior Leaders from Partner Companies",
      },
    ],
    studentParticipation: {
      clubs: [
        "Professional Society Chapter",
        "Innovation Club",
        "Coding / Design Club",
      ],
      highlights: [
        {
          title: "National Hackathon Finalist",
          year: "2024",
          description:
            "Student team reached finals with an AI-enabled solution for campus energy optimization.",
        },
        {
          title: "State-Level Technical Quiz Winner",
          year: "2023",
          description:
            "Department students secured first place among 120+ participating teams.",
        },
      ],
    },
    facultyParticipation: {
      conferences: [
        {
          title: "International Conference on Sustainable Engineering",
          faculty: "Dr. M. Priya",
          venue: "Chennai",
          year: "2024",
        },
        {
          title: "National Symposium on Applied Innovation",
          faculty: "Mr. S. Dinesh",
          venue: "Coimbatore",
          year: "2023",
        },
      ],
      workshops: [
        "FDP on Outcome Based Education",
        "Workshop on Advanced Research Methodology",
        "Certification Program on Emerging Engineering Tools",
      ],
    },
    studentAchievements: [
      {
        name: "A. Karthi",
        title: "Best Project Award",
        detail:
          "Won first prize for smart automation project in state-level expo.",
        year: "2024",
      },
      {
        name: "P. Divya",
        title: "GATE Qualified",
        detail:
          "Qualified with strong percentile and admitted for higher studies.",
        year: "2025",
      },
    ],
    facultyAchievements: [
      {
        name: "Dr. K. Natarajan",
        title: "Granted Patent",
        detail: "Patent granted in energy-efficient engineering system design.",
        year: "2024",
      },
      {
        name: "Dr. M. Priya",
        title: "Scopus Publications",
        detail: "Published 4 indexed papers in reputed international journals.",
        year: "2023",
      },
    ],
    magazine: {
      name: "Engineer's Chronicle",
      description:
        "A technical magazine curated by students and faculty each semester.",
      frequency: "Half-Yearly",
      latestIssue: "Vol. 9 Issue 2",
      highlights: [
        "Student innovation stories",
        "Industry interview series",
        "Department research snapshots",
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
      averagePackage: "INR 4.8 LPA",
      placementRate: "91%",
    },
    feedback: {
      curriculumProcess: [
        "Course-end feedback collected from students every semester",
        "Outcome attainment analysis conducted by PAC",
        "Action points reviewed in BoS meetings",
      ],
      facilityProcess: [
        "Laboratory and classroom feedback through digital portal",
        "Infrastructure audit by internal quality team",
        "Annual review with student representatives",
      ],
      recentImprovements: [
        "Upgraded smart classrooms and lab instruments",
        "Introduced industry certification electives",
        "Expanded internship and career mentoring support",
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
];
