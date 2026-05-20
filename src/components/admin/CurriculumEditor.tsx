"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type CurriculumSubject = {
  code: string;
  name: string;
  credits: number;
  type: "Theory" | "Lab" | "Core" | "Elective" | "Project";
};

export type CurriculumSemester = {
  semester: number;
  subjects: CurriculumSubject[];
};

export type CurriculumRegulation = {
  regulationName: string;
  semesters: CurriculumSemester[];
};

const SUBJECT_TYPES = ["Theory", "Lab", "Core", "Elective", "Project"] as const;

const EMPTY_SUBJECT: CurriculumSubject = {
  code: "",
  name: "",
  credits: 3,
  type: "Theory",
};

export function CurriculumEditor({
  value,
  onChange,
}: {
  value: CurriculumRegulation[];
  onChange: (v: CurriculumRegulation[]) => void;
}) {
  const [activeReg, setActiveReg] = useState(0);

  // Backward-compat: flat CurriculumSemester[] without regulationName
  const normalised: CurriculumRegulation[] =
    value.length > 0 && !("regulationName" in value[0])
      ? [
          {
            regulationName: "Default",
            semesters: value as unknown as CurriculumSemester[],
          },
        ]
      : value;

  // Regulation helpers
  const updReg = (i: number, patch: Partial<CurriculumRegulation>) => {
    const next = normalised.map((r, idx) =>
      idx === i ? { ...r, ...patch } : r,
    );
    onChange(next);
  };
  const addReg = () => {
    const next = [
      ...normalised,
      { regulationName: `Regulation ${normalised.length + 1}`, semesters: [] },
    ];
    onChange(next);
    setActiveReg(next.length - 1);
  };
  const remReg = (i: number) => {
    const next = normalised.filter((_, idx) => idx !== i);
    onChange(next);
    setActiveReg(Math.max(0, Math.min(activeReg, next.length - 1)));
  };

  // Semester helpers
  const updSem = (
    rI: number,
    sI: number,
    patch: Partial<CurriculumSemester>,
  ) => {
    updReg(rI, {
      semesters: normalised[rI].semesters.map((s, idx) =>
        idx === sI ? { ...s, ...patch } : s,
      ),
    });
  };
  const addSem = (rI: number) => {
    const sems = normalised[rI].semesters;
    const nextNum =
      sems.length > 0 ? Math.max(...sems.map((s) => s.semester)) + 1 : 1;
    updReg(rI, { semesters: [...sems, { semester: nextNum, subjects: [] }] });
  };
  const remSem = (rI: number, sI: number) => {
    updReg(rI, {
      semesters: normalised[rI].semesters.filter((_, idx) => idx !== sI),
    });
  };

  // Subject helpers
  const updSubj = (
    rI: number,
    sI: number,
    jI: number,
    patch: Partial<CurriculumSubject>,
  ) => {
    const subs = normalised[rI].semesters[sI].subjects.map((s, idx) =>
      idx === jI ? { ...s, ...patch } : s,
    );
    updSem(rI, sI, { subjects: subs });
  };
  const addSubj = (rI: number, sI: number) => {
    const subs = [
      ...normalised[rI].semesters[sI].subjects,
      { ...EMPTY_SUBJECT },
    ];
    updSem(rI, sI, { subjects: subs });
  };
  const remSubj = (rI: number, sI: number, jI: number) => {
    const subs = normalised[rI].semesters[sI].subjects.filter(
      (_, idx) => idx !== jI,
    );
    updSem(rI, sI, { subjects: subs });
  };

  const reg = normalised[activeReg];

  return (
    <div className="space-y-4">
      {/* Regulation tab strip */}
      <div className="flex flex-wrap items-center gap-2">
        {normalised.map((r, i) => (
          <div
            key={i}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors ${
              i === activeReg
                ? "border-blue-300 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <input
              className="w-36 bg-transparent text-sm font-semibold text-gray-800 outline-none"
              value={r.regulationName}
              onChange={(e) => updReg(i, { regulationName: e.target.value })}
              onClick={() => setActiveReg(i)}
            />
            <button
              type="button"
              onClick={() => remReg(i)}
              className="ml-1 text-gray-400 hover:text-red-500"
              title="Remove regulation"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addReg}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={12} /> Add Regulation
        </button>
      </div>

      {/* Semesters for active regulation */}
      {!reg ? (
        <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
          No regulations yet. Click "Add Regulation" to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {reg.semesters.map((sem, sI) => (
            <div
              key={sI}
              className="rounded-lg border border-gray-200 bg-gray-50/50 p-3"
            >
              {/* Semester header */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Semester
                  </span>
                  <input
                    type="number"
                    className="admin-input w-16 text-sm"
                    value={sem.semester}
                    min={1}
                    max={12}
                    onChange={(e) =>
                      updSem(activeReg, sI, {
                        semester: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remSem(activeReg, sI)}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>

              {/* Subject column headers */}
              {sem.subjects.length > 0 && (
                <div
                  className="mb-1 grid gap-2 px-1"
                  style={{ gridTemplateColumns: "100px 1fr 70px 130px 32px" }}
                >
                  {["Code", "Subject Name", "Credits", "Type", ""].map((h) => (
                    <span
                      key={h}
                      className="text-xs font-semibold text-gray-400"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Subject rows */}
              <div className="mb-2 space-y-1">
                {sem.subjects.map((sub, jI) => (
                  <div
                    key={jI}
                    className="grid items-center gap-2"
                    style={{ gridTemplateColumns: "100px 1fr 70px 130px 32px" }}
                  >
                    <input
                      className="admin-input text-sm"
                      value={sub.code}
                      placeholder="CS101"
                      onChange={(e) =>
                        updSubj(activeReg, sI, jI, { code: e.target.value })
                      }
                    />
                    <input
                      className="admin-input text-sm"
                      value={sub.name}
                      placeholder="Subject name"
                      onChange={(e) =>
                        updSubj(activeReg, sI, jI, { name: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="admin-input text-sm"
                      value={sub.credits}
                      min={0}
                      max={8}
                      onChange={(e) =>
                        updSubj(activeReg, sI, jI, {
                          credits: Number(e.target.value),
                        })
                      }
                    />
                    <select
                      className="admin-select text-sm"
                      value={sub.type}
                      onChange={(e) =>
                        updSubj(activeReg, sI, jI, {
                          type: e.target.value as CurriculumSubject["type"],
                        })
                      }
                    >
                      {SUBJECT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => remSubj(activeReg, sI, jI)}
                      className="admin-btn admin-btn-danger admin-btn-sm px-1.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addSubj(activeReg, sI)}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <Plus size={12} /> Add Subject
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSem(activeReg)}
            className="admin-btn admin-btn-outline admin-btn-sm w-full justify-center"
          >
            <Plus size={13} /> Add Semester
          </button>
        </div>
      )}
    </div>
  );
}
