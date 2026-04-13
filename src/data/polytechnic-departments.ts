import type { DepartmentData } from "@/types/department";

function buildPolyCurriculum(prefix: string): DepartmentData["curriculum"] {
  const buildSemesters = (regYear: string) =>
    Array.from({ length: 6 }, (_, index) => {
      const semester = index + 1;
      return {
        semester,
        subjects: [
          {
            code: `${prefix}${semester}01`,
            name:
              semester <= 2
                ? "Applied Science"
                : `Core Diploma Subject (${regYear})`,
            credits: 4,
            type: "Core" as const,
          },
          {
            code: `${prefix}${semester}02`,
            name: "Technical Drawing / Design",
            credits: 3,
            type: "Theory" as const,
          },
          {
            code: `${prefix}${semester}03`,
            name: "Workshop / Lab",
            credits: 2,
            type: "Lab" as const,
          },
          {
            code: `${prefix}${semester}04`,
            name:
              semester === 6
                ? "Industrial Training Project"
                : "Skill Enhancement",
            credits: regYear === "M Scheme" ? 3 : 2,
            type: semester === 6 ? ("Project" as const) : ("Elective" as const),
          },
        ],
      };
    });

  return [
    {
      regulationName: "M Scheme",
      semesters: buildSemesters("M Scheme"),
    },
    {
      regulationName: "L Scheme",
      semesters: buildSemesters("L Scheme"),
    },
  ];
}

