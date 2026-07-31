"use client";

import {
  Field,
  FormGrid,
  TextInput,
  TextArea,
  StringList,
  TextAreaList,
  ImageUploadInput,
  DocumentUploadInput,
  ItemsEditor,
  Repeater,
} from "@/components/admin/inputs";
import { COE_NAV_DEFAULTS } from "@/components/layout/CoePageLayout";
import type { CoePageValue } from "@/lib/validation";
import type { SidebarNavItemRaw } from "@/lib/sidebar-nav";
import { SidebarNavEditor } from "@/components/admin/SidebarNavEditor";
import { PageBodySectionsEditor } from "@/components/admin/PageBodySectionsEditor";
import type { PageBodySection } from "@/lib/validation";

type Governance = CoePageValue["overview"]["governance"][number];
type Phase = CoePageValue["responsibilities"]["phases"][number];
type CoeForm = CoePageValue["downloads"]["forms"][number];
type QuickFact = CoePageValue["sidebar"]["quickFacts"][number];
type Calendar = CoePageValue["academicCalendar"];
type CalendarEvent = Calendar["events"][number];
type CalendarDownload = Calendar["downloads"][number];

/** Values stored before the calendar field existed load without it. */
const EMPTY_CALENDAR: Calendar = {
  heading: "",
  academicYear: "",
  description: "",
  events: [],
  downloads: [],
};

