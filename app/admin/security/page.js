"use client";
import { Button } from "@/components/ui/Button";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Shield, Key, Webhook, Copy, AlertTriangle, Plus, RotateCcw } from "lucide-react";

export default function AdminSecurity() {
  return (
    <div className="space-y-12 pb-24">
      <ModuleHeader 
        label="System Control" 
        title="Security" 
        icon={Shield}
        primaryAction={{
          label: "Rotate Keys",
          icon: RotateCcw,
          onClick: () => console.log("Rotate Keys"),
          className: "bg-red-600 hover:bg-red-700"
        }}
      />

      <div className="space-y-12">
        {/* API Credentials */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b-2 border-black pb-3 w-fit">
            <Key size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pt-1">
              API Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-8 bg-white border border-gray-100 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  SaaS Access Token
                </label>
                <div className="flex gap-4">
                  <input
                    type="password"
                    readOnly
                    value="sk_xiroo_production_982347dkf9823h89d"
                    className="flex-1 h-12 px-5 bg-gray-50 border border-gray-100 font-mono text-[11px] text-gray-600 outline-none"
                  />
                  <Button
                    variant="outline"
                    className="h-12 border-gray-100 gap-2 px-6 text-[10px] font-bold tracking-widest uppercase"
                  >
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Webhook Signing Secret
                </label>
                <div className="flex gap-4">
                  <input
                    type="password"
                    readOnly
                    value="whsec_8923h89dh89d8923d8923"
                    className="flex-1 h-12 px-5 bg-gray-50 border border-gray-100 font-mono text-[11px] text-gray-600 outline-none"
                  />
                  <Button
                    variant="outline"
                    className="h-12 border-gray-100 gap-2 px-6 text-[10px] font-bold tracking-widest uppercase"
                  >
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Endpoints */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b-2 border-black pb-3 w-fit">
            <Webhook size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pt-1">
              Webhook Endpoints
            </h3>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-tight">
                  Production Order Event
                </div>
                <div className="text-[10px] text-gray-400 font-medium">
                  https://api.xiroo.com/webhooks/orders
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-green-50 text-green-600">
                  Active
                </span>
                <Button
                  variant="ghost"
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                  Configure
                </Button>
              </div>
            </div>

            <Button
              variant="dashed"
              className="w-full h-16 border-2 border-dashed border-gray-100 text-gray-400 hover:border-black hover:text-black transition-all gap-3 uppercase text-[10px] font-bold tracking-widest"
            >
              <Plus size={16} /> Add Endpoint
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-10 border-t border-red-100 space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <AlertTriangle size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] pt-1">
              Danger Zone
            </h3>
          </div>
          <div className="p-8 bg-red-50/30 border border-red-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-tight text-red-900">
                Reset Store Configuration
              </div>
              <div className="text-[10px] text-red-600/60 font-medium">
                This will permanently delete all theme customizer and
                operational logic settings.
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white border-none h-11 px-8 text-[10px] font-bold tracking-widest uppercase">
              Reset Config
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
