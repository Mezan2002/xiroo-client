"use client";
import { Package } from "lucide-react";

export default function BundleRulesSection({ bundleRules, setBundleRules }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <Package size={16} className="text-zinc-300" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Bundle & Discount Rules</h3>
      </div>

      <p className="text-[11px] text-gray-400 max-w-lg">
        Configure automatic bundle discounts applied when customers buy multiple items from the same bundle.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Discount Percentage</label>
          <div className="relative group">
            <input
              type="number"
              value={bundleRules.discountPercentage ?? ""}
              onChange={(e) => setBundleRules({ ...bundleRules, discountPercentage: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-10 rounded-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Qty for Discount</label>
          <input
            type="number"
            value={bundleRules.quantityForDiscount ?? ""}
            onChange={(e) => setBundleRules({ ...bundleRules, quantityForDiscount: e.target.value })}
            className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest rounded-none"
          />
          <p className="text-[9px] text-gray-300">Minimum items from same bundle</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Qty for Free Shipping</label>
          <input
            type="number"
            value={bundleRules.quantityForFreeShipping ?? ""}
            onChange={(e) => setBundleRules({ ...bundleRules, quantityForFreeShipping: e.target.value })}
            className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest rounded-none"
          />
          <p className="text-[9px] text-gray-300">Minimum items for auto free shipping</p>
        </div>
      </div>
    </div>
  );
}
