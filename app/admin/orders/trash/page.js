"use client";
import React, { useState, useMemo } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Trash2, Loader2, Search, RotateCcw, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";

export default function OrderTrashPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { useTrashedOrders, restoreOrder, permanentDeleteOrder } = useOrders();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 15;

  const queryParams = useMemo(() => ({
    page,
    limit,
    search: searchTerm || undefined,
  }), [page, searchTerm]);

  const { data: response, isLoading: loading } = useTrashedOrders(queryParams);
  const rawOrders = response?.orders || response?.data?.orders || [];
  const pagination = response?.pagination || response?.data?.pagination;

  const isProcessing = restoreOrder.isPending || permanentDeleteOrder.isPending;

  const handleView = (row) => {
    router.push(`/admin/orders/${row._id}`);
  };

  const handleRestore = (row) => {
    setSelectedOrder(row);
    setActionType("restore");
    setIsModalOpen(true);
  };

  const handlePermanentDelete = (row) => {
    setSelectedOrder(row);
    setActionType("permanent-delete");
    setIsModalOpen(true);
  };

  const COLUMNS = useMemo(() => [
    { key: "orderId", label: "Order ID", type: "text", mono: true },
    {
      key: "customerName",
      label: "Customer",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-bold text-zinc-900">{row.customerName}</span>
          <span className="text-[8px] font-black w-fit px-1.5 py-0.5 rounded-none uppercase tracking-[0.15em] border bg-zinc-50 text-zinc-500 border-zinc-100">
            {row.user ? "Registered" : row.createdByAdmin ? "Admin Created" : "Guest"}
          </span>
        </div>
      )
    },
    {
      key: "items",
      label: "Items",
      render: (row) => (
        <span className="text-[12px] font-bold text-zinc-600">
          {row.items?.length || 0} product{row.items?.length !== 1 ? "s" : ""}
        </span>
      )
    },
    { key: "totalPrice", label: "Total", type: "currency" },
    { key: "status", label: "Status", type: "status" },
    {
      key: "deletedAt",
      label: "Trashed",
      render: (row) => (
        <span className="text-[11px] text-zinc-400">
          {row.deletedAt ? new Date(row.deletedAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          }) : "—"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleView(row)}
            className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors"
            title="View Order"
          >
            <ExternalLink size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleRestore(row); }}
            className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors"
            title="Restore Order"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handlePermanentDelete(row); }}
            className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
            title="Permanently Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    },
  ], []);

  const orders = useMemo(() => {
    return rawOrders.map(order => ({
      ...order,
      id: order._id,
      customerName: order.user?.firstName
        ? `${order.user.firstName} ${order.user.lastName || ''}`
        : order.user?.name
          ? order.user.name
          : order.guestInfo?.firstName
            ? `${order.guestInfo.firstName} ${order.guestInfo.lastName || ''}`
            : "N/A",
    }));
  }, [rawOrders]);

  const confirmAction = async () => {
    if (!selectedOrder) return;

    if (actionType === "restore") {
      restoreOrder.mutate(selectedOrder._id, {
        onSuccess: () => {
          toast.success(`Order ${selectedOrder.orderId} restored successfully.`);
          setIsModalOpen(false);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to restore order.");
        }
      });
    } else if (actionType === "permanent-delete") {
      permanentDeleteOrder.mutate(selectedOrder._id, {
        onSuccess: () => {
          toast.success(`Order ${selectedOrder.orderId} permanently deleted.`);
          setIsModalOpen(false);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to permanently delete order.");
        }
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: "Trash", active: true }
        ]}
        title="Order Trash"
        icon={Trash2}
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search Order ID or Customer..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 focus:border-black outline-none text-[13px] font-medium transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] border border-dashed border-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
        </div>
      ) : orders.length === 0 ? (
        <div className="h-[400px] border border-dashed border-gray-100 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-bold text-zinc-900">Trash is empty</p>
            <p className="text-[12px] text-zinc-400 mt-1">Deleted orders will appear here</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={COLUMNS}
          data={orders}
          pagination={pagination ? {
            currentPage: pagination.page,
            totalPages: pagination.pages,
            total: pagination.total,
            limit: pagination.limit,
            onPageChange: setPage,
          } : undefined}
        />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
        onConfirm={confirmAction}
        title={actionType === "restore" ? "Restore Order" : "Permanently Delete Order"}
        message={
          actionType === "restore"
            ? `Restore order ${selectedOrder?.orderId} back to the active orders list?`
            : `Permanently delete order ${selectedOrder?.orderId}? This action cannot be undone.`
        }
        confirmLabel={
          isProcessing
            ? "Processing..."
            : actionType === "restore"
              ? "Restore Order"
              : "Permanently Delete"
        }
        variant={actionType === "restore" ? "default" : "danger"}
      />
    </div>
  );
}
