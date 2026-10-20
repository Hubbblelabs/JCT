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

// Each image field fixes its ratio in code (the `ratio` prop on the admin
// inputs) — there is no per-upload picker, since the field already knows the
// frame it renders into, and a mismatched choice only cropped twice. sharp
// resizes to these dimensions, so the admin preview and the public rendering
// agree.
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
  /** Shown beside an uploaded image's dimensions */
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
  /** Shown under the field: what happens to the file, and the size to aim for */
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
    hint: "Keeps its own shape; anything wider than 1920px is scaled down.",
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
    hint: "Cropped to 16:9 from the centre. 1920×1080px or larger stays sharp.",
  },
  card: {
    label: "Standard Card",
    ratio: "4:3",
    width: 800,
    height: 600,
    fit: "cover",
    aspectClass: "aspect-[4/3]",
    hint: "Cropped to 4:3 from the centre. 800×600px or larger stays sharp.",
  },
  square: {
    label: "Logo / Icon",
    ratio: "1:1",
    width: 500,
    height: 500,
    fit: "contain",
    aspectClass: "aspect-square",
    hint: "Fitted into a 1:1 square and padded, never cropped.",
  },
  portrait: {
    label: "Portrait",
    ratio: "3:4",
    width: 600,
    height: 800,
    fit: "cover",
    aspectClass: "aspect-[3/4]",
    hint: "Cropped to 3:4 from the centre. 600×800px or larger stays sharp.",
  },
};

/**
 * Size the upload pipeline produces from a `width` x `height` source.
 *
 * - "auto" keeps the source shape and only caps the width.
 * - "contain" always yields the rule's canvas.
 * - "cover" gives exactly rule.width x rule.height for a source at least that
 *   large. A smaller one is cropped to the same shape at the largest size it
 *   can fill, never upscaled — an upscale only stores a blurrier copy of the
 *   same pixels. Such sources used to be refused, but with the ratio fixed per
 *   field that would leave no way to upload them at all, so the admin input
 *   warns instead (`belowRatioTarget`).
 */
export function ratioOutputSize(
  rule: RatioRule,
  width: number,
  height: number,
): { width: number; height: number } {
  if (rule.height === null) {
    const scale = Math.min(1, rule.width / width);
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  }
  if (rule.fit === "contain") return { width: rule.width, height: rule.height };
  const scale = Math.min(1, width / rule.width, height / rule.height);
  return {
    width: Math.max(1, Math.round(rule.width * scale)),
    height: Math.max(1, Math.round(rule.height * scale)),
  };
}

/**
 * True when a source is smaller than a fixed "cover" frame, so it is stored
 * below the target size and may look soft. "contain" and "auto" never crop,
 * so they never warn.
 */
export function belowRatioTarget(
  rule: RatioRule,
  width: number,
  height: number,
): boolean {
  if (rule.height === null || rule.fit !== "cover") return false;
  return width < rule.width || height < rule.height;
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
