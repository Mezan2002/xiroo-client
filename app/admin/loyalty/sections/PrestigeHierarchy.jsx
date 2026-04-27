"use client";
import { Plus, Trash2 } from "lucide-react";

export default function PrestigeHierarchy({ settings, updateTierConfig, addBenefit, removeBenefit, updateBenefit }) {
  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-black" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Prestige Hierarchy</h3>
        </div>
      </div>

      <div className="space-y-16">
        {settings.tierConfig.map((tier, idx) => (
          <div key={tier.tier} className="space-y-8">
            <div className="pb-2 border-b-2 border-black w-fit">
              <p className="text-[12px] font-bold text-black uppercase tracking-[0.2em]">{tier.tier}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-3 space-y-4">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block h-4">Activation Points</label>
                <input
                  type="number" value={tier.minPoints}
                  onChange={(e) => updateTierConfig(idx, "minPoints", Number(e.target.value))}
                  className="w-full h-14 px-6 bg-[#F9F9F9] border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-[14px] font-bold"
                />
              </div>
              <div className="lg:col-span-9 space-y-4">
                <div className="flex items-center justify-between h-4">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Membership Privileges</label>
                  <button onClick={() => addBenefit(idx)} className="p-1.5 hover:bg-black hover:text-white transition-colors border border-gray-100"><Plus size={10} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tier.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 group">
                      <input
                        value={benefit} placeholder="Define privilege..."
                        onChange={(e) => updateBenefit(idx, bIdx, e.target.value)}
                        className="flex-1 h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none text-[12px] font-medium"
                      />
                      <button onClick={() => removeBenefit(idx, bIdx)} className="p-2 lg:opacity-0 lg:group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
