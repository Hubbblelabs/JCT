import { z } from "zod";

/**
 * Schemas for editable table columns — see src/lib/table-columns.ts for how a
 * table's column list and its rows' `cells` fit together.
 */

export const TABLE_COLUMN_LIMITS = {
  columnsMax: 20,
  labelMax: 120,
  cellMax: 2000,
} as const;

const zColumnId = z.string().regex(/^[A-Za-z0-9_]{1,40}$/, "Invalid column id");

export const TableColumnSchema = z.object({
  id: zColumnId,
  label: z.string().max(TABLE_COLUMN_LIMITS.labelMax).default(""),
  hidden: z.boolean().optional(),
});

/** A table's column list. Optional — absent means "the built-in columns". */
export const zTableColumns = z
  .array(TableColumnSchema)
  .max(
    TABLE_COLUMN_LIMITS.columnsMax,
    `At most ${TABLE_COLUMN_LIMITS.columnsMax} columns`,
  )
  .optional();

/** A row's values for its table's custom columns. */
export const zCells = z
  .record(zColumnId, z.string().max(TABLE_COLUMN_LIMITS.cellMax))
  .optional();
