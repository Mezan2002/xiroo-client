"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DiscountForm from "@/components/admin/discounts/DiscountForm";
import { Percent } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewDiscountPage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    console.log("Registering Promotional Logic:", data);
    router.push("/admin/discounts");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Discounts", href: "/admin/discounts" },
          { label: "Draft", active: true }
        ]}
        title="Promotional Drafting"
        icon={Percent}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <DiscountForm 
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
