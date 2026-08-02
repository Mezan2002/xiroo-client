"use client";
import React, { useState, useMemo } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Select } from "@/components/ui/Select";
import { Plus, ShoppingBag, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";

export default function AdminOrders() {
  const router = useRouter();
  const { toast } = useToast();
  const { useOrderHistory, deleteOrder } = useOrders();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const limit = 15;

  const queryParams = useMemo(() => ({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  }), [page, searchTerm, statusFilter]);

  const { data: response, isLoading: loading } = useOrderHistory(queryParams);
  const rawOrders = response?.orders || response?.data?.orders || [];
  const pagination = response?.pagination || response?.data?.pagination;

  const confirming = deleteOrder.isPending;

  const COLUMNS = useMemo(() => [
    { key: "orderId", label: "Order ID", type: "text", mono: true },
    {
      key: "customerName",
      label: "Customer",
      render: (row) => {
        const isUser = !!row.user;
        const isAdminCreated = !!row.createdByAdmin;
        const isAdminUser = row.user?.role === 'admin';
        return (
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-bold text-zinc-900">{row.customerName}</span>
            <span className={`text-[8px] font-black w-fit px-1.5 py-0.5 rounded-none uppercase tracking-[0.15em] border ${
              isAdminUser ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              isUser ? 'bg-blue-50 text-blue-700 border-blue-100' :
              isAdminCreated ? 'bg-violet-50 text-violet-700 border-violet-100' :
              'bg-zinc-50 text-zinc-500 border-zinc-100'
            }`}>
              {isAdminUser ? 'Admin' :
               isUser ? 'Regular' :
               isAdminCreated ? 'Admin Created' :
               'Guest'}
            </span>
          </div>
        );
      }
    },
    {
      key: "deliveryMethod",
      label: "Delivery",
      render: (row) => (
        <span className={`text-[10px] font-bold uppercase tracking-widest ${
          row.deliveryMethod?.toLowerCase().includes('fast') ? 'text-orange-600' : 'text-zinc-500'
        }`}>
          {row.deliveryMethod || 'Standard'}
        </span>
      )
    },
    { key: "createdAt", label: "Date", type: "date" },
    { key: "totalPrice", label: "Total", type: "currency" },
    { key: "status", label: "Status", type: "status" },
    { key: "actions", label: "Actions", type: "actions", align: "right" },
  ], []);

  const orders = useMemo(() => {
    let filtered = rawOrders.map(order => ({
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

    if (deliveryFilter !== "all") {
      filtered = filtered.filter(o => {
        if (deliveryFilter === "fast") return o.deliveryMethod?.toLowerCase().includes("fast");
        return !o.deliveryMethod?.toLowerCase().includes("fast");
      });
    }

    return filtered;
  }, [rawOrders, deliveryFilter]);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
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
          label: "Create Order",
          icon: Plus,
          onClick: () => router.push("/admin/orders/new")
        }}
      />

      {/* Filter Bar */}
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
        <div className="flex gap-4">
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              placeholder="All Status"
              options={[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
                { value: "returned", label: "Returned" },
                { value: "failed", label: "Failed" },
              ]}
            />
          </div>
          <div className="w-40">
            <Select
              value={deliveryFilter}
              onChange={(val) => { setDeliveryFilter(val); setPage(1); }}
              placeholder="All Delivery"
              options={[
                { value: "all", label: "All Delivery" },
                { value: "regular", label: "Regular" },
                { value: "fast", label: "Fast Delivery" },
              ]}
            />
          </div>
        </div>
      </div>

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
