"use client";

import { Pencil } from "lucide-react";
import type {
  CSSProperties,
  ElementType,
  KeyboardEvent,
  ReactNode,
} from "react";

/**
 * Wraps a page section so that, in `editable` mode, it shows a dashed hover
 * outline + "Edit" badge and invokes `onEditSection` when clicked — the same
 * affordance used by the Programs live CMS editor.
 */
export function EditableRegion<S extends string>({
  as,
  id,
  section,
  label,
  editable,
  onEditSection,
  className = "",
  style,
  children,
}: {
  as?: ElementType;
  id?: string;
  section: S;
  label: string;
  editable?: boolean;
  onEditSection?: (section: S) => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const Component = as ?? "section";
  // Regions nest (a section containing per-item cards). Without stopping
  // propagation the outer region would also fire and win, so clicking an item
  // would open the wrong inspector.
  const handleSelect = (event: { stopPropagation: () => void }) => {
    if (!editable) return;
    event.stopPropagation();
    onEditSection?.(section);
  };

  return (
    <Component
      id={id}
      className={`${className} ${
        editable
          ? "group/editable relative cursor-pointer rounded-2xl outline-2 outline-transparent transition hover:outline-yellow-400/80 hover:outline-dashed focus:outline-yellow-400/80 focus:outline-dashed"
          : ""
      }`}
      style={style}
      onClick={editable ? handleSelect : undefined}
      onKeyDown={
        editable
          ? (event: KeyboardEvent) => {
              // Only act when the region itself has focus. Keydown bubbles, so
              // without this an Enter pressed on any descendant button, link or
              // listbox reaches here, gets preventDefault()'d — which for a
              // <button> cancels the click that Enter would otherwise fire —
              // and opens the inspector instead of running the control. That
              // made every keyboard-only interaction inside a preview
              // impossible. Descendants stopPropagation on click only, which
              // does nothing for keydown.
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect(event);
              }
            }
          : undefined
      }
      role={editable ? "button" : undefined}
      tabIndex={editable ? 0 : undefined}
      data-edit-section={editable ? section : undefined}
      title={editable ? `Edit ${label}` : undefined}
    >
      {editable && (
        <span className="pointer-events-none absolute top-2 right-2 z-30 hidden items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black tracking-wider text-slate-950 uppercase shadow-sm group-hover/editable:inline-flex group-focus/editable:inline-flex">
          <Pencil className="h-3 w-3" />
          Edit
        </span>
      )}
      {children}
    </Component>
  );
}
