"use client";

export default function CategoryGuidelines() {
  return (
    <div className="pt-8 border-t border-[#EDECE9]">
      <h4 className="text-[10px] font-bold text-[#91918E] uppercase tracking-[0.2em] mb-4">
        Hierarchical Protocols
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <p className="text-[12px] font-bold text-[#37352F]">Drag Interactions</p>
          <p className="text-[11px] text-[#91918E] leading-relaxed">
            Drag vertically to reorder. Shift an item <span className="text-black font-semibold">right</span> during drag to nest it as a sub-category. Shift <span className="text-black font-semibold">left</span> to unnest.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[12px] font-bold text-[#37352F]">Double-Click to Edit</p>
          <p className="text-[11px] text-[#91918E] leading-relaxed">
            Double-click any category name to initiate rapid renaming. Press Enter to save or Escape to discard.
          </p>
        </div>
      </div>
    </div>
  );
}
