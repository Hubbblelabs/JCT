"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { TextInput, NumberInput, TextArea, ImageUploadInput } from "@/components/admin/inputs";

const CONFIG_KEYS = [
  { key: "contact", label: "Contact" },
  { key: "social", label: "Social Links" },
  { key: "stats", label: "Statistics" },
  { key: "address", label: "Address" },
  { key: "accreditations", label: "Accreditations" },
];

type ContactVal = { phone?: string; phoneAlt?: string; email?: string; admissionsEmail?: string; whatsapp?: string };
type SocialVal = { facebook?: string; instagram?: string; twitter?: string; linkedin?: string; youtube?: string };
type StatsVal = { yearsOfExcellence?: number; students?: number; faculty?: number; recruiters?: number; alumni?: number; programs?: number; placementRate?: number; highestPackage?: string; averagePackage?: string };
type AddressVal = { line1?: string; line2?: string; city?: string; pincode?: string; state?: string; country?: string; full?: string; mapEmbedUrl?: string; mapUrl?: string };
type Accreditation = { name: string; logo: string; description: string };

function ContactForm({ value, onChange }: { value: ContactVal; onChange: (v: ContactVal) => void }) {
  const set = (k: keyof ContactVal, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid grid-cols-2 gap-4">
      <TextInput label="Phone" value={value.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
      <TextInput label="Alt Phone" value={value.phoneAlt ?? ""} onChange={(e) => set("phoneAlt", e.target.value)} />
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
          <ImageUploadInput label="Logo" value={item.logo} onChange={(url) => setItem(i, "logo", url)} />
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

export default function SiteConfigPage() {
  const [configs, setConfigs] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState("contact");
  const [currentValue, setCurrentValue] = useState<unknown>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

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
    setCurrentValue(cfg ? (cfg as Record<string, unknown>).value : selected === "accreditations" ? [] : {});
  }, [selected, configs]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    const r = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config_key: selected, value: currentValue }),
    });
    if (r.ok) { setMsg("Saved!"); await load(); }
    else setMsg("Error saving");
    setSaving(false);
  };

  const seedFromDefaults = async () => {
    const { siteConfig } = await import("@/data/site");
    const keys = [
      ["contact", siteConfig.contact],
      ["social", siteConfig.social],
      ["stats", siteConfig.stats],
      ["accreditations", siteConfig.accreditations],
      ["address", siteConfig.address],
    ] as [string, unknown][];

    for (const [key, value] of keys) {
      await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config_key: key, value }),
      });
    }
    await load();
    setMsg("Seeded from site.ts");
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
      default:
        return null;
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Configuration</h1>
          <p className="admin-page-subtitle">Contact info, social links, stats, accreditations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedFromDefaults} className="admin-btn admin-btn-outline admin-btn-sm">
            Seed from site.ts
          </button>
          <button onClick={save} disabled={saving} className="admin-btn admin-btn-gold">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {msg && <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</p>}

      <div className="flex gap-4">
        <div className="w-44 shrink-0">
          <div className="admin-card p-2">
            {CONFIG_KEYS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setSelected(key); setMsg(""); }}
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
