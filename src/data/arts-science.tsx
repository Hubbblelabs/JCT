import {
  Calculator,
  Atom,
  BarChart3,
  Briefcase,
  BookOpen,
  Feather,
  Lightbulb,
  MessageSquare,
  Palette,
  Users,
} from "lucide-react";

export const heroStats = [
  { value: "2,500+", label: "Students", accent: true },
  { value: "5", label: "Programs", accent: false },
  { value: "60+", label: "Faculty Members", accent: false },
  { value: "15+", label: "Years of Excellence", accent: true },
];

export const philosophyStats = [
  { value: "6", label: "Departments" },
  { value: "30:1", label: "Student-Faculty Ratio" },
  { value: "UGC", label: "Recognized" },
];

export const ugPrograms = [
  {
    name: "B.Sc Computer Science",
    slug: "bsc-computer-science",
    duration: "3 Years",
    icon: Atom,
    desc: "Bachelor of Computer Science (B.Sc. CS) is the foundational technology for building a rich and fulfilling information society.",
    longDesc: [
      "The B.Sc. Computer Science program at JCT College of Arts & Science provides a rigorous grounding in computational theory, software development, and data structures. Students master programming languages, algorithms, and system design principles that form the backbone of the modern software industry.",
      "The curriculum is regularly refreshed in consultation with industry partners to reflect current trends — including cloud computing, cybersecurity, and full-stack development. Hands-on labs, mini-projects, and a structured internship program ensure graduates are job-ready from day one.",
      "Our graduates have secured placements with leading technology companies and have gone on to pursue M.Sc., MCA, and MBA programs at premier institutions. The department maintains strong ties with the IT industry through its active alumni network and placement cell.",
    ],
    outcomes: [
      "Design, implement, and debug software applications using modern programming languages and frameworks.",
      "Analyse computational problems and apply appropriate data structures and algorithms for optimised solutions.",
      "Understand operating systems, computer networks, and database management systems at an architectural level.",
      "Build collaborative, version-controlled projects that simulate real-world software engineering workflows.",
      "Demonstrate readiness for industry roles or higher studies through capstone projects and technical assessments.",
    ],
  },
  {
    name: "B.Sc Artificial Intelligence and Machine Learning",
    slug: "bsc-ai-ml",
    duration: "3 Years",
    icon: Lightbulb,
    desc: "Programme prepares students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications.",
    longDesc: [
      "The B.Sc. Artificial Intelligence and Machine Learning program equips students with the mathematical foundations and practical tools required to build intelligent systems. Coursework spans linear algebra, probability, Python programming, deep learning, and natural language processing.",
      "Through a project-centric curriculum, students apply machine learning frameworks such as TensorFlow and scikit-learn to solve real-world problems in healthcare, finance, and logistics. The program emphasises reproducible experimentation and responsible AI development.",
      "Graduates are well-positioned for roles in data science, AI engineering, and research. Many students go on to pursue postgraduate studies in machine learning at national and international institutions.",
    ],
    outcomes: [
      "Implement supervised, unsupervised, and reinforcement learning algorithms from first principles.",
      "Build, train, and evaluate deep neural networks using industry-standard frameworks such as TensorFlow and PyTorch.",
      "Apply statistical analysis and data visualisation techniques to communicate insights effectively.",
      "Understand the ethical implications of AI systems and design models with fairness and transparency in mind.",
      "Deliver an end-to-end machine learning project — from data collection and preprocessing to model deployment.",
    ],
  },
  {
    name: "BCA (Bachelor of Computer Applications)",
    slug: "bca",
    duration: "3 Years",
    icon: Calculator,
    desc: "A three-year undergraduate degree program for candidates wishing to start a career in computers and its applications.",
    longDesc: [
      "The Bachelor of Computer Applications (BCA) program is a three-year undergraduate degree designed for students who aspire to careers in software development, IT support, and systems administration. The curriculum blends computer science fundamentals with a strong practical orientation.",
      "Students learn programming, web development, database design, and networking in a hands-on environment supported by well-equipped labs. Regular industry interactions, live projects, and a final-year dissertation develop both technical and professional competencies.",
      "BCA graduates are highly sought after by IT companies and startups alike. The program also serves as a strong foundation for those wishing to pursue MCA or MBA (IT) studies at top institutions.",
    ],
    outcomes: [
      "Develop web and desktop applications using languages including C, Java, Python, and JavaScript.",
      "Design and manage relational databases using SQL and popular database management systems.",
      "Understand networking concepts, client–server architecture, and basic cybersecurity principles.",
      "Collaborate on team-based software projects using version control and agile methodologies.",
      "Communicate technical ideas clearly through documentation, presentations, and project reports.",
    ],
  },
  {
    name: "B.Com Logistics and Supply Chain Management",
    slug: "bcom-logistics-supply-chain",
    duration: "3 Years",
    icon: BarChart3,
    desc: "Undergraduate programme focusing on quality education in commerce with conceptual and practical knowledge.",
    longDesc: [
      "The B.Com Logistics and Supply Chain Management program provides a comprehensive education in commerce combined with specialised knowledge of global supply chains. Students study accounting, business law, economics, and the operational mechanics of logistics networks.",
      "The course prepares graduates for the rapidly expanding logistics sector, covering topics such as inventory management, port operations, freight forwarding, and export–import documentation. Industry visits and guest lectures from logistics professionals enrich the learning experience.",
      "With India's logistics industry growing at over 10% annually, demand for trained professionals is high. Graduates are equipped for roles in shipping companies, freight forwarders, customs brokers, and e-commerce fulfillment centres.",
    ],
    outcomes: [
      "Apply core accounting and commerce principles to business scenarios in the logistics sector.",
      "Understand the end-to-end supply chain — from procurement and warehousing to last-mile delivery.",
      "Handle documentation for import–export operations, customs clearance, and freight management.",
      "Analyse supply chain data to identify inefficiencies and propose evidence-based improvements.",
      "Communicate professionally in business contexts and prepare for industry certifications in logistics.",
    ],
  },
  {
    name: "BBA Logistics",
    slug: "bba-logistics",
    duration: "3 Years",
    icon: Briefcase,
    desc: "Three-year full-time degree program covering concepts and processes involved in logistics and shipping.",
    longDesc: [
      "The BBA Logistics program is a three-year management degree that combines foundational business education with deep expertise in logistics and supply chain operations. Students develop managerial acumen alongside domain knowledge in transportation, warehousing, and trade facilitation.",
      "The program emphasises decision-making, leadership, and strategic thinking through case studies, simulations, and internships with logistics firms. Students also study entrepreneurship, equipping those who wish to start ventures in freight, courier, or supply chain consulting.",
      "Graduates command strong placement opportunities with shipping lines, third-party logistics providers, e-commerce companies, and government port authorities. The program's industry alignment ensures that graduates can contribute from day one.",
    ],
    outcomes: [
      "Lead and manage logistics operations including transportation, warehousing, and distribution networks.",
      "Apply business management principles — marketing, finance, and HR — within a logistics context.",
      "Evaluate and optimise supply chain processes using quantitative and qualitative management tools.",
      "Develop and pitch entrepreneurial ventures in the logistics and supply chain space.",
      "Demonstrate professional competencies in communication, teamwork, and ethical decision-making.",
    ],
  },
];

