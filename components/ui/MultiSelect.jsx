"use client";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val) => {
    const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val];
    onChange(next);
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 w-full min-h-[44px] px-4 py-2 bg-white text-[13px] font-medium text-left outline-none transition-all border ${
          isOpen ? "border-black" : "border-gray-200 hover:border-gray-300"
        } ${selectedLabels.length ? "text-black" : "text-gray-400"} ${className}`}
      >
        <span className="truncate">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-sm max-h-56 overflow-y-auto">
          <div className="py-1">
            {options.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-left transition-colors ${
                    checked
                      ? "text-black font-medium bg-gray-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${
                      checked ? "bg-black border-black" : "border-gray-300"
                    }`}
                  >
                    {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
            {options.length === 0 && (
              <div className="py-8 text-center text-[12px] text-gray-300">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
