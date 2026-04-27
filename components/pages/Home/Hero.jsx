"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    id: 1,
    image: "/images/hero-11.png",
    text1: "RAW",
    text2: "FORM",
    backdrop: "LIVE",
    accent: "rgba(99,102,241,0.15)",
  },
  {
    id: 2,
    image: "/images/hero-22.png",
    text1: "PURE",
    text2: "EDGE",
    backdrop: "YOUR",
    accent: "rgba(249,115,22,0.15)",
  },
  {
    id: 3,
    image: "/images/hero-33.png",
    text1: "NOIR",
    text2: "FLUX",
    backdrop: "DREAM",
    accent: "rgba(16,185,129,0.15)",
  },
];

const Hero = () => {
  const badgeRef = useRef(null);
  const timerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = SLIDES[currentIndex];

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      className="relative w-full h-[55vh] md:h-[70vh] lg:h-[95vh] overflow-hidden font-montserrat bg-grain"
      style={{
        background: "black",
      }}
    >
      {/* ── Background Gradient (Changes with slide) ── */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 30%, ${slide.accent} 0%, #0a0a12 60%, #000000 100%)`,
        }}
      />

      {/* ── XIROO Backdrop (z-10) ── */}
      <div
        key={`backdrop-${currentIndex}`}
        className="absolute inset-x-0 z-10 top-32 flex items-start justify-center leading-none select-none pointer-events-none overflow-hidden animate-in fade-in zoom-in-75 duration-1000"
      >
        <h2 className="font-black uppercase leading-[0.82] tracking-[-0.03em] whitespace-nowrap text-[30vw] text-white/[0.03]">
          {slide.backdrop}
        </h2>
      </div>

      {/* ── Mannequin (z-20) ── */}
      <div
        key={`mannequin-${currentIndex}`}
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-20 duration-1000"
      >
        <div className="relative w-[480px] max-w-[58vw] h-[90%]">
          <Image
            src={slide.image}
            alt="Xiroo Mannequin"
            fill
            priority
            className="object-contain object-bottom"
            draggable={false}
          />
        </div>
      </div>

      {/* ── Background Solid Texts (z-15) ── */}
      <div
        key={`text-solid-${currentIndex}`}
        className="absolute inset-0 z-15 flex items-center justify-center gap-4 lg:gap-12 pointer-events-none overflow-hidden -translate-y-6 lg:-translate-y-10"
      >
        <h3
          className="text-white text-[11vw] font-black italic tracking-tight opacity-0 leading-none"
          style={{
            animation:
              "slide-from-left 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "0.2s",
            textShadow:
              "0 20px 50px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.4)",
          }}
        >
          {slide.text1}
        </h3>
        <h3
          className="text-white text-[11vw] font-black italic tracking-tight opacity-0 leading-none translate-y-12 lg:translate-y-24"
          style={{
            animation:
              "slide-from-right 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "0.2s",
            textShadow:
              "0 20px 50px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.4)",
          }}
        >
          {slide.text2}
        </h3>
      </div>

      {/* ── Foreground Stroke Texts (z-25) ── */}
      <div
        key={`text-stroke-${currentIndex}`}
        className="absolute inset-0 z-25 flex items-center justify-center gap-4 lg:gap-12 pointer-events-none overflow-hidden -translate-y-6 lg:-translate-y-10"
      >
        <h3
          className="text-transparent text-[11vw] font-black italic tracking-tight opacity-0 leading-none"
          style={{
            animation:
              "slide-from-left 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            animationDelay: "0.2s",
            WebkitTextStroke: "1px rgba(255,255,255,0.4)",
          }}
        >
          {slide.text1}
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
          {slide.text2}
        </h3>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="absolute bottom-6 lg:bottom-10 left-0 right-0 px-6 lg:px-14 z-30 flex items-center justify-between">
        {/* CTA — sharp bordered button, bottom-left */}
        <Link
          href="/collections"
          className="group relative flex items-center gap-3 border border-white/20 px-7 py-3 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" />
          <span className="relative text-[9px] font-bold tracking-[0.45em] uppercase text-white group-hover:text-black transition-colors duration-300 delay-75">
            Shop Now
          </span>
          <ArrowRight
            size={9}
            className="relative text-white/40 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 delay-75"
          />
        </Link>

        {/* Arrow navigation — bottom-right */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(
                (currentIndex - 1 + SLIDES.length) % SLIDES.length,
              );
              resetTimer();
            }}
            className="group flex items-center justify-center w-9 h-9 border border-white/15 hover:border-white/50 transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ArrowRight
              size={11}
              className="text-white/40 group-hover:text-white rotate-180 transition-colors duration-300"
            />
          </button>

          <span className="text-[10px] font-bold text-white/30 tracking-widest tabular-nums select-none">
            {String(currentIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;
            {String(SLIDES.length).padStart(2, "0")}
          </span>

          <button
            onClick={() => {
              setCurrentIndex((currentIndex + 1) % SLIDES.length);
              resetTimer();
            }}
            className="group flex items-center justify-center w-9 h-9 border border-white/15 hover:border-white/50 transition-colors duration-300"
            aria-label="Next slide"
          >
            <ArrowRight
              size={11}
              className="text-white/40 group-hover:text-white transition-colors duration-300"
            />
          </button>
        </div>
      </div>

      {/* ── Bottom vignette ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-black/90 to-transparent z-25 pointer-events-none" />
    </section>
  );
};

export default Hero;
