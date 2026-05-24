"use client";

import {
  TextInput,
  TextArea,
  StringList,
  TextAreaList,
  ImageUploadInput,
  ItemsEditor,
  Repeater,
} from "@/components/admin/inputs";
import type { AboutEditableSection } from "@/components/layout/AboutPageLayout";
import type { AboutPageValue } from "@/lib/validation";

type Stat = AboutPageValue["about"]["stats"][number];
type MgmtMember = AboutPageValue["management"]["members"][number];
type HodMember = AboutPageValue["hod"]["members"][number];
type CouncilMember = AboutPageValue["governingCouncil"]["members"][number];
type ValueItem = AboutPageValue["coreValues"][number];
type Accreditation = AboutPageValue["accreditations"][number];
type Highlight = AboutPageValue["campusHighlights"][number];
type QuickFact = AboutPageValue["sidebar"]["quickFacts"][number];

export function AboutSectionInspector({
  section,
  data,
  onChange,
}: {
  section: AboutEditableSection;
  data: AboutPageValue;
  onChange: (next: AboutPageValue) => void;
}) {
  const patch = (p: Partial<AboutPageValue>) => onChange({ ...data, ...p });

  switch (section) {
    case "hero":
      return (
        <>
          <TextInput
            label="Hero Title"
            value={data.hero.title}
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

    case "about":
      return (
        <>
          <TextAreaList
            label="Paragraphs"
            values={data.about.paragraphs}
            onChange={(paragraphs) =>
              patch({ about: { ...data.about, paragraphs } })
            }
            placeholder="A paragraph about the institution…"
          />
          <div className="admin-label mt-4 mb-2">Statistics</div>
          <ItemsEditor
            items={data.about.stats as unknown as Record<string, unknown>[]}
            onChange={(v) =>
              patch({
                about: { ...data.about, stats: v as unknown as Stat[] },
              })
            }
            fields={[
              { key: "value", label: "Value", placeholder: "98%" },
              { key: "label", label: "Label", placeholder: "Placement Rate" },
            ]}
            emptyItem={{ value: "", label: "" }}
            addLabel="Add statistic"
          />
        </>
      );

    case "visionMission":
      return (
        <>
          <TextArea
            label="Vision Statement"
            rows={4}
            value={data.visionMission.visionText}
            onChange={(e) =>
              patch({
                visionMission: {
                  ...data.visionMission,
                  visionText: e.target.value,
                },
              })
            }
          />
          <StringList
            label="Mission Points"
            values={data.visionMission.missionPoints}
            onChange={(missionPoints) =>
              patch({
                visionMission: { ...data.visionMission, missionPoints },
              })
            }
            placeholder="A mission point…"
          />
          <TextArea
            label="Quality Policy (optional — leave blank to hide)"
            rows={5}
            value={data.visionMission.qualityPolicy}
            onChange={(e) =>
              patch({
                visionMission: {
                  ...data.visionMission,
                  qualityPolicy: e.target.value,
                },
              })
            }
          />
        </>
      );

    case "principal":
      return (
        <>
          <TextInput
            label="Name"
            value={data.principal.name}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, name: e.target.value },
              })
            }
          />
          <TextInput
            label="Role"
            value={data.principal.role}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, role: e.target.value },
              })
            }
          />
          <TextInput
            label="Institution"
            value={data.principal.institution}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, institution: e.target.value },
              })
            }
          />
          <ImageUploadInput
            label="Photo"
            value={data.principal.image}
            onChange={(image) =>
              patch({ principal: { ...data.principal, image } })
            }
            hideUrlField
          />
          <TextArea
            label="Pull Quote"
            rows={3}
            value={data.principal.quote}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, quote: e.target.value },
              })
            }
          />
          <TextAreaList
            label="Message Paragraphs"
            values={data.principal.messages}
            onChange={(messages) =>
              patch({ principal: { ...data.principal, messages } })
            }
            placeholder="A paragraph of the principal's message…"
          />
        </>
      );

    case "management":
      return (
        <>
          <TextArea
            label="Section Description"
            rows={3}
            value={data.management.description}
            onChange={(e) =>
              patch({
                management: {
                  ...data.management,
                  description: e.target.value,
                },
              })
            }
          />
          <Repeater<MgmtMember>
            label="Management Members"
            items={data.management.members}
            onChange={(members) =>
              patch({ management: { ...data.management, members } })
            }
            onItemRemove={undefined}
            newItem={() => ({ name: "", role: "", image: "", bio: "" })}
            renderItem={(item, _i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Name"
                  value={item.name}
                  onChange={(e) => oc({ ...item, name: e.target.value })}
                />
                <TextInput
                  label="Role"
                  value={item.role}
                  onChange={(e) => oc({ ...item, role: e.target.value })}
                />
                <ImageUploadInput
                  label="Photo"
                  value={item.image}
                  onChange={(image) => oc({ ...item, image })}
                  hideUrlField
                />
                <TextArea
                  label="Bio"
                  rows={4}
                  value={item.bio}
                  onChange={(e) => oc({ ...item, bio: e.target.value })}
                />
              </div>
            )}
          />
        </>
      );

    case "hod":
      return (
        <>
          <TextArea
            label="Section Description"
            rows={3}
            value={data.hod.description}
            onChange={(e) =>
              patch({ hod: { ...data.hod, description: e.target.value } })
            }
          />
          <Repeater<HodMember>
            label="Heads of Department"
            items={data.hod.members}
            onChange={(members) => patch({ hod: { ...data.hod, members } })}
            onItemRemove={undefined}
            newItem={() => ({
              name: "",
              designation: "",
              dept: "",
              abbr: "",
              avatar: "",
            })}
            renderItem={(item, _i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Name"
                  value={item.name}
                  onChange={(e) => oc({ ...item, name: e.target.value })}
                />
                <TextInput
                  label="Designation"
                  value={item.designation}
                  onChange={(e) => oc({ ...item, designation: e.target.value })}
                />
                <TextInput
                  label="Department"
                  value={item.dept}
                  onChange={(e) => oc({ ...item, dept: e.target.value })}
                />
                <TextInput
                  label="Abbreviation"
                  value={item.abbr}
                  onChange={(e) => oc({ ...item, abbr: e.target.value })}
                />
                <ImageUploadInput
                  label="Avatar"
                  value={item.avatar}
                  onChange={(avatar) => oc({ ...item, avatar })}
                  hideUrlField
                />
              </div>
            )}
          />
        </>
      );

    case "governingCouncil":
      return (
        <>
          <TextArea
            label="Section Description"
            rows={3}
            value={data.governingCouncil.description}
            onChange={(e) =>
              patch({
                governingCouncil: {
                  ...data.governingCouncil,
                  description: e.target.value,
                },
              })
            }
          />
          <div className="admin-label mt-4 mb-2">Council Members</div>
          <ItemsEditor
            items={
              data.governingCouncil.members as unknown as Record<
                string,
                unknown
              >[]
            }
            onChange={(v) =>
              patch({
                governingCouncil: {
                  ...data.governingCouncil,
                  members: v as unknown as CouncilMember[],
                },
              })
            }
            fields={[
              { key: "name", label: "Member", span2: true },
              { key: "category", label: "Category", span2: true },
            ]}
            emptyItem={{ name: "", category: "" }}
            addLabel="Add member"
          />
        </>
      );

    case "coreValues":
      return (
        <>
          <div className="admin-label mb-2">Core Values</div>
          <ItemsEditor
            items={data.coreValues as unknown as Record<string, unknown>[]}
            onChange={(v) => patch({ coreValues: v as unknown as ValueItem[] })}
            fields={[
              { key: "title", label: "Title", span2: true },
              {
                key: "desc",
                label: "Description",
                type: "textarea",
                span2: true,
              },
            ]}
            emptyItem={{ title: "", desc: "" }}
            addLabel="Add value"
          />
          <p className="mt-2 text-xs text-gray-400">
            Icons are assigned automatically by position.
          </p>
        </>
      );

    case "accreditations":
      return (
        <Repeater<Accreditation>
          label="Accreditations"
          items={data.accreditations}
          onChange={(accreditations) => patch({ accreditations })}
          onItemRemove={undefined}
          newItem={() => ({ name: "", desc: "", logo: "" })}
          renderItem={(item, _i, oc) => (
            <div className="space-y-1">
              <TextInput
                label="Name"
                value={item.name}
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Description"
                value={item.desc}
                onChange={(e) => oc({ ...item, desc: e.target.value })}
              />
              <ImageUploadInput
                label="Logo"
                value={item.logo}
                onChange={(logo) => oc({ ...item, logo })}
                hideUrlField
              />
            </div>
          )}
        />
      );

    case "campusHighlights":
      return (
        <>
          <div className="admin-label mb-2">Campus Highlights</div>
          <ItemsEditor
            items={
              data.campusHighlights as unknown as Record<string, unknown>[]
            }
            onChange={(v) =>
              patch({ campusHighlights: v as unknown as Highlight[] })
            }
            fields={[
              { key: "title", label: "Title", span2: true },
              {
                key: "desc",
                label: "Description",
                type: "textarea",
                span2: true,
              },
            ]}
            emptyItem={{ title: "", desc: "" }}
            addLabel="Add highlight"
          />
          <p className="mt-2 text-xs text-gray-400">
            Icons are assigned automatically by position.
          </p>
        </>
      );

    case "whyJct":
      return (
        <StringList
          label="Why Choose JCT — Points"
          values={data.whyJct}
          onChange={(whyJct) => patch({ whyJct })}
          placeholder="A reason to choose JCT…"
        />
      );

    case "sidebar":
      return (
        <>
          <div className="admin-label mb-2">Quick Facts</div>
          <ItemsEditor
            items={
              data.sidebar.quickFacts as unknown as Record<string, unknown>[]
            }
            onChange={(v) =>
              patch({
                sidebar: {
                  ...data.sidebar,
                  quickFacts: v as unknown as QuickFact[],
                },
              })
            }
            fields={[
              { key: "label", label: "Label", placeholder: "Established" },
              { key: "value", label: "Value", placeholder: "2009" },
            ]}
            emptyItem={{ label: "", value: "" }}
            addLabel="Add quick fact"
          />
          <div className="mt-4">
            <TextInput
              label="Counselling Code (optional — leave blank to hide)"
              value={data.sidebar.counsellingCode}
              onChange={(e) =>
                patch({
                  sidebar: {
                    ...data.sidebar,
                    counsellingCode: e.target.value,
                  },
                })
              }
            />
          </div>
          <TextInput
            label="CTA Button Label"
            value={data.sidebar.ctaLabel}
            onChange={(e) =>
              patch({
                sidebar: { ...data.sidebar, ctaLabel: e.target.value },
              })
            }
          />
          <TextInput
            label="CTA Button Link"
            value={data.sidebar.ctaHref}
            onChange={(e) =>
              patch({
                sidebar: { ...data.sidebar, ctaHref: e.target.value },
              })
            }
            placeholder="https://admissions.jct.ac.in/"
          />
        </>
      );

    default:
      return null;
  }
}
