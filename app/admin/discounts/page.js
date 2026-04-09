"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Plus, Percent } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDiscounts } from "@/hooks/api/useDiscounts";
import { useToast } from "@/hooks/useToast";

const COLUMNS = [
  { key: "code", label: "Coupon Code", type: "text", mono: true },
  { key: "type", label: "Type", type: "text" },
  { key: "value", label: "Value", type: "text" },
  { key: "usage", label: "Usage", type: "text" },
  { key: "expiry", label: "Expiry", type: "text" },
  { key: "status", label: "Status", type: "status" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

export default function AdminDiscounts() {
  const router = useRouter();
  const { toast } = useToast();
  const { useDiscountsQuery, deleteDiscount } = useDiscounts();
  const { data: response, isLoading } = useDiscountsQuery();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const discounts = (response?.data || []).map((d) => ({
    ...d,
    id: d._id,
    code: d.code,
    type: d.type === "percentage" ? "Percentage" : "Fixed Amount",
    value: d.type === "percentage" ? `${d.value}%` : `৳${d.value}`,
    usage: `${d.usageCount}${d.usageLimit ? ` / ${d.usageLimit}` : ""}`,
    expiry: new Date(d.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: d.isActive && new Date(d.endDate) > new Date() ? "Active" : "Draft",
  }));

  const handleDelete = (row) => {
    setSelectedDiscount(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteDiscount.mutate(selectedDiscount._id || selectedDiscount.id, {
      onSuccess: () => {
        toast.success("Discount deleted successfully.");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to delete discount.");
      },
    });
    setIsDeleteModalOpen(false);
    setSelectedDiscount(null);
  };

  const handleEdit = (row) => {
    router.push(`/admin/discounts/${row._id || row.id}/edit`);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Discounts", active: true },
        ]}
        title="Discounts"
        icon={Percent}
        primaryAction={{
          label: "Create Coupon",
          icon: Plus,
          onClick: () => router.push("/admin/discounts/new"),
        }}
      />

      <DataTable
        columns={COLUMNS}
        data={discounts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Promotional Logic"
        message={`Are you absolutely sure you want to delete the ${selectedDiscount?.code} coupon? This action will permanently remove the promotional rule from the registry.`}
      />
    </div>
  );
}
