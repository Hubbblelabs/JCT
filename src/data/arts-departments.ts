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
  bgColor?: string;
  accentColor?: string;
  aboutParagraphs?: string[];
  mission?: string[];
}): DepartmentData {
  return {
    slug: config.slug,
    name: config.name,
    shortName: config.shortName,
    college: "arts-science",
    bgColor: config.bgColor || "#800020",
    accentColor: config.accentColor || "#d4a024",
    heroImage: "/site_assests/arts.jpeg",
    about: {
      paragraphs: config.aboutParagraphs || [
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
      mission: config.mission || [
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
    aboutParagraphs: [
      "Bachelor of Computer Science (B.Sc. CS) is the foundation technology for building a rich and fulfilling information society. At the department, students are not simply taught how to program in multiple languages, but they are also given the practical training to acquire a deeper understanding, such as the basics of data structures and control structures, basic algorithms and methods involved in software design and constructions.",
      "The department provide students with the propitious platform and standard education in Computer Science education and reinforce their potential for lifelong quality career in the highly competitive global environment."
    ],
    mission: [
      "To enrich knowledge in core areas related to the field of computer science and Mathematics.",
      "To provide opportunities for acquiring in-depth knowledge in Industry 4.0/5.0 tools and techniques and there by design and implement software projects to meet customer’s business objectives.",
      "To enable graduates to pursue higher education leading to Master and Research Degrees or have a successful career in industries associated with Computer Science or as entrepreneurs."
    ]
  }),
  createArtsDepartment({
    slug: "bsc-ai-ml",
    name: "B.Sc. Artificial Intelligence & Machine Learning",
    shortName: "AIM",
    intake: 60,
    focusAreas: ["Machine Learning", "Data Science", "AI Applications"],
    aboutParagraphs: [
      "B.Sc. Artificial Intelligence & Machine learning programme prepare students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications. During the past ten years, data science has emerged as one of the most high-growth, dynamic and lucrative careers in technology.",
      "The department aims to providing not only the core technologies such as artificial intelligence, data mining and data modelling but also gives intensive inputs in areas of machine learning and big data analytics.",
      "The students will gain cross-disciplinary skills across fields such as statistics, computer science, machine learning, and logic, data scientist and may have career opportunities in health care, business, social networking companies, climatology, biotechnology, genetics and other important areas.",
      "The major focus of the department is to equip students with statistical, mathematical reasoning, machine learning, knowledge discovery and visualization skills."
    ],
    mission: [
      "Expertized with the principles of Artificial Intelligence and problem solving, inference, perception, knowledge representation, and learning.",
      "Exhibit high standards with regard to application of AI techniques in intelligent agents, expert systems, artificial neural networks and other machine learning models.",
      "Investigate with a machine learning model for simulation and analysis and explore the scope, potential, limitations, and implications of intelligent systems."
    ]
  }),
  createArtsDepartment({
    slug: "bca",
    name: "Bachelor of Computer Applications",
    shortName: "BCA",
    intake: 60,
    focusAreas: ["Application Development", "Cloud Basics", "UI/UX"],
    aboutParagraphs: [
      "BCA is a three-year undergraduate degree program for candidates wishing to start a career in computers and its applications. This department aims to provide the graduates the required skills from fundamentals to current technologies for them to create efficient solution for industrial and real-life problems.",
      "The department provides the graduates with the knowledge and promote innovative thoughts by addressing design and developmental trade-offs in the IT industry. It comprises of papers like database, networking, data structure, core programming languages like ‘C’ and ‘Java’. This course develops critical, analytical thinking and problem solving abilities for a smooth transition from academic to real-life work environment. In addition, students are trained in communication skills and interdisciplinary topics to enhance their skills and employment opportunities."
    ],
    mission: [
      "Aims to inculcating essential skills as demanded by the global software industry through interactive learning process. This also include team-building skills, audio-visual presentations and personality development programs.",
      "To enable students for pursuing respectable career through self-employment, executive employment, entrepreneurship, professional career in the field of service sectors such as web design, data analysis, network security, and software development.",
      "To provide students with the knowledge and abilities necessary for professions in the software sector, as well as with the application of computers."
    ]
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
    aboutParagraphs: [
      "The focus of the department is to build the wide range of knowledge in the areas of accounting concepts and techniques to meet the current and future requirement of the industry.",
      "The department aim to develop the strong knowledge in the areas such as finance, taxation, and laws relating to commerce helps to relate the conceptual and analytical skills in the field of auditing, finance etc.",
      "This programme offers the students value-based education by acquiring adequate knowledge, skill and attitude to creatively and systematically apply the principles and practices of management, accountancy, finance, business law, statistics, HR, operations and IT to management problems and work effectively in modern day business and non-business organizations specifically in areas of Logistics and Supply Chain Management.",
      "Inculcate the students to nurture their skills in personal, interpersonal, intellectual and other skills to develop their professional career and growth."
    ],
    mission: [
      "Empower the graduates to develop comprehensive professional skills which are required for commerce with specialization in logistics and supply chain management.",
      "To enhance various commerce functions such as finance, accounting, financial analysis, project evaluation, taxation and cost accounting.",
      "Enable the students to engage exams like C.A., C.S., and CMA."
    ]
  }),
  createArtsDepartment({
    slug: "bba-logistics",
    name: "BBA Logistics",
    shortName: "BBL",
    intake: 60,
    focusAreas: ["Business Management", "Freight Operations", "Leadership"],
    aboutParagraphs: [
      "BBA Logistics, a three-year full time degree program essentially covering the concepts and process involved in logistics. Logistic management includes the designing and administration to control the flow of materials to all business units.",
      "The curriculum is designed to give a holistic business perspective with in-depth industry knowledge in logistic domain. It equips students with required business expertise and industry-centric knowledge.",
      "Demonstrate the critical thinking mindset and the ability to identify and formulate research problems, research literature, design tools, analyze and interpret data, and synthesize the information to provide valid conclusions and Logistical approaches across a variety of subject matter."
    ],
    mission: [
      "Graduates will be capable of making a positive contribution to business, trade and industry in the national and global context in logistics.",
      "Graduates will be able to apply frameworks and tools to arrive at informed decisions in profession and practice, striking a balance between business and social dimensions.",
      "Graduates will have solid foundation to pursue professional careers and take up higher learning courses such as MBA, MCA, MCM, MMM as well as research."
    ]
  }),
  createArtsDepartment({
    slug: "bsc-digital-cyber-forensic-science",
    name: "B.Sc. Digital & Cyber Forensic Science",
    shortName: "BCF",
    intake: 60,
    focusAreas: ["Cyber Security", "Digital Forensics", "Incident Response"],
    bgColor: "#0f172a",
    accentColor: "#06b6d4",
    aboutParagraphs: [
      "The Department of B.Sc. Digital & Cyber Forensic Science is dedicated to providing quality education and training in the field of cyber security, digital investigation, and forensic analysis. The department focuses on developing students’ technical expertise in handling cybercrimes, data recovery, digital evidence collection, and analysis using modern tools and technologies.",
      "It aims to bridge the gap between theoretical knowledge and practical application by offering hands-on training, case studies, and industry-oriented learning. The department encourages ethical practices, critical thinking, and problem-solving skills to prepare students for real-world challenges in cybercrime investigation and digital security.",
      "With a curriculum aligned to current industry needs, the department prepares students for careers in law enforcement agencies, IT companies, cybersecurity firms, and forensic laboratories, while also promoting research and innovation in the field of digital forensics."
    ],
    mission: [
      "To equip students with advanced knowledge and practical skills in digital and cyber forensic science.",
      "The program aims to develop ethical professionals who can contribute effectively to law enforcement agencies, corporate sectors, and digital security domains while adapting to emerging technologies and cyber threats."
    ]
  }),
  createArtsDepartment({
    slug: "bcom-computer-applications",
    name: "B.Com. Computer Applications",
    shortName: "BCA-COM",
    intake: 60,
    focusAreas: ["Commerce", "Computer Applications", "Accounting Software"],
    bgColor: "#1e1b4b",
    accentColor: "#fbbf24",
    aboutParagraphs: [
      "The Department of B. Com Computer Applications focuses on building a strong foundation in commerce along with practical knowledge of computer applications. It equips students with essential skills in accounting, finance, business management, and the use of modern digital tools required in today’s business environment.",
      "The department emphasizes a balanced approach between theoretical concepts and hands-on training in trending areas such as Data Analytics (Excel, Power BI), Cloud Accounting (Tally Prime, Zoho Books), E-commerce Management, and Digital Marketing.",
      "Students also gain practical exposure to ERP systems, database management, and financial technologies (FinTech). Through workshops, internships, live projects, and industry-oriented training, students develop real-world skills. The program also enhances analytical thinking, problem-solving abilities, and ethical values, preparing students to adapt to the rapidly evolving corporate and digital business world."
    ],
    mission: [
      "To provide quality education in commerce integrated with computer applications, equipping students with strong knowledge in accounting, business management, and information technology.",
      "To develop skilled and ethical professionals who can effectively use modern software tools, adapt to technological advancements, and meet the demands of the corporate world."
    ]
  }),
];
