"use client";

import { LivePageEditor } from "@/components/admin/LivePageEditor";
import { GroupsPageLayout } from "@/components/layout/GroupsPageLayout";
import {
  GROUPS_SECTION_LABELS,
  GROUPS_SECTION_ORDER,
  GROUPS_VARIANT_META,
} from "@/lib/groups-meta";
import {
  GroupsSectionInspector,
  groupsSectionTitle,
} from "@/components/admin/GroupsSectionInspector";
import { GroupsPageSchema } from "@/lib/validation";
import type { GroupsPageValue } from "@/lib/validation";

const LABELS = {
  ...GROUPS_SECTION_LABELS,
  groups: GROUPS_VARIANT_META.clubs.sectionLabel,
};

export default function ClubsEditorPage() {
  return (
    <LivePageEditor<GroupsPageValue>
      configKey="engineeringClubs"
      publicPath="/institutions/engineering/clubs-and-cells"
      title="Clubs & Cells Page Editor"
      subtitle="Engineering — click any section to edit"
      emptyValue={() => GroupsPageSchema.parse({})}
      sectionOrder={GROUPS_SECTION_ORDER}
      sectionLabels={LABELS}
      sectionTitle={(section, data) =>
        groupsSectionTitle(section, data, "clubs")
      }
      initialSection="hero"
      renderPreview={({ data, onEditSection }) => (
        <GroupsPageLayout
          data={data}
          variant="clubs"
          editable
          onEditSection={onEditSection}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <GroupsSectionInspector
          section={section}
          variant="clubs"
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}