function createPolyDepartment(config: {
  slug: string;
  name: string;
  shortName: string;
  intake: number;
  focusAreas: string[];
}): DepartmentData {
  return {
    slug: config.slug,
    name: config.name,
    shortName: config.shortName,
    college: "polytechnic",
    bgColor: "#1A237E",
    accentColor: "#D4A024",
    heroImage:
      "/site_assests/polytechnic.jpeg",
    about: {
      paragraphs: [
        `${config.name} equips students with core technical skills and practical competencies required for industry-ready diploma professionals.`,
        "The department emphasizes workshop practice, laboratory learning, field exposure, and industrial training as part of the curriculum.",
        "Students are prepared for immediate employment, lateral entry opportunities, and lifelong technical upskilling.",
      ],
      established: "2010",
      accreditation: "AICTE / DOTE Compliant",
      intake: config.intake,
      affiliation: "Affiliated to DOTE, Tamil Nadu",
    },
    hod: {
      name: "Mr. P. Balasubramaniam",
      designation: "Head of Department",
      qualification: "M.E.",
      experience: "16+ Years",
      message: [
        "Our diploma programs focus on application-first learning and strong employability outcomes.",
        "We train students through practical sessions, industrial interaction, and discipline-focused mentoring.",
        "The department continuously upgrades facilities and curriculum delivery to match industry expectations.",
      ],
    },
    visionMission: {
      vision: `To develop competent diploma professionals in ${config.shortName} with technical expertise and ethical values.`,
      mission: [
        "Provide quality diploma education with extensive practical training.",
        "Strengthen industry linkage through internships, visits, and expert sessions.",
        "Promote innovation, employability skills, and professional discipline.",
      ],
    },
    programOutcomes: [
      {
        code: "PO1",
        title: "Technical Knowledge",
        description:
          "Apply core engineering principles and technical knowledge to routine industrial tasks.",
      },
      {
        code: "PO2",
        title: "Practical Skills",
        description:
          "Perform laboratory and workshop operations using standard tools and procedures.",
      },
      {
        code: "PO3",
        title: "Problem Solving",
        description:
          "Identify and resolve technical issues in equipment, systems, and processes.",
      },
      {
        code: "PO4",
        title: "Communication and Teamwork",
        description:
          "Communicate effectively and work in teams for productive project execution.",
      },
      {
        code: "PO5",
        title: "Safety and Ethics",
        description:
          "Follow professional ethics, workplace safety, and environmental standards.",
      },
      {
        code: "PO6",
        title: "Career Readiness",
        description:
          "Demonstrate employability skills and readiness for industry or higher technical education.",
      },
    ],
    advisoryBoard: [
      {
        name: "Mr. V. Rajendran",
        designation: "Plant Manager",
        organization: "Regional Industry Partner",
        role: "Industry Expert",
      },
      {
        name: "Dr. S. Kumaran",
        designation: "Academic Consultant",
        organization: "Technical Education",
        role: "Academic Expert",
      },
      {
        name: "Alumni Representative",
        designation: "Diploma Graduate",
        organization: "Manufacturing Sector",
        role: "Alumni Member",
      },
    ],
    pac: [
      {
        name: "Mr. P. Balasubramaniam",
        designation: "Head of Department",
        organization: "JCT Polytechnic",
        role: "Chairperson",
      },
      {
        name: "Mr. K. Manoj",
        designation: "Lecturer",
        organization: "JCT Polytechnic",
        role: "Coordinator",
      },
      {
        name: "Student Member",
        designation: "Final Year Diploma",
        organization: config.shortName,
        role: "Member",
      },
    ],
    bos: [
      {
        name: "DOTE Nominee",
        designation: "Academic Representative",
        organization: "DOTE",
        role: "External Member",
      },
      {
        name: "Mr. P. Balasubramaniam",
        designation: "Head of Department",
        organization: "JCT Polytechnic",
        role: "Chairperson",
      },
      {
        name: "Industry Specialist",
        designation: "Senior Engineer",
        organization: "Industry Partner",
        role: "Member",
      },
    ],
    curriculum: buildPolyCurriculum(config.shortName),
    teachingLearning: {
      overview:
        "Teaching is aligned to diploma competency requirements through theory classes, demonstration, workshop practice, and industrial exposure.",
      methods: [
        "Demonstration-oriented classes",
        "Hands-on lab and workshop sessions",
        "Industry assignments and mini projects",
      ],
      tools: [
        "Department workshop machinery",
        "Simulation and drafting tools",
        "Digital classroom and LMS support",
      ],
      practices: [
        "Daily practical logbook monitoring",
        "Skill tests and continuous internal evaluation",
        "Mentoring for placement and lateral entry",
      ],
    },
    valueAddedCourses: [
      {
        name: "Industrial Safety Practices",
        hours: "24 Hours",
        provider: "Department Training Cell",
        description:
          "Focuses on safety standards, compliance, and shop-floor best practices.",
      },
      {
        name: `${config.focusAreas[0]} Skill Module`,
        hours: "36 Hours",
        provider: "Industry Trainer",
        description:
          "Practical module to strengthen job-ready skills in core specialization.",
      },
    ],
    faculty: [
      {
        name: "Mr. P. Balasubramaniam",
        designation: "HoD / Senior Lecturer",
        qualification: "M.E.",
        experience: "16 Years",
        specialization: config.focusAreas[0],
      },
      {
        name: "Mr. K. Manoj",
        designation: "Lecturer",
        qualification: "B.E.",
        experience: "10 Years",
        specialization: config.focusAreas[1] ?? config.focusAreas[0],
      },
      {
        name: "Ms. R. Divya",
        designation: "Lecturer",
        qualification: "B.E.",
        experience: "6 Years",
        specialization: config.focusAreas[2] ?? "Workshop Practice",
      },
    ],
    labs: [
      {
        name: "Core Practical Lab",
        description:
          "Supports curriculum practicals and competency-based experiments for diploma students.",
        equipment: [
          "Bench Tools",
          "Measuring Instruments",
          "Training Modules",
          "Safety Kits",
        ],
      },
      {
        name: "Workshop and Skill Development Center",
        description:
          "Provides hands-on machining, fabrication, assembly, and maintenance training.",
        equipment: [
          "Workshop Machines",
          "Electrical Panels",
          "Testing Equipment",
          "CAD Stations",
        ],
      },
    ],
    library: {
      books: 1800,
      journals: 16,
      magazines: 10,
      digitalAccess: ["DOTE Resources", "NPTEL", "NDLI", "Technical e-Books"],
      description:
        "Department library includes diploma textbooks, manuals, previous papers, and digital technical resources.",
    },
    events: [
      {
        title: "Skill Expo",
        date: "2025-01-10",
        type: "Department Event",
        description:
          "Students exhibited working models and practical innovations to industry visitors.",
      },
      {
        title: "Industry Interaction Day",
        date: "2024-10-18",
        type: "Seminar",
        description:
          "Experts shared expectations for diploma engineers and career growth pathways.",
        resourcePerson: "Production and Maintenance Managers",
      },
    ],
    studentParticipation: {
      clubs: ["Technical Club", "NSS Unit", "Placement Readiness Cell"],
      highlights: [
        {
          title: "District Skill Competition Winners",
          year: "2024",
          description:
            "Students secured top ranks in regional technical skill competitions.",
        },
        {
          title: "Mini Project Showcase",
          year: "2023",
          description:
            "Multiple student teams developed low-cost practical prototypes.",
        },
      ],
    },
    facultyParticipation: {
      conferences: [
        {
          title: "Technical Education Best Practices Summit",
          faculty: "Mr. K. Manoj",
          venue: "Salem",
          year: "2024",
        },
        {
          title: "Workshop on Industry-Aligned Diploma Training",
          faculty: "Ms. R. Divya",
          venue: "Coimbatore",
          year: "2023",
        },
      ],
      workshops: [
        "FDP on Practical Pedagogy",
        "Training on Industrial Automation Basics",
        "Assessment Design for Competency-Based Learning",
      ],
    },
    studentAchievements: [
      {
        name: "S. Arul",
        title: "Best Outgoing Student",
        detail: "Recognized for academics, discipline, and project excellence.",
        year: "2024",
      },
      {
        name: "N. Dhanush",
        title: "Campus Placement Success",
        detail: "Placed in core manufacturing company before final exams.",
        year: "2025",
      },
    ],
    facultyAchievements: [
      {
        name: "Mr. P. Balasubramaniam",
        title: "Excellence in Technical Mentoring",
        detail:
          "Awarded for sustained student placement and training outcomes.",
        year: "2024",
      },
      {
        name: "Mr. K. Manoj",
        title: "Industry Certification",
        detail:
          "Completed advanced certification in industrial maintenance systems.",
        year: "2023",
      },
    ],
    magazine: {
      name: "PolyConnect",
      description:
        "A practical-technical newsletter featuring projects, visits, and placement stories.",
      frequency: "Half-Yearly",
      latestIssue: "Issue 7",
      highlights: [
        "Workshop innovation highlights",
        "Industrial training experiences",
        "Placement preparation tips",
      ],
    },
    careerProgression: {
      topRecruiters: ["Bosch", "L&T", "TVS", "Ashok Leyland", "Caterpillar"],
      higherStudies: [
        "Lateral Entry B.E.",
        "Advanced Diploma",
        "Skill Certifications",
      ],
      averagePackage: "INR 2.8 LPA",
      placementRate: "88%",
    },
    feedback: {
      curriculumProcess: [
        "Semester-end feedback from students and class advisors",
        "Review in PAC meeting for attainment and action",
        "Recommendations submitted during BoS review",
      ],
      facilityProcess: [
        "Workshop and lab feedback register with online consolidation",
        "Monthly review by HoD and maintenance team",
        "Student committee feedback during department meetings",
      ],
      recentImprovements: [
        "Added new workshop equipment and safety kits",
        "Expanded industry guest lecture series",
        "Improved placement and aptitude training modules",
      ],
    },
  };
}

