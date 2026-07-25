"use client";
import { useState } from "react";
import { MapPin, Truck, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SearchableDistrict from "@/components/ui/SearchableDistrict";

export default function OperationalSettings({ shipping, setShipping, customRates, addCustomRate, removeCustomRate }) {
  const [newDistrict, setNewDistrict] = useState("");
  const [newNormalFee, setNewNormalFee] = useState("");
  const [newFastFee, setNewFastFee] = useState("");

  const handleAddRate = () => {
    if (!newDistrict || !newNormalFee) return;
    addCustomRate({
      district: newDistrict,
      normalFee: Number(newNormalFee),
      fastFee: Number(newFastFee) || Number(newNormalFee) + 50,
      estimatedDays: { normal: "2-3 Days", fast: "24-48 Hours" },
    });
    setNewDistrict("");
    setNewNormalFee("");
    setNewFastFee("");
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Default Rates */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <Truck size={16} className="text-zinc-300" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Default Rates</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Inside Dhaka (Normal)", key: "insideCity" },
            { label: "Inside Dhaka (Fast)", key: "insideFast" },
            { label: "Outside Dhaka (Normal)", key: "outsideCity" },
            { label: "Outside Dhaka (Fast)", key: "outsideFast" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{field.label}</label>
              <div className="relative group">
                <input
                  type="number"
                  value={shipping[field.key] ?? ""}
                  onChange={(e) => setShipping({ ...shipping, [field.key]: e.target.value })}
                  className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-10 rounded-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-xs space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Free Shipping Threshold (0 = disabled)</label>
          <div className="relative group">
            <input
              type="number"
              value={shipping.freeThreshold ?? ""}
              onChange={(e) => setShipping({ ...shipping, freeThreshold: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-10 rounded-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
          </div>
        </div>
      </div>

      {/* Custom District Rates */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <MapPin size={16} className="text-zinc-300" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Custom District Rates</h3>
        </div>

        <p className="text-[11px] text-gray-400 max-w-lg">
          Override default fees for specific districts. Custom rates take priority over default rates when a customer selects that district.
        </p>

        <div className="space-y-3">
          {customRates.map((rate, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-6">
                <span className="text-[12px] font-bold text-black min-w-[120px]">{rate.district}</span>
                <div className="flex gap-6">
                  <span className="text-[11px] text-gray-500">Normal: <strong className="text-black">৳{rate.normalFee}</strong></span>
                  <span className="text-[11px] text-gray-500">Fast: <strong className="text-black">৳{rate.fastFee}</strong></span>
                </div>
              </div>
              <button
                onClick={() => removeCustomRate(rate.district)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row items-end gap-3 p-4 border border-dashed border-gray-200">
            <div className="flex-1 w-full">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">District</label>
              <SearchableDistrict
                value={newDistrict}
                onChange={setNewDistrict}
                placeholder="Select District"
                className="border border-gray-100! h-10!"
              />
            </div>
            <div className="relative w-full sm:w-28">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Normal Fee</label>
              <input
                type="number"
                value={newNormalFee}
                onChange={(e) => setNewNormalFee(e.target.value)}
                placeholder="80"
                className="w-full h-10 px-3 bg-white border border-gray-100 focus:border-black outline-none text-[12px] font-bold pl-7 rounded-none"
              />
              <span className="absolute left-3 top-[34px] -translate-y-1/2 text-[10px] font-bold text-zinc-300">৳</span>
            </div>
            <div className="relative w-full sm:w-28">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Fast Fee</label>
              <input
                type="number"
                value={newFastFee}
                onChange={(e) => setNewFastFee(e.target.value)}
                placeholder="130"
                className="w-full h-10 px-3 bg-white border border-gray-100 focus:border-black outline-none text-[12px] font-bold pl-7 rounded-none"
              />
              <span className="absolute left-3 top-[34px] -translate-y-1/2 text-[10px] font-bold text-zinc-300">৳</span>
            </div>
            <Button
              type="button"
              onClick={handleAddRate}
              disabled={!newDistrict || !newNormalFee}
              className="h-10 px-5 bg-black text-white text-[10px] font-bold uppercase tracking-wider disabled:opacity-30 shrink-0"
            >
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
