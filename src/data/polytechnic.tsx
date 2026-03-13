import { Cpu, Cog, Zap, HardHat, FlaskConical, Leaf } from "lucide-react";

export const heroStats = [
  { value: "1,200+", label: "Students", accent: true },
  { value: "6", label: "Programs", accent: false },
  { value: "85%", label: "Placement Rate", accent: false },
  { value: "3 Yrs", label: "Duration", accent: true },
];

export const connectStats = [
  { value: "6", label: "Departments" },
  { value: "25:1", label: "Student–Faculty Ratio" },
  { value: "AICTE", label: "Approved" },
];

export const diplomaPrograms = [
  {
    name: "Diploma in Computer Technology",
    slug: "computer-technology",
    duration: "3 Years",
    icon: Cpu,
    desc: "Build a strong foundation in computer systems, software development, and networking — preparing graduates for immediate deployment in IT support and software testing roles.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    longDesc: [
      "The Diploma in Computer Technology at JCT Polytechnic College is a three-year program that equips students with both the theoretical foundations and hands-on skills demanded by today's IT industry. From programming fundamentals to network administration, the curriculum is structured to produce work-ready graduates from day one.",
      "Students work in fully networked computer labs running the latest development environments. Coursework covers operating systems, database management, web technologies, and computer hardware — supported by real-world project work in each semester.",
      "The program provides a direct entry route into IT support, software testing, web design, and systems administration roles. Graduates also qualify for lateral entry into the second year of B.C.A. or B.Sc. Computer Science programs at affiliated universities.",
    ],
    outcomes: [
      "Develop and maintain web and desktop applications using industry-standard programming languages.",
      "Install, configure, and troubleshoot operating systems, networks, and hardware components.",
      "Design and query relational databases using SQL and common DBMS tools.",
      "Apply software testing methodologies to identify and resolve bugs in application code.",
      "Demonstrate professional competencies in documentation, version control, and team collaboration.",
    ],
  },
  {
    name: "Diploma in Agricultural Engineering",
    slug: "agricultural-engineering",
    duration: "3 Years",
    icon: Leaf,
    desc: "Focused on agro-industries and rural technology transfer, preparing students for careers in modern farm mechanisation and agro-processing.",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop",
    longDesc: [
      "The Diploma in Agricultural Engineering prepares students to bridge the gap between traditional farming practices and modern engineering solutions. The curriculum covers farm machinery, irrigation systems, soil mechanics, and post-harvest processing — with a strong emphasis on field visits and hands-on equipment training.",
      "Students learn to operate, maintain, and repair agricultural machinery including tractors, threshers, and irrigation pumps. The program also addresses the growing importance of precision agriculture, introducing students to sensors, water management systems, and renewable energy applications in farming.",
      "Graduates serve a vital role in India's agricultural economy — joining agro-based industries, rural development agencies, and equipment service centres. The program also supports entrepreneurs who wish to establish agri-service businesses in rural areas.",
    ],
    outcomes: [
      "Operate and maintain agricultural equipment including tractors, tillers, and harvesting machinery.",
      "Design and implement basic irrigation and water conservation systems for farmland.",
      "Apply soil science principles to advise on land preparation and crop mechanisation.",
      "Understand post-harvest technology including storage, grading, and processing of agricultural produce.",
      "Contribute to rural technology transfer initiatives and agro-based enterprise development.",
    ],
  },
  {
    name: "Diploma in Petrochemical Engineering",
    slug: "petrochemical-engineering",
    duration: "3 Years",
    icon: FlaskConical,
    desc: "Develops technical knowledge in the petrochemical sector, covering refinery processes, chemical safety, and plant operations.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    longDesc: [
      "The Diploma in Petrochemical Engineering provides a solid technical foundation in the processing of petroleum and natural gas into useful products. Students study chemical process principles, thermodynamics, plant instrumentation, and HSE protocols specific to the petrochemical industry.",
      "Lab sessions cover chemical reaction engineering, distillation, heat exchangers, and process control systems. Industrial visits to refineries and petrochemical plants are integrated into the curriculum, giving students firsthand exposure to large-scale industrial operations.",
      "Graduates are equipped to work as plant technicians, process operators, and safety officers in refineries, polymer manufacturing plants, and chemical processing units. The program also provides pathways to B.E. Chemical or Petroleum Engineering through lateral entry.",
    ],
    outcomes: [
      "Understand the principles of petroleum refining and petrochemical process flows.",
      "Operate and monitor instrumented process control systems in a plant environment.",
      "Apply HSE protocols and safety regulations governing petrochemical operations.",
      "Perform quality checks, sampling, and lab analyses for chemical products.",
      "Read and interpret process flow diagrams, P&IDs, and engineering drawings.",
    ],
  },
  {
    name: "Diploma in Mechanical Engineering",
    slug: "mechanical-engineering",
    duration: "3 Years",
    icon: Cog,
    desc: "Training for mechanical engineering fundamentals and practical industry skills — from CNC machining to AutoCAD design.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
    longDesc: [
      "The Diploma in Mechanical Engineering at JCT is one of the most hands-on diploma programs available, with workshop training beginning in the very first semester. Students progress from basic fitting and welding to CNC machine operation, product design using CAD, and quality control.",
      "The program covers engineering drawing, machine design, fluid mechanics, manufacturing processes, and thermal engineering — backed by dedicated labs including a fully equipped machine shop. Regular industrial visits and a structured internship complement classroom learning.",
      "Mechanical engineering graduates enjoy strong placement prospects across manufacturing, maintenance, automotive, and defence sectors. The program qualifies graduates for lateral entry into B.E. Mechanical Engineering.",
    ],
    outcomes: [
      "Operate conventional and CNC machines including lathe, milling, and drilling equipment.",
      "Produce technical drawings and 3D models using AutoCAD and SolidWorks.",
      "Apply principles of strength of materials and thermodynamics to engineering problems.",
      "Perform quality inspection using precision measuring instruments and tolerance analysis.",
      "Plan, supervise, and document manufacturing and maintenance activities in industrial settings.",
    ],
  },
  {
    name: "Diploma in Electrical & Electronics Engineering",
    slug: "electrical-electronics",
    duration: "3 Years",
    icon: Zap,
    desc: "Focus on power systems, PLC programming, and industrial wiring — producing technicians ready for power plants, TNEB, and electrical contracting.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    longDesc: [
      "The Diploma in Electrical & Electronics Engineering trains students in both power systems and electronics, giving them the dual competency demanded by modern industrial employers. The curriculum spans electrical machines, switchgear, power electronics, PLC programming, and embedded systems.",
      "Students receive hands-on training in the electrical lab with transformer test benches, motor driver circuits, PLC trainers, and industrial wiring panels. The program emphasises safe working practices and is aligned with the skills standards recognised by TNEB and electrical contractor boards.",
      "Graduates work as electrical technicians, maintenance engineers, and PLC programmers across power generation, process industries, and building services.",
    ],
    outcomes: [
      "Wire, test, and maintain electrical machines including induction motors and transformers.",
      "Programme and commission PLCs for automated industrial control systems.",
      "Understand and work safely within HV/LV distribution networks and switchgear panels.",
      "Design basic electronic circuits for power conversion and signal processing.",
      "Apply regulations and safety standards governing electrical installations and maintenance.",
    ],
  },
  {
    name: "Diploma in Civil Engineering",
    slug: "civil-engineering",
    duration: "3 Years",
    icon: HardHat,
    desc: "Create outstanding diploma engineers using advanced teaching tools — covering site management, structural design, and AutoCAD drafting.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    longDesc: [
      "The Diploma in Civil Engineering prepares students for careers in the construction industry with a comprehensive curriculum covering surveying, structural engineering, estimation, and project management. Field training sessions at active construction sites supplement classroom instruction throughout the program.",
      "Students develop proficiency in AutoCAD for 2D drafting and structural detailing, alongside practical skills in soil testing, concrete technology, and environmental engineering. The program partners with local construction firms for supervised site visits and final-year project placements.",
      "Civil engineering diploma holders are consistently in demand with construction companies, PWD contractors, and real estate developers. The qualification also enables lateral entry to B.E. Civil Engineering.",
    ],
    outcomes: [
      "Conduct topographic surveys and set out construction sites using levelling and total station instruments.",
      "Prepare and read detailed engineering drawings using AutoCAD and manual drafting.",
      "Estimate quantities and cost for civil construction projects from drawing to bill of quantities.",
      "Test construction materials including soil, concrete, and steel to verify IS standard compliance.",
      "Supervise site operations and coordinate workforce and material resources effectively.",
    ],
  },
];

