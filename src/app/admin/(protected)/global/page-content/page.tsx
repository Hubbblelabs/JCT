"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PageContentShell,
  type SectionDef,
} from "@/components/admin/PageContentShell";
import {
  FooterForm,
  FloatingElementsForm,
  type FooterVal,
  type FloatingElementsVal,
} from "@/components/admin/PageContentForms";

function Inner() {
  const params = useSearchParams();
  const section = params.get("section");

  const sections: SectionDef[] = [
    {
      id: "footer",
      label: "Footer",
      kind: "form",
      configKey: "footer",
      defaultValue: {} as FooterVal,
      render: (v, onChange) => (
        <FooterForm value={(v as FooterVal) ?? {}} onChange={onChange} />
      ),
    },
    {
      id: "floatingElements",
      label: "Floating Elements",
      kind: "form",
      configKey: "floatingElements",
      defaultValue: {} as FloatingElementsVal,
      render: (v, onChange) => (
        <FloatingElementsForm
          value={(v as FloatingElementsVal) ?? {}}
          onChange={onChange}
        />
      ),
    },
  ];

  void section;

  return (
    <PageContentShell
      pageTitle="Global CMS"
      pageSubtitle="Site-wide footer and floating UI elements. Header and navbar are now managed per institution (Engineering / Arts & Science / Polytechnic / Main)."
      sections={sections}
    />
  );
}

export default function GlobalPageContentPage() {
  return (
    <Suspense fallback={<div className="admin-content">Loading…</div>}>
      <Inner />
    </Suspense>
  );
}
