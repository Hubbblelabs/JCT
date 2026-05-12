"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface InstitutionContextType {
  institution: "main" | "engineering" | "arts-science" | "polytechnic";
  setInstitution: (
    inst: "main" | "engineering" | "arts-science" | "polytechnic",
  ) => void;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(
  undefined,
);

export function InstitutionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  const getPathnameInstitution = (
    path: string,
  ): "main" | "engineering" | "arts-science" | "polytechnic" | null => {
    if (path === "/") return "main";
    if (path.startsWith("/institutions/engineering")) return "engineering";
    if (path.startsWith("/institutions/arts-science")) return "arts-science";
    if (path.startsWith("/institutions/polytechnic")) return "polytechnic";
    return null;
  };

  const initialPathInst = getPathnameInstitution(pathname);

  const [institution, setInstitutionState] = useState<
    "main" | "engineering" | "arts-science" | "polytechnic"
  >(initialPathInst || "main");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    if (initialPathInst === null) {
      const stored = sessionStorage.getItem("currentInstitution") as
        | "main"
        | "engineering"
        | "arts-science"
        | "polytechnic"
        | null;
      if (
        stored &&
        ["main", "engineering", "arts-science", "polytechnic"].includes(stored)
      ) {
        setInstitutionState(stored);
      }
    } else {
      sessionStorage.setItem("currentInstitution", initialPathInst);
    }
  }, [initialPathInst]);

  const setInstitution = (
    inst: "main" | "engineering" | "arts-science" | "polytechnic",
  ) => {
    setInstitutionState(inst);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentInstitution", inst);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    const pathInst = getPathnameInstitution(pathname);
    if (pathInst) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInstitution(pathInst);
    }
  }, [pathname, isMounted]);

  return (
    <InstitutionContext.Provider value={{ institution, setInstitution }}>
      {children}
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
