import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
  config_key: string;
  value: Record<string, unknown>;
  published_value?: Record<string, unknown>;
  status: "draft" | "published";
  version: number;
  published_at?: Date;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    config_key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: {} },
    published_value: { type: Schema.Types.Mixed },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    version: { type: Number, default: 1 },
    published_at: Date,
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const SiteConfig =
  mongoose.models.SiteConfig ??
  mongoose.model<ISiteConfig>("SiteConfig", SiteConfigSchema);
