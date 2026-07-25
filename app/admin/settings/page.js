"use client";
import React from "react";
import { Settings, Save } from "lucide-react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import StoreIdentitySection from "./sections/StoreIdentitySection";
import OperationalSettings from "./sections/OperationalSettings";
import BundleRulesSection from "./sections/BundleRulesSection";
import LoyaltySection from "./sections/LoyaltySection";
import PoliciesSection from "./sections/PoliciesSection";
import { useAdminSettings } from "./sections/useAdminSettings";

export default function AdminSettings() {
  const s = useAdminSettings();

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700 font-montserrat antialiased select-none">
      <ModuleHeader 
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
    </div>
  );
}
