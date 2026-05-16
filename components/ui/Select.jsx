"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Premium Select Component
 * @param {Array} options - [{ value, label, icon: Icon }]
 * @param {string} value - Current value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional trigger classes
 */
export function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select Option",
  className = "",
  variant = "default",
  size = "default"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value);

  const checkSpace = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Drop up only if space below is too small AND there's more space above
      if (spaceBelow < 260 && spaceAbove > spaceBelow) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
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
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const variants = {
    default: "bg-white border border-gray-100 hover:border-black text-black",
    black: "bg-black text-white border-black hover:bg-zinc-800",
    ghost: "bg-transparent text-zinc-400 hover:text-black hover:bg-zinc-50 border-gray-100",
  };

  const sizes = {
    default: "h-14 px-6 text-[10px]",
    sm: "h-10 px-4 text-[9px]",
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full
          font-bold uppercase tracking-[0.2em]
          transition-all duration-300 rounded-none outline-none
          border
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
      >
        <div className="flex items-center gap-3 truncate mr-2 text-left">
          {selectedOption?.icon && (
            <selectedOption.icon size={14} strokeWidth={2} className="shrink-0" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={14} 
          className={`shrink-0 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`
          absolute left-0 right-0 z-50 bg-white border border-black animate-in fade-in zoom-in-95 duration-200 rounded-none overflow-hidden shadow-xl
          ${dropUp ? "bottom-full mb-px" : "top-full -mt-px"}
        `}>
          <div className="max-h-60 overflow-y-auto py-0">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-between w-full px-6
                  ${size === 'sm' ? 'py-2.5 text-[9px]' : 'py-4 text-[10px]'}
                  font-bold uppercase tracking-[0.2em] text-left
                  transition-all duration-200 border-b border-gray-50 last:border-none
                  ${value === option.value ? "bg-black text-white" : "text-zinc-400 hover:bg-gray-50 hover:text-black"}
                `}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <option.icon size={12} strokeWidth={2} />}
                  <span>{option.label}</span>
                </div>
                {value === option.value && <Check size={12} className="text-white" />}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-6 py-10 text-center">
                <span className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest">
                  No options registry
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
