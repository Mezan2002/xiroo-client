"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import CategoryTree from "@/components/admin/categories/CategoryTree";
import { Layers } from "lucide-react";

export default function AdminCategories() {
  return (
    <div className="space-y-6">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Categories", active: true }
        ]}
        title="Categories" 
        icon={Layers}
      />
      
      <CategoryTree />
    </div>
  );
}
