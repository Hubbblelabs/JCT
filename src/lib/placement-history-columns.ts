import type { BuiltinColumn } from "@/lib/table-columns";

/**
 * Built-in columns of the year-wise placement history table, after the
 * "Academic Year" column (which is always first and isn't in the list).
 *
 * Each is a figure stored on the year's Placement record and used elsewhere on
 * the page too, so these can be renamed, reordered and hidden but not deleted.
 * Added columns (`c_…`) take their per-year values from `history_cells`.
 */
export const PLACEMENT_HISTORY_COLUMNS: readonly BuiltinColumn[] = [
  { id: "placement_percentage", label: "Placement Rate", locked: true },
  { id: "students_placed", label: "Students Placed", locked: true },
  { id: "total_students", label: "Eligible", locked: true },
  { id: "offers_made", label: "Offers", locked: true },
  { id: "companies_visited", label: "Companies", locked: true },
  { id: "recruiters", label: "Recruiters Listed", locked: true },
  { id: "highest_package", label: "Highest", locked: true },
  { id: "average_package", label: "Average", locked: true },
  { id: "median_package", label: "Median", locked: true },
];
