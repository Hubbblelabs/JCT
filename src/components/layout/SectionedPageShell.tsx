"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";

/**
 * Sidebar + panels shell for pages that absorbed what used to be separate
 * routes (the NAAC page and its AQAR / best-practices / distinctiveness
 * sub-pages, the Documents page and NIRF / financial statements / ICT
 * content).
 *
 * Every panel is rendered into the markup and toggled with `hidden`, not
 * mounted on demand — the absorbed pages carry indexable document lists and
 * tables that must stay in the server-rendered HTML. The fragment (`#nirf`)
 * deep-links a panel, which is what the old routes redirect to.
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
}: {
  items: PageSectionItem[];
  navTitle?: string;
  className?: string;
}) {
  const panelIds = useMemo(
    () => items.filter((i) => !i.href).map((i) => i.id),
    [items],
  );
  const panelKey = panelIds.join(",");
  const [activeId, setActiveId] = useState(panelIds[0] ?? "");
  const panelsRef = useRef<HTMLDivElement>(null);

  // Deep links (`…/naac#aqar-report`) and back/forward both arrive as a hash
  // change, so the same handler serves the first paint and later navigations.
  useEffect(() => {
    const ids = new Set(panelKey ? panelKey.split(",") : []);
    const apply = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (hash && ids.has(hash)) setActiveId(hash);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [panelKey]);

  // Keep the selection valid if the panel list changes under us (the admin
  // preview re-renders as content is edited).
  useEffect(() => {
    setActiveId((prev) => {
      const ids = panelKey ? panelKey.split(",") : [];
      return prev && ids.includes(prev) ? prev : (ids[0] ?? "");
    });
  }, [panelKey]);

  const select = (id: string) => {
    setActiveId(id);
    // `replaceState` rather than assigning `location.hash`: the latter would
    // scroll to the anchor itself and push a history entry per click.
    window.history.replaceState(null, "", `#${id}`);
    const el = panelsRef.current;
    if (!el) return;
    const offset = window.innerWidth >= 1024 ? 120 : 90;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    // Only pull the page up when the panel has scrolled out of reach; jumping
    // down for someone already at the top of the page would be disorienting.
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div
      className={`lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-10 xl:grid-cols-[300px_1fr] xl:gap-12 ${className}`}
    >
      {/* Mobile: horizontally scrollable pill bar */}
      <div className="-mx-4 mb-6 w-full overflow-x-auto px-4 pb-2 lg:hidden">
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
      </div>

      {/* Desktop: sticky card. `sticky` needs the grid item to be its own box,
          not stretched to the row height — hence `items-start` above. */}
      <nav className="border-border sticky top-24 hidden rounded-2xl border bg-white p-5 shadow-sm lg:block">
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
      </nav>

      <div ref={panelsRef} className="min-w-0">
        {items
          .filter((item) => !item.href)
          .map((item) => (
            <div
              key={item.id}
              id={item.id}
              hidden={item.id !== activeId}
              className="scroll-mt-28"
            >
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
      onClick={() => onSelect(item.id)}
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
