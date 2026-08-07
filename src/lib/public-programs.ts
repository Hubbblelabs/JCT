import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import {
  normalizeProgramData,
  withProgramCardFields,
} from "@/lib/normalize-program-data";
import { publicAssetBaseUrl } from "@/lib/storage-public";
import type { ProgramData } from "@/types/program";

export type ProgramInstitution = "engineering" | "arts-science" | "polytechnic";

type ProgramLean = {
  _id: unknown;
  name?: string;
  abbr?: string;
  slug?: string;
  institution?: ProgramInstitution;
  degree?: string;
  duration?: string;
  seats?: number;
  image?: string;
  highlight?: string;
  description?: string;
  outcomes?: string[];
  accreditations?: { name?: string; logo?: string }[];
  is_active?: boolean;
  sort_order?: number;
  status?: string;
  version?: number;
  published_at?: Date | string;
  published_content?: unknown;
  content?: unknown;
};

export type PublicProgramAccreditation = {
  name: string;
  /** Absolute (or proxy) URL — already resolved out of its R2 storage key. */
  logo: string;
};

export type PublicProgramCard = {
  _id: string;
  name: string;
  abbr: string;
  slug: string;
  institution: ProgramInstitution;
  degree: string;
  duration: string;
  seats: number;
  image: string | null;
  highlight: string;
  description: string;
  outcomes: string[];
  accreditations: PublicProgramAccreditation[];
  sort_order: number;
};

export type PublicProgramDetail = PublicProgramCard & {
  status: "published";
  version: number;
  published_at?: string;
  content: ProgramData;
};

function publicImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }
  if (imageUrl.includes("/") || imageUrl.startsWith("uploads/")) {
    const publicUrl = publicAssetBaseUrl();
    if (publicUrl) {
      return `${publicUrl}/${imageUrl.replace(/^\//, "")}`;
    }
    return `/api/public/images/${imageUrl.replace(/^\//, "")}`;
  }
  return imageUrl;
}

function heroImageFrom(content: unknown): string | null {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const hero = (content as Record<string, unknown>).heroImage;
    if (typeof hero === "string" && hero.trim().length > 0) return hero;
  }
  return null;
}

/**
 * Badge logos are stored as R2 keys; resolve them here so every consumer gets
 * a ready-to-render URL. Entries without a logo are dropped — an empty badge
 * slot would render as a broken image.
 */
function accreditationsFrom(
  raw: ProgramLean["accreditations"],
): PublicProgramAccreditation[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      name: item?.name ?? "",
      logo: publicImageUrl(item?.logo) ?? "",
    }))
    .filter((item) => item.logo !== "");
}

function asCard(doc: ProgramLean): PublicProgramCard {
  // Card image mirrors the program-detail hero image; fall back to the
  // card-level `image` when no hero image is set.
  const heroImage =
    heroImageFrom(doc.published_content) ?? heroImageFrom(doc.content);
  return {
    _id: String(doc._id),
    name: doc.name ?? "",
    abbr: doc.abbr ?? "",
    slug: doc.slug ?? "",
    institution: doc.institution ?? "engineering",
    degree: doc.degree ?? "",
    duration: doc.duration ?? "",
    seats: doc.seats ?? 0,
    image: publicImageUrl(heroImage ?? doc.image),
    highlight: doc.highlight ?? "",
    description: doc.description ?? "",
    outcomes: Array.isArray(doc.outcomes) ? doc.outcomes : [],
    accreditations: accreditationsFrom(doc.accreditations),
    sort_order: doc.sort_order ?? 0,
  };
}

/** The published-content gate every public read shares. */
const PUBLISHED_QUERY = {
  status: "published",
  published_content: { $exists: true, $ne: null },
} as const;

/**
 * Published rows only, with no opt-out parameter.
 *
 * The one caller is the unauthenticated /api/public/programs route, so a
 * caller-controlled "include drafts" flag is an enumeration hole for embargoed
 * course names, seat counts and hero images — which is exactly what it was
 * before. Admin previews read the requireRole-gated /api/admin/programs.
 */
export async function listPublicPrograms({
  institution,
  degree,
}: {
  institution?: string | null;
  degree?: string | null;
}): Promise<PublicProgramCard[]> {
  await connectDB();

  const query: Record<string, unknown> = {
    is_active: true,
    ...PUBLISHED_QUERY,
  };
  if (institution) query.institution = institution;
  if (degree) query.degree = degree;

  const docs = await Program.find(query)
    .select(
      "name abbr slug institution degree duration seats image highlight description outcomes accreditations sort_order published_content.heroImage content.heroImage",
    )
    .sort({ sort_order: 1, name: 1 })
    .lean<ProgramLean[]>();

  return docs.map(asCard);
}

export async function listPublishedProgramSlugs(
  institution: ProgramInstitution,
): Promise<{ slug: string }[]> {
  // Runs inside generateStaticParams at build time. If the DB is briefly
  // unreachable during `next build`, degrade to zero prerendered slugs
  // instead of aborting the entire build — program pages still render on
  // demand via ISR (dynamicParams defaults to true).
  try {
    await connectDB();

    const docs = await Program.find({
      institution,
      is_active: true,
      ...PUBLISHED_QUERY,
    })
      .select("slug")
      .sort({ sort_order: 1, name: 1 })
      .lean<{ slug?: string }[]>();

    return docs
      .map((doc) => doc.slug)
      .filter((slug): slug is string => typeof slug === "string" && !!slug)
      .map((slug) => ({ slug }));
  } catch (err) {
    console.warn(
      `[public-programs] listPublishedProgramSlugs(${institution}) failed; ` +
        "falling back to on-demand rendering:",
      err,
    );
    return [];
  }
}

export async function getPublishedProgramBySlug({
  institution,
  slug,
}: {
  institution: ProgramInstitution;
  slug: string;
}): Promise<PublicProgramDetail | null> {
  await connectDB();

  const doc = await Program.findOne({
    slug,
    institution,
    is_active: true,
    ...PUBLISHED_QUERY,
  })
    .select(
      "name abbr slug institution degree duration seats image highlight description outcomes accreditations sort_order status version published_at published_content",
    )
    .lean<ProgramLean | null>();

  if (!doc?.published_content) return null;

  const content =
    doc.published_content &&
    typeof doc.published_content === "object" &&
    !Array.isArray(doc.published_content)
      ? {
          ...(doc.published_content as Record<string, unknown>),
          name:
            (doc.published_content as Record<string, unknown>).name ??
            doc.name ??
            "",
          shortName:
            (doc.published_content as Record<string, unknown>).shortName ??
            doc.abbr ??
            "",
          college:
            (doc.published_content as Record<string, unknown>).college ??
            institution,
        }
      : doc.published_content;

  const normalized = normalizeProgramData(
    withProgramCardFields(content, {
      degree: doc.degree,
      duration: doc.duration,
      seats: doc.seats,
    }),
    slug,
  );
  if (!normalized) return null;

  return {
    ...asCard(doc),
    status: "published",
    version: doc.version ?? 1,
    ...(doc.published_at
      ? { published_at: new Date(doc.published_at).toISOString() }
      : {}),
    content: normalized,
  };
}
