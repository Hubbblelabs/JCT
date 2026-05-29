"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Field, Select, TextInput } from "@/components/admin/inputs";
import {
  defaultsAsOverrides,
  SIDEBAR_ICON_OPTIONS,
  type SidebarNavDefault,
  type SidebarNavItemRaw,
} from "@/lib/sidebar-nav";

type Props = {
  defaults: SidebarNavDefault[];
  value: SidebarNavItemRaw[] | undefined;
  onChange: (next: SidebarNavItemRaw[]) => void;
};

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [v] = next.splice(from, 1);
  next.splice(to, 0, v);
  return next;
}

const ICON_SELECT_OPTIONS = [
  { value: "", label: "Default icon" },
  ...SIDEBAR_ICON_OPTIONS.map((name) => ({ value: name, label: name })),
];

export function SidebarNavEditor({ defaults, value, onChange }: Props) {
  const seeded = useMemo<SidebarNavItemRaw[]>(() => {
    if (Array.isArray(value) && value.length > 0) return value;
    return defaultsAsOverrides(defaults);
  }, [value, defaults]);

  const builtinSet = useMemo(
    () => new Set(defaults.map((d) => d.anchor)),
    [defaults],
  );

  const update = (next: SidebarNavItemRaw[]) => onChange(next);

  const addCustom = () => {
    update([
      ...seeded,
      {
        id: `custom-${Date.now()}`,
        label: "",
        href: "",
        visible: true,
      },
    ]);
  };

  const addSection = () => {
    update([
      ...seeded,
      {
        id: `section-${Date.now()}`,
        label: "",
        icon: "Layers",
        visible: true,
        blocks: [],
      },
    ]);
  };

  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Reorder, rename, hide, or add sidebar items. Built-in items scroll to a
        page section; custom links open any URL; page sections create a new
        in-page section you fill with content blocks. Removing a built-in only
        hides it — toggle visibility instead.
      </p>
      <div className="space-y-2">
        {seeded.map((item, i) => {
          const isBuiltin = !!item.key && builtinSet.has(item.key);
          const isSection = !isBuiltin && Array.isArray(item.blocks);
          const placeholderLabel = isBuiltin
            ? defaults.find((d) => d.anchor === item.key)?.navLabel
            : "Item Label";
          const kindLabel = isBuiltin
            ? `Built-in · ${item.key}`
            : isSection
              ? "Page Section"
              : "Custom Link";
          return (
            <div
              key={item.id ?? `${item.key ?? "c"}-${i}`}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {kindLabel}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => update(moveItem(seeded, i, i - 1))}
                    className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={i === seeded.length - 1}
                    onClick={() => update(moveItem(seeded, i, i + 1))}
                    className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowDown size={12} />
                  </button>
                  {!isBuiltin && (
                    <button
                      type="button"
                      onClick={() => update(seeded.filter((_, j) => j !== i))}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Label"
                  value={item.label ?? ""}
                  placeholder={placeholderLabel ?? "Item Label"}
                  onChange={(e) =>
                    update(
                      seeded.map((it, j) =>
                        j === i ? { ...it, label: e.target.value } : it,
                      ),
                    )
                  }
                />
                {isBuiltin ? (
                  <Field label="Anchor (read-only)">
                    <input
                      className="admin-input"
                      value={item.key ?? ""}
                      disabled
                    />
                  </Field>
                ) : isSection ? (
                  <Field label="Content">
                    <p className="flex h-9 items-center text-xs text-gray-500">
                      Edit blocks by clicking the section in the live preview.
                    </p>
                  </Field>
                ) : (
                  <TextInput
                    label="URL / Href"
                    value={item.href ?? ""}
                    placeholder="/path or https://..."
                    onChange={(e) =>
                      update(
                        seeded.map((it, j) =>
                          j === i ? { ...it, href: e.target.value } : it,
                        ),
                      )
                    }
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Icon (optional)"
                  value={item.icon ?? ""}
                  options={ICON_SELECT_OPTIONS}
                  onChange={(e) =>
                    update(
                      seeded.map((it, j) =>
                        j === i ? { ...it, icon: e.target.value } : it,
                      ),
                    )
                  }
                />
                <Field label="Visibility">
                  <label className="flex h-9 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible !== false}
                      onChange={(e) =>
                        update(
                          seeded.map((it, j) =>
                            j === i ? { ...it, visible: e.target.checked } : it,
                          ),
                        )
                      }
                    />
                    Visible on public page
                  </label>
                </Field>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addCustom}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={14} /> Add Custom Link
        </button>
        <button
          type="button"
          onClick={addSection}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          <Plus size={14} /> Add Page Section
        </button>
      </div>
    </div>
  );
}
