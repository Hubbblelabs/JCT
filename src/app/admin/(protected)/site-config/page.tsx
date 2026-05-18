"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { TextInput, NumberInput, TextArea, ImageUploadInput } from "@/components/admin/inputs";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";

const CONFIG_KEYS = [
  { key: "contact", label: "Contact" },
  { key: "social", label: "Social Links" },
  { key: "stats", label: "Statistics" },
  { key: "address", label: "Address" },
  { key: "accreditations", label: "Accreditations" },
  { key: "home", label: "Home Hero" },
  { key: "engineeringMetrics", label: "Eng. Metrics" },
  { key: "engineeringFacilities", label: "Eng. Facilities" },
  { key: "engineeringResearchHighlights", label: "Eng. Research" },
  { key: "artsScienceHeroStats", label: "Arts & Science Hero Stats" },
];

type ContactVal = { phone?: string; phoneAlt?: string; email?: string; admissionsEmail?: string; whatsapp?: string };
type SocialVal = { facebook?: string; instagram?: string; twitter?: string; linkedin?: string; youtube?: string };
type StatsVal = { yearsOfExcellence?: number; students?: number; faculty?: number; recruiters?: number; alumni?: number; programs?: number; placementRate?: number; highestPackage?: string; averagePackage?: string };
type AddressVal = { line1?: string; line2?: string; city?: string; pincode?: string; state?: string; country?: string; full?: string; mapEmbedUrl?: string; mapUrl?: string };
type Accreditation = { name: string; logo: string; description: string };

type HeroCta = { label: string; href: string; primary: boolean };
type HeroCard = {
  title: string;
  description: string;
  href: string;
  icon: string;
  ctaLabel: string;
  highlights: string;
};
type HomeVal = {
  backgroundImages?: string[];
  titleLines?: string[];
  ctas?: HeroCta[];
  trustHighlights?: { icon: string; label: string }[];
  cards?: HeroCard[];
};

type MetricVal = { value: string; label: string; sub?: string };
type FacilityVal = { title: string; desc?: string };
type HeroStatVal = { value: string; label: string; accent?: boolean };

