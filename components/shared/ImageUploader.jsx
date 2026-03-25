"use client";

import { useRef, useState } from "react";

/**
 * A highly reusable, UI-agnostic Image Uploader component.
 * Wrap any design inside this component, and clicking it will trigger the upload flow.
 * 
 * @param {Function} onUploadSuccess - Callback triggered with the final secure Cloudinary URL.
 * @param {Function} onUploadError - Callback triggered on failure with the error message.
 * @param {Function} onUploadStart - Callback triggered when the upload initiates.
 * @param {string} className - Optional styling classes for the wrapper container.
 * @param {ReactNode} children - The custom UI you want to attach the uploader to.
 */
export function ImageUploader({ 
  onUploadSuccess, 
  onUploadError, 
  onUploadStart, 
  className = "", 
  children 
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Securely trigger the hidden file input
  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input immediately so the exact same file can be uploaded twice if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      setIsUploading(true);
      if (onUploadStart) onUploadStart();

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary Infrastructure Not Configured. Missing Environment Variables.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to finalize upload to Cloudinary.");
      }

      const secureUrl = data.secure_url;
      
      if (onUploadSuccess) {
        onUploadSuccess(secureUrl);
      }
      
    } catch (error) {
      console.error("[ImageUploader] Upload sequence failed:", error);
      if (onUploadError) {
        onUploadError(error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      onClick={handleClick} 
      className={`relative cursor-pointer overflow-hidden transition-opacity duration-300 ${isUploading ? "opacity-70 pointer-events-none" : "hover:opacity-90"} ${className}`}
    >
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      {/* Developer-provided custom UI */}
      {children}

      {/* Internal High-performance Uploading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
          <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
