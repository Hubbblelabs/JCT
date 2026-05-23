"use client";

import { useEffect, useState } from "react";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import type { AboutPageValue } from "@/lib/validation";

const INSTITUTION = "engineering" as const;
const CONFIG_KEY = "engineeringAbout";

export default function EngineeringAboutPage() {
  const [data, setData] = useState<AboutPageValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/site-config?key=${CONFIG_KEY}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && typeof res.data === "object") {
          setData(res.data as AboutPageValue);
        } else {
          setError("Failed to load content");
        }
      })
      .catch((err) => {
        console.error("[EngineeringAboutPage]", err);
        setError("Failed to load content");
      });
  }, []);

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return <AboutPageLayout data={data} institution={INSTITUTION} />;
}
