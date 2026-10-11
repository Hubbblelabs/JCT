import type { BuiltinColumn } from "@/lib/table-columns";

/**
 * The members table on a club or committee page — its built-in columns. The
 * stored list (`group.memberColumns`) can rename, reorder, hide or delete them
 * and add more; see src/lib/table-columns.ts.
 */
export const GROUP_MEMBER_COLUMNS: readonly BuiltinColumn[] = [
  { id: "name", label: "Name", locked: true, placeholder: "Dr. K. Geetha" },
  { id: "role", label: "Designation", placeholder: "Member" },
  {
    id: "dept",
    label: "Department / Affiliation",
    placeholder: "Associate Professor - S&H",
  },
  { id: "contact", label: "Contact", placeholder: "9789650151" },
];
