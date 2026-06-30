import mongoose, { Schema, Document } from "mongoose";

export type PageInstitution =
  "main" | "engineering" | "arts-science" | "polytechnic";

export type PageTemplate =
  "standard" | "hero-content" | "sidebar" | "gallery" | "contact";

export type PageStatus = "draft" | "published" | "archived";

export interface IPage extends Document {
  slug: string;
  institution: PageInstitution;
  title: string;
  template: PageTemplate;

  /** Rich content body (draft). Shape depends on template. */
  content: Record<string, unknown>;
  /** Published snapshot — what the public site reads. */
  published_content?: Record<string, unknown>;

  status: PageStatus;
  version: number;
  published_at?: Date;

  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true },
    institution: {
      type: String,
      required: true,
      enum: ["main", "engineering", "arts-science", "polytechnic"],
    },
    title: { type: String, required: true, default: "" },
    template: {
      type: String,
      required: true,
      enum: ["standard", "hero-content", "sidebar", "gallery", "contact"],
      default: "standard",
    },

    content: { type: Schema.Types.Mixed, default: {} },
    published_content: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    version: { type: Number, default: 1 },
    published_at: Date,

    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Unique slug within an institution scope. Different institutions can re-use slugs.
PageSchema.index({ institution: 1, slug: 1 }, { unique: true });
PageSchema.index({ institution: 1, status: 1 });

export const Page =
  (mongoose.models.Page as mongoose.Model<IPage>) ??
  mongoose.model<IPage>("Page", PageSchema);
