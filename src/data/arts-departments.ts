import type { DepartmentData } from "@/types/department";

function buildArtsCurriculum(prefix: string): DepartmentData["curriculum"] {
  const buildSemesters = (regYear: string) =>
    Array.from({ length: 6 }, (_, index) => {
      const semester = index + 1;
      return {
        semester,
        subjects: [
          {
            code: `${prefix}${semester}01`,
            name:
              semester <= 2 ? "Foundation Course" : `Core Subject (${regYear})`,
            credits: 4,
            type: "Core" as const,
          },
          {
            code: `${prefix}${semester}02`,
            name: "Allied / Skill Course",
            credits: 3,
            type: "Elective" as const,
          },
          {
            code: `${prefix}${semester}03`,
            name: "Practical / Lab",
            credits: 2,
            type: "Lab" as const,
          },
          {
            code: `${prefix}${semester}04`,
            name: semester === 6 ? "Project / Internship" : "Value Education",
            credits: regYear === "R2021" ? 3 : 2,
            type: semester === 6 ? ("Project" as const) : ("Theory" as const),
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

function createArtsDepartment(config: {
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
    college: "arts-science",
    bgColor: "#800020",
    accentColor: "#D4A024",
    heroImage: "/site_assests/arts.jpeg",
    about: {
      paragraphs: [
        `${config.name} offers a contemporary curriculum with a strong blend of academic depth, practical application, and career-oriented training.`,
        "Students engage in workshops, seminars, internship opportunities, and club-based activities that build communication and analytical skills.",
        "The department nurtures ethical values, social responsibility, and readiness for employment, entrepreneurship, and higher studies.",
      ],
      established: "2018",
      accreditation: "NAAC Quality Framework",
      intake: config.intake,
      affiliation: "Affiliated to Bharathiar University",
    },
    hod: {
      name: "Dr. R. Lakshmi",
      designation: "Head of Department",
      qualification: "Ph.D.",
      experience: "15+ Years",
      message: [
        "Our focus is to shape students into competent professionals with integrity and practical competence.",
        "Through student-centered teaching and regular industry interaction, we bridge the gap between classroom and career.",
        "We are committed to continuous improvement, innovation, and holistic development of every learner.",
      ],
    },
    visionMission: {
      vision: `To emerge as a vibrant department in ${config.shortName} education fostering innovation, employability, and social contribution.`,
      mission: [
        "Deliver quality education with strong conceptual and applied learning.",
        "Encourage skill development, research orientation, and entrepreneurial mindset.",
        "Promote ethics, leadership, and life-long learning among students.",
      ],
    },
    programOutcomes: [
      {
        code: "PO1",
        title: "Domain Knowledge",
        description:
          "Demonstrate strong understanding of core concepts in the program domain.",
      },
      {
        code: "PO2",
        title: "Analytical Thinking",
        description:
          "Apply analytical and critical reasoning to solve practical and business problems.",
      },
      {
        code: "PO3",
        title: "Communication",
        description:
          "Communicate effectively in written and oral forms for academic and professional contexts.",
      },
      {
        code: "PO4",
        title: "Digital Competence",
        description:
          "Use digital tools and modern technologies relevant to the program area.",
      },
      {
        code: "PO5",
        title: "Teamwork and Leadership",
        description:
          "Work collaboratively and demonstrate leadership in multidisciplinary settings.",
      },
      {
        code: "PO6",
        title: "Ethics and Social Responsibility",
        description:
          "Exhibit ethical values, social concern, and environmental awareness.",
      },
      {
        code: "PO7",
        title: "Employability and Lifelong Learning",
        description:
          "Develop employability skills and engage in continuous professional development.",
      },
    ],
    advisoryBoard: [
      {
        name: "Ms. Priya N.",
        designation: "HR Business Partner",
        organization: "Cognizant",
        role: "Industry Expert",
      },
      {
        name: "Dr. T. Balaji",
        designation: "Professor",
        organization: "Bharathiar University",
        role: "Academic Expert",
      },
      {
        name: "Mr. K. Kiran",
        designation: "Alumni",
        organization: "Startup Founder",
        role: "Alumni Member",
      },
    ],
    pac: [
      {
        name: "Dr. R. Lakshmi",
        designation: "Head of Department",
        organization: "JCT",
        role: "Chairperson",
      },
      {
        name: "Ms. S. Nivetha",
        designation: "Assistant Professor",
        organization: "JCT",
        role: "Coordinator",
      },
      {
        name: "Student Representative",
        designation: "Final Year",
        organization: config.shortName,
        role: "Member",
      },
    ],
    bos: [
      {
        name: "Dr. T. Balaji",
        designation: "Professor",
        organization: "Bharathiar University",
        role: "University Nominee",
      },
      {
        name: "Dr. R. Lakshmi",
        designation: "Head of Department",
        organization: "JCT",
        role: "Chairperson",
      },
      {
        name: "Industry Specialist",
        designation: "Domain Expert",
        organization: "Corporate Sector",
        role: "Member",
      },
    ],
    curriculum: buildArtsCurriculum(config.shortName),
    teachingLearning: {
      overview:
        "The department adopts learner-centric pedagogy integrating concept classes, practical exercises, case studies, and experiential projects.",
      methods: [
        "Interactive lectures with activity-based assessments",
        "Case analysis and group discussions",
        "Mini projects and internship-driven learning",
      ],
      tools: [
        "Learning Management System",
        "Presentation and productivity tools",
        "Domain software relevant to specialization",
      ],
      practices: [
        "Bridge courses and mentoring sessions",
        "Peer learning and tutorial support",
        "Continuous feedback and remedial coaching",
      ],
    },
    valueAddedCourses: [
      {
        name: "Career Readiness and Aptitude",
        hours: "30 Hours",
        provider: "JCT Placement Cell",
        description:
          "Enhances logical reasoning, communication, and interview confidence.",
      },
      {
        name: `${config.focusAreas[0]} Certification Basics`,
        hours: "40 Hours",
        provider: "Industry Academic Partner",
        description:
          "Skill-based certification course aligned to current market demand.",
      },
    ],
    faculty: [
      {
        name: "Dr. R. Lakshmi",
        designation: "Head / Associate Professor",
        qualification: "Ph.D.",
        experience: "15 Years",
        specialization: config.focusAreas[0],
      },
      {
        name: "Ms. S. Nivetha",
        designation: "Assistant Professor",
        qualification: "M.Phil.",
        experience: "9 Years",
        specialization: config.focusAreas[1] ?? config.focusAreas[0],
      },
      {
        name: "Mr. M. Vijay",
        designation: "Assistant Professor",
        qualification: "M.Com. / M.B.A.",
        experience: "7 Years",
        specialization: config.focusAreas[2] ?? "Professional Skills",
      },
    ],
    labs: [
      {
        name: "Program Laboratory",
        description:
          "Dedicated lab with computing and subject-specific facilities to support practical components.",
        equipment: [
          "Desktop Systems",
          "Licensed Software",
          "Projector",
          "Internet Access",
        ],
      },
      {
        name: "Communication and Soft Skills Lab",
        description:
          "Supports language training, group discussion practice, and interview preparation.",
        equipment: [
          "Audio-Visual Tools",
          "Language Software",
          "Training Modules",
          "Assessment Platform",
        ],
      },
    ],
    library: {
      books: 2100,
      journals: 22,
      magazines: 18,
      digitalAccess: ["N-LIST", "NDLI", "e-ShodhSindhu", "SWAYAM"],
      description:
        "The department library houses academic references, competitive exam resources, and digital learning access.",
    },
    events: [
      {
        title: "Inter-Department Knowledge Fest",
        date: "2024-12-12",
        type: "Academic Event",
        description:
          "Students presented papers, posters, and business ideas in thematic competitions.",
      },
      {
        title: "Career Guidance Conclave",
        date: "2025-02-08",
        type: "Seminar",
        description:
          "Industry experts interacted with students on career pathways and emerging skills.",
        resourcePerson: "Senior HR and Domain Experts",
      },
    ],
    studentParticipation: {
      clubs: ["Literary Club", "Entrepreneurship Cell", "Placement Club"],
      highlights: [
        {
          title: "State-Level Presentation Winners",
          year: "2024",
          description:
            "Students secured prizes in inter-collegiate paper presentation contests.",
        },
        {
          title: "Community Outreach Program",
          year: "2023",
          description:
            "Students organized awareness and social impact activities in nearby communities.",
        },
      ],
    },
    facultyParticipation: {
      conferences: [
        {
          title: "National Conference on Higher Education",
          faculty: "Ms. S. Nivetha",
          venue: "Coimbatore",
          year: "2024",
        },
        {
          title: "International Workshop on Teaching Innovation",
          faculty: "Dr. R. Lakshmi",
          venue: "Bengaluru",
          year: "2023",
        },
      ],
      workshops: [
        "FDP on Outcome-Based Curriculum",
        "Workshop on Digital Pedagogy",
        "Training on Research Writing and Publication Ethics",
      ],
    },
    studentAchievements: [
      {
        name: "K. Aishwarya",
        title: "University Rank Holder",
        detail: "Secured top rank in end-semester university examinations.",
        year: "2024",
      },
      {
        name: "R. Naveen",
        title: "Startup Pitch Winner",
        detail: "Won incubator grant for logistics tracking business idea.",
        year: "2025",
      },
    ],
    facultyAchievements: [
      {
        name: "Dr. R. Lakshmi",
        title: "Best Faculty Award",
        detail: "Recognized for excellence in student mentoring and outcomes.",
        year: "2024",
      },
      {
        name: "Ms. S. Nivetha",
        title: "Research Publication",
        detail: "Published two peer-reviewed papers in indexed journals.",
        year: "2023",
      },
    ],
    magazine: {
      name: "Campus Insight",
      description:
        "Student-faculty newsletter showcasing achievements, ideas, and events.",
      frequency: "Quarterly",
      latestIssue: "Vol. 5 Issue 4",
      highlights: [
        "Student articles and opinion pieces",
        "Placement and internship success stories",
        "Department event reports",
      ],
    },
    careerProgression: {
      topRecruiters: [
        "Infosys BPM",
        "Sutherland",
        "Wipro",
        "HDFC",
        "ICICI Bank",
      ],
      higherStudies: [
        "M.Sc.",
        "M.B.A.",
        "M.Com.",
        "Professional Certifications",
      ],
      averagePackage: "INR 3.2 LPA",
      placementRate: "86%",
    },
    feedback: {
      curriculumProcess: [
        "Semester-wise online course feedback collection",
        "Feedback analysis by PAC and IQAC",
        "Syllabus suggestions discussed in BoS",
      ],
      facilityProcess: [
        "Infrastructure and lab feedback through mentor meetings",
        "Periodic student representative review",
        "Issue tracking and closure through department office",
      ],
      recentImprovements: [
        "Upgraded digital classroom tools",
        "Added value-added certification modules",
        "Improved placement training schedule and mock drives",
      ],
    },
  };
}

export const artsDepartments: DepartmentData[] = [
  createArtsDepartment({
    slug: "bsc-computer-science",
    name: "B.Sc. Computer Science",
    shortName: "BCS",
    intake: 60,
    focusAreas: ["Programming", "Data Analytics", "Web Development"],
  }),
  createArtsDepartment({
    slug: "bsc-ai-ml",
    name: "B.Sc. Artificial Intelligence & Machine Learning",
    shortName: "AIM",
    intake: 60,
    focusAreas: ["Machine Learning", "Data Science", "AI Applications"],
  }),
  createArtsDepartment({
    slug: "bca",
    name: "Bachelor of Computer Applications",
    shortName: "BCA",
    intake: 60,
    focusAreas: ["Application Development", "Cloud Basics", "UI/UX"],
  }),
  createArtsDepartment({
    slug: "bcom-logistics-supply-chain",
    name: "B.Com. Logistics & Supply Chain Management",
    shortName: "BCL",
    intake: 60,
    focusAreas: [
      "Logistics Operations",
      "Supply Chain Analytics",
      "Warehouse Management",
    ],
  }),
  createArtsDepartment({
    slug: "bba-logistics",
    name: "BBA Logistics",
    shortName: "BBL",
    intake: 60,
    focusAreas: ["Business Management", "Freight Operations", "Leadership"],
  }),
];
