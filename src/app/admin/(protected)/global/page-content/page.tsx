"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PageContentShell,
  type SectionDef,
} from "@/components/admin/PageContentShell";
import {
  HeaderForm,
  FooterForm,
  type HeaderVal,
  type FooterVal,
} from "@/components/admin/PageContentForms";

function Inner() {
  const params = useSearchParams();
  const section = params.get("section");

  const sections: SectionDef[] = [
    {
      id: "header",
      label: "Header",
      kind: "form",
      configKey: "header",
      defaultValue: {} as HeaderVal,
      render: (v, onChange) => (
        <HeaderForm value={(v as HeaderVal) ?? {}} onChange={onChange} />
      ),
    },
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
  ];

  void section;

  return (
    <PageContentShell
      pageTitle="Global CMS"
      pageSubtitle="Site-wide header and footer content shared across all pages."
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
