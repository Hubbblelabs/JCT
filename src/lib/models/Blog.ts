import mongoose, { Schema, Document } from "mongoose";

/**
 * A blog post. Modelled on `Event` on purpose — same draft-free, is_active
 * shape, same college scoping, same slug-addressed public detail page — so the
 * admin CRUD, the scope guards and the asset cleanup all behave identically.
 *
 * The one structural difference is where it publishes: events surface on their
 * college's landing page and `/institutions/<inst>/events`, while blogs have a
 * single institution-agnostic listing at `/blogs`. The `institution` field is
 * still authoritative for *who may edit* the post, and is shown as a badge on
 * the card.
 */
export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  // Rich HTML body shown on the blog detail page. Authenticated-but-untrusted
  // — always render through sanitizeHtml().
  content: string;
  category: string;
  author: string;
  published_at: Date;
  image: string;
  institution: "engineering" | "arts-science" | "polytechnic";
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: String, default: "Admissions" },
    author: { type: String, default: "" },
    published_at: { type: Date, required: true },
    image: { type: String, default: "" },
    institution: {
      type: String,
      enum: ["engineering", "arts-science", "polytechnic"],
      required: true,
    },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

BlogSchema.index({ institution: 1, is_active: 1 });
BlogSchema.index({ published_at: -1 });

export const Blog =
  mongoose.models.Blog ?? mongoose.model<IBlog>("Blog", BlogSchema);
