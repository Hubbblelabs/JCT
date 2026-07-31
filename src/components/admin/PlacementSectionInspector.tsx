"use client";

import {
  Field,
  FormGrid,
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

type BannerImage = PlacementInfoValue["banner"]["images"][number];
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
    case "banner":
      return (
        <FormGrid>
          <p className="admin-col-full text-xs text-gray-500">
            Poster-style images for the &ldquo;Highlights&rdquo; section — the
            first item in the page&apos;s sidebar — e.g. the annual
            &ldquo;Distinguished Alumni Students&rdquo; sheet. Each one renders
            full width at its own shape, so upload it with the{" "}
            <span className="font-medium">Auto / Original</span> ratio to keep
            the artwork uncropped.
          </p>
          <TextInput
            label="Heading (optional)"
            span={5}
            value={data.banner.heading}
            onChange={(e) =>
              patch({ banner: { ...data.banner, heading: e.target.value } })
            }
            placeholder="Distinguished Alumni Students"
            hint="Leave blank when the poster already carries its own title."
          />
          <TextArea
            label="Intro (optional)"
            span={7}
            rows={2}
            value={data.banner.description}
            onChange={(e) =>
              patch({ banner: { ...data.banner, description: e.target.value } })
            }
          />
          <Repeater<BannerImage>
            label="Banner Images"
            span="full"
            itemSpan={6}
            items={data.banner.images}
            onChange={(images) => patch({ banner: { ...data.banner, images } })}
            onItemRemove={(item) => {
              if (item.image.startsWith("pending:")) discardAll();
            }}
            newItem={() => ({ image: "", alt: "", caption: "", href: "" })}
            renderItem={(item, i, onItemChange) => (
              <FormGrid tight>
                <ImageUploadInput
                  label={`Image ${i + 1}`}
                  span="full"
                  ratio="auto"
                  value={item.image}
                  onChange={(url) => onItemChange({ ...item, image: url })}
                  hideUrlField
                />
                <TextInput
                  label="Alt text"
                  span="full"
                  value={item.alt}
                  onChange={(e) =>
                    onItemChange({ ...item, alt: e.target.value })
                  }
                  placeholder="Distinguished alumni of JCT Engineering"
                  hint="Describes the poster for screen readers and search engines."
                />
                <TextInput
                  label="Caption (optional)"
                  span={6}
                  value={item.caption}
                  onChange={(e) =>
                    onItemChange({ ...item, caption: e.target.value })
                  }
                  placeholder="Class of 2024 — highest package ₹1 Crore"
                />
                <TextInput
                  label="Link (optional)"
                  span={6}
                  value={item.href}
                  onChange={(e) =>
                    onItemChange({ ...item, href: e.target.value })
                  }
                  placeholder="https://…"
                  hint="Makes the whole banner clickable."
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );

    case "process":
      return (
        <FormGrid>
          <TextInput
            label="Heading"
            span={5}
            value={data.process.heading}
            onChange={(e) =>
              patch({ process: { ...data.process, heading: e.target.value } })
            }
            placeholder="Placement Process"
          />
          <TextArea
            label="Intro"
            span={7}
            rows={2}
            value={data.process.description}
            onChange={(e) =>
              patch({
                process: { ...data.process, description: e.target.value },
              })
            }
          />
          <Repeater<ProcessStep>
            label="Steps"
            span="full"
            itemSpan={4}
            items={data.process.steps}
            onChange={(steps) => patch({ process: { ...data.process, steps } })}
            newItem={() => ({ title: "", desc: "" })}
            renderItem={(item, i, onItemChange) => (
              <FormGrid tight>
                <TextInput
                  label={`Step ${i + 1} title`}
                  span="full"
                  value={item.title}
                  onChange={(e) =>
                    onItemChange({ ...item, title: e.target.value })
                  }
                  placeholder="Pre-Placement Talk"
                />
                <TextArea
                  label="Description"
                  span="full"
                  rows={3}
                  value={item.desc}
                  onChange={(e) =>
                    onItemChange({ ...item, desc: e.target.value })
                  }
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );

    case "tpo":
      return (
        <FormGrid>
          <TextInput
            label="Heading"
            span={5}
            value={data.tpo.heading}
            onChange={(e) =>
              patch({ tpo: { ...data.tpo, heading: e.target.value } })
            }
            placeholder="Training & Placement Cell"
          />
          <TextArea
            label="Intro"
            span={7}
            rows={2}
            value={data.tpo.description}
            onChange={(e) =>
              patch({ tpo: { ...data.tpo, description: e.target.value } })
            }
          />

          <Field label="Placement Office" span={7}>
            <div className="admin-form-grid admin-form-grid--tight rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <TextArea
                label="Address"
                span="full"
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
                span={5}
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
                span={7}
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
          </Field>

          <Field label="Officer Photos" span={5}>
            <label className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/60 p-3 text-sm text-gray-700">
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
          </Field>

          <Repeater<TpoContact>
            label="Officers"
            span="full"
            itemSpan={6}
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
              <FormGrid tight>
                <TextInput
                  label="Name"
                  span={5}
                  value={item.name}
                  onChange={(e) =>
                    onItemChange({ ...item, name: e.target.value })
                  }
                />
                <TextInput
                  label="Designation / Department"
                  span={7}
                  value={item.designation}
                  onChange={(e) =>
                    onItemChange({ ...item, designation: e.target.value })
                  }
                  placeholder="Training & Placement Officer"
                />
                <TextInput
                  label="Phone"
                  span={5}
                  value={item.phone}
                  onChange={(e) =>
                    onItemChange({ ...item, phone: e.target.value })
                  }
                />
                <TextInput
                  label="Email"
                  span={7}
                  value={item.email}
                  onChange={(e) =>
                    onItemChange({ ...item, email: e.target.value })
                  }
                />
                <ImageUploadInput
                  label="Photo"
                  span="full"
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
              </FormGrid>
            )}
          />
        </FormGrid>
      );

    case "mou":
      return (
        <FormGrid>
          <TextInput
            label="Heading"
            span={5}
            value={data.mou.heading}
            onChange={(e) =>
              patch({ mou: { ...data.mou, heading: e.target.value } })
            }
            placeholder="MoUs & Collaborations"
          />
          <TextArea
            label="Intro"
            span={7}
            rows={2}
            value={data.mou.description}
            onChange={(e) =>
              patch({ mou: { ...data.mou, description: e.target.value } })
            }
          />
          <Repeater<MouItem>
            label="MoUs"
            span="full"
            itemSpan={6}
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
              <FormGrid tight>
                <TextInput
                  label="Organization"
                  span="full"
                  value={item.organization}
                  onChange={(e) =>
                    onItemChange({ ...item, organization: e.target.value })
                  }
                  placeholder="Infosys Ltd."
                />
                <TextArea
                  label="Purpose"
                  span="full"
                  rows={2}
                  value={item.purpose}
                  onChange={(e) =>
                    onItemChange({ ...item, purpose: e.target.value })
                  }
                  placeholder="Internships, joint certification programmes…"
                />
                <TextInput
                  label="Signed On"
                  span={6}
                  value={item.signedOn}
                  onChange={(e) =>
                    onItemChange({ ...item, signedOn: e.target.value })
                  }
                  placeholder="March 2024"
                />
                <TextInput
                  label="Validity"
                  span={6}
                  value={item.validity}
                  onChange={(e) =>
                    onItemChange({ ...item, validity: e.target.value })
                  }
                  placeholder="3 years"
                />
                <TextInput
                  label="Link (optional)"
                  span="full"
                  value={item.href}
                  onChange={(e) =>
                    onItemChange({ ...item, href: e.target.value })
                  }
                  placeholder="https://…"
                  hint="Makes the whole card clickable."
                />
                <ImageUploadInput
                  label="Logo"
                  span="full"
                  ratio="square"
                  value={item.logo}
                  onChange={(url) => onItemChange({ ...item, logo: url })}
                  hideUrlField
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );

    case "why-recruit":
      return (
        <FormGrid>
          <TextInput
            label="Heading"
            span={5}
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
            span={7}
            rows={2}
            value={data.whyRecruit.description}
            onChange={(e) =>
              patch({
                whyRecruit: { ...data.whyRecruit, description: e.target.value },
              })
            }
          />
          <Repeater<WhyPoint>
            label="Reasons"
            span="full"
            itemSpan={4}
            items={data.whyRecruit.points}
            onChange={(points) =>
              patch({ whyRecruit: { ...data.whyRecruit, points } })
            }
            newItem={() => ({ title: "", desc: "" })}
            renderItem={(item, _i, onItemChange) => (
              <FormGrid tight>
                <TextInput
                  label="Title"
                  span="full"
                  value={item.title}
                  onChange={(e) =>
                    onItemChange({ ...item, title: e.target.value })
                  }
                  placeholder="Industry-ready graduates"
                />
                <TextArea
                  label="Description"
                  span="full"
                  rows={3}
                  value={item.desc}
                  onChange={(e) =>
                    onItemChange({ ...item, desc: e.target.value })
                  }
                />
              </FormGrid>
            )}
          />
        </FormGrid>
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