export const academicLife = [
  {
    icon: BookOpen,
    title: "Departmental Seminars",
    desc: "Each department hosts monthly seminars where students present papers, discuss ideas, and engage with faculty-led research topics.",
  },
  {
    icon: Feather,
    title: "Literary & Debate Society",
    desc: "The college has an active literary club that organizes essay competitions, poetry readings, and inter-college debate tournaments.",
  },
  {
    icon: Lightbulb,
    title: "Undergraduate Research",
    desc: "Final-year students in science programs undertake guided research projects. Several have been presented at state-level conferences.",
  },
  {
    icon: MessageSquare,
    title: "Guest Lecture Series",
    desc: "Industry professionals, academics, and alumni visit regularly for talks that connect classroom theory to real-world practice.",
  },
  {
    icon: Palette,
    title: "Cultural Festivals",
    desc: "An annual arts festival brings together drama, music, dance, and visual arts — organized and run entirely by students.",
  },
  {
    icon: Users,
    title: "Community Outreach",
    desc: "NSS and extension activities connect students with local communities — from literacy drives to environmental cleanup campaigns.",
  },
];

export const admissionsCriteria = [
  {
    title: "UG Eligibility",
    items: [
      "Passed 12th (HSC) from a recognized board",
      "Relevant subject combination",
      "Minimum aggregate per university norms",
    ],
  },
  {
    title: "PG Eligibility",
    items: [
      "Relevant bachelor's degree",
      "Minimum percentage as prescribed",
      "Interview for select programs",
    ],
  },
  {
    title: "How to Apply",
    items: [
      "Fill out the online application",
      "Attend counseling with original documents",
      "Confirm enrollment with fee payment",
    ],
  },
];