function ContactForm({ value, onChange }: { value: ContactVal; onChange: (v: ContactVal) => void }) {
  const set = (k: keyof ContactVal, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid grid-cols-2 gap-4">
      <TextInput label="Phone" value={value.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
      <TextInput label="Email" value={value.email ?? ""} onChange={(e) => set("email", e.target.value)} />
      <TextInput label="Admissions Email" value={value.admissionsEmail ?? ""} onChange={(e) => set("admissionsEmail", e.target.value)} />
      <TextInput label="WhatsApp Number" value={value.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} hint="Include country code, no + sign: 919361..." />
    </div>
  );
}

function SocialForm({ value, onChange }: { value: SocialVal; onChange: (v: SocialVal) => void }) {
  const set = (k: keyof SocialVal, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-1">
      <TextInput label="Facebook URL" value={value.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/..." />
      <TextInput label="Instagram URL" value={value.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/..." />
      <TextInput label="Twitter / X URL" value={value.twitter ?? ""} onChange={(e) => set("twitter", e.target.value)} placeholder="https://x.com/..." />
      <TextInput label="LinkedIn URL" value={value.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/..." />
      <TextInput label="YouTube URL" value={value.youtube ?? ""} onChange={(e) => set("youtube", e.target.value)} placeholder="https://youtube.com/..." />
    </div>
  );
}

function StatsForm({ value, onChange }: { value: StatsVal; onChange: (v: StatsVal) => void }) {
  const setN = (k: keyof StatsVal, v: string) => onChange({ ...value, [k]: Number(v) });
  const setS = (k: keyof StatsVal, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid grid-cols-2 gap-4">
      <NumberInput label="Years of Excellence" value={value.yearsOfExcellence ?? 0} onChange={(e) => setN("yearsOfExcellence", e.target.value)} />
      <NumberInput label="Students" value={value.students ?? 0} onChange={(e) => setN("students", e.target.value)} />
      <NumberInput label="Faculty" value={value.faculty ?? 0} onChange={(e) => setN("faculty", e.target.value)} />
      <NumberInput label="Recruiters" value={value.recruiters ?? 0} onChange={(e) => setN("recruiters", e.target.value)} />
      <NumberInput label="Alumni" value={value.alumni ?? 0} onChange={(e) => setN("alumni", e.target.value)} />
      <NumberInput label="Programs" value={value.programs ?? 0} onChange={(e) => setN("programs", e.target.value)} />
      <NumberInput label="Placement Rate (%)" value={value.placementRate ?? 0} onChange={(e) => setN("placementRate", e.target.value)} />
      <TextInput label="Highest Package" value={value.highestPackage ?? ""} onChange={(e) => setS("highestPackage", e.target.value)} placeholder="70 LPA" />
      <TextInput label="Average Package" value={value.averagePackage ?? ""} onChange={(e) => setS("averagePackage", e.target.value)} placeholder="9 LPA" />
    </div>
  );
}

function AddressForm({ value, onChange }: { value: AddressVal; onChange: (v: AddressVal) => void }) {
  const set = (k: keyof AddressVal, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Line 1" value={value.line1 ?? ""} onChange={(e) => set("line1", e.target.value)} />
        <TextInput label="Line 2" value={value.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} />
        <TextInput label="City" value={value.city ?? ""} onChange={(e) => set("city", e.target.value)} />
        <TextInput label="Pincode" value={value.pincode ?? ""} onChange={(e) => set("pincode", e.target.value)} />
        <TextInput label="State" value={value.state ?? ""} onChange={(e) => set("state", e.target.value)} />
        <TextInput label="Country" value={value.country ?? ""} onChange={(e) => set("country", e.target.value)} />
      </div>
      <TextArea label="Full Address" value={value.full ?? ""} onChange={(e) => set("full", e.target.value)} rows={2} />
      <TextInput label="Map URL" value={value.mapUrl ?? ""} onChange={(e) => set("mapUrl", e.target.value)} placeholder="https://maps.google.com/..." />
      <TextArea label="Map Embed URL" value={value.mapEmbedUrl ?? ""} onChange={(e) => set("mapEmbedUrl", e.target.value)} rows={2} hint="The iframe src URL from Google Maps embed" />
    </div>
  );
}

function AccreditationsForm({ value, onChange }: { value: Accreditation[]; onChange: (v: Accreditation[]) => void }) {
  const safeValue = Array.isArray(value) ? value : [];
  const setItem = (i: number, k: keyof Accreditation, v: string) => {
    const next = [...safeValue];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {safeValue.map((item, i) => (
        <div key={i} className="relative rounded-lg border border-gray-200 p-4">
          <button
            type="button"
            onClick={() => onChange(safeValue.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm absolute top-3 right-3"
          >
            <Trash2 size={13} />
          </button>
          <div className="grid grid-cols-2 gap-3 pr-16">
            <TextInput label="Name" value={item.name} onChange={(e) => setItem(i, "name", e.target.value)} />
            <TextInput label="Description" value={item.description} onChange={(e) => setItem(i, "description", e.target.value)} />
          </div>
          <ImageUploadInput label="Logo" value={item.logo} onChange={(url) => setItem(i, "logo", url)} uploadOnly />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...safeValue, { name: "", logo: "", description: "" }])}
        className="admin-btn admin-btn-outline admin-btn-sm"
      >
        <Plus size={14} /> Add Accreditation
      </button>
    </div>
  );
}

function HomeForm({ value, onChange }: { value: HomeVal; onChange: (v: HomeVal) => void }) {
  const bg = value.backgroundImages ?? [];
  const titles = value.titleLines ?? [];
  const ctas = value.ctas ?? [];
  const trust = value.trustHighlights ?? [];
  const cards = value.cards ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Background Images</h3>
        <div className="space-y-2">
          {bg.map((src, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <ImageUploadInput
                  label=""
                  value={src}
                  onChange={(url) =>
                    onChange({ ...value, backgroundImages: bg.map((s, j) => (j === i ? url : s)) })
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...value, backgroundImages: bg.filter((_, j) => j !== i) })}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, backgroundImages: [...bg, ""] })}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={14} /> Add Background Image
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Title Lines</h3>
        <div className="space-y-2">
          {titles.map((line, i) => (
            <div key={i} className="flex gap-2">
              <TextInput
                label=""
                value={line}
                onChange={(e) =>
                  onChange({ ...value, titleLines: titles.map((s, j) => (j === i ? e.target.value : s)) })
                }
              />
              <button
                type="button"
                onClick={() => onChange({ ...value, titleLines: titles.filter((_, j) => j !== i) })}
                className="admin-btn admin-btn-danger admin-btn-sm self-start"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, titleLines: [...titles, ""] })}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={14} /> Add Title Line
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Call-to-Action Buttons</h3>
        <div className="space-y-3">
          {ctas.map((cta, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="grid grid-cols-2 gap-3 pr-12">
                <TextInput
                  label="Label"
                  value={cta.label}
                  onChange={(e) =>
                    onChange({ ...value, ctas: ctas.map((c, j) => (j === i ? { ...c, label: e.target.value } : c)) })
                  }
                />
                <TextInput
                  label="Href"
                  value={cta.href}
                  onChange={(e) =>
                    onChange({ ...value, ctas: ctas.map((c, j) => (j === i ? { ...c, href: e.target.value } : c)) })
                  }
                />
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cta.primary}
                  onChange={(e) =>
                    onChange({ ...value, ctas: ctas.map((c, j) => (j === i ? { ...c, primary: e.target.checked } : c)) })
                  }
                />
                Primary
              </label>
              <button
                type="button"
                onClick={() => onChange({ ...value, ctas: ctas.filter((_, j) => j !== i) })}
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, ctas: [...ctas, { label: "", href: "", primary: false }] })}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={14} /> Add CTA
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Trust Highlights</h3>
        <div className="space-y-2">
          {trust.map((item, i) => (
            <div key={i} className="flex items-end gap-2 rounded-lg border border-gray-200 p-3">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <TextInput
                  label="Icon (laurel/users/cap/badge)"
                  value={item.icon}
                  onChange={(e) =>
                    onChange({ ...value, trustHighlights: trust.map((t, j) => (j === i ? { ...t, icon: e.target.value } : t)) })
                  }
                />
                <TextInput
                  label="Label"
                  value={item.label}
                  onChange={(e) =>
                    onChange({ ...value, trustHighlights: trust.map((t, j) => (j === i ? { ...t, label: e.target.value } : t)) })
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...value, trustHighlights: trust.filter((_, j) => j !== i) })}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, trustHighlights: [...trust, { icon: "laurel", label: "" }] })}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={14} /> Add Highlight
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Institution Cards</h3>
        <div className="space-y-3">
          {cards.map((card, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Title"
                  value={card.title}
                  onChange={(e) =>
                    onChange({ ...value, cards: cards.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)) })
                  }
                />
                <TextInput
                  label="Href"
                  value={card.href}
                  onChange={(e) =>
                    onChange({ ...value, cards: cards.map((c, j) => (j === i ? { ...c, href: e.target.value } : c)) })
                  }
                />
                <TextInput
                  label="Icon Key (engineering/arts/polytechnic)"
                  value={card.icon}
                  onChange={(e) =>
                    onChange({ ...value, cards: cards.map((c, j) => (j === i ? { ...c, icon: e.target.value } : c)) })
                  }
                />
                <TextInput
                  label="CTA Label"
                  value={card.ctaLabel}
                  onChange={(e) =>
                    onChange({ ...value, cards: cards.map((c, j) => (j === i ? { ...c, ctaLabel: e.target.value } : c)) })
                  }
                />
              </div>
              <TextArea
                label="Description"
                value={card.description}
                onChange={(e) =>
                  onChange({ ...value, cards: cards.map((c, j) => (j === i ? { ...c, description: e.target.value } : c)) })
                }
                rows={2}
              />
              <TextInput
                label="Highlights"
                value={card.highlights}
                onChange={(e) =>
                  onChange({ ...value, cards: cards.map((c, j) => (j === i ? { ...c, highlights: e.target.value } : c)) })
                }
              />
              <button
                type="button"
                onClick={() => onChange({ ...value, cards: cards.filter((_, j) => j !== i) })}
                className="admin-btn admin-btn-danger admin-btn-sm mt-2"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...value, cards: [...cards, { title: "", description: "", href: "", icon: "engineering", ctaLabel: "Explore", highlights: "" }] })}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={14} /> Add Card
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricsForm({ value, onChange }: { value: MetricVal[]; onChange: (v: MetricVal[]) => void }) {
  const safe = Array.isArray(value) ? value : [];
  const set = (i: number, k: keyof MetricVal, v: string) => {
    onChange(safe.map((item, j) => (j === i ? { ...item, [k]: v } : item)));
  };
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-3 gap-3 pr-12">
            <TextInput label="Value" value={item.value} onChange={(e) => set(i, "value", e.target.value)} />
            <TextInput label="Label" value={item.label} onChange={(e) => set(i, "label", e.target.value)} />
            <TextInput label="Sub" value={item.sub ?? ""} onChange={(e) => set(i, "sub", e.target.value)} />
          </div>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...safe, { value: "", label: "", sub: "" }])}
        className="admin-btn admin-btn-outline admin-btn-sm"
      >
        <Plus size={14} /> Add Metric
      </button>
    </div>
  );
}

