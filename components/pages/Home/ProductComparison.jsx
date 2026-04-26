"use client";

import { ChevronsLeftRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductComparison() {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <section className="w-full h-[75vh] min-h-[600px] flex flex-col lg:flex-row mt-12 lg:mt-24 border-t border-gray-100">
      {/* Left Side: Typography */}
      <div className="w-full lg:w-[55%] h-[40%] lg:h-full flex flex-col justify-center items-center px-6 lg:px-12 bg-white">
        <div className="flex flex-col items-center max-w-[500px] text-center">
          <h2 className="text-[32px] sm:text-4xl md:text-5xl lg:text-[54px] font-light leading-[1.15] mb-8 lg:mb-12 tracking-wide text-[#111] uppercase">
            TAKE A LOOK AT OUR FABRIC QUALITIES
          </h2>
          <Link
            href="/collections"
            className="text-[10px] md:text-[11px] font-medium text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-colors"
          >
            SHOP NOW
          </Link>
        </div>
      </div>

      {/* Right Side: Interactive Image Comparison Slider */}
      <div className="w-full lg:w-[45%] h-[60%] lg:h-full relative overflow-hidden select-none bg-gray-100">
        {/* Background Image (Dark Variant) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/mannequin-2.png"
            alt="Dark Variant Product View"
            fill
            className="object-cover object-center pointer-events-none"
          />
        </div>

        {/* Foreground Image (Light Variant) - Clipped dynamically by the slider state */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src="/images/mannequin.png"
            alt="Light Variant Product View"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Visual Slider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-20 flex items-center justify-center drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]"
          style={{ left: `calc(${sliderPosition}% - 1px)` }}
        >
          {/* Circular Drag Handle */}
          <div className="size-8 p-2 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] flex items-center justify-center">
            <ChevronsLeftRight size={20} className="text-gray-500" />
          </div>
        </div>

        {/* Hidden Interactive Range Slider (Highest Z-index) */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0"
          aria-label="Image comparison slider"
        />
      </div>
    </section>
  );
}
