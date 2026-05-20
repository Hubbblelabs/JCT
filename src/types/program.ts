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

export type HeroMetaItem = {
  icon?: string;
  label: string;
  value: string;
};

export type TabConfigItem = {
  id: string;
  label: string;
  icon?: string;
  visible?: boolean;
};

export type OverviewLabels = {
  stats?: {
    visible?: boolean;
    established?: string;
    intake?: string;
    accreditation?: string;
    affiliation?: string;
  };
  about?: { visible?: boolean; title?: string };
  hod?: { visible?: boolean; title?: string };
  visionMission?: {
    visible?: boolean;
    title?: string;
    visionLabel?: string;
    missionLabel?: string;
  };
  programOutcomes?: { visible?: boolean; title?: string };
};

export type AcademicsLabels = {
  curriculum?: {
    visible?: boolean;
    title?: string;
    colCode?: string;
    colName?: string;
    colCredits?: string;
    colType?: string;
  };
  teachingLearning?: {
    visible?: boolean;
    title?: string;
    methodsLabel?: string;
    toolsLabel?: string;
    practicesLabel?: string;
  };
  valueAddedCourses?: { visible?: boolean; title?: string };
};

export type FacultyLabels = {
  coreFaculty?: {
    visible?: boolean;
    title?: string;
    colName?: string;
    colDesignation?: string;
    colQualification?: string;
    colExperience?: string;
    colSpecialization?: string;
  };
  advisoryBoard?: { visible?: boolean; title?: string };
  pac?: { visible?: boolean; title?: string };
  bos?: { visible?: boolean; title?: string };
  boardCols?: {
    colName?: string;
    colDesignation?: string;
    colOrganization?: string;
    colRole?: string;
  };
};

export type FacilitiesLabels = {
  labs?: { visible?: boolean; title?: string };
  library?: {
    visible?: boolean;
    title?: string;
    digitalAccessLabel?: string;
    booksLabel?: string;
    journalsLabel?: string;
    magazinesLabel?: string;
  };
};

export type LifeLabels = {
  events?: { visible?: boolean; title?: string };
  studentAchievements?: { visible?: boolean; title?: string };
  facultyAchievements?: { visible?: boolean; title?: string };
  magazine?: { visible?: boolean; title?: string };
  participation?: {
    visible?: boolean;
    title?: string;
    clubsLabel?: string;
    workshopsLabel?: string;
  };
};

export type CareerLabels = {
  careerProgression?: {
    visible?: boolean;
    title?: string;
    placementRateLabel?: string;
    avgPackageLabel?: string;
    topRecruitersLabel?: string;
    higherStudiesLabel?: string;
  };
  feedback?: {
    visible?: boolean;
    title?: string;
    curriculumColTitle?: string;
    facilityColTitle?: string;
    improvementsColTitle?: string;
  };
};

export type LabelsTree = {
  overview?: OverviewLabels;
  academics?: AcademicsLabels;
  faculty?: FacultyLabels;
  facilities?: FacilitiesLabels;
  life?: LifeLabels;
  career?: CareerLabels;
};

export type ProgramData = {
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
    duration: string;
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
    regulationName: string;
    semesters: {
      semester: number;
      subjects: CurriculumSubject[];
    }[];
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

  magazine?: {
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

  degreePrefix?: string;
  heroMeta?: HeroMetaItem[];
  tabsConfig?: TabConfigItem[];
  labels?: LabelsTree;
};