export function CoeSectionInspector({
  section,
  data,
  onChange,
}: {
  section: string;
  data: CoePageValue;
  onChange: (next: CoePageValue) => void;
}) {
  const patch = (p: Partial<CoePageValue>) => onChange({ ...data, ...p });

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

    case "overview": {
      const ov = data.overview;
      const ctrl = ov.controller;
      return (
        <FormGrid>
          <TextAreaList
            label="Intro Paragraphs"
            span="full"
            values={ov.paragraphs}
            onChange={(paragraphs) =>
              patch({ overview: { ...ov, paragraphs } })
            }
            placeholder="A paragraph about the COE office…"
          />

          <h3 className="admin-col-full admin-section-label border-t border-gray-100 pt-4">
            Controller Profile
          </h3>
          <TextInput
            label="Name"
            span={4}
            value={ctrl.name}
            onChange={(e) =>
              patch({
                overview: {
                  ...ov,
                  controller: { ...ctrl, name: e.target.value },
                },
              })
            }
          />
          <TextInput
            label="Title"
            span={4}
            value={ctrl.title}
            onChange={(e) =>
              patch({
                overview: {
                  ...ov,
                  controller: { ...ctrl, title: e.target.value },
                },
              })
            }
          />
          <TextInput
            label="Qualification"
            span={4}
            value={ctrl.qual}
            onChange={(e) =>
              patch({
                overview: {
                  ...ov,
                  controller: { ...ctrl, qual: e.target.value },
                },
              })
            }
          />
          <ImageUploadInput
            label="Photo"
            span="full"
            ratio="portrait"
            value={ctrl.image}
            onChange={(image) =>
              patch({ overview: { ...ov, controller: { ...ctrl, image } } })
            }
            hideUrlField
          />
          <TextArea
            label="Pull Quote"
            span={4}
            rows={5}
            value={ctrl.quote}
            onChange={(e) =>
              patch({
                overview: {
                  ...ov,
                  controller: { ...ctrl, quote: e.target.value },
                },
              })
            }
          />
          <TextAreaList
            label="Message Paragraphs"
            span={8}
            values={ctrl.messages}
            onChange={(messages) =>
              patch({ overview: { ...ov, controller: { ...ctrl, messages } } })
            }
            placeholder="A paragraph of the controller's message…"
          />

          <Field
            label="Autonomous Academic Governance"
            span="full"
            className="border-t border-gray-100 pt-4"
            hint="Icons are assigned automatically by position."
          >
            <ItemsEditor
              items={ov.governance as unknown as Record<string, unknown>[]}
              onChange={(v) =>
                patch({
                  overview: {
                    ...ov,
                    governance: v as unknown as Governance[],
                  },
                })
              }
              fields={[
                { key: "title", label: "Body Name", span: "full" },
                {
                  key: "desc",
                  label: "Description",
                  type: "textarea",
                  span: "full",
                },
              ]}
              emptyItem={{ title: "", desc: "" }}
              addLabel="Add governance body"
              cardSpan={4}
            />
          </Field>
        </FormGrid>
      );
    }

    case "responsibilities":
      return (
        <Repeater<Phase>
          label="Examination Phases"
          itemSpan={6}
          items={data.responsibilities.phases}
          onChange={(phases) => patch({ responsibilities: { phases } })}
          newItem={() => ({ name: "", subtitle: "", items: [] })}
          renderItem={(item, _i, oc) => (
            <FormGrid tight>
              <TextInput
                label="Phase Name"
                span={5}
                value={item.name}
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Subtitle"
                span={7}
                value={item.subtitle}
                onChange={(e) => oc({ ...item, subtitle: e.target.value })}
              />
              <StringList
                label="Responsibility Items"
                span="full"
                values={item.items}
                onChange={(items) => oc({ ...item, items })}
                placeholder="A responsibility…"
              />
            </FormGrid>
          )}
        />
      );

    case "obe":
      return (
        <FormGrid>
          <TextInput
            label="Heading"
            span={4}
            value={data.obe.heading}
            onChange={(e) =>
              patch({ obe: { ...data.obe, heading: e.target.value } })
            }
          />
          <TextArea
            label="Pull Quote"
            span={8}
            rows={2}
            value={data.obe.quote}
            onChange={(e) =>
              patch({ obe: { ...data.obe, quote: e.target.value } })
            }
          />
          <TextAreaList
            label="Paragraphs"
            span="full"
            values={data.obe.paragraphs}
            onChange={(paragraphs) =>
              patch({ obe: { ...data.obe, paragraphs } })
            }
            placeholder="A paragraph about OBE…"
          />
        </FormGrid>
      );

    case "academicCalendar": {
      const cal = data.academicCalendar ?? EMPTY_CALENDAR;
      const patchCal = (p: Partial<Calendar>) =>
        patch({ academicCalendar: { ...cal, ...p } });
      return (
        <FormGrid>
          <TextInput
            label="Section Heading"
            span={4}
            value={cal.heading}
            placeholder="Academic Calendar"
            onChange={(e) => patchCal({ heading: e.target.value })}
          />
          <TextInput
            label="Academic Year"
            span={3}
            value={cal.academicYear}
            placeholder="2025 – 2026"
            onChange={(e) => patchCal({ academicYear: e.target.value })}
          />
          <TextArea
            label="Section Description"
            span={5}
            rows={2}
            value={cal.description}
            placeholder="Key dates for the current academic year…"
            onChange={(e) => patchCal({ description: e.target.value })}
          />

          <Repeater<CalendarEvent>
            label="Calendar Dates"
            span="full"
            itemSpan={6}
            items={cal.events}
            onChange={(events) => patchCal({ events })}
            newItem={() => ({ title: "", date: "", note: "" })}
            renderItem={(item, _i, oc) => (
              <FormGrid tight>
                <TextInput
                  label="Event"
                  span={7}
                  value={item.title}
                  placeholder="Commencement of Classes"
                  onChange={(e) => oc({ ...item, title: e.target.value })}
                />
                <TextInput
                  label="Date / Period"
                  span={5}
                  value={item.date}
                  placeholder="01 Jul 2026"
                  onChange={(e) => oc({ ...item, date: e.target.value })}
                />
                <TextArea
                  label="Note (optional)"
                  span="full"
                  rows={2}
                  value={item.note}
                  onChange={(e) => oc({ ...item, note: e.target.value })}
                />
              </FormGrid>
            )}
          />

          <Repeater<CalendarDownload>
            label="Downloadable Calendars"
            span="full"
            itemSpan={6}
            items={cal.downloads}
            onChange={(downloads) => patchCal({ downloads })}
            newItem={() => ({ label: "", href: "" })}
            renderItem={(item, _i, oc) => (
              <FormGrid tight>
                <TextInput
                  label="Label"
                  span="full"
                  value={item.label}
                  placeholder="Odd Semester 2025–26"
                  onChange={(e) => oc({ ...item, label: e.target.value })}
                />
                <DocumentUploadInput
                  label="Calendar (PDF)"
                  span="full"
                  value={item.href}
                  onChange={(href) => oc({ ...item, href })}
                  hint="Upload the calendar PDF — its link powers the Download button."
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );
    }

    case "downloads":
      return (
        <FormGrid>
          <TextArea
            label="Section Description"
            span="full"
            rows={2}
            value={data.downloads.description}
            onChange={(e) =>
              patch({
                downloads: {
                  ...data.downloads,
                  description: e.target.value,
                },
              })
            }
          />
          <Repeater<CoeForm>
            label="Downloadable Forms"
            span="full"
            itemSpan={6}
            items={data.downloads.forms}
            onChange={(forms) =>
              patch({ downloads: { ...data.downloads, forms } })
            }
            onItemRemove={undefined}
            newItem={() => ({ title: "", desc: "", href: "" })}
            renderItem={(item, _i, oc) => (
              <FormGrid tight>
                <TextInput
                  label="Form Title"
                  span="full"
                  value={item.title}
                  onChange={(e) => oc({ ...item, title: e.target.value })}
                />
                <TextArea
                  label="Description"
                  span="full"
                  rows={2}
                  value={item.desc}
                  onChange={(e) => oc({ ...item, desc: e.target.value })}
                />
                <DocumentUploadInput
                  label="Document (PDF)"
                  span="full"
                  value={item.href}
                  onChange={(href) => oc({ ...item, href })}
                  hint="Upload the form PDF — its link powers the Download button."
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );

    case "sidebar":
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
                { key: "label", label: "Label", placeholder: "Controller" },
                {
                  key: "value",
                  label: "Value",
                  placeholder: "Dr. D. Elangovan",
                },
              ]}
              emptyItem={{ label: "", value: "" }}
              addLabel="Add quick fact"
              cardSpan={4}
            />
          </Field>
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
            span={8}
            value={data.sidebar.ctaHref}
            onChange={(e) =>
              patch({
                sidebar: { ...data.sidebar, ctaHref: e.target.value },
              })
            }
            placeholder="http://erp.jct.ac.in/…"
          />
          <Field label="Sidebar Navigation Items" span="full">
            <SidebarNavEditor
              defaults={COE_NAV_DEFAULTS}
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
