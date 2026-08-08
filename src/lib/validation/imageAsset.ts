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

// Images are POSTed straight through the serverless function (they need
// server-side sharp processing, so they can't use the presigned direct-to-storage
// path documents use). Vercel caps a function request body at ~4.5 MB, so a
// larger image is rejected by the platform with a 413 ("FUNCTION_PAYLOAD_TOO_LARGE")
// before our route runs. Validate against this on the client so the user gets a
// clear "file too large" message instead of an opaque "Upload failed".
export const MAX_DIRECT_UPLOAD_SIZE = 4 * 1024 * 1024; // 4 MB (headroom under 4.5)

// The editor picks a ratio at upload time and sharp resizes to exactly these
// dimensions, so the admin preview and the public rendering always agree.
//
// This supersedes the old per-category CATEGORY_RULES: `category` is now pure
// taxonomy (filtering/scoping) and carries no dimension semantics. Having one
// system means an upload can only ever be rejected for one reason.
export const RATIO_TYPES = [
  "auto",
  "hero",
  "card",
  "square",
  "portrait",
] as const;

export type RatioType = (typeof RATIO_TYPES)[number];

export type RatioRule = {
  /** Shown in the upload picker */
  label: string;
  /** Human-readable ratio, stored on the asset as `aspect_ratio` */
  ratio: string;
  width: number;
  /** null = preserve the source ratio and only cap the width */
  height: number | null;
  /**
   * "cover" crops to fill the frame (photographic content — a predictable
   * frame matters more than keeping every edge pixel). "contain" pads instead,
   * for logos, where cropping would clip the mark.
   */
  fit: "cover" | "contain";
  /** Tailwind class used for the admin preview box; null = intrinsic */
  aspectClass: string | null;
  hint: string;
};

export const IMAGE_RATIOS: Record<RatioType, RatioRule> = {
  auto: {
    label: "Auto / Original",
    ratio: "original",
    width: 1920,
    height: null,
    fit: "cover",
    aspectClass: null,
    hint: "Keeps the source shape; only caps width at 1920px.",
  },
  hero: {
    label: "Hero Banner",
    ratio: "16:9",
    // 1920 rather than 1200: a hero spans the full viewport, so a 1200px-wide
    // source gets upscaled by the browser on a 1080p display and visibly
    // softens. This also matches the width the pipeline emitted before ratios
    // existed, so switching a field to "hero" is never a quality regression.
    width: 1920,
    height: 1080,
    fit: "cover",
    aspectClass: "aspect-video",
    hint: "Full-width banners and page heroes.",
  },
  card: {
    label: "Standard Card",
    ratio: "4:3",
    width: 800,
    height: 600,
    fit: "cover",
    aspectClass: "aspect-[4/3]",
    hint: "Course, program, and campus cards.",
  },
  square: {
    label: "Logo / Icon",
    ratio: "1:1",
    width: 500,
    height: 500,
    fit: "contain",
    aspectClass: "aspect-square",
    hint: "Recruiter logos and icons — padded, never cropped.",
  },
  portrait: {
    label: "Portrait",
    ratio: "3:4",
    width: 600,
    height: 800,
    fit: "cover",
    aspectClass: "aspect-[3/4]",
    hint: "Faculty photos and testimonial headshots.",
  },
};

/**
 * A "cover" resize to a fixed frame will happily upscale a small source into a
 * blurry result. Reject that at the boundary instead, and tell the editor the
 * minimum they need. "contain" is exempt: it pads rather than upscales, which
 * is the correct behaviour for a small logo.
 */
export function ratioSourceTooSmall(
  rule: RatioRule,
  width: number,
  height: number,
): string | null {
  if (rule.height === null || rule.fit !== "cover") return null;
  if (width < rule.width || height < rule.height) {
    return `Image is ${width}x${height}px, too small for ${rule.label} (${rule.ratio}). Supply at least ${rule.width}x${rule.height}px.`;
  }
  return null;
}

export const ImageUploadFieldsSchema = z.object({
  altText: zOptionalString(200).default(""),
  category: zEnum(IMAGE_CATEGORIES).optional().default("other"),
  institution: zEnum(IMAGE_INSTITUTIONS).optional().default("all"),
  ratioType: zEnum(RATIO_TYPES).optional().default("auto"),
});

export const ImageAssetPatchSchema = z
  .object({
    alt_text: zOptionalString(200),
    category: zEnum(IMAGE_CATEGORIES),
    filename: zClampedString(1, 200, "Filename"),
  })
  .partial();

export type ImageUploadFields = z.infer<typeof ImageUploadFieldsSchema>;
