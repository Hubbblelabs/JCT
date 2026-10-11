/**
 * Editable table columns.
 *
 * Tables across the site (program faculty, boards, curriculum, the About page
 * councils, club and committee members, NAAC appeal tables, placement history)
 * used to have a fixed set of columns. Each now stores its own column list:
 * editors can add, rename, reorder, hide and delete columns.
 *
 * - A *built-in* column keeps its value in the row's own field (`row.name`,
 *   `row.designation`, …), so data saved before columns were editable keeps
 *   working untouched.
 * - A *custom* column (id `c_…`) keeps its value in `row.cells[id]`.
 * - A table with no stored column list shows its built-in columns with their
 *   default labels — exactly what it showed before.
 * - Deleting a column deletes everything typed in it (`removeColumnData`).
 *
 * Zod-free so public layouts can use it without the validation library; the
 * schemas live in src/lib/validation/tableColumns.ts.
 */

export type TableColumn = {
  id: string;
  label: string;
  /** Kept with its data, but not shown on the site. */
  hidden?: boolean;
};

/** A column a table has out of the box. */
export type BuiltinColumn = {
  id: string;
  label: string;
  /**
   * Can be renamed, moved and hidden, but not deleted — a table's identifying
   * column (the person's name), or a figure other parts of the page compute
   * from.
   */
  locked?: boolean;
  /** The value is long text — edited in a multi-line box. */
  multiline?: boolean;
  placeholder?: string;
};

export type CellRow = { cells?: Record<string, string> };

export const CUSTOM_PREFIX = "c_";

export function isCustomColumn(id: string): boolean {
  return id.startsWith(CUSTOM_PREFIX);
}

export function newColumnId(): string {
  return `${CUSTOM_PREFIX}${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

/**
 * The table's columns in order. A stored list wins (a built-in missing from it
 * was deleted); without one, the built-ins with their default labels.
 */
export function resolveColumns(
  stored: unknown,
  builtins: readonly BuiltinColumn[],
): TableColumn[] {
  if (!Array.isArray(stored)) {
    return builtins.map((b) => ({ id: b.id, label: b.label }));
  }
  const known = new Set(builtins.map((b) => b.id));
  const seen = new Set<string>();
  const out: TableColumn[] = [];
  for (const raw of stored) {
    if (!raw || typeof raw !== "object") continue;
    const c = raw as Record<string, unknown>;
    const id = typeof c.id === "string" ? c.id : "";
    if (!id || seen.has(id)) continue;
    if (!known.has(id) && !isCustomColumn(id)) continue;
    seen.add(id);
    out.push({
      id,
      label: typeof c.label === "string" ? c.label : "",
      ...(c.hidden === true ? { hidden: true } : {}),
    });
  }
  // A locked built-in can't be deleted, so one missing from an older or
  // hand-edited list is put back at the end rather than lost.
  for (const b of builtins) {
    if (b.locked && !seen.has(b.id)) out.push({ id: b.id, label: b.label });
  }
  return out;
}

/**
 * The column list to save. A table that has never stored one keeps not
 * storing one until its columns actually change, so it keeps following its
 * defaults — and the NAAC quantitative table keeps its two-row header.
 */
export function columnsToStore(
  stored: unknown,
  next: TableColumn[],
  builtins: readonly BuiltinColumn[],
): TableColumn[] | undefined {
  if (Array.isArray(stored)) return next;
  const defaults = resolveColumns(undefined, builtins);
  const unchanged =
    next.length === defaults.length &&
    next.every(
      (c, i) =>
        c.id === defaults[i].id && c.label === defaults[i].label && !c.hidden,
    );
  return unchanged ? undefined : next;
}

/** A stored `cells` map with anything but string values dropped. */
export function cleanCells(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

/** A cell's text, for display or for an input. */
export function cellValue(row: unknown, id: string): string {
  if (!row || typeof row !== "object") return "";
  const r = row as Record<string, unknown> & CellRow;
  const raw = isCustomColumn(id) ? r.cells?.[id] : r[id];
  if (raw === null || raw === undefined) return "";
  return typeof raw === "string" ? raw : String(raw);
}

/** `row` with one cell changed. */
export function withCell<R extends object>(
  row: R,
  id: string,
  value: string,
): R {
  if (!isCustomColumn(id)) return { ...row, [id]: value };
  const cells = { ...((row as CellRow).cells ?? {}), [id]: value };
  return { ...row, cells };
}

/** Every row with a deleted column's values removed. */
export function removeColumnData<R extends object>(rows: R[], id: string): R[] {
  return rows.map((row) => {
    if (isCustomColumn(id)) {
      const cells = { ...((row as CellRow).cells ?? {}) };
      delete cells[id];
      return { ...row, cells };
    }
    const next = { ...row } as Record<string, unknown>;
    delete next[id];
    return next as R;
  });
}

/** For display: a built-in column left unnamed shows its default name. */
export function withDefaultLabels(
  columns: TableColumn[],
  builtins: readonly BuiltinColumn[],
): TableColumn[] {
  const defaults = new Map(builtins.map((b) => [b.id, b.label]));
  return columns.map((c) =>
    c.label.trim() ? c : { ...c, label: defaults.get(c.id) ?? "" },
  );
}

/**
 * What a public table draws: the stored (or default) columns, named, minus
 * hidden and empty ones. `always` keeps a column even when it is empty.
 */
export function displayColumns(
  stored: unknown,
  builtins: readonly BuiltinColumn[],
  rows: readonly unknown[],
  always: readonly string[] = [],
): TableColumn[] {
  return visibleColumns(
    withDefaultLabels(resolveColumns(stored, builtins), builtins),
    rows,
    always,
  );
}

/**
 * The columns to draw: not hidden, and with something in them — an empty
 * column only adds width. `always` keeps a column even when it is empty.
 */
export function visibleColumns(
  columns: TableColumn[],
  rows: readonly unknown[],
  always: readonly string[] = [],
): TableColumn[] {
  return columns.filter(
    (c) =>
      !c.hidden &&
      (always.includes(c.id) ||
        rows.some((r) => cellValue(r, c.id).trim() !== "")),
  );
}
