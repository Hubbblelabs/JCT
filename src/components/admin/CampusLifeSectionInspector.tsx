"use client";

import {
  Field,
  FormGrid,
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
        <FormGrid>
          <TextInput
            label="Title"
            span={5}
            value={data.hero.title}
            onChange={(e) =>
              patch({ hero: { ...data.hero, title: e.target.value } })
            }
          />
          <TextArea
            label="Subtitle"
            span={7}
            rows={3}
            value={data.hero.subtitle}
            onChange={(e) =>
              patch({ hero: { ...data.hero, subtitle: e.target.value } })
            }
          />
          <ImageUploadInput
            label="Background Image"
            span="full"
            ratio="hero"
            value={data.hero.backgroundImage}
            onChange={(backgroundImage) =>
              patch({ hero: { ...data.hero, backgroundImage } })
            }
          />
        </FormGrid>
      );

    // ── Experience ──────────────────────────────────────────────────────────
    case "experience": {
      const exp = data.experience;
      return (
        <FormGrid>
          <TextInput
            label="Eyebrow (small label)"
            span={3}
            value={exp.eyebrow}
            onChange={(e) =>
              patch({ experience: { ...exp, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Title"
            span={5}
            value={exp.title}
            onChange={(e) =>
              patch({ experience: { ...exp, title: e.target.value } })
            }
          />
          <TextInput
            label="Title Highlight (colored word)"
            span={4}
            value={exp.titleHighlight}
            onChange={(e) =>
              patch({ experience: { ...exp, titleHighlight: e.target.value } })
            }
          />
          <TextArea
            label="Body Text"
            span={7}
            rows={4}
            value={exp.body}
            onChange={(e) =>
              patch({ experience: { ...exp, body: e.target.value } })
            }
          />
          <ImageUploadInput
            label="Section Image"
            span={5}
            ratio="card"
            value={exp.image}
            onChange={(image) => patch({ experience: { ...exp, image } })}
          />

          <Repeater<Feature>
            label="Feature Cards (max 6)"
            span="full"
            itemSpan={4}
            items={exp.features}
            onChange={(features) => patch({ experience: { ...exp, features } })}
            newItem={() => ({ icon: "", title: "", desc: "" })}
            renderItem={(feat, _i, update) => (
              <FormGrid tight>
                <TextInput
                  label="Icon name"
                  span="full"
                  placeholder="Users, Star, Zap…"
                  value={feat.icon}
                  onChange={(e) => update({ ...feat, icon: e.target.value })}
                />
                <TextInput
                  label="Title"
                  span="full"
                  value={feat.title}
                  onChange={(e) => update({ ...feat, title: e.target.value })}
                />
                <TextInput
                  label="Description"
                  span="full"
                  value={feat.desc}
                  onChange={(e) => update({ ...feat, desc: e.target.value })}
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );
    }

    // ── Highlights ──────────────────────────────────────────────────────────
    case "highlights": {
      const hl = data.highlights;
      return (
        <Repeater<Highlight>
          label="Highlight Photos (max 12)"
          itemSpan={4}
          items={hl.items}
          onChange={(items) => patch({ highlights: { ...hl, items } })}
          onItemRemove={undefined}
          newItem={() => ({ title: "", image: "" })}
          renderItem={(item, _i, update) => (
            <FormGrid tight>
              <TextInput
                label="Title"
                span="full"
                value={item.title}
                onChange={(e) => update({ ...item, title: e.target.value })}
              />
              <ImageUploadInput
                label="Photo"
                span="full"
                ratio="card"
                value={item.image}
                onChange={(image) => update({ ...item, image })}
                hideUrlField
              />
            </FormGrid>
          )}
        />
      );
    }

    // ── Services ────────────────────────────────────────────────────────────
    case "services": {
      const svc = data.services;
      return (
        <FormGrid>
          <TextInput
            label="Eyebrow"
            span={3}
            value={svc.eyebrow}
            onChange={(e) =>
              patch({ services: { ...svc, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Section Title"
            span={4}
            value={svc.title}
            onChange={(e) =>
              patch({ services: { ...svc, title: e.target.value } })
            }
          />
          <TextArea
            label="Subtitle / Description"
            span={5}
            rows={2}
            value={svc.subtitle}
            onChange={(e) =>
              patch({ services: { ...svc, subtitle: e.target.value } })
            }
          />

          <Repeater<Service>
            label="Service Cards (max 6)"
            span="full"
            itemSpan={6}
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
              <FormGrid tight>
                <TextInput
                  label="Title"
                  span={7}
                  value={item.title}
                  onChange={(e) => update({ ...item, title: e.target.value })}
                />
                <TextInput
                  label="Icon name"
                  span={5}
                  placeholder="Home, Bus, Microscope…"
                  value={item.icon}
                  onChange={(e) => update({ ...item, icon: e.target.value })}
                />
                <TextArea
                  label="Description"
                  span="full"
                  rows={3}
                  value={item.desc}
                  onChange={(e) => update({ ...item, desc: e.target.value })}
                />
                <ImageUploadInput
                  label="Image"
                  span="full"
                  ratio="card"
                  value={item.image}
                  onChange={(image) => update({ ...item, image })}
                  hideUrlField
                />
                <StringList
                  label="Bullet Points (max 5)"
                  span="full"
                  columns
                  values={item.points}
                  onChange={(points) => update({ ...item, points })}
                  placeholder="A feature or highlight…"
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );
    }

    // ── Sports ──────────────────────────────────────────────────────────────
    case "sports": {
      const sp = data.sports;
      return (
        <FormGrid>
          <TextInput
            label="Eyebrow"
            span={3}
            value={sp.eyebrow}
            onChange={(e) =>
              patch({ sports: { ...sp, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Title"
            span={5}
            value={sp.title}
            onChange={(e) =>
              patch({ sports: { ...sp, title: e.target.value } })
            }
          />
          <TextInput
            label="Title Highlight (colored word)"
            span={4}
            value={sp.titleHighlight}
            onChange={(e) =>
              patch({ sports: { ...sp, titleHighlight: e.target.value } })
            }
          />
          <TextArea
            label="Body Text"
            span="full"
            rows={3}
            value={sp.body}
            onChange={(e) => patch({ sports: { ...sp, body: e.target.value } })}
          />

          <Repeater<SportStat>
            label="Stats (max 6)"
            span={5}
            itemSpan={6}
            items={sp.stats}
            onChange={(stats) => patch({ sports: { ...sp, stats } })}
            newItem={() => ({ label: "", val: "" })}
            renderItem={(stat, _i, update) => (
              <FormGrid tight>
                <TextInput
                  label="Value"
                  span="full"
                  value={stat.val}
                  onChange={(e) => update({ ...stat, val: e.target.value })}
                />
                <TextInput
                  label="Label"
                  span="full"
                  value={stat.label}
                  onChange={(e) => update({ ...stat, label: e.target.value })}
                />
              </FormGrid>
            )}
          />

          <Field label="Highlight Card" span={7}>
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
          </Field>

          <Field label="Gallery Images (max 4)" span="full">
            <div className="admin-form-grid admin-form-grid--tight">
              {[0, 1, 2, 3].map((idx) => (
                <ImageUploadInput
                  key={idx}
                  label={`Sports Image ${idx + 1}`}
                  span={3}
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
            </div>
          </Field>
        </FormGrid>
      );
    }

    // ── Clubs ───────────────────────────────────────────────────────────────
    case "clubs": {
      const cl = data.clubs;
      return (
        <FormGrid>
          <TextInput
            label="Eyebrow"
            span={4}
            value={cl.eyebrow}
            onChange={(e) =>
              patch({ clubs: { ...cl, eyebrow: e.target.value } })
            }
          />
          <TextInput
            label="Section Title"
            span={8}
            value={cl.title}
            onChange={(e) => patch({ clubs: { ...cl, title: e.target.value } })}
          />

          <TextInput
            label="Featured Title"
            span={4}
            value={cl.featuredTitle}
            onChange={(e) =>
              patch({ clubs: { ...cl, featuredTitle: e.target.value } })
            }
          />
          <TextArea
            label="Featured Description"
            span={8}
            rows={2}
            value={cl.featuredDesc}
            onChange={(e) =>
              patch({ clubs: { ...cl, featuredDesc: e.target.value } })
            }
          />
          <ImageUploadInput
            label="Featured Image"
            span="full"
            ratio="hero"
            value={cl.featuredImage}
            onChange={(featuredImage) =>
              patch({ clubs: { ...cl, featuredImage } })
            }
            hideUrlField
          />
          <StringList
            label="Tags (max 8)"
            span="full"
            columns
            values={cl.tags}
            onChange={(tags) => patch({ clubs: { ...cl, tags } })}
            placeholder="e.g. Music, Dance…"
          />

          <Repeater<ClubEvent>
            label="Events / Clubs (max 6)"
            span="full"
            itemSpan={4}
            items={cl.events}
            onChange={(events) => patch({ clubs: { ...cl, events } })}
            newItem={() => ({ icon: "", title: "", description: "" })}
            renderItem={(event, _i, update) => (
              <FormGrid tight>
                <TextInput
                  label="Icon name"
                  span="full"
                  placeholder="Zap, Music, Trophy…"
                  value={event.icon}
                  onChange={(e) => update({ ...event, icon: e.target.value })}
                />
                <TextInput
                  label="Title"
                  span="full"
                  value={event.title}
                  onChange={(e) => update({ ...event, title: e.target.value })}
                />
                <TextArea
                  label="Description"
                  span="full"
                  rows={3}
                  value={event.description}
                  onChange={(e) =>
                    update({ ...event, description: e.target.value })
                  }
                />
              </FormGrid>
            )}
          />
        </FormGrid>
      );
    }

    // ── CTA ─────────────────────────────────────────────────────────────────
    case "cta":
      return (
        <FormGrid>
          <TextInput
            label="Title"
            span={5}
            value={data.cta.title}
            onChange={(e) =>
              patch({ cta: { ...data.cta, title: e.target.value } })
            }
          />
          <TextArea
            label="Description"
            span={7}
            rows={2}
            value={data.cta.description}
            onChange={(e) =>
              patch({ cta: { ...data.cta, description: e.target.value } })
            }
          />
          <TextInput
            label="Button Label"
            span={4}
            value={data.cta.ctaLabel}
            onChange={(e) =>
              patch({ cta: { ...data.cta, ctaLabel: e.target.value } })
            }
          />
          <TextInput
            label="Button URL"
            span={8}
            value={data.cta.ctaHref}
            onChange={(e) =>
              patch({ cta: { ...data.cta, ctaHref: e.target.value } })
            }
          />
        </FormGrid>
      );

    default:
      return null;
  }
}
