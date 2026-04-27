"use client";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PhotoLightbox from "./PhotoLightbox";
import Stars from "./Stars";

export default function ReviewModal({ review, onClose, onPrev, onNext }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!review) return null;
  const gallery = (review.images || [review.image]).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-9999 flex items-end md:items-center justify-center p-4 md:p-0"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-full md:max-w-[820px] bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[95vh] md:max-h-[85vh] rounded-2xl md:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cinematic Photo Section */}
        {gallery.length > 0 && (
          <div className="w-full md:w-[320px] lg:w-[400px] shrink-0 bg-[#F7F7F5] flex flex-col border-b md:border-b-0 md:border-r border-gray-100">
            {/* Main Stage */}
            <div
              className="flex-1 relative group cursor-zoom-in overflow-hidden bg-white/50"
              onClick={() => setIsLightboxOpen(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={gallery[activeIndex]}
                  alt="Review focus"
                  fill
                  className="object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[0.98] group-hover:scale-100"
                />
              </div>

              {/* Pagination Label */}
              {gallery.length > 1 && (
                <div className="absolute top-6 left-6 z-10 bg-black/5 backdrop-blur-md px-2.5 py-1 text-[8px] font-bold text-black uppercase tracking-widest border border-black/5">
                  {activeIndex + 1} / {gallery.length} Perspective
                </div>
              )}
            </div>

            {/* Interactive Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="h-20 shrink-0 flex items-center gap-2 px-6 overflow-x-auto scrollbar-hide bg-white border-t border-gray-50">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-12 h-12 shrink-0 border transition-all duration-300 ${
                      i === activeIndex
                        ? "border-black scale-105"
                        : "border-gray-100 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover grayscale-sm hover:grayscale-0"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isLightboxOpen && (
          <PhotoLightbox
            photos={gallery}
            initialIndex={activeIndex}
            onClose={() => setIsLightboxOpen(false)}
          />
        )}
        <div className="flex flex-col flex-1 p-7 overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <Stars count={review.rating} size={14} />
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors p-1 -mt-1 -mr-1 h-auto w-auto"
            >
              <X size={18} />
            </Button>
          </div>
          <h3 className="text-[22px] font-semibold text-black leading-snug mb-4 tracking-tight">
            &ldquo;{review.title}&rdquo;
          </h3>
          <p className="text-[13px] text-gray-500 leading-[1.9] flex-1">
            {review.body}
          </p>
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
            <div className="relative w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-semibold shrink-0 overflow-hidden">
              {review.userImage ? (
                <Image
                  src={review.userImage}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              ) : (
                (review.name || "C").charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-black">
                {review.name}
              </p>
              <p className="text-[11px] text-gray-400">{review.date}</p>
            </div>
            {review.verified && (
              <span className="text-[9px] font-semibold tracking-widest border border-gray-200 text-gray-400 px-2 py-1 uppercase">
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              showHoverIcon={false}
              onClick={onPrev}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-black transition-colors uppercase tracking-wider h-auto px-0 hover:bg-transparent"
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            <Button
              variant="ghost"
              showHoverIcon={false}
              onClick={onNext}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-black transition-colors uppercase tracking-wider h-auto px-0 hover:bg-transparent"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
