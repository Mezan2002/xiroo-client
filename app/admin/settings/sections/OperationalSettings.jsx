"use client";
import { Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OperationalSettings({ shipping, setShipping }) {
  const toggles = [
    { label: "Guest Authentication", active: true },
    { label: "Inventory Synchronization", active: false },
    { label: "Digital Notification (SMS)", active: true },
    { label: "Platform Maintenance", active: false }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-7 space-y-12">
        <div className="space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
            <Truck size={16} className="text-zinc-300" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Logistics & Delivery</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Free Shipping Threshold", key: "freeThreshold" },
              { label: "Fast Delivery Premium", key: "fastDelivery" },
              { label: "Inside Hub Rate", key: "insideCity" },
              { label: "Outside Hub Rate", key: "outsideCity" }
            ].map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{field.label}</label>
                <div className="relative group">
                  <input
                    type="number"
                    value={shipping[field.key]}
                    onChange={(e) => setShipping({ ...shipping, [field.key]: e.target.value })}
                    className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12 rounded-none"
                  />
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {toggles.map((toggle, idx) => (
              <label key={idx} className={`flex items-center justify-between cursor-pointer group ${!toggle.active ? 'opacity-40' : ''}`}>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-black transition-colors">{toggle.label}</span>
                <div className={`w-14 h-7 p-1 relative ring-1 ${toggle.active ? 'bg-black ring-black/10' : 'bg-zinc-200 ring-black/5'}`}>
                  <div className={`w-5 h-5 bg-white absolute transition-all ${toggle.active ? 'right-1' : 'left-1'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-10">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <CreditCard size={16} className="text-zinc-300" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Transaction Terminals</h3>
        </div>
        <div className="space-y-4">
          <div className="p-8 bg-[#FDFDFB] border border-gray-100 flex items-center justify-between hover:border-black transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center font-bold text-[10px] text-white tracking-widest">COD</div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-black">Cash Registry</span>
                <span className="text-[8px] font-bold text-green-500 uppercase tracking-[0.2em]">Merchant Verified</span>
              </div>
            </div>
            <button className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-red-500 transition-colors">Deactivate</button>
          </div>
          {["BK Terminal", "SSL Terminal"].map((gate, idx) => (
            <div key={idx} className="p-8 bg-white border border-gray-50 flex items-center justify-between opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all hover:border-zinc-200">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center font-bold text-[11px] text-zinc-400 tracking-widest group-hover:bg-black group-hover:text-white transition-all">
                  {gate.split(' ')[0][0]}{gate.split(' ')[1][0]}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-black">Xiroo {gate}</span>
                  <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Config Pending</span>
                </div>
              </div>
              <Button variant="outline" className="text-[9px] font-bold uppercase tracking-[0.2em] h-10 px-6 border-gray-100 group-hover:border-black">Configure</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
