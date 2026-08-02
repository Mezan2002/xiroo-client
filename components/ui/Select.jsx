"use client";
import { ChevronDown } from "lucide-react";
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
        className={`flex items-center justify-between gap-2 w-full h-11 px-4 bg-white text-[13px] font-medium outline-none transition-all border ${
          isOpen ? "border-black" : "border-gray-200 hover:border-gray-300"
        } ${selected ? "text-black" : "text-gray-400"} ${className}`}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-sm max-h-56 overflow-y-auto">
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors ${
                  value === opt.value
                    ? "text-black font-medium bg-gray-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                )}
              </button>
            ))}
            {options.length === 0 && (
              <div className="py-8 text-center text-[12px] text-gray-300">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
