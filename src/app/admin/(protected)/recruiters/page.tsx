"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * The Placement Highlights copy used to be edited here, on a form of its own.
 * It is now a section of each landing-page editor — click the placement
 * section in the live preview — so this route only forwards old bookmarks.
 */
function RecruitersRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const college = searchParams.get("college");

  useEffect(() => {
    router.replace(
      college === "engineering" ||
        college === "arts-science" ||
        college === "polytechnic"
        ? `/admin/page-content?college=${college}&section=placements`
        : "/admin/main/page-content?section=placements",
    );
  }, [router, college]);

  return (
    <div className="admin-content">
      <div className="flex items-center justify-center py-28">
        <Loader2
          size={24}
          className="animate-spin text-[var(--admin-text-faint)]"
        />
      </div>
    </div>
  );
}

export default function RecruitersPage() {
  return (
    <Suspense fallback={null}>
      <RecruitersRedirect />
    </Suspense>
  );
}
