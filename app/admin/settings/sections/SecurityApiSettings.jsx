"use client";
import { Key, Webhook, Copy, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SecurityApiSettings() {
  const apiKeys = [
    { label: "SaaS Access Token", value: "sk_xiroo_production_982347dkf9823h89d" },
    { label: "Webhook Signing Secret", value: "whsec_8923h89dh89d8923d8923" }
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
            <Key size={16} className="text-zinc-300" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">API Intelligence Registry</h3>
          </div>
          <div className="space-y-8 bg-white border border-[#EDECE9] p-6 md:p-10 shadow-sm">
            {apiKeys.map((key, idx) => (
              <div key={idx} className="space-y-3">
                <label className="text-[10px] font-bold text-[#37352F40] uppercase tracking-[0.3em]">{key.label}</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="password" readOnly value={key.value} className="flex-1 h-12 px-5 bg-[#F7F7F5] border border-[#EDECE9] font-mono text-[11px] outline-none truncate" />
                  <Button variant="outline" className="h-12 border-[#EDECE9] gap-2 px-6 text-[10px] font-bold uppercase hover:border-black transition-all">
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
            <Webhook size={16} className="text-zinc-300" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Event Stream Configuration</h3>
          </div>
          <div className="space-y-4">
            <div className="p-6 md:p-8 bg-white border border-[#EDECE9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
               <div className="space-y-1 w-full overflow-hidden">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[#37352F]">Production Order Event</div>
                  <div className="text-[10px] text-[#37352F40] font-mono truncate">https://api.xiroo.com/webhooks/orders</div>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase text-green-600">Active</span>
                  </div>
                  <Button variant="ghost" className="text-[10px] font-bold uppercase text-[#37352F40] hover:text-black p-0 h-auto">Configure</Button>
               </div>
            </div>
            <Button variant="dashed" className="w-full h-16 border-2 border-dashed border-[#EDECE9] text-[#37352F40] hover:border-black hover:text-black transition-all gap-3 uppercase text-[10px] font-bold tracking-widest rounded-none">
              <Plus size={16} /> Add Endpoint Terminal
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t border-red-100 space-y-10">
         <div className="flex items-center gap-4 text-red-600">
            <AlertTriangle size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em]">Critical Protocol Override</h3>
         </div>
         <div className="p-10 bg-red-50/30 border border-red-100 flex items-center justify-between group rounded-none relative overflow-hidden">
            <div className="space-y-2 relative z-10">
               <div className="text-[14px] font-bold uppercase tracking-tight text-red-900">Reset Store Configuration</div>
               <div className="text-[11px] text-red-600/60 font-medium max-w-xl leading-relaxed">
                  Executing this protocol will permanently dissociate all theme customizer states and operational logic settings.
               </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white border-none h-14 px-10 text-[11px] font-bold tracking-widest uppercase rounded-none relative z-10">Purge Registry</Button>
         </div>
      </div>
    </div>
  );
}
