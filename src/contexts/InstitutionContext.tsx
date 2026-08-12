"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";

type Institution = "main" | "engineering" | "arts-science" | "polytechnic";

const INSTITUTIONS: Institution[] = [
  "main",
  "engineering",
  "arts-science",
  "polytechnic",
];

interface InstitutionContextType {
  institution: Institution;
  setInstitution: (inst: Institution) => void;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "currentInstitution";

function getPathnameInstitution(path: string): Institution | null {
  if (path === "/") return "main";
  if (path.startsWith("/institutions/engineering")) return "engineering";
  if (path.startsWith("/institutions/arts-science")) return "arts-science";
  if (path.startsWith("/institutions/polytechnic")) return "polytechnic";
  return null;
}

export function InstitutionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const pathInstitution = getPathnameInstitution(pathname);

  // Only the routes whose path names no college fall back to the last one the
  // visitor was in (/events, /about-us, a footer content page…).
  const [remembered, setRemembered] = useState<Institution | null>(null);

  // DERIVED, not state. Holding the institution in state and syncing it from
  // an effect meant a client-side navigation rendered once with the *previous*
  // page's value before the effect corrected it — so moving from Engineering
  // to Arts & Science, or picking a college out of the Institutions dropdown,
  // painted the college you just left in the navbar. Deriving it here means
  // the very first render of the new route already has the right one.
  const institution: Institution = pathInstitution ?? remembered ?? "main";

  // Read on mount only: sessionStorage doesn't exist during SSR, so seeding
  // the initial value from it would render different HTML on the server than
  // on the client's first pass and break hydration.
  useEffect(() => {
    if (pathInstitution !== null) return;
    const stored = window.sessionStorage.getItem(
      STORAGE_KEY,
    ) as Institution | null;
    if (stored && INSTITUTIONS.includes(stored)) setRemembered(stored);
    // Runs once — a later navigation to a college route writes the value
    // through the effect below instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathInstitution === null) return;
    setRemembered(pathInstitution);
    window.sessionStorage.setItem(STORAGE_KEY, pathInstitution);
  }, [pathInstitution]);

  const setInstitution = (inst: Institution) => {
    setRemembered(inst);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, inst);
    }
  };

  return (
    <InstitutionContext.Provider value={{ institution, setInstitution }}>
      {/* reducedMotion="user" makes every Framer Motion animation honor the
          OS "reduce motion" preference (WCAG 2.3.3) without per-component code. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const context = useContext(InstitutionContext);
  if (context === undefined) {
    throw new Error(
      "useInstitution must be used within an InstitutionProvider",
    );
  }
  return context;
}
