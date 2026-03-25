"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

const MOCK_ORDERS = [
  { id: "#XR-2814", customer: "John Doe", date: "Mar 22, 2024", total: "৳2,450", payment: "COD", status: "Processing" },
  { id: "#XR-2813", customer: "Sarah Smith", date: "Mar 21, 2024", total: "৳12,100", payment: "Paid", status: "Completed" },
  { id: "#XR-2812", customer: "Rahim Ahmed", date: "Mar 20, 2024", total: "৳4,950", payment: "Paid", status: "Active" },
  { id: "#XR-2811", customer: "Zarin Tasnim", date: "Mar 19, 2024", total: "৳1,200", payment: "Paid", status: "Shipped" },
  { id: "#XR-2810", customer: "Farhan Ali", date: "Mar 18, 2024", total: "৳8,500", payment: "Unpaid", status: "Cancelled" },
];

const COLUMNS = [
  { key: "id", label: "Order ID", type: "text", mono: true },
  { key: "customer", label: "Customer", type: "text" },
  { key: "date", label: "Date", type: "text" },
  { key: "total", label: "Total", type: "text" },
  { key: "payment", label: "Payment", type: "status" },
  { key: "status", label: "Status", type: "status" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleView = (row) => {
    const cleanId = row.id.replace("#", "");
    router.push(`/admin/orders/${cleanId}`);
  };

  const handleDelete = (row) => {
    setSelectedOrder(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", active: true }
        ]}
        title="Orders" 
        icon={ShoppingBag}
        primaryAction={{
          label: "New Order",
          icon: Plus,
          onClick: () => router.push("/admin/orders/new")
        }}
      />
      
      <DataTable 
        columns={COLUMNS}
        data={orders}
        onView={handleView}
        onDelete={handleDelete}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Order Entry"
        message={`Are you absolutely sure you want to delete ${selectedOrder?.id}? This action will permanently remove the order record from the registry.`}
      />
    </div>
  );
}
