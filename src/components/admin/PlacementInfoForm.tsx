"use client";

import {
  TextInput,
  TextArea,
  Repeater,
  ImageUploadInput,
  Accordion,
} from "@/components/admin/inputs";
import { SidebarNavEditor } from "@/components/admin/SidebarNavEditor";
import { useDeferredUploads } from "@/lib/deferred-uploads";
import { PLACEMENT_NAV_DEFAULTS } from "@/components/layout/PlacementsPageLayout";
import type { SidebarNavItemRaw } from "@/lib/sidebar-nav";

/* Mirrors PlacementInfoSchema (src/lib/validation/placementInfo.ts). Kept as a
 * local shape because PageContentShell hands sections an untyped value. */
export type MouItem = {
  organization: string;
  logo: string;
  purpose: string;
  signedOn: string;
  validity: string;
  href: string;
};
export type WhyRecruitPoint = { title: string; desc: string };
export type ProcessStep = { title: string; desc: string };
export type TpoContact = {
  name: string;
  designation: string;
  phone: string;
  email: string;
  image: string;
};

export type PlacementInfoVal = {
  mou: { heading: string; description: string; items: MouItem[] };
  whyRecruit: {
    heading: string;
    description: string;
    points: WhyRecruitPoint[];
  };
  tpo: {
    heading: string;
    description: string;
    office: { address: string; phone: string; email: string };
    contacts: TpoContact[];
  };
  process: { heading: string; description: string; steps: ProcessStep[] };
  sidebar: { navItems?: SidebarNavItemRaw[] };
};

export const PLACEMENT_INFO_DEFAULT: PlacementInfoVal = {
  mou: { heading: "", description: "", items: [] },
  whyRecruit: { heading: "", description: "", points: [] },
  tpo: {
    heading: "",
    description: "",
    office: { address: "", phone: "", email: "" },
    contacts: [],
  },
  process: { heading: "", description: "", steps: [] },
  sidebar: { navItems: [] },
};

/** Fills in any branch missing from a partially-saved stored value. */
function withDefaults(v: Partial<PlacementInfoVal> | undefined | null) {
  const d = PLACEMENT_INFO_DEFAULT;
  return {
    mou: { ...d.mou, ...(v?.mou ?? {}), items: v?.mou?.items ?? [] },
    whyRecruit: {
      ...d.whyRecruit,
      ...(v?.whyRecruit ?? {}),
      points: v?.whyRecruit?.points ?? [],
    },
    tpo: {
      ...d.tpo,
      ...(v?.tpo ?? {}),
      office: { ...d.tpo.office, ...(v?.tpo?.office ?? {}) },
      contacts: v?.tpo?.contacts ?? [],
    },
    process: {
      ...d.process,
      ...(v?.process ?? {}),
      steps: v?.process?.steps ?? [],
    },
    sidebar: { navItems: v?.sidebar?.navItems ?? [] },
  } satisfies PlacementInfoVal;
}

