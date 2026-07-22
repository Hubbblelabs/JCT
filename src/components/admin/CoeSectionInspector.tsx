"use client";

import {
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
      <div className="space-y-4">
        <TextInput
          label="Sidebar Label"
          value={item.label ?? ""}
          placeholder="Section name shown in the sidebar"
          onChange={(e) => updateItem({ label: e.target.value })}
        />
        <div>
          <div className="admin-label mb-2">Content Blocks</div>
          <PageBodySectionsEditor
            value={(item.blocks ?? []) as PageBodySection[]}
            onChange={(blocks) => updateItem({ blocks })}
            allowedTypes={["heading", "text", "image", "list", "cards"]}
          />
        </div>
      </div>
    );
  }

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

    case "overview": {
      const ov = data.overview;
      const ctrl = ov.controller;
      return (
        <>
          <TextAreaList
            label="Intro Paragraphs"
            values={ov.paragraphs}
            onChange={(paragraphs) =>
              patch({ overview: { ...ov, paragraphs } })
            }
            placeholder="A paragraph about the COE office…"
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Controller Profile
          </div>
          <TextInput
            label="Name"
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
            ratio="portrait"
            value={ctrl.image}
            onChange={(image) =>
              patch({ overview: { ...ov, controller: { ...ctrl, image } } })
            }
            hideUrlField
          />
          <TextArea
            label="Pull Quote"
            rows={3}
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
            values={ctrl.messages}
            onChange={(messages) =>
              patch({ overview: { ...ov, controller: { ...ctrl, messages } } })
            }
            placeholder="A paragraph of the controller's message…"
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Autonomous Academic Governance
          </div>
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
              { key: "title", label: "Body Name", span2: true },
              {
                key: "desc",
                label: "Description",
                type: "textarea",
                span2: true,
              },
            ]}
            emptyItem={{ title: "", desc: "" }}
            addLabel="Add governance body"
          />
          <p className="mt-2 text-xs text-gray-400">
            Icons are assigned automatically by position.
          </p>
        </>
      );
    }

    case "responsibilities":
      return (
        <Repeater<Phase>
          label="Examination Phases"
          items={data.responsibilities.phases}
          onChange={(phases) => patch({ responsibilities: { phases } })}
          newItem={() => ({ name: "", subtitle: "", items: [] })}
          renderItem={(item, _i, oc) => (
            <div className="space-y-1">
              <TextInput
                label="Phase Name"
                value={item.name}
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Subtitle"
                value={item.subtitle}
                onChange={(e) => oc({ ...item, subtitle: e.target.value })}
              />
              <StringList
                label="Responsibility Items"
                values={item.items}
                onChange={(items) => oc({ ...item, items })}
                placeholder="A responsibility…"
              />
            </div>
          )}
        />
      );

    case "obe":
      return (
        <>
          <TextInput
            label="Heading"
            value={data.obe.heading}
            onChange={(e) =>
              patch({ obe: { ...data.obe, heading: e.target.value } })
            }
          />
          <TextArea
            label="Pull Quote"
            rows={3}
            value={data.obe.quote}
            onChange={(e) =>
              patch({ obe: { ...data.obe, quote: e.target.value } })
            }
          />
          <TextAreaList
            label="Paragraphs"
            values={data.obe.paragraphs}
            onChange={(paragraphs) =>
              patch({ obe: { ...data.obe, paragraphs } })
            }
            placeholder="A paragraph about OBE…"
          />
        </>
      );

    case "downloads":
      return (
        <>
          <TextArea
            label="Section Description"
            rows={3}
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
            items={data.downloads.forms}
            onChange={(forms) =>
              patch({ downloads: { ...data.downloads, forms } })
            }
            onItemRemove={undefined}
            newItem={() => ({ title: "", desc: "", href: "" })}
            renderItem={(item, _i, oc) => (
              <div className="space-y-1">
                <TextInput
                  label="Form Title"
                  value={item.title}
                  onChange={(e) => oc({ ...item, title: e.target.value })}
                />
                <TextArea
                  label="Description"
                  rows={2}
                  value={item.desc}
                  onChange={(e) => oc({ ...item, desc: e.target.value })}
                />
                <DocumentUploadInput
                  label="Document (PDF)"
                  value={item.href}
                  onChange={(href) => oc({ ...item, href })}
                  hint="Upload the form PDF — its link powers the Download button."
                />
              </div>
            )}
          />
        </>
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
              { key: "label", label: "Label", placeholder: "Controller" },
              {
                key: "value",
                label: "Value",
                placeholder: "Dr. D. Elangovan",
              },
            ]}
            emptyItem={{ label: "", value: "" }}
            addLabel="Add quick fact"
          />
          <div className="mt-4">
            <TextInput
              label="CTA Button Label"
              value={data.sidebar.ctaLabel}
              onChange={(e) =>
                patch({
                  sidebar: { ...data.sidebar, ctaLabel: e.target.value },
                })
              }
            />
          </div>
          <TextInput
            label="CTA Button Link"
            value={data.sidebar.ctaHref}
            onChange={(e) =>
              patch({
                sidebar: { ...data.sidebar, ctaHref: e.target.value },
              })
            }
            placeholder="http://erp.jct.ac.in/…"
          />
          <div className="mt-6">
            <div className="admin-label mb-2">Sidebar Navigation Items</div>
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
          </div>
        </>
      );

    default:
      return null;
  }
}
