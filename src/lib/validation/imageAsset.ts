import { z } from "zod";
import { zEnum, zClampedString, zOptionalString } from "./_primitives";

// Categories must match the ImageAsset Mongoose enum.
export const IMAGE_CATEGORIES = [
  "department",
  "faculty",
  "hero",
  "campus",
  "program",
  "recruiter",
  "testimonial",
  "other",
] as const;

export const IMAGE_INSTITUTIONS = [
  "all",
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Per-category target width + dimension constraints (run after sharp metadata).
// Soft caps on dimensions only — the upload route also resizes to targetWidth
// to keep payloads small. minWidth is a quality floor (reject tiny avatars).
export type CategoryRule = {
  targetWidth: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  /** Aspect ratio = width/height; tolerance is +/- on the value */
  aspect?: { value: number; tolerance: number; label: string };
};

export const CATEGORY_RULES: Record<
  (typeof IMAGE_CATEGORIES)[number],
  CategoryRule
> = {
  hero: {
    targetWidth: 1920,
    minWidth: 1280,
    minHeight: 600,
    aspect: { value: 16 / 9, tolerance: 0.25, label: "~16:9" },
  },
  campus: {
    targetWidth: 1600,
    minWidth: 800,
    aspect: { value: 4 / 3, tolerance: 0.25, label: "~4:3" },
  },
  program: {
    targetWidth: 1200,
    minWidth: 600,
    aspect: { value: 16 / 9, tolerance: 0.3, label: "~16:9" },
  },
  department: {
    targetWidth: 1600,
    minWidth: 800,
  },
  faculty: {
    targetWidth: 600,
    minWidth: 200,
    maxWidth: 1200,
    maxHeight: 1600,
  },
  recruiter: {
    targetWidth: 600,
    minWidth: 100,
    maxWidth: 1200,
    maxHeight: 1200,
  },
  testimonial: {
    targetWidth: 400,
    minWidth: 100,
    maxWidth: 800,
    maxHeight: 800,
  },
  other: {
    targetWidth: 1920,
  },
};

export const ImageUploadFieldsSchema = z.object({
  altText: zOptionalString(200).default(""),
  category: zEnum(IMAGE_CATEGORIES).optional().default("other"),
  institution: zEnum(IMAGE_INSTITUTIONS).optional().default("all"),
});

export const ImageAssetPatchSchema = z
  .object({
    alt_text: zOptionalString(200),
    category: zEnum(IMAGE_CATEGORIES),
    filename: zClampedString(1, 200, "Filename"),
  })
  .partial();

export type ImageUploadFields = z.infer<typeof ImageUploadFieldsSchema>;
