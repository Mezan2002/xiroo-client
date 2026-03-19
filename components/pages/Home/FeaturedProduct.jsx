import { ArrowLeft, ArrowRight, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function FeaturedProduct() {
  return (
    <section className="w-full flex flex-col lg:flex-row min-h-screen lg:min-h-[400px] border-t border-gray-100">
      {/* Left Side: Studio Product Image */}
      <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-[95vh] bg-[#e5e5e5]">
        <Image
          src="/images/featured-product-main.png"
          alt="Xiroo Minimalist LED String Cap Lamp"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Right Side: Product Details & Lifestyle Gallery */}
      <div className="w-full lg:w-1/2 bg-[#f5f5f5] p-6 lg:p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-[500px] flex flex-col">
          {/* Header: Title and Pricing */}
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-[10px] md:text-[11px] font-semibold text-[#555] uppercase max-w-[80%] leading-relaxed">
              XIROO™ MINIMALIST LED STRING CAP LAMP
            </h2>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-gray-800 tracking-wide text-[10px] md:text-xs">
                $58.50
              </span>
              <span className="text-gray-400 line-through tracking-wide text-[10px] md:text-xs">
                $73.43
              </span>
            </div>
          </div>

          {/* Gallery Image Container */}
          <div className="relative w-full aspect-square lg:aspect-5/4 bg-[#ececec] overflow-hidden shadow-sm group">
            <Image
              src="/images/featured-product-main.png"
              alt="Product lifestyle view"
              fill
              className="object-cover object-center"
            />

            {/* Subtle Gallery Arrows */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label="Previous image"
            >
              <ArrowLeft strokeWidth={1} size={24} />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label="Next image"
            >
              <ArrowRight strokeWidth={1} size={24} />
            </button>

            {/* Quick Add to Cart Button */}
            <button
              className="absolute right-4 bottom-4 lg:right-6 lg:bottom-6 w-11 h-11 lg:w-[48px] lg:h-[48px] bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all group/btn"
              aria-label="Add to cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag
                  strokeWidth={1.5}
                  size={18}
                  className="text-black group-hover/btn:scale-110 transition-transform"
                />
                {/* Overlapping plus icon */}
                <div className="absolute -bottom-1 -right-[4px] bg-white rounded-full flex items-center justify-center border-[1.5px] border-white">
                  <Plus strokeWidth={3} size={10} className="text-black" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