function FacilitiesForm({ value, onChange }: { value: FacilityVal[]; onChange: (v: FacilityVal[]) => void }) {
  const safe = Array.isArray(value) ? value : [];
  const set = (i: number, k: keyof FacilityVal, v: string) => {
    onChange(safe.map((item, j) => (j === i ? { ...item, [k]: v } : item)));
  };
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <TextInput label="Title" value={item.title} onChange={(e) => set(i, "title", e.target.value)} />
          <TextArea label="Description" value={item.desc ?? ""} onChange={(e) => set(i, "desc", e.target.value)} rows={2} />
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...safe, { title: "", desc: "" }])}
        className="admin-btn admin-btn-outline admin-btn-sm"
      >
        <Plus size={14} /> Add Facility
      </button>
    </div>
  );
}

function StringListForm({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const safe = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      {safe.map((item, i) => (
        <div key={i} className="flex gap-2">
          <TextInput
            label=""
            value={item}
            onChange={(e) => onChange(safe.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm self-start"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...safe, ""])}
        className="admin-btn admin-btn-outline admin-btn-sm"
      >
        <Plus size={14} /> Add Item
      </button>
    </div>
  );
}

function HeroStatsForm({ value, onChange }: { value: HeroStatVal[]; onChange: (v: HeroStatVal[]) => void }) {
  const safe = Array.isArray(value) ? value : [];
  const set = (i: number, patch: Partial<HeroStatVal>) => {
    onChange(safe.map((item, j) => (j === i ? { ...item, ...patch } : item)));
  };
  return (
    <div className="space-y-3">
      {safe.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="Value" value={item.value} onChange={(e) => set(i, { value: e.target.value })} />
            <TextInput label="Label" value={item.label} onChange={(e) => set(i, { label: e.target.value })} />
          </div>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(item.accent)}
              onChange={(e) => set(i, { accent: e.target.checked })}
            />
            Accent color
          </label>
          <button
            type="button"
            onClick={() => onChange(safe.filter((_, j) => j !== i))}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...safe, { value: "", label: "", accent: false }])}
        className="admin-btn admin-btn-outline admin-btn-sm"
      >
        <Plus size={14} /> Add Stat
      </button>
    </div>
  );
}

const ARRAY_KEYS = new Set([
  "accreditations",
  "engineeringMetrics",
  "engineeringFacilities",
  "engineeringResearchHighlights",
  "artsScienceHeroStats",
]);

export default function SiteConfigPage() {
  const [configs, setConfigs] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState("contact");
  const [currentValue, setCurrentValue] = useState<unknown>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/site-config");
    const data = await r.json();
    setConfigs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const cfg = configs.find((c) => (c as Record<string, unknown>).config_key === selected);
    if (cfg) {
      setCurrentValue((cfg as Record<string, unknown>).value);
    } else {
      setCurrentValue(ARRAY_KEYS.has(selected) ? [] : {});
    }
  }, [selected, configs]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    setApiError(null);
    const r = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config_key: selected, value: currentValue }),
    });
    if (r.ok) {
      setMsg("Saved!");
      await load();
    } else {
      const parsed = await parseApiError(r);
      setApiError(parsed);
      if (!parsed?.details?.length) setMsg(parsed?.message ?? parsed?.error ?? "Error saving");
    }
    setSaving(false);
  };

  const seedFromDefaults = async () => {
    const { siteConfig } = await import("@/data/site");
    const { homeHeroContent } = await import("@/data/home");
    const engineering = await import("@/data/engineering");
    const arts = await import("@/data/arts-science");

    const keys = [
      ["contact", siteConfig.contact],
      ["social", siteConfig.social],
      ["stats", siteConfig.stats],
      ["accreditations", siteConfig.accreditations],
      ["address", siteConfig.address],
      ["home", homeHeroContent],
      ["engineeringMetrics", engineering.metrics],
      [
        "engineeringFacilities",
        engineering.facilities.map((f) => ({ title: f.title, desc: f.desc })),
      ],
      [
        "engineeringResearchHighlights",
        [
          "25+ patents filed across departments",
          "TechVista: 2000+ participants annually",
          "15+ industry MoUs for research and internships",
          "Funded by DST, AICTE, and state agencies",
        ],
      ],
      ["artsScienceHeroStats", arts.heroStats],
    ] as [string, unknown][];

    for (const [key, value] of keys) {
      await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config_key: key, value }),
      });
    }
    await load();
    setMsg("Seeded from data files");
  };

  function renderForm() {
    if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-400" /></div>;
    switch (selected) {
      case "contact":
        return <ContactForm value={currentValue as ContactVal} onChange={setCurrentValue} />;
      case "social":
        return <SocialForm value={currentValue as SocialVal} onChange={setCurrentValue} />;
      case "stats":
        return <StatsForm value={currentValue as StatsVal} onChange={setCurrentValue} />;
      case "address":
        return <AddressForm value={currentValue as AddressVal} onChange={setCurrentValue} />;
      case "accreditations":
        return <AccreditationsForm value={(currentValue as Accreditation[]) ?? []} onChange={setCurrentValue} />;
      case "home":
        return <HomeForm value={(currentValue as HomeVal) ?? {}} onChange={setCurrentValue} />;
      case "engineeringMetrics":
        return <MetricsForm value={(currentValue as MetricVal[]) ?? []} onChange={setCurrentValue} />;
      case "engineeringFacilities":
        return <FacilitiesForm value={(currentValue as FacilityVal[]) ?? []} onChange={setCurrentValue} />;
      case "engineeringResearchHighlights":
        return <StringListForm value={(currentValue as string[]) ?? []} onChange={setCurrentValue} />;
      case "artsScienceHeroStats":
        return <HeroStatsForm value={(currentValue as HeroStatVal[]) ?? []} onChange={setCurrentValue} />;
      default:
        return null;
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Configuration</h1>
          <p className="admin-page-subtitle">Contact info, social links, stats, accreditations, home & institution content</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedFromDefaults} className="admin-btn admin-btn-outline admin-btn-sm">
            Seed from data files
          </button>
          <button onClick={save} disabled={saving} className="admin-btn admin-btn-gold">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {msg && !apiError && (
        <p
          className={`mb-4 rounded-lg px-3 py-2 text-sm ${
            msg === "Saved!" || msg.startsWith("Seeded")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg}
        </p>
      )}

      {apiError && (
        <ValidationErrors
          error={apiError.message ?? apiError.error}
          details={apiError.details}
        />
      )}

      <div className="flex gap-4">
        <div className="w-56 shrink-0">
          <div className="admin-card p-2">
            {CONFIG_KEYS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setSelected(key); setMsg(""); setApiError(null); }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selected === key ? "bg-[#0a1628] text-white font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="admin-card">
            <h2 className="mb-4 font-semibold text-gray-800">
              {CONFIG_KEYS.find((k) => k.key === selected)?.label}
            </h2>
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
}
