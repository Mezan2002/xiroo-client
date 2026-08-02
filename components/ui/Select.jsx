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
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 w-full h-10 px-3.5 bg-zinc-50 rounded-md text-[12px] font-medium outline-none transition-all border ${
          isOpen ? "border-zinc-400" : "border-transparent hover:border-zinc-200"
        } ${selected ? "text-zinc-900" : "text-zinc-400"} ${className}`}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-zinc-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          <div className="p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[12px] transition-colors ${
                  value === opt.value
                    ? "bg-zinc-900 text-white font-medium"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check size={13} strokeWidth={2.5} className="shrink-0" />}
              </button>
            ))}
            {options.length === 0 && (
              <div className="py-8 text-center text-[11px] text-zinc-300">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
