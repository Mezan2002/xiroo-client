"use client";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "./Shared";

const MediaManager = ({ product, setProduct }) => {
  return (
    <section>
      <SectionHeader
        label="Block 04"
        title="Visual Documentation"
        action={
          <button
            onClick={() => setProduct((p) => ({ ...p, images: [] }))}
            className="text-[11px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
          >
            Clear All
          </button>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <ImageUploader
          multiple={true}
          onUploadSuccess={(url) =>
            setProduct((p) => ({ ...p, images: [...p.images, url] }))
          }
          className="aspect-square bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center hover:bg-white hover:border-black transition-all group"
        >
          <Plus
            size={24}
            className="text-zinc-300 group-hover:text-black mb-2"
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-black">
            Add Frame
          </span>
        </ImageUploader>

        {product.images?.map((img, idx) => {
          const isMain = idx === 0;
          return (
            <div
              key={idx}
              className={`aspect-square relative group bg-white border transition-all duration-500 overflow-hidden ${isMain ? "border-black ring-4 ring-black/5" : "border-zinc-100"}`}
            >
              <Image
                src={img}
                alt={`Product image ${idx + 1}`}
                fill
                className={`object-cover transition-all duration-700 ${isMain ? "grayscale-0" : "grayscale hover:grayscale-0"}`}
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                {!isMain && (
                  <button
                    onClick={() => {
                      const newImages = [...product.images];
                      const [selected] = newImages.splice(idx, 1);
                      newImages.unshift(selected);
                      setProduct((p) => ({ ...p, images: newImages }));
                    }}
                    className="p-3 bg-white text-black hover:bg-zinc-100 transition-colors shadow-xl"
                    title="Set as Featured"
                  >
                    <Star size={18} />
                  </button>
                )}
                <button
                  onClick={() =>
                    setProduct((p) => ({
                      ...p,
                      images: p.images.filter((_, i) => i !== idx),
                    }))
                  }
                  className="p-3 bg-red-500 text-white hover:bg-red-600 transition-colors shadow-xl"
                  title="Delete Frame"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {isMain && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] z-10">
                  Featured
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MediaManager;
