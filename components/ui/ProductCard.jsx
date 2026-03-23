"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({
  id,
  title,
  price,
  image,
  hoverImage,
  showRemove = false,
  onRemove = null,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = hoverImage ? [image, hoverImage] : [image];
  const hasVariants = parseInt((id || "0").replace(/\D/g, "") || "0") % 2 !== 0;
  const buttonText = hasVariants ? "CHOOSE" : "ADD";
  const hasMultipleImages = images.length > 1;

  // Format price to use BDT symbol if it currently uses $
  const formattedPrice =
    typeof price === "string" ? price.replace("$", "৳") : `৳${price}`;

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="group flex flex-col w-full relative font-montserrat"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Block wrapper */}
      <div className="relative w-full mb-4 overflow-hidden bg-white border border-zinc-100 group-hover:border-zinc-200 transition-colors duration-500">
        {/* Status Badge (Minimal Editorial) */}
        {!showRemove && (
          <div className="absolute top-0 left-0 z-30 px-2 py-1 bg-white border-r border-b border-zinc-100">
            <p className="text-[8px] font-bold tracking-[0.2em] text-black uppercase">
              NEW
            </p>
          </div>
        )}

        {/* Aspect Ratio Box Image ONLY */}
        <div className="relative w-full aspect-4/5 sm:aspect-square md:aspect-4/5 overflow-hidden">
          <Link
            href={`/product/${id}`}
            className="absolute w-full h-full block"
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="absolute inset-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                <Image
                  src={img}
                  alt={`${title} view ${idx + 1}`}
                  fill
                  className={`object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    idx === currentImageIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-[1.02]"
                  }`}
                />
              </div>
            ))}
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
          </Link>

          {/* Navigation Arrows (Premium Minimalist) */}
          {hasMultipleImages && (
            <>
              <Button
                variant="white"
                size="icon"
                showHoverIcon={false}
                onClick={prevImage}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 size-8 md:size-10 rounded-none border-none bg-white/40 hover:bg-white/80 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isHovered
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-black stroke-[1.2]" />
              </Button>
              <Button
                variant="white"
                size="icon"
                showHoverIcon={false}
                onClick={nextImage}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 size-8 md:size-10 rounded-none border-none bg-white/40 hover:bg-white/80 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isHovered
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2"
                }`}
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-black stroke-[1.2]" />
              </Button>
            </>
          )}

          {showRemove ? (
            <Button
              variant="white"
              size="icon"
              showHoverIcon={false}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove?.(id);
              }}
              className="absolute right-0 top-0 z-20 size-8 md:size-10 rounded-none bg-white hover:bg-red-50 text-zinc-400 hover:text-red-500 border-l border-b border-zinc-100 transition-all duration-300"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4 stroke-[1.2]" />
            </Button>
          ) : (
            /* Minimalist Wishlist Button */
            <button
              className={`absolute right-3 top-3 z-20 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
              aria-label="Save to wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Saved ${id} to wishlist`);
              }}
            >
              <Heart className="w-4 h-4 text-black stroke-[1.2] hover:fill-black transition-all" />
            </button>
          )}
        </div>

        {/* Integrated Quick Add Bar */}
        <button
          className={`absolute bottom-0 left-0 right-0 h-10 md:h-12 bg-black text-white text-[9px] md:text-[10px] font-bold tracking-[0.2em] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-30 uppercase ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Added ${id} to cart`);
          }}
        >
          {buttonText} TO CART
        </button>
      </div>

      {/* Details Area (Editorial Layout) */}
      <div className="flex flex-col text-left relative z-10">
        <Link href={`/product/${id}`} className="group/title">
          <h3 className="text-[10px] md:text-[11px] font-medium text-black tracking-[0.12em] uppercase leading-[1.6] mb-1 line-clamp-2 transition-colors duration-300 group-hover/title:text-zinc-500">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 mt-1">
          <span className="text-[10px] md:text-[11px] text-black font-semibold tracking-wider">
            {formattedPrice}
          </span>
          <span className="text-[8px] text-zinc-400 font-medium tracking-[0.15em] uppercase">
            Limited
          </span>
        </div>
      </div>
    </div>
  );
}
