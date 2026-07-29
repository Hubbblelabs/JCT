"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";

/**
 * Reorderable list of repeated items — gallery images, nav links, stat cards,
 * accordion rows, and everything else the content forms repeat.
 *
 * None of the existing repeaters could reorder at all: `StringList`,
 * `ItemsEditor` and `Repeater` only appended and removed. Getting a new item
 * into the middle of a published list meant retyping every entry after it,
 * which is exactly the kind of busywork that makes editors avoid the CMS.
 *
 * Both input methods are supported deliberately. Drag is discoverable;
 * the up/down buttons are what actually work for keyboard and touch users, so
 * they are real buttons rather than a fallback.
 */
export function SortableList<T>({
  items,
  onChange,
  renderItem,
  itemKey,
  onRemove,
  addLabel,
  onAdd,
  empty = "No items yet.",
}: {
  items: T[];
  onChange: (next: T[]) => void;
  renderItem: (item: T, index: number, update: (next: T) => void) => ReactNode;
  itemKey: (item: T, index: number) => string;
  /** Called with the removed item so callers can clean up its uploads. */
  onRemove?: (item: T) => void;
  addLabel?: string;
  onAdd?: () => void;
  empty?: string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const remove = (index: number) => {
    onRemove?.(items[index]);
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="rounded-[var(--admin-radius)] border border-dashed border-[var(--admin-border)] p-4 text-center text-[length:var(--admin-text-body)] text-[var(--admin-text-muted)]">
          {empty}
        </p>
      )}

      {items.map((item, i) => (
        <div
          key={itemKey(item, i)}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex !== null) move(dragIndex, i);
            setDragIndex(null);
            setOverIndex(null);
          }}
          className="admin-well flex gap-2"
          style={
            overIndex === i && dragIndex !== null && dragIndex !== i
              ? { borderColor: "var(--admin-gold)" }
              : undefined
          }
        >
          <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1">
            <span
              className="cursor-grab text-[var(--admin-text-faint)]"
              aria-hidden="true"
            >
              <GripVertical size={14} />
            </span>
            <button
              type="button"
              onClick={() => move(i, i - 1)}
              disabled={i === 0}
              className="admin-icon-btn h-6 w-6"
              aria-label={`Move item ${i + 1} up`}
            >
              <ChevronUp size={13} />
            </button>
            <span className="text-[length:var(--admin-text-xs)] font-semibold text-[var(--admin-text-faint)]">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => move(i, i + 1)}
              disabled={i === items.length - 1}
              className="admin-icon-btn h-6 w-6"
              aria-label={`Move item ${i + 1} down`}
            >
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            {renderItem(item, i, (next) =>
              onChange(items.map((it, j) => (j === i ? next : it))),
            )}
          </div>

          <button
            type="button"
            onClick={() => remove(i)}
            className="admin-btn admin-btn-danger admin-btn-sm h-8 shrink-0"
            aria-label={`Remove item ${i + 1}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="admin-btn admin-btn-outline admin-btn-sm admin-btn-block"
        >
          + {addLabel ?? "Add item"}
        </button>
      )}
    </div>
  );
}
