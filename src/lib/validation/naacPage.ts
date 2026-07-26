import { z } from "zod";

// ──────────────────────────────────────────────────────────────────────────
// The standalone NAAC page (/institutions/engineering/accreditations/naac),
// backed by the `engineeringNaac` SiteConfig key. Every string on the page —
// headings, table column labels, rows and document links — lives here so the
// admin editor can change all of it; nothing is hard-coded in the layout.
//
// Documents are R2 storage keys ("documents/…") produced by the document
// uploader, resolved through getImageUrl() at render time, exactly like the
// Documents page. `scripts/seed-naac.mjs` performs the one-time import of the
// legacy PDFs into R2 and writes this key.
// ──────────────────────────────────────────────────────────────────────────

export const NAAC_PAGE_LIMITS = {
  introMax: 8,
  primaryDocsMax: 12,
  qualitativeRowsMax: 60,
  quantitativeRowsMax: 60,
  rowDocsMax: 10,
  sectionsMax: 12,
  groupsMax: 30,
  groupDocsMax: 150,
} as const;

const s = (max: number) => z.string().max(max).default("");
/** A label that must never render blank — falls back to the legacy heading. */
const sd = (max: number, fallback: string) =>
  z.string().max(max).default(fallback);

const HeroSchema = z
  .object({
    title: s(200),
    subtitle: s(500),
  })
  .default({ title: "", subtitle: "" });

/** One downloadable file. `file` is an R2 key or an absolute URL. */
const NaacDocSchema = z.object({
  label: s(400),
  file: s(500),
});

const NaacQualitativeRowSchema = z.object({
  metric: s(40),
  description: s(2000),
  expertsMarks: s(20),
  marksRequested: s(20),
  justification: s(2000),
  docs: z.array(NaacDocSchema).max(NAAC_PAGE_LIMITS.rowDocsMax).default([]),
});

const NaacQuantitativeRowSchema = z.object({
  metric: s(40),
  parameter: s(600),
  /** Values claimed in the SSR. */
  ssr: s(160),
  /** Values left after Data Validation and Verification. */
  dvv: s(160),
  awarded: s(20),
  requested: s(20),
  justification: s(2000),
  docs: z.array(NaacDocSchema).max(NAAC_PAGE_LIMITS.rowDocsMax).default([]),
});

const QualitativeColumnsSchema = z
  .object({
    metric: sd(80, "Metrics"),
    description: sd(80, "Description"),
    expertsMarks: sd(80, "Experts Marks"),
    marksRequested: sd(80, "Marks Requested"),
    justification: sd(80, "Justification"),
  })
  .default({
    metric: "Metrics",
    description: "Description",
    expertsMarks: "Experts Marks",
    marksRequested: "Marks Requested",
    justification: "Justification",
  });

const QuantitativeColumnsSchema = z
  .object({
    metric: sd(80, "Metrics"),
    parameter: sd(80, "Parameter"),
    /** Spans the SSR + DVV pair. */
    values: sd(80, "Values"),
    /** Spans the awarded + requested pair. */
    marks: sd(80, "Marks"),
    ssr: sd(80, "SSR"),
    dvv: sd(80, "DVV"),
    awarded: sd(80, "Awarded"),
    requested: sd(80, "Req."),
    justification: sd(80, "Justification"),
  })
  .default({
    metric: "Metrics",
    parameter: "Parameter",
    values: "Values",
    marks: "Marks",
    ssr: "SSR",
    dvv: "DVV",
    awarded: "Awarded",
    requested: "Req.",
    justification: "Justification",
  });

const QualitativeTableSchema = z
  .object({
    title: s(200),
    description: s(600),
    columns: QualitativeColumnsSchema,
    rows: z
      .array(NaacQualitativeRowSchema)
      .max(NAAC_PAGE_LIMITS.qualitativeRowsMax)
      .default([]),
  })
  .default({
    title: "",
    description: "",
    columns: QualitativeColumnsSchema.parse(undefined),
    rows: [],
  });

const QuantitativeTableSchema = z
  .object({
    title: s(200),
    description: s(600),
    columns: QuantitativeColumnsSchema,
    rows: z
      .array(NaacQuantitativeRowSchema)
      .max(NAAC_PAGE_LIMITS.quantitativeRowsMax)
      .default([]),
  })
  .default({
    title: "",
    description: "",
    columns: QuantitativeColumnsSchema.parse(undefined),
    rows: [],
  });

const NaacDocGroupSchema = z.object({
  title: s(200),
  docs: z.array(NaacDocSchema).max(NAAC_PAGE_LIMITS.groupDocsMax).default([]),
});

/**
 * A block of grouped downloads — Extended Profile, criterion-wise evidence,
 * metric-wise evidence. `layout` picks between full-width document cards and
 * compact chips (right for short metric codes like "3.4.2").
 */
const NaacDocSectionSchema = z.object({
  title: s(200),
  description: s(600),
  layout: z.enum(["cards", "chips"]).default("cards"),
  groups: z
    .array(NaacDocGroupSchema)
    .max(NAAC_PAGE_LIMITS.groupsMax)
    .default([]),
});

export const NaacPageSchema = z.object({
  hero: HeroSchema,
  intro: z.array(s(2000)).max(NAAC_PAGE_LIMITS.introMax).default([]),
  /** Headline downloads (SSR, DVV) shown as cards above the appeal tables. */
  primaryDocs: z
    .object({
      title: s(200),
      /** Call-to-action text under each card title. */
      linkLabel: sd(80, "Click here to view"),
      docs: z
        .array(NaacDocSchema)
        .max(NAAC_PAGE_LIMITS.primaryDocsMax)
        .default([]),
    })
    .default({ title: "", linkLabel: "Click here to view", docs: [] }),
  appeal: z
    .object({
      badge: s(120),
      title: s(300),
    })
    .default({ badge: "", title: "" }),
  qualitative: QualitativeTableSchema,
  quantitative: QuantitativeTableSchema,
  docSections: z
    .array(NaacDocSectionSchema)
    .max(NAAC_PAGE_LIMITS.sectionsMax)
    .default([]),
});

export type NaacPageValue = z.infer<typeof NaacPageSchema>;
export type NaacDocValue = z.infer<typeof NaacDocSchema>;
export type NaacQualitativeRowValue = z.infer<typeof NaacQualitativeRowSchema>;
export type NaacQuantitativeRowValue = z.infer<
  typeof NaacQuantitativeRowSchema
>;
export type NaacDocGroupValue = z.infer<typeof NaacDocGroupSchema>;
export type NaacDocSectionValue = z.infer<typeof NaacDocSectionSchema>;
