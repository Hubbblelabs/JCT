import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  slug: string;
  college: string;
  content: Record<string, unknown>;
  status: "draft" | "published" | "archived";
  version: number;
  published_content?: Record<string, unknown>;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    slug: { type: String, required: true, unique: true },
    college: {
      type: String,
      required: true,
      enum: ["engineering", "arts-science", "polytechnic"],
    },
    content: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    version: { type: Number, default: 1 },
    published_content: { type: Schema.Types.Mixed },
    published_at: Date,
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

DepartmentSchema.index({ college: 1 });
DepartmentSchema.index({ status: 1 });

export const Department =
  mongoose.models.Department ??
  mongoose.model<IDepartment>("Department", DepartmentSchema);
