"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DiscountForm from "@/components/admin/discounts/DiscountForm";
import { Percent } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDiscounts } from "@/hooks/api/useDiscounts";
import { useToast } from "@/hooks/useToast";

export default function NewDiscountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createDiscount } = useDiscounts();

  const handleSubmit = (data) => {
    // Map frontend form values to backend schema
    const payload = {
      code: data.code.toUpperCase(),
      type: data.type === "Percentage" ? "percentage" : "fixed",
      value: parseFloat(data.value) || 0,
      minOrderValue: data.minRequirement === "Amount" ? parseFloat(data.minAmount) || 0 : 0,
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || null,
      usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
      isActive: data.status === "Active",
    };

    createDiscount.mutate(payload, {
      onSuccess: () => {
        toast.success("Discount created successfully.");
        router.push("/admin/discounts");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to create discount.");
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Discounts", href: "/admin/discounts" },
          { label: "Draft", active: true },
        ]}
        title="Promotional Drafting"
        icon={Percent}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <DiscountForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={createDiscount.isPending}
        />
      </div>
    </div>
  );
}
