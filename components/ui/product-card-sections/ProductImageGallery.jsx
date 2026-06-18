/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Senior Dev Component: ProductImageGallery
 * Handles the display and transition of images on a ProductCard.
 */
export default function ProductImageGallery({
  id,
  title,
  images,
  currentImageIndex,
  setCurrentImageIndex,
  priority,
  isHovered,
}) {
  // Filter out any empty strings or invalid images
  const validImages = images ? images.filter(img => img && typeof img === 'string' && img.trim() !== '') : [];

  const [hasMultipleImages, setHasMultipleImages] = useState(false);

  useEffect(() => {
    setHasMultipleImages(validImages.length > 1);
  }, [validImages.length]);

  // Automatic image cycling on hover if multiple images exist
  useEffect(() => {
    let interval;
    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
      }, 1500); // Cycle every 1.5s on hover
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, validImages.length, setCurrentImageIndex]);

  if (validImages.length === 0) {
    return (
      <div className="aspect-4/5 w-full bg-zinc-50 flex items-center justify-center">
        <span className="text-[10px] text-zinc-300 uppercase tracking-widest font-medium">
          No Image
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
      {validImages.map((img, index) => (
        <Image
          key={`${id}-img-${index}`}
          src={img}
          alt={`${title} - view ${index + 1}`}
          fill
          className={`object-contain object-center transition-all duration-700 ease-in-out ${
            index === currentImageIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority && index === 0}
        />
      ))}

      {/* Progress Indicators for Gallery */}
      {hasMultipleImages && isHovered && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 px-3 z-20">
          {validImages.map((_, index) => (
            <div
              key={index}
              className={`h-[1.5px] transition-all duration-500 ${
                index === currentImageIndex
                  ? "w-4 bg-black"
                  : "w-1.5 bg-black/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
