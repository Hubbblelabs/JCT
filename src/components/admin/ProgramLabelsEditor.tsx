"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { LabelsTree } from "@/types/program";

type LabelGroup = {
  key: keyof LabelsTree;
  label: string;
  sections: SectionGroup[];
};

type SectionGroup = {
  key: string;
  label: string;
  fields: SectionField[];
};

type SectionField = {
  key: string;
  label: string;
  placeholder: string;
};

const TITLE = (placeholder: string): SectionField => ({
  key: "title",
  label: "Title",
  placeholder,
});

const GROUPS: LabelGroup[] = [
  {
    key: "overview",
    label: "Overview tab",
    sections: [
      {
        key: "stats",
        label: "Quick stats",
        fields: [
          {
            key: "established",
            label: "Established label",
            placeholder: "Established",
          },
          {
            key: "intake",
            label: "Intake label",
            placeholder: "Annual Intake",
          },
          {
            key: "accreditation",
            label: "Accreditation label",
            placeholder: "Accreditation",
          },
          {
            key: "affiliation",
            label: "Affiliation label",
            placeholder: "Affiliation",
          },
        ],
      },
      {
        key: "about",
        label: "About the Department",
        fields: [TITLE("About the Department")],
      },
      {
        key: "hod",
        label: "HoD's Desk",
        fields: [TITLE("HoD's Desk")],
      },
      {
        key: "visionMission",
        label: "Vision & Mission",
        fields: [
          TITLE("Vision & Mission"),
          { key: "visionLabel", label: "Vision badge", placeholder: "Vision" },
          {
            key: "missionLabel",
            label: "Mission badge",
            placeholder: "Mission",
          },
        ],
      },
      {
        key: "programOutcomes",
        label: "Program Outcomes",
        fields: [TITLE("Program Outcomes (POs)")],
      },
    ],
  },
  {
    key: "academics",
    label: "Academics tab",
    sections: [
      {
        key: "curriculum",
        label: "Curriculum & Syllabus",
        fields: [
          TITLE("Curriculum & Syllabus"),
          { key: "colCode", label: "Column: Code", placeholder: "Code" },
          {
            key: "colName",
            label: "Column: Course Name",
            placeholder: "Course Name",
          },
          {
            key: "colCredits",
            label: "Column: Credits",
            placeholder: "Credits",
          },
          { key: "colType", label: "Column: Type", placeholder: "Type" },
        ],
      },
      {
        key: "teachingLearning",
        label: "Teaching & Learning",
        fields: [
          TITLE("Teaching Learning Process"),
          {
            key: "methodsLabel",
            label: "Methods column",
            placeholder: "Teaching Methods",
          },
          {
            key: "toolsLabel",
            label: "Tools column",
            placeholder: "Tools & Technologies",
          },
          {
            key: "practicesLabel",
            label: "Practices column",
            placeholder: "Best Practices",
          },
        ],
      },
      {
        key: "valueAddedCourses",
        label: "Value Added Courses",
        fields: [TITLE("Value Added Courses")],
      },
    ],
  },
  {
    key: "faculty",
    label: "Faculty & Council tab",
    sections: [
      {
        key: "coreFaculty",
        label: "Core Faculty",
        fields: [
          TITLE("Core Faculty"),
          {
            key: "colName",
            label: "Column: Faculty Member",
            placeholder: "Faculty Member",
          },
          {
            key: "colDesignation",
            label: "Column: Designation",
            placeholder: "Designation",
          },
          {
            key: "colQualification",
            label: "Column: Qualification",
            placeholder: "Qualification",
          },
          {
            key: "colExperience",
            label: "Column: Experience",
            placeholder: "Experience",
          },
          {
            key: "colSpecialization",
            label: "Column: Specialization",
            placeholder: "Specialization",
          },
        ],
      },
      {
        key: "advisoryBoard",
        label: "Department Advisory Board",
        fields: [TITLE("Department Advisory Board (DAB)")],
      },
      {
        key: "pac",
        label: "Program Assessment Committee",
        fields: [TITLE("Program Assessment Committee (PAC)")],
      },
      {
        key: "bos",
        label: "Board of Studies",
        fields: [TITLE("Board of Studies (BOS)")],
      },
      {
        key: "boardCols",
        label: "Board tables — column headers (DAB / PAC / BOS share)",
        fields: [
          { key: "colName", label: "Column: Name", placeholder: "Name" },
          {
            key: "colDesignation",
            label: "Column: Designation",
            placeholder: "Designation",
          },
          {
            key: "colOrganization",
            label: "Column: Organization",
            placeholder: "Organization",
          },
          { key: "colRole", label: "Column: Role", placeholder: "Role" },
        ],
      },
    ],
  },
  {
    key: "facilities",
    label: "Facilities tab",
    sections: [
      {
        key: "labs",
        label: "Laboratories",
        fields: [TITLE("Laboratories & Workspaces")],
      },
      {
        key: "library",
        label: "Library",
        fields: [
          TITLE("Department Library"),
          {
            key: "booksLabel",
            label: "Books stat label",
            placeholder: "Volumes & Books",
          },
          {
            key: "journalsLabel",
            label: "Journals stat label",
            placeholder: "Journals",
          },
          {
            key: "magazinesLabel",
            label: "Magazines stat label",
            placeholder: "Magazines",
          },
          {
            key: "digitalAccessLabel",
            label: "Digital access label",
            placeholder: "Digital Access & Online Resources",
          },
        ],
      },
    ],
  },
  {
    key: "life",
    label: "Life & Achievements tab",
    sections: [
      { key: "events", label: "Events", fields: [TITLE("Events Organized")] },
      {
        key: "studentAchievements",
        label: "Student Achievements",
        fields: [TITLE("Student Achievements")],
      },
      {
        key: "facultyAchievements",
        label: "Faculty Achievements",
        fields: [TITLE("Faculty Achievements")],
      },
      {
        key: "magazine",
        label: "Newsletter / Magazine",
        fields: [TITLE("Newsletter / Magazine")],
      },
      {
        key: "participation",
        label: "Participation & Clubs",
        fields: [
          TITLE("Participation & Clubs"),
          {
            key: "clubsLabel",
            label: "Clubs column",
            placeholder: "Student Clubs",
          },
          {
            key: "workshopsLabel",
            label: "Workshops column",
            placeholder: "Faculty Workshops",
          },
        ],
      },
    ],
  },
  {
    key: "career",
    label: "Career & Feedback tab",
    sections: [
      {
        key: "careerProgression",
        label: "Career Progression",
        fields: [
          TITLE("Career Progression"),
          {
            key: "placementRateLabel",
            label: "Placement rate label",
            placeholder: "Placement Rate",
          },
          {
            key: "avgPackageLabel",
            label: "Avg. package label",
            placeholder: "Avg. Package",
          },
          {
            key: "topRecruitersLabel",
            label: "Top recruiters heading",
            placeholder: "Top Recruiters",
          },
          {
            key: "higherStudiesLabel",
            label: "Higher studies heading",
            placeholder: "Higher Studies",
          },
        ],
      },
      {
        key: "feedback",
        label: "Feedback & Improvements",
        fields: [
          TITLE("Feedback & Improvements"),
          {
            key: "curriculumColTitle",
            label: "Curriculum column title",
            placeholder: "Curriculum Feedback",
          },
          {
            key: "facilityColTitle",
            label: "Facility column title",
            placeholder: "Facility Feedback",
          },
          {
            key: "improvementsColTitle",
            label: "Improvements column title",
            placeholder: "Recent Improvements",
          },
        ],
      },
    ],
  },
];

