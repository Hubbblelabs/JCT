"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  Field,
  FormGrid,
  ImageUploadInput,
  ItemCard,
  TextArea,
  TextInput,
} from "@/components/admin/inputs";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { PageBodySectionsEditor } from "@/components/admin/PageBodySectionsEditor";
import { EditableRegion } from "@/components/admin/EditableRegion";
import {
  EditorSaveBar,
  EditorWorkspace,
  type WorkspaceSection,
} from "@/components/admin/kit";
import { DynamicPageRenderer } from "@/components/layout/DynamicPageRenderer";
import { PageHero as PageHeroBanner } from "@/components/ui/PageHero";
import type {
  PageContent,
  PageBodySection,
  PageSeo,
  PageHero,
} from "@/lib/validation";

type SidebarBlock = NonNullable<PageContent["sidebar"]>;
type GalleryBlock = NonNullable<PageContent["gallery"]>;
type ContactBlock = NonNullable<PageContent["contact"]>;

type Institution = "main" | "engineering" | "arts-science" | "polytechnic";
type Template = "standard" | "hero-content" | "sidebar" | "gallery" | "contact";
type Status = "draft" | "published" | "archived";

type PageDoc = {
  _id: string;
  slug: string;
  institution: Institution;
  title: string;
  template: Template;
  status: Status;
  version: number;
  content: PageContent;
};

const ALL: Template[] = [
  "standard",
  "hero-content",
  "sidebar",
  "gallery",
  "contact",
];

/** The page's editable sections — which ones apply depends on its template. */
const SECTION_DEFS: {
  id: string;
  label: string;
  help: string;
  templates: Template[];
}[] = [
  {
    id: "basic",
    label: "Page details",
    help: "The page title, its web address and its layout.",
    templates: ALL,
  },
  {
    id: "hero",
    label: "Hero",
    help: "The large banner at the top: title, subtitle, image and button.",
    templates: ["hero-content"],
  },
  {
    id: "sections",
    label: "Page content",
    help: "The body of the page: headings, paragraphs, lists, images and more, in order.",
    templates: ["standard", "hero-content", "sidebar"],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    help: "The box of links beside the content.",
    templates: ["sidebar"],
  },
  {
    id: "gallery",
    label: "Gallery",
    help: "The photos shown in a grid.",
    templates: ["gallery"],
  },
  {
    id: "contact",
    label: "Contact details",
    help: "Phone, email, address and the map.",
    templates: ["contact"],
  },
  {
    id: "seo",
    label: "Search engine settings",
    help: "The title and description Google shows for this page. Not visible on the page itself.",
    templates: ALL,
  },
];

/** Which section a click on the page body opens, per template. */
const BODY_SECTION: Record<Template, string> = {
  standard: "sections",
  "hero-content": "sections",
  sidebar: "sections",
  gallery: "gallery",
  contact: "contact",
};

function publicPathFor(institution: Institution, slug: string): string {
  if (institution === "main") return `/p/${slug}`;
  return `/institutions/${institution}/p/${slug}`;
}

