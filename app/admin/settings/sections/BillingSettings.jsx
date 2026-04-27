"use client";
import { Activity } from "lucide-react";

export default function BillingSettings() {
  return (
    <div className="py-24 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-16 h-16 bg-[#F7F7F5] flex items-center justify-center mx-auto rounded-none border border-[#EDECE9]">
         <Activity size={24} className="text-[#37352F20]" />
      </div>
      <div className="space-y-2">
        <h3 className="text-[14px] font-bold text-black uppercase tracking-widest">Billing Registry Sync</h3>
        <p className="text-[11px] text-[#37352F40] font-medium tracking-wide">Enterprise billing protocols are currently being synchronized.</p>
      </div>
    </div>
  );
}
