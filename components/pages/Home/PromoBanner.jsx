"use client";

import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="relative w-full h-[65vh] min-h-[420px] overflow-hidden font-montserrat">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-image.png"
          alt="Xiroo — Curated Collection"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay — heavy at bottom where text lives */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Content — bottom-left, generous padding */}
      <div className="absolute inset-0 flex flex-col justify-end px-8 pb-12 lg:px-16 lg:pb-16 z-10">
        {/* Label */}
        <span className="text-[8px] font-bold tracking-[0.5em] uppercase text-white/40 mb-5">
          Collection 2025
        </span>

        {/* Headline */}
        <h2
          className="text-white font-bold uppercase tracking-tight leading-[1.05] mb-8"
          style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
        >
          Crafted for
          <br />
          Everyday Luxury.
        </h2>

        {/* Thin rule + CTA in a row */}
        <div className="flex items-center gap-6">
          <div className="w-10 h-px bg-white/20" />
          <Link
            href="/collections"
            className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/70 hover:text-white transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
