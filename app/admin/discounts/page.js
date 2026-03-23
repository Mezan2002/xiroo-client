"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { Plus, Percent } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_DISCOUNTS = [
  { id: 1, code: "XIROO20", type: "Percentage", value: "20%", usage: "142", expiry: "Apr 30, 2024", status: "Active" },
  { id: 2, code: "WELCOME500", type: "Fixed Amount", value: "৳500", usage: "89", expiry: "Dec 31, 2024", status: "Active" },
  { id: 3, code: "FLASH_SALE", type: "Automatic", value: "15%", usage: "0", expiry: "Expired", status: "Draft" },
];

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
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const handleDelete = (row) => {
    setSelectedDiscount(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setDiscounts(prev => prev.filter(d => d.id !== selectedDiscount.id));
    setIsDeleteModalOpen(false);
    setSelectedDiscount(null);
  };

  const handleEdit = (row) => {
    router.push(`/admin/discounts/${row.id}/edit`);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Discounts", active: true }
        ]}
        title="Discounts" 
        icon={Percent}
        primaryAction={{
          label: "Create Coupon",
          icon: Plus,
          onClick: () => router.push("/admin/discounts/new")
        }}
      />
      
      <DataTable 
        columns={COLUMNS}
        data={discounts}
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
