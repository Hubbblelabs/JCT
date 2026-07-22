"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import {
  Field,
  ImageUploadInput,
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

const TAB_DEFS: { id: string; label: string; templates: Template[] }[] = [
  {
    id: "basic",
    label: "Basic",
    templates: ["standard", "hero-content", "sidebar", "gallery", "contact"],
  },
  {
    id: "seo",
    label: "SEO",
    templates: ["standard", "hero-content", "sidebar", "gallery", "contact"],
  },
  { id: "hero", label: "Hero", templates: ["hero-content"] },
  {
    id: "sections",
    label: "Body Sections",
    templates: ["standard", "hero-content", "sidebar"],
  },
  { id: "sidebar", label: "Sidebar", templates: ["sidebar"] },
  { id: "gallery", label: "Gallery", templates: ["gallery"] },
  { id: "contact", label: "Contact", templates: ["contact"] },
];

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
  const [activeTab, setActiveTab] = useState("basic");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/pages/${id}`);
      if (!r.ok) {
        setMsg({ kind: "err", text: "Failed to load page." });
        return;
      }
      const data = await r.json();
      setDoc({ ...data, content: data.content ?? {} });
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
        setDoc({ ...data, content: data.content ?? {} });
        setMsg({ kind: "ok", text: "Saved." });
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
  };

  const publish = async () => {
    if (!doc) return;
    const ok = await confirm({
      title: "Publish page",
      message: `Publish "${doc.title}"? The current draft will become the live version.`,
      confirmLabel: "Publish",
    });
    if (!ok) return;
    await save();
    setPublishing(true);
    try {
      const r = await fetch(`/api/admin/pages/${doc._id}/publish`, {
        method: "POST",
      });
      if (r.ok) {
        const data = await r.json();
        setDoc({ ...data, content: data.content ?? {} });
        setMsg({ kind: "ok", text: `Published v${data.version}.` });
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

  if (loading || !doc) {
    return (
      <div className="admin-content">
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const visibleTabs = TAB_DEFS.filter((t) =>
    t.templates.includes(doc.template),
  );
  const hero = (doc.content.hero ?? {}) as PageHero;
  const seo = (doc.content.seo ?? {}) as PageSeo;
  const sidebar = (doc.content.sidebar ?? {}) as SidebarBlock;
  const gallery = (doc.content.gallery ?? { images: [] }) as GalleryBlock;
  const contact = (doc.content.contact ?? {}) as ContactBlock;
  const sections = doc.content.sections ?? [];
  const sidebarItems = Array.isArray(sidebar.items) ? sidebar.items : [];
  const galleryImages = Array.isArray(gallery.images) ? gallery.images : [];

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{doc.title || "(untitled)"}</h1>
          <p className="admin-page-subtitle">
            {doc.institution} · {doc.template} · /{doc.slug} · v{doc.version} ·{" "}
            <span
              className={
                doc.status === "published"
                  ? "font-semibold text-green-700"
                  : "font-semibold text-amber-700"
              }
            >
              {doc.status}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {doc.status === "published" && (
            <a
              href={publicPathFor(doc.institution, doc.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-outline"
            >
              <ExternalLink size={14} /> View
            </a>
          )}
          <button
            onClick={() => save()}
            disabled={saving}
            className="admin-btn admin-btn-outline"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save Draft
          </button>
          <button
            onClick={publish}
            disabled={publishing || saving}
            className="admin-btn admin-btn-gold"
          >
            {publishing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Publish
          </button>
        </div>
      </div>

      {msg && msg.kind === "ok" && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {msg.text}
        </p>
      )}
      {apiError && (
        <ValidationErrors
          error={apiError.message ?? apiError.error}
          details={apiError.details}
        />
      )}
      {msg && msg.kind === "err" && !apiError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {msg.text}
        </p>
      )}

      <div className="admin-card mb-4">
        <div className="mb-4 flex flex-wrap gap-1 border-b border-gray-200 pb-2">
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === t.id
                  ? "bg-amber-100 text-amber-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "basic" && (
          <div className="space-y-3">
            <TextInput
              label="Title"
              value={doc.title}
              onChange={(e) => setDoc({ ...doc, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Slug (URL)"
                value={doc.slug}
                onChange={(e) => setDoc({ ...doc, slug: e.target.value })}
                hint="Lowercase letters, numbers, and dashes."
              />
              <Field label="Public URL">
                <input
                  className="admin-input"
                  value={publicPathFor(doc.institution, doc.slug)}
                  disabled
                />
              </Field>
            </div>
            <Link
              href="/admin/pages"
              className="text-sm text-amber-700 hover:underline"
            >
              ← Back to pages
            </Link>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-3">
            <TextInput
              label="Meta Title"
              value={seo.metaTitle ?? ""}
              onChange={(e) =>
                patchContent({ seo: { ...seo, metaTitle: e.target.value } })
              }
              hint="Defaults to the page title if blank."
            />
            <TextArea
              label="Meta Description"
              rows={3}
              value={seo.metaDescription ?? ""}
              onChange={(e) =>
                patchContent({
                  seo: { ...seo, metaDescription: e.target.value },
                })
              }
            />
            <ImageUploadInput
              label="Open Graph Image (optional)"
              ratio="hero"
              value={seo.ogImage ?? ""}
              onChange={(ogImage) => patchContent({ seo: { ...seo, ogImage } })}
              hideUrlField
            />
            <Field label="Keywords (comma-separated)">
              <input
                className="admin-input"
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={seo.noindex === true}
                onChange={(e) =>
                  patchContent({ seo: { ...seo, noindex: e.target.checked } })
                }
              />
              Hide from search engines (noindex)
            </label>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="space-y-3">
            <TextInput
              label="Hero Title"
              value={hero.title ?? ""}
              onChange={(e) =>
                patchContent({ hero: { ...hero, title: e.target.value } })
              }
            />
            <TextArea
              label="Hero Subtitle"
              rows={3}
              value={hero.subtitle ?? ""}
              onChange={(e) =>
                patchContent({ hero: { ...hero, subtitle: e.target.value } })
              }
            />
            <ImageUploadInput
              label="Hero Image"
              ratio="hero"
              value={hero.image ?? ""}
              onChange={(image) => patchContent({ hero: { ...hero, image } })}
              hideUrlField
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="CTA Label"
                value={hero.ctaLabel ?? ""}
                onChange={(e) =>
                  patchContent({
                    hero: { ...hero, ctaLabel: e.target.value },
                  })
                }
              />
              <TextInput
                label="CTA URL"
                value={hero.ctaHref ?? ""}
                onChange={(e) =>
                  patchContent({
                    hero: { ...hero, ctaHref: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}

        {activeTab === "sections" && (
          <PageBodySectionsEditor
            value={sections as PageBodySection[]}
            onChange={(next) => patchContent({ sections: next })}
          />
        )}

        {activeTab === "sidebar" && (
          <div className="space-y-3">
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Add a left-side navigation list of links. Body sections render to
              the right of this sidebar.
            </p>
            <div className="space-y-2">
              {sidebarItems.map((it, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
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
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      label="Label"
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
                  </div>
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
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <Plus size={12} /> Add Sidebar Item
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="CTA Button Label (optional)"
                value={sidebar.ctaLabel ?? ""}
                onChange={(e) =>
                  patchContent({
                    sidebar: { ...sidebar, ctaLabel: e.target.value },
                  })
                }
              />
              <TextInput
                label="CTA Button URL"
                value={sidebar.ctaHref ?? ""}
                onChange={(e) =>
                  patchContent({
                    sidebar: { ...sidebar, ctaHref: e.target.value },
                  })
                }
              />
            </div>
            <div className="mt-6">
              <p className="admin-label mb-2">Body Sections</p>
              <PageBodySectionsEditor
                value={sections as PageBodySection[]}
                onChange={(next) => patchContent({ sections: next })}
              />
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
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
            <div className="space-y-2">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Image {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        patchContent({
                          gallery: {
                            ...gallery,
                            images: galleryImages.filter((_, j) => j !== i),
                          },
                        })
                      }
                      className="admin-btn admin-btn-danger admin-btn-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <ImageUploadInput
                    label="Image"
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
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      label="Alt Text"
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
                      value={img.caption ?? ""}
                      onChange={(e) =>
                        patchContent({
                          gallery: {
                            ...gallery,
                            images: galleryImages.map((x, j) =>
                              j === i ? { ...x, caption: e.target.value } : x,
                            ),
                          },
                        })
                      }
                    />
                  </div>
                </div>
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
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <Plus size={12} /> Add Image
              </button>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-3">
            <TextArea
              label="Intro (optional)"
              rows={3}
              value={contact.intro ?? ""}
              onChange={(e) =>
                patchContent({
                  contact: { ...contact, intro: e.target.value },
                })
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Phone"
                value={contact.phone ?? ""}
                onChange={(e) =>
                  patchContent({
                    contact: { ...contact, phone: e.target.value },
                  })
                }
              />
              <TextInput
                label="Email"
                value={contact.email ?? ""}
                onChange={(e) =>
                  patchContent({
                    contact: { ...contact, email: e.target.value },
                  })
                }
              />
            </div>
            <Field label="Address Lines">
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
              value={contact.mapEmbedUrl ?? ""}
              onChange={(e) =>
                patchContent({
                  contact: { ...contact, mapEmbedUrl: e.target.value },
                })
              }
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        )}
      </div>

      <button
        onClick={() => {
          (async () => {
            const ok = await confirm({
              title: "Delete page",
              message: "Delete this page permanently? This cannot be undone.",
              confirmLabel: "Delete",
              destructive: true,
            });
            if (!ok) return;
            const r = await fetch(`/api/admin/pages/${doc._id}`, {
              method: "DELETE",
            });
            if (r.ok) router.push("/admin/pages");
            else toast.error("Delete failed.");
          })();
        }}
        className="admin-btn admin-btn-danger admin-btn-sm"
      >
        <Trash2 size={12} /> Delete Page
      </button>
    </div>
  );
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
