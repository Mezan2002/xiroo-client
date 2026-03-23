"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DiscountForm from "@/components/admin/discounts/DiscountForm";
import { Percent } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const MOCK_DISCOUNTS = [
  { id: 1, code: "XIROO20", type: "Percentage", value: "20", usage: "142", expiry: "Apr 30, 2024", status: "Active" },
  { id: 2, code: "WELCOME500", type: "Fixed Amount", value: "500", usage: "89", expiry: "Dec 31, 2024", status: "Active" },
  { id: 3, code: "FLASH_SALE", type: "Percentage", value: "15", usage: "0", expiry: "Expired", status: "Draft" },
];

export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams();
  
  const discount = MOCK_DISCOUNTS.find(d => d.id === parseInt(params.id)) || MOCK_DISCOUNTS[0];

  const handleSubmit = (data) => {
    console.log("Updating Promotional Logic:", data);
    router.push("/admin/discounts");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Discounts", href: "/admin/discounts" },
          { label: discount?.code || "Refine", active: true }
        ]}
        title="Refine Promotional Logic"
        icon={Percent}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <DiscountForm 
          initialData={discount}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
