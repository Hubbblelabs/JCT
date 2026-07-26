"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  TextInput,
  TextArea,
  TextAreaList,
  StringList,
  ImageUploadInput,
  ItemsEditor,
  Repeater,
} from "@/components/admin/inputs";
import {
  GROUPS_VARIANT_META,
  groupsBasePath,
  type GroupsInstitution,
  type GroupsVariant,
  type GroupsVariantMeta,
} from "@/lib/groups-meta";
import { resolveGroupSlugs, slugifyGroupName } from "@/lib/group-slugs";
import { GROUPS_PAGE_LIMITS } from "@/lib/validation/engineeringPages";
import type { GroupsPageValue, GroupValue } from "@/lib/validation";

type Member = GroupValue["members"][number];

const newGroup = (): GroupValue => ({
  name: "",
  slug: "",
  category: "",
  description: "",
  image: "",
  gallery: [],
  convenor: "",
  convenorRole: "",
  email: "",
  members: [],
  activities: [],
});

/** Add/remove/replace editor for a group's event-photo gallery. */
function GalleryEditor({
  values,
  onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const max = GROUPS_PAGE_LIMITS.galleryMax;
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="admin-label mb-0">Gallery (shown in the sidebar)</span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium text-gray-400">
            {values.length} / {max}
          </span>
          <button
            type="button"
            onClick={() => onChange([...values, ""])}
            disabled={values.length >= max}
            className="admin-btn admin-btn-outline admin-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={14} /> Add photo
          </button>
        </div>
      </div>

      {values.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
          No gallery photos. Add up to {max}.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {values.map((url, i) => (
            <div
              key={i}
              className="relative rounded-lg border border-gray-200 p-3"
            >
              <button
                type="button"
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                aria-label={`Remove photo ${i + 1}`}
                className="admin-btn admin-btn-danger admin-btn-sm absolute top-2 right-2 z-10"
              >
                <Trash2 size={13} />
              </button>
              <ImageUploadInput
                label={`Photo ${i + 1}`}
                ratio="card"
                value={url}
                onChange={(next) =>
                  onChange(values.map((v, j) => (j === i ? next : v)))
                }
                hideUrlField
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Inspector title for a section key, including the per-entry `group:N` keys. */
export function groupsSectionTitle(
  section: string,
  data: GroupsPageValue,
  variant: GroupsVariant,
): string {
  const meta = GROUPS_VARIANT_META[variant];
  if (section.startsWith("group:")) {
    const i = Number(section.slice("group:".length));
    return data.groups[i]?.name?.trim() || `Untitled ${meta.singular}`;
  }
  if (section === "groups") return `All ${meta.sectionLabel}`;
  if (section === "hero") return "Hero";
  if (section === "intro") return "Introduction";
  return "Section";
}

/** Editor for one entry — the form behind a card click in the live preview. */
function GroupFields({
  group,
  meta,
  variant,
  basePath,
  resolvedSlug,
  onChange,
}: {
  group: GroupValue;
  meta: GroupsVariantMeta;
  variant: GroupsVariant;
  basePath: string;
  resolvedSlug: string;
  onChange: (next: GroupValue) => void;
}) {
  const autoSlug = slugifyGroupName(group.name || "");
  return (
    <div className="space-y-1">
      <TextInput
        label="Name"
        value={group.name}
        onChange={(e) => onChange({ ...group, name: e.target.value })}
      />
      <TextInput
        label="Category"
        value={group.category}
        placeholder={
          variant === "clubs" ? "Technical Clubs" : "Statutory Committees"
        }
        hint="Entries sharing a category are grouped under one heading, in the order they first appear. Leave blank for an ungrouped card."
        onChange={(e) => onChange({ ...group, category: e.target.value })}
      />
      <TextInput
        label="URL Slug (optional)"
        value={group.slug}
        placeholder={autoSlug || "auto-generated-from-name"}
        hint={`Page URL: ${basePath}/${resolvedSlug || "…"} — leave blank to follow the name. Set it only to keep an existing link working after a rename.`}
        onChange={(e) => onChange({ ...group, slug: e.target.value })}
      />
      <TextArea
        label="Description"
        rows={4}
        value={group.description}
        onChange={(e) => onChange({ ...group, description: e.target.value })}
      />
      <ImageUploadInput
        label="Logo / Photo"
        ratio="square"
        value={group.image}
        onChange={(image) => onChange({ ...group, image })}
        hideUrlField
      />
      <GalleryEditor
        values={group.gallery ?? []}
        onChange={(gallery) => onChange({ ...group, gallery })}
      />
      <TextInput
        label={meta.convenorFallback}
        value={group.convenor}
        onChange={(e) => onChange({ ...group, convenor: e.target.value })}
      />
      <TextInput
        label="Their Designation"
        value={group.convenorRole}
        placeholder={meta.convenorFallback}
        onChange={(e) => onChange({ ...group, convenorRole: e.target.value })}
      />
      <TextInput
        label="Contact Email (optional)"
        value={group.email}
        placeholder="club@jct.ac.in"
        onChange={(e) => onChange({ ...group, email: e.target.value })}
      />

      <div className="admin-label mt-4 mb-2 border-t border-gray-100 pt-3">
        {meta.membersLabel}
      </div>
      <ItemsEditor
        items={group.members as unknown as Record<string, unknown>[]}
        onChange={(v) =>
          onChange({ ...group, members: v as unknown as Member[] })
        }
        fields={[
          { key: "name", label: "Name", placeholder: "Dr. K. Geetha" },
          { key: "role", label: "Designation", placeholder: "Member" },
          {
            key: "dept",
            label: "Department / Affiliation",
            placeholder: "Associate Professor - S&H",
          },
          { key: "contact", label: "Contact", placeholder: "9789650151" },
        ]}
        emptyItem={{ name: "", role: "", dept: "", contact: "" }}
        addLabel="Add member"
      />

      <StringList
        label={meta.activitiesLabel}
        values={group.activities}
        onChange={(activities) => onChange({ ...group, activities })}
        placeholder={variant === "clubs" ? "Hackathons" : "Grievance redressal"}
      />
    </div>
  );
}

export function GroupsSectionInspector({
  section,
  variant,
  institution = "engineering",
  data,
  onChange,
}: {
  section: string;
  variant: GroupsVariant;
  /** Drives the "Page URL" hint on the slug field. */
  institution?: GroupsInstitution;
  data: GroupsPageValue;
  onChange: (next: GroupsPageValue) => void;
}) {
  const meta = GROUPS_VARIANT_META[variant];
  const basePath = groupsBasePath(variant, institution);
  const patch = (p: Partial<GroupsPageValue>) => onChange({ ...data, ...p });
  const slugs = resolveGroupSlugs(data.groups);

  // One entry, opened by clicking its card in the live preview.
  if (section.startsWith("group:")) {
    const idx = Number(section.slice("group:".length));
    const group = data.groups[idx];
    if (!group) {
      return (
        <p className="text-sm text-gray-500">
          This entry no longer exists. Re-open the inspector.
        </p>
      );
    }
    return (
      <GroupFields
        group={group}
        meta={meta}
        variant={variant}
        basePath={basePath}
        resolvedSlug={slugs[idx]}
        onChange={(next) =>
          patch({
            groups: data.groups.map((g, j) => (j === idx ? next : g)),
          })
        }
      />
    );
  }

  switch (section) {
    case "hero":
      return (
        <>
          <TextInput
            label="Hero Title"
            value={data.hero.title}
            placeholder={meta.defaultHeroTitle}
            onChange={(e) =>
              patch({ hero: { ...data.hero, title: e.target.value } })
            }
          />
          <TextArea
            label="Hero Subtitle"
            rows={3}
            value={data.hero.subtitle}
            onChange={(e) =>
              patch({ hero: { ...data.hero, subtitle: e.target.value } })
            }
          />
        </>
      );

    case "intro":
      return (
        <TextAreaList
          label="Introduction Paragraphs"
          values={data.intro}
          onChange={(intro) => patch({ intro })}
          placeholder={`A paragraph introducing the ${meta.breadcrumb.toLowerCase()}…`}
        />
      );

    case "groups":
      return (
        <>
          <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Add, remove, and reorder entries here. To edit one in detail, click
            its card in the preview instead.
          </p>
          <Repeater<GroupValue>
            label={meta.sectionLabel}
            items={data.groups}
            onChange={(groups) => patch({ groups })}
            newItem={newGroup}
            renderItem={(item, i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Name"
                  value={item.name}
                  onChange={(e) => oc({ ...item, name: e.target.value })}
                />
                <TextInput
                  label="Category"
                  value={item.category}
                  placeholder={
                    variant === "clubs"
                      ? "Technical Clubs"
                      : "Statutory Committees"
                  }
                  onChange={(e) => oc({ ...item, category: e.target.value })}
                />
                <p className="pt-1 text-xs text-gray-400">
                  {item.members.length} {meta.membersLabel.toLowerCase()} ·{" "}
                  <span className="font-mono">/{slugs[i]}</span>
                </p>
              </div>
            )}
          />
        </>
      );

    default:
      return null;
  }
}
