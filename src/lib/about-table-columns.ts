import type { BuiltinColumn } from "@/lib/table-columns";

/**
 * Built-in columns of the About page's two tables. Each table's stored
 * `columns` list can rename, reorder, hide or delete them and add more; the
 * S.No column is numbered automatically and isn't part of the list.
 */

export const GOVERNING_COUNCIL_COLUMNS: readonly BuiltinColumn[] = [
  { id: "name", label: "Member", locked: true },
  { id: "category", label: "Category" },
];

export const PLANNING_BOARD_COLUMNS: readonly BuiltinColumn[] = [
  { id: "name", label: "Name", locked: true, placeholder: "Dr. MANOHARAN S" },
  { id: "position", label: "Position", placeholder: "Chairman" },
  {
    id: "category",
    label: "Category",
    placeholder: "Senior faculty member of the College",
  },
  {
    id: "qualification",
    label: "Qualification",
    placeholder: "Ph.D. — Electrical Machines",
  },
];
