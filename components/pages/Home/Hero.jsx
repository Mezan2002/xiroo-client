"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const Hero = () => {
  const badgeRef = useRef(null);

  useEffect(() => {
    let frame;
    let angle = 0;
    const spin = () => {
      angle += 0.025;
      if (badgeRef.current)
        badgeRef.current.style.transform = `rotate(${angle}deg)`;
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className="relative w-full h-[70vh] lg:h-[95vh] overflow-hidden font-montserrat"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% 30%, #1a1a2e 0%, #0a0a12 60%, #000000 100%)",
      }}
    >
      {/* ── Ambient glow behind mannequin ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 55% at 50% 60%, rgba(99,102,241,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── XIROO Backdrop (z-10) ── */}
      <div className="absolute inset-x-0 z-10 top-32 flex items-start justify-center leading-none select-none pointer-events-none overflow-hidden">
        <h2 className="font-black uppercase leading-[0.82] tracking-[-0.03em] whitespace-nowrap text-[30vw] text-black/40">
          XIROO
        </h2>
      </div>

      {/* ── Mannequin (z-20) ── */}
      <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none">
        <div className="relative w-[480px] max-w-[58vw] h-[90%]">
          <Image
            src="/images/mannequin-2.png"
            alt="Xiroo Mannequin"
            fill
            priority
            className="object-contain object-bottom"
            draggable={false}
          />
        </div>
      </div>

      {/* ── Background Solid Texts (z-15) ── */}
      <div className="absolute inset-0 z-15 flex items-center justify-center gap-4 lg:gap-12 pointer-events-none overflow-hidden -translate-y-6 lg:-translate-y-10">
        <h3
          className="text-white text-[11vw] font-black italic tracking-tight opacity-0 leading-none"
          style={{
            animation:
              "slide-from-left 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "0.2s",
            textShadow:
              "0 20px 50px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.4), 0 0 100px rgba(99,102,241,0.1)",
          }}
        >
          STREET
        </h3>
        <h3
          className="text-white text-[11vw] font-black italic tracking-tight opacity-0 leading-none translate-y-12 lg:translate-y-24"
          style={{
            animation:
              "slide-from-right 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "0.2s",
            textShadow:
              "0 20px 50px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.4), 0 0 100px rgba(99,102,241,0.1)",
          }}
        >
          LUXURY
        </h3>
      </div>

      {/* ── Foreground Stroke Texts (z-25) ── */}
      <div className="absolute inset-0 z-25 flex items-center justify-center gap-4 lg:gap-12 pointer-events-none overflow-hidden -translate-y-6 lg:-translate-y-10">
        <h3
          className="text-transparent text-[11vw] font-black italic tracking-tight opacity-0 leading-none"
          style={{
            animation:
              "slide-from-left 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "0.2s",
            WebkitTextStroke: "1px rgba(255,255,255,0.4)",
          }}
        >
          STREET
        </h3>
        <h3
          className="text-transparent text-[11vw] font-black italic tracking-tight opacity-0 leading-none translate-y-12 lg:translate-y-24"
          style={{
            animation:
              "slide-from-right 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "0.2s",
            WebkitTextStroke: "1px rgba(255,255,255,0.4)",
          }}
        >
          LUXURY
        </h3>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="absolute bottom-6 lg:bottom-10 left-0 right-0 px-6 lg:px-14 z-30 flex items-center justify-center">
        {/* Center CTA */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/collections"
            className="group flex items-center gap-3 px-8 py-4 border border-white/15 hover:border-white/40 transition-all duration-300 rounded-full"
          >
            <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.35em] uppercase text-white">
              Shop Collection
            </span>
            <ArrowRight
              size={12}
              className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </Link>
        </div>
      </div>

      {/* ── Bottom vignette ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-black/90 to-transparent z-25 pointer-events-none" />
    </section>
  );
};

export default Hero;
