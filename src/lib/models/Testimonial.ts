import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  batch: string;
  course: string;
  company: string;
  quote: string;
  avatar: string;
  category: "Alumni" | "Student" | "Industry";
  institution: "engineering" | "arts-science" | "polytechnic" | "all";
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    batch: { type: String, required: true },
    course: { type: String, default: "" },
    company: { type: String, default: "" },
    quote: { type: String, required: true },
    avatar: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Alumni", "Student", "Industry"],
      default: "Alumni",
    },
    institution: {
      type: String,
      enum: ["engineering", "arts-science", "polytechnic", "all"],
      default: "all",
    },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

TestimonialSchema.index({ institution: 1, is_active: 1 });
TestimonialSchema.index({ category: 1 });

export const Testimonial =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
