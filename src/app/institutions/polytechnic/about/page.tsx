"use client";

import { useEffect, useState } from "react";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import {
  ABOUT_CONFIG_KEY,
  ABOUT_DEFAULTS,
  type AboutPageValue,
} from "@/data/about-content";

const INSTITUTION = "polytechnic" as const;
const DEFAULT = ABOUT_DEFAULTS[INSTITUTION];

export default function PolytechnicAboutPage() {
  const [data, setData] = useState<AboutPageValue>(DEFAULT);

  useEffect(() => {
    fetch(`/api/public/site-config?key=${ABOUT_CONFIG_KEY[INSTITUTION]}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && typeof res.data === "object") {
          setData({ ...DEFAULT, ...res.data });
        }
      })
      .catch(() => {});
  }, []);

  return <AboutPageLayout data={data} institution={INSTITUTION} />;
}