export const newsUpdates = [
  {
    date: "Tue 15 Aug 2023",
    title:
      "Independence Day Celebrations mark the 76th anniversary with cultural performances and flag hoisting across campus.",
    image:
      "https://images.unsplash.com/photo-1567187183169-90f02d27ede5?q=80&w=600&auto=format&fit=crop",
  },
  {
    date: "Wed 18 Oct 2022",
    title:
      "Entrepreneur Talk organised by the Entrepreneurship Development Cell draws students and industry mentors.",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop",
  },
  {
    date: "Mon 10 Oct 2022",
    title:
      "EEE Department signs landmark MOU with Shree Technology to provide industry training and live projects.",
    image:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=600&auto=format&fit=crop",
  },
  {
    date: "Sat 08 Oct 2022",
    title:
      "Mechanical students gain real-world exposure during Industrial Visit to Veerakumar Industries.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
  },
  {
    date: "Thu 15 Sep 2022",
    title:
      "Engineer's Day celebrated with technical quiz, paper presentations, and felicitation of top students.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
  },
  {
    date: "Mon 05 Sep 2022",
    title:
      "Onam celebrations bring together students and faculty in a showcase of cultural unity and tradition.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop",
  },
];

export const campusEvents = [
  {
    title: "Entrepreneur Talk by EDC",
    category: "Development",
    location: "Seminar Hall",
    time: "10:00 AM",
  },
  {
    title: "Campus Recruitment Drive",
    category: "Placement",
    location: "Placement Office",
    time: "09:00 AM",
  },
  {
    title: "Technical Workshop on PLC Programming",
    category: "Workshop",
    location: "EEE Lab",
    time: "02:00 PM",
  },
];

