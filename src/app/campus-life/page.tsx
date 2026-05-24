"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CampusLifePageLayout } from "@/components/layout/CampusLifePageLayout";
import type { CampusLifePageValue } from "@/lib/validation";

const CONFIG_KEY = "campusLifePage";

export default function CampusLifePage() {
  const [data, setData] = useState<CampusLifePageValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/site-config?key=${CONFIG_KEY}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && typeof res.data === "object") {
          setData(res.data as CampusLifePageValue);
        } else {
          setError("Failed to load content");
        }
      })
      .catch((err) => {
        console.error("[CampusLifePage]", err);
        setError("Failed to load content");
      });
  }, []);

  if (error) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground text-lg">{error}</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground text-lg">Loading…</p>
        </div>
        <Footer />
      </main>
    );
  }

  return <CampusLifePageLayout data={data} />;
}
