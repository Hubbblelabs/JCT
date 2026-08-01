"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * The year-wise placement records used to be authored here, in a modal on a
 * list of their own. They are now edited inside the Placements page editor —
 * click a year's figures, recruiters or students in the live preview — so this
 * route only forwards old bookmarks to it.
 *
 * Two editors writing the same documents is what this avoids: the page editor
 * holds every record in memory and PATCHes the changed ones on save, and a
 * second screen saving behind its back would silently drop those edits.
 */
function PlacementsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const college = searchParams.get("college") ?? "engineering";

  useEffect(() => {
    router.replace(
      `/admin/placements-page?college=${encodeURIComponent(college)}`,
    );
  }, [router, college]);

  return (
    <div className="admin-content">
      <div className="flex items-center justify-center py-28">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    </div>
  );
}

export default function PlacementsAdminPage() {
  return (
    <Suspense fallback={null}>
      <PlacementsRedirect />
    </Suspense>
  );
}
