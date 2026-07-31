"use client";

import {
  Field,
  FormGrid,
  TextInput,
  TextArea,
  StringList,
  TextAreaList,
  ImageUploadInput,
  ItemsEditor,
  Repeater,
} from "@/components/admin/inputs";
import { ABOUT_NAV_DEFAULTS } from "@/components/layout/AboutPageLayout";
import type { AboutPageValue } from "@/lib/validation";
import type { SidebarNavItemRaw } from "@/lib/sidebar-nav";
import { SidebarNavEditor } from "@/components/admin/SidebarNavEditor";
import { PageBodySectionsEditor } from "@/components/admin/PageBodySectionsEditor";
import type { PageBodySection } from "@/lib/validation";

type Stat = AboutPageValue["about"]["stats"][number];
type MgmtMember = AboutPageValue["management"]["members"][number];
type HodMember = AboutPageValue["hod"]["members"][number];
type CouncilMember = AboutPageValue["governingCouncil"]["members"][number];
type BoardMember = AboutPageValue["planningBoard"]["members"][number];
type ValueItem = AboutPageValue["coreValues"][number];
type Accreditation = AboutPageValue["accreditations"][number];
type Highlight = AboutPageValue["campusHighlights"][number];
type QuickFact = AboutPageValue["sidebar"]["quickFacts"][number];

