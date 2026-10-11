import {
  resolveColumns,
  type BuiltinColumn,
  type TableColumn,
} from "@/lib/table-columns";
import type { LabelsTree } from "@/types/program";

/**
 * The tables on a program page whose columns editors control. Each stores its
 * own list under `content.tableColumns[id]`; without one it shows its built-in
 * columns, named by the older per-column `labels` fields so a program that
 * renamed "Faculty Member" keeps that name.
 */
export const PROGRAM_TABLES = [
  "faculty",
  "advisoryBoard",
  "pac",
  "bos",
  "curriculum",
] as const;

export type ProgramTableId = (typeof PROGRAM_TABLES)[number];

export type ProgramTableColumns = Partial<
  Record<ProgramTableId, TableColumn[]>
>;

const t = (s: string | undefined, fallback: string) => s?.trim() || fallback;

export function programTableBuiltins(
  table: ProgramTableId,
  labels: LabelsTree | undefined,
): BuiltinColumn[] {
  if (table === "faculty") {
    const l = labels?.faculty?.coreFaculty;
    return [
      { id: "name", label: t(l?.colName, "Faculty Member"), locked: true },
      { id: "designation", label: t(l?.colDesignation, "Designation") },
      { id: "qualification", label: t(l?.colQualification, "Qualification") },
      {
        id: "experience",
        label: t(l?.colExperience, "Experience"),
        placeholder: "10+ years",
      },
      {
        id: "specialization",
        label: t(l?.colSpecialization, "Specialization"),
      },
      {
        id: "aicteId",
        label: t(l?.colAicteId, "AICTE ID"),
        placeholder: "1-7342956647",
      },
    ];
  }
  if (table === "curriculum") {
    const l = labels?.academics?.curriculum;
    return [
      { id: "code", label: t(l?.colCode, "Code") },
      { id: "name", label: t(l?.colName, "Course Name"), locked: true },
      { id: "credits", label: t(l?.colCredits, "Credits") },
      { id: "type", label: t(l?.colType, "Type") },
    ];
  }
  // Advisory board, PAC and BOS share their default names.
  const l = labels?.faculty?.boardCols;
  return [
    { id: "name", label: t(l?.colName, "Name"), locked: true },
    { id: "designation", label: t(l?.colDesignation, "Designation") },
    { id: "organization", label: t(l?.colOrganization, "Organization") },
    { id: "role", label: t(l?.colRole, "Role") },
  ];
}

/** A program table's columns, as stored or by default. */
export function programTableColumns(
  table: ProgramTableId,
  stored: unknown,
  labels: LabelsTree | undefined,
): TableColumn[] {
  const columns =
    stored && typeof stored === "object"
      ? (stored as Record<string, unknown>)[table]
      : undefined;
  return resolveColumns(columns, programTableBuiltins(table, labels));
}

/** Only well-formed column lists survive into the page data. */
export function normalizeProgramTableColumns(
  raw: unknown,
): ProgramTableColumns | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: ProgramTableColumns = {};
  for (const id of PROGRAM_TABLES) {
    const list = (raw as Record<string, unknown>)[id];
    if (Array.isArray(list)) out[id] = list as TableColumn[];
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
