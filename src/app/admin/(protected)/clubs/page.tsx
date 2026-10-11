"use client";

import { Suspense, useEffect, useState } from "react";
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
import { loadEditableConfig } from "@/lib/admin-site-config";
import {
  FINE_ARTS_CLUB_KEY,
  POLYTECHNIC_CLUBS_KEY,
  polytechnicClubsStart,
} from "@/lib/polytechnic-clubs";
import { GroupsPageSchema } from "@/lib/validation";
import type { GroupsPageValue } from "@/lib/validation";

const LABELS = {
  ...GROUPS_SECTION_LABELS,
  groups: GROUPS_VARIANT_META.clubs.sectionLabel,
};

/**
 * Colleges that publish a Clubs & Cells page, keyed by `?college=`. Engineering
 * is the default so the long-standing bare `/admin/clubs` link keeps working.
 */
const CONFIG_KEYS: Partial<Record<GroupsInstitution, string>> = {
  engineering: "engineeringClubs",
  polytechnic: POLYTECHNIC_CLUBS_KEY,
};

/**
 * What a page that has never been saved opens with. For the Polytechnic that
 * is its old Fine Arts Club page, carried over as the first club — read here
 * once, before the editor mounts, because the editor wants it synchronously.
 */
function useStartingValue(institution: GroupsInstitution) {
  const [start, setStart] = useState<GroupsPageValue | null>(
    institution === "polytechnic" ? null : GroupsPageSchema.parse({}),
  );
  useEffect(() => {
    if (institution !== "polytechnic") {
      setStart(GroupsPageSchema.parse({}));
      return;
    }
    let cancelled = false;
    setStart(null);
    loadEditableConfig(FINE_ARTS_CLUB_KEY)
      .then((res) => !cancelled && setStart(polytechnicClubsStart(res.value)))
      .catch(() => !cancelled && setStart(polytechnicClubsStart(null)));
    return () => {
      cancelled = true;
    };
  }, [institution]);
  return start;
}

function ClubsEditorInner() {
  const searchParams = useSearchParams();
  const param = searchParams.get("college") ?? "engineering";
  const institution: GroupsInstitution =
    param in CONFIG_KEYS ? (param as GroupsInstitution) : "engineering";
  const configKey = CONFIG_KEYS[institution]!;
  const start = useStartingValue(institution);

  if (!start) {
    return (
      <div className="flex items-center justify-center py-28">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <LivePageEditor<GroupsPageValue>
      // Remount on a college switch so the editor reloads that college's draft
      // instead of keeping the previous one in state.
      key={institution}
      configKey={configKey}
      publicPath={groupsBasePath("clubs", institution)}
      title={`${GROUPS_INSTITUTION_LABELS[institution]} — Clubs & Cells`}
      subtitle="Click any part of the page to edit it. Save draft keeps changes private; Publish puts them on the live site."
      sectionHelp={{
        hero: "The banner at the top of the page: title and subtitle.",
        intro: "The paragraphs introducing the clubs.",
        groups:
          "Add, remove or reorder clubs, or show and hide them. Click one on the page to edit its details, members, photos and extra content.",
      }}
      emptyValue={() => start}
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
          institution={institution}
          editable
          onEditSection={onEditSection}
        />
      )}
      renderInspector={({ section, data, onChange }) => (
        <GroupsSectionInspector
          section={section}
          variant="clubs"
          institution={institution}
          data={data}
          onChange={onChange}
        />
      )}
    />
  );
}

export default function ClubsEditorPage() {
  return (
    <Suspense fallback={null}>
      <ClubsEditorInner />
    </Suspense>
  );
}
