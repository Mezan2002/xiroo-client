import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ id, title, price, image, hoverImage }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = hoverImage ? [image, hoverImage] : [image];
  // Determine variant string locally referencing IDs for demo rendering map
  const hasVariants = parseInt((id || "0").replace(/\D/g, "") || "0") % 2 !== 0;
  const buttonText = hasVariants ? "CHOOSE" : "ADD";
  const hasMultipleImages = images.length > 1;

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
      className="group flex flex-col w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Block wrapper to allow the button to overlap absolutely relative to this box */}
      <div className="relative w-full mb-3">
        {/* Aspect Ratio Box with overflow hidden for images ONLY */}
        <div className="relative w-full aspect-4/5 sm:aspect-square md:aspect-4/5 bg-[#f8f8f8] overflow-hidden">
          <Link
            href={`/product/${id}`}
            className="absolute w-full h-full block"
          >
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`${title} view ${idx + 1}`}
                fill
                className={`object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  idx === currentImageIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-[1.02]"
                }`}
              />
            ))}
          </Link>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center bg-white/50 hover:bg-white rounded-full p-2 backdrop-blur-sm ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                aria-label="Previous image"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center bg-white/50 hover:bg-white rounded-full p-2 backdrop-blur-sm ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                aria-label="Next image"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Floating Cart Button Inside Image Bounds */}
        <button
          className="absolute right-3 bottom-3 md:bottom-4 h-[34px] md:h-[36px] w-max max-w-[34px] md:max-w-[36px] hover:max-w-[128px] overflow-hidden bg-white/60 backdrop-blur-md border-2 border-gray-500/50 rounded-full flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:bg-white/95 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-20 group/btn"
          aria-label="Add to cart"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Added ${id} to cart`);
          }}
        >
          <div className="w-[32px] md:w-[34px] h-full shrink-0 flex items-center justify-center">
            <div className="relative size-[14px] -ml-0.5 md:size-[16px]">
              <Image
                src="/icon/add-to-cart.png"
                alt="Add to cart"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <span className="whitespace-nowrap text-[9px] md:text-[10px] font-bold tracking-[0.14em] text-black pr-4 opacity-0 -translate-x-3 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
            {buttonText}
          </span>
        </button>
      </div>

      {/* Details Area */}
      <div className="flex flex-col pr-12 text-left relative z-10 bg-white pt-1">
        <Link href={`/product/${id}`}>
          <h3 className="text-[10px] md:text-[11px] font-semibold text-[#111] tracking-[0.05em] uppercase leading-[1.4] mb-1 line-clamp-3 group-hover:text-black transition-colors hover:underline underline-offset-4 decoration-1">
            {title}
          </h3>
        </Link>
        <span className="text-[10px] md:text-[11px] text-[#444] font-medium tracking-wide">
          {price}
        </span>
      </div>
    </div>
  );
}
