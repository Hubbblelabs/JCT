"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** What a screen tells the topbar about itself. */
export type TopbarPageInfo = {
  /** Shown as the last breadcrumb when the nav trail doesn't name the page
      itself — e.g. which program the builder has open. */
  title?: string;
  /** Shown behind the help icon next to the breadcrumb. */
  description?: string;
};

type Registration = TopbarPageInfo & { id: string };

type TopbarSlotValue = {
  /** Where the active screen portals its actions (save, publish, …). */
  actionsEl: HTMLElement | null;
  /** The registration that owns the topbar right now. */
  activeId: string | null;
  register: (r: Registration) => void;
  unregister: (id: string) => void;
};

const TopbarSlotContext = createContext<TopbarSlotValue | null>(null);

/**
 * State behind the topbar's page slot. AdminShell owns it so the topbar (which
 * renders the slot) and the page (which fills it) share one source.
 *
 * Registrations are a stack rather than a single value: during a route
 * transition the outgoing editor can still be mounted while the incoming one
 * registers, and the newest one has to win without the old one's unmount
 * then clearing it.
 */
export function useTopbarSlotState() {
  const [pages, setPages] = useState<Registration[]>([]);
  const [actionsEl, setActionsEl] = useState<HTMLElement | null>(null);

  const register = useCallback((r: Registration) => {
    setPages((prev) => {
      const i = prev.findIndex((p) => p.id === r.id);
      if (i === -1) return [...prev, r];
      const old = prev[i];
      if (old.title === r.title && old.description === r.description)
        return prev;
      const next = prev.slice();
      next[i] = r;
      return next;
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const page = pages.length > 0 ? pages[pages.length - 1] : undefined;
  const activeId = page?.id ?? null;

  const value = useMemo<TopbarSlotValue>(
    () => ({ actionsEl, activeId, register, unregister }),
    [actionsEl, activeId, register, unregister],
  );

  return { value, page, actionsRef: setActionsEl };
}

export function TopbarSlotProvider({
  value,
  children,
}: {
  value: TopbarSlotValue;
  children: ReactNode;
}) {
  return (
    <TopbarSlotContext.Provider value={value}>
      {children}
    </TopbarSlotContext.Provider>
  );
}

/**
 * Claims the topbar for the calling screen: its title and description go to
 * the breadcrumb, and the returned element is where it should portal its
 * actions.
 *
 * Returns `undefined` outside the admin shell (render the actions inline),
 * and `null` while the slot isn't this screen's yet.
 */
export function useTopbarSlot(
  info: TopbarPageInfo,
): HTMLElement | null | undefined {
  const ctx = useContext(TopbarSlotContext);
  const id = useId();
  const register = ctx?.register;
  const unregister = ctx?.unregister;

  useEffect(() => {
    register?.({ id, title: info.title, description: info.description });
  }, [register, id, info.title, info.description]);

  useEffect(() => {
    if (!unregister) return;
    return () => unregister(id);
  }, [unregister, id]);

  if (!ctx) return undefined;
  return ctx.activeId === id ? ctx.actionsEl : null;
}
