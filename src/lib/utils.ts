import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  // /public — serve them as-is. Rewriting them to R2 (or the R2 proxy route,
  // which only serves "images/"/"documents/" keys) breaks the image.
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // If it's a storage key, construct the full URL
  if (imageUrl.includes("/")) {
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl}/${imageUrl}`;
    }
    // Fallback: public proxy route that fetches from R2 server-side (no auth required)
    return `/api/public/images/${imageUrl}`;
  }

  return imageUrl;
}
