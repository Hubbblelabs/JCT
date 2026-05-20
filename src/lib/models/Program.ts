import mongoose, { Schema, Document } from "mongoose";

export interface IProgram extends Document {
  // Card-level fields
  name: string;
  abbr: string;
  slug: string;
  institution: "engineering" | "arts-science" | "polytechnic";
  degree: string;
  duration: string;
  seats: number;
  image: string;
  highlight: string;
  description: string;
  outcomes: string[];
  is_active: boolean;
  sort_order: number;

  // Rich page content (was previously stored on Department.content)
  content: Record<string, unknown>;
  published_content?: Record<string, unknown>;
  status: "draft" | "published" | "archived";
  version: number;
  published_at?: Date;

  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const ProgramSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true },
    abbr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    institution: {
      type: String,
      required: true,
      enum: ["engineering", "arts-science", "polytechnic"],
    },
    degree: { type: String, default: "" },
    duration: { type: String, default: "" },
    seats: { type: Number, default: 60 },
    image: { type: String, default: "" },
    highlight: { type: String, default: "" },
    description: { type: String, default: "" },
    outcomes: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },

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

ProgramSchema.index({ institution: 1, is_active: 1 });
ProgramSchema.index({ institution: 1, status: 1 });

export const Program =
  mongoose.models.Program ?? mongoose.model<IProgram>("Program", ProgramSchema);
