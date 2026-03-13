export type FacultyMember = {
  name: string;
  designation: string;
  qualification: string;
  experience: string;
  specialization: string;
  email?: string;
};

export type Lab = {
  name: string;
  description: string;
  equipment: string[];
};

export type BoardMember = {
  name: string;
  designation: string;
  organization: string;
  role?: string;
};

export type Achievement = {
  name: string;
  title: string;
  detail: string;
  year: string;
};

export type ValueAddedCourse = {
  name: string;
  hours: string;
  provider: string;
  description: string;
};

export type CurriculumSubject = {
  code: string;
  name: string;
  credits: number;
  type: "Theory" | "Lab" | "Core" | "Elective" | "Project";
};

export type DepartmentData = {
  slug: string;
  name: string;
  shortName: string;
  college: "engineering" | "arts-science" | "polytechnic";
  bgColor: string;
  accentColor: string;
  heroImage: string;

  about: {
    paragraphs: string[];
    established: string;
    accreditation: string;
    intake: number;
    affiliation: string;
  };

  hod: {
    name: string;
    designation: string;
    qualification: string;
    experience: string;
    message: string[];
  };

  visionMission: {
    vision: string;
    mission: string[];
  };

  programOutcomes: {
    code: string;
    title: string;
    description: string;
  }[];

  advisoryBoard: BoardMember[];
  pac: BoardMember[];
  bos: BoardMember[];

  curriculum: {
    semester: number;
    subjects: CurriculumSubject[];
  }[];

  teachingLearning: {
    overview: string;
    methods: string[];
    tools: string[];
    practices: string[];
  };

  valueAddedCourses: ValueAddedCourse[];
  faculty: FacultyMember[];
  labs: Lab[];

  library: {
    books: number;
    journals: number;
    magazines: number;
    digitalAccess: string[];
    description: string;
  };

  events: {
    title: string;
    date: string;
    type: string;
    description: string;
    resourcePerson?: string;
  }[];

  studentParticipation: {
    clubs: string[];
    highlights: {
      title: string;
      year: string;
      description: string;
    }[];
  };

  facultyParticipation: {
    conferences: {
      title: string;
      faculty: string;
      venue: string;
      year: string;
    }[];
    workshops: string[];
  };

  studentAchievements: Achievement[];
  facultyAchievements: Achievement[];

  magazine: {
    name: string;
    description: string;
    frequency: string;
    latestIssue: string;
    highlights: string[];
  };

  careerProgression: {
    topRecruiters: string[];
    higherStudies: string[];
    averagePackage: string;
    placementRate: string;
  };

  feedback: {
    curriculumProcess: string[];
    facilityProcess: string[];
    recentImprovements: string[];
  };
};
