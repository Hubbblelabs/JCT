"use client";

import {
  FormGrid,
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
        <FormGrid>
          <TextInput
            label="Hero Title"
            span={5}
            value={data.hero.title}
            placeholder="Approvals & Accreditations"
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
            <FormGrid tight>
              <TextInput
                label="Name"
                span={3}
                value={item.name}
                placeholder="NAAC, NBA, AICTE…"
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <TextInput
                label="Full Name / Expansion"
                span={6}
                value={item.fullName}
                placeholder="National Assessment and Accreditation Council"
                onChange={(e) => oc({ ...item, fullName: e.target.value })}
              />
              <TextInput
                label="Grade / Score"
                span={3}
                value={item.grade}
                placeholder="A+, CGPA 3.51…"
                onChange={(e) => oc({ ...item, grade: e.target.value })}
              />
              <TextArea
                label="Description"
                span={7}
                rows={3}
                value={item.description}
                onChange={(e) => oc({ ...item, description: e.target.value })}
              />
              <ImageUploadInput
                label="Logo"
                span={5}
                ratio="square"
                value={item.logo}
                onChange={(logo) => oc({ ...item, logo })}
                hideUrlField
              />
              <TextInput
                label="Accredited By"
                span={6}
                value={item.accreditedBy}
                placeholder="Issuing authority"
                onChange={(e) => oc({ ...item, accreditedBy: e.target.value })}
              />
              <TextInput
                label="Valid From"
                span={3}
                value={item.validFrom}
                placeholder="2022"
                onChange={(e) => oc({ ...item, validFrom: e.target.value })}
              />
              <TextInput
                label="Valid To"
                span={3}
                value={item.validTo}
                placeholder="2027"
                onChange={(e) => oc({ ...item, validTo: e.target.value })}
              />
              <TextInput
                label="Certificate Link Label"
                span={6}
                value={item.certificateLabel}
                placeholder="View Certificate"
                onChange={(e) =>
                  oc({ ...item, certificateLabel: e.target.value })
                }
              />
              <TextInput
                label="Dedicated Page (optional)"
                span={6}
                value={item.detailHref}
                placeholder="/institutions/engineering/naac"
                onChange={(e) => oc({ ...item, detailHref: e.target.value })}
              />
              <DocumentUploadInput
                label="Certificate (PDF)"
                span="full"
                value={item.certificate}
                onChange={(certificate) => oc({ ...item, certificate })}
              />
            </FormGrid>
          )}
        />
      );

    default:
      return <p className="text-sm text-gray-500">Select a section to edit.</p>;
  }
}
