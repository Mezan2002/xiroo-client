import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ProductGallery({ images = [], title, variants, selectedVariants, variantImage }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const displayImages = useMemo(() => {
    const variantImages = [];
    if (variants) {
      for (const v of variants) {
        for (const val of v.values) {
          if (val.image && !images.includes(val.image) && !variantImages.includes(val.image)) {
            variantImages.push(val.image);
          }
        }
      }
    }
    return [...images, ...variantImages];
  }, [images, variants]);

  useEffect(() => {
    if (variantImage) {
      const idx = displayImages.indexOf(variantImage);
      if (idx !== -1) setActiveIndex(idx);
    } else {
      setActiveIndex(0);
    }
  }, [variantImage, displayImages]);

  if (!displayImages || displayImages.length === 0) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollToImage = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const nextImage = () => {
    const nextIdx = (activeIndex + 1) % displayImages.length;
    scrollToImage(nextIdx);
  };

  return (
    <div className="w-full">
      {/* Mobile/Tablet: Interactive Carousel & Thumbnails */}
      <div className="flex lg:hidden flex-col gap-3 w-full">
        {/* Main Feature Carousel - Click to Advance */}
        <div
          className="relative group w-full overflow-hidden bg-[#fafafa] cursor-pointer"
          onClick={nextImage}
        >
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
          >
            {displayImages.map((img, index) => (
              <div
                key={index}
                className="relative w-full shrink-0 snap-center aspect-square overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`${title} - view ${index + 1}`}
                  fill
                  className="object-contain object-center transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Seamless Minimalist Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="flex items-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-gray-200">
            {displayImages.map((img, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => scrollToImage(index)}
                  className={`relative shrink-0 w-16 md:w-20 aspect-square bg-white ${
                    isActive
                      ? "opacity-100 z-10 border-2 border-black"
                      : "opacity-40 border-2 border-transparent grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: Single Main Image + Thumbnail Strip */}
      <div className="hidden lg:flex flex-col gap-4 w-full lg:pb-10">
        {/* Main Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-[#fafafa] rounded-[2px]">
          <Image
            src={displayImages[activeIndex]}
            alt={`${title} - view ${activeIndex + 1}`}
            fill
            className="object-contain object-center transition-opacity duration-300"
            sizes="50vw"
            priority
          />
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {displayImages.map((img, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative shrink-0 w-16 h-16 bg-white transition-all ${
                    isActive
                      ? "opacity-100 border-2 border-black"
                      : "opacity-40 border-2 border-transparent grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
