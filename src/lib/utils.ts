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
    if (publicUrl) {
      // Remove leading slash from imageUrl if present to avoid double slashes
      const normalizedUrl = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
      return `${publicUrl}/${normalizedUrl}`;
    }
    // Fallback to API serve endpoint if no public URL is configured
    const normalizedUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `/api/admin/images/serve${normalizedUrl}`;
  }

  return imageUrl;
}
