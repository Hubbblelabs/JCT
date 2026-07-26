"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LivePageEditor } from "@/components/admin/LivePageEditor";
import { GroupsPageLayout } from "@/components/layout/GroupsPageLayout";
import {
  GROUPS_INSTITUTION_LABELS,
  GROUPS_SECTION_LABELS,
  GROUPS_SECTION_ORDER,
  GROUPS_VARIANT_META,
  groupsBasePath,
  type GroupsInstitution,
} from "@/lib/groups-meta";
import {
  GroupsSectionInspector,
  groupsSectionTitle,
} from "@/components/admin/GroupsSectionInspector";
import { GroupsPageSchema } from "@/lib/validation";
import type { GroupsPageValue } from "@/lib/validation";

const LABELS = {
  ...GROUPS_SECTION_LABELS,
  groups: GROUPS_VARIANT_META.committees.sectionLabel,
};

/**
 * Colleges that publish a committees page, keyed by `?college=`. Engineering is
 * the default so the long-standing bare `/admin/committees` link keeps working.
 */
const CONFIG_KEYS: Partial<Record<GroupsInstitution, string>> = {
  engineering: "engineeringCommittees",
  polytechnic: "polytechnicCommittees",
};

function CommitteesEditorInner() {
  const searchParams = useSearchParams();
  const param = searchParams.get("college") ?? "engineering";
  const institution: GroupsInstitution =
    param in CONFIG_KEYS ? (param as GroupsInstitution) : "engineering";
  const configKey = CONFIG_KEYS[institution]!;

  return (
    <LivePageEditor<GroupsPageValue>
      // Remount on a college switch so the editor reloads that college's draft
      // instead of keeping the previous one in state.
      key={institution}
      configKey={configKey}
      publicPath={groupsBasePath("committees", institution)}
      title="Committees Page Editor"
      subtitle={`${GROUPS_INSTITUTION_LABELS[institution]} — click any section to edit`}
      emptyValue={() => GroupsPageSchema.parse({})}
      sectionOrder={GROUPS_SECTION_ORDER}
      sectionLabels={LABELS}
      sectionTitle={(section, data) =>
        groupsSectionTitle(section, data, "committees")
      }
      initialSection="hero"
      renderPreview={({ data, onEditSection }) => (
        <GroupsPageLayout
          data={data}
          variant="committees"
          institution={institution}
          editable
          onEditSection={onEditSection}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <GroupsSectionInspector
          section={section}
          variant="committees"
          institution={institution}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}

// useSearchParams needs a Suspense boundary in Next 16.
export default function CommitteesEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-28">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <CommitteesEditorInner />
    </Suspense>
  );
}
