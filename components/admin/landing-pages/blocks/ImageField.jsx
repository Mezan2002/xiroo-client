"use client";
import { useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Upload, X, ImageIcon } from "lucide-react";

export default function ImageField({ value, onChange, label = "Image" }) {
  const [error, setError] = useState(null);

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
        {label}
      </label>

      {value ? (
        <div className="relative border border-zinc-200 group">
          <img
            src={value}
            alt=""
            className="w-full h-40 object-cover"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-white/90 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <ImageUploader
          onUploadSuccess={(url) => {
            setError(null);
            onChange(url);
          }}
          onUploadError={(msg) => setError(msg)}
        >
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-zinc-200 hover:border-black transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center mb-3">
              <Upload className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Click to upload
            </p>
            <p className="text-[10px] text-zinc-300 mt-1">PNG, JPG, WebP</p>
          </div>
        </ImageUploader>
      )}

      {error && (
        <p className="text-[10px] text-red-500">{error}</p>
      )}

      {/* Manual URL fallback */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 block mb-1">
          Or paste URL
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 text-[12px] font-mono bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
        />
      </div>
    </div>
  );
}
