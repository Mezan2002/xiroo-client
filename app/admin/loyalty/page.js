"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Info, Save, ShieldCheck } from "lucide-react";
import AccrualStrategy from "./sections/AccrualStrategy";
import PrestigeHierarchy from "./sections/PrestigeHierarchy";
import { useLoyaltyManagement } from "./sections/useLoyaltyManagement";

export default function AdminLoyalty() {
  const { settings, setSettings, isLoading, handleUpdate, updateTierConfig, addBenefit, removeBenefit, updateBenefit, isUpdating } = useLoyaltyManagement();

  if (isLoading) return <div className="h-screen flex items-center justify-center italic text-gray-400">Synchronizing Matrix...</div>;
  if (!settings) return null;

  return (
    <div className="space-y-10 md:space-y-16 pb-24 animate-in fade-in duration-700">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings", href: "/admin/settings" },
          { label: "Loyalty Matrix", active: true },
        ]}
        title="Loyalty Matrix" icon={ShieldCheck}
      />

      <div className="max-w-7xl space-y-12 md:space-y-16">
        <AccrualStrategy settings={settings} setSettings={setSettings} />
        
        <PrestigeHierarchy 
          settings={settings} updateTierConfig={updateTierConfig} 
          addBenefit={addBenefit} removeBenefit={removeBenefit} updateBenefit={updateBenefit} 
        />

        <div className="pt-10 md:pt-16 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-zinc-400 max-w-md">
            <Info size={14} className="shrink-0" />
            <p className="text-[10px] font-medium uppercase tracking-widest italic">Registry changes take effect immediately across all records.</p>
          </div>
          <button
            onClick={handleUpdate} disabled={isUpdating}
            className="w-full md:w-auto h-14 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
          >
            {isUpdating ? "Calibrating..." : <><Save size={14} /> Confirm Matrix Calibration</>}
          </button>
        </div>
      </div>
    </div>
  );
}
