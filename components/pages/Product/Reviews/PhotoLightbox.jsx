"use client";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PhotoLightbox({ photos, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const handlePrev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div
      className="fixed inset-0 z-10000 bg-black/90 backdrop-blur-md flex items-center justify-center pt-24 pb-12 px-6 md:px-12"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        showHoverIcon={false}
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 h-auto w-auto"
      >
        <X size={28} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        showHoverIcon={false}
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
      >
        <ChevronLeft size={24} />
      </Button>
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[index]}
          alt={`Review photo ${index + 1}`}
          fill
          className="object-contain shadow-2xl"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        showHoverIcon={false}
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
      >
        <ChevronRight size={24} />
      </Button>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-[0.3em] uppercase text-white/40">
        {index + 1} <span className="mx-2">/</span> {photos.length}
      </div>
    </div>
  );
}
