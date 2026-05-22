import mongoose, { Schema, Document } from "mongoose";

export interface IDocumentAsset extends Document {
  filename: string;
  storage_key: string;
  url: string;
  mime_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: Date;
  updated_at: Date;
}

const DocumentAssetSchema = new Schema<IDocumentAsset>(
  {
    filename: { type: String, required: true },
    /** The R2 object key, e.g. "documents/all/1234567890-prospectus.pdf" */
    storage_key: { type: String, required: true, unique: true },
    /** Full public URL or server-proxy path */
    url: { type: String, required: true },
    mime_type: { type: String, default: "application/pdf" },
    file_size: { type: Number, default: 0 },
    uploaded_by: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const DocumentAsset =
  mongoose.models.DocumentAsset ??
  mongoose.model<IDocumentAsset>("DocumentAsset", DocumentAssetSchema);
