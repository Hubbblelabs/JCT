import mongoose, { Schema, Document } from "mongoose";

export interface IImageAsset extends Document {
  filename: string;
  storage_key: string;
  url: string;
  alt_text: string;
  category:
    | "department"
    | "faculty"
    | "hero"
    | "campus"
    | "program"
    | "recruiter"
    | "testimonial"
    | "other";
  institution: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  /** Which IMAGE_RATIOS preset the upload was processed with */
  ratio_type?: string;
  /** Human-readable ratio of the stored image, e.g. "16:9" */
  aspect_ratio?: string;
  uploaded_by: string;
  created_at: Date;
}

const ImageAssetSchema = new Schema<IImageAsset>(
  {
    filename: { type: String, required: true },
    storage_key: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    alt_text: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "department",
        "faculty",
        "hero",
        "campus",
        "program",
        "recruiter",
        "testimonial",
        "other",
      ],
      default: "other",
    },
    institution: { type: String, default: "all" },
    file_size: { type: Number, default: 0 },
    mime_type: { type: String, default: "image/webp" },
    width: Number,
    height: Number,
    // Optional and additive: assets uploaded before ratio selection existed
    // read back as undefined, which the UI renders as "Original".
    ratio_type: String,
    aspect_ratio: String,
    uploaded_by: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

ImageAssetSchema.index({ category: 1 });
ImageAssetSchema.index({ institution: 1 });

export const ImageAsset =
  mongoose.models.ImageAsset ??
  mongoose.model<IImageAsset>("ImageAsset", ImageAssetSchema);
