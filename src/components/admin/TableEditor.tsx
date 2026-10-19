"use client";

import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Columns3,
  Eye,
  EyeOff,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import {
  FormGrid,
  Repeater,
  TextArea,
  TextInput,
} from "@/components/admin/inputs";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  cellValue,
  isCustomColumn,
  newColumnId,
  removeColumnData,
  withCell,
  type BuiltinColumn,
  type TableColumn,
} from "@/lib/table-columns";
import { TABLE_COLUMN_LIMITS } from "@/lib/validation/tableColumns";

/** A column's name for buttons and field labels — never blank. */
export function columnLabel(
  c: TableColumn,
  builtins: readonly BuiltinColumn[],
): string {
  return (
    c.label.trim() ||
    builtins.find((b) => b.id === c.id)?.label ||
    "Untitled column"
  );
}

/**
 * A table's column list: add, rename, reorder, hide and delete. Deleting a
 * column deletes everything typed in it, so it asks first and reports the
 * deleted id — the caller clears that column from its rows, wherever they
 * live (see TableEditor, or the curriculum's nested semesters).
 */
export function ColumnsPanel({
  label,
  columns,
  builtins,
  rows,
  onChange,
}: {
  /** Name of the table, used in the confirmation copy. */
  label: string;
  columns: TableColumn[];
  builtins: readonly BuiltinColumn[];
  /** Every row of the table, to say how much a delete would remove. */
  rows: readonly unknown[];
  onChange: (columns: TableColumn[], deletedId?: string) => void;
}) {
  const confirm = useConfirm();
  const builtinById = new Map(builtins.map((b) => [b.id, b]));
  const atMax = columns.length >= TABLE_COLUMN_LIMITS.columnsMax;
  const labelFor = (c: TableColumn) => columnLabel(c, builtins);

  const moveColumn = (i: number, delta: number) => {
    const to = i + delta;
    if (to < 0 || to >= columns.length) return;
    const next = [...columns];
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
  };

  const deleteColumn = async (col: TableColumn) => {
    const name = labelFor(col);
    const filled = rows.filter((r) => cellValue(r, col.id).trim()).length;
    const ok = await confirm({
      title: `Delete “${name}”?`,
      message:
        filled > 0
          ? `This deletes the column and what is typed in it in ${filled} ${
              filled === 1 ? "row" : "rows"
            } of the ${label} table. It can't be undone after saving. To keep the information, hide the column instead.`
          : `This deletes the column from the ${label} table.`,
      confirmLabel: "Delete column",
      destructive: true,
    });
    if (!ok) return;
    onChange(
      columns.filter((c) => c.id !== col.id),
      col.id,
    );
  };

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="admin-label mb-0 inline-flex items-center gap-1.5">
          <Columns3 size={14} /> Columns
        </span>
        <button
          type="button"
          disabled={atMax}
          onClick={() =>
            onChange([...columns, { id: newColumnId(), label: "New column" }])
          }
          className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-50"
        >
          <Plus size={14} /> Add column
        </button>
      </div>
      <p className="admin-help mb-3">
        The table&apos;s columns, left to right. Rename them here; hidden
        columns keep their information but don&apos;t show on the site. Empty
        columns are left off automatically.
      </p>
      <ul className="space-y-2">
        {columns.map((c, i) => {
          const builtin = builtinById.get(c.id);
          const locked = !isCustomColumn(c.id) && builtin?.locked;
          return (
            <li key={c.id} className="flex items-center gap-1.5">
              <input
                className={`admin-input min-w-0 flex-1 ${c.hidden ? "text-[var(--admin-text-faint)] line-through" : ""}`}
                value={c.label}
                placeholder={builtin?.label ?? "Column name"}
                maxLength={TABLE_COLUMN_LIMITS.labelMax}
                aria-label={`Column ${i + 1} name`}
                onChange={(e) =>
                  onChange(
                    columns.map((x, j) =>
                      j === i ? { ...x, label: e.target.value } : x,
                    ),
                  )
                }
              />
              <button
                type="button"
                disabled={i === 0}
                onClick={() => moveColumn(i, -1)}
                aria-label={`Move ${labelFor(c)} left`}
                title="Move left"
                className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-40"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                disabled={i === columns.length - 1}
                onClick={() => moveColumn(i, 1)}
                aria-label={`Move ${labelFor(c)} right`}
                title="Move right"
                className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-40"
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    columns.map((x, j) =>
                      j === i ? { ...x, hidden: !x.hidden } : x,
                    ),
                  )
                }
                aria-label={
                  c.hidden ? `Show ${labelFor(c)}` : `Hide ${labelFor(c)}`
                }
                title={c.hidden ? "Show on the site" : "Hide from the site"}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                {c.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              {locked ? (
                <span
                  className="admin-btn admin-btn-ghost admin-btn-sm cursor-default"
                  title="This column can be renamed, moved or hidden, but not deleted"
                >
                  <Lock size={13} />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => void deleteColumn(c)}
                  aria-label={`Delete ${labelFor(c)}`}
                  title="Delete the column and its information"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The one editor for every flat table with editable columns: the Columns
 * panel above the rows, whose inputs follow the columns.
 *
 * Rows can carry fields that are not columns (a faculty member's photo, a
 * NAAC row's documents) — `renderExtra` draws those under each row's cells.
 */
export function TableEditor<R extends object>({
  label,
  columns,
  builtins,
  rows,
  onChange,
  newRow,
  renderExtra,
  rowsLabel = "Rows",
  hint,
}: {
  /** Name of the table, used in the confirmation copy. */
  label: string;
  columns: TableColumn[];
  builtins: readonly BuiltinColumn[];
  rows: R[];
  /** Columns and rows change together (a deleted column clears its cells). */
  onChange: (next: { columns: TableColumn[]; rows: R[] }) => void;
  newRow: () => R;
  renderExtra?: (row: R, onChange: (next: R) => void) => ReactNode;
  rowsLabel?: string;
  hint?: string;
}) {
  const builtinById = new Map(builtins.map((b) => [b.id, b]));

  return (
    <div className="space-y-4">
      <ColumnsPanel
        label={label}
        columns={columns}
        builtins={builtins}
        rows={rows}
        onChange={(next, deletedId) =>
          onChange({
            columns: next,
            rows: deletedId ? removeColumnData(rows, deletedId) : rows,
          })
        }
      />

      <Repeater<R>
        label={rowsLabel}
        hint={hint}
        items={rows}
        onChange={(next) => onChange({ columns, rows: next })}
        newItem={newRow}
        renderItem={(row, _i, oc) => (
          <FormGrid tight>
            {columns.map((c) => {
              const builtin = builtinById.get(c.id);
              const fieldLabel = `${columnLabel(c, builtins)}${c.hidden ? " (hidden)" : ""}`;
              const value = cellValue(row, c.id);
              const set = (v: string) => oc(withCell(row, c.id, v));
              return builtin?.multiline ? (
                <TextArea
                  key={c.id}
                  label={fieldLabel}
                  span="full"
                  rows={2}
                  value={value}
                  placeholder={builtin.placeholder}
                  onChange={(e) => set(e.target.value)}
                />
              ) : (
                <TextInput
                  key={c.id}
                  label={fieldLabel}
                  span={6}
                  value={value}
                  placeholder={builtin?.placeholder}
                  onChange={(e) => set(e.target.value)}
                />
              );
            })}
            {renderExtra && (
              <div className="admin-col-full">{renderExtra(row, oc)}</div>
            )}
          </FormGrid>
        )}
      />
    </div>
  );
}
