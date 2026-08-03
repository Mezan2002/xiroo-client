"use client";
import { Plus, X } from "lucide-react";
import ImageField from "./ImageField";

export default function GalleryBlock({ block, onChange }) {
  const images = block.images || [];

  const addImage = () => {
    onChange({ images: [...images, ""] });
  };

  const updateImage = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    onChange({ images: updated });
  };

  const removeImage = (index) => {
    onChange({ images: images.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
          Layout
        </label>
        <div className="flex gap-2">
          {["grid", "carousel"].map((layout) => (
            <button
              key={layout}
              onClick={() => onChange({ layout })}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest border transition-colors ${
                block.layout === layout
                  ? "bg-black text-white border-black"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-black"
              }`}
            >
              {layout}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
          Images ({images.length})
        </label>
        {images.map((img, index) => (
          <div key={index} className="relative border border-zinc-100 p-3">
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 text-zinc-300 hover:text-red-600 transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <ImageField
              value={img}
              onChange={(url) => updateImage(index, url)}
              label={`Image ${index + 1}`}
            />
          </div>
        ))}
        <button
          onClick={addImage}
          className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black border border-dashed border-zinc-200 hover:border-black transition-all w-full justify-center"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Image
        </button>
      </div>
    </div>
  );
}
