"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Link2,
  List,
  Maximize2,
  Minimize2,
  Search,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/admin/kit/primitives";

/**
 * The manual's frame: a filter box, a contents rail that tracks where you are,
 * and the chapters as an accordion.
 *
 * The chapters arrive already rendered from the server — icons included, as
 * elements rather than component types, since a lucide component cannot cross
 * the server/client boundary. This file therefore holds no content of its own;
 * everything a reader sees comes from `help-chapters.tsx`.
 *
 * Sixteen chapters opened flat is a page nobody scrolls to the end of, so they
 * start collapsed apart from the first. Every route into a chapter — a contents
 * click, a `#deep-link`, a search hit — opens it on the way, so a reader never
 * has to know the accordion is there.
 */

export type HelpDocItem = {
  id: string;
  title: string;
  summary: string;
  /** Extra search terms — never displayed. */
  keywords: string;
  icon: ReactNode;
  body: ReactNode;
};

/** Distance from the top of the viewport that counts as "the chapter you are
 *  reading" — the sticky topbar plus a little breathing room. */
const SPY_OFFSET = 96;

/** Smooth scrolling is motion, and someone who asked the OS for less of it
 *  means this too. */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function HelpDoc({ items }: { items: HelpDocItem[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(
    // Deterministic first render — the hash is applied in an effect, so server
    // and client agree on the initial markup.
    () => new Set(items.length ? [items[0].id] : []),
  );
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [copied, setCopied] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Filtering ──────────────────────────────────────────────────────────*/

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    // Every word has to appear somewhere in the chapter's own text — "publish
    // image" should find the media chapter, not every chapter mentioning one
    // of the two.
    const words = q.split(/\s+/);
    return items.filter((item) => {
      const hay =
        `${item.title} ${item.summary} ${item.keywords}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, query]);

  const searching = query.trim().length > 0;

  // A search that narrows to three chapters should show them, not three closed
  // headers. Opening them is the answer the reader asked for.
  useEffect(() => {
    if (!searching) return;
    setOpen(new Set(matches.map((m) => m.id)));
  }, [searching, matches]);

  /* ── Opening a chapter ──────────────────────────────────────────────────*/

  const openChapter = useCallback((id: string) => {
    setOpen((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const toggleChapter = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Open the chapter, then bring it to the top — in that order, or the scroll
   *  measures the collapsed height and lands short. */
  const goTo = useCallback(
    (id: string) => {
      openChapter(id);
      setTocOpen(false);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: scrollBehavior() });
        setActiveId(id);
      });
    },
    [openChapter],
  );

  // Deep links: /admin/help#publishing arrives with the chapter closed, and the
  // browser's own jump has already happened against the collapsed layout.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && items.some((i) => i.id === id)) goTo(id);
    // Runs once — a later hash change is handled by the click that caused it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Scroll spy + back to top ───────────────────────────────────────────*/

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setShowTop(window.scrollY > 600);

        // Last heading that has passed the offset wins. Cheaper and steadier
        // than an IntersectionObserver here, because a collapsed chapter is
        // barely tall enough to intersect anything.
        let current = matches[0]?.id ?? "";
        for (const item of matches) {
          const el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top <= SPY_OFFSET) {
            current = item.id;
          }
        }
        setActiveId(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [matches, open]);

  /* ── Keyboard ───────────────────────────────────────────────────────────*/

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable)
        return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ── Copy a link to one chapter ─────────────────────────────────────────*/

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}${pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
    } catch {
      // Clipboard blocked (insecure origin, or the user said no). Put the link
      // in the address bar instead so it can still be copied by hand.
      window.location.hash = id;
      setCopied(id);
    }
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(null), 2000);
  };

  /* ── Render ─────────────────────────────────────────────────────────────*/

  const allOpen = matches.length > 0 && matches.every((m) => open.has(m.id));

  const searchBox = (
    <div className="admin-search-field admin-doc-search">
      <Search size={14} className="admin-search-field-icon" />
      <input
        ref={searchRef}
        type="search"
        className="admin-input"
        placeholder="Search the manual…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setQuery("");
        }}
        aria-label="Search the manual"
      />
      {query && (
        <button
          type="button"
          className="admin-search-field-clear"
          onClick={() => {
            setQuery("");
            searchRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* The size container the layout queries. It wraps the grid only, never
          the back-to-top button: `container-type` implies layout containment,
          which would make this element the containing block for a
          `position: fixed` descendant and pin the button inside the column. */}
      <div className="admin-doc-shell">
        <div className="admin-doc-layout">
          <div className="admin-doc">
            <div className="admin-doc-toolbar">
              <p className="admin-doc-count" role="status" aria-live="polite">
                {searching
                  ? `${matches.length} of ${items.length} chapters match “${query.trim()}”`
                  : `${items.length} chapters`}
              </p>
              {matches.length > 0 && (
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() =>
                    setOpen(
                      allOpen ? new Set() : new Set(matches.map((m) => m.id)),
                    )
                  }
                >
                  {allOpen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  {allOpen ? "Collapse all" : "Expand all"}
                </button>
              )}
            </div>

            {matches.length === 0 ? (
              <EmptyState
                icon={<Search size={20} />}
                title={`Nothing in the manual matches “${query.trim()}”`}
                body="Try a single word — the name of a screen, or what you are trying to do."
              />
            ) : (
              matches.map((item) => {
                const isOpen = open.has(item.id);
                return (
                  <section
                    key={item.id}
                    id={item.id}
                    className="admin-doc-chapter"
                    data-open={isOpen || undefined}
                    aria-labelledby={`${item.id}-title`}
                  >
                    <div className="admin-doc-chapter-head">
                      <h2 id={`${item.id}-title`} className="admin-doc-h2">
                        <button
                          type="button"
                          className="admin-doc-toggle"
                          aria-expanded={isOpen}
                          aria-controls={`${item.id}-body`}
                          onClick={() => toggleChapter(item.id)}
                        >
                          <span
                            className="admin-doc-h2-icon"
                            aria-hidden="true"
                          >
                            {item.icon}
                          </span>
                          <span className="admin-doc-toggle-text">
                            <span className="admin-doc-toggle-title">
                              {item.title}
                            </span>
                            {!isOpen && (
                              <span className="admin-doc-toggle-summary">
                                {item.summary}
                              </span>
                            )}
                          </span>
                          <ChevronDown
                            size={18}
                            className="admin-doc-chevron"
                            aria-hidden="true"
                          />
                        </button>
                      </h2>

                      <button
                        type="button"
                        className="admin-icon-btn admin-doc-copy"
                        onClick={() => void copyLink(item.id)}
                        title="Copy a link to this chapter"
                        aria-label={`Copy a link to “${item.title}”`}
                      >
                        {copied === item.id ? (
                          <Check size={15} className="text-emerald-600" />
                        ) : (
                          <Link2 size={15} />
                        )}
                      </button>
                    </div>

                    <div
                      id={`${item.id}-body`}
                      className="admin-doc-body"
                      hidden={!isOpen}
                    >
                      {item.body}
                    </div>
                  </section>
                );
              })
            )}
          </div>

          <aside className="admin-doc-toc" aria-label="Contents">
            <div className="admin-doc-toc-inner">
              {searchBox}

              <button
                type="button"
                className="admin-doc-toc-trigger"
                aria-expanded={tocOpen}
                aria-controls="admin-doc-toc-list"
                onClick={() => setTocOpen((o) => !o)}
              >
                <List size={14} aria-hidden="true" />
                Contents
                <span className="admin-doc-toc-count">{matches.length}</span>
                <ChevronDown
                  size={15}
                  className="admin-doc-chevron"
                  aria-hidden="true"
                />
              </button>

              <p className="admin-doc-toc-heading">Contents</p>

              <nav
                id="admin-doc-toc-list"
                className="admin-doc-toc-list"
                data-open={tocOpen || undefined}
              >
                {matches.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="admin-doc-toc-link"
                    data-active={activeId === item.id || undefined}
                    aria-current={activeId === item.id ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(item.id);
                    }}
                  >
                    <span className="admin-doc-toc-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="admin-doc-toc-title">{item.title}</span>
                      <span className="admin-doc-toc-summary">
                        {item.summary}
                      </span>
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>

      {showTop && (
        <button
          type="button"
          className="admin-doc-top"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: scrollBehavior() })
          }
          aria-label="Back to top"
        >
          <ArrowUp size={15} />
          <span className="admin-doc-top-label">Back to top</span>
        </button>
      )}
    </>
  );
}
