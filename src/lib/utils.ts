import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a storage key to a full image URL
 * Handles both storage keys and full URLs
 */
export function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a storage key, construct the full URL
  if (imageUrl.includes("/") || imageUrl.startsWith("uploads/")) {
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    // Remove leading slash from imageUrl if present to avoid double slashes
    const normalizedKey = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    if (publicUrl) {
      return `${publicUrl}/${normalizedKey}`;
    }
    // Fallback: public proxy route that fetches from R2 server-side (no auth required)
    return `/api/public/images/${normalizedKey}`;
  }

  return imageUrl;
}