export function PlacementInfoForm({
  value,
  onChange,
}: {
  value: Partial<PlacementInfoVal> | undefined;
  onChange: (next: PlacementInfoVal) => void;
}) {
  const { discardAll } = useDeferredUploads();
  const data = withDefaults(value);
  const patch = (p: Partial<PlacementInfoVal>) => onChange({ ...data, ...p });

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Static content for the college&apos;s placement page. The year-wise
        numbers, recruiters, and placed students are managed under{" "}
        <span className="font-medium">Placements</span> — this form only holds
        the copy that doesn&apos;t change every academic year. Each block below
        is hidden on the public page until it has at least one entry.
      </p>

      <Accordion title="MoUs & Collaborations" defaultOpen>
        <TextInput
          label="Heading"
          value={data.mou.heading}
          onChange={(e) =>
            patch({ mou: { ...data.mou, heading: e.target.value } })
          }
          placeholder="MoUs & Collaborations"
        />
        <TextArea
          label="Intro"
          rows={3}
          value={data.mou.description}
          onChange={(e) =>
            patch({ mou: { ...data.mou, description: e.target.value } })
          }
          hint="Shown above the MoU cards."
        />
        <Repeater<MouItem>
          label="MoUs"
          items={data.mou.items}
          onChange={(items) => patch({ mou: { ...data.mou, items } })}
          onItemRemove={(item) => {
            if (item.logo.startsWith("pending:")) discardAll();
          }}
          newItem={() => ({
            organization: "",
            logo: "",
            purpose: "",
            signedOn: "",
            validity: "",
            href: "",
          })}
          renderItem={(item, _i, onItemChange) => (
            <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-2">
              <TextInput
                label="Organization"
                value={item.organization}
                onChange={(e) =>
                  onItemChange({ ...item, organization: e.target.value })
                }
                placeholder="Infosys Ltd."
              />
              <ImageUploadInput
                label="Logo"
                value={item.logo}
                onChange={(url) => onItemChange({ ...item, logo: url })}
                hideUrlField
              />
              <div className="sm:col-span-2">
                <TextArea
                  label="Purpose"
                  rows={2}
                  value={item.purpose}
                  onChange={(e) =>
                    onItemChange({ ...item, purpose: e.target.value })
                  }
                  placeholder="Internships, joint certification programmes…"
                />
              </div>
              <TextInput
                label="Signed On"
                value={item.signedOn}
                onChange={(e) =>
                  onItemChange({ ...item, signedOn: e.target.value })
                }
                placeholder="March 2024"
              />
              <TextInput
                label="Validity"
                value={item.validity}
                onChange={(e) =>
                  onItemChange({ ...item, validity: e.target.value })
                }
                placeholder="3 years"
              />
              <div className="sm:col-span-2">
                <TextInput
                  label="Link (optional)"
                  value={item.href}
                  onChange={(e) =>
                    onItemChange({ ...item, href: e.target.value })
                  }
                  placeholder="https://…"
                  hint="Makes the card clickable."
                />
              </div>
            </div>
          )}
        />
      </Accordion>

      <Accordion title="Why Recruit at JCT">
        <TextInput
          label="Heading"
          value={data.whyRecruit.heading}
          onChange={(e) =>
            patch({
              whyRecruit: { ...data.whyRecruit, heading: e.target.value },
            })
          }
          placeholder="Why Recruit at JCT"
        />
        <TextArea
          label="Intro"
          rows={3}
          value={data.whyRecruit.description}
          onChange={(e) =>
            patch({
              whyRecruit: { ...data.whyRecruit, description: e.target.value },
            })
          }
        />
        <Repeater<WhyRecruitPoint>
          label="Reasons"
          items={data.whyRecruit.points}
          onChange={(points) =>
            patch({ whyRecruit: { ...data.whyRecruit, points } })
          }
          newItem={() => ({ title: "", desc: "" })}
          renderItem={(item, _i, onItemChange) => (
            <div className="space-y-3 pr-8">
              <TextInput
                label="Title"
                value={item.title}
                onChange={(e) =>
                  onItemChange({ ...item, title: e.target.value })
                }
                placeholder="Industry-ready graduates"
              />
              <TextArea
                label="Description"
                rows={2}
                value={item.desc}
                onChange={(e) =>
                  onItemChange({ ...item, desc: e.target.value })
                }
              />
            </div>
          )}
        />
      </Accordion>

      <Accordion title="TPO Contacts">
        <TextInput
          label="Heading"
          value={data.tpo.heading}
          onChange={(e) =>
            patch({ tpo: { ...data.tpo, heading: e.target.value } })
          }
          placeholder="Training & Placement Cell"
        />
        <TextArea
          label="Intro"
          rows={3}
          value={data.tpo.description}
          onChange={(e) =>
            patch({ tpo: { ...data.tpo, description: e.target.value } })
          }
        />
        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3">
          <div className="admin-label mb-2">Placement Office</div>
          <TextArea
            label="Address"
            rows={2}
            value={data.tpo.office.address}
            onChange={(e) =>
              patch({
                tpo: {
                  ...data.tpo,
                  office: { ...data.tpo.office, address: e.target.value },
                },
              })
            }
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextInput
              label="Phone"
              value={data.tpo.office.phone}
              onChange={(e) =>
                patch({
                  tpo: {
                    ...data.tpo,
                    office: { ...data.tpo.office, phone: e.target.value },
                  },
                })
              }
              placeholder="+91 98765 43210"
            />
            <TextInput
              label="Email"
              value={data.tpo.office.email}
              onChange={(e) =>
                patch({
                  tpo: {
                    ...data.tpo,
                    office: { ...data.tpo.office, email: e.target.value },
                  },
                })
              }
              placeholder="placements@jct.ac.in"
            />
          </div>
        </div>
        <Repeater<TpoContact>
          label="Officers"
          items={data.tpo.contacts}
          onChange={(contacts) => patch({ tpo: { ...data.tpo, contacts } })}
          onItemRemove={(item) => {
            if (item.image.startsWith("pending:")) discardAll();
          }}
          newItem={() => ({
            name: "",
            designation: "",
            phone: "",
            email: "",
            image: "",
          })}
          renderItem={(item, _i, onItemChange) => (
            <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-2">
              <TextInput
                label="Name"
                value={item.name}
                onChange={(e) =>
                  onItemChange({ ...item, name: e.target.value })
                }
              />
              <TextInput
                label="Designation"
                value={item.designation}
                onChange={(e) =>
                  onItemChange({ ...item, designation: e.target.value })
                }
                placeholder="Training & Placement Officer"
              />
              <TextInput
                label="Phone"
                value={item.phone}
                onChange={(e) =>
                  onItemChange({ ...item, phone: e.target.value })
                }
              />
              <TextInput
                label="Email"
                value={item.email}
                onChange={(e) =>
                  onItemChange({ ...item, email: e.target.value })
                }
              />
              <div className="sm:col-span-2">
                <ImageUploadInput
                  label="Photo"
                  value={item.image}
                  onChange={(url) => onItemChange({ ...item, image: url })}
                  hideUrlField
                />
              </div>
            </div>
          )}
        />
      </Accordion>

      <Accordion title="Placement Process">
        <TextInput
          label="Heading"
          value={data.process.heading}
          onChange={(e) =>
            patch({ process: { ...data.process, heading: e.target.value } })
          }
          placeholder="Placement Process"
        />
        <TextArea
          label="Intro"
          rows={3}
          value={data.process.description}
          onChange={(e) =>
            patch({ process: { ...data.process, description: e.target.value } })
          }
        />
        <Repeater<ProcessStep>
          label="Steps"
          items={data.process.steps}
          onChange={(steps) => patch({ process: { ...data.process, steps } })}
          newItem={() => ({ title: "", desc: "" })}
          renderItem={(item, i, onItemChange) => (
            <div className="space-y-3 pr-8">
              <TextInput
                label={`Step ${i + 1} title`}
                value={item.title}
                onChange={(e) =>
                  onItemChange({ ...item, title: e.target.value })
                }
                placeholder="Company registration"
              />
              <TextArea
                label="Description"
                rows={2}
                value={item.desc}
                onChange={(e) =>
                  onItemChange({ ...item, desc: e.target.value })
                }
              />
            </div>
          )}
        />
      </Accordion>

      <Accordion title="Sidebar Navigation">
        <p className="mb-3 text-xs text-gray-500">
          Rename, reorder, or hide the &ldquo;On This Page&rdquo; entries, and
          add custom links or extra in-page sections. Built-in entries stay
          hidden on the public page while their section has no content.
        </p>
        <SidebarNavEditor
          defaults={PLACEMENT_NAV_DEFAULTS}
          value={data.sidebar.navItems}
          onChange={(navItems) => patch({ sidebar: { navItems } })}
        />
      </Accordion>
    </div>
  );
}
