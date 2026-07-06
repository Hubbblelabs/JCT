import mongoose, { Schema, Document } from "mongoose";

export interface INotablePlacement {
  name: string;
  program: string;
  company: string;
  package: string;
  image: string;
}

export interface ITopRecruiter {
  name: string;
  logo: string;
}

// One document = one academic year's placement record for one college.
// The public placement page lists these year-wise (current year highlighted,
// past years below). Rich page content that used to live on Department now
// lives on Program; placements are their own collection keyed by (institution,
// year).
export interface IPlacement extends Document {
  institution: "engineering" | "arts-science" | "polytechnic";
  year: string; // academic year label, e.g. "2024-2025"
  is_current: boolean; // highlight this record as the present year
  summary: string;
  // Package stats — kept as display strings so editors control the unit/format
  // ("45 LPA", "₹12.5 LPA", etc.).
  highest_package: string;
  average_package: string;
  median_package: string;
  // Placement counts.
  students_placed: number;
  total_students: number;
  placement_percentage: number;
  offers_made: number;
  companies_visited: number;
  top_recruiters: ITopRecruiter[];
  notable_placements: INotablePlacement[];
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const TopRecruiterSchema = new Schema<ITopRecruiter>(
  {
    name: { type: String, default: "" },
    logo: { type: String, default: "" },
  },
  { _id: false },
);

const NotablePlacementSchema = new Schema<INotablePlacement>(
  {
    name: { type: String, default: "" },
    program: { type: String, default: "" },
    company: { type: String, default: "" },
    package: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const PlacementSchema = new Schema<IPlacement>(
  {
    institution: {
      type: String,
      enum: ["engineering", "arts-science", "polytechnic"],
      required: true,
    },
    year: { type: String, required: true },
    is_current: { type: Boolean, default: false },
    summary: { type: String, default: "" },
    highest_package: { type: String, default: "" },
    average_package: { type: String, default: "" },
    median_package: { type: String, default: "" },
    students_placed: { type: Number, default: 0 },
    total_students: { type: Number, default: 0 },
    placement_percentage: { type: Number, default: 0 },
    offers_made: { type: Number, default: 0 },
    companies_visited: { type: Number, default: 0 },
    top_recruiters: { type: [TopRecruiterSchema], default: [] },
    notable_placements: { type: [NotablePlacementSchema], default: [] },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// One record per academic year per college.
PlacementSchema.index({ institution: 1, year: 1 }, { unique: true });
PlacementSchema.index({ institution: 1, is_active: 1, sort_order: 1 });

export const Placement =
  mongoose.models.Placement ??
  mongoose.model<IPlacement>("Placement", PlacementSchema);
