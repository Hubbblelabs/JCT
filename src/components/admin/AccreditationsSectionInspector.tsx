"use client";

import {
  TextInput,
  TextArea,
  TextAreaList,
  ImageUploadInput,
  DocumentUploadInput,
  Repeater,
} from "@/components/admin/inputs";
import type { AccreditationsPageValue } from "@/lib/validation";

type AccreditationItem = AccreditationsPageValue["items"][number];

const EMPTY_ITEM: AccreditationItem = {
  name: "",
  fullName: "",
  logo: "",
  grade: "",
  description: "",
  accreditedBy: "",
  validFrom: "",
  validTo: "",
  certificate: "",
  certificateLabel: "",
  detailHref: "",
};

export function AccreditationsSectionInspector({
  section,
  data,
  onChange,
}: {
  section: string;
  data: AccreditationsPageValue;
  onChange: (next: AccreditationsPageValue) => void;
}) {
  const patch = (p: Partial<AccreditationsPageValue>) =>
    onChange({ ...data, ...p });

  switch (section) {
    case "hero":
      return (
        <>
          <TextInput
            label="Hero Title"
            value={data.hero.title}
            placeholder="Approvals & Accreditations"
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

    case "intro":
      return (
        <TextAreaList
          label="Introduction Paragraphs"
          values={data.intro}
          onChange={(intro) => patch({ intro })}
          placeholder="A short introduction about the institution's accreditations…"
        />
      );

    case "items":
      return (
        <Repeater<AccreditationItem>
          label="Accreditations"
          items={data.items}
          onChange={(items) => patch({ items })}
          newItem={() => ({ ...EMPTY_ITEM })}
          renderItem={(item, _i, oc) => (
            <div className="space-y-2 pr-8">
              <TextInput
                label="Name"
                value={item.name}
                placeholder="NAAC, NBA, AICTE…"
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Full Name / Expansion"
                value={item.fullName}
                placeholder="National Assessment and Accreditation Council"
                onChange={(e) => oc({ ...item, fullName: e.target.value })}
              />
              <ImageUploadInput
                label="Logo"
                ratio="square"
                value={item.logo}
                onChange={(logo) => oc({ ...item, logo })}
                hideUrlField
              />
              <TextInput
                label="Grade / Score"
                value={item.grade}
                placeholder="A+, CGPA 3.51…"
                onChange={(e) => oc({ ...item, grade: e.target.value })}
              />
              <TextArea
                label="Description"
                rows={3}
                value={item.description}
                onChange={(e) => oc({ ...item, description: e.target.value })}
              />
              <TextInput
                label="Accredited By"
                value={item.accreditedBy}
                placeholder="Issuing authority"
                onChange={(e) => oc({ ...item, accreditedBy: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="Valid From"
                  value={item.validFrom}
                  placeholder="2022"
                  onChange={(e) => oc({ ...item, validFrom: e.target.value })}
                />
                <TextInput
                  label="Valid To"
                  value={item.validTo}
                  placeholder="2027"
                  onChange={(e) => oc({ ...item, validTo: e.target.value })}
                />
              </div>
              <DocumentUploadInput
                label="Certificate (PDF)"
                value={item.certificate}
                onChange={(certificate) => oc({ ...item, certificate })}
              />
              <TextInput
                label="Certificate Link Label"
                value={item.certificateLabel}
                placeholder="View Certificate"
                onChange={(e) =>
                  oc({ ...item, certificateLabel: e.target.value })
                }
              />
              <TextInput
                label="Dedicated Page (optional)"
                value={item.detailHref}
                placeholder="/institutions/engineering/accreditations/naac"
                onChange={(e) => oc({ ...item, detailHref: e.target.value })}
              />
            </div>
          )}
        />
      );

    default:
      return <p className="text-sm text-gray-500">Select a section to edit.</p>;
  }
}
