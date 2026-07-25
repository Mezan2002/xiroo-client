"use client";
import { Award, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const TIER_COLORS = {
  bronze: "bg-amber-100 text-amber-700 border-amber-200",
  silver: "bg-gray-100 text-gray-600 border-gray-200",
  gold: "bg-yellow-100 text-yellow-700 border-yellow-200",
  platinum: "bg-indigo-100 text-indigo-700 border-indigo-200",
  diamond: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

export default function LoyaltySection({ loyalty, setLoyalty, updateTierConfig }) {
  const addTier = () => {
    setLoyalty((prev) => ({
      ...prev,
      tierConfig: [
        ...prev.tierConfig,
        { tier: "bronze", minPoints: 0, benefits: [] },
      ],
    }));
  };

  const removeTier = (index) => {
    setLoyalty((prev) => ({
      ...prev,
      tierConfig: prev.tierConfig.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <Award size={16} className="text-zinc-300" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Loyalty Program</h3>
      </div>

      {/* Points Config */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Points per ৳100 Spent</label>
          <input
            type="number"
            value={loyalty.pointsPerHundred ?? ""}
            onChange={(e) => setLoyalty({ ...loyalty, pointsPerHundred: e.target.value })}
            className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest rounded-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Points per Order</label>
          <input
            type="number"
            value={loyalty.pointsPerOrder ?? ""}
            onChange={(e) => setLoyalty({ ...loyalty, pointsPerOrder: e.target.value })}
            className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest rounded-none"
          />
        </div>
      </div>

      {/* Tier Config */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tier Thresholds</span>
          <Button
            type="button"
            onClick={addTier}
            className="h-8 px-3 bg-black text-white text-[9px] font-bold uppercase tracking-wider"
          >
            <Plus size={12} className="mr-1" /> Add Tier
          </Button>
        </div>

        <div className="space-y-3">
          {loyalty.tierConfig?.map((tier, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100">
              <select
                value={tier.tier}
                onChange={(e) => updateTierConfig(idx, "tier", e.target.value)}
                className={`h-10 px-3 border text-[11px] font-bold uppercase tracking-wider rounded-none outline-none ${TIER_COLORS[tier.tier] || "bg-white border-gray-200"}`}
              >
                {["bronze", "silver", "gold", "platinum", "diamond"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <div className="relative">
                <input
                  type="number"
                  value={tier.minPoints}
                  onChange={(e) => updateTierConfig(idx, "minPoints", Number(e.target.value))}
                  className="w-28 h-10 px-3 bg-white border border-gray-100 focus:border-black outline-none text-[12px] font-bold pl-7 rounded-none"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-300">pts</span>
              </div>

              <input
                type="text"
                value={tier.benefits?.join(", ") || ""}
                onChange={(e) => updateTierConfig(idx, "benefits", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="Benefits (comma separated)"
                className="flex-1 h-10 px-3 bg-white border border-gray-100 focus:border-black outline-none text-[12px] rounded-none placeholder:text-gray-300"
              />

              <button
                onClick={() => removeTier(idx)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
