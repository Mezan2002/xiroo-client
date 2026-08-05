"use client";

import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import Link from "next/link";

export default function BundleCTA() {
  return (
    <section className="w-full bg-black overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative py-20 lg:py-28 px-6 lg:px-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] md:text-[300px] lg:text-[400px] font-mono font-bold text-white/[0.02] leading-none whitespace-nowrap">
              BUNDLE
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5">
              <Package size={12} className="text-white/60" />
              <span className="text-[9px] font-bold tracking-[0.4em] text-white/60 uppercase">
                Mix &amp; Match
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-medium tracking-[0.06em] text-white uppercase max-w-[700px] leading-[1.15]">
              Build Your Own
              <br />
              <span className="text-white/40">Custom Bundle</span>
            </h2>

            {/* Description */}
            <p className="text-sm text-white/40 font-light leading-relaxed max-w-[440px]">
              Pick any 2 or more items and unlock exclusive discounts. The more
              you add, the more you save.
            </p>

            {/* Perks Row */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center">
                  <Percent size={14} className="text-white/60" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white tracking-wider">
                    10% OFF
                  </p>
                  <p className="text-[9px] text-white/30 font-medium uppercase tracking-widest">
                    Buy 2+ items
                  </p>
                </div>
              </div>

              <div className="w-px h-8 bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center">
                  <Truck size={14} className="text-white/60" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white tracking-wider">
                    FREE DELIVERY
                  </p>
                  <p className="text-[9px] text-white/30 font-medium uppercase tracking-widest">
                    Buy 3+ items
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/bundles/create"
              className="group inline-flex items-center gap-3 mt-4 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-all"
            >
              Start Building
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            {/* Subtle hint */}
            <p className="text-[9px] text-white/20 font-medium uppercase tracking-[0.3em] mt-2">
              Mix styles &bull; Mix sizes &bull; Save more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
