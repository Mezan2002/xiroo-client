"use client";
import React, { useState } from "react";
import { 
  Save, 
  Truck, 
  CreditCard, 
  Settings, 
  Shield, 
  Key, 
  Webhook, 
  Copy, 
  AlertTriangle, 
  Plus, 
  RotateCcw,
  Zap,
  Activity,
  ChevronRight
} from "lucide-react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("Operational");
  const [shipping, setShipping] = useState({
    freeThreshold: 5000,
    insideCity: 80,
    outsideCity: 120,
    fastDelivery: 50,
  });

  const TABS = ["Operational", "Security & API", "Billing"];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700 font-montserrat antialiased select-none">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings", active: true }
        ]}
        title={`${activeTab} Registry`}
        icon={Settings}
        primaryAction={activeTab === "Security & API" ? {
          label: "Rotate Keys",
          icon: RotateCcw,
          onClick: () => console.log("Rotate Keys"),
          className: "bg-red-600 hover:bg-red-700"
        } : {
          label: "Save Config",
          icon: Save,
          onClick: () => console.log("Save Config")
        }}
      />

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-[#EDECE9]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative ${
              activeTab === tab ? "text-black" : "text-[#37352F40] hover:text-[#37352F80]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black animate-in fade-in slide-in-from-bottom-1 duration-300" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Operational" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Shipping Configurations */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-10">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                <Truck size={16} className="text-zinc-300" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                  Logistics & Delivery
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Free Shipping Threshold</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={shipping.freeThreshold}
                      onChange={(e) => setShipping({ ...shipping, freeThreshold: e.target.value })}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12 rounded-none"
                      placeholder="0 for disabled"
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Fast Delivery Premium</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={shipping.fastDelivery}
                      onChange={(e) => setShipping({ ...shipping, fastDelivery: e.target.value })}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12 rounded-none"
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Inside Hub Rate</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={shipping.insideCity}
                      onChange={(e) => setShipping({ ...shipping, insideCity: e.target.value })}
                      className="w-full h-14 px-6 bg-[#FDFDFB] border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12 rounded-none"
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Outside Hub Rate</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={shipping.outsideCity}
                      onChange={(e) => setShipping({ ...shipping, outsideCity: e.target.value })}
                      className="w-full h-14 px-6 bg-[#FDFDFB] border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12 rounded-none"
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 group-focus-within:text-black">৳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Toggles */}
            <div className="pt-12 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                {[
                  { label: "Guest Authentication", active: true },
                  { label: "Inventory Synchronization", active: false },
                  { label: "Digital Notification (SMS)", active: true },
                  { label: "Platform Maintenance", active: false }
                ].map((toggle, idx) => (
                  <label key={idx} className={`flex items-center justify-between cursor-pointer group ${!toggle.active ? 'opacity-40' : ''}`}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-black transition-colors">{toggle.label}</span>
                    <div className={`w-14 h-7 p-1 relative transition-all rounded-none ring-1 ${toggle.active ? 'bg-black ring-black/10' : 'bg-zinc-200 ring-black/5'}`}>
                      <div className={`w-5 h-5 bg-white absolute transition-all ${toggle.active ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
              <CreditCard size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Transaction Terminals
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-8 bg-[#FDFDFB] border border-gray-100 space-y-8 group transition-all hover:border-black rounded-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-black flex items-center justify-center font-bold text-[11px] text-white tracking-widest">COD</div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-bold uppercase tracking-widest text-black">Cash Registry</span>
                      <span className="text-[9px] font-bold text-green-500 uppercase tracking-[0.2em]">Merchant Verified</span>
                    </div>
                  </div>
                  <button className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-red-500 transition-colors">Deactivate</button>
                </div>
              </div>

              {["BK Terminal", "SSL Terminal"].map((gate, idx) => (
                <div key={idx} className="p-8 bg-white border border-gray-50 flex items-center justify-between opacity-50 grayscale group hover:opacity-100 hover:grayscale-0 transition-all hover:border-zinc-200 rounded-none">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center font-bold text-[11px] text-zinc-400 tracking-widest group-hover:bg-black group-hover:text-white transition-all">
                      {gate.split(' ')[0][0]}{gate.split(' ')[1][0]}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-black">Xiroo {gate}</span>
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Config Pending</span>
                    </div>
                  </div>
                  <Button variant="outline" className="text-[9px] font-bold uppercase tracking-[0.2em] h-10 px-6 rounded-none border-gray-100 group-hover:border-black">Configure</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Security & API" && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* API Registry */}
            <div className="space-y-10">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                <Key size={16} className="text-zinc-300" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">API Intelligence Registry</h3>
              </div>
              
              <div className="space-y-8 bg-white border border-[#EDECE9] p-10 shadow-sm shadow-black/5">
                {[
                  { label: "SaaS Access Token", value: "sk_xiroo_production_982347dkf9823h89d" },
                  { label: "Webhook Signing Secret", value: "whsec_8923h89dh89d8923d8923" }
                ].map((key, idx) => (
                  <div key={idx} className="space-y-3">
                    <label className="text-[10px] font-bold text-[#37352F40] uppercase tracking-[0.3em]">{key.label}</label>
                    <div className="flex gap-4">
                      <input
                        type="password"
                        readOnly
                        value={key.value}
                        className="flex-1 h-12 px-5 bg-[#F7F7F5] border border-[#EDECE9] font-mono text-[11px] text-[#37352F] outline-none rounded-none"
                      />
                      <Button
                        variant="outline"
                        className="h-12 border-[#EDECE9] gap-2 px-6 text-[10px] font-bold tracking-widest uppercase rounded-none hover:border-black transition-all"
                      >
                        <Copy size={14} /> Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook Stream */}
            <div className="space-y-10">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                <Webhook size={16} className="text-zinc-300" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Event Stream Configuration</h3>
              </div>

              <div className="space-y-4">
                <div className="p-8 bg-white border border-[#EDECE9] flex items-center justify-between group shadow-sm shadow-black/5">
                   <div className="space-y-1">
                      <div className="text-[12px] font-bold uppercase tracking-widest text-[#37352F]">Production Order Event</div>
                      <div className="text-[10px] text-[#37352F40] font-mono">https://api.xiroo.com/webhooks/orders</div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Active</span>
                      </div>
                      <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-[#37352F40] hover:text-black">Configure</Button>
                   </div>
                </div>

                <Button
                  variant="dashed"
                  className="w-full h-16 border-2 border-dashed border-[#EDECE9] text-[#37352F40] hover:border-black hover:text-black transition-all gap-3 uppercase text-[10px] font-bold tracking-widest rounded-none"
                >
                  <Plus size={16} /> Add Endpoint Terminal
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone: High Risk Operations */}
          <div className="pt-16 border-t border-red-100 space-y-10">
             <div className="flex items-center gap-4 text-red-600">
                <AlertTriangle size={18} />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em]">Critical Protocol Override</h3>
             </div>
             
             <div className="p-10 bg-red-50/30 border border-red-100 flex items-center justify-between group rounded-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                   <AlertTriangle size={80} />
                </div>
                <div className="space-y-2 relative z-10">
                   <div className="text-[14px] font-bold uppercase tracking-tight text-red-900">Reset Store Configuration</div>
                   <div className="text-[11px] text-red-600/60 font-medium max-w-xl leading-relaxed">
                      Executing this protocol will permanently dissociate all theme customizer states and operational logic settings. This action is recorded in the secure audit path and cannot be reversed.
                   </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white border-none h-14 px-10 text-[11px] font-bold tracking-widest uppercase rounded-none shadow-xl shadow-red-600/10 relative z-10">
                   Purge Registry
                </Button>
             </div>
          </div>
        </div>
      )}

      {activeTab === "Billing" && (
        <div className="py-24 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-[#F7F7F5] flex items-center justify-center mx-auto rounded-none border border-[#EDECE9]">
             <Activity size={24} className="text-[#37352F20]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-[14px] font-bold text-black uppercase tracking-widest">Billing Registry Sync</h3>
            <p className="text-[11px] text-[#37352F40] font-medium tracking-wide">Enterprise billing protocols are currently being synchronized.</p>
          </div>
        </div>
      )}
    </div>
  );
}