function PageEditorInner({ id }: { id: string }) {
  const router = useRouter();
  const { flush } = useDeferredUploads();
  const toast = useToast();
  const confirm = useConfirm();
  const [doc, setDoc] = useState<PageDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  /** The saved document the editor compares against. */
  const [baseline, setBaseline] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/pages/${id}`);
      if (!r.ok) {
        setMsg({ kind: "err", text: "Failed to load page." });
        return;
      }
      const data = await r.json();
      const loaded = { ...data, content: data.content ?? {} };
      setDoc(loaded);
      setBaseline(editableJson(loaded));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const patchContent = (patch: Partial<PageContent>) =>
    setDoc((prev) =>
      prev ? { ...prev, content: { ...prev.content, ...patch } } : prev,
    );

  const save = async (extra?: Partial<PageDoc>) => {
    if (!doc) return;
    setSaving(true);
    setMsg(null);
    setApiError(null);
    try {
      const flushedContent = (await flush(doc.content)) as PageContent;
      const body: Record<string, unknown> = {
        title: doc.title,
        slug: doc.slug,
        institution: doc.institution,
        template: doc.template,
        content: flushedContent,
        ...extra,
      };
      const r = await fetch(`/api/admin/pages/${doc._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        const data = await r.json();
        const saved = { ...data, content: data.content ?? {} };
        setDoc(saved);
        setBaseline(editableJson(saved));
        setMsg({ kind: "ok", text: "Draft saved — not on the live site yet" });
        return true;
      } else {
        const parsed = await parseApiError(r);
        setApiError(parsed);
        setMsg({
          kind: "err",
          text: parsed?.message ?? parsed?.error ?? "Save failed.",
        });
      }
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
    return false;
  };

  const publish = async () => {
    if (!doc) return;
    const ok = await confirm({
      title: "Publish page",
      message: `Publish "${doc.title}"? The current draft will become the live version.`,
      confirmLabel: "Publish",
    });
    if (!ok) return;
    if (!(await save())) return;
    setPublishing(true);
    try {
      const r = await fetch(`/api/admin/pages/${doc._id}/publish`, {
        method: "POST",
      });
      if (r.ok) {
        const data = await r.json();
        const published = { ...data, content: data.content ?? {} };
        setDoc(published);
        setBaseline(editableJson(published));
        setMsg({
          kind: "ok",
          text: `Published — the live page is updated (v${data.version})`,
        });
      } else {
        const parsed = await parseApiError(r);
        setMsg({
          kind: "err",
          text: parsed?.message ?? parsed?.error ?? "Publish failed.",
        });
      }
    } finally {
      setPublishing(false);
    }
  };

  const current = useMemo(() => (doc ? editableJson(doc) : null), [doc]);
  const dirty = baseline !== null && current !== null && current !== baseline;

  if (loading || !doc) {
    return (
      <EditorWorkspace
        title="Page"
        loading={loading}
        error={
          !loading && !doc
            ? (msg?.text ?? "This page could not be loaded.")
            : null
        }
        sections={[]}
        selected={null}
        onSelect={() => {}}
        preview={null}
        saveBar={
          <EditorSaveBar
            dirty={false}
            saving={null}
            disabled
            onPublish={() => {}}
          />
        }
      />
    );
  }

  const sectionList: WorkspaceSection[] = SECTION_DEFS.filter((d) =>
    d.templates.includes(doc.template),
  ).map(({ id, label, help }) => ({ id, label, help }));
  const hero = (doc.content.hero ?? {}) as PageHero;
  const seo = (doc.content.seo ?? {}) as PageSeo;
  const sidebar = (doc.content.sidebar ?? {}) as SidebarBlock;
  const gallery = (doc.content.gallery ?? { images: [] }) as GalleryBlock;
  const contact = (doc.content.contact ?? {}) as ContactBlock;
  const sections = doc.content.sections ?? [];
  const sidebarItems = Array.isArray(sidebar.items) ? sidebar.items : [];
  const galleryImages = Array.isArray(gallery.images) ? gallery.images : [];

  const deletePage = async () => {
    const ok = await confirm({
      title: "Delete page",
      message: "Delete this page permanently? This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const r = await fetch(`/api/admin/pages/${doc._id}`, { method: "DELETE" });
    if (r.ok) router.push("/admin/pages");
    else toast.error("Delete failed.");
  };

  const institutionLabel: Record<Institution, string> = {
    main: "Main site",
    engineering: "Engineering",
    "arts-science": "Arts & Science",
    polytechnic: "Polytechnic",
  };

  return (
    <EditorWorkspace
      title={doc.title || "(untitled page)"}
      description={`${institutionLabel[doc.institution]} · ${publicPathFor(doc.institution, doc.slug)}. Click any part of the page to edit it.`}
      publicHref={
        doc.status === "published"
          ? publicPathFor(doc.institution, doc.slug)
          : undefined
      }
      headerExtra={
        <>
          <Link
            href="/admin/pages"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            title="Back to all pages"
          >
            <ArrowLeft size={14} />
            <span className="admin-tb-label admin-tb-label--secondary">
              All pages
            </span>
          </Link>
          <button
            type="button"
            onClick={() => void deletePage()}
            className="admin-btn admin-btn-danger admin-btn-sm"
            title="Delete this page"
          >
            <Trash2 size={14} />
            <span className="admin-tb-label admin-tb-label--secondary">
              Delete
            </span>
          </button>
        </>
      }
      banner={
        apiError && (
          <ValidationErrors
            error={apiError.message ?? apiError.error}
            details={apiError.details}
          />
        )
      }
      sections={sectionList}
      selected={selected}
      onSelect={setSelected}
      preview={
        <div className="bg-surface text-foreground">
          {doc.template !== "hero-content" && (
            <EditableRegion
              as="div"
              section="basic"
              label="Page details"
              editable
              onEditSection={setSelected}
              className="rounded-none!"
            >
              <PageHeroBanner
                title={doc.title}
                subtitle={doc.content.seo?.metaDescription}
              />
            </EditableRegion>
          )}
          <EditableRegion
            as="div"
            section={BODY_SECTION[doc.template]}
            label="Page content"
            editable
            onEditSection={setSelected}
            className="rounded-none!"
          >
            <DynamicPageRenderer
              template={doc.template}
              content={doc.content}
            />
          </EditableRegion>
        </div>
      }
      panel={
        selected && (
          <>
            {selected === "basic" && (
              <FormGrid>
                <TextInput
                  label="Title"
                  span={4}
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                />
                <TextInput
                  label="Slug (URL)"
                  span={4}
                  value={doc.slug}
                  onChange={(e) => setDoc({ ...doc, slug: e.target.value })}
                  hint="Lowercase letters, numbers, and dashes."
                />
                <Field label="Public URL" span={4} inline>
                  <input
                    className="admin-input"
                    value={publicPathFor(doc.institution, doc.slug)}
                    aria-label="Public URL"
                    disabled
                  />
                </Field>
                <Link
                  href="/admin/pages"
                  className="admin-col-full text-sm text-[var(--admin-warning)] hover:underline"
                >
                  ← Back to pages
                </Link>
              </FormGrid>
            )}

            {selected === "seo" && (
              <FormGrid>
                <TextInput
                  label="Meta Title"
                  span={5}
                  value={seo.metaTitle ?? ""}
                  onChange={(e) =>
                    patchContent({ seo: { ...seo, metaTitle: e.target.value } })
                  }
                  hint="Defaults to the page title if blank."
                />
                <TextArea
                  label="Meta Description"
                  span={7}
                  rows={3}
                  value={seo.metaDescription ?? ""}
                  onChange={(e) =>
                    patchContent({
                      seo: { ...seo, metaDescription: e.target.value },
                    })
                  }
                />
                <Field label="Keywords (comma-separated)" span={8} inline>
                  <input
                    className="admin-input"
                    aria-label="Keywords"
                    value={(seo.keywords ?? []).join(", ")}
                    onChange={(e) =>
                      patchContent({
                        seo: {
                          ...seo,
                          keywords: e.target.value
                            .split(",")
                            .map((k) => k.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Indexing" span={4} inline>
                  <label className="flex items-center gap-2 pt-2 text-sm">
                    <input
                      type="checkbox"
                      checked={seo.noindex === true}
                      onChange={(e) =>
                        patchContent({
                          seo: { ...seo, noindex: e.target.checked },
                        })
                      }
                    />
                    Hide from search engines (noindex)
                  </label>
                </Field>
                <ImageUploadInput
                  label="Open Graph Image (optional)"
                  span="full"
                  ratio="hero"
                  value={seo.ogImage ?? ""}
                  onChange={(ogImage) =>
                    patchContent({ seo: { ...seo, ogImage } })
                  }
                  hideUrlField
                />
              </FormGrid>
            )}

            {selected === "hero" && (
              <FormGrid>
                <TextInput
                  label="Hero Title"
                  span={5}
                  value={hero.title ?? ""}
                  onChange={(e) =>
                    patchContent({ hero: { ...hero, title: e.target.value } })
                  }
                />
                <TextArea
                  label="Hero Subtitle"
                  span={7}
                  rows={3}
                  value={hero.subtitle ?? ""}
                  onChange={(e) =>
                    patchContent({
                      hero: { ...hero, subtitle: e.target.value },
                    })
                  }
                />
                <TextInput
                  label="CTA Label"
                  span={4}
                  value={hero.ctaLabel ?? ""}
                  onChange={(e) =>
                    patchContent({
                      hero: { ...hero, ctaLabel: e.target.value },
                    })
                  }
                />
                <TextInput
                  label="CTA URL"
                  span={8}
                  value={hero.ctaHref ?? ""}
                  onChange={(e) =>
                    patchContent({
                      hero: { ...hero, ctaHref: e.target.value },
                    })
                  }
                />
                <ImageUploadInput
                  label="Hero Image"
                  span="full"
                  ratio="hero"
                  value={hero.image ?? ""}
                  onChange={(image) =>
                    patchContent({ hero: { ...hero, image } })
                  }
                  hideUrlField
                />
              </FormGrid>
            )}

            {selected === "sections" && (
              <PageBodySectionsEditor
                value={sections as PageBodySection[]}
                onChange={(next) => patchContent({ sections: next })}
              />
            )}

            {selected === "sidebar" && (
              <div className="space-y-3">
                <p className="rounded-lg border border-[var(--admin-warning-border)] bg-[var(--admin-warning-bg)] px-3 py-2 text-xs text-[var(--admin-warning)]">
                  Add a left-side navigation list of links. Body sections render
                  to the right of this sidebar.
                </p>
                <div className="admin-form-grid admin-form-grid--tight">
                  {sidebarItems.map((it, i) => (
                    <div
                      key={i}
                      className="admin-col-6 rounded-lg border border-[var(--admin-border)] bg-white p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--admin-text-muted)]">
                          Item {i + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={i === 0}
                            onClick={() => {
                              const next = sidebarItems.slice();
                              const [v] = next.splice(i, 1);
                              next.splice(i - 1, 0, v);
                              patchContent({
                                sidebar: { ...sidebar, items: next },
                              });
                            }}
                            className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-40"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={i === sidebarItems.length - 1}
                            onClick={() => {
                              const next = sidebarItems.slice();
                              const [v] = next.splice(i, 1);
                              next.splice(i + 1, 0, v);
                              patchContent({
                                sidebar: { ...sidebar, items: next },
                              });
                            }}
                            className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-40"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              patchContent({
                                sidebar: {
                                  ...sidebar,
                                  items: sidebarItems.filter((_, j) => j !== i),
                                },
                              })
                            }
                            className="admin-btn admin-btn-danger admin-btn-sm"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <FormGrid tight>
                        <TextInput
                          label="Label"
                          span={5}
                          value={it.label ?? ""}
                          onChange={(e) =>
                            patchContent({
                              sidebar: {
                                ...sidebar,
                                items: sidebarItems.map((x, j) =>
                                  j === i ? { ...x, label: e.target.value } : x,
                                ),
                              },
                            })
                          }
                        />
                        <TextInput
                          label="URL"
                          span={7}
                          value={it.href ?? ""}
                          onChange={(e) =>
                            patchContent({
                              sidebar: {
                                ...sidebar,
                                items: sidebarItems.map((x, j) =>
                                  j === i ? { ...x, href: e.target.value } : x,
                                ),
                              },
                            })
                          }
                        />
                      </FormGrid>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      patchContent({
                        sidebar: {
                          ...sidebar,
                          items: [
                            ...sidebarItems,
                            { label: "", href: "", visible: true },
                          ],
                        },
                      })
                    }
                    className="admin-btn admin-btn-outline admin-btn-sm admin-col-full"
                  >
                    <Plus size={12} /> Add Sidebar Item
                  </button>
                </div>
                <FormGrid>
                  <TextInput
                    label="CTA Button Label (optional)"
                    span={4}
                    value={sidebar.ctaLabel ?? ""}
                    onChange={(e) =>
                      patchContent({
                        sidebar: { ...sidebar, ctaLabel: e.target.value },
                      })
                    }
                  />
                  <TextInput
                    label="CTA Button URL"
                    span={8}
                    value={sidebar.ctaHref ?? ""}
                    onChange={(e) =>
                      patchContent({
                        sidebar: { ...sidebar, ctaHref: e.target.value },
                      })
                    }
                  />
                </FormGrid>
                <div className="mt-6">
                  <p className="admin-label mb-2">Body Sections</p>
                  <PageBodySectionsEditor
                    value={sections as PageBodySection[]}
                    onChange={(next) => patchContent({ sections: next })}
                  />
                </div>
              </div>
            )}

            {selected === "gallery" && (
              <div className="space-y-3">
                <TextArea
                  label="Intro Description (optional)"
                  rows={3}
                  value={gallery.description ?? ""}
                  onChange={(e) =>
                    patchContent({
                      gallery: { ...gallery, description: e.target.value },
                    })
                  }
                />
                <div className="admin-form-grid admin-form-grid--tight">
                  {galleryImages.map((img, i) => (
                    <ItemCard
                      key={i}
                      span={4}
                      onRemove={() =>
                        patchContent({
                          gallery: {
                            ...gallery,
                            images: galleryImages.filter((_, j) => j !== i),
                          },
                        })
                      }
                      removeLabel={`Remove image ${i + 1}`}
                    >
                      <ImageUploadInput
                        label={`Image ${i + 1}`}
                        ratio="card"
                        value={img.src}
                        onChange={(src) =>
                          patchContent({
                            gallery: {
                              ...gallery,
                              images: galleryImages.map((x, j) =>
                                j === i ? { ...x, src } : x,
                              ),
                            },
                          })
                        }
                        hideUrlField
                      />
                      <FormGrid tight>
                        <TextInput
                          label="Alt Text"
                          span={6}
                          value={img.alt ?? ""}
                          onChange={(e) =>
                            patchContent({
                              gallery: {
                                ...gallery,
                                images: galleryImages.map((x, j) =>
                                  j === i ? { ...x, alt: e.target.value } : x,
                                ),
                              },
                            })
                          }
                        />
                        <TextInput
                          label="Caption (optional)"
                          span={6}
                          value={img.caption ?? ""}
                          onChange={(e) =>
                            patchContent({
                              gallery: {
                                ...gallery,
                                images: galleryImages.map((x, j) =>
                                  j === i
                                    ? { ...x, caption: e.target.value }
                                    : x,
                                ),
                              },
                            })
                          }
                        />
                      </FormGrid>
                    </ItemCard>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      patchContent({
                        gallery: {
                          ...gallery,
                          images: [
                            ...galleryImages,
                            { src: "", alt: "", caption: "" },
                          ],
                        },
                      })
                    }
                    className="admin-btn admin-btn-outline admin-btn-sm admin-col-full"
                  >
                    <Plus size={12} /> Add Image
                  </button>
                </div>
              </div>
            )}

            {selected === "contact" && (
              <FormGrid>
                <TextArea
                  label="Intro (optional)"
                  span="full"
                  rows={2}
                  value={contact.intro ?? ""}
                  onChange={(e) =>
                    patchContent({
                      contact: { ...contact, intro: e.target.value },
                    })
                  }
                />
                <TextInput
                  label="Phone"
                  span={4}
                  value={contact.phone ?? ""}
                  onChange={(e) =>
                    patchContent({
                      contact: { ...contact, phone: e.target.value },
                    })
                  }
                />
                <TextInput
                  label="Email"
                  span={4}
                  value={contact.email ?? ""}
                  onChange={(e) =>
                    patchContent({
                      contact: { ...contact, email: e.target.value },
                    })
                  }
                />
                <Field label="Address Lines" span={4}>
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={(contact.addressLines ?? []).join("\n")}
                    onChange={(e) =>
                      patchContent({
                        contact: {
                          ...contact,
                          addressLines: e.target.value
                            .split(/\r?\n/)
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    placeholder={"One address line per line"}
                  />
                </Field>
                <TextInput
                  label="Google Map Embed URL (optional)"
                  span="full"
                  value={contact.mapEmbedUrl ?? ""}
                  onChange={(e) =>
                    patchContent({
                      contact: { ...contact, mapEmbedUrl: e.target.value },
                    })
                  }
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </FormGrid>
            )}
          </>
        )
      }
      saveBar={
        <EditorSaveBar
          dirty={dirty}
          saving={saving ? "draft" : publishing ? "publish" : null}
          unpublished={doc.status !== "published"}
          message={msg && { text: msg.text, ok: msg.kind === "ok" }}
          onSaveDraft={() => void save()}
          onPublish={() => void publish()}
          onDiscard={() => {
            if (baseline === null) return;
            setDoc({ ...doc, ...(JSON.parse(baseline) as Partial<PageDoc>) });
          }}
        />
      }
    />
  );
}

/** The fields an editor changes — what dirtiness is measured on. */
function editableJson(d: PageDoc): string {
  return JSON.stringify({
    title: d.title,
    slug: d.slug,
    template: d.template,
    content: d.content,
  });
}

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <DeferredUploadsProvider>
      <PageEditorInner id={id} />
    </DeferredUploadsProvider>
  );
}
