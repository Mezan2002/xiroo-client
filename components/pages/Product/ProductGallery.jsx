import Image from "next/image";
import { useRef, useState } from "react";

export default function ProductGallery({ images = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  if (!images || images.length === 0) return null;

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
    const nextIdx = (activeIndex + 1) % images.length;
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
            {images.map((img, index) => (
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
        {images.length > 1 && (
          <div className="flex items-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-gray-200">
            {images.map((img, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => scrollToImage(index)}
                  className={`relative shrink-0 w-16 md:w-20 aspect-square overflow-hidden bg-white ${
                    isActive
                      ? "opacity-100 z-10 border-2"
                      : "opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
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

      {/* Desktop: Editorial Vertical Stack */}
      <div className="hidden lg:flex flex-col gap-6 w-full lg:pb-10">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-full aspect-square overflow-hidden bg-[#fafafa] rounded-[2px] group"
          >
            <Image
              src={img}
              alt={`${title} - view ${index + 1}`}
              fill
              className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)]"
              sizes="60vw"
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
