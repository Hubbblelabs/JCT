"use client";

import {
  TextInput,
  TextArea,
  Repeater,
  ImageUploadInput,
} from "@/components/admin/inputs";
import { SidebarNavEditor } from "@/components/admin/SidebarNavEditor";
import { useDeferredUploads } from "@/lib/deferred-uploads";
import { PLACEMENT_NAV_DEFAULTS } from "@/components/layout/PlacementsPageLayout";
import type { SidebarNavItemRaw } from "@/lib/sidebar-nav";
import type { PlacementInfoValue } from "@/lib/validation";

type MouItem = PlacementInfoValue["mou"]["items"][number];
type WhyPoint = PlacementInfoValue["whyRecruit"]["points"][number];
type ProcessStep = PlacementInfoValue["process"]["steps"][number];
type TpoContact = PlacementInfoValue["tpo"]["contacts"][number];

/**
 * Field editor for one section of the placements page, rendered in the
 * editor's slide-over inspector — same shape as AboutSectionInspector /
 * CoeSectionInspector.
 */
export function PlacementSectionInspector({
  section,
  data,
  onChange,
}: {
  section: string;
  data: PlacementInfoValue;
  onChange: (next: PlacementInfoValue) => void;
}) {
  const { discardAll } = useDeferredUploads();
  const patch = (p: Partial<PlacementInfoValue>) => onChange({ ...data, ...p });

  switch (section) {
    case "process":
      return (
        <>
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
              patch({
                process: { ...data.process, description: e.target.value },
              })
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
                  placeholder="Pre-Placement Talk"
                />
                <TextArea
                  label="Description"
                  rows={3}
                  value={item.desc}
                  onChange={(e) =>
                    onItemChange({ ...item, desc: e.target.value })
                  }
                />
              </div>
            )}
          />
        </>
      );

    case "tpo":
      return (
        <>
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

          <label className="mb-4 flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/60 p-3 text-sm text-gray-700">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={data.tpo.showPhotos}
              onChange={(e) =>
                patch({ tpo: { ...data.tpo, showPhotos: e.target.checked } })
              }
            />
            <span>
              Show officer photos
              <span className="mt-0.5 block text-xs text-gray-500">
                Off hides the photo (and its initials placeholder) on every
                officer card, leaving name, designation and contact details.
              </span>
            </span>
          </label>

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
              <div className="space-y-3 pr-8">
                <TextInput
                  label="Name"
                  value={item.name}
                  onChange={(e) =>
                    onItemChange({ ...item, name: e.target.value })
                  }
                />
                <TextInput
                  label="Designation / Department"
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
                <ImageUploadInput
                  label="Photo"
                  ratio="portrait"
                  value={item.image}
                  onChange={(url) => onItemChange({ ...item, image: url })}
                  hideUrlField
                  hint={
                    data.tpo.showPhotos
                      ? undefined
                      : "Photos are currently hidden for this section."
                  }
                />
              </div>
            )}
          />
        </>
      );

    case "mou":
      return (
        <>
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
              <div className="space-y-3 pr-8">
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
                  ratio="square"
                  value={item.logo}
                  onChange={(url) => onItemChange({ ...item, logo: url })}
                  hideUrlField
                />
                <TextArea
                  label="Purpose"
                  rows={2}
                  value={item.purpose}
                  onChange={(e) =>
                    onItemChange({ ...item, purpose: e.target.value })
                  }
                  placeholder="Internships, joint certification programmes…"
                />
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
                <TextInput
                  label="Link (optional)"
                  value={item.href}
                  onChange={(e) =>
                    onItemChange({ ...item, href: e.target.value })
                  }
                  placeholder="https://…"
                  hint="Makes the whole card clickable."
                />
              </div>
            )}
          />
        </>
      );

    case "why-recruit":
      return (
        <>
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
          <Repeater<WhyPoint>
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
                  rows={3}
                  value={item.desc}
                  onChange={(e) =>
                    onItemChange({ ...item, desc: e.target.value })
                  }
                />
              </div>
            )}
          />
        </>
      );

    case "sidebar":
      return (
        <>
          <p className="mb-3 text-xs text-gray-500">
            Rename, reorder, or hide the &ldquo;On This Page&rdquo; entries, and
            add custom links or extra in-page sections. A built-in entry stays
            hidden on the public page while its section has no content.
          </p>
          <SidebarNavEditor
            defaults={PLACEMENT_NAV_DEFAULTS}
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
        </>
      );

    default:
      // Custom in-page sections are defined as blocks on their sidebar item —
      // point the editor at the one place that owns them.
      if (section.startsWith("custom:")) {
        return (
          <p className="text-sm text-gray-500">
            This section&apos;s content blocks are edited from the{" "}
            <span className="font-medium">Sidebar Navigation</span> section —
            click the sidebar card in the preview.
          </p>
        );
      }
      return (
        <p className="text-sm text-gray-500">
          The year-wise placement numbers, recruiters, and placed students are
          managed under <span className="font-medium">Placements</span>.
        </p>
      );
  }
}
