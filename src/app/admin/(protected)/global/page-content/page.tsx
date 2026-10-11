"use client";

import { Suspense } from "react";
import {
  SiteSectionsEditor,
  type SiteSectionDef,
} from "@/components/admin/SiteSectionsEditor";
import { formSection } from "@/components/admin/site-sections";
import {
  FooterForm,
  FloatingElementsForm,
  type FooterVal,
  type FloatingElementsVal,
} from "@/components/admin/PageContentForms";
import { Footer } from "@/components/layout/Footer";
import { GlobalElements } from "@/components/layout/GlobalElements";

/**
 * Stand-in for "any public page", so the floating buttons have somewhere to
 * float. Its own transform makes it their containing block — they sit in its
 * corners rather than at the bottom of the whole preview.
 */
function FloatingElementsStage() {
  return (
    <div
      className="relative h-[640px] overflow-hidden bg-slate-100"
      style={{ transform: "translateZ(0)" }}
    >
      <div className="mx-auto max-w-3xl px-8 pt-24 text-center text-slate-400">
        <p className="text-3xl font-semibold">Any page of the website</p>
        <p className="mt-3 text-lg">
          The floating buttons stay on screen while visitors scroll.
        </p>
      </div>
      <GlobalElements preview />
    </div>
  );
}

function Inner() {
  const sections: SiteSectionDef[] = [
    formSection<FloatingElementsVal>({
      id: "floatingElements",
      label: "Floating Elements",
      help: "The buttons that float over every page: WhatsApp, Apply Now, the chat widget and the social media icons.",
      group: "On every page",
      configKey: "floatingElements",
      defaultValue: {},
      form: (value, onChange) => (
        <FloatingElementsForm value={value} onChange={onChange} />
      ),
      preview: <FloatingElementsStage />,
    }),
    formSection<FooterVal>({
      id: "footer",
      label: "Footer",
      help: "The footer at the bottom of every page: the admissions helpline, contact details, address and social media links (also used by the floating social icons).",
      group: "On every page",
      configKey: "footer",
      defaultValue: {},
      form: (value, onChange) => (
        <FooterForm value={value} onChange={onChange} />
      ),
      preview: <Footer />,
    }),
  ];

  return (
    <SiteSectionsEditor
      title="Global — Site-wide Elements"
      description="Things that appear on every page. Header and navbar links are edited per college, on each landing page."
      institution="main"
      sections={sections}
      frameClassName="bg-surface text-foreground"
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
