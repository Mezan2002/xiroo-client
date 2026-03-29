"use client";
import React, { useState, useEffect, useCallback } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Plus, ShoppingBag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";
import { useMemo } from "react";

const COLUMNS = [
  { key: "orderId", label: "Order ID", type: "text", mono: true },
  { key: "customerName", label: "Customer", type: "text" },
  { key: "createdAt", label: "Date", type: "date" },
  { key: "totalPrice", label: "Total", type: "currency" },
  { key: "status", label: "Status", type: "status" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

export default function AdminOrders() {
  const router = useRouter();
  const { toast } = useToast();
  const { useOrderHistory, deleteOrder } = useOrders();
  const { data: rawOrders = [], isLoading: loading, refetch } = useOrderHistory();


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const confirming = deleteOrder.isPending;

  const orders = useMemo(() => {
    return rawOrders.map(order => ({
      ...order,
      id: order._id,
      customerName: order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ''}` : order.user?.name || "N/A",
    }));
  }, [rawOrders]);

  const handleView = (row) => {
    router.push(`/admin/orders/${row._id}`);
  };

  const handleDelete = (row) => {
    setSelectedOrder(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    deleteOrder.mutate(selectedOrder._id, {
      onSuccess: () => {
        toast.success(`Protocol: Order ${selectedOrder.orderId} permanently excised.`);
        setIsDeleteModalOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Deletion protocol failed.");
      }
    });
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
          label: "Refresh",
          icon: Loader2,
          onClick: () => refetch()
        }}
      />

      
      {loading ? (
        <div className="h-[400px] border border-dashed border-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
        </div>
      ) : (
        <DataTable 
          columns={COLUMNS}
          data={orders}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => !confirming && setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Permanently Delete Order Registry"
        message={`Notice: Order record ${selectedOrder?.orderId} will be permanently removed from the database. This action is irreversible and will impact financial history.`}
        confirmLabel={confirming ? "Processing..." : "Confirm Deletion"}
        variant="danger"
      />
    </div>
  );
}
