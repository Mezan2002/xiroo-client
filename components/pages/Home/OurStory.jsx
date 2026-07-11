"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OurStory() {
  return (
    <section className="w-full bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Giant Typography Statement */}
        <div className="relative py-20 lg:py-32 px-6 lg:px-12">
          {/* Huge background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[140px] md:text-[220px] lg:text-[320px] font-mono font-bold text-gray-50 tracking-tight leading-none whitespace-nowrap -ml-20">
              XIROO
            </span>
          </div>

          {/* Content positioned over the giant text */}
          <div className="relative z-10 flex flex-col items-center text-center gap-8">
            <span className="text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase">
              Since 2023 &mdash; Dhaka, Bangladesh
            </span>

            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-medium tracking-[0.08em] text-black uppercase max-w-[600px] leading-[1.2]">
              Not Just a Brand.
              <br />
              A Statement.
            </h2>

            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-[400px]">
              Premium streetwear for those who refuse to blend in.
              Designed in Dhaka, worn with pride.
            </p>

            <Link
              href="/about-us"
              className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:tracking-[0.3em] transition-all group mt-2"
            >
              Discover Our Story
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Bottom row: 3 feature boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-10 lg:p-14 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-black uppercase">
              01 &mdash; Quality
            </span>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Handpicked fabrics. Rigorous testing. Every piece built to last
              longer than trends.
            </p>
          </div>
          <div className="p-10 lg:p-14 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-black uppercase">
              02 &mdash; Design
            </span>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Created for self-expression. Not following the crowd — setting
              the standard.
            </p>
          </div>
          <div className="p-10 lg:p-14 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-black uppercase">
              03 &mdash; Community
            </span>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              More than customers — a movement. Growing together with people
              who value authenticity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
