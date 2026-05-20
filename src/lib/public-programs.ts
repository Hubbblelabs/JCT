import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import { normalizeProgramData } from "@/lib/normalize-program-data";
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
  is_active?: boolean;
  sort_order?: number;
  status?: string;
  version?: number;
  published_at?: Date | string;
  published_content?: unknown;
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
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl.replace(/\/$/, "")}/${imageUrl.replace(/^\//, "")}`;
    }
    return `/api/public/images/${imageUrl.replace(/^\//, "")}`;
  }
  return imageUrl;
}

function asCard(doc: ProgramLean): PublicProgramCard {
  return {
    _id: String(doc._id),
    name: doc.name ?? "",
    abbr: doc.abbr ?? "",
    slug: doc.slug ?? "",
    institution: doc.institution ?? "engineering",
    degree: doc.degree ?? "",
    duration: doc.duration ?? "",
    seats: doc.seats ?? 0,
    image: publicImageUrl(doc.image),
    highlight: doc.highlight ?? "",
    description: doc.description ?? "",
    outcomes: Array.isArray(doc.outcomes) ? doc.outcomes : [],
    sort_order: doc.sort_order ?? 0,
  };
}

function publishedQuery(publishedOnly: boolean): Record<string, unknown> {
  if (!publishedOnly) return {};
  return {
    status: "published",
    published_content: { $exists: true, $ne: null },
  };
}

export async function listPublicPrograms({
  institution,
  degree,
  publishedOnly = false,
}: {
  institution?: string | null;
  degree?: string | null;
  publishedOnly?: boolean;
}): Promise<PublicProgramCard[]> {
  await connectDB();

  const query: Record<string, unknown> = {
    is_active: true,
    ...publishedQuery(publishedOnly),
  };
  if (institution) query.institution = institution;
  if (degree) query.degree = degree;

  const docs = await Program.find(query)
    .select(
      "name abbr slug institution degree duration seats image highlight description outcomes sort_order",
    )
    .sort({ sort_order: 1, name: 1 })
    .lean<ProgramLean[]>();

  return docs.map(asCard);
}

export async function listPublishedProgramSlugs(
  institution: ProgramInstitution,
): Promise<{ slug: string }[]> {
  await connectDB();

  const docs = await Program.find({
    institution,
    is_active: true,
    ...publishedQuery(true),
  })
    .select("slug")
    .sort({ sort_order: 1, name: 1 })
    .lean<{ slug?: string }[]>();

  return docs
    .map((doc) => doc.slug)
    .filter((slug): slug is string => typeof slug === "string" && !!slug)
    .map((slug) => ({ slug }));
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
    ...publishedQuery(true),
  })
    .select(
      "name abbr slug institution degree duration seats image highlight description outcomes sort_order status version published_at published_content",
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

  const normalized = normalizeProgramData(content, slug);
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
