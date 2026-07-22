import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  excerpt: string;
  // Rich HTML body shown on the event detail page. Authenticated-but-
  // untrusted — always render through sanitizeHtml().
  description: string;
  category: string;
  event_date: Date;
  location: string;
  image: string;
  // Extra photos shown as a grid on the detail page, below the body. The cover
  // `image` is separate — it drives the card thumbnail and the detail hero.
  gallery: string[];
  institution: "engineering" | "arts-science" | "polytechnic";
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "Campus Life" },
    event_date: { type: Date, required: true },
    location: { type: String, default: "" },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
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

EventSchema.index({ institution: 1, is_active: 1 });
EventSchema.index({ event_date: -1 });

export const Event =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);
