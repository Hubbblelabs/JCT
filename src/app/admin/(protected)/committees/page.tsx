"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  GroupsPageLayout,
  GROUPS_SECTION_LABELS,
  GROUPS_SECTION_ORDER,
  GROUPS_VARIANT_META,
  type GroupsEditableSection,
} from "@/components/layout/GroupsPageLayout";
import { GroupsSectionInspector } from "@/components/admin/GroupsSectionInspector";
import { GroupsPageSchema } from "@/lib/validation";
import type { GroupsPageValue } from "@/lib/validation";

const LABELS = {
  ...GROUPS_SECTION_LABELS,
  groups: GROUPS_VARIANT_META.committees.sectionLabel,
};

export default function CommitteesEditorPage() {
  return (
    <LivePageEditor<GroupsPageValue>
      configKey="engineeringCommittees"
      publicPath="/institutions/engineering/committees"
      title="Committees Page Editor"
      subtitle="Engineering — click any section to edit"
      emptyValue={() => GroupsPageSchema.parse({})}
      sectionOrder={GROUPS_SECTION_ORDER}
      sectionLabels={LABELS}
      initialSection="hero"
      renderPreview={({ data, onEditSection }) => (
        <GroupsPageLayout
          data={data}
          variant="committees"
          editable
          onEditSection={onEditSection as (s: GroupsEditableSection) => void}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <GroupsSectionInspector
          section={section}
          variant="committees"
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}
