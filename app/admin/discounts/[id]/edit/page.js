"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DiscountForm from "@/components/admin/discounts/DiscountForm";
import { Percent } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useDiscounts } from "@/hooks/api/useDiscounts";
import { useToast } from "@/hooks/useToast";

export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { useDiscountDetail, updateDiscount } = useDiscounts();
  const { data: response, isLoading } = useDiscountDetail(params.id);

  const discount = response?.data || response;

  // Map backend shape back to form shape
  const initialData = discount
    ? {
        code: discount.code,
        type: discount.type === "percentage" ? "Percentage" : "Fixed Amount",
        value: String(discount.value),
        minRequirement: discount.minOrderValue > 0 ? "Amount" : "None",
        minAmount: discount.minOrderValue ? String(discount.minOrderValue) : "",
        usageLimit: discount.usageLimit ? String(discount.usageLimit) : "",
        startDate: discount.startDate?.slice(0, 10),
        endDate: discount.endDate?.slice(0, 10),
        status: discount.isActive ? "Active" : "Draft",
      }
    : {};

  const handleSubmit = (data) => {
    const payload = {
      code: data.code.toUpperCase(),
      type: data.type === "Percentage" ? "percentage" : "fixed",
      value: parseFloat(data.value) || 0,
      minOrderValue: data.minRequirement === "Amount" ? parseFloat(data.minAmount) || 0 : 0,
      startDate: data.startDate,
      endDate: data.endDate || null,
      usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
      isActive: data.status === "Active",
    };

    updateDiscount.mutate(
      { id: params.id, data: payload },
      {
        onSuccess: () => {
          toast.success("Discount updated successfully.");
          router.push("/admin/discounts");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed to update discount.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <div className="h-10 bg-zinc-100 animate-pulse rounded mb-8" />
        <div className="bg-white border-x border-zinc-100 px-12 py-16">
          <div className="space-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-50 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Discounts", href: "/admin/discounts" },
          { label: discount?.code || "Refine", active: true },
        ]}
        title="Refine Promotional Logic"
        icon={Percent}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <DiscountForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={updateDiscount.isPending}
        />
      </div>
    </div>
  );
}
