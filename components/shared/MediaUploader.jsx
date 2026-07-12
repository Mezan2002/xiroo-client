"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Upload, X, Video, Image as ImageIcon } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};

export function MediaUploader({ type = "video", initialValue = "", onUploadSuccess, onUploadError, onRemove, className = "" }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(initialValue);
  const [previewType, setPreviewType] = useState(type);

  useEffect(() => {
    setPreview(initialValue);
    setPreviewType(type);
  }, [initialValue, type]);

  const acceptString = type === "video"
    ? "video/mp4,video/webm"
    : "image/jpeg,image/png,image/webp,image/gif";

  const isAcceptedType = (file) => {
    if (type === "video") {
      return ACCEPTED_TYPES.video.includes(file.type);
    }
    return ACCEPTED_TYPES.image.includes(file.type);
  };

  const handleFile = async (file) => {
    if (!file) return;

    if (!isAcceptedType(file)) {
      const expected = type === "video" ? "MP4 or WebM video" : "JPEG, PNG, WebP, or GIF image";
      onUploadError?.(`Please upload a ${expected}.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onUploadError?.("File size must be less than 10MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setPreviewType(type);

    setUploading(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary not configured.");
      }

      const endpoint = type === "video"
        ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
        : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed.");
      }

      setPreview(data.secure_url);
      onUploadSuccess?.(data.secure_url);
    } catch (error) {
      console.error("[MediaUploader] Upload failed:", error);
      onUploadError?.(error.message);
      setPreview(initialValue);
      setPreviewType(type);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [type]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removePreview = () => {
    setPreview(null);
    setPreviewType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const acceptLabel = type === "video" ? "MP4, WebM — Max 10MB" : "JPEG, PNG, WebP, GIF — Max 10MB";

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={acceptString}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {previewType === "video" ? (
            <video
              src={preview}
              className="w-full h-48 object-cover"
              controls
              muted
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!uploading && (
            <button
              onClick={removePreview}
              className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all duration-200
            ${dragActive
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full">
                {type === "video" ? (
                  <Video size={20} className="text-gray-500" />
                ) : (
                  <ImageIcon size={20} className="text-gray-500" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drop a {type} here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {acceptLabel}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
