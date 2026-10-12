"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import {
  ChevronRight,
  CircleHelp,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { type NavTrail } from "@/lib/admin-nav";
import { type TopbarPageInfo } from "./topbar-slot";

/** The path part of a nav item's href. */
function hrefPath(href: string): string {
  const q = href.indexOf("?");
  return q >= 0 ? href.slice(0, q) : href;
}

/**
 * Breadcrumbs on the left, the open screen's own actions on the right.
 *
 * The breadcrumbs are the point: until now no admin screen showed its own
 * position, so an editor deep in a college's page-content form had no way to
 * tell which college they were editing except by re-reading the URL. Getting
 * that wrong means publishing Engineering copy onto Arts & Science.
 *
 * The right-hand side is empty until a screen fills it (see `useTopbarSlot`):
 * page editors put View live page, Save draft and Publish there. Search, the
 * public-site link, Clear cache and the account menu live at the foot of the
 * sidebar.
 */
export function AdminTopbar({
  trail,
  pathname,
  page,
  actionsRef,
  collapsed,
  mobile = false,
  onToggleCollapse,
}: {
  trail: NavTrail;
  pathname: string;
  /** What the open screen registered about itself, if anything. */
  page?: TopbarPageInfo;
  /** Receives the element screens portal their actions into. */
  actionsRef: (el: HTMLElement | null) => void;
  collapsed: boolean;
  /** Below the drawer breakpoint the same button opens the drawer instead of
      narrowing the rail, so it has to say so. */
  mobile?: boolean;
  onToggleCollapse: () => void;
}) {
  // A detail route (one program, one page) sits under a nav item without
  // being it, so the trail alone would name the list, not what is open.
  const titleCrumb =
    page?.title && (!trail.item || hrefPath(trail.item.href) !== pathname)
      ? page.title
      : null;

  const help = page?.description ? <PageHelp text={page.description} /> : null;

  return (
    <header className="admin-topbar">
      <button
        type="button"
        onClick={onToggleCollapse}
        className="admin-icon-btn"
        aria-label={
          mobile
            ? collapsed
              ? "Open navigation"
              : "Close navigation"
            : collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
        }
        aria-expanded={mobile ? !collapsed : undefined}
        aria-pressed={mobile ? undefined : collapsed}
      >
        {mobile ? (
          collapsed ? (
            <Menu size={18} />
          ) : (
            <X size={18} />
          )
        ) : collapsed ? (
          <PanelLeftOpen size={17} />
        ) : (
          <PanelLeftClose size={17} />
        )}
      </button>

      <nav aria-label="Breadcrumb" className="admin-breadcrumb min-w-0">
        {trail.section ? (
          <Fragment>
            <span className="admin-breadcrumb-crumb admin-breadcrumb-ancestor">
              {trail.section.label}
            </span>
            {trail.group && (
              <Fragment>
                <ChevronRight
                  size={13}
                  className="admin-breadcrumb-sep admin-breadcrumb-group"
                  aria-hidden="true"
                />
                <span className="admin-breadcrumb-crumb admin-breadcrumb-group">
                  {trail.group.title}
                </span>
              </Fragment>
            )}
            {trail.item && (
              <Fragment>
                <ChevronRight
                  size={13}
                  className="admin-breadcrumb-sep admin-breadcrumb-ancestor"
                  aria-hidden="true"
                />
                {titleCrumb ? (
                  <span className="admin-breadcrumb-crumb admin-breadcrumb-ancestor">
                    {trail.item.label}
                  </span>
                ) : (
                  <span
                    className="admin-breadcrumb-current"
                    aria-current="page"
                  >
                    {trail.item.label}
                  </span>
                )}
              </Fragment>
            )}
            {titleCrumb && (
              <Fragment>
                {trail.item && (
                  <ChevronRight
                    size={13}
                    className="admin-breadcrumb-sep admin-breadcrumb-ancestor"
                    aria-hidden="true"
                  />
                )}
                <span className="admin-breadcrumb-current" aria-current="page">
                  {titleCrumb}
                </span>
              </Fragment>
            )}
          </Fragment>
        ) : (
          <span className="admin-breadcrumb-current" aria-current="page">
            {titleCrumb ?? "Dashboard"}
          </span>
        )}
        {help}
      </nav>

      <div ref={actionsRef} className="admin-topbar-actions" />
    </header>
  );
}

/**
 * A help icon that shows the screen's one-line explanation on hover or
 * keyboard focus — and on tap, since touch screens have no hover.
 */
function PageHelp({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tipId = useId();

  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setPinned(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setPinned(false);
      }
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className="admin-page-help"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!pinned) setOpen(false);
      }}
    >
      <button
        type="button"
        className="admin-page-help-btn"
        aria-label="About this page"
        aria-describedby={tipId}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          if (!pinned) setOpen(false);
        }}
        onClick={() => {
          setPinned((p) => !p);
          setOpen((o) => !(o && pinned));
        }}
      >
        <CircleHelp size={15} />
      </button>
      <span
        id={tipId}
        role="tooltip"
        className="admin-page-help-tip"
        data-open={open || undefined}
      >
        {text}
      </span>
    </span>
  );
}
