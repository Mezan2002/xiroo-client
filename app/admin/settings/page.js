"use client";
import React from "react";
import { Settings, Save, RotateCcw } from "lucide-react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import OperationalSettings from "./sections/OperationalSettings";
import SecurityApiSettings from "./sections/SecurityApiSettings";
import BillingSettings from "./sections/BillingSettings";
import { useAdminSettings } from "./sections/useAdminSettings";

export default function AdminSettings() {
  const { activeTab, setActiveTab, shipping, setShipping, TABS } = useAdminSettings();

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

      <div className="flex items-center gap-6 md:gap-8 border-b border-[#EDECE9] overflow-x-auto no-scrollbar scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] md:tracking-[0.3em] transition-all relative whitespace-nowrap shrink-0 ${
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

      {activeTab === "Operational" && <OperationalSettings shipping={shipping} setShipping={setShipping} />}
      {activeTab === "Security & API" && <SecurityApiSettings />}
      {activeTab === "Billing" && <BillingSettings />}
    </div>
  );
}