export const testimonials = [
  {
    quote:
      "The education here prepared me for real challenges. I walked into my first job feeling confident and capable, all thanks to the rigorous curriculum and supportive faculty.",
    name: "Rajesh Kumar",
    role: "Engineering at TCS",
      image:
        "/site_assests/2.jpeg",
  },
  {
    quote:
      "I came here uncertain about my direction. The diverse environment and the mentorship I received helped me discover my true passion and shape my career path.",
    name: "Priya Sharma",
    role: "Management at Accenture",
      image:
        "/site_assests/3.jpeg",
  },
  {
    quote:
      "The faculty understood that we needed more than theory. The hands-on projects and industry connections gave me the exact experience I needed to stand out.",
    name: "Arjun Patel",
    role: "Computer Science at Google",
      image:
        "/site_assests/8.jpg.jpeg",
  },
  {
    quote:
      "The placement cell gave us structured preparation from the second year itself. That consistency helped me clear rounds at a product company.",
    name: "Kirthika M.",
    role: "Associate Analyst at Zoho",
      image:
        "/site_assests/19.jpeg",
  },
  {
    quote:
      "I joined with stage fear and left with confidence. Presentations, seminars, and project reviews made communication one of my strengths.",
    name: "Vignesh R.",
    role: "Business Operations at Accenture",
      image:
        "/site_assests/4564cb56ad6a43f1af8faa4f29ad9e51.jpg.jpeg",
  },
  {
    quote:
      "The faculty mentorship and practical assignments made a real difference. I could connect theory to real business and technology use-cases quickly.",
    name: "Revathi S.",
    role: "Data Associate at TCS",
      image:
        "/site_assests/WhatsApp-Image-2024-11-29-at-2.36.24-PM.jpeg",
  },
];

export const newsUpdates = [
  {
    date: "Thu 15 Feb 2024",
    title:
      "Annual Science Exhibition showcases student innovations capable of global impact.",
    image: "/site_assests/banner6.jpeg",
  },
  {
    date: "Mon 20 Mar 2024",
    title:
      "National Commerce Conference hosted on campus, drawing industry leaders.",
    image: "/site_assests/banner3.jpg.jpeg",
  },
  {
    date: "Wed 05 Apr 2024",
    title:
      "New AI and Machine Learning lab inaugurated to boost advanced research capabilities.",
    image: "/site_assests/banner.jpg.jpeg",
  },
];

export const campusEvents = [
  {
    title: "Industry leaders speak",
    category: "Seminar",
    location: "Main auditorium",
    time: "10:00 AM",
  },
  {
    title: "Coding bootcamp begins",
    category: "Workshop",
    location: "Tech lab",
    time: "02:00 PM",
  },
  {
    title: "Campus recruitment drive",
    category: "Placement",
    location: "Placement office",
    time: "09:00 AM",
  },
];
