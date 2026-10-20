"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { FormGrid, Select, TextInput } from "@/components/admin/inputs";
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
    if (!Array.isArray(value) || value.length === 0) {
      return defaultsAsOverrides(defaults);
    }
    // Append built-ins the stored list predates, mirroring the back-fill in
    // resolveSidebarItems — otherwise a newly added built-in section would be
    // live on the public page but missing from this editor.
    const present = new Set(value.map((it) => it.key).filter(Boolean));
    const missing = defaultsAsOverrides(
      defaults.filter((d) => !present.has(d.anchor)),
    );
    return missing.length > 0 ? [...value, ...missing] : value;
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
      <p className="rounded-lg border border-[var(--admin-warning-border)] bg-[var(--admin-warning-bg)] px-3 py-2 text-xs text-[var(--admin-warning)]">
        Reorder, rename, hide, or add sidebar items. Built-in items scroll to a
        page section; custom links open any URL; page sections create a new
        in-page section you fill with content blocks. Removing a built-in only
        hides it — toggle visibility instead.
      </p>
      {/* Two nav items at a time on a wide screen. Each is a header line —
          what it is, shown or hidden, its order — over a label and an icon
          side by side; the anchor of a built-in is fixed, so it is named in
          the header rather than given a read-only input of its own. */}
      <div className="admin-form-grid admin-form-grid--tight">
        {seeded.map((item, i) => {
          const isBuiltin = !!item.key && builtinSet.has(item.key);
          const isSection = !isBuiltin && Array.isArray(item.blocks);
          const placeholderLabel = isBuiltin
            ? defaults.find((d) => d.anchor === item.key)?.navLabel
            : "Item Label";
          const kindLabel = isBuiltin
            ? `Built-in · #${item.key}`
            : isSection
              ? "Page Section"
              : "Custom Link";
          const name = item.label?.trim() || placeholderLabel || kindLabel;
          const patchItem = (next: Partial<SidebarNavItemRaw>) =>
            update(seeded.map((it, j) => (j === i ? { ...it, ...next } : it)));
          return (
            <div
              key={item.id ?? `${item.key ?? "c"}-${i}`}
              className="admin-col-6 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-raised)] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className="min-w-0 truncate text-xs font-medium text-[var(--admin-text-muted)]"
                  title={kindLabel}
                >
                  {kindLabel}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <label className="mr-1 flex items-center gap-1.5 text-xs font-medium text-[var(--admin-text-secondary)]">
                    <input
                      type="checkbox"
                      checked={item.visible !== false}
                      onChange={(e) => patchItem({ visible: e.target.checked })}
                    />
                    Visible
                  </label>
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => update(moveItem(seeded, i, i - 1))}
                    className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Move ${name} up`}
                    title="Move up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={i === seeded.length - 1}
                    onClick={() => update(moveItem(seeded, i, i + 1))}
                    className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Move ${name} down`}
                    title="Move down"
                  >
                    <ArrowDown size={12} />
                  </button>
                  {!isBuiltin && (
                    <button
                      type="button"
                      onClick={() => update(seeded.filter((_, j) => j !== i))}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      aria-label={`Remove ${name}`}
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              <FormGrid tight>
                <TextInput
                  label="Label"
                  span={6}
                  value={item.label ?? ""}
                  placeholder={placeholderLabel ?? "Item Label"}
                  onChange={(e) => patchItem({ label: e.target.value })}
                />
                <Select
                  label="Icon (optional)"
                  span={6}
                  value={item.icon ?? ""}
                  options={ICON_SELECT_OPTIONS}
                  onChange={(e) => patchItem({ icon: e.target.value })}
                />
                {!isBuiltin && !isSection && (
                  <TextInput
                    label="URL / Href"
                    span="full"
                    value={item.href ?? ""}
                    placeholder="/path or https://..."
                    onChange={(e) => patchItem({ href: e.target.value })}
                  />
                )}
              </FormGrid>
              {isSection && (
                <p className="admin-help mt-2">
                  Edit its content blocks by clicking the section in the live
                  preview.
                </p>
              )}
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