export const polytechnicDepartments: DepartmentData[] = [
  createPolyDepartment({
    slug: "computer-technology",
    name: "Diploma in Computer Technology",
    shortName: "CT",
    intake: 60,
    focusAreas: ["Programming", "Networking", "Database Systems"],
  }),
  createPolyDepartment({
    slug: "agricultural-engineering",
    name: "Diploma in Agricultural Engineering",
    shortName: "AG",
    intake: 60,
    focusAreas: ["Farm Machinery", "Irrigation", "Agri Technology"],
  }),
  createPolyDepartment({
    slug: "petrochemical-engineering",
    name: "Diploma in Petrochemical Engineering",
    shortName: "PC",
    intake: 60,
    focusAreas: ["Process Engineering", "Refinery Basics", "Industrial Safety"],
  }),
  createPolyDepartment({
    slug: "mechanical-engineering",
    name: "Diploma in Mechanical Engineering",
    shortName: "ME",
    intake: 60,
    focusAreas: ["Machining", "CAD", "Production"],
  }),
  createPolyDepartment({
    slug: "electrical-electronics",
    name: "Diploma in Electrical and Electronics Engineering",
    shortName: "EE",
    intake: 60,
    focusAreas: ["Electrical Machines", "Power Systems", "Control Panels"],
  }),
  createPolyDepartment({
    slug: "civil-engineering",
    name: "Diploma in Civil Engineering",
    shortName: "CE",
    intake: 60,
    focusAreas: ["Surveying", "Construction", "Quantity Estimation"],
  }),
];
