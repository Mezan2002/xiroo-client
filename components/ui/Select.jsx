/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select",
  className = "",
  variant = "default",
  size = "default",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);

  const checkSpace = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < 260 && spaceAbove > spaceBelow);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkSpace();
      window.addEventListener("scroll", checkSpace, true);
      window.addEventListener("resize", checkSpace);
    }
    return () => {
      window.removeEventListener("scroll", checkSpace, true);
      window.removeEventListener("resize", checkSpace);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const variants = {
    default: "bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700",
    black: "bg-zinc-900 text-white border border-zinc-900 hover:bg-zinc-800",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent",
  };

  const sizes = {
    default: "h-12 px-4 text-[12px]",
    sm: "h-10 px-4 text-[12px]",
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2 w-full
          font-semibold
          transition-all duration-150 rounded-lg outline-none
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
      >
        <div className="flex items-center gap-2 truncate text-left">
          {selectedOption?.icon && (
            <selectedOption.icon size={13} strokeWidth={2} className="shrink-0 text-zinc-400" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={12}
          strokeWidth={2.5}
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute left-0 right-0 z-50 bg-white rounded-xl
            border border-zinc-200/80
            shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1),0_2px_6px_-2px_rgba(0,0,0,0.06)]
            animate-in fade-in zoom-in-95 duration-150
            overflow-hidden
            ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}
          `}
        >
          <div className="max-h-72 overflow-y-auto p-2">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg
                    text-[12px]
                    font-medium text-left transition-colors duration-100
                    ${isSelected
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }
                  `}
                >
                  {option.icon && (
                    <option.icon
                      size={14}
                      strokeWidth={2}
                      className={`shrink-0 ${isSelected ? "text-zinc-400" : "text-zinc-300"}`}
                    />
                  )}
                  <span className="flex-1">{option.label}</span>
                  {isSelected && <Check size={13} strokeWidth={2.5} className="text-white shrink-0" />}
                </button>
              );
            })}
            {options.length === 0 && (
              <div className="px-3 py-8 text-center">
                <span className="text-[10px] font-medium text-zinc-300">No options</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
