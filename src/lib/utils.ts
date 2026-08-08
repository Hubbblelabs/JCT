import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { publicAssetBaseUrl } from "@/lib/storage-public";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string as e.g. "04 Mar 2026" for event cards.
 * Returns "" for missing/invalid input.
 */
export function formatEventDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Converts a storage key to a full image URL
 * Handles both storage keys and full URLs
 */
export function getImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl) return null;

  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Site-relative paths (e.g. "/campus-life-assets/x.webp") point at files in
  // /public — serve them as-is. Rewriting them to object storage (or the proxy
  // route, which only serves "images/"/"documents/" keys) breaks the image.
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // If it's a storage key, construct the full URL
  if (imageUrl.includes("/")) {
    const publicUrl = publicAssetBaseUrl();
    if (publicUrl) {
      return `${publicUrl}/${imageUrl}`;
    }
    // Fallback: public proxy route that streams from storage server-side (no
    // auth required)
    return `/api/public/images/${imageUrl}`;
  }

  return imageUrl;
}

/** One accreditation badge rendered over a public program card image. */
export type CourseAccreditation = { name: string; logo: string };

/**
 * Reads the `accreditations` array off a `/api/public/programs` card. Entries
 * without a logo are dropped — an empty slot renders as a broken image. The
 * logo is whatever the admin picked from the media library (an storage key, already
 * resolved to a URL by the API), never a path baked into /public.
 */
export function parseCourseAccreditations(raw: unknown): CourseAccreditation[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>;
      return {
        name: typeof item.name === "string" ? item.name : "",
        logo: typeof item.logo === "string" ? item.logo : "",
      };
    })
    .filter((item) => item.logo !== "");
}
