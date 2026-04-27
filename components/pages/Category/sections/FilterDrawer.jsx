"use client";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import FilterContent from "./FilterContent";

export default function FilterDrawer({
  isOpen,
  onClose,
  filteredCount,
  ...filterProps
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-100 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-[85%] max-w-[340px] bg-white z-101 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full bg-white relative">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.3em]">
              Refine Items
            </h2>
            <button onClick={onClose} className="p-2 -mr-2">
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-24">
            <FilterContent {...filterProps} />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <Button
              variant="primary"
              className="w-full bg-black text-white py-4 text-[11px] font-bold tracking-[0.2em] leading-none"
              onClick={onClose}
            >
              SHOW {filteredCount} RESULTS
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