export const recruiters = [
  { name: "TCS", logo: "/company_logo/TCS.NS_BIG.svg" },
  { name: "Caterpillar", logo: "/company_logo/CAT_BIG.svg" },
  { name: "Volvo", logo: "/company_logo/VOLV-A.ST.svg" },
  { name: "Ford", logo: "/company_logo/F_BIG.svg" },
  { name: "JSW Steel", logo: "/company_logo/JSWSTEEL.NS.svg" },
  { name: "IBM", logo: "/company_logo/IBM.svg" },
  { name: "Rolls-Royce", logo: "/company_logo/RR.L_BIG.svg" },
  { name: "Dell", logo: "/company_logo/DELL_BIG.svg" },
  { name: "Intel", logo: "/company_logo/INTC.svg" },
  { name: "Nvidia", logo: "/company_logo/NVDA_BIG.svg" },
  { name: "Sony", logo: "/company_logo/SONY_BIG.svg" },
  { name: "AMD", logo: "/company_logo/AMD_BIG.svg" },
];

export const testimonials = [
  {
    quote:
      "The practical workshop training at JCT Polytechnic gave me skills that my peers from other colleges simply didn't have. I landed my first job within two months of graduating.",
    name: "Murugan S.",
    role: "Maintenance Technician at L&T",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "The faculty here cared about more than just classroom theory. By the time I finished my diploma, I had already completed a live project with a local electrical contractor.",
    name: "Kavitha R.",
    role: "Junior Engineer at TNEB",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "I used my diploma as a stepping stone — I'm now in the final year of B.E. through lateral entry. JCT Polytechnic gave me the foundation I needed to compete with degree students.",
    name: "Aravind P.",
    role: "B.E. Mechanical (Lateral Entry)",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

export const admissionsCriteria = [
  {
    title: "Eligibility",
    items: [
      "Passed 10th (SSLC) from a recognised board",
      "Minimum combined score as per DOTE norms",
      "Relevant subject background preferred for certain streams",
    ],
  },
  {
    title: "Lateral Entry",
    items: [
      "ITI pass with relevant trade for second-year lateral entry",
      "Must hold a certificate from a DOTE-recognised institution",
      "Subject to seat availability in the applied stream",
    ],
  },
  {
    title: "How to Apply",
    items: [
      "Register on the TNEA Polytechnic portal or apply directly",
      "Attend counselling with original mark sheets and certificates",
      "Complete fee payment to confirm your enrolment",
    ],
  },
];
