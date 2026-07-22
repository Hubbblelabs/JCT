"use client";

import {
  TextInput,
  TextArea,
  StringList,
  ImageUploadInput,
  Repeater,
} from "@/components/admin/inputs";
import type { CampusLifeEditableSection } from "@/components/layout/CampusLifePageLayout";
import type { CampusLifePageValue } from "@/lib/validation";

type Feature = CampusLifePageValue["experience"]["features"][number];
type Highlight = CampusLifePageValue["highlights"]["items"][number];
type Service = CampusLifePageValue["services"]["items"][number];
type SportStat = CampusLifePageValue["sports"]["stats"][number];
type ClubEvent = CampusLifePageValue["clubs"]["events"][number];

export function CampusLifeSectionInspector({
  section,
  data,
  onChange,
}: {
  section: CampusLifeEditableSection;
  data: CampusLifePageValue;
  onChange: (next: CampusLifePageValue) => void;
}) {
  const patch = (p: Partial<CampusLifePageValue>) =>
    onChange({ ...data, ...p });

  switch (section) {
    // ── Hero ────────────────────────────────────────────────────────────────
    case "hero":
      return (
        <>
          <ImageUploadInput
            label="Background Image"
            ratio="hero"
            value={data.hero.backgroundImage}
            onChange={(backgroundImage) =>
              patch({ hero: { ...data.hero, backgroundImage } })
            }
          />
          <TextInput
            label="Title"
            value={data.hero.title}
            onChange={(e) =>
              patch({ hero: { ...data.hero, title: e.target.value } })
            }
          />
          <TextArea
            label="Subtitle"
            rows={3}
            value={data.hero.subtitle}
            onChange={(e) =>
              patch({ hero: { ...data.hero, subtitle: e.target.value } })
            }
          />
        </>
      );

    // ── Experience ──────────────────────────────────────────────────────────
    case "experience": {
      const exp = data.experience;
      return (
        <>
          <TextInput
            label="Eyebrow (small label)"
            value={exp.eyebrow}
            onChange={(e) =>
              patch({ experience: { ...exp, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Title"
            value={exp.title}
            onChange={(e) =>
              patch({ experience: { ...exp, title: e.target.value } })
            }
          />
          <TextInput
            label="Title Highlight (colored word)"
            value={exp.titleHighlight}
            onChange={(e) =>
              patch({ experience: { ...exp, titleHighlight: e.target.value } })
            }
          />
          <TextArea
            label="Body Text"
            rows={4}
            value={exp.body}
            onChange={(e) =>
              patch({ experience: { ...exp, body: e.target.value } })
            }
          />
          <ImageUploadInput
            label="Section Image"
            ratio="card"
            value={exp.image}
            onChange={(image) => patch({ experience: { ...exp, image } })}
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Feature Cards (max 6)
          </div>
          <Repeater<Feature>
            label="Features"
            items={exp.features}
            onChange={(features) => patch({ experience: { ...exp, features } })}
            newItem={() => ({ icon: "", title: "", desc: "" })}
            renderItem={(feat, _i, update) => (
              <div className="space-y-2 pr-8">
                <TextInput
                  label="Icon name (e.g. Users, Star, Zap)"
                  value={feat.icon}
                  onChange={(e) => update({ ...feat, icon: e.target.value })}
                />
                <TextInput
                  label="Title"
                  value={feat.title}
                  onChange={(e) => update({ ...feat, title: e.target.value })}
                />
                <TextInput
                  label="Description"
                  value={feat.desc}
                  onChange={(e) => update({ ...feat, desc: e.target.value })}
                />
              </div>
            )}
          />
        </>
      );
    }

    // ── Highlights ──────────────────────────────────────────────────────────
    case "highlights": {
      const hl = data.highlights;
      return (
        <Repeater<Highlight>
          label="Highlight Photos (max 12)"
          items={hl.items}
          onChange={(items) => patch({ highlights: { ...hl, items } })}
          onItemRemove={undefined}
          newItem={() => ({ title: "", image: "" })}
          renderItem={(item, _i, update) => (
            <div className="space-y-2 pr-8">
              <TextInput
                label="Title"
                value={item.title}
                onChange={(e) => update({ ...item, title: e.target.value })}
              />
              <ImageUploadInput
                label="Photo"
                ratio="card"
                value={item.image}
                onChange={(image) => update({ ...item, image })}
                hideUrlField
              />
            </div>
          )}
        />
      );
    }

    // ── Services ────────────────────────────────────────────────────────────
    case "services": {
      const svc = data.services;
      return (
        <>
          <TextInput
            label="Eyebrow"
            value={svc.eyebrow}
            onChange={(e) =>
              patch({ services: { ...svc, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Section Title"
            value={svc.title}
            onChange={(e) =>
              patch({ services: { ...svc, title: e.target.value } })
            }
          />
          <TextArea
            label="Subtitle / Description"
            rows={3}
            value={svc.subtitle}
            onChange={(e) =>
              patch({ services: { ...svc, subtitle: e.target.value } })
            }
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Service Cards (max 6)
          </div>
          <Repeater<Service>
            label="Services"
            items={svc.items}
            onChange={(items) => patch({ services: { ...svc, items } })}
            onItemRemove={undefined}
            newItem={() => ({
              title: "",
              desc: "",
              image: "",
              icon: "",
              points: [],
            })}
            renderItem={(item, _i, update) => (
              <div className="space-y-2 pr-8">
                <TextInput
                  label="Title"
                  value={item.title}
                  onChange={(e) => update({ ...item, title: e.target.value })}
                />
                <TextArea
                  label="Description"
                  rows={3}
                  value={item.desc}
                  onChange={(e) => update({ ...item, desc: e.target.value })}
                />
                <ImageUploadInput
                  label="Image"
                  ratio="card"
                  value={item.image}
                  onChange={(image) => update({ ...item, image })}
                  hideUrlField
                />
                <TextInput
                  label="Icon name (e.g. Home, Bus, Microscope)"
                  value={item.icon}
                  onChange={(e) => update({ ...item, icon: e.target.value })}
                />
                <StringList
                  label="Bullet Points (max 5)"
                  values={item.points}
                  onChange={(points) => update({ ...item, points })}
                  placeholder="A feature or highlight…"
                />
              </div>
            )}
          />
        </>
      );
    }

    // ── Sports ──────────────────────────────────────────────────────────────
    case "sports": {
      const sp = data.sports;
      return (
        <>
          <TextInput
            label="Eyebrow"
            value={sp.eyebrow}
            onChange={(e) =>
              patch({ sports: { ...sp, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Title"
            value={sp.title}
            onChange={(e) =>
              patch({ sports: { ...sp, title: e.target.value } })
            }
          />
          <TextInput
            label="Title Highlight (colored word)"
            value={sp.titleHighlight}
            onChange={(e) =>
              patch({ sports: { ...sp, titleHighlight: e.target.value } })
            }
          />
          <TextArea
            label="Body Text"
            rows={4}
            value={sp.body}
            onChange={(e) => patch({ sports: { ...sp, body: e.target.value } })}
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Stats (max 6)
          </div>
          <Repeater<SportStat>
            label="Stats"
            items={sp.stats}
            onChange={(stats) => patch({ sports: { ...sp, stats } })}
            newItem={() => ({ label: "", val: "" })}
            renderItem={(stat, _i, update) => (
              <div className="flex gap-2 pr-8">
                <TextInput
                  label="Value"
                  value={stat.val}
                  onChange={(e) => update({ ...stat, val: e.target.value })}
                />
                <TextInput
                  label="Label"
                  value={stat.label}
                  onChange={(e) => update({ ...stat, label: e.target.value })}
                />
              </div>
            )}
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Gallery Images (max 4)
          </div>
          {[0, 1, 2, 3].map((idx) => (
            <ImageUploadInput
              key={idx}
              label={`Sports Image ${idx + 1}`}
              ratio="card"
              value={sp.images[idx] ?? ""}
              onChange={(url) => {
                const next = [...sp.images];
                next[idx] = url;
                patch({ sports: { ...sp, images: next } });
              }}
              hideUrlField
            />
          ))}

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Highlight Card
          </div>
          <TextInput
            label="Card Title"
            value={sp.highlightTitle}
            onChange={(e) =>
              patch({ sports: { ...sp, highlightTitle: e.target.value } })
            }
          />
          <TextArea
            label="Card Description"
            rows={3}
            value={sp.highlightDesc}
            onChange={(e) =>
              patch({ sports: { ...sp, highlightDesc: e.target.value } })
            }
          />
        </>
      );
    }

    // ── Clubs ───────────────────────────────────────────────────────────────
    case "clubs": {
      const cl = data.clubs;
      return (
        <>
          <TextInput
            label="Eyebrow"
            value={cl.eyebrow}
            onChange={(e) =>
              patch({ clubs: { ...cl, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Section Title"
            value={cl.title}
            onChange={(e) => patch({ clubs: { ...cl, title: e.target.value } })}
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Featured Banner
          </div>
          <ImageUploadInput
            label="Featured Image"
            ratio="hero"
            value={cl.featuredImage}
            onChange={(featuredImage) =>
              patch({ clubs: { ...cl, featuredImage } })
            }
            hideUrlField
          />
          <TextInput
            label="Featured Title"
            value={cl.featuredTitle}
            onChange={(e) =>
              patch({ clubs: { ...cl, featuredTitle: e.target.value } })
            }
          />
          <TextArea
            label="Featured Description"
            rows={3}
            value={cl.featuredDesc}
            onChange={(e) =>
              patch({ clubs: { ...cl, featuredDesc: e.target.value } })
            }
          />
          <StringList
            label="Tags (max 8)"
            values={cl.tags}
            onChange={(tags) => patch({ clubs: { ...cl, tags } })}
            placeholder="e.g. Music, Dance…"
          />

          <div className="admin-label mt-5 mb-2 border-t border-gray-100 pt-4">
            Events / Clubs (max 6)
          </div>
          <Repeater<ClubEvent>
            label="Events"
            items={cl.events}
            onChange={(events) => patch({ clubs: { ...cl, events } })}
            newItem={() => ({ icon: "", title: "", description: "" })}
            renderItem={(event, _i, update) => (
              <div className="space-y-2 pr-8">
                <TextInput
                  label="Icon name (e.g. Zap, Music, Trophy)"
                  value={event.icon}
                  onChange={(e) => update({ ...event, icon: e.target.value })}
                />
                <TextInput
                  label="Title"
                  value={event.title}
                  onChange={(e) => update({ ...event, title: e.target.value })}
                />
                <TextArea
                  label="Description"
                  rows={3}
                  value={event.description}
                  onChange={(e) =>
                    update({ ...event, description: e.target.value })
                  }
                />
              </div>
            )}
          />
        </>
      );
    }

    // ── CTA ─────────────────────────────────────────────────────────────────
    case "cta":
      return (
        <>
          <TextInput
            label="Title"
            value={data.cta.title}
            onChange={(e) =>
              patch({ cta: { ...data.cta, title: e.target.value } })
            }
          />
          <TextArea
            label="Description"
            rows={3}
            value={data.cta.description}
            onChange={(e) =>
              patch({ cta: { ...data.cta, description: e.target.value } })
            }
          />
          <TextInput
            label="Button Label"
            value={data.cta.ctaLabel}
            onChange={(e) =>
              patch({ cta: { ...data.cta, ctaLabel: e.target.value } })
            }
          />
          <TextInput
            label="Button URL"
            value={data.cta.ctaHref}
            onChange={(e) =>
              patch({ cta: { ...data.cta, ctaHref: e.target.value } })
            }
          />
        </>
      );

    default:
      return null;
  }
}
