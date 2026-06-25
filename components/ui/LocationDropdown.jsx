"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";

export default function LocationDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  allowCustom = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [openAbove, setOpenAbove] = useState(false);
  const ref = useRef(null);
  const portalRef = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  const hasExactMatch = options.some(
    (o) => o.toLowerCase() === search.toLowerCase(),
  );
  const showCustomOption = allowCustom && search.trim() && !hasExactMatch;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        portalRef.current &&
        !portalRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setCoords({
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      setOpenAbove(spaceBelow < 320 && rect.top > spaceBelow);
    }
    setIsOpen((v) => !v);
  };

  const selectOption = (opt) => {
    onChange(opt);
    setIsOpen(false);
    setSearch("");
  };

  const useCustomValue = () => {
    const trimmed = search.trim();
    if (trimmed) {
      onChange(trimmed);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        onClick={toggle}
        className={`w-full h-8 flex items-center justify-between cursor-pointer transition-all text-sm font-medium placeholder:text-gray-300 ${value ? "text-black" : "text-gray-300"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            className="fixed z-[9999] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: coords.left,
              width: coords.width,
              ...(openAbove
                ? {
                    bottom:
                      window.innerHeight - (coords.top - window.scrollY) + 4,
                  }
                : { top: coords.bottom - window.scrollY + 4 }),
            }}
          >
            <div className="p-3 border-b border-gray-50 flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-300" />
              <input
                autoFocus
                className="flex-1 outline-none text-sm font-medium uppercase tracking-tighter"
                placeholder={allowCustom ? "search or type custom..." : "search..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && showCustomOption) {
                    e.preventDefault();
                    useCustomValue();
                  }
                }}
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.length > 0 &&
                filtered.map((o) => (
                  <div
                    key={o}
                    onClick={() => selectOption(o)}
                    className={`px-5 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-gray-50 ${value === o ? "bg-gray-50 text-black border-l-2 border-black" : "text-gray-500"}`}
                  >
                    {o}
                  </div>
                ))}
              {showCustomOption && (
                <div
                  onClick={useCustomValue}
                  className="px-5 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-gray-50 text-black border-t border-gray-100 flex items-center gap-2"
                >
                  <span className="text-gray-400">Use</span>
                  <span className="font-semibold">&quot;{search.trim()}&quot;</span>
                  <span className="text-gray-400">as custom value</span>
                </div>
              )}
              {filtered.length === 0 && !showCustomOption && (
                <div className="px-5 py-8 text-[11px] font-bold uppercase tracking-widest text-center text-gray-300">
                  No results
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
