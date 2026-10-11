import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";

/**
 * The social networks the site links to. The URLs themselves are entered once,
 * in the Footer settings; the footer's "Connect With Us" row and the floating
 * social strip both read them from there.
 */
export const SOCIAL_KEYS = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];

export const SOCIAL_DEFS: readonly {
  key: SocialKey;
  Icon: IconType;
  label: string;
  /** Brand colour, used by the floating strip on hover. */
  color: string;
}[] = [
  { key: "facebook", Icon: FaFacebookF, label: "Facebook", color: "#1877F2" },
  { key: "instagram", Icon: FaInstagram, label: "Instagram", color: "#E4405F" },
  { key: "twitter", Icon: FaXTwitter, label: "X", color: "#000000" },
  { key: "linkedin", Icon: FaLinkedinIn, label: "LinkedIn", color: "#0A66C2" },
  { key: "youtube", Icon: FaYoutube, label: "YouTube", color: "#FF0000" },
];

export type SocialLink = {
  key: SocialKey;
  Icon: IconType;
  label: string;
  color: string;
  href: string;
};

/** Networks that have a URL set, in display order. */
export function socialLinksFrom(
  source: Partial<Record<SocialKey, string | undefined>> | null | undefined,
): SocialLink[] {
  return SOCIAL_DEFS.map((d) => ({
    ...d,
    href: (source?.[d.key] ?? "").trim(),
  })).filter((s) => s.href);
}
