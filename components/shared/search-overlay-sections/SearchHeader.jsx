"use client";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";

export default function SearchHeader({ query, setQuery, inputRef, onClose }) {
  return (
    <div className="flex items-center gap-2 md:gap-4 px-4 md:px-8 py-4 md:py-6 border-b border-gray-100">
      <Search className="w-5 h-5 text-gray-400 stroke-[1.5] shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-1 bg-transparent text-[16px] md:text-[20px] font-light text-gray-800 placeholder:text-gray-300 outline-none min-w-0"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="p-1 text-gray-300 hover:text-black transition-colors"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      )}
      <Button
        variant="ghost"
        size="icon"
        showHoverIcon={false}
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-black transition-colors shrink-0"
      >
        <X className="w-6 h-6 stroke-[1.5]" />
      </Button>
    </div>
  );
}