function Collapsible({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2 rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-gray-700"
      >
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="border-t border-gray-100 p-3">{children}</div>}
    </div>
  );
}

export function ProgramLabelsEditor({
  value,
  onChange,
}: {
  value: LabelsTree | undefined;
  onChange: (next: LabelsTree) => void;
}) {
  const labels = value ?? {};

  const setSection = (
    groupKey: keyof LabelsTree,
    sectionKey: string,
    next: Record<string, unknown>,
  ) => {
    const group = (labels[groupKey] as Record<string, unknown>) ?? {};
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === "") continue;
      cleaned[k] = v;
    }
    const nextGroup = { ...group };
    if (Object.keys(cleaned).length === 0) {
      delete nextGroup[sectionKey];
    } else {
      nextGroup[sectionKey] = cleaned;
    }
    const nextLabels: Record<string, unknown> = { ...labels };
    if (Object.keys(nextGroup).length === 0) {
      delete nextLabels[groupKey];
    } else {
      nextLabels[groupKey] = nextGroup;
    }
    onChange(nextLabels as LabelsTree);
  };

  const readSection = (
    groupKey: keyof LabelsTree,
    sectionKey: string,
  ): Record<string, unknown> => {
    const group = (labels[groupKey] as Record<string, unknown>) ?? {};
    return (group[sectionKey] as Record<string, unknown>) ?? {};
  };

  return (
    <div>
      <p className="mb-3 text-xs text-gray-500">
        Override the headings, column labels, and visibility of every section on
        the public department page. Leave a field blank to use the default.
      </p>
      {GROUPS.map((group) => (
        <Collapsible key={group.key} title={group.label}>
          {group.sections.map((section) => {
            const current = readSection(group.key, section.key);
            const hasVisible = "visible" in section.fields ? false : true; // always show toggle unless boardCols
            const supportsVisible = section.key !== "boardCols";
            const visibleValue =
              current.visible === undefined ? true : Boolean(current.visible);
            return (
              <Collapsible key={section.key} title={section.label}>
                {supportsVisible && hasVisible && (
                  <label className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={visibleValue}
                      onChange={(e) =>
                        setSection(group.key, section.key, {
                          ...current,
                          visible: e.target.checked ? undefined : false,
                        })
                      }
                    />
                    Show this section on the public page
                  </label>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {section.fields.map((f) => (
                    <div
                      key={f.key}
                      className={f.key === "title" ? "col-span-2" : ""}
                    >
                      <label className="admin-label">{f.label}</label>
                      <input
                        className="admin-input"
                        value={String(current[f.key] ?? "")}
                        placeholder={f.placeholder}
                        onChange={(e) =>
                          setSection(group.key, section.key, {
                            ...current,
                            [f.key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </Collapsible>
            );
          })}
        </Collapsible>
      ))}
    </div>
  );
}
