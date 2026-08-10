"use client";
import React from "react";
import { DollarSign } from "lucide-react";

export default function BusinessCostsSection({ businessCosts, setBusinessCosts }) {
  return (
    <section className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-zinc-50 flex items-center justify-center text-zinc-400">
          <DollarSign size={18} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">
            Business Costs
          </h3>
          <p className="text-[9px] text-black/30 uppercase tracking-widest mt-1">
            Configure costs for profit calculation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-black/40 uppercase tracking-widest">
            Default Shipping Cost to Business (৳)
          </label>
          <input
            type="number"
            value={businessCosts.defaultShippingCostToBusiness || ""}
            onChange={(e) =>
              setBusinessCosts((prev) => ({
                ...prev,
                defaultShippingCostToBusiness: e.target.value,
              }))
            }
            placeholder="0"
            className="w-full h-11 px-4 bg-[#F9F9F8]/50 border border-[#EDECE9] text-sm font-medium outline-none focus:border-black transition-colors"
          />
          <p className="text-[8px] text-black/30 uppercase tracking-widest">
            Cost you pay to courier per delivery (used in profit calculation)
          </p>
        </div>
      </div>
    </section>
  );
}
