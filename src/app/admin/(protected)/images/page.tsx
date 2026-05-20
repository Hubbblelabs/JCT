"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, Loader2, Pencil, Check, X } from "lucide-react";

interface ImageAsset {
  _id: string;
  filename: string;
  url: string;
  alt_text: string;
  category: string;
  institution: string;
  file_size: number;
  created_at: string;
}

interface EditState {
  id: string;
  filename: string;
  alt_text: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/images");
    if (r.ok) setImages(await r.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "other");
      fd.append("institution", "all");
      await fetch("/api/admin/images/upload", { method: "POST", body: fd });
    }

    await load();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const del = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
    await load();
  };

  const openEdit = (img: ImageAsset) => {
    setEditState({
      id: img._id,
      filename: img.filename,
      alt_text: img.alt_text,
    });
  };

  const saveEdit = async () => {
    if (!editState) return;
    setSavingEdit(true);
    await fetch(`/api/admin/images/${editState.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: editState.filename,
        alt_text: editState.alt_text,
      }),
    });
    setSavingEdit(false);
    setEditState(null);
    await load();
  };

  const fmt = (bytes: number) =>
    bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Image Assets</h1>
            <p className="admin-page-subtitle">{images.length} images stored</p>
          </div>
          <div>
            <input
              type="file"
              ref={fileRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="admin-btn admin-btn-primary"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? "Uploading…" : "Upload Images"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : images.length === 0 ? (
          <div className="admin-card py-16 text-center">
            <Upload size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img) => (
              <div
                key={img._id}
                className="admin-card group relative overflow-hidden p-2"
              >
                <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-gray-100">
                  {/* Use regular img tag to avoid Next.js domain restrictions for R2 URLs */}
                  <img
                    src={img.url}
                    alt={img.alt_text || img.filename}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-1 right-1 hidden gap-1 group-hover:flex">
                    <button
                      onClick={() => openEdit(img)}
                      className="admin-btn admin-btn-outline admin-btn-sm bg-white"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => del(img._id)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                <p
                  className="truncate text-xs font-medium text-gray-700"
                  title={img.filename}
                >
                  {img.filename}
                </p>
                <p className="text-xs text-gray-400">{fmt(img.file_size)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Edit Image</h2>
              <button
                onClick={() => setEditState(null)}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="admin-label">File Name</label>
                <input
                  className="admin-input"
                  value={editState.filename}
                  onChange={(e) =>
                    setEditState({ ...editState, filename: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="admin-label">Alt Text</label>
                <input
                  className="admin-input"
                  value={editState.alt_text}
                  onChange={(e) =>
                    setEditState({ ...editState, alt_text: e.target.value })
                  }
                  placeholder="Describe this image"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setEditState(null)}
                className="admin-btn admin-btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="admin-btn admin-btn-gold"
              >
                {savingEdit ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {savingEdit ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
