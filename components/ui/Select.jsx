"use client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 w-full bg-zinc-50 border border-zinc-100 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest outline-none transition-all ${isOpen ? "border-black" : "focus:border-black"} ${selected ? "text-zinc-900" : "text-zinc-400"} ${className}`}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown size={12} strokeWidth={2.5} className={`shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-zinc-200 rounded-lg shadow-xl max-h-60 overflow-auto">
          {options.map((opt) => {
            const isActive = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}`}
              >
                <span>{opt.label}</span>
                {isActive && <Check size={12} strokeWidth={3} className="text-white shrink-0" />}
              </button>
            );
          })}
          {options.length === 0 && (
            <div className="px-4 py-8 text-center text-[10px] text-zinc-300 font-bold uppercase tracking-widest">No options</div>
          )}
        </div>
      )}
    </div>
  );
}
