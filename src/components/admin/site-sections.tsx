"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Fieldset } from "@/components/admin/kit";
import type { SiteSectionDef } from "@/components/admin/SiteSectionsEditor";
import {
  AnnouncementForm,
  HeaderForm,
  NavbarForm,
  SeoPagesForm,
  type AnnouncementVal,
  type HeaderVal,
  type NavbarVal,
  type SeoPagesVal,
} from "@/components/admin/PageContentForms";
import { reconcileSeoPages, seoPagesDefaultValue } from "@/lib/seo-pages";

/**
 * Building blocks for SiteSectionsEditor pages (the landing pages and Global),
 * so the sections they share — navbar, announcement, footer, SEO — read and
 * behave the same on every one of them.
 */

/** A section whose whole form edits one config key. */
export function formSection<V>(
  def: Omit<SiteSectionDef, "keys" | "render"> & {
    configKey: string;
    defaultValue: V;
    reconcile?: (value: unknown) => unknown;
    /** Renders the form. Return an element of a stable component type —
     *  `<SomeForm … />` — never a component defined inline. */
    form: (value: V, onChange: (next: V) => void) => ReactNode;
  },
): SiteSectionDef {
  const { configKey, defaultValue, reconcile, form, ...rest } = def;
  return {
    ...rest,
    keys: [{ key: configKey, defaultValue, reconcile }],
    render: ({ get, set }) =>
      form((get(configKey) as V) ?? defaultValue, (next) =>
        set(configKey, next),
      ),
  };
}

export function announcementSection(configKey: string): SiteSectionDef {
  return formSection<AnnouncementVal>({
    id: "announcement",
    label: "Announcement Bar",
    help: "The thin strip above the navbar on every page of this college — for short notices such as admission deadlines. Switch it off when there is nothing to announce.",
    group: "Top of the page",
    configKey,
    defaultValue: { enabled: false, text: "" },
    form: (value, onChange) => (
      <AnnouncementForm value={value} onChange={onChange} />
    ),
    // No preview of its own: the navbar preview draws the strip and marks it
    // as this section, so clicking it opens this form.
  });
}

export function navbarSection(
  keys: { header: string; navbar: string },
  navDefault: NavbarVal,
): SiteSectionDef {
  return {
    id: "navbar",
    label: "Navbar",
    help: "The menu bar at the top of every page: the phone numbers, the menu links and their dropdowns.",
    group: "Top of the page",
    keys: [
      { key: keys.header, defaultValue: {} as HeaderVal },
      { key: keys.navbar, defaultValue: navDefault },
    ],
    render: ({ get, set }) => (
      <div className="space-y-6">
        <Fieldset legend="Phone numbers & login">
          <HeaderForm
            value={(get(keys.header) as HeaderVal) ?? {}}
            onChange={(v) => set(keys.header, v)}
          />
        </Fieldset>
        <Fieldset
          legend="Menu links"
          hint="Open a link to edit it. Use the arrows to reorder; hidden links stay saved but don't show."
        >
          <NavbarForm
            value={(get(keys.navbar) as NavbarVal) ?? navDefault}
            onChange={(v) => set(keys.navbar, v)}
          />
        </Fieldset>
      </div>
    ),
    preview: <Navbar />,
  };
}

export function footerLinkSection(): SiteSectionDef {
  return {
    id: "footer",
    label: "Footer",
    help: "The footer is shared by every page of the site, so it is edited once, in Global.",
    group: "Bottom of the page",
    links: [
      {
        href: "/admin/global/page-content?section=footer",
        label: "Edit the footer",
      },
    ],
    preview: <Footer />,
  };
}

export function seoSection(
  scope: "main" | "engineering" | "arts-science" | "polytechnic",
  configKey: string,
): SiteSectionDef {
  return formSection<SeoPagesVal>({
    id: "seo",
    label: "Search engine settings",
    help: "The title and description Google shows for each page. Not visible on the page itself.",
    group: "Page settings",
    configKey,
    defaultValue: seoPagesDefaultValue(scope) as SeoPagesVal,
    reconcile: (v) => reconcileSeoPages(scope, v),
    form: (value, onChange) => (
      <SeoPagesForm value={value} onChange={onChange} />
    ),
  });
}
