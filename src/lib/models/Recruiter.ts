import mongoose, { Schema, Document } from "mongoose";

export interface IRecruiter extends Document {
  name: string;
  logo: string;
  website?: string;
  industry?: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const RecruiterSchema = new Schema<IRecruiter>(
  {
    name: { type: String, required: true, unique: true },
    logo: { type: String, default: "" },
    website: String,
    industry: String,
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

RecruiterSchema.index({ is_active: 1, sort_order: 1 });

export const Recruiter =
  mongoose.models.Recruiter ??
  mongoose.model<IRecruiter>("Recruiter", RecruiterSchema);
