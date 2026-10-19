"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ColumnsPanel, columnLabel } from "@/components/admin/TableEditor";
import {
  cellValue,
  removeColumnData,
  withCell,
  type BuiltinColumn,
  type TableColumn,
} from "@/lib/table-columns";

export type CurriculumSubject = {
  code: string;
  name: string;
  credits: number;
  type: "Theory" | "Lab" | "Core" | "Elective" | "Project";
  /** Values for the course table's added columns. */
  cells?: Record<string, string>;
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

/**
 * A blank course. A deleted Credits or Type column stays deleted: the new
 * course doesn't bring its default value back into a column nobody sees.
 */
function newSubject(columns: TableColumn[]): CurriculumSubject {
  const subject = { ...EMPTY_SUBJECT } as Partial<CurriculumSubject>;
  if (!columns.some((c) => c.id === "credits")) delete subject.credits;
  if (!columns.some((c) => c.id === "type")) delete subject.type;
  return subject as CurriculumSubject;
}

// Width of each built-in column in a subject row; added columns share the
// rest of the row with the course name.
const BUILTIN_WIDTH: Record<string, string> = {
  code: "100px",
  credits: "70px",
  type: "130px",
};

export function CurriculumEditor({
  value,
  onChange,
  columns,
  builtins,
  onColumnsChange,
}: {
  value: CurriculumRegulation[];
  onChange: (v: CurriculumRegulation[]) => void;
  /** The course table's columns — one list for every regulation. */
  columns: TableColumn[];
  builtins: readonly BuiltinColumn[];
  /** Columns and courses change together when a column is deleted. */
  onColumnsChange: (
    columns: TableColumn[],
    curriculum: CurriculumRegulation[],
  ) => void;
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
      newSubject(columns),
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

  const allSubjects = normalised.flatMap((r) =>
    r.semesters.flatMap((sem) => sem.subjects),
  );
  const gridTemplate = [
    ...columns.map((c) => BUILTIN_WIDTH[c.id] ?? "minmax(120px, 1fr)"),
    "32px",
  ].join(" ");

  return (
    <div className="space-y-4">
      <ColumnsPanel
        label="curriculum"
        columns={columns}
        builtins={builtins}
        rows={allSubjects}
        onChange={(next, deletedId) =>
          onColumnsChange(
            next,
            deletedId
              ? normalised.map((r) => ({
                  ...r,
                  semesters: r.semesters.map((sem) => ({
                    ...sem,
                    subjects: removeColumnData(sem.subjects, deletedId),
                  })),
                }))
              : normalised,
          )
        }
      />

      {/* Regulation tab strip */}
      <div className="flex flex-wrap items-center gap-2">
        {normalised.map((r, i) => (
          <div
            key={i}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors ${
              i === activeReg
                ? "border-[var(--admin-info-border)] bg-[var(--admin-info-bg)]"
                : "border-[var(--admin-border)] bg-white hover:border-[var(--admin-border-strong)]"
            }`}
          >
            <input
              className="w-36 bg-transparent text-sm font-semibold text-[var(--admin-text)] outline-none"
              value={r.regulationName}
              onChange={(e) => updReg(i, { regulationName: e.target.value })}
              onClick={() => setActiveReg(i)}
            />
            <button
              type="button"
              onClick={() => remReg(i)}
              className="ml-1 text-[var(--admin-text-faint)] hover:text-red-500"
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
        <p className="rounded-lg border border-dashed border-[var(--admin-border)] p-4 text-center text-sm text-[var(--admin-text-faint)]">
          No regulations yet. Click "Add Regulation" to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {reg.semesters.map((sem, sI) => (
            <div
              key={sI}
              className="rounded-lg border border-[var(--admin-border)] bg-gray-50/50 p-3"
            >
              {/* Semester header */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--admin-text-secondary)]">
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

              {/* Subject rows — one input per column, in column order. Wide
                  tables scroll sideways rather than squeezing the inputs. */}
              {sem.subjects.length > 0 && (
                <div className="mb-2 overflow-x-auto">
                  <div className="space-y-1">
                    <div
                      className="mb-1 grid gap-2 px-1"
                      style={{ gridTemplateColumns: gridTemplate }}
                    >
                      {columns.map((c) => (
                        <span
                          key={c.id}
                          className="truncate text-xs font-semibold text-[var(--admin-text-faint)]"
                        >
                          {columnLabel(c, builtins)}
                          {c.hidden ? " (hidden)" : ""}
                        </span>
                      ))}
                      <span />
                    </div>
                    {sem.subjects.map((sub, jI) => (
                      <div
                        key={jI}
                        className="grid items-center gap-2"
                        style={{ gridTemplateColumns: gridTemplate }}
                      >
                        {columns.map((c) => {
                          if (c.id === "credits")
                            return (
                              <input
                                key={c.id}
                                type="number"
                                className="admin-input text-sm"
                                value={sub.credits ?? ""}
                                min={0}
                                max={8}
                                aria-label={columnLabel(c, builtins)}
                                onChange={(e) =>
                                  updSubj(activeReg, sI, jI, {
                                    credits: Number(e.target.value),
                                  })
                                }
                              />
                            );
                          if (c.id === "type")
                            return (
                              <select
                                key={c.id}
                                className="admin-select text-sm"
                                value={sub.type ?? ""}
                                aria-label={columnLabel(c, builtins)}
                                onChange={(e) =>
                                  updSubj(activeReg, sI, jI, {
                                    type: e.target
                                      .value as CurriculumSubject["type"],
                                  })
                                }
                              >
                                {SUBJECT_TYPES.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            );
                          return (
                            <input
                              key={c.id}
                              className="admin-input text-sm"
                              value={cellValue(sub, c.id)}
                              placeholder={
                                c.id === "code"
                                  ? "CS101"
                                  : c.id === "name"
                                    ? "Subject name"
                                    : undefined
                              }
                              aria-label={columnLabel(c, builtins)}
                              onChange={(e) =>
                                updSem(activeReg, sI, {
                                  subjects: sem.subjects.map((x, idx) =>
                                    idx === jI
                                      ? withCell(x, c.id, e.target.value)
                                      : x,
                                  ),
                                })
                              }
                            />
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => remSubj(activeReg, sI, jI)}
                          aria-label="Remove subject"
                          className="admin-btn admin-btn-danger admin-btn-sm px-1.5"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
