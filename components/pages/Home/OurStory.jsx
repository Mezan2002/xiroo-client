"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OurStory() {
  return (
    <section className="w-full bg-[#F7F7F5] overflow-hidden">
      <div className="max-w-400 mx-auto">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-150 lg:min-h-175">
          {/* Left: Big Statement */}
          <div className="lg:col-span-7 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20">
            {/* Background watermark */}
            <div className="absolute top-8 left-8 sm:top-12 sm:left-12 lg:top-16 lg:left-16 pointer-events-none select-none">
              <span className="text-[80px] sm:text-[100px] lg:text-[140px] font-mono font-bold text-black/3 leading-none">
                01
              </span>
            </div>

            <div className="relative z-10 pt-12 sm:pt-16 lg:pt-20">
              <span className="text-sm font-semibold tracking-widest text-gray-500 uppercase block mb-6">
                Since 2026 &mdash; Dhaka, Bangladesh
              </span>

              <h2 className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.02em] text-black uppercase leading-[0.95] max-w-125">
                Not Just
                <br />
                a Brand.
                <br />
                <span className="text-gray-500 text-5xl">A Statement.</span>
              </h2>
            </div>

            <div className="relative z-10 mt-12 lg:mt-0">
              <p className="text-sm sm:text-[15px] text-gray-400 font-light leading-relaxed max-w-95 mb-8">
                Premium streetwear for those who refuse to blend in. Designed in
                Dhaka, worn with pride.
              </p>

              <Link
                href="/about-us"
                className="group inline-flex items-center gap-4"
              >
                <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black group-hover:tracking-[0.25em] transition-all">
                  Discover Our Story
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Values Stack */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-gray-200/60">
            <div className="flex flex-col h-full divide-y divide-gray-200/60">
              {/* Value 01 */}
              <div className="group flex-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative overflow-hidden hover:bg-white/60 transition-colors duration-500">
                <div className="absolute top-6 right-8 pointer-events-none select-none">
                  <span className="text-[60px] sm:text-[80px] font-mono font-bold text-black/3 leading-none">
                    01
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-gray-300 uppercase mb-4 block">
                  Quality
                </span>
                <h3 className="font-mono text-lg sm:text-xl font-medium text-black tracking-wide uppercase mb-3">
                  Built to Last
                </h3>
                <p className="text-[13px] text-gray-400 font-light leading-relaxed max-w-75">
                  Handpicked fabrics. Rigorous testing. Every piece crafted to
                  outlast trends, not just follow them.
                </p>
              </div>

              {/* Value 02 */}
              <div className="group flex-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative overflow-hidden hover:bg-white/60 transition-colors duration-500">
                <div className="absolute top-6 right-8 pointer-events-none select-none">
                  <span className="text-[60px] sm:text-[80px] font-mono font-bold text-black/3 leading-none">
                    02
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-gray-300 uppercase mb-4 block">
                  Design
                </span>
                <h3 className="font-mono text-lg sm:text-xl font-medium text-black tracking-wide uppercase mb-3">
                  Set the Standard
                </h3>
                <p className="text-[13px] text-gray-400 font-light leading-relaxed max-w-75">
                  Created for self-expression. Not following the crowd &mdash;
                  defining what comes next.
                </p>
              </div>

              {/* Value 03 */}
              <div className="group flex-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative overflow-hidden hover:bg-white/60 transition-colors duration-500">
                <div className="absolute top-6 right-8 pointer-events-none select-none">
                  <span className="text-[60px] sm:text-[80px] font-mono font-bold text-black/3 leading-none">
                    03
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-gray-300 uppercase mb-4 block">
                  Community
                </span>
                <h3 className="font-mono text-lg sm:text-xl font-medium text-black tracking-wide uppercase mb-3">
                  A Movement
                </h3>
                <p className="text-[13px] text-gray-400 font-light leading-relaxed max-w-75">
                  More than customers &mdash; a growing tribe of people who
                  value authenticity over everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
