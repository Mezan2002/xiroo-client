"use client";

import { useState } from "react";

/**
 * Senior Dev Component: Accordion
 * A high-fidelity, interactive toggle component.
 * Features smooth CSS Grid transitions and a sophisticated minimalist aesthetic.
 */
export default function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`border-b border-zinc-100 transition-colors duration-500 ${isOpen ? "bg-zinc-50/30" : "bg-transparent hover:bg-zinc-50/10"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left outline-none focus:outline-none group px-2"
      >
        <span
          className={`text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ${isOpen ? "text-black translate-x-1" : "text-zinc-400 group-hover:text-black"}`}
        >
          {title}
        </span>

        <div className="relative w-4 h-4 flex items-center justify-center">
          <div
            className={`absolute w-full h-px bg-black transition-transform duration-500 ease-out ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
          <div
            className={`absolute h-full w-px bg-black transition-transform duration-500 ease-out ${isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pb-8"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden px-2">
          <div className="text-[13px] leading-[1.8] text-gray-400 max-w-[650px] animate-in fade-in slide-in-from-top-2 duration-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
