#!/usr/bin/env node
/**
 * Usage: node scripts/seed-programs-engineering.js
 * Requires: MONGODB_URI env var
 *
 * Updates existing engineering program documents with full department content.
 * Only updates — never inserts new documents. Image field is never touched.
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Environment variable MONGODB_URI is required.");
  process.exit(1);
}

// ─── Program data ──────────────────────────────────────────────────────────────

const PROGRAMS = [
  // ── Mechanical Engineering ──────────────────────────────────────────────────
  {
    slug: "mech",
    name: "Mechanical Engineering",
    abbr: "MECH",
    degree: "B.E.",
    duration: "4 Years",
    seats: 120,
    highlight:
      "Design, Manufacturing, Thermal & Materials Engineering with NBA-accredited program and 98% placement record.",
    description:
      "The Mechanical Engineering Department at JCT College of Engineering started in 2009 with expertise in Design, Manufacturing, Thermal and Materials Engineering. Faculty actively engaged in research mentor students through hands-on training.",
    outcomes: [
      "Successful career in Mechanical engineering domain and related disciplines",
      "Optimum solutions to challenging Design and Manufacturing problems with ethical values",
      "Project management skills and ability to work in collaborative, multidisciplinary environments",
      "Functional skills for careers in design, manufacturing, and service through industry exposure",
      "Ability to identify, evaluate, and resolve engineering issues in mechanical and associated fields",
    ],
    is_active: true,
    sort_order: 0,
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
        "The might of the Department, apart from its Students, is its Qualified and Experienced Faculty/Staff. Faculties are actively engaged in Teaching and mentoring students apart from pursuing their research activities in the emerging fields of engineering. The department has a resourceful team of faculty that mostly consists of PG holders.",
      about3:
        "Faculty members regularly attend technical workshops and seminars organized by various technical institutes, and many of them have presented papers at national level seminars. Major Industries that employ Mechanical Engineers include Automobiles, Space research, Aeronautical, Energy and utilities, Air conditioning, and Bio-Mechanical industry.",

      established: "2009",
      accreditation: "AICTE, NBA",
      intake: 120,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. M. Bhuvaneshwaran",
      hodDesignation: "Professor and Head",
      hodQualification: "Ph.D",
      hodExperience: "Engineering Design",
      hodMessage: [
        "Welcome to the Department of Mechanical Engineering at JCT College of Engineering and Technology. Our department is committed to producing competent and socially responsible professional engineers who contribute to research and innovation.",
        "We provide quality education in the specialized fields of Design, Manufacturing, Thermal and Materials Engineering, equipping students with the knowledge and skills required to excel in their engineering careers.",
      ],

      vision:
        "To be a foremost department in the field of Mechanical Engineering, producing competent and socially responsible professional engineers as well as contributing to research.",

      mission: [
        "To cultivate a competitive atmosphere that encourages creative and novel concepts through hands-on training.",
        "To create a perpetual learning environment that encourages ethics, leadership and research endeavors.",
        "To impart relevant and quality education to meet the needs of industry and society.",
        "To furnish individuals with the critical skills and knowledge required to excel and prosper in their roles as engineers and leaders.",
      ],

      programOutcomes: [
        {
          code: "PO1",
          title: "Engineering Knowledge",
          description:
            "Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.",
        },
        {
          code: "PO2",
          title: "Problem Analysis",
          description:
            "Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.",
        },
        {
          code: "PO3",
          title: "Design/Development of Solutions",
          description:
            "Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for public health and safety, and cultural, societal, and environmental considerations.",
        },
        {
          code: "PO4",
          title: "Conduct Investigations of Complex Problems",
          description:
            "Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.",
        },
        {
          code: "PO5",
          title: "Modern Tool Usage",
          description:
            "Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.",
        },
        {
          code: "PO6",
          title: "The Engineer and Society",
          description:
            "Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.",
        },
        {
          code: "PO7",
          title: "Environment and Sustainability",
          description:
            "Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.",
        },
        {
          code: "PO8",
          title: "Ethics",
          description:
            "Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.",
        },
        {
          code: "PO9",
          title: "Individual and Team Work",
          description:
            "Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.",
        },
        {
          code: "PO10",
          title: "Communication",
          description:
            "Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.",
        },
        {
          code: "PO11",
          title: "Project Management and Finance",
          description:
            "Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.",
        },
        {
          code: "PO12",
          title: "Life-long Learning",
          description:
            "Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.",
        },
        {
          code: "PSO1",
          title: "Industry-Ready Skills",
          description:
            "Demonstrate their functional skills for careers in design, manufacturing, and service by acquiring knowledge through centers of excellence and practical industrial exposure.",
        },
        {
          code: "PSO2",
          title: "Problem Resolution",
          description:
            "Identify, evaluate, and resolve the engineering issues pertaining to mechanical domain and their associated fields aimed at promoting and enhancing societal welfare.",
        },
      ],

      advisoryBoard: [
        {
          name: "Thiru. R. DurgaShankar",
          designation: "Secretary",
          organization: "JCT Group of Institutions, Coimbatore",
          role: "Chairman",
        },
        {
          name: "Dr. S. Manoharan",
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
          name: "Mr. Kalaiappan",
          designation: "Managing Director",
          organization: "Avinash Industries, Coimbatore",
          role: "Industry Expert",
        },
        {
          name: "Dr. S. R. Devadasan",
          designation: "Professor, Dept of Production Engineering",
          organization: "PSG College of Technology, Coimbatore",
          role: "Senior Academician",
        },
        {
          name: "Dr. G. Magesh",
          designation: "Head of Department",
          organization: "Department of Mechanical Engineering, JCTCET",
          role: "HOD",
        },
        {
          name: "Dr. I. J. Isaac PremKumar",
          designation: "Associate Professor",
          organization: "Mechanical Engineering Department, JCTCET",
          role: "Senior Faculty",
        },
        {
          name: "Mr. D. Vigneshwar",
          designation: "Alumni Student",
          organization: "JCTCET Alumni",
          role: "Alumni Representative",
        },
      ],

      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. M. Bhuvaneshwaran",
          designation: "Professor and Head",
          qualification: "Ph.D",
          experience: "15+ Years",
          specialization: "Engineering Design",
        },
        {
          name: "Dr. I. J. Isaac Premkumar",
          designation: "Associate Professor",
          qualification: "Ph.D",
          experience: "12+ Years",
          specialization: "Thermal Engineering",
        },
        {
          name: "Dr. M. Vijayakumar",
          designation: "Associate Professor",
          qualification: "Ph.D",
          experience: "12+ Years",
          specialization: "Manufacturing Engineering",
        },
        {
          name: "Dr. D. Elangovan",
          designation: "Professor and CoE",
          qualification: "Ph.D",
          experience: "18+ Years",
          specialization: "Production Engineering",
        },
        {
          name: "Mr. D. Anandakumar",
          designation: "Assistant Professor",
          qualification: "M.E. (Ph.D)",
          experience: "8+ Years",
          specialization: "Engineering Design",
        },
        {
          name: "Mr. P. Sureshkumar",
          designation: "Assistant Professor",
          qualification: "M.E. (Ph.D)",
          experience: "8+ Years",
          specialization: "Engineering Design",
        },
        {
          name: "Mr. R. Mahendran",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Engineering Design",
        },
        {
          name: "Mr. M. Prabhu",
          designation: "Assistant Professor",
          qualification: "M.E. (Ph.D)",
          experience: "7+ Years",
          specialization: "Thermal Engineering",
        },
        {
          name: "Mr. S. Settu",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Engineering Design",
        },
        {
          name: "Mr. P. Siva",
          designation: "Assistant Professor",
          qualification: "M.E. (Ph.D)",
          experience: "7+ Years",
          specialization: "Manufacturing Engineering",
        },
        {
          name: "Mr. R. Sivaraman",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "6+ Years",
          specialization: "Engineering Design",
        },
        {
          name: "Mr. D. Ashokkumar",
          designation: "Assistant Professor",
          qualification: "M.E. (Ph.D)",
          experience: "7+ Years",
          specialization: "Manufacturing Engineering",
        },
      ],

      labs: [
        {
          name: "Thermal Engineering Laboratory",
          description:
            "Equipped with two stroke and four stroke petrol and diesel engines. Includes refrigeration test rigs, emission analyzers, and boiler and steam turbine setups.",
          equipment: [
            "Two Stroke Petrol Engine",
            "Four Stroke Diesel Engine",
            "Refrigeration Test Rigs",
            "Emission Analyzer",
            "Boiler and Steam Turbine",
          ],
        },
        {
          name: "Heat and Mass Transfer Laboratory",
          description:
            "Established with necessary testing equipment to study conduction, convection, radiation and mixed modes of heat transfer in fins and heat exchangers.",
          equipment: [
            "Fin Heat Transfer Setup",
            "Heat Exchanger Test Rigs",
            "Conduction Apparatus",
            "Radiation Setup",
            "Natural and Forced Convection Units",
          ],
        },
        {
          name: "Manufacturing Technology Laboratory – I",
          description:
            "All varieties of lathes including Turret lathe and all-geared lathe for machining. Equipped with injection moulding machine.",
          equipment: [
            "Turret Lathe",
            "All Geared Lathe",
            "Dynamometer",
            "Injection Moulding Machine",
            "Measuring Instruments",
          ],
        },
        {
          name: "Manufacturing Technology Laboratory – II",
          description:
            "Special machines lab with Universal drilling, Gear Hobbing, Grinding, Vertical milling, Horizontal milling, and Shaping machines.",
          equipment: [
            "Universal Drilling Machine",
            "Gear Hobbing Machine",
            "Grinding Machine",
            "Vertical Milling Machine",
            "Horizontal Milling Machine",
            "Shaping Machine",
          ],
        },
        {
          name: "CAD/CAM Laboratory",
          description:
            "CAD software: AutoCAD, Pro-E, ANSYS, Fluent, CATIA, Mechanical Desktop, MasterCAM, and Unigraphics. CAM Lab has CNC Lathe and CNC Mill.",
          equipment: [
            "AutoCAD Workstations",
            "Pro-E / CATIA Software",
            "ANSYS / Fluent Software",
            "CNC Lathe",
            "CNC Milling Machine",
            "MasterCAM Software",
          ],
        },
        {
          name: "Mechatronics Laboratory",
          description:
            "Established with latest facilities including PLC kits, hydraulics and pneumatics, and servomotor control systems.",
          equipment: [
            "PLC Kits",
            "Hydraulic Test Bench",
            "Pneumatic Test Bench",
            "Servomotor Control Unit",
            "PneumoSim Software",
            "HydroSim Software",
          ],
        },
        {
          name: "Metrology and Measurements Laboratory",
          description:
            "Houses various precision instruments for measuring and calibration of tools and machines.",
          equipment: [
            "Micrometer Set",
            "Vernier Calipers",
            "Auto Collimator",
            "Tool Maker's Microscope",
            "Dial Gauge Calibration Setup",
            "Mechanical and Electronic Comparators",
          ],
        },
        {
          name: "Dynamics Laboratory",
          description:
            "Equipped with Vibration Measurement Demonstration System, Milling Tool Dynamometer, Torsional Vibration setup, and Vibration FFT Analyser.",
          equipment: [
            "Vibration Measurement Demonstration System",
            "Milling Tool Dynamometer",
            "Torsional Vibration Setup",
            "Forced Vibration Apparatus",
            "Vibration FFT Analyser",
          ],
        },
        {
          name: "Engineering Practices Laboratory",
          description:
            "Equipped with tools for Smithy, Plumbing, Fitting, Carpentry, Welding, Machine Assembly, Foundry and basic machining practices.",
          equipment: [
            "Smithy Tools",
            "Plumbing Kits",
            "Fitting Tools",
            "Carpentry Tools",
            "Welding Equipment",
            "Foundry Equipment",
          ],
        },
      ],

      teachingLearning: {
        overview:
          "The department employs innovative teaching-learning methodologies to enhance student understanding and industry readiness.",
        methods: [
          "Project-Based Learning (PBL)",
          "Peer Group Learning",
          "Problem-Based Learning",
          "Google Classroom & Blended Learning",
          "Expert Talks and Guest Lectures",
          "Industrial Visits",
        ],
        tools: [
          "ERP Software",
          "Google Classroom",
          "AutoCAD, ANSYS, CATIA",
          "MATLAB / Simulink",
          "Solidworks",
        ],
        practices: [
          "Bridge Courses for first-year students",
          "Value-Added Courses on industry software",
          "Technical Workshops and Seminars",
          "National Level Symposium – J-Finagles",
        ],
      },

      valueAddedCourses: [
        {
          name: "Computer Aided Modeling – Solidworks / Pro-E",
          hours: "30",
          provider: "Department of Mechanical Engineering, JCTCET",
          description:
            "Hands-on training on industry-standard 3D modeling software.",
        },
        {
          name: "Computer Aided Manufacturing – EdgeCAM",
          hours: "24",
          provider: "Department of Mechanical Engineering, JCTCET",
          description:
            "Training on CNC programming and manufacturing simulation.",
        },
        {
          name: "Computer Aided Analysis – ANSYS",
          hours: "24",
          provider: "Department of Mechanical Engineering, JCTCET",
          description: "Finite element analysis using ANSYS software.",
        },
        {
          name: "Computer Aided Analysis – CFD",
          hours: "24",
          provider: "Department of Mechanical Engineering, JCTCET",
          description:
            "Computational Fluid Dynamics analysis for thermal and fluid engineering.",
        },
      ],

      events: [
        {
          title: "J-Finagles – National Level Technical Symposium",
          date: "2024-04-03",
          type: "National Level Symposium",
          description:
            "Annual national level technical symposium organized by the Department of Mechanical Engineering.",
          resourcePerson: "Dr. S. Manoharan",
        },
        {
          title: "International Conference ICAMMCA 2024",
          date: "2024-04-24",
          type: "International Conference",
          description:
            "3rd International Conference on Advanced Materials, Modern Manufacturing, and Computerized Automation.",
          resourcePerson: "Dr. K. Raja, Dr. S. Sudhakar",
        },
      ],

      studentParticipation: {
        clubs: [
          "Mechanical Engineering Association",
          "SAE India Collegiate Club",
          "Robotics Club",
          "Energy Club",
          "Fine Arts Club",
          "National Service Scheme (NSS)",
        ],
        highlights: [
          {
            title: "Coconut Peeling Machine",
            year: "2024",
            description:
              "Student project to fabricate an automated coconut peeling machine reducing cycle time and manpower.",
          },
          {
            title: "Fabrication of Self-Charging E-Bike",
            year: "2023",
            description:
              "Students developed an electric bike with an inbuilt continuous charging system.",
          },
        ],
      },

      studentAchievements: [],
      facultyAchievements: [],

      facultyParticipation: {
        conferences: [],
        workshops: [
          "Faculty Development Program on FUSION 360 (2023)",
          "Faculty Development Program on HEAT AND MASS TRANSFER (2023)",
          "Three Day Faculty Development Program on Thermal Engineering 1 (2022)",
        ],
      },

      careerProgression: {
        topRecruiters: [
          "TVS Brakes India Limited",
          "Wipro Kawasaki Precision Machinery",
          "Brakes India Private Limited",
          "Sundaram Auto Components Limited",
          "Titan Company",
          "JSE Engineering Pvt Ltd",
          "Wheels India Ltd",
          "Pinnacle Infotech Solutions",
          "ARG Tech Machinery",
          "Seros Energy Pvt Ltd",
        ],
        higherStudies: [
          "M.E. / M.Tech (Anna University affiliated colleges)",
          "MBA (Management Programs)",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad (USA, UK, Germany)",
        ],
        averagePackage: "3.5 LPA",
        placementRate: "98%",
      },

      feedback: {
        curriculumProcess: [
          "Regular curriculum revision based on industry feedback",
          "Alumni feedback incorporated every academic year",
          "Industry experts on Board of Studies for curriculum updates",
        ],
        facilityProcess: [
          "Annual lab upgradation based on student and faculty feedback",
          "New software tools added based on industry demand",
        ],
        recentImprovements: [
          "Added Solidworks and EdgeCAM to value-added course offerings",
          "Established Mechatronics Lab with PLC and hydraulics",
          "Introduced project-based learning methodology across all years",
          "Integrated Google Classroom for blended learning",
        ],
      },

      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2009" },
        { icon: "Users", label: "Intake", value: "120 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "Anna University" },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE, NBA" },
        { icon: "Briefcase", label: "Placement Rate", value: "98%" },
      ],
    },
  },

  // ── Petrochemical Technology ────────────────────────────────────────────────
  {
    slug: "petrochemical-technology",
    name: "Petrochemical Technology",
    abbr: "PCT",
    degree: "B.E.",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Industry-aligned curriculum in petrochemical processes, polymer technology, and energy sectors.",
    description:
      "The Department of Petrochemical Engineering was started in 2011 to render services to the student community to meet global industrial expectations. The department is well equipped with modern sophisticated laboratories.",
    outcomes: [
      "Design and develop petrochemical processes within modern petroleum refining and petrochemical industries",
      "Analyze and create effective solutions for problems in the petrochemical industry through R&D skills",
      "Demonstrate knowledge in chemical engineering complemented with appropriate practical skills",
      "Contribute as team members on multidisciplinary projects with effective communication skills",
    ],
    is_active: true,
    sort_order: 1,
    content: {
      name: "Petrochemical Technology",
      college: "engineering",
      shortName: "PCT",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.E.",

      about1:
        "The Department of Petrochemical Engineering was started in the year 2011 to render services to the student community to meet as the global industrial expectations. The department is well equipped with various laboratories with modern sophisticated equipments.",
      about2:
        "The Department's mission is to advance, evolve and enhance petrochemical engineering fundamentals to build the intellectual capital of our research and of our students. Our endeavor is to make the PCE Department an important regional, national and international resource center for the development of energy (oil & gas) and environment (pollution free sustainable processes & products) sectors.",
      about3:
        "Petrochemical Engineers are able to break down oil or natural gas into its base components and then reconstruct it as specific types of oil products such as auto fuel, as well as plastics, polymers and other compounds. Graduates have plenty of job opportunities in oil and gas, specialty chemicals, rubber and plastics, power production, biotechnology, and petrochemical plants.",

      established: "2011",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. A. Murugesan",
      hodDesignation: "Professor and Head",
      hodQualification: "M.Tech, Ph.D",
      hodExperience: "Chemical Engineering",
      hodMessage: [
        "Welcome to the Department of Petrochemical Technology at JCT College of Engineering and Technology. Our department is committed to producing industry-ready graduates equipped with technical excellence and professional commitment.",
        "We are dedicated to advancing petrochemical engineering education to build the intellectual capital of our students, making the department an important resource center for the development of energy and environment sectors.",
      ],

      vision:
        "To empower the students with technological excellence, professional commitment and social responsibility to serve the nation and petrochemical industry needs.",

      mission: [
        "To bring out industry ready, career oriented graduates by means of innovative practices in Teaching and Learning.",
        "To inculcate ethical values, communication, team work, leadership and entrepreneurial skills to contribute to society.",
        "To nurture the students to be dynamic for long term industry-institute interaction, versatile in their professional commitment.",
        "To provide learner centric environment by imparting quality education through innovation and research to cater the needs of the society.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Technical Knowledge",
          description:
            "Shall have contemporary knowledge and competency in petrochemical technology complemented with appropriate practical skills.",
        },
        {
          code: "PEO2",
          title: "Professional Skills",
          description:
            "Shall contribute as team members on multidisciplinary projects with effective communication skills, individual, supportive and leadership qualities with the right attitudes and ethics.",
        },
        {
          code: "PEO3",
          title: "Lifelong Learning",
          description:
            "Shall have interest on life-long learning, research and development to continuously strive for the forefront of technology.",
        },
        {
          code: "PSO1",
          title: "Process Design",
          description:
            "Design and develop petrochemical processes and various units within modern petroleum refining and petrochemical industries.",
        },
        {
          code: "PSO2",
          title: "Problem Solving",
          description:
            "Analyze and create effective solutions for problems in the petrochemical industry through research and development skills.",
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
          name: "Dr. S. Manoharan",
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
          name: "Dr. B. Balraj",
          designation: "Dean-Academics",
          organization: "JCT CET, Coimbatore",
          role: "Academic Representative",
        },
        {
          name: "Mr. D. Ranjithkumar",
          designation: "CEO",
          organization: "Ecologic Ads Pvt Ltd, Coimbatore",
          role: "Industry Expert",
        },
        {
          name: "Dr. V. Saravanan",
          designation: "Associate Professor, Chemical Engineering",
          organization: "Annamalai University, Chidambaram",
          role: "Senior Academician",
        },
        {
          name: "Dr. A. Murugesan",
          designation: "Head of Department, Petrochemical Engineering",
          organization: "JCT CET, Coimbatore",
          role: "HOD",
        },
        {
          name: "Dr. K. Ramachandran",
          designation: "Head of Department, Petroleum Engineering",
          organization: "JCT CET, Coimbatore",
          role: "Faculty Representative",
        },
      ],

      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. A. Murugesan",
          designation: "Professor and Head",
          qualification: "M.Tech, Ph.D",
          experience: "15+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Dr. P. Ezhil Kumar",
          designation: "Associate Professor",
          qualification: "M.Tech, Ph.D",
          experience: "12+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mr. B. Parthiban",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "6+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mr. K. Kaviyarasan",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "5+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mr. J. Praveen Kumar",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "5+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mrs. M. Sowntharya",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "5+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mrs. L. Nithya",
          designation: "Assistant Professor",
          qualification: "M.E.",
          experience: "5+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mrs. R. Ramya",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mr. C. Sarathy",
          designation: "Assistant Professor",
          qualification: "M.Tech",
          experience: "4+ Years",
          specialization: "Petroleum Refining and Petrochemicals",
        },
      ],

      labs: [
        {
          name: "Fluid Mechanics Laboratory",
          description:
            "Equipped with instruments to study fluid flow, pressure measurement, and fluid behavior in piping systems.",
          equipment: [
            "Venturi Meter",
            "Orifice Meter",
            "Rotameter",
            "Centrifugal Pump",
            "Pressure Gauges",
          ],
        },
        {
          name: "Heat Transfer Laboratory",
          description:
            "Facilities for studying various modes of heat transfer including conduction, convection and radiation.",
          equipment: [
            "Heat Exchanger Test Rigs",
            "Fin Heat Transfer Setup",
            "Natural and Forced Convection Units",
            "Radiation Setup",
          ],
        },
        {
          name: "Petroleum Testing Laboratory",
          description:
            "Equipped to test various petroleum products and determine their properties as per industry standards.",
          equipment: [
            "Flash and Fire Point Apparatus",
            "Viscometer",
            "Distillation Unit",
            "Carbon Residue Tester",
            "Pour Point and Cloud Point Tester",
          ],
        },
        {
          name: "Mass Transfer Laboratory",
          description:
            "Facilities to study mass transfer operations including absorption, distillation, and extraction.",
          equipment: [
            "Distillation Column",
            "Liquid-Liquid Extraction Setup",
            "Absorption Column",
            "Packed Tower",
          ],
        },
        {
          name: "Process Control and Instrumentation Laboratory",
          description:
            "Equipped with modern instrumentation and control systems for process monitoring and automation.",
          equipment: [
            "PLC Control Systems",
            "Temperature Control Unit",
            "Level Control Unit",
            "Pressure Control Unit",
          ],
        },
      ],

      teachingLearning: {
        overview:
          "The department employs innovative teaching-learning methodologies including project-based learning, flipped classrooms, and expert talks.",
        methods: [
          "Project-Based Learning Methodology",
          "Flipped Classroom",
          "Peer Group Learning",
          "Quiz Platform Methodology",
          "Expert Talks",
          "ERP Software Integration",
        ],
        tools: [
          "ERP Software",
          "Google Classroom",
          "NPTEL Online Courses",
          "Process Simulation Software",
        ],
        practices: [
          "Bridge Courses for first-year students",
          "Value-Added Courses",
          "Industrial Visits to Petrochemical Plants",
          "Alumni Talks and Guest Lectures",
        ],
      },

      valueAddedCourses: [],
      events: [],
      studentAchievements: [],
      facultyAchievements: [],

      studentParticipation: {
        clubs: [
          "Petrochemical Engineering Association",
          "Energy Club",
          "Environmental Club",
          "Fine Arts Club",
          "National Service Scheme (NSS)",
        ],
        highlights: [],
      },

      facultyParticipation: {
        conferences: [],
        workshops: [
          "Workshop on Innovative Curriculum Design And Implementation (2024)",
          "Webinar on Unit Operations in Chemical and Petrochemical Technology (2024)",
          "Faculty Induction Program (2024)",
        ],
      },

      careerProgression: {
        topRecruiters: [
          "Indian Oil Corporation (IOCL)",
          "ONGC",
          "Reliance Industries",
          "Bharat Petroleum",
          "Haldia Petrochemicals",
          "Chemplast Sanmar",
          "Cochin Refineries",
          "IG Petrochemicals",
          "Finolex Industries",
        ],
        higherStudies: [
          "M.E. / M.Tech in Chemical/Petrochemical Engineering",
          "MBA (Management Programs)",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad",
        ],
        averagePackage: "3.5 LPA",
        placementRate: "90%",
      },

      feedback: {
        curriculumProcess: [
          "Regular curriculum revision based on industry feedback",
          "Alumni feedback incorporated every academic year",
          "Industry experts on Board of Studies for curriculum updates",
        ],
        facilityProcess: [
          "Annual lab upgradation based on student and faculty feedback",
          "New instruments added based on industry demand",
        ],
        recentImprovements: [
          "Introduced project-based learning methodology",
          "Added quiz platform for continuous assessment",
          "Integrated ERP software training",
        ],
      },

      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2011" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "Anna University" },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "90%" },
      ],
    },
  },

  // ── Petroleum Engineering ───────────────────────────────────────────────────
  {
    slug: "petroleum-engineering",
    name: "Petroleum Engineering",
    abbr: "PE",
    degree: "B.E.",
    duration: "4 Years",
    seats: 60,
    highlight:
      "Specialized program in oil & gas exploration, drilling, reservoir, and production engineering.",
    description:
      "JCT started a bachelor degree course in Petroleum Engineering in 2013 to address the ever-increasing demand for safe sources of energy in the oil and gas sector.",
    outcomes: [
      "Survey and interpret data for oil and gas exploration and exploitation",
      "Analyze, design and evaluate various components using state-of-art technology in petroleum exploration",
      "Demonstrate technical abilities and understanding of the fuel, gas, and oilfield industries",
      "Demonstrate strong leadership qualities to follow energy fields with beneficial social impact",
    ],
    is_active: true,
    sort_order: 2,
    content: {
      name: "Petroleum Engineering",
      college: "engineering",
      shortName: "PE",
      bgColor: "#0F172A",
      accentColor: "#FFC917",
      heroImage: "/site_assests/engineering.jpeg",
      degreePrefix: "B.E.",

      about1:
        "As the world is highly dependent upon petroleum as a source of energy, a career in the field is bound to be attractive and challenging. JCT has started a bachelor degree course in petroleum engineering in 2013.",
      about2:
        "Petroleum Engineering offers excellent career opportunities to the graduates. The scope for freshers in public firms is very high. The corporate sector also provides ample space for fresh graduates. The various fields offered include exploration, extraction and production of petroleum.",
      about3:
        "Petroleum Engineers mainly have needs in refineries of petrochemical plants as well as downstream petroleum industries and R&D Organizations. The field covers exploration, production, drilling, reservoir, and mud engineering among several profiles.",

      established: "2013",
      accreditation: "AICTE",
      intake: 60,
      affiliation: "Anna University, Chennai",
      duration: "4 Years",

      hodName: "Dr. Ramachandran K",
      hodDesignation: "Professor and Head",
      hodQualification: "M.E./M.Tech, Ph.D",
      hodExperience: "Petroleum Refining and Petrochemical Engineering",
      hodMessage: [
        "Welcome to the Department of Petroleum Engineering at JCT College of Engineering and Technology. Our department aims to create competent petroleum engineers who contribute to building a better world.",
        "We focus on providing skill-based professional education that strengthens industry-institute interface, developing teamwork and entrepreneurial skills in our graduates.",
      ],

      vision:
        "The department aims to create competent petroleum engineers to build a better world through professional service and research for affordable, eco-friendly oil and gas production.",

      mission: [
        "To improve the skill based professional education activities, governing responsibility, coordination, standard, and moral in line with quality teaching learning process.",
        "To strengthen industry institute interface for developing team work and entrepreneur skills.",
        "To maintain good relationship with innovative research and development in the benefit of oil and gas society.",
      ],

      programOutcomes: [
        {
          code: "PEO1",
          title: "Technical Proficiency",
          description:
            "Demonstrate the technical abilities and basic understanding of the fuel, gas, and oilfield industries.",
        },
        {
          code: "PEO2",
          title: "Innovation and Research",
          description:
            "Explore higher education, scientific research and development, entrepreneurship, and professional sectors that reflect innovation and originality.",
        },
        {
          code: "PEO3",
          title: "Ethics and Leadership",
          description:
            "Managing ethical values and demonstrate strong leadership qualities to follow energy fields in a way that will have a beneficial social impact.",
        },
        {
          code: "PSO1",
          title: "Exploration Skills",
          description:
            "Survey and Interpret data for oil and gas Exploration and Exploitation.",
        },
        {
          code: "PSO2",
          title: "Technology Application",
          description:
            "Analyze, design and evaluate various components, methods and systems using state-of-art technology in petroleum Exploration and Exploitation.",
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
          name: "Dr. S. Manoharan",
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
          name: "Mr. K. P. Ramachandran",
          designation: "General Manager (Res)",
          organization: "Oil and Gas Corporation Ltd, Chennai",
          role: "Industry Expert",
        },
        {
          name: "Dr. Ramachandran K",
          designation: "Professor and Head, Petroleum Engineering",
          organization: "JCT CET, Coimbatore",
          role: "HOD",
        },
        {
          name: "Dr. J. Jayapriya",
          designation: "Professor",
          organization: "Anna University, Chennai",
          role: "Senior Academician",
        },
        {
          name: "Dr. M. Rajasimman",
          designation: "Professor",
          organization: "Annamalai University, Chidambaram",
          role: "Senior Academician",
        },
        {
          name: "Dr. S. Venkatesh Babu",
          designation: "Professor, Petroleum Engineering",
          organization: "JCT CET, Coimbatore",
          role: "Senior Faculty",
        },
        {
          name: "Mr. N. Rajesh Kumar",
          designation: "Alumni (2013-2017 Batch)",
          organization: "JCTCET Alumni",
          role: "Alumni Representative",
        },
        {
          name: "Mr. Augustine R",
          designation: "Parent",
          organization: "F/O Mr. A. Samuel (2022-2026 Batch)",
          role: "Parent Representative",
        },
      ],

      pac: [],
      bos: [],
      curriculum: [],

      faculty: [
        {
          name: "Dr. Ramachandran K",
          designation: "Professor and Head",
          qualification: "M.E./M.Tech, Ph.D",
          experience: "15+ Years",
          specialization: "Petroleum Refining and Petrochemical Engineering",
        },
        {
          name: "Dr. S. Venkatesh Babu",
          designation: "Professor",
          qualification: "M.E./M.Tech, Ph.D",
          experience: "12+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mr. Janardhanan K",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "7+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mr. Purushothaman V",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "6+ Years",
          specialization: "Petroleum Refining and Petrochemical Engineering",
        },
        {
          name: "Mr. M. Praveen",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "5+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Mr. Samraj S",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "5+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Ms. Divya Rajeev",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "4+ Years",
          specialization: "Chemical Engineering",
        },
        {
          name: "Ms. Pavithra S",
          designation: "Assistant Professor",
          qualification: "M.E./M.Tech",
          experience: "4+ Years",
          specialization: "Chemical Engineering",
        },
      ],

      labs: [
        {
          name: "Fluid and Solid Operations Laboratory",
          description:
            "Equipped with instruments to study fluid flow behavior, solid handling, and unit operations. Area: 166.14 sq.m.",
          equipment: [
            "Venturi Meter",
            "Orifice Meter",
            "Rotameter",
            "Centrifugal Pump Test Rig",
            "Hydraulic Bench",
          ],
        },
        {
          name: "Heat Transfer Laboratory",
          description:
            "Facilities for studying modes of heat transfer and their applications in petroleum processing.",
          equipment: [
            "Heat Exchanger Test Rigs",
            "Fin Heat Transfer Apparatus",
            "Natural Convection Setup",
            "Forced Convection Setup",
            "Radiation Setup",
          ],
        },
        {
          name: "Petroleum Testing Laboratory",
          description:
            "Equipped to test and characterize petroleum products as per API and ASTM standards.",
          equipment: [
            "Flash and Fire Point Apparatus",
            "Kinematic Viscometer",
            "Carbon Residue Apparatus",
            "Distillation Unit",
            "Pour Point Tester",
          ],
        },
        {
          name: "Mass Transfer Laboratory",
          description:
            "Facilities to study mass transfer operations fundamental to petroleum refining.",
          equipment: [
            "Distillation Column",
            "Liquid-Liquid Extraction Setup",
            "Gas Absorption Column",
            "Crystallization Setup",
          ],
        },
        {
          name: "Geology Laboratory",
          description:
            "Equipped with geological specimens and instruments for studying subsurface formations related to petroleum exploration.",
          equipment: [
            "Rock and Mineral Specimens",
            "Geological Maps",
            "Core Sample Analysis Tools",
            "Microscopes for Petrographic Analysis",
          ],
        },
        {
          name: "Drilling Fluids and Cementing Techniques Laboratory",
          description:
            "Specialized lab for studying drilling fluid properties and well cementing operations.",
          equipment: [
            "Mud Balance",
            "Marsh Funnel Viscometer",
            "API Filter Press",
            "High Pressure Filter Press",
            "Cement Consistometer",
          ],
        },
        {
          name: "Process Control and Instrumentation Laboratory",
          description:
            "Equipped with modern instrumentation and control systems for process automation.",
          equipment: [
            "PLC Control Systems",
            "Temperature Control Unit",
            "Level Control Unit",
            "Pressure Control Unit",
            "Flow Control Unit",
          ],
        },
      ],

      teachingLearning: {
        overview:
          "The department employs innovative teaching-learning methodologies to enhance student understanding of petroleum engineering concepts.",
        methods: [
          "Project-Based Learning",
          "Peer Group Learning",
          "Google Classroom & Blended Learning",
          "Expert Talks and Guest Lectures",
          "Industrial Visits to Oil Fields and Refineries",
        ],
        tools: [
          "ERP Software",
          "Google Classroom",
          "NPTEL Online Courses",
          "Petroleum Simulation Software",
        ],
        practices: [
          "Bridge Courses for first-year students",
          "Value-Added Courses on industry software",
          "MoU with industries for hands-on training",
          "Alumni Talks series",
        ],
      },

      valueAddedCourses: [],
      events: [],
      studentAchievements: [],
      facultyAchievements: [],

      studentParticipation: {
        clubs: [
          "Petroleum Engineering Association",
          "Energy and Environment Club",
          "Fine Arts Club",
          "National Service Scheme (NSS)",
        ],
        highlights: [],
      },

      facultyParticipation: {
        conferences: [],
        workshops: [
          "Faculty Induction Program (2024)",
          "Workshop on Innovative Curriculum Design And Implementation (2024)",
        ],
      },

      careerProgression: {
        topRecruiters: [
          "Indian Oil Corporation (IOCL)",
          "ONGC",
          "Bharat Petroleum",
          "Shell",
          "Schlumberger",
          "Halliburton",
          "Baker Hughes",
          "Cairn Energy",
          "GSPC",
          "Reliance Industries",
          "Essar Oil",
        ],
        higherStudies: [
          "M.E. / M.Tech in Petroleum/Chemical Engineering",
          "MBA (Management Programs)",
          "GATE Qualified – IITs and NITs",
          "Ph.D Research Programs",
          "MS Abroad (USA, UK)",
        ],
        averagePackage: "4 LPA",
        placementRate: "85%",
      },

      feedback: {
        curriculumProcess: [
          "Regular curriculum revision based on industry feedback",
          "Alumni feedback incorporated every academic year",
          "Industry experts on Board of Studies for curriculum updates",
        ],
        facilityProcess: [
          "Annual lab upgradation based on student and faculty feedback",
          "New instruments added based on industry demand",
        ],
        recentImprovements: [
          "Strengthened industry-institute interface with oil companies",
          "Introduced project-based learning methodology",
          "Organized alumni talk series on Project Commissioning",
        ],
      },

      heroMeta: [
        { icon: "Calendar", label: "Established", value: "2013" },
        { icon: "Users", label: "Intake", value: "60 Students" },
        { icon: "GraduationCap", label: "Affiliation", value: "Anna University" },
        { icon: "Clock", label: "Duration", value: "4 Years" },
        { icon: "Award", label: "Accreditation", value: "AICTE" },
        { icon: "Briefcase", label: "Placement Rate", value: "85%" },
      ],
    },
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  try {
    await mongoose.connect(uri, { dbName: undefined });
    const programs = mongoose.connection.db.collection("programs");
    const now = new Date();

    let updated = 0;
    let skipped = 0;

    for (const p of PROGRAMS) {
      const { slug, content, image: _image, ...cardFields } = p;

      const result = await programs.updateOne(
        { slug },
        {
          $set: {
            ...cardFields,
            content,
            published_content: content,
            status: "published",
            published_at: now,
            updated_at: now,
          },
          $inc: { version: 1 },
        },
        // no upsert — never create new documents
      );

      if (result.matchedCount > 0) {
        console.log(`✓ Updated: ${p.name} (slug: ${slug})`);
        updated++;
      } else {
        console.log(`⚠ Not found in DB: ${p.name} (slug: ${slug}) — skipped`);
        skipped++;
      }
    }

    console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
