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
  variant = "default"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value);

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
    default: "bg-white border border-zinc-200 hover:border-black text-black",
    black: "bg-black text-white border-black hover:bg-zinc-800",
    ghost: "bg-transparent text-zinc-400 hover:text-black hover:bg-zinc-50 border-transparent",
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full min-w-[160px]">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full h-12 px-5 
          text-[11px] font-bold uppercase tracking-[0.2em]
          transition-all duration-300 rounded-none outline-none
          ${variants[variant]}
          ${className}
        `}
      >
        <div className="flex items-center gap-3 truncate mr-2">
          {selectedOption?.icon && (
            <selectedOption.icon size={14} strokeWidth={1.5} className="shrink-0 opacity-60" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={14} 
          className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-200 rounded-none overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-between w-full px-5 py-3.5
                  text-[10px] font-bold uppercase tracking-[0.2em] text-left
                  transition-colors duration-150
                  ${value === option.value ? "bg-zinc-50 text-black" : "text-zinc-400 hover:bg-zinc-50 hover:text-black"}
                `}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <option.icon size={14} strokeWidth={1.5} />}
                  <span>{option.label}</span>
                </div>
                {value === option.value && <Check size={12} className="text-black" />}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-5 py-8 text-center bg-zinc-50/50">
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">
                  No options available
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
