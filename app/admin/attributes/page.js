"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import AttributeList from "@/components/admin/attributes/AttributeList";
import { Layers } from "lucide-react";

export default function AttributesPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Global Attributes", active: true }
        ]}
        title="Product Attributes" 
        icon={Layers}
      />

      <div className="grid grid-cols-1 gap-12 items-start">
        <AttributeList />
      </div>
    </div>
  );
}
