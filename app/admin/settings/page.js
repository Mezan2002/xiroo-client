"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Save, Truck, CreditCard, Bell, Globe, Settings } from "lucide-react";

export default function AdminSettings() {
  const [shipping, setShipping] = useState({
    freeThreshold: 5000,
    insideCity: 80,
    outsideCity: 120,
    fastDelivery: 50,
  });

  return (
    <div className="space-y-12 pb-24">
      <ModuleHeader 
        label="Operational Logic" 
        title="Settings" 
        icon={Settings}
        primaryAction={{
          label: "Save Config",
          icon: Save,
          onClick: () => console.log("Save Config")
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Configurations */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 border-b-2 border-black pb-3 w-fit">
            <Truck size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pt-1">
              Shipping & Delivery
            </h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Free Shipping Threshold (BDT)</label>
              <input 
                type="number" 
                value={shipping.freeThreshold}
                className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-sm font-semibold tracking-tight"
                placeholder="0 for disabled"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inside City (BDT)</label>
                <input 
                  type="number" 
                  value={shipping.insideCity}
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-sm font-semibold tracking-tight"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Outside City (BDT)</label>
                <input 
                  type="number" 
                  value={shipping.outsideCity}
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-sm font-semibold tracking-tight"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Fast Delivery Extra (BDT)</label>
              <input 
                type="number" 
                value={shipping.fastDelivery}
                className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-sm font-semibold tracking-tight"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 border-b-2 border-black pb-3 w-fit">
            <CreditCard size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pt-1">
              Payment Gateways
            </h3>
          </div>

          <div className="space-y-6">
            <div className="p-6 border border-gray-100 bg-white flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center font-bold text-[10px] tracking-tighter">COD</div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-tight">Cash on Delivery</span>
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Enabled</span>
                </div>
              </div>
              <Button variant="ghost" className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500">Deactivate</Button>
            </div>

            <div className="p-6 border border-gray-100 bg-white flex items-center justify-between opacity-50 grayscale group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center font-bold text-[10px] tracking-tighter">BK</div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-tight">bKash Integration</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Not Configured</span>
                </div>
              </div>
              <Button variant="outline" className="text-[9px] font-bold uppercase tracking-widest">Configure</Button>
            </div>

            <div className="p-6 border border-gray-100 bg-white flex items-center justify-between opacity-50 grayscale group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center font-bold text-[10px] tracking-tighter">SC</div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-tight">SSLCommerz</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Not Configured</span>
                </div>
              </div>
              <Button variant="outline" className="text-[9px] font-bold uppercase tracking-widest">Configure</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Other System Settings Toggles */}
      <div className="flex flex-wrap gap-8 pt-10 border-t border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-12 h-6 bg-black rounded-full p-1 relative transition-colors">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-black">Guest Checkout</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group opacity-40">
          <div className="w-12 h-6 bg-gray-200 rounded-full p-1 relative transition-colors">
            <div className="w-4 h-4 bg-white rounded-full absolute left-1"></div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-black">Inventory Sync</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-12 h-6 bg-black rounded-full p-1 relative transition-colors">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-black">SMS Notifications</span>
        </label>
      </div>
    </div>
  );
}
