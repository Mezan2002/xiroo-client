"use client";
import { Shield } from "lucide-react";

export default function PoliciesSection({ policies, setPolicies }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <Shield size={16} className="text-zinc-300" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Store Policies</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Return Window (Days)</label>
          <input
            type="number"
            value={policies.returnWindowDays ?? ""}
            onChange={(e) => setPolicies({ ...policies, returnWindowDays: e.target.value })}
            className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest rounded-none"
          />
          <p className="text-[9px] text-gray-300">Days after delivery to request a return</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Advance Payment Threshold</label>
          <div className="relative group">
            <input
              type="number"
              value={policies.advancePaymentThreshold ?? ""}
              onChange={(e) => setPolicies({ ...policies, advancePaymentThreshold: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-10 rounded-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
          </div>
          <p className="text-[9px] text-gray-300">Orders above this may require advance payment (0 = disabled)</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Advance Payment %</label>
          <div className="relative group">
            <input
              type="number"
              value={policies.advancePaymentPercentage ?? ""}
              onChange={(e) => setPolicies({ ...policies, advancePaymentPercentage: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-10 rounded-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">%</span>
          </div>
          <p className="text-[9px] text-gray-300">Percentage of order total to request</p>
        </div>
      </div>

      <div className="space-y-2 max-w-2xl">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Refund Policy Note</label>
        <textarea
          value={policies.refundPolicy || ""}
          onChange={(e) => setPolicies({ ...policies, refundPolicy: e.target.value })}
          placeholder="Custom refund policy text shown to customers..."
          rows={3}
          className="w-full p-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] resize-none rounded-none placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