export function AboutSectionInspector({
  section,
  data,
  onChange,
}: {
  section: string;
  data: AboutPageValue;
  onChange: (next: AboutPageValue) => void;
}) {
  const patch = (p: Partial<AboutPageValue>) => onChange({ ...data, ...p });

  // Custom in-page section: edit its sidebar label + content blocks.
  if (section.startsWith("custom:")) {
    const anchor = section.slice("custom:".length);
    const items = data.sidebar.navItems ?? [];
    const idx = items.findIndex((it) => (it.id || "") === anchor);
    if (idx === -1) {
      return (
        <p className="text-sm text-gray-500">
          This section no longer exists. Re-open the inspector.
        </p>
      );
    }
    const item = items[idx];
    const updateItem = (next: Partial<typeof item>) =>
      patch({
        sidebar: {
          ...data.sidebar,
          navItems: items.map((it, j) => (j === idx ? { ...it, ...next } : it)),
        },
      });
    return (
      <FormGrid>
        <TextInput
          label="Sidebar Label"
          span={5}
          value={item.label ?? ""}
          placeholder="Section name shown in the sidebar"
          onChange={(e) => updateItem({ label: e.target.value })}
        />
        <Field label="Content Blocks" span="full">
          <PageBodySectionsEditor
            value={(item.blocks ?? []) as PageBodySection[]}
            onChange={(blocks) => updateItem({ blocks })}
            allowedTypes={["heading", "text", "image", "list", "cards"]}
          />
        </Field>
      </FormGrid>
    );
  }

  switch (section) {
    case "hero":
      return (
        <FormGrid>
          <TextInput
            label="Hero Title"
            span={5}
            value={data.hero.title}
            onChange={(e) =>
              patch({ hero: { ...data.hero, title: e.target.value } })
            }
          />
          <TextArea
            label="Hero Subtitle"
            span={7}
            rows={3}
            value={data.hero.subtitle}
            onChange={(e) =>
              patch({ hero: { ...data.hero, subtitle: e.target.value } })
            }
          />
        </FormGrid>
      );

    case "about":
      return (
        <FormGrid>
          <TextAreaList
            label="Paragraphs"
            span="full"
            values={data.about.paragraphs}
            onChange={(paragraphs) =>
              patch({ about: { ...data.about, paragraphs } })
            }
            placeholder="A paragraph about the institution…"
          />
          <Field label="Statistics" span="full">
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
              cardSpan={4}
            />
          </Field>
        </FormGrid>
      );

    case "visionMission":
      return (
        <FormGrid>
          <TextArea
            label="Vision Statement"
            span={5}
            rows={6}
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
            span={7}
            values={data.visionMission.missionPoints}
            onChange={(missionPoints) =>
              patch({
                visionMission: { ...data.visionMission, missionPoints },
              })
            }
            placeholder="A mission point…"
          />
        </FormGrid>
      );

    case "qualityPolicy": {
      // Absent on documents stored before this section existed.
      const qp = {
        intro: data.qualityPolicy?.intro ?? "",
        points: data.qualityPolicy?.points ?? [],
      };
      return (
        <FormGrid>
          <TextArea
            label="Intro (optional — shown above the policy points)"
            span="full"
            rows={2}
            value={qp.intro}
            onChange={(e) =>
              patch({ qualityPolicy: { ...qp, intro: e.target.value } })
            }
          />
          <TextAreaList
            label="Policy Points"
            span="full"
            values={qp.points}
            onChange={(points) => patch({ qualityPolicy: { ...qp, points } })}
            placeholder="A quality policy statement…"
          />
        </FormGrid>
      );
    }

    case "planningBoard": {
      const pb = {
        paragraphs: data.planningBoard?.paragraphs ?? [],
        members: data.planningBoard?.members ?? [],
      };
      return (
        <FormGrid>
          <TextAreaList
            label="Description Paragraphs"
            span="full"
            values={pb.paragraphs}
            onChange={(paragraphs) =>
              patch({ planningBoard: { ...pb, paragraphs } })
            }
            placeholder="What this committee does…"
          />
          <Field label="Members" span="full">
            <ItemsEditor
              items={pb.members as unknown as Record<string, unknown>[]}
              onChange={(v) =>
                patch({
                  planningBoard: {
                    ...pb,
                    members: v as unknown as BoardMember[],
                  },
                })
              }
              fields={[
                {
                  key: "name",
                  label: "Name",
                  placeholder: "Dr. MANOHARAN S",
                  span: 3,
                },
                {
                  key: "position",
                  label: "Position",
                  placeholder: "Chairman",
                  span: 3,
                },
                {
                  key: "qualification",
                  label: "Qualification",
                  placeholder: "Ph.D. — Electrical Machines",
                  span: 3,
                },
                {
                  key: "category",
                  label: "Category",
                  placeholder: "Senior faculty member of the College",
                  span: 3,
                },
              ]}
              emptyItem={{
                name: "",
                position: "",
                category: "",
                qualification: "",
              }}
              addLabel="Add member"
            />
          </Field>
        </FormGrid>
      );
    }

    case "principal":
      // Identity → contact → the message itself, as the card reads.
      return (
        <FormGrid>
          <TextInput
            label="Name"
            span={4}
            value={data.principal.name}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, name: e.target.value },
              })
            }
          />
          <TextInput
            label="Role"
            span={4}
            value={data.principal.role}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, role: e.target.value },
              })
            }
          />
          <TextInput
            label="Institution"
            span={4}
            value={data.principal.institution}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, institution: e.target.value },
              })
            }
          />
          <TextInput
            label="Email"
            span={4}
            value={data.principal.email}
            placeholder="principal@jct.ac.in"
            onChange={(e) =>
              patch({
                principal: { ...data.principal, email: e.target.value },
              })
            }
          />
          <TextInput
            label="LinkedIn URL"
            span={8}
            value={data.principal.linkedin}
            placeholder="https://linkedin.com/in/…"
            onChange={(e) =>
              patch({
                principal: { ...data.principal, linkedin: e.target.value },
              })
            }
          />
          <ImageUploadInput
            label="Photo"
            span="full"
            ratio="portrait"
            value={data.principal.image}
            onChange={(image) =>
              patch({ principal: { ...data.principal, image } })
            }
            hideUrlField
          />
          <TextArea
            label="Pull Quote"
            span={4}
            rows={5}
            value={data.principal.quote}
            onChange={(e) =>
              patch({
                principal: { ...data.principal, quote: e.target.value },
              })
            }
          />
          <TextAreaList
            label="Message Paragraphs"
            span={8}
            values={data.principal.messages}
            onChange={(messages) =>
              patch({ principal: { ...data.principal, messages } })
            }
            placeholder="A paragraph of the principal's message…"
          />
        </FormGrid>
      );

    case "management":
      return (
        <FormGrid>
          <TextInput
            label="Heading"
            span={5}
            value={data.management.tagline}
            placeholder="Great Minds. Passionate Leaders. One Vision."
            onChange={(e) =>
              patch({
                management: { ...data.management, tagline: e.target.value },
              })
            }
          />
          <TextArea
            label="Section Description"
            span={7}
            rows={2}
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
            span="full"
            itemSpan={6}
            items={data.management.members}
            onChange={(members) =>
              patch({ management: { ...data.management, members } })
            }
            onItemRemove={undefined}
            newItem={() => ({ name: "", role: "", image: "", bio: "" })}
            renderItem={(item, _i, oc) => (
              <FormGrid tight>
                <TextInput
                  label="Name"
                  span={6}
                  value={item.name}
                  onChange={(e) => oc({ ...item, name: e.target.value })}
                />
                <TextInput
                  label="Role"
                  span={6}
                  value={item.role}
                  onChange={(e) => oc({ ...item, role: e.target.value })}
                />
                <ImageUploadInput
                  label="Photo"
                  span="full"
                  ratio="portrait"
                  value={item.image}
                  onChange={(image) => oc({ ...item, image })}
                  hideUrlField
                />
                <TextArea
                  label="Bio"
                  span="full"
                  rows={3}
                  value={item.bio}
                  onChange={(e) => oc({ ...item, bio: e.target.value })}
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );

    case "hod":
      return (
        <FormGrid>
          <TextArea
            label="Section Description"
            span="full"
            rows={2}
            value={data.hod.description}
            onChange={(e) =>
              patch({ hod: { ...data.hod, description: e.target.value } })
            }
          />
          <Repeater<HodMember>
            label="Heads of Department"
            span="full"
            itemSpan={6}
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
              <FormGrid tight>
                <TextInput
                  label="Name"
                  span={6}
                  value={item.name}
                  onChange={(e) => oc({ ...item, name: e.target.value })}
                />
                <TextInput
                  label="Designation"
                  span={6}
                  value={item.designation}
                  onChange={(e) => oc({ ...item, designation: e.target.value })}
                />
                <TextInput
                  label="Department"
                  span={8}
                  value={item.dept}
                  onChange={(e) => oc({ ...item, dept: e.target.value })}
                />
                <TextInput
                  label="Abbreviation"
                  span={4}
                  value={item.abbr}
                  onChange={(e) => oc({ ...item, abbr: e.target.value })}
                />
                <ImageUploadInput
                  label="Avatar"
                  span="full"
                  ratio="square"
                  value={item.avatar}
                  onChange={(avatar) => oc({ ...item, avatar })}
                  hideUrlField
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );

    case "governingCouncil":
      return (
        <FormGrid>
          <TextArea
            label="Section Description"
            span="full"
            rows={2}
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
          <Field label="Council Members" span="full">
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
                { key: "name", label: "Member", span: 5 },
                { key: "category", label: "Category", span: 7 },
              ]}
              emptyItem={{ name: "", category: "" }}
              addLabel="Add member"
              cardSpan={6}
            />
          </Field>
        </FormGrid>
      );

    case "coreValues":
      return (
        <FormGrid>
          <Field
            label="Core Values"
            span="full"
            hint="Icons are assigned automatically by position."
          >
            <ItemsEditor
              items={data.coreValues as unknown as Record<string, unknown>[]}
              onChange={(v) =>
                patch({ coreValues: v as unknown as ValueItem[] })
              }
              fields={[
                { key: "title", label: "Title", span: "full" },
                {
                  key: "desc",
                  label: "Description",
                  type: "textarea",
                  span: "full",
                },
              ]}
              emptyItem={{ title: "", desc: "" }}
              addLabel="Add value"
              cardSpan={4}
            />
          </Field>
        </FormGrid>
      );

    case "accreditations":
      return (
        <Repeater<Accreditation>
          label="Accreditations"
          itemSpan={4}
          items={data.accreditations}
          onChange={(accreditations) => patch({ accreditations })}
          onItemRemove={undefined}
          newItem={() => ({ name: "", desc: "", logo: "" })}
          renderItem={(item, _i, oc) => (
            <FormGrid tight>
              <TextInput
                label="Name"
                span="full"
                value={item.name}
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Description"
                span="full"
                value={item.desc}
                onChange={(e) => oc({ ...item, desc: e.target.value })}
              />
              <ImageUploadInput
                label="Logo"
                span="full"
                ratio="square"
                value={item.logo}
                onChange={(logo) => oc({ ...item, logo })}
                hideUrlField
              />
            </FormGrid>
          )}
        />
      );

    case "campusHighlights":
      return (
        <FormGrid>
          <Field
            label="Campus Highlights"
            span="full"
            hint="Icons are assigned automatically by position."
          >
            <ItemsEditor
              items={
                data.campusHighlights as unknown as Record<string, unknown>[]
              }
              onChange={(v) =>
                patch({ campusHighlights: v as unknown as Highlight[] })
              }
              fields={[
                { key: "title", label: "Title", span: "full" },
                {
                  key: "desc",
                  label: "Description",
                  type: "textarea",
                  span: "full",
                },
              ]}
              emptyItem={{ title: "", desc: "" }}
              addLabel="Add highlight"
              cardSpan={4}
            />
          </Field>
        </FormGrid>
      );

    case "whyJct":
      return (
        <StringList
          label="Why Choose JCT — Points"
          columns
          values={data.whyJct}
          onChange={(whyJct) => patch({ whyJct })}
          placeholder="A reason to choose JCT…"
        />
      );

    case "sidebar":
      // Quick facts, then the CTA block, then the nav list — top to bottom of
      // the rendered sidebar.
      return (
        <FormGrid>
          <Field label="Quick Facts" span="full">
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
              cardSpan={4}
            />
          </Field>
          <TextInput
            label="Counselling Code"
            span={3}
            hint="Leave blank to hide."
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
          <TextInput
            label="CTA Button Label"
            span={4}
            value={data.sidebar.ctaLabel}
            onChange={(e) =>
              patch({
                sidebar: { ...data.sidebar, ctaLabel: e.target.value },
              })
            }
          />
          <TextInput
            label="CTA Button Link"
            span={5}
            value={data.sidebar.ctaHref}
            onChange={(e) =>
              patch({
                sidebar: { ...data.sidebar, ctaHref: e.target.value },
              })
            }
            placeholder="https://admissions.jct.ac.in/"
          />
          <Field label="Sidebar Navigation Items" span="full">
            <SidebarNavEditor
              defaults={ABOUT_NAV_DEFAULTS}
              value={data.sidebar.navItems as SidebarNavItemRaw[] | undefined}
              onChange={(navItems) =>
                patch({
                  sidebar: {
                    ...data.sidebar,
                    navItems: navItems as typeof data.sidebar.navItems,
                  },
                })
              }
            />
          </Field>
        </FormGrid>
      );

    default:
      return null;
  }
}
