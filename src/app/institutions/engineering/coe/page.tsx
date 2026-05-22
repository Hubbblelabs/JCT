"use client";

import { useEffect, useState } from "react";
import { CoePageLayout } from "@/components/layout/CoePageLayout";
import { COE_CONFIG_KEY, COE_DEFAULT } from "@/data/coe-content";
import type { CoePageValue } from "@/lib/validation";

export default function COEPage() {
  const [data, setData] = useState<CoePageValue>(COE_DEFAULT);

  useEffect(() => {
    fetch(`/api/public/site-config?key=${COE_CONFIG_KEY}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && typeof res.data === "object") {
          setData({ ...COE_DEFAULT, ...res.data });
        }
      })
      .catch(() => {});
  }, []);

  return <CoePageLayout data={data} />;
}
