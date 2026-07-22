"use client";

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
  type GroupsVariant,
} from "@/components/layout/GroupsPageLayout";
import type { GroupsPageValue, GroupValue } from "@/lib/validation";

type Member = GroupValue["members"][number];

export function GroupsSectionInspector({
  section,
  variant,
  data,
  onChange,
}: {
  section: string;
  variant: GroupsVariant;
  data: GroupsPageValue;
  onChange: (next: GroupsPageValue) => void;
}) {
  const meta = GROUPS_VARIANT_META[variant];
  const patch = (p: Partial<GroupsPageValue>) => onChange({ ...data, ...p });

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
        <Repeater<GroupValue>
          label={meta.sectionLabel}
          items={data.groups}
          onChange={(groups) => patch({ groups })}
          newItem={() => ({
            name: "",
            category: "",
            description: "",
            image: "",
            convenor: "",
            convenorRole: "",
            email: "",
            members: [],
            activities: [],
          })}
          renderItem={(item, _i, oc) => (
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
                  variant === "clubs" ? "Technical Clubs" : "Statutory Committees"
                }
                hint="Entries sharing a category are grouped under one heading, in the order they first appear. Leave blank for an ungrouped card."
                onChange={(e) => oc({ ...item, category: e.target.value })}
              />
              <TextArea
                label="Description"
                rows={3}
                value={item.description}
                onChange={(e) => oc({ ...item, description: e.target.value })}
              />
              <ImageUploadInput
                label="Logo / Photo"
                ratio="square"
                value={item.image}
                onChange={(image) => oc({ ...item, image })}
                hideUrlField
              />
              <TextInput
                label={meta.convenorFallback}
                value={item.convenor}
                onChange={(e) => oc({ ...item, convenor: e.target.value })}
              />
              <TextInput
                label="Their Designation"
                value={item.convenorRole}
                placeholder={meta.convenorFallback}
                onChange={(e) => oc({ ...item, convenorRole: e.target.value })}
              />
              <TextInput
                label="Contact Email (optional)"
                value={item.email}
                placeholder="club@jct.ac.in"
                onChange={(e) => oc({ ...item, email: e.target.value })}
              />

              <div className="admin-label mt-4 mb-2 border-t border-gray-100 pt-3">
                {meta.membersLabel}
              </div>
              <ItemsEditor
                items={item.members as unknown as Record<string, unknown>[]}
                onChange={(v) =>
                  oc({ ...item, members: v as unknown as Member[] })
                }
                fields={[
                  { key: "name", label: "Name", placeholder: "Dr. K. Geetha" },
                  { key: "role", label: "Category / Role", placeholder: "Member" },
                  { key: "dept", label: "Department" },
                  { key: "contact", label: "Contact", placeholder: "9789650151" },
                ]}
                emptyItem={{ name: "", role: "", dept: "", contact: "" }}
                addLabel="Add member"
              />

              <StringList
                label={meta.activitiesLabel}
                values={item.activities}
                onChange={(activities) => oc({ ...item, activities })}
                placeholder={
                  variant === "clubs" ? "Hackathons" : "Grievance redressal"
                }
              />
            </div>
          )}
        />
      );

    default:
      return null;
  }
}
