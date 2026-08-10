"use client";
import React from "react";
import { Settings, Save } from "lucide-react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import StoreIdentitySection from "./sections/StoreIdentitySection";
import OperationalSettings from "./sections/OperationalSettings";
import BundleRulesSection from "./sections/BundleRulesSection";
import LoyaltySection from "./sections/LoyaltySection";
import PoliciesSection from "./sections/PoliciesSection";
import BusinessCostsSection from "./sections/BusinessCostsSection";
import { useAdminSettings } from "./sections/useAdminSettings";
import { useToast } from "@/hooks/useToast";

export default function AdminSettings() {
  const { toast } = useToast();
  const s = useAdminSettings({
    onSaveSuccess: () => toast.success("Store settings saved successfully."),
  });

  return (
    <div className="pb-24 animate-in fade-in duration-700 font-montserrat antialiased select-none">
      <ModuleHeader 
        sticky
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings", active: true }
        ]}
        title="Store Settings"
        icon={Settings}
        primaryAction={{
          label: s.isSaving ? "Saving..." : "Save All Settings",
          icon: Save,
          onClick: s.saveAll,
          disabled: s.isSaving
        }}
      />

      <div className="space-y-16 mt-8 md:mt-14">
        <StoreIdentitySection 
          identity={s.identity} setIdentity={s.setIdentity}
          contact={s.contact} setContact={s.setContact}
          social={s.social} setSocial={s.setSocial}
        />

        <OperationalSettings 
          shipping={s.shipping} setShipping={s.setShipping}
          customRates={s.customRates}
          addCustomRate={s.addCustomRate}
          removeCustomRate={s.removeCustomRate}
        />

        <BundleRulesSection 
          bundleRules={s.bundleRules} setBundleRules={s.setBundleRules}
        />

        <LoyaltySection 
          loyalty={s.loyalty} setLoyalty={s.setLoyalty}
          updateTierConfig={s.updateTierConfig}
        />

        <PoliciesSection 
          policies={s.policies} setPolicies={s.setPolicies}
        />

        <BusinessCostsSection 
          businessCosts={s.businessCosts} setBusinessCosts={s.setBusinessCosts}
        />
      </div>
    </div>
  );
}
