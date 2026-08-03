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
  highlight: string;
  description: string;
  image: string;
  outcomes: string[];
  // Accreditation badges overlaid on the public program cards. `logo` is an R2
  // storage key picked from the shared media library — these logos used to be
  // hardcoded files under /public.
  accreditations: { name: string; logo: string }[];
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

// Sub-document for the card accreditation badges. `_id: false` keeps the
// stored array free of per-item ObjectIds — these are plain display values.
const ProgramAccreditationSchema = new Schema(
  {
    name: { type: String, default: "" },
    logo: { type: String, default: "" },
  },
  { _id: false },
);

const ProgramSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true },
    abbr: { type: String, required: true },
    // Uniqueness is per-institution (see the compound index below), not
    // global — three colleges must each be able to have `computer-science`.
    slug: { type: String, required: true },
    institution: {
      type: String,
      required: true,
      enum: ["engineering", "arts-science", "polytechnic"],
    },
    // Card-level display fields rendered by the public program cards
    // (degree also drives the UG/PG split on the engineering domains page).
    // These existed on legacy documents; without schema entries Mongoose
    // strict mode silently drops writes and they become uneditable.
    degree: { type: String, default: "" },
    duration: { type: String, default: "" },
    seats: { type: Number, default: 0 },
    highlight: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    outcomes: { type: [String], default: [] },
    accreditations: { type: [ProgramAccreditationSchema], default: [] },
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
// Matches the Page model's scoping. Existing databases still carry the old
// global `slug_1` index and must drop it once:
//   db.programs.dropIndex("slug_1")
ProgramSchema.index({ institution: 1, slug: 1 }, { unique: true });

export const Program =
  mongoose.models.Program ?? mongoose.model<IProgram>("Program", ProgramSchema);
