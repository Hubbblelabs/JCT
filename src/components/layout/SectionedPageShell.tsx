"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { useSectionPanels } from "@/lib/use-section-panels";

/**
 * Sidebar + panels shell for pages that absorbed what used to be separate
 * routes (the NAAC page and its AQAR / best-practices / distinctiveness
 * sub-pages, the Documents page and NIRF / financial statements / ICT
 * content). The panel switching, deep links and the rest of the behaviour are
 * `useSectionPanels`, which every sidebar page on the site shares.
 *
 * An item with `href` instead of `content` is a plain link. That is what the
 * admin editors use: the preview shows the same sidebar, with the other panels
 * pointing at their own editors.
 */

export type PageSectionItem = {
  /** Fragment identifier — `#<id>` selects this panel. */
  id: string;
  label: string;
  /**
   * A rendered icon element, not a component: these items are built in server
   * components, and a component reference cannot cross into a client one. The
   * wrapper sets the size and colour, which the icon picks up through
   * `currentColor`.
   */
  icon?: ReactNode;
  /** Panel body. Omit for a link-only item. */
  content?: ReactNode;
  /** Link target; set instead of `content` to navigate away. */
  href?: string;
};

export function SectionedPageShell({
  items,
  navTitle = "On This Page",
  className = "",
  editable = false,
  navSection,
  onEditSection,
}: {
  items: PageSectionItem[];
  navTitle?: string;
  className?: string;
  /**
   * Admin preview: clicking the sidebar's chrome (not its entries — those keep
   * switching panels) opens `navSection` in the inspector, which is where the
   * tab order, labels and custom tabs are edited.
   */
  editable?: boolean;
  navSection?: string;
  onEditSection?: (section: string) => void;
}) {
  const { activeId, select, containerProps, panelProps } = useSectionPanels(
    items.filter((i) => !i.href).map((i) => i.id),
    { syncHash: !editable },
  );

  if (items.length === 0) return null;

  const navEditable = editable && !!navSection;

  return (
    <div
      className={`lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-10 xl:grid-cols-[300px_1fr] xl:gap-12 ${className}`}
    >
      {/* Mobile: horizontally scrollable pill bar */}
      <EditableRegion
        as="div"
        section={navSection ?? ""}
        label={navTitle}
        editable={navEditable}
        onEditSection={onEditSection}
        className="-mx-4 mb-6 w-full overflow-x-auto px-4 pb-2 lg:hidden"
      >
        <div className="flex w-max gap-2">
          {items.map((item) => (
            <SectionNavEntry
              key={item.id}
              item={item}
              active={!item.href && item.id === activeId}
              onSelect={select}
              variant="pill"
            />
          ))}
        </div>
      </EditableRegion>

      {/* Desktop: sticky card. `sticky` needs the grid item to be its own box,
          not stretched to the row height — hence `items-start` above. The
          admin preview has no fixed navbar to clear. */}
      <EditableRegion
        as="nav"
        section={navSection ?? ""}
        label={navTitle}
        editable={navEditable}
        onEditSection={onEditSection}
        className={`border-border sticky hidden overflow-y-auto overscroll-contain rounded-2xl border bg-white p-5 shadow-sm lg:block ${
          editable
            ? "top-6 max-h-[calc(100vh-3rem)]"
            : "top-24 max-h-[calc(100vh-12rem)]"
        }`}
      >
        <h2 className="text-navy border-border mb-4 border-b pb-3 text-xs font-bold tracking-[0.15em] uppercase">
          {navTitle}
        </h2>
        <div className="space-y-1">
          {items.map((item) => (
            <SectionNavEntry
              key={item.id}
              item={item}
              active={!item.href && item.id === activeId}
              onSelect={select}
              variant="row"
            />
          ))}
        </div>
      </EditableRegion>

      <div {...containerProps} className="min-w-0">
        {items
          .filter((item) => !item.href)
          .map((item) => (
            <div key={item.id} id={item.id} {...panelProps(item.id)}>
              {item.content}
            </div>
          ))}
      </div>
    </div>
  );
}

/** Heading for a hosted panel, standing in for the hero the page used to own. */
export function SectionPanelHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  if (!title.trim() && !subtitle?.trim()) return null;
  return (
    <div className="border-border mb-8 border-b pb-6">
      {title.trim() && (
        <h1 className="text-foreground font-serif text-2xl font-bold md:text-3xl">
          {title}
        </h1>
      )}
      {subtitle?.trim() && (
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function SectionNavEntry({
  item,
  active,
  onSelect,
  variant,
}: {
  item: PageSectionItem;
  active: boolean;
  onSelect: (id: string) => void;
  variant: "pill" | "row";
}) {
  const isExternal = !!item.href && /^https?:\/\//i.test(item.href);
  const cls =
    variant === "pill"
      ? `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
          active
            ? "border-navy bg-navy text-white"
            : "border-border text-navy bg-white hover:bg-stone-50"
        }`
      : `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
          active ? "bg-navy text-white" : "text-navy hover:bg-stone-50"
        }`;
  // The icon arrives as a rendered element, so its size and colour are set here
  // via CSS rather than props — lucide strokes with `currentColor`.
  const icon = item.icon ? (
    <span
      className={`inline-flex shrink-0 ${
        active ? "text-accent" : "text-stone-400"
      } ${variant === "pill" ? "[&>svg]:size-3.5" : "[&>svg]:size-4"}`}
    >
      {item.icon}
    </span>
  ) : null;

  if (item.href) {
    return (
      <Link
        href={item.href}
        onClick={(e) => e.stopPropagation()}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={cls}
      >
        {icon}
        <span className="min-w-0 flex-1">{item.label}</span>
        {variant === "row" && (
          <ExternalLink size={12} className="shrink-0 text-stone-300" />
        )}
      </Link>
    );
  }

  return (
    <button
      type="button"
      // Stop the click short of the surrounding EditableRegion in the admin
      // preview: picking a tab must switch panels, not open the inspector.
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      aria-current={active ? "true" : undefined}
      className={cls}
    >
      {icon}
      <span className="min-w-0 flex-1">{item.label}</span>
      {variant === "row" && active && (
        <span className="bg-accent h-1.5 w-1.5 shrink-0 rounded-full" />
      )}
    </button>
  );
}
